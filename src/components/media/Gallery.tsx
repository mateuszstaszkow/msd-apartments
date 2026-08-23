import { useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { useI18n } from '@/i18n';
import { cx } from '@/lib/format';
import { useEscapeKey, useScrollLock } from '@/lib/hooks';
import { SmartImage } from '@/components/ui/SmartImage';

interface GalleryProps {
  photos: string[];
  /**
   * Stand-in for the first tile only (a still from the apartment's film).
   * Repeating it across all eight slots would pretend there is more material
   * than there is, so the remaining tiles show a placeholder instead.
   */
  fallbacks?: string[];
  alt: string;
  initial: string;
}

/** Bento layout for the eight apartment photos, with a swipeable lightbox. */
export function Gallery({ photos, fallbacks = [], alt, initial }: GalleryProps) {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) => {
      setDirection(delta);
      setOpenIndex((current) =>
        current === null ? null : (current + delta + photos.length) % photos.length,
      );
    },
    [photos.length],
  );

  useEscapeKey(openIndex !== null, close);
  useScrollLock(openIndex !== null);

  const sourcesFor = (index: number) => (index === 0 ? [photos[0], ...fallbacks] : [photos[index]]);

  // First photo spans two columns and two rows; the rest fill in around it.
  const spans = [
    'sm:col-span-2 sm:row-span-2',
    '',
    '',
    'sm:col-span-2',
    '',
    '',
    'sm:row-span-2',
    'sm:col-span-2',
  ];

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {photos.map((photo, index) => (
          <motion.button
            key={photo}
            type="button"
            onClick={() => {
              setDirection(1);
              setOpenIndex(index);
            }}
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: Math.min(index, 5) * 0.06, ease: [0.22, 1, 0.36, 1] }}
            className={cx(
              'group relative aspect-[4/3] overflow-hidden rounded-2xl bg-sea-50 shadow-soft outline-none ring-sea-400 transition-shadow duration-500 hover:shadow-card focus-visible:ring-2',
              spans[index] ?? '',
            )}
            aria-label={t('common.photo', { n: index + 1, total: photos.length })}
          >
            <SmartImage
              sources={sourcesFor(index)}
              alt={`${alt} — ${index + 1}`}
              placeholderLabel={initial}
              placeholderHint={t('common.photoPending')}
              className="absolute inset-0 h-full w-full"
              imgClassName="transition-transform duration-[1100ms] ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="pointer-events-none absolute bottom-3 right-3 flex h-9 w-9 translate-y-3 items-center justify-center rounded-full bg-white/90 text-sea-700 opacity-0 shadow-soft transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <Expand className="h-4 w-4" />
            </span>
          </motion.button>
        ))}
      </div>

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {openIndex !== null && (
              <motion.div
                className="fixed inset-0 z-[95] flex flex-col items-center justify-center bg-ink/95 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={close}
              >
                <button
                  type="button"
                  onClick={close}
                  aria-label={t('common.close')}
                  className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white transition hover:rotate-90 hover:bg-white/25 sm:right-8 sm:top-8"
                >
                  <X className="h-5 w-5" />
                </button>

                <div
                  className="relative flex w-full max-w-6xl items-center justify-center px-4"
                  onClick={(event) => event.stopPropagation()}
                >
                  <NavButton side="left" onClick={() => step(-1)} label={t('common.previous')} />

                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={openIndex}
                      custom={direction}
                      initial={{ opacity: 0, x: direction * 70, scale: 0.97 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: direction * -70, scale: 0.97 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.18}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -80) step(1);
                        if (info.offset.x > 80) step(-1);
                      }}
                      className="w-full cursor-grab active:cursor-grabbing"
                    >
                      <SmartImage
                        sources={sourcesFor(openIndex)}
                        alt={`${alt} — ${openIndex + 1}`}
                        placeholderLabel={initial}
                        eager
                        className="mx-auto aspect-[3/2] w-full max-w-5xl rounded-2xl"
                        imgClassName="object-cover"
                      />
                    </motion.div>
                  </AnimatePresence>

                  <NavButton side="right" onClick={() => step(1)} label={t('common.next')} />
                </div>

                <p className="mt-6 text-sm font-medium text-white/70">
                  {t('common.photo', { n: openIndex + 1, total: photos.length })}
                </p>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function NavButton({
  side,
  onClick,
  label,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  label: string;
}) {
  const Icon = side === 'left' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cx(
        'absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur transition hover:scale-110 hover:bg-white/25',
        side === 'left' ? 'left-0 sm:-left-4' : 'right-0 sm:-right-4',
      )}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
