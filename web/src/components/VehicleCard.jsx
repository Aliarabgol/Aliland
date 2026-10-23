import { useState } from 'react';
import { Link } from 'react-router-dom';
import { VehicleImage, DemoImageBadge } from './VehicleImage.jsx';
import { PriceDisplay } from './PriceDisplay.jsx';
import { StatusBadge } from './StatusBadge.jsx';
import { mileageLabel, yearLabel } from '../lib/format.js';
import { useStore } from '../context/StoreContext.jsx';

export function VehicleCard({ vehicle }) {
  const { isFavorite, toggleFavorite, isCompared, toggleCompare } = useStore();
  const [notice, setNotice] = useState('');
  const fav = isFavorite(vehicle.slug);
  const cmp = isCompared(vehicle.slug);

  const handleCompare = () => {
    const result = toggleCompare(vehicle.slug);
    if (!result.ok) {
      setNotice(result.reason);
      setTimeout(() => setNotice(''), 3000);
    } else {
      setNotice('');
    }
  };

  return (
    <article className="card vehicle-card">
      <Link to={`/cars/${vehicle.slug}`} className="card-media" aria-label={`جزئیات ${vehicle.title}`}>
        <VehicleImage vehicle={vehicle} />
        <span className="media-badges">
          {vehicle.isDemo && <DemoImageBadge />}
          {vehicle.lifecycle !== 'available' && <StatusBadge status={vehicle.lifecycle} />}
        </span>
      </Link>
      <div className="card-body">
        <div className="card-head">
          <Link to={`/cars/${vehicle.slug}`} className="card-title">
            {vehicle.title}
          </Link>
          <span className="card-code">کد {vehicle.code}</span>
        </div>
        <p className="card-specs">
          <span>{vehicle.brand} {vehicle.model}</span>
          <span>{yearLabel(vehicle.year, vehicle.yearCalendar)}</span>
          <span>{mileageLabel(vehicle.mileageKm)}</span>
          {vehicle.transmission && <span>{vehicle.transmission}</span>}
          {vehicle.city && <span>{vehicle.city}</span>}
        </p>
        <PriceDisplay vehicle={vehicle} />
        <div className="card-actions">
          <Link to={`/cars/${vehicle.slug}`} className="btn btn-primary btn-sm">
            جزئیات
          </Link>
          <button
            type="button"
            className={`icon-btn ${fav ? 'is-on' : ''}`}
            aria-pressed={fav}
            aria-label={fav ? 'حذف از علاقه‌مندی' : 'افزودن به علاقه‌مندی'}
            onClick={() => toggleFavorite(vehicle.slug)}
          >
            {fav ? '♥' : '♡'}
          </button>
          <button
            type="button"
            className={`icon-btn ${cmp ? 'is-on' : ''}`}
            aria-pressed={cmp}
            aria-label={cmp ? 'حذف از مقایسه' : 'افزودن به مقایسه'}
            onClick={handleCompare}
          >
            ⇄
          </button>
        </div>
        {notice && <p className="inline-notice" role="status">{notice}</p>}
      </div>
    </article>
  );
}
