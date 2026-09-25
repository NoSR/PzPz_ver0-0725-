import {
  BookingSettings,
  GameRecord,
  isDateWithinBookingWindow,
  isValidDate,
  json,
  ScheduleRule,
  slotsForRule,
  weekdayForDate,
} from '../../lib/booking';

type FunctionContext = {
  request: Request;
  env: Env;
};

export const onRequestGet = async ({ request, env }: FunctionContext): Promise<Response> => {
  const url = new URL(request.url);
  const gameId = url.searchParams.get('gameId')?.trim() ?? '';
  const date = url.searchParams.get('date')?.trim() ?? '';

  if (!gameId || !isValidDate(date)) {
    return json({ error: 'A game ID and a valid date are required.' }, 400);
  }

  const [game, settings] = await Promise.all([
    env.DB.prepare(
      `SELECT id, title, min_players, max_players, price_per_person_krw
       FROM games WHERE id = ? AND is_enabled = 1`,
    ).bind(gameId).first<GameRecord>(),
    env.DB.prepare(
      `SELECT timezone, booking_min_lead_minutes, booking_max_days_ahead, customer_completion_message
       FROM booking_settings WHERE id = 1`,
    ).first<BookingSettings>(),
  ]);

  if (!game) {
    return json({ error: 'This game is not available.' }, 404);
  }

  if (!settings) {
    return json({ error: 'Booking is not configured yet.' }, 503);
  }

  if (!isDateWithinBookingWindow(date, settings)) {
    return json({ error: 'This date is outside the booking window.' }, 400);
  }

  const [rule, blackout, activeBookings] = await Promise.all([
    env.DB.prepare(
      `SELECT opening_time, closing_time, slot_interval_minutes
       FROM game_schedule_rules WHERE game_id = ? AND weekday = ? AND is_enabled = 1`,
    ).bind(gameId, weekdayForDate(date)).first<ScheduleRule>(),
    env.DB.prepare('SELECT reason FROM game_blackouts WHERE game_id = ? AND blackout_date = ?')
      .bind(gameId, date)
      .first<{ reason: string | null }>(),
    env.DB.prepare(
      `SELECT booking_time FROM bookings
       WHERE game_id = ? AND booking_date = ? AND status IN ('pending', 'confirmed')`,
    ).bind(gameId, date).all<{ booking_time: string }>(),
  ]);

  const bookedTimes = new Set(activeBookings.results.map((booking) => booking.booking_time));
  const slots = (rule ? slotsForRule(rule) : []).map((time) => ({
    time,
    available: !blackout && !bookedTimes.has(time),
    reason: blackout ? 'closed' : bookedTimes.has(time) ? 'reserved' : null,
  }));

  return json({
    gameId: game.id,
    date,
    timezone: settings.timezone,
    game: {
      title: game.title,
      minPlayers: game.min_players,
      maxPlayers: game.max_players,
      pricePerPerson: game.price_per_person_krw,
    },
    slots,
  });
};