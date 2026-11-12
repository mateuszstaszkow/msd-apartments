import type { Localized } from '@/types';
import { site } from '@/data/site';

const { company, email, phone } = site;

export const privacyUpdated = '2026-11-11';

/** Privacy policy (RODO / GDPR information clause), rendered by PrivacyPage. */
export const privacySections: { title: Localized; paragraphs: Localized[] }[] = [
  {
    title: { en: '1. Who is the controller', pl: '1. Kto jest administratorem danych' },
    paragraphs: [
      {
        en: `The controller of your personal data is ${company.owner}, running the business ${company.legalName}, ${company.address}, NIP ${company.nip}, REGON ${company.regon}, operating under the ${site.name} brand (the "Controller").`,
        pl: `Administratorem Twoich danych osobowych jest ${company.owner}, prowadzący działalność gospodarczą pod firmą ${company.legalName}, ${company.address}, NIP ${company.nip}, REGON ${company.regon}, działający pod marką ${site.name} („Administrator”).`,
      },
      {
        en: `You can reach the Controller at ${email.display} or by phone at ${phone.display}. No data protection officer has been appointed.`,
        pl: `Z Administratorem skontaktujesz się pod adresem ${email.display} lub telefonicznie: ${phone.display}. Administrator nie wyznaczył inspektora ochrony danych.`,
      },
    ],
  },
  {
    title: { en: '2. What data we process and why', pl: '2. Jakie dane przetwarzamy i w jakim celu' },
    paragraphs: [
      {
        en: 'Enquiries (contact form, e-mail, phone, SMS, WhatsApp): your name, e-mail address, phone number, the apartment you ask about and the content of your message. We use them to answer you and to prepare a rental or a booking at your request — Art. 6(1)(b) GDPR (steps taken before entering into a contract) and Art. 6(1)(f) GDPR (our legitimate interest in replying to messages).',
        pl: 'Zapytania (formularz kontaktowy, e-mail, telefon, SMS, WhatsApp): imię i nazwisko, adres e-mail, numer telefonu, apartament, o który pytasz, oraz treść wiadomości. Używamy ich, żeby Ci odpowiedzieć i na Twoje żądanie przygotować najem lub rezerwację — art. 6 ust. 1 lit. b RODO (działania przed zawarciem umowy) oraz art. 6 ust. 1 lit. f RODO (nasz prawnie uzasadniony interes, czyli odpowiadanie na wiadomości).',
      },
      {
        en: 'Rental agreements and bookings: the data needed to sign and perform the agreement, settle payments and keep the accounting records required by law — Art. 6(1)(b) and (c) GDPR.',
        pl: 'Umowy najmu i rezerwacje: dane potrzebne do zawarcia i wykonania umowy, rozliczeń oraz prowadzenia dokumentacji księgowej wymaganej prawem — art. 6 ust. 1 lit. b i c RODO.',
      },
      {
        en: 'Defending or pursuing claims, if a dispute ever arises — Art. 6(1)(f) GDPR.',
        pl: 'Ustalenie, dochodzenie lub obrona roszczeń, gdyby doszło do sporu — art. 6 ust. 1 lit. f RODO.',
      },
      {
        en: 'Giving your data is voluntary, but without an e-mail address or phone number we cannot reply to you.',
        pl: 'Podanie danych jest dobrowolne, ale bez adresu e-mail lub numeru telefonu nie będziemy mogli Ci odpowiedzieć.',
      },
    ],
  },
  {
    title: { en: '3. Who receives the data', pl: '3. Komu przekazujemy dane' },
    paragraphs: [
      {
        en: 'Only the providers we need to run the service: FormSubmit (formsubmit.co), which delivers messages from the contact form to our inbox; Google (Gmail mailbox); GitHub (hosting of this website); our accounting office and, for Laguna, Booking.com when you book through that platform. Some of these providers are based in the USA; transfers rely on the European Commission standard contractual clauses or the EU–US Data Privacy Framework.',
        pl: 'Wyłącznie dostawcom, bez których serwis nie działa: FormSubmit (formsubmit.co), który dostarcza wiadomości z formularza do naszej skrzynki; Google (skrzynka Gmail); GitHub (hosting tej strony); biuru rachunkowemu, a w przypadku Laguny — Booking.com, jeśli rezerwujesz przez tę platformę. Część z tych dostawców ma siedzibę w USA; przekazanie odbywa się na podstawie standardowych klauzul umownych Komisji Europejskiej lub programu EU–US Data Privacy Framework.',
      },
      {
        en: 'We never sell your data and we do not use it for marketing without your separate consent.',
        pl: 'Nigdy nie sprzedajemy Twoich danych i nie używamy ich do marketingu bez Twojej osobnej zgody.',
      },
    ],
  },
  {
    title: { en: '4. How long we keep it', pl: '4. Jak długo przechowujemy dane' },
    paragraphs: [
      {
        en: 'Enquiries that do not lead to an agreement: up to 12 months after the last message. Agreements and accounting documents: for as long as tax law requires (usually 5 years from the end of the year in which the tax was due) and until any claims become time-barred.',
        pl: 'Zapytania, które nie zakończyły się umową: do 12 miesięcy od ostatniej wiadomości. Umowy i dokumenty księgowe: przez okres wymagany przepisami podatkowymi (co do zasady 5 lat od końca roku, w którym powstał obowiązek podatkowy) oraz do przedawnienia ewentualnych roszczeń.',
      },
    ],
  },
  {
    title: { en: '5. Your rights', pl: '5. Twoje prawa' },
    paragraphs: [
      {
        en: `You have the right to access your data, to have it corrected, erased or restricted, to data portability and to object to processing based on our legitimate interest. Write to ${email.display} and we will reply within a month.`,
        pl: `Masz prawo dostępu do swoich danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania opartego na naszym prawnie uzasadnionym interesie. Napisz na ${email.display}, a odpowiemy w ciągu miesiąca.`,
      },
      {
        en: 'You can also lodge a complaint with the President of the Personal Data Protection Office (Prezes UODO, ul. Stawki 2, 00-193 Warszawa).',
        pl: 'Możesz też wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).',
      },
      {
        en: 'We do not make automated decisions about you and we do not profile you.',
        pl: 'Nie podejmujemy wobec Ciebie zautomatyzowanych decyzji i nie profilujemy Cię.',
      },
    ],
  },
  {
    title: { en: '6. Cookies and embedded content', pl: '6. Pliki cookies i treści osadzone' },
    paragraphs: [
      {
        en: 'This website does not use its own cookies or any analytics. Your browser only stores your language choice and, if you install the site as an app, a copy of the site for offline use (local storage and a service worker).',
        pl: 'Ta strona nie używa własnych plików cookies ani narzędzi analitycznych. Przeglądarka zapisuje jedynie wybrany język oraz — jeśli zainstalujesz stronę jako aplikację — kopię strony do pracy offline (pamięć lokalna i service worker).',
      },
      {
        en: 'Films are played from YouTube in privacy-enhanced mode (youtube-nocookie.com), the maps come from OpenStreetMap and the fonts from Google Fonts. When this content loads, those providers receive your IP address and technical details of your browser, under their own privacy policies.',
        pl: 'Filmy odtwarzamy z YouTube w trybie rozszerzonej prywatności (youtube-nocookie.com), mapy pochodzą z OpenStreetMap, a czcionki z Google Fonts. Gdy te treści się ładują, ich dostawcy otrzymują Twój adres IP i techniczne informacje o przeglądarce, na zasadach własnych polityk prywatności.',
      },
    ],
  },
  {
    title: { en: '7. Changes', pl: '7. Zmiany' },
    paragraphs: [
      {
        en: 'We will update this policy whenever the way we process data changes. The date of the latest version is shown at the top of this page.',
        pl: 'Zaktualizujemy tę politykę, gdy zmieni się sposób przetwarzania danych. Data ostatniej wersji jest podana na górze strony.',
      },
    ],
  },
];
