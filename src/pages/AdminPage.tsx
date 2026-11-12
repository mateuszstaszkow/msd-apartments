import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, LogOut, Save } from 'lucide-react';
import { apartments } from '@/data/apartments';
import { fetchOverrides, liveDataEnabled, setOverrides, type ApartmentOverride } from '@/data/live';
import { useI18n } from '@/i18n';
import { usePageMeta } from '@/lib/hooks';
import { formatPrice } from '@/lib/format';
import {
  loadSession,
  saveOverrides,
  SessionExpiredError,
  signIn,
  signOut,
  type AdminSession,
} from '@/lib/adminApi';
import { notifyAvailable } from '@/lib/waitlistApi';
import { Button } from '@/components/ui/Button';

interface Row {
  price: string;
  listingUrl: string;
  status: '' | 'free' | 'rented';
  rentedUntil: string;
}

const emptyRow: Row = { price: '', listingUrl: '', status: '', rentedUntil: '' };

const inputClass =
  'mt-1.5 w-full rounded-xl border border-sea-200 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-sea-400 focus:ring-4 focus:ring-sea-100 disabled:bg-sea-50/60 disabled:text-ink-muted';
const labelClass = 'block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-muted';

function toRow(override: ApartmentOverride | undefined): Row {
  if (!override) return emptyRow;
  return {
    price: override.price === null ? '' : String(override.price),
    listingUrl: override.listing_url ?? '',
    status: override.status ?? '',
    rentedUntil: override.rented_until ?? '',
  };
}

function toOverride(slug: string, row: Row): ApartmentOverride {
  const price = Number(row.price.replace(',', '.'));
  return {
    slug,
    price: row.price.trim() && Number.isFinite(price) ? price : null,
    listing_url: row.listingUrl.trim() || null,
    status: row.status || null,
    rented_until: row.status === 'rented' && row.rentedUntil ? row.rentedUntil : null,
  };
}

export function AdminPage() {
  const { t } = useI18n();
  const [session, setSession] = useState<AdminSession | null>(loadSession);
  const [notice, setNotice] = useState<string | null>(null);

  usePageMeta(`${t('admin.title')} — MSD Apartments`);

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <section className="bg-sea-gradient pb-20 pt-32 lg:pt-40">
      <div className="container-page">
        <h1 className="font-display text-3xl font-semibold sm:text-4xl">{t('admin.title')}</h1>

        {!liveDataEnabled ? (
          <p className="mt-8 max-w-xl rounded-2xl bg-amber-50 px-5 py-4 text-sm text-amber-800">
            {t('admin.notConfigured')}
          </p>
        ) : session ? (
          <Editor
            session={session}
            onSignOut={(message) => {
              signOut();
              setSession(null);
              setNotice(message ?? null);
            }}
          />
        ) : (
          <LoginForm
            notice={notice}
            onSignedIn={(next) => {
              setNotice(null);
              setSession(next);
            }}
          />
        )}
      </div>
    </section>
  );
}

function LoginForm({
  notice,
  onSignedIn,
}: {
  notice: string | null;
  onSignedIn: (session: AdminSession) => void;
}) {
  const { t } = useI18n();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(false);
    try {
      onSignedIn(await signIn(login, password));
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 max-w-sm space-y-4 rounded-[2rem] border border-sea-100 bg-white p-7 shadow-soft"
    >
      {notice && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{notice}</p>}
      <label className="block">
        <span className={labelClass}>{t('admin.login')}</span>
        <input
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          autoComplete="username"
          autoCapitalize="none"
          className={inputClass}
          required
        />
      </label>
      <label className="block">
        <span className={labelClass}>{t('admin.password')}</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          className={inputClass}
          required
        />
      </label>
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{t('admin.loginError')}</p>}
      <Button type="submit" disabled={busy} className="w-full">
        {t('admin.signIn')}
      </Button>
    </form>
  );
}

