const BASE = 'https://www.youtube-nocookie.com/embed';

interface EmbedOptions {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  /** Needed for postMessage control (sound toggle on the hero). */
  jsApi?: boolean;
  start?: number;
}

export function embedUrl(id: string, options: EmbedOptions = {}): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    iv_load_policy: '3',
    color: 'white',
  });

  if (options.autoplay) params.set('autoplay', '1');
  if (options.muted) params.set('mute', '1');
  if (options.controls === false) {
    params.set('controls', '0');
    params.set('disablekb', '1');
  }
  if (options.loop) {
    params.set('loop', '1');
    params.set('playlist', id);
  }
  if (options.jsApi) {
    params.set('enablejsapi', '1');
    if (typeof window !== 'undefined') params.set('origin', window.location.origin);
  }
  if (options.start) params.set('start', String(options.start));

  return `${BASE}/${id}?${params.toString()}`;
}

export function watchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/**
 * Best-to-worst still frames. Only a couple of the MSD films are uploaded in
 * HD, so the 4:3 `sddefault` is a realistic fallback — see `isLetterboxed`.
 */
export function thumbnailSources(id: string): string[] {
  return [
    `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${id}/hq720.jpg`,
    `https://i.ytimg.com/vi/${id}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
  ];
}

/**
 * YouTube pads its 4:3 stills (`sddefault`, `hqdefault`) with black bars.
 * They vanish inside a 16:9 frame, but any other crop keeps them, so callers
 * zoom these by 4/3 to push the bars outside the frame.
 */
export function isLetterboxed(src: string): boolean {
  return /\/(sd|hq)default\.jpg$/.test(src);
}

/** Sends a player command to an embedded iframe (requires jsApi: true). */
export function sendPlayerCommand(iframe: HTMLIFrameElement | null, func: string, args: unknown[] = []) {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args }), '*');
}
