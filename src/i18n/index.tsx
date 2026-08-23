import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Locale, Localized } from '@/types';
import { dictionary, type TranslationKey } from './dictionary';

const STORAGE_KEY = 'msd-locale';

type Vars = Record<string, string | number>;

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: TranslationKey, vars?: Vars) => string;
  /** Reads the right side of a `{ en, pl }` content object. */
  tl: (value: Localized) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function detectLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'pl' || stored === 'en') return stored;
  return navigator.language.toLowerCase().startsWith('pl') ? 'pl' : 'en';
}

function interpolate(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(
    () => setLocaleState((current) => (current === 'en' ? 'pl' : 'en')),
    [],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t: (key, vars) => interpolate(dictionary[locale][key] ?? key, vars),
      tl: (localized) => localized[locale],
    }),
    [locale, setLocale, toggleLocale],
  );

  return <LocaleContext value={value}>{children}</LocaleContext>;
}

export function useI18n(): LocaleContextValue {
  const context = use(LocaleContext);
  if (!context) throw new Error('useI18n must be used inside <LocaleProvider>');
  return context;
}
