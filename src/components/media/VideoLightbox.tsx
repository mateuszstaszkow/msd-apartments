import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useI18n } from '@/i18n';
import { useEscapeKey, useScrollLock } from '@/lib/hooks';
import { embedUrl } from '@/lib/youtube';

interface VideoLightboxProps {
  videoId: string | null;
  title?: string;
  onClose: () => void;
}

/** Full-screen cinema for a single YouTube film. */
export function VideoLightbox({ videoId, title, onClose }: VideoLightboxProps) {
  const { t } = useI18n();
  const open = Boolean(videoId);
  useScrollLock(open);
  useEscapeKey(open, onClose);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {videoId && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-md sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? 'Video'}
        >
          <motion.button
            type="button"
            onClick={onClose}
            aria-label={t('common.close')}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:rotate-90 hover:bg-white/25 sm:right-8 sm:top-8"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.15 } }}
            exit={{ opacity: 0, scale: 0.7 }}
          >
            <X className="h-5 w-5" />
          </motion.button>

          <motion.div
            className="w-full max-w-6xl overflow-hidden rounded-2xl bg-black shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]"
            initial={{ opacity: 0, scale: 0.94, y: 26 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-video w-full">
              <iframe
                key={videoId}
                src={embedUrl(videoId, { autoplay: true })}
                title={title ?? 'MSD Apartments film'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </motion.div>

          {title && (
            <motion.p
              className="absolute bottom-6 left-0 right-0 px-6 text-center font-display text-sm text-white/70"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
              exit={{ opacity: 0 }}
            >
              {title}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
