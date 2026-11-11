import { motion, useInView, type Variants } from 'framer-motion';
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

/**
 * True once the element has entered the viewport. Elements already on screen
 * when they mount are revealed straight away: Safari may not deliver the first
 * IntersectionObserver callback after a route change until the user scrolls.
 */
export function useReveal<T extends Element>(amount = 0.25, once = true) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { once, amount });
  const [onScreenAtMount, setOnScreenAtMount] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const rect = ref.current?.getBoundingClientRect();
      if (rect && rect.top < window.innerHeight && rect.bottom > 0) setOnScreenAtMount(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return [ref, inView || (once && onScreenAtMount)] as const;
}

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 38 },
  down: { x: 0, y: -38 },
  left: { x: 44, y: 0 },
  right: { x: -44, y: 0 },
  none: { x: 0, y: 0 },
};

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: Direction;
  once?: boolean;
  as?: ElementType;
  amount?: number;
}

/** Fades and slides content in the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.75,
  direction = 'up',
  once = true,
  as = 'div',
  amount = 0.25,
}: RevealProps) {
  const MotionTag = motion[as as 'div'];
  const offset = offsets[direction];
  const [ref, revealed] = useReveal<HTMLDivElement>(amount, once);
  const hidden = { opacity: 0, x: offset.x, y: offset.y, filter: 'blur(6px)' };

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={hidden}
      animate={revealed ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' } : hidden}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 34, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

interface StaggerProps {
  children: ReactNode;
  className?: string;
  amount?: number;
}

export function Stagger({ children, className, amount = 0.15 }: StaggerProps) {
  const [ref, revealed] = useReveal<HTMLDivElement>(amount);

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={staggerContainer}
      initial="hidden"
      animate={revealed ? 'visible' : 'hidden'}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

/** Splits a heading into words that rise into place one after another. */
export function AnimatedWords({
  text,
  className,
  delay = 0,
  wordClassName,
}: {
  text: string;
  className?: string;
  delay?: number;
  wordClassName?: string;
}) {
  const words = text.split(' ');
  const [ref, revealed] = useReveal<HTMLSpanElement>(0.5);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial="hidden"
      animate={revealed ? 'visible' : 'hidden'}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span key={`${word}-${index}`} className="inline-block overflow-hidden py-[0.08em] align-bottom">
          <motion.span
            className={`inline-block ${wordClassName ?? ''}`}
            variants={{
              hidden: { y: '110%', opacity: 0 },
              visible: { y: '0%', opacity: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
            }}
            aria-hidden
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
