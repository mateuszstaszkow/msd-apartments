import { privacySections, privacyUpdated } from '@/data/privacy';
import { useI18n } from '@/i18n';
import { usePageMeta } from '@/lib/hooks';
import { AnimatedWords, Reveal } from '@/components/ui/Reveal';

export function PrivacyPage() {
  const { t, tl, locale } = useI18n();

  usePageMeta(
    'Privacy policy — MSD Apartments',
    'How MSD Apartments processes the personal data of guests, tenants and everyone who contacts us.',
  );

  const updated = new Date(privacyUpdated).toLocaleDateString(locale === 'pl' ? 'pl-PL' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <section className="relative overflow-hidden bg-sea-gradient pb-14 pt-36 lg:pb-20 lg:pt-44">
        <div className="pointer-events-none absolute -right-16 top-20 h-96 w-96 rounded-full bg-white/60 blur-3xl" />
        <div className="container-page relative">
          <h1 className="max-w-4xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            <AnimatedWords text={t('privacy.title')} />
          </h1>
          <Reveal delay={0.12}>
            <p className="mt-6 text-sm text-ink-soft">{t('privacy.updated', { date: updated })}</p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page">
          <div className="max-w-3xl space-y-10">
            {privacySections.map((section) => (
              <Reveal key={section.title.en}>
                <h2 className="font-display text-xl font-semibold sm:text-2xl">{tl(section.title)}</h2>
                <div className="mt-4 space-y-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.en} className="text-base leading-relaxed text-ink-soft">
                      {tl(paragraph)}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
