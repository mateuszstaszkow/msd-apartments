import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useIsDesktop, useReducedMotionPreference } from '@/lib/hooks';

/** Soft light-blue halo trailing the pointer. Desktop only, purely decorative. */
export function CursorGlow() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotionPreference();
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!isDesktop || reduced) return;
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [isDesktop, reduced, x, y]);

  if (!isDesktop || reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{ left: springX, top: springY }}
      className="pointer-events-none fixed z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_65%)] blur-2xl"
    />
  );
}
