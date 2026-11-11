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
  /** Registered business (CEIDG) behind the MSD Apartments brand; also the data controller. */
  company: {
    legalName: 'Mateusz Staszków Software Development',
    owner: 'Mateusz Staszków',
    address: 'ul. Marcina Kasprzaka 29/2505, 01-234 Warszawa',
    nip: '6692513858',
    regon: '380518930',
  },
  /**
   * Supabase project holding the admin panel's prices, listing links and lease
   * status. The anon key is public by design; writes are guarded by row-level
   * security (supabase/schema.sql). Empty values keep the built-in data.
   */
  supabase: {
    url: '',
    anonKey: '',
    /** The panel's short login, mapped to the Supabase Auth user below. */
    adminLogin: 'koszalin',
    adminEmail: 'msdapartments+koszalin@gmail.com',
  },
  /** FormSubmit relays contact-form messages to this inbox (activated by its first message). */
  formEndpoint: 'https://formsubmit.co/ajax/msdapartments@gmail.com',
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
  /** No exact count, so the UI says "hundreds" instead of a number. */
  { key: 'guests' },
] as const;
