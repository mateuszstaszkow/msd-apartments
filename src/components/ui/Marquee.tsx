import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

/** Endlessly scrolling row; children are duplicated to make the loop seamless. */
export function Marquee({
  children,
  className,
  speed = 'normal',
}: {
  children: ReactNode;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}) {
  const duration = { slow: '58s', normal: '38s', fast: '24s' }[speed];

  return (
    <div className={cx('mask-fade-x group relative flex overflow-hidden', className)}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
          style={{ animationDuration: duration }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
