import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin light-blue bar that tracks reading progress under the header. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-sea-300 via-sea-500 to-brand"
      aria-hidden
    />
  );
}
