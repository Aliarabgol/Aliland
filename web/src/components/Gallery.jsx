import { useState } from 'react';
import { CarArt } from './CarArt.jsx';

const CATEGORIES = [
  { key: 'body', label: 'بدنه' },
  { key: 'interior', label: 'کابین' },
  { key: 'engine', label: 'موتور' },
  { key: 'mileage', label: 'کیلومتر' },
];

export function Gallery({ vehicle, media = [] }) {
  const images = media.length
    ? media.filter((m) => m.kind === 'image').map((m) => ({ url: m.url, label: m.alt_fa || vehicle.title, demo: false }))
    : CATEGORIES.map((c) => ({ label: c.label, demo: true, key: c.key }));

  const [active, setActive] = useState(0);
  const current = images[active] || images[0];

  return (
    <div className="gallery">
      <div className="gallery-main">
        {current?.demo ? (
          <CarArt seed={`${vehicle.slug}-${current.key}`} label={`${vehicle.title} — ${current.label}`} />
        ) : (
          <img src={current.url} alt={current.label} />
        )}
        {current?.demo && <span className="badge badge-demo gallery-badge">تصویر نمونه — {current.label}</span>}
      </div>
      {images.length > 1 && (
        <div className="gallery-thumbs" role="tablist" aria-label="تصاویر خودرو">
          {images.map((img, i) => (
            <button
              key={img.url || img.key}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`thumb ${i === active ? 'is-active' : ''}`}
              onClick={() => setActive(i)}
            >
              {img.demo ? (
                <CarArt seed={`${vehicle.slug}-${img.key}`} label={img.label} />
              ) : (
                <img src={img.url} alt={img.label} loading="lazy" />
              )}
              <span>{img.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
