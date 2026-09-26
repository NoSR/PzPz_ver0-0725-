import { getAuthenticatedAdmin } from '../../lib/adminSession';
import { json } from '../../lib/booking';
import { gameFields, GameRow, toGame } from '../../lib/gameCatalog';

type FunctionContext = { request: Request; env: Env };

type GameInput = Partial<{
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  difficulty: number;
  minPlayers: number;
  maxPlayers: number;
  playTimeMinutes: number;
  pricePerPerson: number;
  image: string;
  tags: string[];
  category: string;
  isFeatured: boolean;
  landingHtml: string;
  highlightBadges: string[];
}>;

const validate = (body: GameInput) => {
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  const minPlayers = Number(body.minPlayers);
  const maxPlayers = Number(body.maxPlayers);
  const difficulty = Number(body.difficulty);
  const playTimeMinutes = Number(body.playTimeMinutes);
  const pricePerPerson = Number(body.pricePerPerson);

  if (!title || title.length > 120 || !Number.isInteger(minPlayers) || !Number.isInteger(maxPlayers)
    || minPlayers < 1 || maxPlayers < minPlayers || maxPlayers > 30
    || !Number.isInteger(difficulty) || difficulty < 1 || difficulty > 5
    || !Number.isInteger(playTimeMinutes) || playTimeMinutes < 1 || playTimeMinutes > 600
    || !Number.isInteger(pricePerPerson) || pricePerPerson < 0) {
    return null;
  }

  return {
    title,
    subtitle: typeof body.subtitle === 'string' ? body.subtitle.trim().slice(0, 240) : '',
    summary: typeof body.summary === 'string' ? body.summary.trim().slice(0, 1_000) : '',
    description: typeof body.description === 'string' ? body.description.trim().slice(0, 10_000) : '',
    difficulty,
    minPlayers,
    maxPlayers,
    playTimeMinutes,
    pricePerPerson,
    image: typeof body.image === 'string' ? body.image.trim().slice(0, 2_000) : '',
    tags: Array.isArray(body.tags) ? body.tags.filter((tag): tag is string => typeof tag === 'string').slice(0, 20) : [],
    category: typeof body.category === 'string' ? body.category.trim().slice(0, 100) : '',
    isFeatured: body.isFeatured === true,
    landingHtml: typeof body.landingHtml === 'string' ? body.landingHtml.slice(0, 20_000) : '',
    highlightBadges: Array.isArray(body.highlightBadges)
      ? body.highlightBadges.filter((badge): badge is string => typeof badge === 'string').slice(0, 10)
      : [],
  };
};

export const onRequestGet = async ({ request, env }: FunctionContext): Promise<Response> => {
  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return json({ error: 'Unauthorized.' }, 401);
  const result = await env.DB.prepare(`SELECT ${gameFields} FROM games ORDER BY display_order, created_at`).all<GameRow>();
  return json({ games: result.results.map(toGame) });
};

export const onRequestPost = async ({ request, env }: FunctionContext): Promise<Response> => {
  const admin = await getAuthenticatedAdmin(request, env);
  if (!admin) return json({ error: 'Unauthorized.' }, 401);
  let body: GameInput;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  const input = validate(body);
  if (!input) return json({ error: 'Please check the game fields.' }, 400);

  const id = `game-${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`;
  await env.DB.prepare(
    `INSERT INTO games (id, title, subtitle, summary, description, difficulty, min_players, max_players,
      play_time_minutes, price_per_person_krw, image_url, tags_json, category, is_featured,
      highlight_badges_json, landing_content, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT MAX(display_order) + 1 FROM games), 1))`,
  ).bind(id, input.title, input.subtitle, input.summary, input.description, input.difficulty, input.minPlayers,
    input.maxPlayers, input.playTimeMinutes, input.pricePerPerson, input.image, JSON.stringify(input.tags), input.category,
    input.isFeatured ? 1 : 0, JSON.stringify(input.highlightBadges), input.landingHtml).run();

  const scheduleStatements = Array.from({ length: 7 }, (_, weekday) => env.DB.prepare(
    `INSERT INTO game_schedule_rules (id, game_id, weekday, opening_time, closing_time, slot_interval_minutes)
     VALUES (?, ?, ?, '11:00', '23:00', 90)`,
  ).bind(crypto.randomUUID(), id, weekday));
  await env.DB.batch(scheduleStatements);
  await env.DB.prepare(
    `INSERT INTO admin_audit_logs (id, admin_id, action, target_type, target_id, change_summary)
     VALUES (?, ?, 'game.created', 'game', ?, 'Game created')`,
  ).bind(crypto.randomUUID(), admin.id, id).run();

  const game = await env.DB.prepare(`SELECT ${gameFields} FROM games WHERE id = ?`).bind(id).first<GameRow>();
  return json({ game: game ? toGame(game) : null }, 201);
};