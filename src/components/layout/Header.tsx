import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, X } from 'lucide-react';
import { site } from '@/data/site';
import { useI18n } from '@/i18n';
import { cx } from '@/lib/format';
import { useScrollLock, useScrolled } from '@/lib/hooks';
import { ButtonAnchor } from '@/components/ui/Button';

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/apartments', key: 'nav.apartments' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
] as const;

export function Header() {
  const { t, locale, toggleLocale } = useI18n();
  const scrolled = useScrolled(30);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useScrollLock(open);

  useEffect(() => setOpen(false), [location.pathname]);

  // The home page and apartment pages open with a dark, full-bleed hero.
  const darkHero = location.pathname === '/' || /^\/apartments\/.+/.test(location.pathname);
  const onDark = darkHero && !scrolled && !open;

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter,padding] duration-500',
          scrolled || open
            ? 'bg-white/85 py-2.5 shadow-[0_10px_40px_-24px_rgba(11,34,57,0.4)] backdrop-blur-xl'
            : 'bg-transparent py-4',
        )}
      >
        <div className="container-page flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center outline-none" aria-label={site.name}>
            <motion.span
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className={cx(
                'flex items-center rounded-2xl px-3 py-1.5 transition-[background-color,box-shadow] duration-500',
                onDark ? 'bg-white/95 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]' : 'bg-transparent',
              )}
            >
              <img
                src="/logo-mark.png"
                alt=""
                width={124}
                height={92}
                className="h-9 w-auto object-contain sm:h-10"
              />
            </motion.span>
            <span className="sr-only">{site.name}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'relative rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-300',
                    onDark
                      ? isActive
                        ? 'text-white'
                        : 'text-white/70 hover:text-white'
                      : isActive
                        ? 'text-sea-700'
                        : 'text-ink-soft hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className={cx(
                          'absolute inset-0 -z-10 rounded-full',
                          onDark ? 'bg-white/15 ring-1 ring-white/25' : 'bg-sea-50 ring-1 ring-sea-100',
                        )}
                        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                      />
                    )}
                    {t(link.key)}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleLocale}
              aria-label={t('nav.language')}
              className={cx(
                'rounded-full border px-3 py-2 text-xs font-bold uppercase tracking-wider transition',
                onDark
                  ? 'border-white/30 bg-white/10 text-white hover:bg-white/25'
                  : 'border-sea-200 bg-white/70 text-sea-700 hover:border-sea-400 hover:bg-white',
              )}
            >
              {locale === 'en' ? 'PL' : 'EN'}
            </button>

            <ButtonAnchor href={site.phone.href} size="sm" className="hidden sm:inline-flex">
              <Phone className="h-4 w-4" />
              <span className="hidden md:inline">{site.phone.display}</span>
              <span className="md:hidden">{t('nav.call')}</span>
            </ButtonAnchor>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? t('nav.close') : t('nav.menu')}
              aria-expanded={open}
              className={cx(
                'flex h-10 w-10 items-center justify-center rounded-full border transition lg:hidden',
                onDark
                  ? 'border-white/30 bg-white/10 text-white'
                  : 'border-sea-200 bg-white/70 text-ink hover:border-sea-400',
              )}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl lg:hidden"
          >
            <nav className="container-page flex h-full flex-col justify-center gap-2 pb-24">
              {links.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.06 * index + 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      cx(
                        'block border-b border-sea-100 py-5 font-display text-3xl font-semibold transition-colors',
                        isActive ? 'text-sea-600' : 'text-ink',
                      )
                    }
                  >
                    {t(link.key)}
                  </NavLink>
                </motion.div>
              ))}

              <motion.a
                href={site.phone.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex items-center justify-center gap-3 rounded-full bg-sea-600 px-6 py-4 font-display text-lg font-semibold text-white shadow-glow"
              >
                <Phone className="h-5 w-5" />
                {site.phone.display}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
