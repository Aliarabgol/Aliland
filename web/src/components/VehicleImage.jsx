import { CarArt } from './CarArt.jsx';

export function VehicleImage({ vehicle, variant = 'card', className = '' }) {
  if (vehicle?.cover) {
    return (
      <img
        className={className}
        src={vehicle.cover}
        alt={vehicle.title ? `تصویر ${vehicle.title}` : 'تصویر خودرو'}
        loading="lazy"
      />
    );
  }
  return (
    <CarArt
      className={className}
      seed={vehicle?.slug || vehicle?.title || 'demo'}
      variant={variant}
      label={vehicle?.title}
    />
  );
}

export function DemoImageBadge() {
  return <span className="badge badge-demo">تصویر نمونه</span>;
}
