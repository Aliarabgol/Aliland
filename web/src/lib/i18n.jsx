import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { translate } from './dict.js';

const LocaleContext = createContext(null);
const STORAGE_KEY = 'aliland.lang';

export function LocaleProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return stored === 'en' ? 'en' : 'fa';
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* private mode — the choice simply will not persist */
    }
    // keep the document title bilingual
    document.title =
      lang === 'fa'
        ? 'علی‌لند — نمایشگاه خودرو | AliLand Car DealerShip'
        : 'AliLand Car DealerShip — a showroom with a closer look';
  }, [lang]);

  const t = useCallback((key, vars) => translate(key, lang, vars), [lang]);

  /** Picks the localised column of a bilingual database row: bi(vehicle, 'model'). */
  const bi = useCallback(
    (row, field) => {
      if (!row) return '';
      const value = row[`${field}_${lang}`];
      return value ?? row[`${field}_fa`] ?? '';
    },
    [lang],
  );

  const num = useCallback(
    (value, options) => {
      if (value === null || value === undefined || value === '') return '—';
      try {
        return new Intl.NumberFormat(lang === 'fa' ? 'fa-IR' : 'en-US', options).format(value);
      } catch {
        return String(value);
      }
    },
    [lang],
  );

  const money = useCallback(
    (value) => (value === null || value === undefined ? '—' : num(Number(value))),
    [num],
  );

  const toggleLang = useCallback(() => setLang((l) => (l === 'fa' ? 'en' : 'fa')), []);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t, bi, num, money, isRtl: lang === 'fa' }),
    [lang, t, bi, num, money, toggleLang],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useI18n must be used inside LocaleProvider');
  return ctx;
}
