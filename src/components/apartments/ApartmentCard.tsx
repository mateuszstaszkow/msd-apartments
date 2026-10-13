import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  BedDouble,
  Building2,
  MapPin,
  Maximize2,
  CirclePlay,
  Users,
  WavesHorizontal,
} from 'lucide-react';
import type { Apartment } from '@/types';
import { coverSources } from '@/data/apartments';
import { useI18n } from '@/i18n';
import { cx, formatPrice } from '@/lib/format';
import { SmartImage } from '@/components/ui/SmartImage';

interface ApartmentCardProps {
  apartment: Apartment;
  index?: number;
  /** Wider hero-style card used for the first featured item. */
  size?: 'default' | 'tall';
}

export function ApartmentCard({ apartment, index = 0, size = 'default' }: ApartmentCardProps) {
  const { t, tl, locale } = useI18n();
  const filmCount = [apartment.videos.presentation, apartment.videos.pov].filter(Boolean).length;
  const monthly = apartment.rentPeriod === 'month';

  return (
    <motion.article
      initial={{ opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: Math.min(index, 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <Link
        to={`/apartments/${apartment.slug}`}
        className="card-hover flex h-full flex-col overflow-hidden rounded-3xl border border-sea-100 bg-white shadow-soft outline-none ring-sea-400 focus-visible:ring-2"
      >
        <div className={cx('relative overflow-hidden', size === 'tall' ? 'aspect-[4/5]' : 'aspect-[4/3]')}>
          <SmartImage
            sources={coverSources(apartment)}
            alt={`${apartment.name} — ${tl(apartment.tagline)}`}
            placeholderLabel={apartment.name.charAt(0)}
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-[1300ms] ease-out group-hover:scale-[1.09]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-ink/25" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/95 via-ink/65 to-transparent" />

          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              {t(`catalogue.offer.${apartment.offer}` as 'catalogue.offer.rent')}
            </span>
            {apartment.rented && (
              <span className="rounded-full bg-white px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-sea-700 shadow-soft">
                {t('card.rented')}
              </span>
            )}
            {filmCount > 0 && (
              <span className="flex items-center gap-1.5 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
                <CirclePlay className="h-3.5 w-3.5" />
                {filmCount}
              </span>
            )}
          </div>

          <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-white">
            <div>
              <h3 className="font-display text-2xl font-semibold leading-tight drop-shadow-sm">
                {apartment.name}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/85">
                <MapPin className="h-3.5 w-3.5" />
                {apartment.city}, {tl(apartment.region)}
              </p>
            </div>
            <span className="flex h-11 w-11 shrink-0 translate-y-2 items-center justify-center rounded-full bg-white text-sea-700 opacity-0 shadow-glow transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-sm leading-relaxed text-ink-soft">{tl(apartment.tagline)}</p>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm text-ink-soft">
            <Fact icon={<Maximize2 className="h-4 w-4" />} value={`${apartment.area} m²`} />
            <Fact
              icon={<Users className="h-4 w-4" />}
              value={t(monthly ? 'card.people' : 'card.guests', { n: apartment.guests })}
            />
            <Fact
              icon={<BedDouble className="h-4 w-4" />}
              value={t(apartment.rooms === 1 ? 'card.rooms.one' : 'card.rooms', { n: apartment.rooms })}
            />
            {apartment.floor && <Fact icon={<Building2 className="h-4 w-4" />} value={tl(apartment.floor)} />}
            {apartment.beach && (
              <Fact
                icon={<WavesHorizontal className="h-4 w-4" />}
                value={t(apartment.beach.mode === 'car' ? 'card.beach.car' : 'card.beach', {
                  n: apartment.beach.minutes,
                })}
                wide
              />
            )}
          </dl>

          <div className="mt-6 flex items-end justify-between border-t border-sea-100 pt-5">
            <p className="text-ink">
              <span className="text-xs uppercase tracking-[0.14em] text-ink-muted">
                {t(monthly ? 'card.rent' : 'card.from')}
              </span>
              <br />
              <span className="font-display text-xl font-semibold">
                {formatPrice(apartment.price, apartment.currency, locale)}
              </span>
              <span className="ml-1 text-sm text-ink-muted">
                {t(monthly ? 'card.month' : 'card.night')}
              </span>
              {apartment.serviceCharge !== undefined && (
                <>
                  <br />
                  <span className="text-xs text-ink-muted">
                    {t('card.serviceCharge', {
                      v: formatPrice(apartment.serviceCharge, apartment.currency, locale),
                    })}
                  </span>
                </>
              )}
            </p>
            <span className="link-underline text-sm font-semibold text-sea-700">
              {t('card.explore')}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function Fact({ icon, value, wide }: { icon: React.ReactNode; value: string; wide?: boolean }) {
  return (
    <div className={cx('flex items-center gap-2', wide && 'col-span-2')}>
      <span className="shrink-0 text-sea-500">{icon}</span>
      <span>{value}</span>
    </div>
  );
}
