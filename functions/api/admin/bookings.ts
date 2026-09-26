import { getAuthenticatedAdmin } from '../../lib/adminSession';
import { json } from '../../lib/booking';

type FunctionContext = {
  request: Request;
  env: Env;
};

type BookingRow = {
  id: string;
  game_id: string;
  game_title: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  booking_date: string;
  booking_time: string;
  player_count: number;
  total_price_krw: number;
  status: string;
  customer_data_json: string;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
};

const toBooking = (row: BookingRow) => ({
  id: row.id,
  gameId: row.game_id,
  gameTitle: row.game_title,
  userName: row.customer_name,
  userPhone: row.customer_phone,
  userEmail: row.customer_email ?? undefined,
  date: row.booking_date,
  time: row.booking_time,
  players: row.player_count,
  totalPrice: row.total_price_krw,
  status: row.status,
  customData: JSON.parse(row.customer_data_json || '{}') as Record<string, string>,
  createdAt: row.created_at,
  adminNote: row.admin_note ?? undefined,
});

export const onRequestGet = async ({ request, env }: FunctionContext): Promise<Response> => {
  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return json({ error: 'Unauthorized.' }, 401);

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const allowedStatuses = new Set(['pending', 'confirmed', 'cancelled', 'completed', 'no-show']);
  const query = status && allowedStatuses.has(status)
    ? `SELECT bookings.*, games.title AS game_title
       FROM bookings INNER JOIN games ON games.id = bookings.game_id
       WHERE bookings.status = ? ORDER BY bookings.booking_date, bookings.booking_time, bookings.created_at DESC LIMIT 200`
    : `SELECT bookings.*, games.title AS game_title
       FROM bookings INNER JOIN games ON games.id = bookings.game_id
       ORDER BY bookings.booking_date, bookings.booking_time, bookings.created_at DESC LIMIT 200`;
  const result = status && allowedStatuses.has(status)
    ? await env.DB.prepare(query).bind(status).all<BookingRow>()
    : await env.DB.prepare(query).all<BookingRow>();

  return json({ bookings: result.results.map(toBooking) });
};