import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { useI18n } from '@/i18n';
import { formatNumber } from '@/lib/format';

interface CounterProps {
  value: number;
  suffix?: string;
  duration?: number;
  /** Years should not be grouped as 2,019. */
  plain?: boolean;
}

export function Counter({ value, suffix = '', duration = 1600, plain = false }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState(0);
  const { locale } = useI18n();

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {plain ? display : formatNumber(display, locale)}
      {suffix}
    </span>
  );
}
