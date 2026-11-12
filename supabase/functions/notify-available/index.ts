/**
 * Called by the admin panel after saving. For every apartment just marked
 * "free", e-mails everyone who asked about that slug or about any apartment.
 *
 * Secrets (Project Settings → Edge Functions → Secrets):
 *   BREVO_API_KEY  — free Brevo transactional key
 *   SITE_URL       — optional, defaults to the GitHub Pages URL
 *   ADMIN_EMAIL    — must match the panel account (default below)
 */
import { createClient } from 'npm:@supabase/supabase-js@2';

const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? 'msdapartments+koszalin@gmail.com';
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://mateuszstaszkow.github.io/msd-apartments').replace(/\/$/, '');
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'msdapartments@gmail.com';
const FROM_NAME = 'MSD Apartments';
const PHONE = '+48 506 356 937';

const NAMES: Record<string, { en: string; pl: string }> = {
  zagiel: { en: 'Żagiel', pl: 'Żagiel' },
  latarnia: { en: 'Latarnia', pl: 'Latarnia' },
  lodz: { en: 'Łódź', pl: 'Łódź' },
  promenada: { en: 'Promenada', pl: 'Promenada' },
  mewa: { en: 'Mewa', pl: 'Mewa' },
  fala: { en: 'Fala', pl: 'Fala' },
  bryza: { en: 'Bryza', pl: 'Bryza' },
  laguna: { en: 'Laguna', pl: 'Laguna' },
};

interface Alert {
  id: string;
  email: string;
  slug: string | null;
  locale: string;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: cors() });
  }
  if (request.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }

  const auth = request.headers.get('Authorization') ?? '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: auth } } },
  );

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || userData.user?.email !== ADMIN_EMAIL) {
    return json({ error: 'unauthorized' }, 401);
  }

  const body = (await request.json().catch(() => null)) as { slugs?: string[] } | null;
  const slugs = [...new Set((body?.slugs ?? []).filter(Boolean))];
  if (slugs.length === 0) return json({ sent: 0, removed: 0 });

  const service = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: rows, error: loadError } = await service
    .from('availability_alerts')
    .select('id, email, slug, locale')
    .or(`slug.in.(${slugs.join(',')}),slug.is.null`);

  if (loadError) return json({ error: loadError.message }, 500);
  const alerts = (rows ?? []) as Alert[];
  if (alerts.length === 0) return json({ sent: 0, removed: 0 });

  const apiKey = Deno.env.get('BREVO_API_KEY');
  if (!apiKey) return json({ error: 'BREVO_API_KEY is not set' }, 503);

  // One e-mail per address, listing every freed flat they care about.
  const byEmail = new Map<string, { locale: string; slugs: Set<string>; ids: string[] }>();
  for (const alert of alerts) {
    const relevant = alert.slug ? (slugs.includes(alert.slug) ? [alert.slug] : []) : slugs;
    if (relevant.length === 0) continue;
    const entry = byEmail.get(alert.email) ?? { locale: alert.locale, slugs: new Set(), ids: [] };
    for (const slug of relevant) entry.slugs.add(slug);
    // Only remove specific-apartment subscriptions; "any" stays for the next free flat.
    if (alert.slug) entry.ids.push(alert.id);
    byEmail.set(alert.email, entry);
  }

  let sent = 0;
  const errors: string[] = [];
  for (const [email, entry] of byEmail) {
    try {
      await sendBrevo(apiKey, email, entry.locale, [...entry.slugs]);
      sent += 1;
    } catch (reason) {
      errors.push(`${email}: ${reason instanceof Error ? reason.message : String(reason)}`);
    }
  }

  const removeIds = [...byEmail.values()].flatMap((entry) => entry.ids);
  let removed = 0;
  if (removeIds.length > 0) {
    const { error: deleteError, count } = await service
      .from('availability_alerts')
      .delete({ count: 'exact' })
      .in('id', removeIds);
    if (deleteError) return json({ sent, error: deleteError.message }, 500);
    removed = count ?? removeIds.length;
  }

  return json({ sent, removed, errors: errors.length ? errors : undefined });
});

async function sendBrevo(apiKey: string, to: string, locale: string, slugs: string[]) {
  const pl = locale !== 'en';
  const names = slugs.map((slug) => NAMES[slug]?.[pl ? 'pl' : 'en'] ?? slug);
  const links = slugs
    .map((slug) => {
      const name = NAMES[slug]?.[pl ? 'pl' : 'en'] ?? slug;
      return `<li><a href="${SITE_URL}/apartments/${slug}">${name}</a> — ${SITE_URL}/apartments/${slug}</li>`;
    })
    .join('');

  const subject =
    names.length === 1
      ? pl
        ? `${names[0]} jest dostępne — MSD Apartments`
        : `${names[0]} is available — MSD Apartments`
      : pl
        ? `Wolne mieszkania — MSD Apartments`
        : `Apartments available — MSD Apartments`;

  const intro = pl
    ? names.length === 1
      ? `Mieszkanie <strong>${names[0]}</strong> jest właśnie wolne.`
      : `Te mieszkania są właśnie wolne:`
    : names.length === 1
      ? `<strong>${names[0]}</strong> is available right now.`
      : `These apartments are available right now:`;

  const call = pl
    ? `Zadzwoń: <a href="tel:${PHONE.replace(/\s/g, '')}">${PHONE}</a>`
    : `Call: <a href="tel:${PHONE.replace(/\s/g, '')}">${PHONE}</a>`;

  const html = `<div style="font-family:system-ui,sans-serif;font-size:16px;line-height:1.5;color:#0b2239">
<p>${pl ? 'Cześć,' : 'Hi,'}</p>
<p>${intro}</p>
<ul>${links}</ul>
<p>${call}</p>
<p style="color:#3f5872;font-size:14px">${pl ? 'Do usłyszenia,' : 'Speak soon,'}<br>${FROM_NAME}</p>
</div>`;

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Brevo ${response.status}: ${detail.slice(0, 200)}`);
  }
}

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(), 'Content-Type': 'application/json' },
  });
}
