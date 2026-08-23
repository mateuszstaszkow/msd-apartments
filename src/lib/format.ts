import type { Locale } from '@/types';

const localeTag: Record<Locale, string> = { en: 'en-GB', pl: 'pl-PL' };

export function formatPrice(
  amount: number,
  currency: 'PLN' | 'EUR',
  locale: Locale,
  options: { compact?: boolean } = {},
): string {
  return new Intl.NumberFormat(localeTag[locale], {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    notation: options.compact ? 'compact' : 'standard',
  }).format(amount);
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeTag[locale]).format(value);
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function mapsUrl(lat: number, lng: number, label: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`;
}
