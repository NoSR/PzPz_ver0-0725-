import { hashToken, readCookie } from './auth';

export type AuthenticatedAdmin = {
  id: string;
  email: string;
};

export const getAuthenticatedAdmin = async (request: Request, env: Env): Promise<AuthenticatedAdmin | null> => {
  const token = readCookie(request, 'puzzle_admin_session');

  if (!token) {
    return null;
  }

  const tokenHash = await hashToken(token);
  const admin = await env.DB.prepare(
    `SELECT admin_sessions.admin_id AS id, admins.email
     FROM admin_sessions
     INNER JOIN admins ON admins.id = admin_sessions.admin_id
     WHERE admin_sessions.token_hash = ?
       AND admin_sessions.revoked_at IS NULL
       AND admin_sessions.expires_at > ?
       AND admins.is_active = 1`,
  ).bind(tokenHash, new Date().toISOString()).first<AuthenticatedAdmin>();

  return admin ?? null;
};