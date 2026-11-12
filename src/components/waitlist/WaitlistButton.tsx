import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n';
import { liveDataEnabled } from '@/data/live';
import { subscribeAlert } from '@/lib/waitlistApi';
import { Button } from '@/components/ui/Button';

interface WaitlistButtonProps {
  /** Omit for "any apartment". */
  slug?: string;
  apartmentName?: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function WaitlistButton({
  slug,
  apartmentName,
  variant = 'secondary',
  className,
}: WaitlistButtonProps) {
  const { t, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  if (!liveDataEnabled) return null;

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!email.trim()) return;
    setState('sending');
    try {
      await subscribeAlert(email, locale, slug);
      setState('sent');
    } catch {
      setState('error');
    }
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="lg"
        className={className}
        onClick={() => {
          setOpen(true);
          setState('idle');
        }}
      >
        <Bell className="h-4 w-4" />
        {t(slug ? 'waitlist.button' : 'waitlist.button.any')}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="waitlist-title"
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-[1.75rem] border border-sea-100 bg-white p-6 shadow-card sm:p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="waitlist-title" className="font-display text-xl font-semibold text-ink">
                    {t(slug ? 'waitlist.title' : 'waitlist.title.any', { name: apartmentName ?? '' })}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {t(slug ? 'waitlist.text' : 'waitlist.text.any')}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t('common.close')}
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sea-100 text-ink-muted transition hover:border-sea-300 hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {state === 'sent' ? (
                <p className="mt-6 flex items-start gap-3 rounded-2xl bg-sea-50 px-4 py-3 text-sm text-sea-900">
                  <Check className="mt-0.5 h-4 w-4 shrink-0" />
                  {t('waitlist.success')}
                </p>
              ) : (
                <form onSubmit={submit} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      {t('waitlist.email')}
                    </span>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (state === 'error') setState('idle');
                      }}
                      className="mt-2 w-full rounded-xl border border-sea-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-sea-400 focus:ring-4 focus:ring-sea-100"
                    />
                  </label>
                  {state === 'error' && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{t('waitlist.error')}</p>
                  )}
                  <Button type="submit" disabled={state === 'sending'} className="w-full">
                    <Bell className="h-4 w-4" />
                    {t(state === 'sending' ? 'waitlist.sending' : 'waitlist.submit')}
                  </Button>
                  <p className="text-xs leading-relaxed text-ink-muted">
                    {t('waitlist.privacy')}{' '}
                    <Link to="/privacy" className="link-underline font-semibold text-sea-700" onClick={() => setOpen(false)}>
                      {t('contact.form.privacy')}
                    </Link>
                    .
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
