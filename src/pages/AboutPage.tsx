import { ArrowUpRight, Camera, Handshake, KeyRound, Phone } from 'lucide-react';
import { apartments, coverSources, videoCount } from '@/data/apartments';
import { site, stats } from '@/data/site';
import { useI18n } from '@/i18n';
import { usePageMeta } from '@/lib/hooks';
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { Magnetic } from '@/components/ui/Magnetic';
import { ParallaxCover } from '@/components/ui/Parallax';
import { AnimatedWords, Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';

export function AboutPage() {
  const { t } = useI18n();

  usePageMeta(
    'About — MSD Apartments',
    'MSD Apartments is a company which handles properties rental and selling in cities near the sea since 2019.',
  );

  return (
    <>
      <section className="relative overflow-hidden bg-sea-gradient pb-16 pt-36 lg:pb-24 lg:pt-44">
        <div className="pointer-events-none absolute -right-16 top-20 h-96 w-96 rounded-full bg-white/60 blur-3xl" />
        <div className="container-page relative">
          <Reveal direction="none">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-sea-400" />
              {t('about.eyebrow')}
            </span>
          </Reveal>
          <h1 className="mt-6 max-w-4xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            <AnimatedWords text={t('about.title')} />
          </h1>
          <div className="mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
            <Reveal delay={0.12}>
              <p className="text-base leading-relaxed text-ink-soft">{t('about.p1')}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="text-base leading-relaxed text-ink-soft">{t('about.p2')}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
          {stats.map((stat, index) => (
            <Reveal key={stat.key} delay={index * 0.08}>
              <div className="rounded-2xl border border-sea-100 p-6 transition duration-500 hover:-translate-y-1 hover:shadow-soft">
                <p className="font-display text-4xl font-semibold text-sea-600 sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} plain={stat.key === 'since'} />
                </p>
                <p className="mt-2 text-sm text-ink-soft">{t(`stats.${stat.key}` as 'stats.since')}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sea-50/60 py-20 lg:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1">
            <SectionHeading eyebrow={t('process.eyebrow')} title={t('process.title')} />
            <Stagger className="mt-10 space-y-4">
              {[
                { icon: Handshake, title: t('about.point1.title'), text: t('about.point1.text') },
                { icon: Camera, title: t('about.point2.title'), text: t('about.point2.text') },
                { icon: KeyRound, title: t('about.point3.title'), text: t('about.point3.text') },
              ].map((point) => (
                <StaggerItem key={point.title}>
                  <div className="group flex gap-5 rounded-2xl border border-sea-100 bg-white p-6 transition duration-500 hover:-translate-y-1 hover:border-sea-300 hover:shadow-card">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sea-50 text-sea-600 transition duration-500 group-hover:bg-sea-600 group-hover:text-white">
                      <point.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{point.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{point.text}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="order-1 grid grid-cols-2 gap-4 lg:order-2">
            {apartments.slice(0, 4).map((apartment, index) => (
              <ParallaxCover
                key={apartment.slug}
                className={`overflow-hidden rounded-2xl shadow-soft ${
                  index % 2 === 0 ? 'aspect-[3/4] translate-y-0' : 'aspect-[3/4] translate-y-8'
                }`}
              >
                <SmartImage
                  sources={coverSources(apartment)}
                  alt={apartment.name}
                  placeholderLabel={apartment.name.charAt(0)}
                  className="h-full w-full"
                />
              </ParallaxCover>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-ink py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 animate-gradient-pan bg-[linear-gradient(120deg,rgba(14,165,233,0.35),transparent_45%,rgba(56,189,248,0.3))] bg-[length:200%_200%]" />
        <div className="container-page relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <h2 className="max-w-2xl font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
              <AnimatedWords text={t('cta.title')} />
            </h2>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-sea-100/85">{t('cta.text')}</p>
            </Reveal>
            <Reveal delay={0.25}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Magnetic>
                  <ButtonAnchor href={site.phone.href} size="lg">
                    <Phone className="h-4 w-4" />
                    {site.phone.display}
                  </ButtonAnchor>
                </Magnetic>
                <ButtonLink to="/apartments" variant="light" size="lg">
                  {t('hero.cta.primary')}
                  <ArrowUpRight className="h-4 w-4" />
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2} direction="left">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-7 backdrop-blur">
              <p className="font-display text-5xl font-semibold text-white">
                <Counter value={videoCount()} />
              </p>
              <p className="mt-2 text-sm text-sea-100/80">{t('detail.videos.subtitle')}</p>
              <a
                href={site.socials.youtube}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sea-300"
              >
                {t('contact.follow')}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
