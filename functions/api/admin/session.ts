import {
  clearSessionCookie,
  createSessionCookie,
  createSessionToken,
  getRequestIp,
  hashToken,
  readCookie,
  verifyPassword,
} from '../../lib/auth';

type FunctionContext = {
  request: Request;
  env: Env;
};

type AdminRecord = {
  id: string;
  email: string;
  password_hash: string;
  password_salt: string;
  is_active: number;
};

type SessionRecord = {
  admin_id: string;
  email: string;
};

const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 5;

const json = (body: unknown, status = 200, headers: HeadersInit = {}): Response =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...headers,
    },
  });

const getSession = async (request: Request, env: Env): Promise<SessionRecord | null> => {
  const token = readCookie(request, 'puzzle_admin_session');

  if (!token) {
    return null;
  }

  const tokenHash = await hashToken(token);
  const session = await env.DB.prepare(
    `SELECT admin_sessions.admin_id, admins.email
     FROM admin_sessions
     INNER JOIN admins ON admins.id = admin_sessions.admin_id
     WHERE admin_sessions.token_hash = ?
       AND admin_sessions.revoked_at IS NULL
       AND admin_sessions.expires_at > ?
       AND admins.is_active = 1`,
  )
    .bind(tokenHash, new Date().toISOString())
    .first<SessionRecord>();

  return session ?? null;
};

const recordFailedAttempt = async (env: Env, ipHash: string, attemptedAt: string): Promise<void> => {
  await env.DB.prepare('INSERT INTO admin_login_attempts (id, ip_hash, attempted_at) VALUES (?, ?, ?)')
    .bind(crypto.randomUUID(), ipHash, attemptedAt)
    .run();
};

export const onRequestPost = async ({ request, env }: FunctionContext): Promise<Response> => {
  let body: { email?: unknown; password?: unknown };

  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || email.length > 254 || !password || password.length > 1024) {
    return json({ error: 'Email and password are required.' }, 400);
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() - LOGIN_WINDOW_MS).toISOString();
  const ipHash = await hashToken(getRequestIp(request));
  const attemptCount = await env.DB.prepare(
    'SELECT COUNT(*) AS count FROM admin_login_attempts WHERE ip_hash = ? AND attempted_at >= ?',
  )
    .bind(ipHash, windowStart)
    .first<{ count: number }>();

  if ((attemptCount?.count ?? 0) >= MAX_LOGIN_ATTEMPTS) {
    return json({ error: 'Too many login attempts. Please try again later.' }, 429);
  }

  const admin = await env.DB.prepare(
    'SELECT id, email, password_hash, password_salt, is_active FROM admins WHERE email = ?',
  )
    .bind(email)
    .first<AdminRecord>();
  const passwordValid = admin?.is_active === 1 && await verifyPassword(password, admin.password_hash, admin.password_salt);

  if (!passwordValid || !admin) {
    await recordFailedAttempt(env, ipHash, now.toISOString());
    return json({ error: 'Invalid email or password.' }, 401);
  }

  const token = createSessionToken();
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_SECONDS * 1000).toISOString();
  const sessionId = crypto.randomUUID();

  await env.DB.batch([
    env.DB.prepare(
      `INSERT INTO admin_sessions (id, admin_id, token_hash, expires_at, ip_hash, user_agent)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(sessionId, admin.id, tokenHash, expiresAt, ipHash, request.headers.get('User-Agent')),
    env.DB.prepare('UPDATE admins SET last_login_at = ? WHERE id = ?').bind(now.toISOString(), admin.id),
    env.DB.prepare(
      `INSERT INTO admin_audit_logs (id, admin_id, action, target_type, target_id, change_summary, request_metadata_hash)
       VALUES (?, ?, 'session.created', 'admin_session', ?, 'Administrator signed in', ?)`,
    ).bind(crypto.randomUUID(), admin.id, sessionId, ipHash),
    env.DB.prepare('DELETE FROM admin_login_attempts WHERE ip_hash = ?').bind(ipHash),
  ]);

  return json(
    { admin: { id: admin.id, email: admin.email } },
    200,
    { 'Set-Cookie': createSessionCookie(request, token, SESSION_DURATION_SECONDS) },
  );
};

export const onRequestGet = async ({ request, env }: FunctionContext): Promise<Response> => {
  const session = await getSession(request, env);

  if (!session) {
    return json({ error: 'Unauthorized.' }, 401);
  }

  return json({ admin: { id: session.admin_id, email: session.email } });
};

export const onRequestDelete = async ({ request, env }: FunctionContext): Promise<Response> => {
  const token = readCookie(request, 'puzzle_admin_session');

  if (token) {
    const tokenHash = await hashToken(token);
    await env.DB.prepare('UPDATE admin_sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL')
      .bind(new Date().toISOString(), tokenHash)
      .run();
  }

  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie(request) });
};