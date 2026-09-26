import { Game } from '../types';

export const getPublicGames = async (): Promise<Game[]> => {
  const response = await fetch('/api/public/games');

  if (!response.ok) {
    throw new Error('게임 목록을 불러오지 못했습니다.');
  }

  const body = await response.json() as { games: Game[] };
  return body.games;
};