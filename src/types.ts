export type Locale = 'en' | 'pl';

export type Localized = Record<Locale, string>;

export type OfferType = 'rent' | 'sale' | 'both';

export type AmenityKey =
  | 'wifi'
  | 'parking'
  | 'seaView'
  | 'balcony'
  | 'terrace'
  | 'garden'
  | 'kitchen'
  | 'dishwasher'
  | 'washingMachine'
  | 'tv'
  | 'airCon'
  | 'elevator'
  | 'workspace'
  | 'pool'
  | 'bbq'
  | 'petFriendly';

export interface ApartmentVideos {
  /** YouTube id of the cinematic presentation video. */
  presentation?: string;
  /** YouTube id of the first-person walkthrough. */
  pov?: string;
}

export interface Apartment {
  slug: string;
  /** Nickname used by MSD, e.g. "Żagiel". */
  name: string;
  tagline: Localized;
  description: Localized;
  city: string;
  region: Localized;
  country: 'PL' | 'ES';
  street: string;
  /** Walking distance to the beach in minutes. */
  beachMinutes: number;
  area: number;
  rooms: number;
  guests: number;
  beds: number;
  bathrooms: number;
  floor: Localized;
  offer: OfferType;
  /** Nightly rate in PLN (Koszalin) or EUR (Costa del Sol). */
  pricePerNight: number;
  currency: 'PLN' | 'EUR';
  /** Asking price when the apartment is also for sale. */
  salePrice?: number;
  amenities: AmenityKey[];
  highlights: Localized[];
  videos: ApartmentVideos;
  /** Coordinates used for the map link. */
  coords: { lat: number; lng: number };
  featured?: boolean;
  /** Set to false once real photos land in /public/apartments/<slug>/. */
  photosPending?: boolean;
}
