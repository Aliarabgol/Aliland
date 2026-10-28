import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { Icon } from '../components/Icons.jsx';

const NAV = [
  { to: '/admin', key: 'admin.overview', icon: 'grid', end: true },
  { to: '/admin/vehicles', key: 'admin.vehicles', icon: 'car' },
  { to: '/admin/articles', key: 'admin.articles', icon: 'doc' },
  { to: '/admin/content', key: 'admin.content', icon: 'layers' },
  { to: '/admin/media', key: 'admin.media', icon: 'image' },
];

export default function AdminLayout() {
  const { t, setLang, lang } = useI18n();
  const [user, setUser] = useState(undefined);
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
    api.get('/auth/config').then(setConfig).catch(() => {});
  }, []);

  const signOut = async () => {
    await api.post('/auth/logout');
    setUser(null);
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="auth-wrap">
        <div className="skeleton" style={{ width: 380, height: 320 }} />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen config={config} onSignedIn={setUser} />;
  }

  return (
    <>
      <header className="site-header site-header--solid" style={{ color: 'var(--ink)' }}>
        <div className="shell shell-wide site-header__inner">
          <Link to="/" className="brand">
            <span className="brand__word">{t('brand.name')}</span>
            <span className="brand__latin">Admin</span>
          </Link>
          <div className="header-actions">
            <span className="small muted" style={{ marginInlineEnd: 8 }}>
              {user.displayName} · {user.role}
            </span>
            <div className="lang-switch" role="group" aria-label={t('shell.lang')}>
              <button type="button" aria-pressed={lang === 'fa'} onClick={() => setLang('fa')}>
                <span>FA</span>
              </button>
              <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
                <span>EN</span>
              </button>
            </div>
            <Link className="btn btn--ghost btn--sm" to="/">
              {t('nav.home')}
            </Link>
            <button type="button" className="btn btn--ink btn--sm" onClick={signOut}>
              <Icon name="logout" size={14} />
              {t('admin.signOut')}
            </button>
          </div>
        </div>
      </header>

      <div className="admin-shell">
        <nav className="admin-nav" aria-label={t('admin.title')}>
          {NAV.map((item) => (
            <NavLink to={item.to} key={item.to} end={item.end}>
              <Icon name={item.icon} size={16} />
              {t(item.key)}
            </NavLink>
          ))}
        </nav>
        <main className="admin-main">
          <Outlet context={{ user }} />
        </main>
      </div>
    </>
  );
}

function LoginScreen({ config, onSignedIn }) {
  const { t } = useI18n();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await api.post('/auth/login', form);
      onSignedIn(data.user);
    } catch (err) {
      setError(
        err.status === 429
          ? 'Too many attempts. Try again in a few minutes.'
          : 'Invalid email or password.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div>
          <span className="kicker">AliLand</span>
          <h1 className="h2" style={{ marginBlockStart: 8 }}>
            {t('admin.login')}
          </h1>
          <p className="small muted" style={{ marginBlockStart: 6 }}>
            {t('admin.restricted')}
          </p>
        </div>

        <form className="stack" onSubmit={submit}>
          <div className="field">
            <label htmlFor="a-email">{t('admin.email')}</label>
            <input
              id="a-email"
              className="input"
              dir="ltr"
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="a-password">{t('admin.password')}</label>
            <input
              id="a-password"
              className="input"
              dir="ltr"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </div>
          {error && <span className="field-error">{error}</span>}
          <button className="btn btn--primary btn--block" type="submit" disabled={busy}>
            {busy ? t('act.loading') : t('admin.signIn')}
          </button>
        </form>

        {config.demoCredentials && (
          <div className="admin-note">
            <Icon name="alert" size={15} />
            <div>
              <strong style={{ display: 'block', marginBlockEnd: 4 }}>{t('shell.demo')}</strong>
              <span>{t('admin.demoCreds')}</span>
              <div className="small" style={{ marginBlockStart: 8, fontFamily: 'var(--font-latin)' }} dir="ltr">
                admin@aliland.demo · AliLandDemo!2026
              </div>
            </div>
          </div>
        )}

        <Link className="small" to="/" style={{ color: 'var(--cobalt)', fontWeight: 700 }}>
          {t('nf.home')}
        </Link>
      </div>
    </div>
  );
}
