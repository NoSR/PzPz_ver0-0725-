import {
  BookingSettings,
  GameRecord,
  isDateTimePastLeadTime,
  isDateWithinBookingWindow,
  isValidDate,
  isValidTime,
  json,
  normalizeKoreanPhone,
  ScheduleRule,
  slotsForRule,
  weekdayForDate,
} from '../../lib/booking';

type FunctionContext = {
  request: Request;
  env: Env;
};

type BookingRequest = {
  gameId?: unknown;
  date?: unknown;
  time?: unknown;
  playerCount?: unknown;
  customerName?: unknown;
  customerPhone?: unknown;
  customerEmail?: unknown;
  customerData?: unknown;
};

const isPlainStringRecord = (value: unknown): value is Record<string, string> =>
  typeof value === 'object'
  && value !== null
  && !Array.isArray(value)
  && Object.values(value).every((item) => typeof item === 'string');

export const onRequestPost = async ({ request, env }: FunctionContext): Promise<Response> => {
  let body: BookingRequest;

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const gameId = typeof body.gameId === 'string' ? body.gameId.trim() : '';
  const date = typeof body.date === 'string' ? body.date.trim() : '';
  const time = typeof body.time === 'string' ? body.time.trim() : '';
  const playerCount = typeof body.playerCount === 'number' ? body.playerCount : 0;
  const customerName = typeof body.customerName === 'string' ? body.customerName.trim() : '';
  const customerPhone = typeof body.customerPhone === 'string' ? normalizeKoreanPhone(body.customerPhone) : null;
  const customerEmail = typeof body.customerEmail === 'string' ? body.customerEmail.trim().toLowerCase() : '';
  const customerData = isPlainStringRecord(body.customerData) ? body.customerData : {};

  if (!gameId || !isValidDate(date) || !isValidTime(time) || !Number.isInteger(playerCount) || !customerName || !customerPhone) {
    return json({ error: 'Please check the required booking details.' }, 400);
  }

  if (customerName.length > 100 || customerEmail.length > 254 || (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail))) {
    return json({ error: 'Please check the customer details.' }, 400);
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

  if (!isDateWithinBookingWindow(date, settings) || isDateTimePastLeadTime(date, time, settings)) {
    return json({ error: 'This time is outside the booking window.' }, 400);
  }

  if (playerCount < game.min_players || playerCount > game.max_players) {
    return json({ error: `This game accepts ${game.min_players} to ${game.max_players} players.` }, 400);
  }

  const [rule, blackout, fields] = await Promise.all([
    env.DB.prepare(
      `SELECT opening_time, closing_time, slot_interval_minutes
       FROM game_schedule_rules WHERE game_id = ? AND weekday = ? AND is_enabled = 1`,
    ).bind(gameId, weekdayForDate(date)).first<ScheduleRule>(),
    env.DB.prepare('SELECT id FROM game_blackouts WHERE game_id = ? AND blackout_date = ?')
      .bind(gameId, date)
      .first<{ id: string }>(),
    env.DB.prepare('SELECT field_key FROM booking_fields WHERE is_enabled = 1').all<{ field_key: string }>(),
  ]);

  if (!rule || !slotsForRule(rule).includes(time) || blackout) {
    return json({ error: 'This time slot is not available.' }, 400);
  }

  const allowedFields = new Set(fields.results.map((field) => field.field_key));
  const filteredCustomerData = Object.fromEntries(
    Object.entries(customerData)
      .filter(([key, value]) => allowedFields.has(key) && value.length <= 1_000),
  );
  const bookingId = `bk-${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`;
  const createdAt = new Date().toISOString();
  const totalPrice = playerCount * game.price_per_person_krw;

  try {
    await env.DB.prepare(
      `INSERT INTO bookings (
        id, game_id, customer_name, customer_phone, customer_email, booking_date, booking_time,
        player_count, total_price_krw, status, customer_data_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
    )
      .bind(
        bookingId,
        game.id,
        customerName,
        customerPhone,
        customerEmail || null,
        date,
        time,
        playerCount,
        totalPrice,
        JSON.stringify(filteredCustomerData),
        createdAt,
        createdAt,
      )
      .run();
  } catch (error) {
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return json({ error: 'This time slot was just reserved. Please choose another time.' }, 409);
    }

    throw error;
  }

  return json({
    bookingId,
    status: 'pending',
    gameTitle: game.title,
    date,
    time,
    playerCount,
    totalPrice,
    message: settings.customer_completion_message,
  }, 201);
};