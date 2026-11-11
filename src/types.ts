export type Locale = 'en' | 'pl';

export type Localized = Record<Locale, string>;

export type OfferType = 'rent' | 'sale' | 'both';

/** Long-term flats are let by the month, holiday flats by the night. */
export type RentPeriod = 'month' | 'night';

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
  | 'petFriendly'
  | 'furnished'
  | 'cellar'
  | 'intercom'
  | 'districtHeating'
  | 'jacuzzi'
  | 'gym'
  | 'sauna';

export interface ApartmentVideos {
  /** YouTube id of the cinematic presentation video. */
  presentation?: string;
  /** YouTube id of the first-person walkthrough. */
  pov?: string;
  /** The films are 9:16 Shorts, so they cannot fill the 16:9 hero background. */
  vertical?: boolean;
  /**
   * Landscape still under /public shown instead of the presentation's YouTube
   * thumbnail, which for a Short is a narrow frame on a blurred background.
   */
  poster?: string;
}

export interface Apartment {
  slug: string;
  /** Nickname used by MSD, e.g. "Żagiel". */
  name: string;
  tagline: Localized;
  description: Localized;
  city: string;
  /** Neighbourhood, e.g. "Przylesie". */
  district?: Localized;
  region: Localized;
  country: 'PL' | 'ES';
  street: string;
  /** Time to the nearest beach. Koszalin is a drive away; a resort may be a walk. */
  beach?: { minutes: number; mode: 'walk' | 'car' };
  /** Walk to the main campus of Koszalin University of Technology (ul. Śniadeckich 2). */
  campusMinutes?: number;
  /** "200 m to the ZUS stop" style lines taken from the listing. */
  nearby?: Localized[];
  area: number;
  rooms: number;
  /** How many people the flat is meant for. */
  guests: number;
  beds: number;
  bathrooms: number;
  floor?: Localized;
  offer: OfferType;
  rentPeriod: RentPeriod;
  /** Rent, in the unit given by `rentPeriod`. */
  price: number;
  /** Monthly charge paid on to the housing co-op, on top of the rent. */
  serviceCharge?: number;
  /** Refundable deposit. */
  deposit?: number;
  /** ISO date from which the flat is free. */
  availableFrom?: string;
  /** A tenant lives there now; enquiries are about the next opening. */
  rented?: boolean;
  /** ISO date the current lease ends, when known. */
  rentedUntil?: string;
  /** External listing (OLX, Otodom, Booking.com…). */
  listingUrl?: string;
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
