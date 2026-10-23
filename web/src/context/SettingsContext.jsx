import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const SettingsContext = createContext({
  settings: {},
  mode: 'demo',
  loading: true,
});

const FALLBACK = {
  name: 'نام نمایشگاه',
  city: 'تهران',
  heroTitle: 'خودروی بعدی تو',
  heroSubtitle: 'خودروها را بررسی کن؛ برای بازدید هماهنگ کنیم.',
  features: {},
};

export function SettingsProvider({ children }) {
  const [state, setState] = useState({ settings: FALLBACK, mode: 'demo', loading: true });

  useEffect(() => {
    let alive = true;
    api
      .get('/settings')
      .then((data) => {
        if (!alive) return;
        setState({ settings: { ...FALLBACK, ...(data.settings || {}) }, mode: data.mode || 'demo', loading: false });
      })
      .catch(() => alive && setState((s) => ({ ...s, loading: false })));
    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => state, [state]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => useContext(SettingsContext);
