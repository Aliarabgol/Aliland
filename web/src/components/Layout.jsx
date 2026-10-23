import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext.jsx';

const NAV = [
  { to: '/', label: 'خانه', end: true },
  { to: '/cars', label: 'خودروهای موجود' },
  { to: '/sell', label: 'فروش خودرو' },
  { to: '/request-car', label: 'درخواست خودرو' },
  { to: '/journal', label: 'راهنمای خرید' },
];

export function Layout() {
  const { settings, mode } = useSettings();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">پرش به محتوای اصلی</a>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={`${settings.name} — خانه`}>
            <span className="brand-mark" aria-hidden="true">◈</span>
            <span className="brand-name">{settings.name}</span>
            {mode === 'demo' && <span className="badge badge-demo">نمونه</span>}
          </Link>

          <nav className="desktop-nav" aria-label="منوی اصلی">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Link to="/contact" className="btn btn-primary btn-sm">تماس با نمایشگاه</Link>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'بستن منو' : 'باز کردن منو'}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {open && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="منوی موبایل">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className="nav-link">
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/compare" className="nav-link">مقایسه</NavLink>
            <NavLink to="/favorites" className="nav-link">علاقه‌مندی</NavLink>
            <Link to="/contact" className="btn btn-primary">تماس با نمایشگاه</Link>
          </nav>
        )}
      </header>

      <main id="main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand brand-footer">
              <span className="brand-mark" aria-hidden="true">◈</span>
              <span className="brand-name">{settings.name}</span>
            </div>
            <p className="footer-about">{settings.shortDescription}</p>
            {settings.hours && <p className="footer-muted">ساعات کار: {settings.hours}</p>}
          </div>
          <nav aria-label="دسترسی‌های فوتر">
            <h3>دسترسی‌ها</h3>
            <Link to="/cars">خودروهای موجود</Link>
            <Link to="/sell">فروش خودرو</Link>
            <Link to="/request-car">درخواست خودرو</Link>
            <Link to="/journal">راهنمای خرید</Link>
            <Link to="/faq">سؤالات پرتکرار</Link>
          </nav>
          <div>
            <h3>ارتباط</h3>
            {settings.address ? <p className="footer-muted">{settings.address}</p> : <p className="footer-muted">آدرس ثبت نشده است.</p>}
            {settings.phone ? (
              <a href={`tel:${settings.phone}`} className="footer-phone" dir="ltr">{settings.phone}</a>
            ) : (
              <p className="footer-muted">شمارهٔ تماس ثبت نشده است.</p>
            )}
            {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer">اینستاگرام</a>}
            {settings.telegram && <a href={settings.telegram} target="_blank" rel="noreferrer">تلگرام</a>}
            {settings.whatsapp && <a href={settings.whatsapp} target="_blank" rel="noreferrer">واتساپ</a>}
          </div>
          <nav aria-label="قوانین">
            <h3>قوانین</h3>
            <Link to="/terms">شرایط استفاده</Link>
            <Link to="/privacy">حریم خصوصی</Link>
            <Link to="/about">دربارهٔ نمایشگاه</Link>
            <Link to="/admin/login" className="footer-admin">ورود کارکنان</Link>
          </nav>
        </div>
        <div className="container footer-bottom">
          <span>© {new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date())} — {settings.name}</span>
          <span className="footer-muted">داده‌های نمونه با برچسب «نمونه» مشخص شده‌اند.</span>
        </div>
      </footer>

      <nav className="bottom-nav" aria-label="ناوبری موبایل">
        <NavLink to="/" end>خانه</NavLink>
        <NavLink to="/cars">موجودی</NavLink>
        <NavLink to="/compare">مقایسه</NavLink>
        <NavLink to="/favorites">علاقه‌مندی</NavLink>
      </nav>
    </div>
  );
}
