const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface AdminUser {
  id: string;
  email: string;
}

export async function getMe(): Promise<AdminUser | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      credentials: 'include',
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
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      return { success: false, error: data.error || 'Login failed' };
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

export async function logout(): Promise<void> {
  await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}
