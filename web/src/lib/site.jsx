import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [site, setSite] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/site')
      .then((data) => {
        setSite(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const value = useMemo(() => {
    const sections = {};
    for (const section of site?.allSections || []) sections[section.key] = section;
    return {
      site,
      error,
      loading,
      reload: load,
      sections,
      /** Only visible sections should be rendered on the public site. */
      visible: (key) => sections[key]?.visible !== false,
      section: (key) => sections[key] || null,
      settings: site?.settings || {},
      faqs: site?.faqs || [],
      services: site?.services || [],
    };
  }, [site, error, loading]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite() {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
}
