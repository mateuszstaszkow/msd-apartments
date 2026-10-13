import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Clapperboard,
  Handshake,
  KeyRound,
  MapPin,
  Phone,
  CirclePlay,
  Sparkles,
} from 'lucide-react';
import { apartments, coverSources, videoCount } from '@/data/apartments';
import { site, stats } from '@/data/site';
import { useI18n } from '@/i18n';
import { usePageMeta } from '@/lib/hooks';
import { cx } from '@/lib/format';
import { BackgroundVideo } from '@/components/media/BackgroundVideo';
import { VideoLightbox } from '@/components/media/VideoLightbox';
import { thumbnailSources } from '@/lib/youtube';
import { ApartmentCard } from '@/components/apartments/ApartmentCard';
import { Button, ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { Counter } from '@/components/ui/Counter';
import { Magnetic } from '@/components/ui/Magnetic';
import { Marquee } from '@/components/ui/Marquee';
import { ParallaxCover } from '@/components/ui/Parallax';
import { AnimatedWords, Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';

const heroFilms = apartments
  .filter((apartment) => !apartment.videos.vertical)
  .map((apartment) => apartment.videos.presentation)
  .filter((id): id is string => Boolean(id));

const reel = apartments.flatMap((apartment) =>
  (['presentation', 'pov'] as const)
    .filter((kind) => apartment.videos[kind])
    .map((kind) => ({ apartment, kind, id: apartment.videos[kind]! })),
);

export function HomePage() {
  const { t, tl } = useI18n();
  const [film, setFilm] = useState<string | null>(null);
  const featured = apartments.filter((apartment) => apartment.featured).slice(0, 3);
  const balticCount = apartments.filter((apartment) => apartment.country === 'PL').length;
  const spainCount = apartments.filter((apartment) => apartment.country === 'ES').length;

  usePageMeta(
    'MSD Apartments — Seaside apartments for rent & sale',
    'Property rental and selling in cities near the sea since 2019. Seven apartments in Koszalin by the Baltic Sea and one on Costa del Sol.',
  );

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden">
        <BackgroundVideo
          videoId={heroFilms[0]}
          playlist={heroFilms}
          posterAlt="MSD Apartments seaside apartment"
        />

        <div className="container-page relative z-10 pb-28 pt-36 sm:pb-32 lg:pb-40">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-sea-300" />
            {t('hero.eyebrow')}
          </motion.span>

          <h1 className="mt-7 max-w-4xl font-display text-[2.6rem] font-semibold leading-[1.03] text-white sm:text-6xl lg:text-[4.6rem]">
            <AnimatedWords text={t('hero.title.line1')} delay={0.45} />
            <br />
            <AnimatedWords
              text={t('hero.title.highlight')}
              delay={0.75}
              wordClassName="bg-gradient-to-r from-sea-200 via-white to-sea-300 bg-clip-text text-transparent"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-sea-50/90 sm:text-lg"
          >
            {t('hero.lead')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic>
              <ButtonLink to="/apartments" size="lg">
                {t('hero.cta.primary')}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </ButtonLink>
            </Magnetic>
            <Button variant="light" size="lg" onClick={() => setFilm(heroFilms[0])}>
              <CirclePlay className="h-5 w-5" />
              {t('hero.cta.secondary')}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.9 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/80"
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sea-300" />
              {t('hero.badge.baltic')}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sea-300" />
              {t('hero.badge.costa')}
            </span>
            <span className="flex items-center gap-2">
              <Clapperboard className="h-4 w-4 text-sea-300" />
              {t('hero.films', { n: videoCount() })}
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="absolute bottom-9 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
        >
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/60">
            {t('hero.scroll')}
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-white/25">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-white"
              animate={{ y: [-16, 48] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      </section>

      {/* ------------------------------------------------------- Name marquee */}
      <section className="border-y border-sea-100 bg-white py-6">
        <Marquee speed="slow">
          {apartments.map((apartment) => (
            <Link
              key={apartment.slug}
              to={`/apartments/${apartment.slug}`}
              className="group flex shrink-0 items-center gap-4 px-7"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-sea-300 transition group-hover:bg-sea-500" />
              <span className="font-display text-xl font-medium text-ink-muted transition-colors duration-300 group-hover:text-sea-600 sm:text-2xl">
                {apartment.name}
              </span>
            </Link>
          ))}
        </Marquee>
      </section>

      {/* --------------------------------------------------------------- Stats */}
      <section className="bg-white py-16 lg:py-20">
        <div className="container-page grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-10">
          {stats.map((stat, index) => (
            <Reveal key={stat.key} delay={index * 0.08}>
              <div className="border-l-2 border-sea-100 pl-5">
                <p className="font-display text-4xl font-semibold text-ink sm:text-5xl">
                  <Counter value={stat.value} suffix={stat.suffix} plain={stat.key === 'since'} />
                </p>
                <p className="mt-2 text-sm text-ink-soft">
                  {t(`stats.${stat.key}` as 'stats.since')}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* --------------------------------------------------------------- About */}
      <section className="relative overflow-hidden bg-sea-gradient py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-sea-200/50 blur-3xl" />
        <div className="container-page relative grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <ParallaxCover className="aspect-[4/5] w-full rounded-[2rem] shadow-card">
              <SmartImage
                sources={coverSources(apartments[0])}
                alt={apartments[0].name}
                placeholderLabel={apartments[0].name.charAt(0)}
                className="h-full w-full"
              />
            </ParallaxCover>

            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -6 }}
              whileInView={{ opacity: 1, y: 0, rotate: -4 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-8 -right-4 w-44 overflow-hidden rounded-2xl border-4 border-white shadow-card sm:w-56 lg:-right-10"
            >
              <SmartImage
                sources={coverSources(apartments[apartments.length - 1])}
                alt={apartments[apartments.length - 1].name}
                placeholderLabel={apartments[apartments.length - 1].name.charAt(0)}
                className="aspect-square w-full"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="absolute -left-3 top-8 rounded-2xl bg-white/90 px-5 py-4 shadow-soft backdrop-blur lg:-left-8"
            >
              <p className="font-display text-3xl font-semibold text-sea-600">
                {site.foundedYear}
              </p>
              <p className="text-[0.7rem] uppercase tracking-[0.16em] text-ink-muted">
                {t('stats.since')}
              </p>
            </motion.div>
          </div>

          <div>
            <SectionHeading eyebrow={t('about.eyebrow')} title={t('about.title')} />
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-ink-soft">{t('about.p1')}</p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-4 text-base leading-relaxed text-ink-soft">{t('about.p2')}</p>
            </Reveal>

            <div className="mt-9 space-y-4">
              {[
                { icon: Handshake, title: t('about.point1.title'), text: t('about.point1.text') },
                { icon: Camera, title: t('about.point2.title'), text: t('about.point2.text') },
                { icon: KeyRound, title: t('about.point3.title'), text: t('about.point3.text') },
              ].map((point, index) => (
                <Reveal key={point.title} delay={0.2 + index * 0.08} direction="left">
                  <div className="group flex gap-4 rounded-2xl border border-white/70 bg-white/70 p-4 backdrop-blur transition duration-500 hover:border-sea-200 hover:shadow-soft">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sea-100 text-sea-600 transition duration-500 group-hover:bg-sea-600 group-hover:text-white">
                      <point.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold">{point.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">{point.text}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.45}>
              <ButtonLink to="/about" variant="secondary" className="mt-9">
                {t('about.cta')}
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ Featured */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow={t('featured.eyebrow')}
            title={t('featured.title')}
            subtitle={t('featured.subtitle')}
            action={
              <ButtonLink to="/apartments" variant="secondary">
                {t('featured.cta')}
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {featured.map((apartment, index) => (
              <ApartmentCard key={apartment.slug} apartment={apartment} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Film reel */}
      <section className="relative overflow-hidden bg-ink py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(14,165,233,0.28),transparent_55%)]" />
        <div className="container-page relative">
          <SectionHeading
            eyebrow={t('films.eyebrow')}
            title={t('films.title', { n: reel.length })}
            subtitle={t('detail.videos.subtitle')}
            tone="light"
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {reel.map(({ apartment, kind, id }, index) => (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => setFilm(id)}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: Math.min(index, 5) * 0.07 }}
                  className={cx(
                    'group relative aspect-video overflow-hidden rounded-2xl border border-white/10 text-left outline-none ring-sea-400 focus-visible:ring-2',
                    index === 0 && 'sm:col-span-2 sm:row-span-2 sm:aspect-[16/10]',
                  )}
                >
                  <SmartImage
                    sources={thumbnailSources(id)}
                    alt={`${apartment.name} — ${t(`detail.video.${kind}` as 'detail.video.pov')}`}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-85 transition-opacity duration-500 group-hover:opacity-70" />

                  <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur transition duration-500 group-hover:scale-110 group-hover:bg-white group-hover:text-sea-700">
                    <CirclePlay className="h-5 w-5" />
                  </span>

                  <span className="absolute inset-x-4 bottom-4">
                    <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-sea-300">
                      {t(`detail.video.${kind}` as 'detail.video.pov')}
                    </span>
                    <span className="mt-1 block font-display text-lg font-semibold text-white">
                      {apartment.name}
                    </span>
                  </span>
                </motion.button>
              ))}
          </div>

          <Reveal delay={0.2} className="mt-10">
            <ButtonAnchor
              href={site.socials.youtube}
              target="_blank"
              rel="noreferrer noopener"
              variant="light"
            >
              {t('contact.follow')}
              <ArrowUpRight className="h-4 w-4" />
            </ButtonAnchor>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------ Locations */}
      <section className="bg-white py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow={t('locations.eyebrow')}
            title={t('locations.title')}
            align="center"
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:gap-8">
            {[
              {
                title: t('locations.baltic.title'),
                text: t('locations.baltic.text'),
                count: balticCount,
                apartment: apartments[0],
              },
              {
                title: t('locations.costa.title'),
                text: t('locations.costa.text'),
                count: spainCount,
                apartment: apartments[apartments.length - 1],
              },
            ].map((location, index) => (
              <Reveal key={location.title} delay={index * 0.12} direction={index === 0 ? 'right' : 'left'}>
                <article className="group relative h-full overflow-hidden rounded-[2rem] shadow-card">
                  <SmartImage
                    sources={coverSources(location.apartment)}
                    alt={location.title}
                    placeholderLabel={location.apartment.name.charAt(0)}
                    className="aspect-[4/3] w-full lg:aspect-[5/4]"
                    imgClassName="transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
                  <div className="absolute inset-x-6 bottom-6 lg:inset-x-9 lg:bottom-9">
                    <span className="rounded-full border border-white/30 bg-white/15 px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">
                      {location.count === 1
                        ? t('locations.apartment', { n: location.count })
                        : t('locations.apartments', { n: location.count })}
                    </span>
                    <h3 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                      {location.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
                      {location.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Process */}
      <section className="bg-sea-50/60 py-20 lg:py-28">
        <div className="container-page">
          <SectionHeading eyebrow={t('process.eyebrow')} title={t('process.title')} align="center" />

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((step, index) => (
              <Reveal key={step} delay={index * 0.1}>
                <div className="group relative h-full overflow-hidden rounded-2xl border border-sea-100 bg-white p-7 transition duration-500 hover:-translate-y-1.5 hover:border-sea-300 hover:shadow-card">
                  <span className="absolute -right-3 -top-5 font-display text-[5.5rem] font-bold leading-none text-sea-50 transition-colors duration-500 group-hover:text-sea-100">
                    {step}
                  </span>
                  <div className="relative">
                    <h3 className="font-display text-lg font-semibold">
                      {t(`process.step${step}.title` as 'process.step1.title')}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {t(`process.step${step}.text` as 'process.step1.text')}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA band */}
      <section className="relative overflow-hidden bg-ink py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 animate-gradient-pan bg-[linear-gradient(120deg,rgba(14,165,233,0.35),rgba(11,34,57,0)_45%,rgba(56,189,248,0.3))] bg-[length:200%_200%]" />
        <div className="container-page relative text-center">
          <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            <AnimatedWords text={t('cta.title')} />
          </h2>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-sea-100/85">
              {t('cta.text')}
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Magnetic>
                <ButtonAnchor href={site.phone.href} size="lg">
                  <Phone className="h-4 w-4" />
                  {site.phone.display}
                </ButtonAnchor>
              </Magnetic>
              <ButtonLink to="/contact" variant="light" size="lg">
                {t('cta.write')}
                <ArrowUpRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <VideoLightbox
        videoId={film}
        title={film ? apartmentTitleForFilm(film, tl) : undefined}
        onClose={() => setFilm(null)}
      />
    </>
  );
}

function apartmentTitleForFilm(id: string, tl: (value: { en: string; pl: string }) => string) {
  const match = apartments.find(
    (apartment) => apartment.videos.presentation === id || apartment.videos.pov === id,
  );
  return match ? `${match.name} — ${tl(match.tagline)}` : undefined;
}
