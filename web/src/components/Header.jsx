import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useLibrary } from '../lib/store.jsx';
import { useSite } from '../lib/site.jsx';
import { useScrollTriggeredState } from '../lib/motion.jsx';
import { api } from '../lib/api.js';
import { Icon } from './Icons.jsx';

const CATEGORY_LINKS = [
  { to: '/vehicles/domestic', key: 'nav.domestic', desc: 'cat.domestic.desc' },
  { to: '/vehicles/imported', key: 'nav.imported', desc: 'cat.imported.desc' },
  { to: '/vehicles/assembled', key: 'nav.assembled', desc: 'cat.assembled.desc' },
];

export default function Header() {
  const { t, lang, setLang } = useI18n();
  const { favorites, compare } = useLibrary();
  const { services } = useSite();
  const scrolled = useScrollTriggeredState(30);
  const [dark, setDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Adopt the tone of whatever section sits under the header band.
  useEffect(() => {
    let frame = 0;
    const sample = () => {
      const band = 70;
      const regions = document.querySelectorAll('[data-nav-tone="dark"]');
      let isDark = false;
      for (const el of regions) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= band && rect.bottom > band) {
          isDark = true;
          break;
        }
      }
      setDark(isDark);
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        sample();
        frame = 0;
      });
    };
    sample();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [location.pathname, scrolled]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, searchOpen]);

  const className = [
    'site-header',
    dark ? 'site-header--dark' : '',
    scrolled ? 'site-header--solid' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header className={className}>
        <div className="shell shell-wide site-header__inner">
          <Link to="/" className="brand" aria-label={t('brand.name')}>
            <svg className="brand__mark" viewBox="0 0 64 64" aria-hidden="true">
              <rect width="64" height="64" rx="15" fill="currentColor" opacity="0.1" />
              <path d="M14 45 32 15l18 30h-7.2L32 28.6 21.2 45Z" fill="currentColor" />
              <rect x="24" y="47" width="16" height="3.4" rx="1.7" fill="#415CF0" />
            </svg>
            <span>
              <span className="brand__word">{t('brand.name')}</span>{' '}
              <span className="brand__latin">AliLand</span>
            </span>
          </Link>

          <nav className="nav-primary" aria-label={t('nav.menu')}>
            <div className="nav-item">
              <NavLink className="nav-link" to="/" end>
                {t('nav.home')}
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/vehicles">
                {t('nav.vehicles')}
                <Icon name="chevronDown" size={12} className="nav-caret" />
              </NavLink>
              <div className="mega" role="menu">
                {CATEGORY_LINKS.map((item) => (
                  <Link className="mega__link" to={item.to} key={item.to} role="menuitem">
                    <span className="mega__title">{t(item.key)}</span>
                    <span className="mega__meta">{t(item.desc)}</span>
                  </Link>
                ))}
                <Link className="mega__link" to="/compare" role="menuitem">
                  <span className="mega__title">{t('nav.compare')}</span>
                  <span className="mega__meta">{t('cmp.desc')}</span>
                </Link>
                <Link className="mega__link" to="/favorites" role="menuitem">
                  <span className="mega__title">{t('nav.favorites')}</span>
                  <span className="mega__meta">{t('fav.desc')}</span>
                </Link>
                <div className="mega__foot">
                  <span className="muted small">{t('cat.all')}</span>
                  <Link className="link-arrow" to="/vehicles">
                    {t('act.viewAll')}
                    <Icon name="arrowEnd" size={14} className="rtl-flip" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/sell">
                {t('nav.sell')}
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/services">
                {t('nav.services')}
                <Icon name="chevronDown" size={12} className="nav-caret" />
              </NavLink>
              <div className="mega" role="menu">
                {services.slice(0, 6).map((service) => (
                  <Link className="mega__link" to={`/services/${service.slug}`} key={service.slug} role="menuitem">
                    <span className="mega__title">{lang === 'fa' ? service.title_fa : service.title_en}</span>
                    <span className="mega__meta">{lang === 'fa' ? service.kicker_fa : service.kicker_en}</span>
                  </Link>
                ))}
                <div className="mega__foot">
                  <span className="muted small">{t('svc.overview')}</span>
                  <Link className="link-arrow" to="/services">
                    {t('act.viewAll')}
                    <Icon name="arrowEnd" size={14} className="rtl-flip" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/journal">
                {t('nav.journal')}
              </NavLink>
            </div>

            <div className="nav-item">
              <NavLink className="nav-link" to="/about">
                {t('nav.about')}
                <Icon name="chevronDown" size={12} className="nav-caret" />
              </NavLink>
              <div className="mega" role="menu" style={{ gridTemplateColumns: '1fr' }}>
                <Link className="mega__link" to="/founder" role="menuitem">
                  <span className="mega__title">{t('nav.founder')}</span>
                  <span className="mega__meta">{t('founder.role')}</span>
                </Link>
                <Link className="mega__link" to="/about" role="menuitem">
                  <span className="mega__title">{t('nav.about')}</span>
                  <span className="mega__meta">{t('about.philosophy')}</span>
                </Link>
                <Link className="mega__link" to="/partnership" role="menuitem">
                  <span className="mega__title">{t('nav.partnership')}</span>
                  <span className="mega__meta">{t('partner.groups')}</span>
                </Link>
                <Link className="mega__link" to="/faq" role="menuitem">
                  <span className="mega__title">{t('nav.faq')}</span>
                </Link>
                <Link className="mega__link" to="/contact" role="menuitem">
                  <span className="mega__title">{t('nav.contact')}</span>
                </Link>
              </div>
            </div>
          </nav>

          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label={t('nav.search')}
            >
              <Icon name="search" />
            </button>
            <Link className="icon-btn" to="/favorites" aria-label={t('nav.favorites')}>
              <Icon name="heart" />
              {favorites.length > 0 && <span className="icon-btn__count">{favorites.length}</span>}
            </Link>
            <Link className="icon-btn" to="/compare" aria-label={t('nav.compare')}>
              <Icon name="compare" />
              {compare.length > 0 && <span className="icon-btn__count">{compare.length}</span>}
            </Link>
            <div className="lang-switch" role="group" aria-label={t('shell.lang')}>
              <button
                type="button"
                aria-pressed={lang === 'fa'}
                onClick={() => setLang('fa')}
                lang="fa"
              >
                <span>FA</span>
              </button>
              <button
                type="button"
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
                lang="en"
              >
                <span>EN</span>
              </button>
            </div>
            <button
              className="icon-btn nav-toggle"
              onClick={() => setMenuOpen(true)}
              aria-label={t('nav.menu')}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
          <div className="drawer__head">
            <span className="brand">
              <span className="brand__word">{t('brand.name')}</span>
            </span>
            <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label={t('nav.close')}>
              <Icon name="close" />
            </button>
          </div>
          <nav aria-label={t('nav.menu')}>
            {[
              { to: '/', key: 'nav.home' },
              { to: '/vehicles', key: 'nav.vehicles' },
              { to: '/sell', key: 'nav.sell' },
              { to: '/services', key: 'nav.services' },
              { to: '/partnership', key: 'nav.partnership' },
              { to: '/journal', key: 'nav.journal' },
              { to: '/founder', key: 'nav.founder' },
              { to: '/about', key: 'nav.about' },
              { to: '/faq', key: 'nav.faq' },
              { to: '/contact', key: 'nav.contact' },
            ].map((item, index) => (
              <Link
                className="drawer__link"
                to={item.to}
                key={item.to}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <span>{t(item.key)}</span>
                <span className="idx">{String(index + 1).padStart(2, '0')}</span>
              </Link>
            ))}
            <div className="drawer__sub">
              <Link to="/vehicles/domestic">{t('nav.domestic')}</Link>
              <Link to="/vehicles/imported">{t('nav.imported')}</Link>
              <Link to="/vehicles/assembled">{t('nav.assembled')}</Link>
              <Link to="/compare">{t('nav.compare')}</Link>
              <Link to="/favorites">{t('nav.favorites')}</Link>
            </div>
          </nav>
        </div>
      )}

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}

