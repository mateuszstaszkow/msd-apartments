import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useI18n } from '@/i18n';
import { useIsDesktop, useReducedMotionPreference } from '@/lib/hooks';
import { SmartImage } from '@/components/ui/SmartImage';
import { embedUrl, sendPlayerCommand, thumbnailSources } from '@/lib/youtube';

interface BackgroundVideoProps {
  videoId: string;
  posterAlt: string;
  /** Rotates through several films when more than one id is given. */
  playlist?: string[];
}

/**
 * Cinematic, muted, looping YouTube layer behind the hero. Falls back to a
 * slowly panning still on mobile and when the visitor prefers reduced motion.
 */
export function BackgroundVideo({ videoId, posterAlt, playlist }: BackgroundVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotionPreference();
  const { t } = useI18n();
  const [ready, setReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const [index, setIndex] = useState(0);

  const ids = playlist?.length ? playlist : [videoId];
  const current = ids[index % ids.length];
  const useVideo = isDesktop && !reduced;

  // Move to the next film every 40 seconds so the hero keeps changing.
  useEffect(() => {
    if (!useVideo || ids.length < 2) return;
    const timer = window.setInterval(() => {
      setReady(false);
      setIndex((value) => (value + 1) % ids.length);
    }, 40_000);
    return () => window.clearInterval(timer);
  }, [useVideo, ids.length]);

  useEffect(() => {
    if (!useVideo) return;
    const timer = window.setTimeout(() => setReady(true), 1400);
    return () => window.clearTimeout(timer);
  }, [useVideo, current]);

  function toggleSound() {
    const next = !muted;
    sendPlayerCommand(iframeRef.current, next ? 'mute' : 'unMute');
    if (!next) sendPlayerCommand(iframeRef.current, 'setVolume', [55]);
    setMuted(next);
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-ink">
      <AnimatePresence>
        {!ready && (
          <motion.div
            key={`poster-${current}`}
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <SmartImage
              sources={thumbnailSources(current)}
              alt={posterAlt}
              eager
              className="h-full w-full"
              imgClassName={reduced ? undefined : 'scale-110 animate-float'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {useVideo && (
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 1.4 }}
        >
          <iframe
            ref={iframeRef}
            src={embedUrl(current, { autoplay: true, muted: true, loop: true, controls: false, jsApi: true })}
            title={posterAlt}
            tabIndex={-1}
            allow="autoplay; encrypted-media"
            onLoad={() => {
              // Some browsers ignore the autoplay parameter; ask the player directly.
              sendPlayerCommand(iframeRef.current, 'mute');
              sendPlayerCommand(iframeRef.current, 'playVideo');
            }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-[112%] w-[177.78vh] min-w-[112%] -translate-x-1/2 -translate-y-1/2 border-0"
          />
        </motion.div>
      )}

      {/* Legibility layers: darken the footage, anchor the copy side, wash it blue. */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/75 via-ink/50 to-ink/85" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/45 to-ink/10 lg:via-ink/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.26),transparent_55%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent" />

      {useVideo && (
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? t('hero.sound.on') : t('hero.sound.off')}
          className="absolute bottom-8 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/25 lg:bottom-12 lg:right-12"
        >
          {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
}
