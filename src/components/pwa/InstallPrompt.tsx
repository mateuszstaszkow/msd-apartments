import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useI18n } from '@/i18n';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'msd-install-dismissed';

/** Native-feeling "add to home screen" card, shown once the browser offers it. */
export function InstallPrompt() {
  const { t } = useI18n();
  const [event, setEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const onPrompt = (raw: Event) => {
      raw.preventDefault();
      setEvent(raw as BeforeInstallPromptEvent);
      window.setTimeout(() => setVisible(true), 6000);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);
    window.addEventListener('appinstalled', () => setVisible(false));
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, '1');
  }

  async function install() {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    setVisible(false);
    setEvent(null);
  }

  return (
    <AnimatePresence>
      {visible && event && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="safe-bottom fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-md rounded-2xl border border-sea-100 bg-white/90 p-4 shadow-card backdrop-blur-xl sm:left-auto sm:right-6"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sea-50">
              <img src="/favicon.svg" alt="" width={28} height={28} className="h-7 w-7" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-semibold text-ink">{t('pwa.install.title')}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{t('pwa.install.text')}</p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={install}
                  className="inline-flex items-center gap-2 rounded-full bg-sea-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sea-700"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t('pwa.install.action')}
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="rounded-full px-3 py-2 text-xs font-semibold text-ink-muted transition hover:text-ink"
                >
                  {t('pwa.install.dismiss')}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={dismiss}
              aria-label={t('common.close')}
              className="text-ink-muted transition hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
