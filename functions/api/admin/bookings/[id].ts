import { getAuthenticatedAdmin } from '../../../lib/adminSession';
import { json } from '../../../lib/booking';

type FunctionContext = {
  request: Request;
  env: Env;
  params: { id?: string };
};

const transitions: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['cancelled', 'completed', 'no-show'],
  cancelled: [],
  completed: [],
  'no-show': [],
};

export const onRequestPatch = async ({ request, env, params }: FunctionContext): Promise<Response> => {
  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return json({ error: 'Unauthorized.' }, 401);

  const bookingId = params.id?.trim();
  if (!bookingId) return json({ error: 'Booking ID is required.' }, 400);

  let body: { status?: unknown; note?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const nextStatus = typeof body.status === 'string' ? body.status : '';
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 1_000) : null;
  const current = await env.DB.prepare('SELECT status FROM bookings WHERE id = ?').bind(bookingId).first<{ status: string }>();

  if (!current) return json({ error: 'Booking not found.' }, 404);
  if (!transitions[current.status]?.includes(nextStatus)) {
    return json({ error: 'This booking status transition is not allowed.' }, 409);
  }

  const now = new Date().toISOString();
  const timestampColumn = nextStatus === 'confirmed'
    ? 'confirmed_at'
    : nextStatus === 'cancelled'
      ? 'cancelled_at'
      : nextStatus === 'completed'
        ? 'completed_at'
        : null;
  const timestampSql = timestampColumn ? `, ${timestampColumn} = ?` : '';
  const bindings = timestampColumn
    ? [nextStatus, note, now, now, bookingId]
    : [nextStatus, note, now, bookingId];

  await env.DB.prepare(
    `UPDATE bookings SET status = ?, admin_note = ?, updated_at = ?${timestampSql} WHERE id = ?`,
  ).bind(...bindings).run();

  await env.DB.prepare(
    `INSERT INTO admin_audit_logs (id, admin_id, action, target_type, target_id, change_summary)
     VALUES (?, ?, 'booking.status_changed', 'booking', ?, ?)`,
  ).bind(crypto.randomUUID(), admin.id, bookingId, `${current.status} -> ${nextStatus}`).run();

  return json({ id: bookingId, status: nextStatus, note }, 200);
};