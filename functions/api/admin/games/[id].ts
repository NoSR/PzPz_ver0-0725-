import { getAuthenticatedAdmin } from '../../../lib/adminSession';
import { json } from '../../../lib/booking';
import { gameFields, GameRow, toGame } from '../../../lib/gameCatalog';

type FunctionContext = { request: Request; env: Env; params: { id?: string } };

export const onRequestPatch = async ({ request, env, params }: FunctionContext): Promise<Response> => {
  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return json({ error: 'Unauthorized.' }, 401);
  const id = params.id?.trim();
  if (!id) return json({ error: 'Game ID is required.' }, 400);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }

  const allowed: Record<string, string> = {
    title: 'title', subtitle: 'subtitle', summary: 'summary', description: 'description',
    difficulty: 'difficulty', minPlayers: 'min_players', maxPlayers: 'max_players',
    playTimeMinutes: 'play_time_minutes', pricePerPerson: 'price_per_person_krw', image: 'image_url',
    category: 'category', landingHtml: 'landing_content',
  };
  const updates: string[] = [];
  const values: unknown[] = [];
  for (const [key, column] of Object.entries(allowed)) {
    if (key in body) { updates.push(`${column} = ?`); values.push(body[key]); }
  }
  if ('tags' in body) { updates.push('tags_json = ?'); values.push(JSON.stringify(Array.isArray(body.tags) ? body.tags : [])); }
  if ('highlightBadges' in body) { updates.push('highlight_badges_json = ?'); values.push(JSON.stringify(Array.isArray(body.highlightBadges) ? body.highlightBadges : [])); }
  if ('isFeatured' in body) { updates.push('is_featured = ?'); values.push(body.isFeatured === true ? 1 : 0); }
  if ('enabled' in body) { updates.push('is_enabled = ?'); values.push(body.enabled === true ? 1 : 0); }
  if (!updates.length) return json({ error: 'No changes supplied.' }, 400);
  updates.push('updated_at = CURRENT_TIMESTAMP');
  values.push(id);
  await env.DB.prepare(`UPDATE games SET ${updates.join(', ')} WHERE id = ?`).bind(...values).run();
  const game = await env.DB.prepare(`SELECT ${gameFields} FROM games WHERE id = ?`).bind(id).first<GameRow>();
  if (!game) return json({ error: 'Game not found.' }, 404);
  await env.DB.prepare(
    `INSERT INTO admin_audit_logs (id, admin_id, action, target_type, target_id, change_summary)
     VALUES (?, ?, 'game.updated', 'game', ?, 'Game updated')`,
  ).bind(crypto.randomUUID(), admin.id, id).run();
  return json({ game: toGame(game) });
};

export const onRequestDelete = async ({ request, env, params }: FunctionContext): Promise<Response> => {
  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return json({ error: 'Unauthorized.' }, 401);
  const id = params.id?.trim();
  if (!id) return json({ error: 'Game ID is required.' }, 400);
  const result = await env.DB.prepare('UPDATE games SET is_enabled = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(id).run();
  if (!result.meta.changes) return json({ error: 'Game not found.' }, 404);
  await env.DB.prepare(
    `INSERT INTO admin_audit_logs (id, admin_id, action, target_type, target_id, change_summary)
     VALUES (?, ?, 'game.disabled', 'game', ?, 'Game disabled')`,
  ).bind(crypto.randomUUID(), admin.id, id).run();
  return json({ ok: true });
};