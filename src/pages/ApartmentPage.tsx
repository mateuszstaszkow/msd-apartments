import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  CalendarCheck,
  Check,
  Footprints,
  KeyRound,
  MapPin,
  Maximize2,
  Phone,
  Receipt,
  Share2,
  Users,
  Wallet,
  WavesHorizontal,
} from 'lucide-react';
import { apartments, coverSources, getApartment, photoPaths } from '@/data/apartments';
import { site } from '@/data/site';
import { useI18n } from '@/i18n';
import { cx, formatDate, formatPrice, mapsUrl } from '@/lib/format';
import { usePageMeta, useReducedMotionPreference } from '@/lib/hooks';
import { amenityIcons } from '@/components/apartments/amenityIcons';
import { Gallery } from '@/components/media/Gallery';
import { VideoFacade } from '@/components/media/VideoFacade';
import { thumbnailSources } from '@/lib/youtube';
import { ButtonAnchor, ButtonLink } from '@/components/ui/Button';
import { AnimatedWords, Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { SmartImage } from '@/components/ui/SmartImage';

export function ApartmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const apartment = slug ? getApartment(slug) : undefined;
  const { t, tl, locale } = useI18n();
  const reduced = useReducedMotionPreference();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 700], [0, 160]);
  const heroScale = useTransform(scrollY, [0, 700], [1, 1.14]);
  const [copied, setCopied] = useState(false);

  usePageMeta(
    apartment ? `${apartment.name} — MSD Apartments` : 'MSD Apartments',
    apartment ? apartment.description.en.slice(0, 155) : undefined,
  );

  if (!apartment) {
    return (
      <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-40 text-center">
        <h1 className="font-display text-3xl font-semibold">{t('detail.notFound')}</h1>
        <ButtonLink to="/apartments" className="mt-8">
          {t('detail.notFound.cta')}
        </ButtonLink>
      </section>
    );
  }

  const index = apartments.findIndex((item) => item.slug === apartment.slug);
  const next = apartments[(index + 1) % apartments.length];
  const monthly = apartment.rentPeriod === 'month';
  const money = (value: number) => formatPrice(value, apartment.currency, locale);

  const facts = [
    { icon: Maximize2, label: t('facts.area'), value: `${apartment.area} m²` },
    { icon: BedDouble, label: t('facts.rooms'), value: String(apartment.rooms) },
    {
      icon: Users,
      label: t(monthly ? 'facts.people' : 'facts.guests'),
      value: t(monthly ? 'card.people' : 'card.guests', { n: apartment.guests }),
    },
    { icon: Bath, label: t('facts.bathrooms'), value: String(apartment.bathrooms) },
    apartment.floor && { icon: Building2, label: t('facts.floor'), value: tl(apartment.floor) },
    apartment.beach && {
      icon: WavesHorizontal,
      label: t('facts.beach'),
      value: t(apartment.beach.mode === 'car' ? 'facts.minutes.car' : 'facts.minutes', {
        n: apartment.beach.minutes,
      }),
    },
    apartment.serviceCharge !== undefined && {
      icon: Receipt,
      label: t('facts.serviceCharge'),
      value: t('facts.perMonth', { v: money(apartment.serviceCharge) }),
    },
    apartment.deposit !== undefined && {
      icon: Wallet,
      label: t('facts.deposit'),
      value: money(apartment.deposit),
    },
    apartment.availableFrom && {
      icon: CalendarCheck,
      label: t('facts.availableFrom'),
      value: formatDate(apartment.availableFrom, locale),
    },
  ].filter((fact) => typeof fact === 'object');

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `${apartment!.name} — MSD Apartments`, url });
        return;
      } catch {
        /* the visitor dismissed the share sheet */
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative h-[78svh] min-h-[520px] overflow-hidden">
        <motion.div style={reduced ? undefined : { y: heroY, scale: heroScale }} className="absolute inset-0">
          <SmartImage
            sources={coverSources(apartment)}
            alt={apartment.name}
            placeholderLabel={apartment.name.charAt(0)}
            eager
            className="h-full w-full"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/35 to-ink/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />

        <div className="container-page relative flex h-full flex-col justify-end pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/apartments"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {t('detail.back')}
            </Link>
          </motion.div>

          <h1 className="mt-5 font-display text-5xl font-semibold text-white sm:text-6xl lg:text-7xl">
            <AnimatedWords text={apartment.name} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-4 max-w-2xl text-lg text-sea-50/90"
          >
            {tl(apartment.tagline)}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80"
          >
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sea-300" />
              {apartment.street}, {apartment.city}
              {apartment.district && ` · ${tl(apartment.district)}`}
            </span>
            <span className="flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-sea-300" />
              {apartment.area} m²
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sea-300" />
              {t(monthly ? 'card.people' : 'card.guests', { n: apartment.guests })}
            </span>
          </motion.div>
        </div>
      </section>

      {/* --------------------------------------------------- Description + card */}
      <section className="bg-white pb-20 pt-14 lg:pb-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
          <div>
            <Reveal>
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">{t('detail.about')}</h2>
              <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
                {tl(apartment.description)}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <h3 className="mt-12 font-display text-lg font-semibold">{t('detail.highlights')}</h3>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {apartment.highlights.map((highlight) => (
                  <li
                    key={highlight.en}
                    className="flex items-start gap-3 rounded-xl border border-sea-100 bg-sea-50/50 px-4 py-3 text-sm text-ink-soft"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-sea-500" />
                    {tl(highlight)}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <h3 className="mt-12 font-display text-lg font-semibold">{t('detail.facts')}</h3>
              <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="rounded-2xl border border-sea-100 bg-white p-4 transition duration-500 hover:-translate-y-1 hover:border-sea-300 hover:shadow-soft"
                  >
                    <fact.icon className="h-5 w-5 text-sea-500" />
                    <dt className="mt-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 font-display text-base font-semibold text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={0.18}>
              <h3 className="mt-12 font-display text-lg font-semibold">{t('detail.amenities')}</h3>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {apartment.amenities.map((amenity) => {
                  const Icon = amenityIcons[amenity];
                  return (
                    <li
                      key={amenity}
                      className="group flex items-center gap-2 rounded-full border border-sea-100 bg-white px-4 py-2.5 text-sm text-ink-soft transition duration-300 hover:border-sea-400 hover:bg-sea-50"
                    >
                      <Icon className="h-4 w-4 text-sea-500" />
                      {t(`amenity.${amenity}` as 'amenity.wifi')}
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            {apartment.nearby && (
              <Reveal delay={0.22}>
                <h3 className="mt-12 font-display text-lg font-semibold">{t('detail.nearby')}</h3>
                <ul className="mt-5 space-y-3">
                  {apartment.nearby.map((item) => (
                    <li key={item.en} className="flex items-start gap-3 text-sm text-ink-soft">
                      <Footprints className="mt-0.5 h-4 w-4 shrink-0 text-sea-500" />
                      {tl(item)}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>

          {/* Sticky booking card */}
          <div className="lg:relative">
            <motion.aside
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel sticky top-28 rounded-3xl p-6 shadow-card sm:p-7"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {t(monthly ? 'card.rent' : 'card.from')}
              </p>
              <p className="mt-1 flex items-baseline gap-2">
                <span className="font-display text-4xl font-semibold text-ink">
                  {money(apartment.price)}
                </span>
                <span className="text-sm text-ink-muted">
                  {t(monthly ? 'card.month' : 'card.night')}
                </span>
              </p>
              {apartment.serviceCharge !== undefined && (
                <p className="mt-1.5 text-sm text-ink-muted">
                  {t('card.serviceCharge', { v: money(apartment.serviceCharge) })}
                </p>
              )}

              {apartment.rented && (
                <div className="mt-5 rounded-2xl border border-sea-200 bg-white/80 p-4">
                  <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sea-700">
                    <KeyRound className="h-3.5 w-3.5" />
                    {t('detail.rented')}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{t('detail.rented.text')}</p>
                </div>
              )}

              {apartment.salePrice && (
                <div className="mt-5 rounded-2xl border border-sea-100 bg-sea-50/70 p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sea-700">
                    {t('detail.sale')}
                  </p>
                  <p className="mt-1 font-display text-xl font-semibold text-ink">
                    {formatPrice(apartment.salePrice, apartment.currency, locale)}
                  </p>
                  <p className="text-xs text-ink-muted">{t('detail.salePrice')}</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <ButtonAnchor href={site.phone.href} size="lg" className="w-full">
                  <Phone className="h-4 w-4" />
                  {site.phone.display}
                </ButtonAnchor>
                <ButtonLink
                  to={`/contact?apartment=${apartment.slug}`}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  {t(apartment.rented ? 'detail.waitlist' : monthly ? 'detail.viewing' : 'detail.book')}
                </ButtonLink>
              </div>

              <div className="mt-6 space-y-3 border-t border-sea-100 pt-5 text-sm text-ink-soft">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-sea-500" />
                  {t(monthly ? 'detail.location.viewing' : 'detail.location.text')}
                </p>
                <a
                  href={mapsUrl(apartment.coords.lat, apartment.coords.lng, `${apartment.street}, ${apartment.city}`)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline inline-flex items-center gap-1.5 font-semibold text-sea-700"
                >
                  {t('detail.map')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>

              <button
                type="button"
                onClick={share}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-sea-100 py-2.5 text-xs font-semibold text-ink-soft transition hover:border-sea-300 hover:text-ink"
              >
                <Share2 className="h-3.5 w-3.5" />
                {copied ? t('detail.copied') : t('detail.share')}
              </button>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Gallery */}
      <section className="bg-sea-50/60 py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow={t('detail.gallery')}
            title={`${apartment.name} — ${t('detail.gallery.subtitle')}`}
          />
          {apartment.photosPending && (
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl rounded-2xl border border-dashed border-sea-300 bg-white/70 px-5 py-4 text-sm text-ink-soft">
                {t('detail.gallery.pending')}
              </p>
            </Reveal>
          )}

          <div className="mt-10">
            <Gallery
              photos={photoPaths(apartment.slug)}
              fallbacks={
                apartment.videos.presentation || apartment.videos.pov
                  ? thumbnailSources((apartment.videos.presentation ?? apartment.videos.pov)!)
                  : []
              }
              alt={apartment.name}
              initial={apartment.name.charAt(0)}
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------------- Videos */}
      <section className="bg-white py-20 lg:py-24">
        <div className="container-page">
          <SectionHeading eyebrow={t('detail.videos')} title={t('detail.videos.subtitle')} />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {(['presentation', 'pov'] as const).map((kind) => {
              const id = apartment.videos[kind];
              const label = t(`detail.video.${kind}` as 'detail.video.pov');

              return id ? (
                <Reveal key={kind} delay={kind === 'pov' ? 0.1 : 0}>
                  <VideoFacade videoId={id} title={`${apartment.name} — ${label}`} label={label} />
                </Reveal>
              ) : (
                <Reveal key={kind} delay={kind === 'pov' ? 0.1 : 0}>
                  <div className="flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-sea-200 bg-sea-50/60 p-8 text-center">
                    <span className="rounded-full border border-sea-200 bg-white px-3.5 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-sea-700">
                      {label}
                    </span>
                    <p className="max-w-xs text-sm text-ink-soft">{t('detail.video.pending')}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Next apartment */}
      <section className="relative overflow-hidden bg-ink">
        <Link to={`/apartments/${next.slug}`} className="group block">
          <div className="relative h-[46svh] min-h-[340px]">
            <SmartImage
              sources={coverSources(next)}
              alt={next.name}
              placeholderLabel={next.name.charAt(0)}
              className="absolute inset-0 h-full w-full"
              imgClassName="opacity-60 transition-[transform,opacity] duration-[1400ms] ease-out group-hover:scale-105 group-hover:opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <div className="container-page relative flex h-full flex-col items-start justify-end pb-14">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-sea-300">
                {t('detail.next')}
              </span>
              <span className="mt-3 flex items-center gap-4 font-display text-4xl font-semibold text-white sm:text-5xl">
                {next.name}
                <span
                  className={cx(
                    'flex h-12 w-12 items-center justify-center rounded-full border border-white/30',
                    'text-white transition-transform duration-500 group-hover:translate-x-2 group-hover:bg-white group-hover:text-sea-700',
                  )}
                >
                  <ArrowRight className="h-5 w-5" />
                </span>
              </span>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}
