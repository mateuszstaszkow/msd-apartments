import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileCallBar } from './MobileCallBar';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { CursorGlow } from '@/components/ui/CursorGlow';
import { InstallPrompt } from '@/components/pwa/InstallPrompt';
import { ReloadPrompt } from '@/components/pwa/ReloadPrompt';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

export function Layout() {
  const location = useLocation();

  return (
    <div className="relative flex min-h-dvh flex-col bg-white">
      <ScrollProgress />
      <CursorGlow />
      <Header />
      <ScrollToTop />

      <main className="relative z-10 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <MobileCallBar />
      <InstallPrompt />
      <ReloadPrompt />
    </div>
  );
}
