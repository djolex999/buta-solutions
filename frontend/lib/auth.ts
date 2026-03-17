const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AdminUser {
  id: string;
  email: string;
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getAuthHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMe(): Promise<AdminUser | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Login failed' };
    }
    const data = await res.json();
    localStorage.setItem('token', data.token);
    return { success: true };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function logout(): Promise<void> {
  const token = getToken();
  if (token) {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => {});
  }
  localStorage.removeItem('token');
}
