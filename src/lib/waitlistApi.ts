import { site } from '@/data/site';
import type { Locale } from '@/types';
import type { AdminSession } from '@/lib/adminApi';

const { url, anonKey } = site.supabase;

/** Subscribe an e-mail to a specific apartment, or to any apartment when slug is omitted. */
export async function subscribeAlert(email: string, locale: Locale, slug?: string): Promise<void> {
  const response = await fetch(`${url}/rest/v1/availability_alerts`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      locale,
      slug: slug ?? null,
    }),
  });

  // 409 = already on the list for this apartment — treat as success.
  if (response.status === 409) return;
  if (!response.ok) {
    const detail = (await response.json().catch(() => null)) as { message?: string; code?: string } | null;
    if (detail?.code === '23505') return;
    throw new Error(detail?.message ?? `HTTP ${response.status}`);
  }
}

/** Ask the Edge Function to e-mail waitlist subscribers about newly free apartments. */
export async function notifyAvailable(
  session: AdminSession,
  slugs: string[],
): Promise<{ sent: number; removed: number; error?: string }> {
  if (slugs.length === 0) return { sent: 0, removed: 0 };
  const response = await fetch(`${url}/functions/v1/notify-available`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${session.accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ slugs }),
  });
  const body = (await response.json().catch(() => ({}))) as {
    sent?: number;
    removed?: number;
    error?: string;
  };
  if (!response.ok) {
    return { sent: body.sent ?? 0, removed: body.removed ?? 0, error: body.error ?? `HTTP ${response.status}` };
  }
  return { sent: body.sent ?? 0, removed: body.removed ?? 0, error: body.error };
}
