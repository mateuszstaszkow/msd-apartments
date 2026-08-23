import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n';
import { usePageMeta } from '@/lib/hooks';
import { ButtonLink } from '@/components/ui/Button';
import { AnimatedWords } from '@/components/ui/Reveal';

export function NotFoundPage() {
  const { t } = useI18n();
  usePageMeta('Page not found — MSD Apartments');

  return (
    <section className="relative flex min-h-[85svh] items-center overflow-hidden bg-sea-gradient">
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-white/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-sea-200/60 blur-3xl" />

      <div className="container-page relative text-center">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[7rem] font-bold leading-none text-sea-200 sm:text-[11rem]"
        >
          404
        </motion.p>
        <h1 className="mx-auto mt-2 max-w-xl font-display text-3xl font-semibold sm:text-4xl">
          <AnimatedWords text={t('notFound.title')} />
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-5 max-w-md text-base text-ink-soft"
        >
          {t('notFound.text')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-9 flex justify-center"
        >
          <ButtonLink to="/" size="lg">
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            {t('notFound.cta')}
          </ButtonLink>
        </motion.div>
      </div>
    </section>
  );
}
