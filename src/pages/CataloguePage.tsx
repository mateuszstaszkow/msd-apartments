import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { apartments } from '@/data/apartments';
import { useI18n } from '@/i18n';
import { cx } from '@/lib/format';
import { usePageMeta } from '@/lib/hooks';
import { ApartmentCard } from '@/components/apartments/ApartmentCard';
import { Button } from '@/components/ui/Button';
import { AnimatedWords, Reveal } from '@/components/ui/Reveal';

type LocationFilter = 'all' | 'PL' | 'ES';
type OfferFilter = 'all' | 'rent' | 'sale';
type GuestFilter = 'all' | 2 | 4 | 6;
type SortKey = 'featured' | 'priceAsc' | 'priceDesc' | 'area';

export function CataloguePage() {
  const { t } = useI18n();
  const [location, setLocation] = useState<LocationFilter>('all');
  const [offer, setOffer] = useState<OfferFilter>('all');
  const [guests, setGuests] = useState<GuestFilter>('all');
  const [sort, setSort] = useState<SortKey>('featured');

  usePageMeta(
    'Apartments — MSD Apartments',
    'Browse eight seaside apartments in Koszalin and on Costa del Sol. Films, photos, prices and availability.',
  );

  const results = useMemo(() => {
    const filtered = apartments.filter((apartment) => {
      if (location !== 'all' && apartment.country !== location) return false;
      if (offer === 'rent' && apartment.offer === 'sale') return false;
      if (offer === 'sale' && apartment.offer === 'rent') return false;
      if (guests !== 'all' && apartment.guests < guests) return false;
      return true;
    });

    const sorters: Record<SortKey, (a: typeof filtered[number], b: typeof filtered[number]) => number> = {
      featured: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      priceAsc: (a, b) => normalise(a) - normalise(b),
      priceDesc: (a, b) => normalise(b) - normalise(a),
      area: (a, b) => b.area - a.area,
    };

    return [...filtered].sort(sorters[sort]);
  }, [location, offer, guests, sort]);

  const dirty = location !== 'all' || offer !== 'all' || guests !== 'all' || sort !== 'featured';

  function reset() {
    setLocation('all');
    setOffer('all');
    setGuests('all');
    setSort('featured');
  }

  return (
    <>
      <section className="relative overflow-hidden bg-sea-gradient pb-14 pt-36 lg:pb-20 lg:pt-44">
        <div className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-white/60 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-32 h-72 w-72 rounded-full bg-sea-200/50 blur-3xl" />

        <div className="container-page relative">
          <Reveal direction="none">
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-sea-400" />
              {t('catalogue.eyebrow')}
            </span>
          </Reveal>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            <AnimatedWords text={t('catalogue.title')} />
          </h1>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
              {t('catalogue.subtitle')}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="sticky top-[72px] z-30 border-y border-sea-100 bg-white/85 py-4 backdrop-blur-xl">
        <div className="container-page flex flex-wrap items-center gap-x-8 gap-y-4">
          <FilterGroup label={t('catalogue.filter.location')}>
            <Chip group="location" active={location === 'all'} onClick={() => setLocation('all')}>
              {t('catalogue.filter.all')}
            </Chip>
            <Chip group="location" active={location === 'PL'} onClick={() => setLocation('PL')}>
              Koszalin
            </Chip>
            <Chip group="location" active={location === 'ES'} onClick={() => setLocation('ES')}>
              Costa del Sol
            </Chip>
          </FilterGroup>

          <FilterGroup label={t('catalogue.filter.offer')}>
            <Chip group="offer" active={offer === 'all'} onClick={() => setOffer('all')}>
              {t('catalogue.filter.all')}
            </Chip>
            <Chip group="offer" active={offer === 'rent'} onClick={() => setOffer('rent')}>
              {t('catalogue.offer.rent')}
            </Chip>
            <Chip group="offer" active={offer === 'sale'} onClick={() => setOffer('sale')}>
              {t('catalogue.offer.sale')}
            </Chip>
          </FilterGroup>

          <FilterGroup label={t('catalogue.filter.guests')}>
            {(['all', 2, 4, 6] as const).map((value) => (
              <Chip
                key={value}
                group="guests"
                active={guests === value}
                onClick={() => setGuests(value)}
              >
                {value === 'all' ? t('catalogue.guests.any') : `${value}+`}
              </Chip>
            ))}
          </FilterGroup>

          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
              <SlidersHorizontal className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">{t('catalogue.filter.sort')}</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="rounded-full border border-sea-200 bg-white px-4 py-2 text-xs font-semibold normal-case tracking-normal text-ink outline-none transition focus:border-sea-400"
              >
                <option value="featured">{t('catalogue.sort.featured')}</option>
                <option value="priceAsc">{t('catalogue.sort.priceAsc')}</option>
                <option value="priceDesc">{t('catalogue.sort.priceDesc')}</option>
                <option value="area">{t('catalogue.sort.area')}</option>
              </select>
            </label>

            <AnimatePresence>
              {dirty && (
                <motion.button
                  type="button"
                  onClick={reset}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  className="flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-sea-700 transition hover:bg-sea-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('catalogue.filter.reset')}</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 lg:py-16">
        <div className="container-page">
          <motion.p
            key={results.length}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-medium text-ink-muted"
          >
            {results.length === 1
              ? t('catalogue.results.one')
              : t('catalogue.results.many', { n: results.length })}
          </motion.p>

          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 rounded-3xl border border-dashed border-sea-200 bg-sea-50/50 px-8 py-20 text-center"
            >
              <h2 className="font-display text-2xl font-semibold">{t('catalogue.empty.title')}</h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">{t('catalogue.empty.text')}</p>
              <Button onClick={reset} variant="secondary" className="mt-7">
                <RotateCcw className="h-4 w-4" />
                {t('catalogue.filter.reset')}
              </Button>
            </motion.div>
          ) : (
            <motion.div layout className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {results.map((apartment, index) => (
                  <motion.div
                    key={apartment.slug}
                    layout
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35 }}
                  >
                    <ApartmentCard apartment={apartment} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>
    </>
  );
}

/** Compares PLN and EUR prices on a rough common scale for sorting only. */
function normalise(apartment: { pricePerNight: number; currency: 'PLN' | 'EUR' }) {
  return apartment.currency === 'EUR' ? apartment.pricePerNight * 4.3 : apartment.pricePerNight;
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-[0.65rem] font-bold uppercase tracking-[0.16em] text-ink-muted xl:inline">
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  group,
  children,
}: {
  active: boolean;
  onClick: () => void;
  /** Chips sharing a group slide the highlight between each other. */
  group: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        'relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-300',
        active ? 'text-white' : 'text-ink-soft hover:text-ink',
      )}
    >
      {active && (
        <motion.span
          layoutId={`chip-${group}`}
          className="absolute inset-0 -z-10 rounded-full bg-sea-600"
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
      )}
      {!active && <span className="absolute inset-0 -z-10 rounded-full border border-sea-200" />}
      {children}
    </button>
  );
}
