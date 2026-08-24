/**
 * Single source of truth for company details.
 */
export const site = {
  name: 'MSD Apartments',
  foundedYear: 2019,
  phone: {
    display: '+48 506 356 937',
    href: 'tel:+48506356937',
    whatsapp: 'https://wa.me/48506356937',
    /** Who picks up — shown next to the number on the contact page. */
    contact: 'Mirosław',
  },
  email: {
    display: 'msdapartments@gmail.com',
    href: 'mailto:msdapartments@gmail.com',
  },
  office: {
    street: 'ul. Fińska 50',
    city: '75-430 Koszalin',
    country: 'Poland',
    mapsUrl: 'https://maps.google.com/?q=Fi%C5%84ska+50,+75-430+Koszalin,+Poland',
    coords: { lat: 54.2216, lng: 16.1737 },
  },
  /** `null` means closed; the UI translates it. */
  hours: {
    weekdays: '08:00 – 16:00',
    saturday: null,
    sunday: null,
  },
  socials: {
    youtube: 'https://www.youtube.com/@msdapartments6010',
  },
  /** Response promise advertised on the contact page. */
  responseTimeHours: 2,
} as const;

export const stats = [
  { value: 2019, suffix: '', key: 'since' },
  { value: 8, suffix: '', key: 'apartments' },
  { value: 2, suffix: '', key: 'countries' },
  { value: 1200, suffix: '+', key: 'guests' },
] as const;
