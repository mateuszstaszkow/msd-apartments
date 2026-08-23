import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cx } from '@/lib/format';
import { useReducedMotionPreference } from '@/lib/hooks';

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Pixels the layer drifts across the full scroll of the section. */
  distance?: number;
  /** Also scale the layer slightly while scrolling. */
  zoom?: boolean;
}

export function Parallax({ children, className, distance = 90, zoom = false }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.12, 1, 1.12]);

  return (
    <div ref={ref} className={cx('relative', className)}>
      <motion.div
        style={reduced ? undefined : { y, scale: zoom ? scale : 1 }}
        className="h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Full-bleed image that slowly zooms out as the section scrolls past. */
export function ParallaxCover({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);

  return (
    <div ref={ref} className={cx('relative overflow-hidden', className)}>
      {/* Oversized on purpose: the layer drifts vertically and must never
          expose the container edges. */}
      <motion.div
        style={reduced ? undefined : { y, scale }}
        className="absolute inset-x-0 -top-[10%] h-[120%]"
      >
        {children}
      </motion.div>
    </div>
  );
}
