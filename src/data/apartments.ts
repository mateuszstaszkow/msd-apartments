import type { Apartment } from '@/types';
import { asset } from '@/lib/asset';
import { thumbnailSources } from '@/lib/youtube';

/**
 * Every apartment MSD manages. Videos are the real YouTube ids from
 * youtube.com/@msdapartments6010 (Fala's film is on youtube.com/@miroslaw368) —
 * apartments still waiting for a shoot simply leave the field out and the UI adapts.
 *
 * Żagiel, Fala, Mewa, Łódź and Promenada carry the details from their live
 * listings; Latarnia, Bryza and Laguna come from the owner's answers (November 2026).
 *
 * Photos live in /public/apartments/<slug>/01.jpg … 08.jpg (see public/apartments/README.md).
 */
export const apartments: Apartment[] = [
  {
    slug: 'zagiel',
    name: 'Żagiel',
    tagline: {
      en: 'Apartment with a view by the university',
      pl: 'Apartament z widokiem przy Politechnice',
    },
    description: {
      en: 'A comfortable 32 m² apartment for one or two people. The living room holds a double bed with a pocket-spring mattress, a fold-out sofa, a beech desk and the door to the balcony. The fitted kitchen has a beech worktop, a tall Amica fridge, an oven and a built-in dishwasher; there is also a washing machine, a vacuum cleaner and a 50" TV. The bathroom has an acrylic bathtub with a folding glass screen and a wall-hung toilet. Fully furnished and ready to move into, with a cellar that belongs to the flat. Let on an occasional-lease contract (najem okazjonalny), without commission, directly with the owner. The tenant arranges their own internet.',
      pl: 'Komfortowy apartament o powierzchni 32 m² dla jednej lub dwóch osób. W salonie stoi dwuosobowe łóżko z materacem kieszeniowym, składany tapczan i bukowe biurko, a z salonu wychodzi się na balkon. Kuchnia w zabudowie ma bukowy blat, wysoką lodówkę Amica, piekarnik i zmywarkę w zabudowie; do tego pralka, odkurzacz i telewizor 50". W łazience jest akrylowa wanna ze składanym szklanym parawanem i podwieszana toaleta. Mieszkanie jest w pełni umeblowane i gotowe do wprowadzenia, przynależy do niego piwnica. Umowa najmu okazjonalnego, oferta bez prowizji, bezpośrednio od właściciela. Internet najemca organizuje we własnym zakresie.',
    },
    city: 'Koszalin',
    district: { en: 'Przylesie', pl: 'Przylesie' },
    region: { en: 'Baltic Sea, Poland', pl: 'Bałtyk, Polska' },
    country: 'PL',
    street: 'ul. Fałata',
    beach: { minutes: 18, mode: 'car' },
    campusMinutes: 5,
    nearby: [
      { en: 'About 200 m to the bus stops', pl: 'Ok. 200 m do przystanków autobusowych' },
      {
        en: 'Koszalin University of Technology, the stadium, the sports hall and the water park nearby',
        pl: 'Blisko Politechniki, Stadionu, Hali Widowiskowo-Sportowej i Parku Wodnego',
      },
      {
        en: 'Emka shopping centre, chemists, a post office and restaurants around the corner',
        pl: 'Centrum handlowe Emka, apteki, poczta i restauracje w pobliżu',
      },
    ],
    area: 32,
    rooms: 1,
    guests: 2,
    beds: 2,
    bathrooms: 1,
    floor: { en: '5th floor', pl: '5. piętro' },
    offer: 'rent',
    rentPeriod: 'month',
    price: 1890,
    serviceCharge: 510,
    deposit: 3000,
    currency: 'PLN',
    amenities: [
      'furnished',
      'balcony',
      'kitchen',
      'dishwasher',
      'washingMachine',
      'tv',
      'workspace',
      'cellar',
      'parking',
    ],
    highlights: [
      { en: 'Balcony off the living room', pl: 'Balkon z wyjściem z salonu' },
      {
        en: 'Bathtub with a glass screen and a wall-hung toilet',
        pl: 'Wanna ze szklanym parawanem i podwieszana toaleta',
      },
      {
        en: 'Electricity billed every other month by usage',
        pl: 'Prąd rozliczany co drugi miesiąc według zużycia',
      },
    ],
    videos: { presentation: 'JiDVGROMxqQ', pov: 'lWZSBCnC00s' },
    coords: { lat: 54.2014, lng: 16.1976 },
    featured: true,
    rented: true,
    photosPending: true,
  },
  {
    slug: 'latarnia',
    name: 'Latarnia',
    tagline: {
      en: 'Ground-floor apartment with a private garden',
      pl: 'Apartament na parterze z własnym ogródkiem',
    },
    description: {
      en: 'A 24 m² studio for one or two people on the ground floor, opening onto a private garden where you can have a barbecue. The flat is furnished and equipped with a fridge, a washing machine, a dishwasher, a TV and a desk, and there is parking by the building. Pets are welcome. Let on an occasional-lease contract (najem okazjonalny), with electricity billed every other month by usage.',
      pl: 'Kawalerka o powierzchni 24 m² dla jednej lub dwóch osób, na parterze z wyjściem do prywatnego ogródka, w którym można grillować. Mieszkanie jest umeblowane i wyposażone w lodówkę, pralkę, zmywarkę, telewizor i biurko, a przy budynku jest parking. Zwierzęta są mile widziane. Umowa najmu okazjonalnego, prąd rozliczany co dwa miesiące według zużycia.',
    },
    city: 'Koszalin',
    region: { en: 'Baltic Sea, Poland', pl: 'Bałtyk, Polska' },
    country: 'PL',
    street: 'ul. Jana Pawła II 9A',
    beach: { minutes: 17, mode: 'car' },
    campusMinutes: 7,
    area: 24,
    rooms: 1,
    guests: 2,
    beds: 1,
    bathrooms: 1,
    floor: { en: 'Ground floor, garden access', pl: 'Parter, wyjście do ogrodu' },
    offer: 'rent',
    rentPeriod: 'month',
    price: 1650,
    serviceCharge: 350,
    deposit: 3000,
    currency: 'PLN',
    amenities: [
      'furnished',
      'garden',
      'bbq',
      'kitchen',
      'dishwasher',
      'washingMachine',
      'tv',
      'workspace',
      'parking',
      'petFriendly',
    ],
    highlights: [
      { en: 'Private garden where you can barbecue', pl: 'Prywatny ogródek z możliwością grillowania' },
      { en: 'Pets are welcome', pl: 'Zwierzęta mile widziane' },
      {
        en: 'Electricity billed every other month by usage',
        pl: 'Prąd rozliczany co dwa miesiące według zużycia',
      },
    ],
    videos: { presentation: 'mC3kKnE5nMQ', pov: 'S_HH_PhOepY' },
    coords: { lat: 54.2032, lng: 16.1932 },
    rented: true,
    photosPending: true,
  },
  {
    slug: 'lodz',
    name: 'Łódź',
    tagline: {
      en: 'Compact studio a step from the university',
      pl: 'Kompaktowe studio krok od Politechniki',
    },
    description: {
      en: 'Twenty-two square metres arranged so that nothing is missing: a living area with a kitchenette and a work corner, a dining table in the middle, and a bathroom with a walk-in rain shower. The general renovation replaced the electrical, gas and water installations, the floor is wooden panelling, and the flat comes fully furnished with new appliances and a 50" Samsung 4K smart TV. Top floor of a four-storey block on the Przylesie estate, with a cellar and plenty of parking around it. Let without commission, directly with the owner.',
      pl: 'Dwadzieścia dwa metry rozplanowane tak, że niczego nie brakuje: salon z aneksem kuchennym i częścią biurową, jadalnia pośrodku i łazienka z kabiną prysznicową z deszczownicą. Remont generalny objął wymianę instalacji elektrycznej, gazowej i wodnej, na podłodze są drewniane panele, a mieszkanie jest w pełni umeblowane, z nowym sprzętem RTV i AGD oraz telewizorem Samsung 4K 50". Ostatnie, czwarte piętro bloku na osiedlu Przylesie, do tego piwnica i dużo miejsc parkingowych w okolicy. Oferta bez prowizji, bezpośrednio od właściciela.',
    },
    city: 'Koszalin',
    district: { en: 'Przylesie', pl: 'Przylesie' },
    region: { en: 'Baltic Sea, Poland', pl: 'Bałtyk, Polska' },
    country: 'PL',
    street: 'ul. Gałczyńskiego',
    beach: { minutes: 17, mode: 'car' },
    campusMinutes: 13,
    nearby: [
      { en: '200 m to the ZUS bus stop', pl: '200 m do przystanku autobusowego ZUS' },
      { en: 'A park and two playgrounds within 120 m', pl: 'Park i dwa place zabaw w promieniu 120 m' },
      { en: 'Three Stokrotka shops within 400 m', pl: 'Trzy sklepy Stokrotka w promieniu 400 m' },
    ],
    area: 22,
    rooms: 1,
    guests: 2,
    beds: 1,
    bathrooms: 1,
    floor: { en: '4th of 4, no lift', pl: '4. piętro z 4, bez windy' },
    offer: 'rent',
    rentPeriod: 'month',
    price: 1600,
    serviceCharge: 400,
    deposit: 3200,
    currency: 'PLN',
    amenities: [
      'furnished',
      'kitchen',
      'dishwasher',
      'washingMachine',
      'tv',
      'workspace',
      'cellar',
      'intercom',
      'districtHeating',
      'parking',
    ],
    highlights: [
      {
        en: 'Kitchenette, dining table and a work corner in one room',
        pl: 'Aneks kuchenny, jadalnia i część biurowa w jednym',
      },
      {
        en: 'Wooden panelling and new tiling after a full renovation',
        pl: 'Drewniane panele i nowe płytki po remoncie generalnym',
      },
      { en: 'A cellar belongs to the flat', pl: 'Do mieszkania przynależy piwnica' },
    ],
    videos: { presentation: 'sBWYsI9pejg', pov: 'XO3isQPx3Vo' },
    coords: { lat: 54.1984, lng: 16.19 },
    rented: true,
  },
  {
    slug: 'promenada',
    name: 'Promenada',
    tagline: {
      en: 'Architect-designed studio by the university',
      pl: 'Studio z projektem architektonicznym przy Politechnice',
    },
    description: {
      en: 'A studio finished to a design by the Poznań architecture practice AMJ Studio, and written up in the Sztuka Wnętrza magazine. One room holds the living area, the kitchenette and a work corner; the bathroom has a walk-in rain shower. The 2022 general renovation replaced the electrical, gas and water installations, every piece of furniture is new, and there is a 50" LG 4K smart TV. Fibre internet at 150 Mb/s is already connected. Let without commission, directly with the owner.',
      pl: 'Studio wykończone według projektu poznańskiego biura architektonicznego AMJ Studio, opisane w magazynie Sztuka Wnętrza. W jednym pomieszczeniu mieści się salon, aneks kuchenny i część biurowa, a w łazience jest kabina prysznicowa z deszczownicą. Remont generalny z 2022 roku objął wymianę instalacji elektrycznej, gazowej i wodnej, wszystkie meble i sprzęty są nowe, do tego telewizor LG 4K 50". W mieszkaniu jest już podłączony światłowód 150 Mb/s. Oferta bez prowizji, bezpośrednio od właściciela.',
    },
    city: 'Koszalin',
    district: { en: 'Przylesie', pl: 'Przylesie' },
    region: { en: 'Baltic Sea, Poland', pl: 'Bałtyk, Polska' },
    country: 'PL',
    street: 'ul. Melchiora Wańkowicza',
    beach: { minutes: 17, mode: 'car' },
    campusMinutes: 10,
    nearby: [
      {
        en: '300 m to the Staszica, ZUS and Wańkowicza stops',
        pl: '300 m do przystanków Staszica, ZUS i Wańkowicza',
      },
      {
        en: 'Koszalin University of Technology a few minutes away',
        pl: 'Politechnika Koszalińska kilka minut stąd',
      },
      {
        en: 'Chemists, shops, restaurants and pubs around the corner',
        pl: 'Apteki, sklepy, restauracje i puby tuż obok',
      },
    ],
    area: 22,
    rooms: 1,
    guests: 2,
    beds: 1,
    bathrooms: 1,
    floor: { en: '3rd of 4, no lift', pl: '3. piętro z 4, bez windy' },
    offer: 'rent',
    rentPeriod: 'month',
    price: 1700,
    serviceCharge: 400,
    deposit: 3400,
    currency: 'PLN',
    amenities: [
      'wifi',
      'furnished',
      'kitchen',
      'dishwasher',
      'washingMachine',
      'tv',
      'workspace',
      'cellar',
      'intercom',
      'districtHeating',
      'parking',
    ],
    highlights: [
      {
        en: 'Interior by AMJ Studio, featured in Sztuka Wnętrza',
        pl: 'Wnętrze projektu AMJ Studio, opisane w Sztuce Wnętrza',
      },
      { en: 'Fibre internet at 150 Mb/s already connected', pl: 'Światłowód 150 Mb/s już podłączony' },
      { en: 'Everything new after the 2022 renovation', pl: 'Wszystko nowe po remoncie z 2022 roku' },
    ],
    videos: { presentation: 'VETQRa2nhbI', pov: 'lhJNXaWSExc' },
    coords: { lat: 54.2024, lng: 16.1901 },
    rented: true,
  },
  {
    slug: 'mewa',
    name: 'Mewa',
    tagline: {
      en: 'A city panorama from the ninth floor',
      pl: 'Panorama miasta z dziewiątego piętra',
    },
    description: {
      en: 'A freshly finished apartment on the ninth floor, directly opposite the main building of Koszalin University of Technology. The south-facing balcony looks out over the whole city, and the sunsets are the reason people stay. Fully furnished with new appliances and a 49" LG 4K smart TV; the general renovation replaced the electrical, water and drainage installations. A separate kitchen with a dining area, a bathroom with a bathtub and a rain shower, and a hallway with a large wardrobe. Let without commission, directly with the owner.',
      pl: 'Świeżo wykończony apartament na dziewiątym piętrze, dokładnie naprzeciwko głównego gmachu Politechniki Koszalińskiej. Balkon z ekspozycją południową wychodzi na panoramę całego miasta — to dla tych zachodów słońca się tu zostaje. W pełni umeblowany, z nowym sprzętem RTV i AGD oraz telewizorem LG 4K 49"; remont generalny objął wymianę instalacji elektrycznej, wodnej i kanalizacyjnej. Oddzielna kuchnia z jadalnią, łazienka z wanną i deszczownicą oraz przedpokój z dużą szafą. Oferta bez prowizji, bezpośrednio od właściciela.',
    },
    city: 'Koszalin',
    district: { en: 'Przylesie', pl: 'Przylesie' },
    region: { en: 'Baltic Sea, Poland', pl: 'Bałtyk, Polska' },
    country: 'PL',
    street: 'ul. Jana Pawła II',
    beach: { minutes: 17, mode: 'car' },
    campusMinutes: 4,
    nearby: [
      {
        en: 'Opposite the main building of Koszalin University of Technology',
        pl: 'Naprzeciwko głównego gmachu Politechniki Koszalińskiej',
      },
      {
        en: '200 m to the Politechnika, Staszica and Śniadeckich stops',
        pl: '200 m do przystanków Politechnika, Staszica i Śniadeckich',
      },
      {
        en: 'Chemists, shops and restaurants on the same street',
        pl: 'Apteki, pawilony sklepowe i restauracje na tej samej ulicy',
      },
    ],
    area: 37,
    rooms: 1,
    guests: 2,
    beds: 1,
    bathrooms: 1,
    floor: { en: '9th of 10, with a lift', pl: '9. piętro z 10, z windą' },
    offer: 'rent',
    rentPeriod: 'month',
    price: 1900,
    serviceCharge: 600,
    deposit: 3800,
    currency: 'PLN',
    amenities: [
      'furnished',
      'balcony',
      'kitchen',
      'dishwasher',
      'washingMachine',
      'tv',
      'workspace',
      'elevator',
      'cellar',
      'intercom',
      'districtHeating',
      'parking',
    ],
    highlights: [
      { en: 'Balcony with a panorama of the city', pl: 'Balkon z panoramą miasta' },
      { en: 'Separate kitchen with a dining area', pl: 'Oddzielna kuchnia z jadalnią' },
      { en: 'Desk and office chair for working from home', pl: 'Biurko i krzesło biurowe do pracy zdalnej' },
    ],
    videos: { pov: '6-MAlsbBHlE' },
    coords: { lat: 54.2034, lng: 16.1957 },
    featured: true,
    rented: true,
  },
  {
    slug: 'fala',
    name: 'Fala',
    tagline: {
      en: 'Freshly renovated, high-standard apartment',
      pl: 'Świeżo wyremontowany apartament w wysokim standardzie',
    },
    description: {
      en: 'A freshly renovated 32 m² apartment finished to a high standard, for one or two people. Everything is new: the furniture, a 55" TV with a subwoofer, a tall built-in fridge, a Wi-Fi oven and a dishwasher. The living room holds a double bed with a pocket-spring mattress, a fold-out sofa and a beech desk; the bathroom has an acrylic bathtub with a folding glass screen and a wall-hung Grohe toilet. The ground-floor flat has a balcony, a washing machine and internet, is ready to move into and comes with a cellar. Let on an occasional-lease contract (najem okazjonalny) with electricity billed every other month by usage, without commission, directly with the owner.',
      pl: 'Świeżo wyremontowany w wysokim standardzie apartament o powierzchni 32 m² dla jednej lub dwóch osób. Wszystko jest nowe: meble, telewizor 55" z subwooferem, wysoka lodówka w zabudowie, piekarnik z Wi-Fi i zmywarka. W salonie stoi dwuosobowe łóżko z materacem kieszeniowym, składany tapczan i bukowe biurko, a w łazience jest akrylowa wanna ze składanym szklanym parawanem i podwieszana toaleta Grohe. Mieszkanie na parterze ma balkon, pralkę i internet, jest gotowe do wprowadzenia, a przynależy do niego piwnica. Umowa najmu okazjonalnego, prąd rozliczany co dwa miesiące według zużycia, oferta bez prowizji, bezpośrednio od właściciela.',
    },
    city: 'Koszalin',
    district: { en: 'Przylesie', pl: 'Przylesie' },
    region: { en: 'Baltic Sea, Poland', pl: 'Bałtyk, Polska' },
    country: 'PL',
    street: 'ul. Lelewela',
    beach: { minutes: 16, mode: 'car' },
    campusMinutes: 11,
    nearby: [
      { en: 'Under 200 m to the bus stop', pl: 'Niecałe 200 m do przystanku autobusowego' },
      {
        en: 'Koszalin University of Technology, the sports hall, the water park and the forest nearby',
        pl: 'Blisko Politechniki, Hali Widowiskowo-Sportowej, Parku Wodnego i lasu',
      },
      {
        en: 'Shops, chemists, a post office and restaurants around the corner',
        pl: 'Sklepy, apteki, poczta i restauracje w pobliżu',
      },
    ],
    area: 32,
    rooms: 1,
    guests: 2,
    beds: 2,
    bathrooms: 1,
    floor: { en: 'Ground floor', pl: 'Parter' },
    offer: 'rent',
    rentPeriod: 'month',
    price: 2000,
    serviceCharge: 500,
    deposit: 4000,
    currency: 'PLN',
    amenities: [
      'wifi',
      'furnished',
      'balcony',
      'kitchen',
      'dishwasher',
      'washingMachine',
      'tv',
      'workspace',
      'cellar',
      'parking',
    ],
    highlights: [
      { en: 'Everything new after a fresh renovation', pl: 'Wszystko nowe po świeżym remoncie' },
      { en: '55" TV with a subwoofer', pl: 'Telewizor 55" z subwooferem' },
      {
        en: 'Bathtub with a glass screen and a wall-hung Grohe toilet',
        pl: 'Wanna ze szklanym parawanem i podwieszana toaleta Grohe',
      },
    ],
    videos: { presentation: 'Yax3pRo_-mw', vertical: true, poster: 'apartments/fala/poster.jpg' },
    coords: { lat: 54.2092, lng: 16.1997 },
    rented: true,
    photosPending: true,
  },
  {
    // TODO: equipment, neighbourhood and a fuller description are still missing.
    slug: 'bryza',
    name: 'Bryza',
    tagline: {
      en: 'A 32 m² flat for two on ul. Kołłątaja',
      pl: 'Mieszkanie 32 m² dla dwóch osób przy ul. Kołłątaja',
    },
    description: {
      en: 'A 32 m² one-room flat for two people on ul. Kołłątaja in Koszalin, on the first floor of a building without a lift. It has two sleeping places and its own bathroom. Electricity is billed every other month by usage.',
      pl: 'Jednopokojowe mieszkanie o powierzchni 32 m² dla dwóch osób przy ul. Kołłątaja w Koszalinie, na pierwszym piętrze budynku bez windy. Ma dwa miejsca do spania i własną łazienkę. Prąd rozliczany co dwa miesiące według zużycia.',
    },
    city: 'Koszalin',
    region: { en: 'Baltic Sea, Poland', pl: 'Bałtyk, Polska' },
    country: 'PL',
    street: 'ul. Kołłątaja 6a',
    beach: { minutes: 16, mode: 'car' },
    campusMinutes: 10,
    area: 32,
    rooms: 1,
    guests: 2,
    beds: 2,
    bathrooms: 1,
    floor: { en: '1st floor, no lift', pl: '1. piętro, bez windy' },
    offer: 'rent',
    rentPeriod: 'month',
    price: 1750,
    serviceCharge: 850,
    deposit: 3000,
    currency: 'PLN',
    amenities: [],
    highlights: [
      {
        en: 'Electricity billed every other month by usage',
        pl: 'Prąd rozliczany co dwa miesiące według zużycia',
      },
    ],
    videos: {},
    coords: { lat: 54.2088, lng: 16.1975 },
    rented: true,
    photosPending: true,
  },
  {
    // The resort, rooftop jacuzzi, sea view and on-site facilities are from the
    // official Hacienda el Sueño listing (Calle Tranco 4, Las Lagunas de Mijas).
    slug: 'laguna',
    name: 'Laguna',
    tagline: {
      en: 'Penthouse with a rooftop jacuzzi and a sea view',
      pl: 'Penthouse z jacuzzi na dachu i widokiem na morze',
    },
    description: {
      en: 'Our Spanish chapter: a penthouse in the Hacienda el Sueño resort at Calle Tranco 4 in Las Lagunas de Mijas, halfway between Málaga and Marbella. The rooftop terrace has a private jacuzzi and a 360° view of the Mediterranean, the Mijas mountains and the resort pool. Downstairs there is a heated outdoor pool, an adults-only lagoon with its own beach, the Vista Lago restaurant, a gym and a sauna. La Cala de Mijas beach is ten minutes by car, Málaga airport twenty-five.',
      pl: 'Nasz hiszpański rozdział: penthouse w resorcie Hacienda el Sueño przy Calle Tranco 4 w Las Lagunas de Mijas, w połowie drogi między Malagą a Marbellą. Na dachu jest prywatne jacuzzi i widok 360° na Morze Śródziemne, góry Mijas i basen resortu. Na dole podgrzewany basen zewnętrzny, laguna tylko dla dorosłych z własną plażą, restauracja Vista Lago, siłownia i sauna. Do plaży w La Cala de Mijas dziesięć minut autem, na lotnisko w Maladze dwadzieścia pięć.',
    },
    city: 'Las Lagunas de Mijas',
    district: { en: 'Hacienda el Sueño', pl: 'Hacienda el Sueño' },
    region: { en: 'Costa del Sol, Spain', pl: 'Costa del Sol, Hiszpania' },
    country: 'ES',
    street: 'Calle Tranco 4',
    beach: { minutes: 10, mode: 'car' },
    nearby: [
      {
        en: 'Heated pool, lagoon beach, Vista Lago restaurant and gym on site',
        pl: 'Podgrzewany basen, laguna, restauracja Vista Lago i siłownia na terenie resortu',
      },
      { en: '10 min by car to La Cala de Mijas beach', pl: '10 min autem do plaży w La Cala de Mijas' },
      { en: '25 min by car from Málaga airport', pl: '25 min autem od lotniska w Maladze' },
    ],
    area: 50,
    rooms: 2,
    guests: 4,
    beds: 2,
    bathrooms: 2,
    floor: { en: 'Penthouse, rooftop terrace', pl: 'Penthouse, taras na dachu' },
    offer: 'rent',
    rentPeriod: 'night',
    price: 120,
    currency: 'EUR',
    amenities: [
      'wifi',
      'jacuzzi',
      'seaView',
      'terrace',
      'pool',
      'gym',
      'sauna',
      'airCon',
      'kitchen',
      'dishwasher',
      'washingMachine',
      'tv',
      'elevator',
      'parking',
    ],
    highlights: [
      { en: 'Private jacuzzi on the rooftop terrace', pl: 'Prywatne jacuzzi na tarasie dachowym' },
      {
        en: '360° views of the Mediterranean, the mountains and the pool',
        pl: 'Widok 360° na Morze Śródziemne, góry i basen',
      },
      {
        en: 'Heated pool, lagoon, gym and sauna inside the resort',
        pl: 'Podgrzewany basen, laguna, siłownia i sauna na terenie resortu',
      },
      {
        en: 'Two bedrooms with double beds and two bathrooms',
        pl: 'Dwie sypialnie z łóżkami dwuosobowymi i dwie łazienki',
      },
      { en: 'Short stays, also bookable on Booking.com', pl: 'Pobyty krótkoterminowe, rezerwacja także przez Booking.com' },
    ],
    // Short from youtube.com/@haciendaelsueno, used with the resort's permission;
    // the photos are stills from it.
    videos: { presentation: 'TKR1yUgcHGI', vertical: true, poster: 'apartments/laguna/01.jpg' },
    coords: { lat: 36.5242, lng: -4.6503 },
    featured: true,
  },
];

