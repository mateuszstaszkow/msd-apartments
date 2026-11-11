import { site } from '@/data/site';
import type { ApartmentOverride } from '@/data/live';

const { url, anonKey, adminLogin, adminEmail } = site.supabase;
const SESSION_KEY = 'msd-admin-session';

export interface AdminSession {
  accessToken: string;
  /** Unix seconds. */
  expiresAt: number;
}

export class SessionExpiredError extends Error {}

export function loadSession(): AdminSession | null {
  try {
    const session = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? 'null') as AdminSession | null;
    return session && session.expiresAt * 1000 > Date.now() ? session : null;
  } catch {
    return null;
  }
}

export function signOut(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

/** The short login ("koszalin") stands for the admin's Supabase Auth e-mail. */
export async function signIn(login: string, password: string): Promise<AdminSession> {
  const name = login.trim().toLowerCase();
  if (name !== adminLogin && name !== adminEmail) throw new Error('invalid login');
  const response = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password }),
  });
  if (!response.ok) throw new Error('invalid login');
  const body = (await response.json()) as { access_token: string; expires_at: number };
  const session = { accessToken: body.access_token, expiresAt: body.expires_at };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export async function saveOverrides(session: AdminSession, rows: ApartmentOverride[]): Promise<void> {
  const response = await fetch(`${url}/rest/v1/apartment_overrides?on_conflict=slug`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });
  if (response.status === 401) {
    signOut();
    throw new SessionExpiredError();
  }
  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(detail?.message ?? `HTTP ${response.status}`);
  }
}
