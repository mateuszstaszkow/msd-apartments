import { AnimatePresence, motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { useI18n } from '@/i18n';

/** Tells the visitor when a newer build of the catalogue is cached and ready. */
export function ReloadPrompt() {
  const { t } = useI18n();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed left-1/2 top-24 z-[70] flex -translate-x-1/2 items-center gap-3 rounded-full border border-sea-100 bg-white/90 py-2 pl-5 pr-2 shadow-card backdrop-blur-xl"
        >
          <p className="text-xs font-medium text-ink">{t('pwa.update.text')}</p>
          <button
            type="button"
            onClick={() => updateServiceWorker(true)}
            className="inline-flex items-center gap-2 rounded-full bg-sea-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sea-700"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {t('pwa.update.action')}
          </button>
          <button
            type="button"
            onClick={() => setNeedRefresh(false)}
            aria-label={t('common.close')}
            className="px-2 text-ink-muted transition hover:text-ink"
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
