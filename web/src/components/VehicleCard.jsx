import { Link } from 'react-router-dom';
import { useI18n } from '../lib/i18n.jsx';
import { useLibrary } from '../lib/store.jsx';
import VehicleArt from './VehicleArt.jsx';
import { Icon } from './Icons.jsx';

export default function VehicleCard({ vehicle, compact = false }) {
  const { t, bi, num, money } = useI18n();
  const { isFavorite, toggleFavorite, isCompared, toggleCompare } = useLibrary();
  if (!vehicle) return null;

  const fav = isFavorite(vehicle.slug);
  const compared = isCompared(vehicle.slug);

  return (
    <article className="vehicle-card">
      <div className="vehicle-card__art">
        <Link to={`/vehicle/${vehicle.slug}`} aria-label={`${bi(vehicle, 'make')} ${bi(vehicle, 'model')}`}>
          <VehicleArt tone={vehicle.tone} accent={vehicle.accent} angle="front" />
        </Link>
        <div className="vehicle-card__badges">
          <span className="tag">{t(`cat.${vehicle.category}.short`)}</span>
          <span className="tag">{t('v.conceptArt')}</span>
        </div>
        <button
          type="button"
          className="vehicle-card__fav"
          aria-pressed={fav}
          aria-label={fav ? t('v.removeFav') : t('v.addFav')}
          onClick={() => toggleFavorite(vehicle.slug)}
        >
          <Icon name="heart" filled={fav} size={16} />
        </button>
      </div>

      <div className="vehicle-card__body">
        <div className="vehicle-card__title">
          <h3>
            <Link to={`/vehicle/${vehicle.slug}`}>
              {bi(vehicle, 'make')} {bi(vehicle, 'model')}
            </Link>
          </h3>
          <span className="num small muted">{num(vehicle.year_shamsi)}</span>
        </div>
        {!compact && <span className="vehicle-card__trim">{bi(vehicle, 'trim')}</span>}

        <div className="vehicle-card__specs">
          <span>
            <Icon name="calendar" size={13} />
            {num(vehicle.year_shamsi)}
          </span>
          <span>
            <Icon name="gauge" size={13} />
            {num(vehicle.mileage_km)} {t('v.km')}
          </span>
          <span>
            <Icon name="gear" size={13} />
            {t(`trans.${vehicle.transmission}`)}
          </span>
        </div>

        <div className="vehicle-card__foot">
          <div className="price">
            <span className="price__value num">{money(vehicle.price_demo)}</span>
            <span className="price__unit">{t('v.toman')} — {t('v.price')}</span>
          </div>
          <div className="card-actions">
            <button
              type="button"
              className="mini-btn"
              aria-pressed={compared}
              aria-label={compared ? t('v.removeCompare') : t('v.addCompare')}
              title={t('nav.compare')}
              onClick={() => toggleCompare(vehicle.slug)}
            >
              <Icon name="compare" size={15} />
            </button>
            <Link className="mini-btn" to={`/vehicle/${vehicle.slug}`} aria-label={t('act.details')}>
              <Icon name="arrowEnd" size={15} className="rtl-flip" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
