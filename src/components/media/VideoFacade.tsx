import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { cx } from '@/lib/format';
import { useI18n } from '@/i18n';
import { SmartImage } from '@/components/ui/SmartImage';
import { embedUrl, thumbnailSources } from '@/lib/youtube';

interface VideoFacadeProps {
  videoId: string;
  title: string;
  label?: string;
  className?: string;
  /** Keeps the iframe out of the page until the visitor asks for it. */
  eager?: boolean;
}

/**
 * Lightweight YouTube embed: shows the still frame until clicked, then swaps in
 * the real player. Keeps the catalogue fast even with every film on the site.
 */
export function VideoFacade({ videoId, title, label, className, eager }: VideoFacadeProps) {
  const [active, setActive] = useState(false);
  const { t } = useI18n();

  return (
    <div
      className={cx(
        'group relative aspect-video w-full overflow-hidden rounded-2xl bg-ink shadow-card',
        className,
      )}
    >
      {active ? (
        <iframe
          src={embedUrl(videoId, { autoplay: true })}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          aria-label={`${t('detail.video.play')}: ${title}`}
          className="absolute inset-0 h-full w-full cursor-pointer"
        >
          <SmartImage
            sources={thumbnailSources(videoId)}
            alt={title}
            eager={eager}
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />

          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-white/30 animate-pulse-ring" />
            <motion.span
              className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-sea-700 shadow-glow"
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.94 }}
            >
              <Play className="ml-1 h-6 w-6 fill-current" />
            </motion.span>
          </span>

          {label && (
            <span className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
              {label}
            </span>
          )}

          <span className="absolute bottom-5 left-5 right-5 text-left font-display text-base font-medium text-white sm:text-lg">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
