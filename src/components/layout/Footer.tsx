import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import { apartments } from '@/data/apartments';
import { site } from '@/data/site';
import { useI18n } from '@/i18n';
import { asset } from '@/lib/asset';
import { YoutubeIcon } from '@/components/ui/BrandIcons';
import { Reveal } from '@/components/ui/Reveal';

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-sea-100">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-sea-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-sea-400/10 blur-3xl" />

      <div className="container-page relative py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <Reveal>
            <div className="inline-flex rounded-2xl bg-white p-3">
              <img
                src={asset('logo-mark.png')}
                alt={site.name}
                width={150}
                height={111}
                className="h-12 w-auto"
              />
            </div>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-sea-200/80">
              {t('footer.tagline')}
            </p>
            <div className="mt-6 flex gap-3">
              <Social href={site.socials.youtube} label="YouTube">
                <YoutubeIcon className="h-5 w-5" />
              </Social>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
              {t('footer.explore')}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                { to: '/', label: t('nav.home') },
                { to: '/apartments', label: t('nav.apartments') },
                { to: '/about', label: t('nav.about') },
                { to: '/contact', label: t('nav.contact') },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="link-underline text-sea-200/80 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.14}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
              {t('footer.apartmentsList')}
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm lg:grid-cols-1 lg:gap-y-3">
              {apartments.map((apartment) => (
                <li key={apartment.slug}>
                  <Link
                    to={`/apartments/${apartment.slug}`}
                    className="link-underline text-sea-200/80 hover:text-white"
                  >
                    {apartment.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
              {t('footer.contact')}
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={site.phone.href}
                  className="group flex items-center gap-3 text-white transition hover:text-sea-300"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-sea-500/40">
                    <Phone className="h-4 w-4" />
                  </span>
                  <span className="font-display text-lg font-semibold">{site.phone.display}</span>
                </a>
              </li>
              <li>
                <a
                  href={site.email.href}
                  className="group flex items-center gap-3 text-sea-200/80 transition hover:text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-sea-500/40">
                    <Mail className="h-4 w-4" />
                  </span>
                  {site.email.display}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sea-200/80">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>
                  {site.office.street}
                  <br />
                  {site.office.city}
                </span>
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-sea-200/60 sm:flex-row">
          <p>
            © {year} {site.name}. {t('footer.rights')}
          </p>
          <p className="tracking-[0.16em] uppercase">{t('footer.built')}</p>
        </div>
      </div>
    </footer>
  );
}

function Social({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition duration-300 hover:-translate-y-1 hover:border-sea-400 hover:bg-sea-500/30"
    >
      {children}
    </a>
  );
}
