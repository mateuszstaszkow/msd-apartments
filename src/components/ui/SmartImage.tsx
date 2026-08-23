import { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cx } from '@/lib/format';
import { isLetterboxed } from '@/lib/youtube';

interface SmartImageProps {
  /** Tried in order; the first one that loads wins. */
  sources: string[];
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Shown when every source fails — apartment initial on a sea gradient. */
  placeholderLabel?: string;
  /** Small caption under the placeholder label. */
  placeholderHint?: string;
  eager?: boolean;
  sizes?: string;
}

/**
 * Image that walks through a list of candidate URLs and ends on a branded
 * gradient placeholder, so the layout never breaks while photos are missing.
 */
export function SmartImage({
  sources,
  alt,
  className,
  imgClassName,
  placeholderLabel,
  placeholderHint,
  eager = false,
  sizes,
}: SmartImageProps) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const exhausted = index >= sources.length;

  return (
    <div className={cx('relative overflow-hidden bg-sea-100', className)}>
      <div
        aria-hidden
        className={cx(
          'absolute inset-0 bg-[linear-gradient(120deg,#e0f2fe_0%,#f8fdff_45%,#bae6fd_100%)] transition-opacity duration-700',
          loaded && !exhausted ? 'opacity-0' : 'opacity-100',
        )}
      />

      {exhausted ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-sea-500">
          {placeholderLabel ? (
            <span className="font-display text-4xl font-semibold text-sea-400/80">
              {placeholderLabel}
            </span>
          ) : (
            <ImageIcon className="h-7 w-7" strokeWidth={1.5} />
          )}
          <span className="h-px w-10 bg-sea-300" />
          {placeholderHint && (
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-sea-500/80">
              {placeholderHint}
            </span>
          )}
        </div>
      ) : (
        // The zoom lives on the wrapper so hover transforms on the image itself
        // still compose with it instead of cancelling the letterbox crop.
        <div className={cx('absolute inset-0', isLetterboxed(sources[index]) && 'scale-[1.34]')}>
          <img
            key={sources[index]}
            src={sources[index]}
            alt={alt}
            sizes={sizes}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={eager ? 'high' : 'auto'}
            onLoad={(event) => {
              // YouTube serves a 120x90 grey thumbnail instead of a 404 for missing stills.
              if (event.currentTarget.naturalWidth <= danglingThumbWidth) {
                setIndex((current) => current + 1);
                return;
              }
              setLoaded(true);
            }}
            onError={() => setIndex((current) => current + 1)}
            className={cx(
              'absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-out',
              loaded ? 'opacity-100' : 'opacity-0',
              imgClassName,
            )}
          />
        </div>
      )}
    </div>
  );
}

const danglingThumbWidth = 120;