function SearchOverlay({ onClose }) {
  const { t, bi, num } = useI18n();
  const navigate = useNavigate();
  const [term, setTerm] = useState('');
  const [results, setResults] = useState([]);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const handle = setTimeout(() => {
      if (term.trim().length < 2) {
        setResults([]);
        return;
      }
      setBusy(true);
      fetch(`/api/vehicles?q=${encodeURIComponent(term.trim())}&perPage=6`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => setResults(data.items || []))
        .catch(() => {})
        .finally(() => setBusy(false));
    }, 240);
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [term]);

  const submit = (event) => {
    event.preventDefault();
    if (!term.trim()) return;
    navigate(`/vehicles?q=${encodeURIComponent(term.trim())}`);
    onClose();
  };

  return (
    <div className="search-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={t('nav.search')}>
      <div className="search-panel" onClick={(event) => event.stopPropagation()}>
        <form className="search-field" onSubmit={submit}>
          <Icon name="search" size={20} />
          <input
            ref={inputRef}
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder={t('cat.search')}
            aria-label={t('cat.search')}
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('nav.close')}>
            <Icon name="close" />
          </button>
        </form>

        <div className="search-suggestions">
          {busy && <span className="small muted">{t('act.loading')}</span>}
          {!busy &&
            results.map((item) => (
              <Link to={`/vehicle/${item.slug}`} key={item.slug} onClick={onClose}>
                <span>
                  {bi(item, 'make')} {bi(item, 'model')}
                  <span className="muted small"> — {bi(item, 'trim')}</span>
                </span>
                <span className="small muted num">{num(item.year_shamsi)}</span>
              </Link>
            ))}
          {!busy && term.trim().length >= 2 && results.length === 0 && (
            <span className="small muted">{t('cat.empty')}</span>
          )}
          {!term.trim() && (
            <div className="row" style={{ padding: 8, gap: 8 }}>
              {[
                ['/vehicles/domestic', t('nav.domestic')],
                ['/vehicles/imported', t('nav.imported')],
                ['/vehicles/assembled', t('nav.assembled')],
              ].map(([to, label]) => (
                <Link className="chip" to={to} key={to} onClick={onClose}>
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

