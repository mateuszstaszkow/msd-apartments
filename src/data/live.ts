import { useMemo, useSyncExternalStore } from 'react';
import type { Apartment } from '@/types';
import { apartments as staticApartments } from '@/data/apartments';
import { site } from '@/data/site';

/** One row of `apartment_overrides` in Supabase (see supabase/schema.sql). */
export interface ApartmentOverride {
  slug: string;
  price: number | null;
  listing_url: string | null;
  status: 'free' | 'rented' | null;
  rented_until: string | null;
}

const CACHE_KEY = 'msd-overrides';
const { url, anonKey } = site.supabase;

export const liveDataEnabled = Boolean(url && anonKey);

let overrides: ApartmentOverride[] = readCache();
const listeners = new Set<() => void>();

function readCache(): ApartmentOverride[] {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) ?? '[]') as ApartmentOverride[];
  } catch {
    return [];
  }
}

export function setOverrides(next: ApartmentOverride[]): void {
  overrides = next;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(next));
  } catch {
    /* private mode — the cache is only a speed-up */
  }
  listeners.forEach((listener) => listener());
}

export async function fetchOverrides(): Promise<ApartmentOverride[]> {
  const response = await fetch(`${url}/rest/v1/apartment_overrides?select=*`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  if (!response.ok) throw new Error(`Supabase responded ${response.status}`);
  return (await response.json()) as ApartmentOverride[];
}

if (liveDataEnabled && typeof window !== 'undefined') {
  fetchOverrides()
    .then(setOverrides)
    .catch(() => {
      /* offline or Supabase down: keep the cached or built-in values */
    });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function applyOverride(apartment: Apartment, row: ApartmentOverride | undefined): Apartment {
  if (!row) return apartment;
  const merged: Apartment = { ...apartment };
  if (row.price !== null) merged.price = row.price;
  if (row.listing_url) merged.listingUrl = row.listing_url;
  if (row.status === 'free') {
    merged.rented = false;
    merged.rentedUntil = undefined;
  } else if (row.status === 'rented') {
    merged.rented = true;
    merged.rentedUntil = row.rented_until ?? undefined;
  }
  return merged;
}

/** The catalogue with prices, listing links and lease status from the admin panel applied. */
export function useApartments(): Apartment[] {
  const rows = useSyncExternalStore(subscribe, () => overrides, () => overrides);
  return useMemo(
    () => staticApartments.map((apartment) => applyOverride(apartment, rows.find((row) => row.slug === apartment.slug))),
    [rows],
  );
}

export function useApartment(slug: string | undefined): Apartment | undefined {
  const all = useApartments();
  return slug ? all.find((apartment) => apartment.slug === slug) : undefined;
}
