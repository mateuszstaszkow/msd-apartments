import type { ReactNode } from 'react';
import { cx } from '@/lib/format';
import { AnimatedWords, Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'left',
  tone = 'dark',
  action,
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cx(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cx('max-w-2xl', centered && 'flex flex-col items-center')}>
        {eyebrow && (
          <Reveal direction="none">
            <span className={cx('eyebrow', tone === 'light' && 'border-white/30 bg-white/10 text-white')}>
              <span className="h-1.5 w-1.5 rounded-full bg-sea-400" />
              {eyebrow}
            </span>
          </Reveal>
        )}
        <h2
          className={cx(
            'mt-5 text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-[2.9rem]',
            tone === 'light' && 'text-white',
          )}
        >
          <AnimatedWords text={title} />
        </h2>
        {subtitle && (
          <Reveal delay={0.12}>
            <p
              className={cx(
                'mt-5 text-base leading-relaxed sm:text-lg',
                tone === 'light' ? 'text-sea-100' : 'text-ink-soft',
              )}
            >
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.2} direction="left" className={cx(centered && 'mt-2')}>
          {action}
        </Reveal>
      )}
    </div>
  );
}
