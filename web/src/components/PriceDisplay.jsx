import { priceLabel, dateLabel } from '../lib/format.js';

export function PriceDisplay({ vehicle, size = 'md' }) {
  const onRequest = vehicle.priceMode === 'on_request' || vehicle.price == null;
  return (
    <div className={`price price-${size} ${onRequest ? 'price-on-request' : ''}`}>
      <span className="price-value">{priceLabel(vehicle)}</span>
      {!onRequest && (
        <span className="price-note">آخرین تأیید: {dateLabel(vehicle.priceConfirmedAt) || 'ثبت نشده'}</span>
      )}
    </div>
  );
}
