import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useI18n } from './i18n.jsx';

const LibraryContext = createContext(null);
const FAV_KEY = 'aliland.favorites';
const CMP_KEY = 'aliland.compare';
const MAX_COMPARE = 3;

function read(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — the list stays in memory for this session */
  }
}

export function LibraryProvider({ children }) {
  const { t } = useI18n();
  const [favorites, setFavorites] = useState(() => read(FAV_KEY));
  const [compare, setCompare] = useState(() => read(CMP_KEY));
  const [toast, setToast] = useState(null);

  useEffect(() => write(FAV_KEY, favorites), [favorites]);
  useEffect(() => write(CMP_KEY, compare), [compare]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  const toggleFavorite = useCallback(
    (slug) => {
      setFavorites((list) => {
        const has = list.includes(slug);
        setToast(has ? t('v.unsaved') : t('v.saved'));
        return has ? list.filter((s) => s !== slug) : [...list, slug];
      });
    },
    [t],
  );

  const toggleCompare = useCallback(
    (slug) => {
      setCompare((list) => {
        if (list.includes(slug)) {
          setToast(t('cmp.remove'));
          return list.filter((s) => s !== slug);
        }
        if (list.length >= MAX_COMPARE) {
          setToast(t('v.compareFull'));
          return list;
        }
        setToast(t('v.compareAdded'));
        return [...list, slug];
      });
    },
    [t],
  );

  const clearCompare = useCallback(() => setCompare([]), []);

  const value = useMemo(
    () => ({
      favorites,
      compare,
      toast,
      setToast,
      toggleFavorite,
      toggleCompare,
      clearCompare,
      isFavorite: (slug) => favorites.includes(slug),
      isCompared: (slug) => compare.includes(slug),
      MAX_COMPARE,
    }),
    [favorites, compare, toast, toggleFavorite, toggleCompare, clearCompare],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary must be used inside LibraryProvider');
  return ctx;
}
