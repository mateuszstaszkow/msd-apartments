import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { site } from '@/data/site';
import { useI18n } from '@/i18n';
import { useScrolled } from '@/lib/hooks';

/** Sticky call/WhatsApp bar on phones — the phone number is never more than a thumb away. */
export function MobileCallBar() {
  const { t } = useI18n();
  const scrolled = useScrolled(500);

  return (
    <motion.div
      initial={false}
      animate={{ y: scrolled ? 0 : 130, opacity: scrolled ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="safe-bottom fixed inset-x-0 bottom-0 z-[65] flex gap-2 border-t border-sea-100 bg-white/90 p-3 backdrop-blur-xl sm:hidden"
    >
      <a
        href={site.phone.href}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-sea-600 px-5 py-3.5 text-sm font-semibold text-white shadow-glow active:scale-[0.98]"
      >
        <Phone className="h-4 w-4" />
        {site.phone.display}
      </a>
      <a
        href={site.phone.whatsapp}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="WhatsApp"
        className="flex h-[50px] w-[50px] items-center justify-center rounded-full border border-sea-200 text-sea-700 active:scale-95"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
      <span className="sr-only">{t('nav.call')}</span>
    </motion.div>
  );
}