function Editor({
  session,
  onSignOut,
}: {
  session: AdminSession;
  onSignOut: (message?: string) => void;
}) {
  const { t, locale } = useI18n();
  const [rows, setRows] = useState<Record<string, Row>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, Row['status']>>({});
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOverrides()
      .then((overrides) => {
        setOverrides(overrides);
        const next = Object.fromEntries(
          apartments.map((apartment) => [
            apartment.slug,
            toRow(overrides.find((row) => row.slug === apartment.slug)),
          ]),
        );
        setRows(next);
        setSavedStatus(Object.fromEntries(Object.entries(next).map(([slug, row]) => [slug, row.status])));
      })
      .catch((reason: unknown) => {
        setState('error');
        setError(String(reason));
      });
  }, []);

  function update(slug: string, patch: Partial<Row>) {
    setRows((current) => ({ ...current, [slug]: { ...(current[slug] ?? emptyRow), ...patch } }));
    setState('idle');
    setMessage('');
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setState('saving');
    setMessage('');
    const payload = apartments.map((apartment) => toOverride(apartment.slug, rows[apartment.slug] ?? emptyRow));
    const freed = payload
      .filter((row) => row.status === 'free' && savedStatus[row.slug] !== 'free')
      .map((row) => row.slug);
    try {
      await saveOverrides(session, payload);
      setOverrides(await fetchOverrides());
      setSavedStatus(Object.fromEntries(payload.map((row) => [row.slug, row.status ?? ''])));

      if (freed.length === 0) {
        setState('saved');
        setMessage(t('admin.saved'));
        return;
      }

      const result = await notifyAvailable(session, freed);
      if (result.error) {
        setState('error');
        setError(t('admin.notified.error', { error: result.error }));
      } else {
        setState('saved');
        setMessage(
          result.sent > 0 ? t('admin.notified', { n: result.sent }) : t('admin.notified.none'),
        );
      }
    } catch (reason) {
      if (reason instanceof SessionExpiredError) {
        onSignOut(t('admin.sessionExpired'));
        return;
      }
      setState('error');
      setError(t('admin.saveError', { error: reason instanceof Error ? reason.message : String(reason) }));
    }
  }

  return (
    <form onSubmit={save} className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-ink-soft">{t('admin.intro')}</p>
        <Button type="button" variant="secondary" size="sm" onClick={() => onSignOut()}>
          <LogOut className="h-4 w-4" />
          {t('admin.signOut')}
        </Button>
      </div>

      <div className="mt-6 space-y-4">
        {apartments.map((apartment) => {
          const row = rows[apartment.slug] ?? emptyRow;
          const unit = `${apartment.currency} ${t(apartment.rentPeriod === 'month' ? 'card.month' : 'card.night')}`;
          return (
            <fieldset
              key={apartment.slug}
              className="grid gap-4 rounded-3xl border border-sea-100 bg-white p-5 shadow-soft sm:grid-cols-2 lg:grid-cols-[9rem_8rem_1fr_12rem_10rem] lg:items-end"
            >
              <div className="sm:col-span-2 lg:col-span-1">
                <p className="font-display text-lg font-semibold">{apartment.name}</p>
                <Link
                  to={`/apartments/${apartment.slug}`}
                  target="_blank"
                  className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-sea-700"
                >
                  {t('admin.view')}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <label>
                <span className={labelClass}>{t('admin.price', { unit })}</span>
                <input
                  inputMode="decimal"
                  value={row.price}
                  placeholder={formatPrice(apartment.price, apartment.currency, locale)}
                  onChange={(event) => update(apartment.slug, { price: event.target.value })}
                  className={inputClass}
                />
              </label>
              <label>
                <span className={labelClass}>{t('admin.listing')}</span>
                <input
                  type="url"
                  value={row.listingUrl}
                  placeholder="https://"
                  onChange={(event) => update(apartment.slug, { listingUrl: event.target.value })}
                  className={inputClass}
                />
              </label>
              <label>
                <span className={labelClass}>{t('admin.status')}</span>
                <select
                  value={row.status}
                  onChange={(event) => update(apartment.slug, { status: event.target.value as Row['status'] })}
                  className={inputClass}
                >
                  <option value="">
                    {`${t('admin.status.default')} (${t(apartment.rented ? 'admin.status.rented' : 'admin.status.free')})`}
                  </option>
                  <option value="free">{t('admin.status.free')}</option>
                  <option value="rented">{t('admin.status.rented')}</option>
                </select>
              </label>
              <label>
                <span className={labelClass}>{t('admin.rentedUntil')}</span>
                <input
                  type="date"
                  value={row.rentedUntil}
                  disabled={row.status !== 'rented'}
                  onChange={(event) => update(apartment.slug, { rentedUntil: event.target.value })}
                  className={inputClass}
                />
              </label>
            </fieldset>
          );
        })}
      </div>

      <div className="sticky bottom-4 mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-sea-100 bg-white/90 p-4 shadow-card backdrop-blur">
        <Button type="submit" disabled={state === 'saving'}>
          <Save className="h-4 w-4" />
          {t(state === 'saving' ? 'admin.saving' : 'admin.save')}
        </Button>
        {state === 'saved' && (
          <p className="text-sm font-semibold text-emerald-700">{message || t('admin.saved')}</p>
        )}
        {state === 'error' && <p className="text-sm text-red-700">{error}</p>}
      </div>
    </form>
  );
}
