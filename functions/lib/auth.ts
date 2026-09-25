const encoder = new TextEncoder();

const PBKDF2_ITERATIONS = 600_000;
const PASSWORD_HASH_LENGTH = 32;

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
};

const fromBase64Url = (value: string): Uint8Array => {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};

const constantTimeEqual = (left: Uint8Array, right: Uint8Array): boolean => {
  let mismatch = left.length ^ right.length;
  const length = Math.max(left.length, right.length);

  for (let index = 0; index < length; index += 1) {
    mismatch |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return mismatch === 0;
};

const derivePasswordHash = async (password: string, salt: Uint8Array): Promise<Uint8Array> => {
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: PBKDF2_ITERATIONS,
    },
    passwordKey,
    PASSWORD_HASH_LENGTH * 8,
  );

  return new Uint8Array(derivedBits);
};

export const createPasswordHash = async (password: string): Promise<{ hash: string; salt: string }> => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derivePasswordHash(password, salt);

  return {
    hash: toBase64Url(hash),
    salt: toBase64Url(salt),
  };
};

export const verifyPassword = async (password: string, expectedHash: string, salt: string): Promise<boolean> => {
  try {
    const actualHash = await derivePasswordHash(password, fromBase64Url(salt));
    return constantTimeEqual(actualHash, fromBase64Url(expectedHash));
  } catch {
    return false;
  }
};

export const createSessionToken = (): string => toBase64Url(crypto.getRandomValues(new Uint8Array(32)));

export const hashToken = async (token: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(token));
  return toBase64Url(new Uint8Array(digest));
};

export const readCookie = (request: Request, name: string): string | null => {
  const cookieHeader = request.headers.get('Cookie');

  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(';')) {
    const [key, ...value] = cookie.trim().split('=');
    if (key === name) {
      return value.join('=') || null;
    }
  }

  return null;
};

export const createSessionCookie = (request: Request, token: string, maxAgeSeconds: number): string => {
  const isSecureRequest = new URL(request.url).protocol === 'https:';
  const attributes = [
    `puzzle_admin_session=${token}`,
    'HttpOnly',
    'Path=/api',
    'SameSite=Strict',
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (isSecureRequest) {
    attributes.push('Secure');
  }

  return attributes.join('; ');
};

export const clearSessionCookie = (request: Request): string => {
  const attributes = [
    'puzzle_admin_session=',
    'HttpOnly',
    'Path=/api',
    'SameSite=Strict',
    'Max-Age=0',
  ];

  if (new URL(request.url).protocol === 'https:') {
    attributes.push('Secure');
  }

  return attributes.join('; ');
};

export const getRequestIp = (request: Request): string =>
  request.headers.get('CF-Connecting-IP') ?? request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ?? 'unknown';