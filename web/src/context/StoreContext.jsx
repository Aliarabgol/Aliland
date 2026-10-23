import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const StoreContext = createContext(null);
const FAV_KEY = 'showroom_favorites';
const CMP_KEY = 'showroom_compare';
export const COMPARE_LIMIT = 3;

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [favorites, setFavorites] = useState(() => read(FAV_KEY));
  const [compare, setCompare] = useState(() => read(CMP_KEY));

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);
  useEffect(() => {
    localStorage.setItem(CMP_KEY, JSON.stringify(compare));
  }, [compare]);

  const toggleFavorite = useCallback((slug) => {
    setFavorites((list) => (list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug]));
  }, []);

  const toggleCompare = useCallback((slug) => {
    let result = { ok: true };
    setCompare((list) => {
      if (list.includes(slug)) return list.filter((s) => s !== slug);
      if (list.length >= COMPARE_LIMIT) {
        result = { ok: false, reason: `حداکثر ${COMPARE_LIMIT} خودرو را می‌توان مقایسه کرد.` };
        return list;
      }
      return [...list, slug];
    });
    return result;
  }, []);

  const value = useMemo(
    () => ({
      favorites,
      compare,
      toggleFavorite,
      toggleCompare,
      isFavorite: (slug) => favorites.includes(slug),
      isCompared: (slug) => compare.includes(slug),
      clearCompare: () => setCompare([]),
    }),
    [favorites, compare, toggleFavorite, toggleCompare],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export const useStore = () => useContext(StoreContext);
