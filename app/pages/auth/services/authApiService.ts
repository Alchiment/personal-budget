export interface LogoutResponse {
  message: string;
}

export async function logout(): Promise<LogoutResponse> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Logout failed' }));
    throw new Error(err.error ?? 'Logout failed');
  }

  return res.json();
}