export const PHOTOS_PER_APARTMENT = 8;

/** Photo slots reserved for every apartment: /apartments/<slug>/01.jpg … 08.jpg */
export function photoPaths(slug: string): string[] {
  return Array.from({ length: PHOTOS_PER_APARTMENT }, (_, i) =>
    asset(`apartments/${slug}/${String(i + 1).padStart(2, '0')}.jpg`),
  );
}

/** Still frames for one of the apartment's films, best first. */
export function filmStills(apartment: Apartment, videoId: string): string[] {
  const { poster, presentation } = apartment.videos;
  return poster && videoId === presentation
    ? [asset(poster), ...thumbnailSources(videoId)]
    : thumbnailSources(videoId);
}

/** Ordered fallbacks for an apartment's cover image: real photo → video still → gradient. */
export function coverSources(apartment: Apartment): string[] {
  const videoId = apartment.videos.presentation ?? apartment.videos.pov;
  return [photoPaths(apartment.slug)[0], ...(videoId ? filmStills(apartment, videoId) : [])];
}

/** Slugs that were live before an apartment got its final name. */
export const renamedSlugs: Record<string, string> = { marina: 'laguna' };

export function getApartment(slug: string): Apartment | undefined {
  return apartments.find((apartment) => apartment.slug === slug);
}

export function videoCount(): number {
  return apartments.reduce(
    (total, apartment) =>
      total + [apartment.videos.presentation, apartment.videos.pov].filter(Boolean).length,
    0,
  );
}
