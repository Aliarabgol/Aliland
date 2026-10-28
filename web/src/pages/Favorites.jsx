import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useI18n } from '../lib/i18n.jsx';
import { useLibrary } from '../lib/store.jsx';
import VehicleCard from '../components/VehicleCard.jsx';
import { Icon } from '../components/Icons.jsx';

export default function Favorites() {
  const { favorites } = useLibrary();
  const { t, num } = useI18n();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!favorites.length) {
      setItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get(`/vehicles?slugs=${favorites.join(',')}`)
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [favorites]);

  return (
    <>
      <section className="page-hero">
        <div className="shell">
          <nav className="breadcrumbs" aria-label={t('nav.menu')}>
            <Link to="/">{t('nav.home')}</Link>
            <span className="sep">/</span>
            <span>{t('fav.title')}</span>
          </nav>
          <h1>{t('fav.title')}</h1>
          <p>{t('fav.desc')}</p>
          <span className="tag tag--cobalt">
            <Icon name="heart" size={13} />
            {num(items.length)}
          </span>
        </div>
      </section>

      <div className="shell" style={{ paddingBlock: 'clamp(26px,4vw,50px) clamp(50px,8vw,90px)' }}>
        {loading ? (
          <div className="vehicle-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="skeleton" key={index} style={{ height: 330 }} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <Icon name="heart" size={30} />
            <h3>{t('fav.empty')}</h3>
            <Link className="btn btn--primary" to="/vehicles">
              {t('nav.allVehicles')}
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          </div>
        ) : (
          <div className="vehicle-grid">
            {items.map((vehicle) => (
              <VehicleCard vehicle={vehicle} key={vehicle.slug} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
