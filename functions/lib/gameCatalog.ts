import type { Game } from '../../src/types';

export type GameRow = {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  description: string;
  difficulty: number;
  min_players: number;
  max_players: number;
  play_time_minutes: number;
  price_per_person_krw: number;
  image_url: string;
  tags_json: string;
  category: string;
  is_featured: number;
  highlight_badges_json: string;
  landing_content: string | null;
  display_order: number;
  is_enabled: number;
};

const parseArray = (value: string): string[] => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

export const toGame = (row: GameRow): Game => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  summary: row.summary,
  description: row.description,
  difficulty: row.difficulty,
  minPlayers: row.min_players,
  maxPlayers: row.max_players,
  playTimeMinutes: row.play_time_minutes,
  pricePerPerson: row.price_per_person_krw,
  image: row.image_url,
  tags: parseArray(row.tags_json),
  category: row.category,
  isFeatured: row.is_featured === 1,
  landingHtml: row.landing_content ?? undefined,
  highlightBadges: parseArray(row.highlight_badges_json),
});

export const gameFields = `id, title, subtitle, summary, description, difficulty, min_players, max_players,
  play_time_minutes, price_per_person_krw, image_url, tags_json, category, is_featured,
  highlight_badges_json, landing_content, display_order, is_enabled`;