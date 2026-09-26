import { Game } from '../types';

const readError = async (response: Response): Promise<string> => {
  try {
    const body = await response.json() as { error?: string };
    return body.error ?? '게임 저장 요청에 실패했습니다.';
  } catch {
    return '게임 저장 요청에 실패했습니다.';
  }
};

export const getAdminGames = async (): Promise<Game[]> => {
  const response = await fetch('/api/admin/games', { credentials: 'same-origin' });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json() as { games: Game[] }).games;
};

export const createAdminGame = async (game: Omit<Game, 'id'>): Promise<Game> => {
  const response = await fetch('/api/admin/games', {
    method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(game),
  });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json() as { game: Game }).game;
};

export const patchAdminGame = async (id: string, game: Partial<Game>): Promise<Game> => {
  const response = await fetch(`/api/admin/games/${encodeURIComponent(id)}`, {
    method: 'PATCH', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(game),
  });
  if (!response.ok) throw new Error(await readError(response));
  return (await response.json() as { game: Game }).game;
};

export const disableAdminGame = async (id: string): Promise<void> => {
  const response = await fetch(`/api/admin/games/${encodeURIComponent(id)}`, {
    method: 'DELETE', credentials: 'same-origin',
  });
  if (!response.ok) throw new Error(await readError(response));
};