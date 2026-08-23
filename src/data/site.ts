/**
 * Single source of truth for company details.
 *
 * PLACEHOLDER VALUES: phone, email, office address, NIP and the booking links below
 * are stand-ins. Replace them with the real MSD Apartments data before going live.
 */
export const site = {
  name: 'MSD Apartments',
  foundedYear: 2019,
  phone: {
    display: '+48 500 100 200',
    href: 'tel:+48500100200',
    whatsapp: 'https://wa.me/48500100200',
  },
  email: {
    display: 'kontakt@msdapartments.pl',
    href: 'mailto:kontakt@msdapartments.pl',
  },
  office: {
    street: 'ul. Zwycięstwa 24',
    city: '75-037 Koszalin',
    country: 'Poland',
    mapsUrl: 'https://maps.google.com/?q=Koszalin,+Poland',
  },
  hours: {
    weekdays: '09:00 – 19:00',
    saturday: '10:00 – 16:00',
    sunday: 'On request',
  },
  socials: {
    youtube: 'https://www.youtube.com/@msdapartments6010',
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',
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
