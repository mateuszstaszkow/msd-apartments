import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { apartments } from '@/data/apartments';
import { site } from '@/data/site';
import { useI18n } from '@/i18n';
import { usePageMeta } from '@/lib/hooks';
import { YoutubeIcon } from '@/components/ui/BrandIcons';
import { ButtonAnchor } from '@/components/ui/Button';
import { Magnetic } from '@/components/ui/Magnetic';
import { AnimatedWords, Reveal } from '@/components/ui/Reveal';

/** OpenStreetMap embed centred on the office, with a marker on the door. */
const officeMapUrl = (() => {
  const { lat, lng } = site.office.coords;
  const bbox = [lng - 0.006, lat - 0.003, lng + 0.006, lat + 0.003].join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${encodeURIComponent(`${lat},${lng}`)}`;
})();

export function ContactPage() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const [status, setStatus] = useState<'idle' | 'error' | 'sending' | 'sent' | 'failed'>('idle');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    apartment: params.get('apartment') ?? '',
    message: '',
  });

  usePageMeta(
    'Contact — MSD Apartments',
    `Call MSD Apartments at ${site.phone.display}. Seaside apartments for rent and sale in Koszalin and on Costa del Sol.`,
  );

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (status !== 'idle' && status !== 'sending') setStatus('idle');
  }

  /** Sends through FormSubmit; if that fails, the message goes to the visitor's mail client instead. */
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (status === 'sending') return;
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus('error');
      return;
    }

    const apartment = apartments.find((item) => item.slug === form.apartment);
    const subject = apartment
      ? `${apartment.name} — enquiry from ${form.name}`
      : `Enquiry from ${form.name}`;
    const body = [
      form.message,
      '',
      '---',
      `${form.name}`,
      form.email,
      form.phone && `tel: ${form.phone}`,
      apartment && `apartment: ${apartment.name}`,
    ]
      .filter(Boolean)
      .join('\n');

    setStatus('sending');
    try {
      const response = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: subject,
          _template: 'table',
          name: form.name,
          email: form.email,
          phone: form.phone,
          apartment: apartment?.name ?? '',
          message: form.message,
        }),
      });
      const result = (await response.json()) as { success?: string | boolean };
      if (!response.ok || String(result.success) !== 'true') throw new Error('FormSubmit rejected');
      setStatus('sent');
      setForm((current) => ({ ...current, message: '' }));
    } catch {
      window.location.href = `${site.email.href}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus('failed');
    }
  }

  return (
    <>
      <section className="relative overflow-hidden bg-sea-gradient pb-16 pt-36 lg:pb-24 lg:pt-44">
        <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-white/70 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-28 h-96 w-96 rounded-full bg-sea-200/50 blur-3xl" />

        <div className="container-page relative grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Reveal direction="none">
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-sea-400" />
                {t('contact.eyebrow')}
              </span>
            </Reveal>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
              <AnimatedWords text={t('contact.title')} />
            </h1>
            <Reveal delay={0.15}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
                {t('contact.subtitle')}
              </p>
            </Reveal>
          </div>

          {/* The phone number is the loudest element on the page, by design. */}
          <Reveal delay={0.2} direction="left">
            <motion.a
              href={site.phone.href}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="group relative block overflow-hidden rounded-[2rem] bg-ink p-8 shadow-card sm:p-10"
            >
              <div className="pointer-events-none absolute inset-0 animate-gradient-pan bg-[linear-gradient(120deg,rgba(14,165,233,0.45),transparent_50%,rgba(56,189,248,0.35))] bg-[length:200%_200%]" />
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-sea-400/20 blur-3xl transition-all duration-700 group-hover:scale-125" />

              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur">
                  <Phone className="h-6 w-6" />
                </span>
                <p className="mt-7 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-sea-300">
                  {t('contact.phone')}
                </p>
                <p className="mt-2 font-display text-3xl font-semibold text-white sm:text-[2.6rem] sm:leading-tight">
                  {site.phone.display}
                </p>
                <p className="mt-3 text-sm text-sea-100/75">
                  {site.phone.contact} · {t('contact.phone.note')}
                </p>
              </div>
            </motion.a>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 lg:py-20">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ContactCard
            icon={<Mail className="h-5 w-5" />}
            label={t('contact.email')}
            value={site.email.display}
            note={t('contact.email.note', { n: site.responseTimeHours })}
            href={site.email.href}
            delay={0}
          />
          <ContactCard
            icon={<MessageCircle className="h-5 w-5" />}
            label={t('contact.whatsapp')}
            value={site.phone.display}
            note={t('contact.whatsapp.note')}
            href={site.phone.whatsapp}
            external
            delay={0.08}
          />
          <ContactCard
            icon={<MapPin className="h-5 w-5" />}
            label={t('contact.office')}
            value={site.office.street}
            note={`${site.office.city}, ${site.office.country}`}
            href={site.office.mapsUrl}
            external
            delay={0.16}
          />
          <ContactCard
            icon={<YoutubeIcon className="h-5 w-5" />}
            label={t('contact.follow')}
            value="@msdapartments"
            note={t('detail.videos.subtitle')}
            href={site.socials.youtube}
            external
            delay={0.24}
          />
        </div>
      </section>

      <section className="bg-sea-50/60 py-20 lg:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <Reveal>
            <div className="rounded-[2rem] border border-sea-100 bg-white p-7 shadow-soft sm:p-10">
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                {t('contact.form.title')}
              </h2>

              <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={t('contact.form.name')}
                    value={form.name}
                    onChange={(value) => update('name', value)}
                    autoComplete="name"
                    required
                  />
                  <Field
                    label={t('contact.form.email')}
                    type="email"
                    value={form.email}
                    onChange={(value) => update('email', value)}
                    autoComplete="email"
                    required
                  />
                  <Field
                    label={t('contact.form.phone')}
                    type="tel"
                    value={form.phone}
                    onChange={(value) => update('phone', value)}
                    autoComplete="tel"
                  />
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                      {t('contact.form.apartment')}
                    </span>
                    <select
                      value={form.apartment}
                      onChange={(event) => update('apartment', event.target.value)}
                      className="mt-2 w-full rounded-xl border border-sea-200 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-sea-400 focus:ring-4 focus:ring-sea-100"
                    >
                      <option value="">{t('contact.form.apartment.any')}</option>
                      {apartments.map((apartment) => (
                        <option key={apartment.slug} value={apartment.slug}>
                          {apartment.name} — {apartment.city}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
                    {t('contact.form.message')}
                  </span>
                  <textarea
                    value={form.message}
                    onChange={(event) => update('message', event.target.value)}
                    rows={5}
                    placeholder={t('contact.form.messagePlaceholder')}
                    className="mt-2 w-full resize-y rounded-xl border border-sea-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-sea-400 focus:ring-4 focus:ring-sea-100"
                  />
                </label>

                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {t('contact.form.error')}
                  </motion.p>
                )}
                {status === 'sent' && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-sea-50 px-4 py-3 text-sm text-sea-800"
                  >
                    {t('contact.form.success')}
                  </motion.p>
                )}
                {status === 'failed' && (
                  <motion.p
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"
                  >
                    {t('contact.form.failed')}
                  </motion.p>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Magnetic>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-sea-600 px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:bg-sea-700 active:scale-[0.97] disabled:cursor-wait disabled:opacity-70"
                    >
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      {t(status === 'sending' ? 'contact.form.sending' : 'contact.form.submit')}
                    </button>
                  </Magnetic>
                  <p className="max-w-xs text-xs leading-relaxed text-ink-muted">
                    {t('contact.form.note')}{' '}
                    <Link to="/privacy" className="link-underline font-semibold text-sea-700">
                      {t('contact.form.privacy')}
                    </Link>
                    .
                  </p>
                </div>
              </form>
            </div>
          </Reveal>

          <Reveal delay={0.12} direction="left">
            <div className="rounded-[2rem] border border-sea-100 bg-white p-7 shadow-soft sm:p-10">
              <h2 className="flex items-center gap-3 font-display text-xl font-semibold">
                <Clock className="h-5 w-5 text-sea-500" />
                {t('contact.hours')}
              </h2>
              <dl className="mt-6 space-y-4 text-sm">
                {[
                  { label: t('contact.hours.weekdays'), value: site.hours.weekdays },
                  { label: t('contact.hours.saturday'), value: site.hours.saturday },
                  { label: t('contact.hours.sunday'), value: site.hours.sunday },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between border-b border-sea-100 pb-3 last:border-0"
                  >
                    <dt className="text-ink-soft">{row.label}</dt>
                    <dd className={row.value ? 'font-semibold text-ink' : 'text-ink-muted'}>
                      {row.value ?? t('contact.hours.closed')}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 rounded-2xl bg-sea-50 p-5">
                <p className="text-sm leading-relaxed text-ink-soft">{t('contact.phone.note')}</p>
                <ButtonAnchor href={site.phone.href} className="mt-4 w-full">
                  <Phone className="h-4 w-4" />
                  {site.phone.display}
                </ButtonAnchor>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl border border-sea-100">
                <iframe
                  title={`${site.name} — ${site.office.street}, ${site.office.city}`}
                  src={officeMapUrl}
                  loading="lazy"
                  className="h-56 w-full border-0"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactCard({
  icon,
  label,
  value,
  note,
  href,
  external,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
  href: string;
  external?: boolean;
  delay: number;
}) {
  return (
    <motion.a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer noopener' : undefined}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-sea-100 bg-white p-6 transition duration-500 hover:-translate-y-1.5 hover:border-sea-300 hover:shadow-card"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sea-50 text-sea-600 transition duration-500 group-hover:bg-sea-600 group-hover:text-white">
        {icon}
      </span>
      <p className="mt-5 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-base font-semibold text-ink">{value}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{note}</p>
    </motion.a>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
        {label}
        {required && <span className="ml-1 text-sea-500">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        className="mt-2 w-full rounded-xl border border-sea-200 bg-white px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink-muted/70 focus:border-sea-400 focus:ring-4 focus:ring-sea-100"
      />
    </label>
  );
}
