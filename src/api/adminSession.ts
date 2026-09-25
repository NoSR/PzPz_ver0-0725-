export type AdminSession = {
  admin: {
    id: string;
    email: string;
  };
};

type ApiError = {
  error?: string;
};

const readError = async (response: Response): Promise<string> => {
  try {
    const body = await response.json() as ApiError;
    return body.error ?? '관리자 인증에 실패했습니다.';
  } catch {
    return '관리자 인증에 실패했습니다.';
  }
};

export const getAdminSession = async (): Promise<AdminSession | null> => {
  const response = await fetch('/api/admin/session', { credentials: 'same-origin' });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<AdminSession>;
};

export const createAdminSession = async (email: string, password: string): Promise<AdminSession> => {
  const response = await fetch('/api/admin/session', {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }

  return response.json() as Promise<AdminSession>;
};

export const deleteAdminSession = async (): Promise<void> => {
  const response = await fetch('/api/admin/session', {
    method: 'DELETE',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error(await readError(response));
  }
};