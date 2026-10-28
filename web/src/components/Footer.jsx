import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useSite } from '../lib/site.jsx';
import { Icon } from './Icons.jsx';

export default function Footer() {
  const { t, lang } = useI18n();
  const { settings, services } = useSite();
  const footer = settings.footer || {};
  const year = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-US', {
    year: 'numeric',
  }).format(new Date());

  return (
    <footer className="site-footer">
      <div className="shell shell-wide">
        <div className="site-footer__grid">
          <div>
            <Link to="/" className="brand" style={{ marginBlockEnd: 14 }}>
              <span className="brand__word" style={{ fontSize: '1.5rem' }}>
                {t('brand.name')}
              </span>
            </Link>
            <p className="small" style={{ color: 'rgba(243,242,238,0.62)', maxWidth: '34ch', lineHeight: 1.9 }}>
              {t('footer.note')}
            </p>
            <div className="mt-3">
              <span className="demo-badge">
                <span className="demo-badge__dot" />
                {t('shell.portfolio')}
              </span>
            </div>
          </div>

          <div>
            <h4>{t('footer.explore')}</h4>
            <div className="site-footer__links">
              <Link to="/vehicles">{t('nav.allVehicles')}</Link>
              <Link to="/vehicles/domestic">{t('nav.domestic')}</Link>
              <Link to="/vehicles/imported">{t('nav.imported')}</Link>
              <Link to="/vehicles/assembled">{t('nav.assembled')}</Link>
              <Link to="/compare">{t('nav.compare')}</Link>
              <Link to="/favorites">{t('nav.favorites')}</Link>
            </div>
          </div>

          <div>
            <h4>{t('footer.services')}</h4>
            <div className="site-footer__links">
              {services.slice(0, 6).map((service) => (
                <Link to={`/services/${service.slug}`} key={service.slug}>
                  {lang === 'fa' ? service.title_fa : service.title_en}
                </Link>
              ))}
              <Link to="/services">{t('svc.overview')}</Link>
            </div>
          </div>

          <div>
            <h4>{t('footer.about')}</h4>
            <div className="site-footer__links">
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/founder">{t('nav.founder')}</Link>
              <Link to="/partnership">{t('nav.partnership')}</Link>
              <Link to="/journal">{t('nav.journal')}</Link>
              <Link to="/faq">{t('nav.faq')}</Link>
              <Link to="/contact">{t('nav.contact')}</Link>
              <Link to="/admin">{t('nav.adminPanel')}</Link>
            </div>
          </div>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          AliLand
        </div>

        <div className="site-footer__bottom">
          <span>
            © {year} — {footer.note_fa ? (lang === 'fa' ? footer.note_fa : footer.note_en) : t('footer.rights')}
          </span>
          <span className="row" style={{ gap: 18 }}>
            <Link to="/privacy">{t('nav.privacy')}</Link>
            <Link to="/terms">{t('nav.terms')}</Link>
            <span className="row" style={{ gap: 6 }}>
              <Icon name="info" size={13} />
              {lang === 'fa' ? footer.status_fa || 'نسخه نمایشی' : footer.status_en || 'Demo build'}
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
}
