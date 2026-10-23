import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useStore } from '../context/StoreContext.jsx';
import { VehicleCard } from '../components/VehicleCard.jsx';
import { EmptyState } from '../components/States.jsx';

export default function Favorites() {
  const { favorites } = useStore();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favorites.length === 0) {
      setVehicles([]);
      return;
    }
    setLoading(true);
    Promise.allSettled(favorites.map((slug) => api.get(`/vehicles/${slug}`)))
      .then((results) => setVehicles(results.filter((r) => r.status === 'fulfilled').map((r) => r.value.vehicle)))
      .finally(() => setLoading(false));
  }, [favorites]);

  if (favorites.length === 0) {
    return (
      <div className="container page">
        <h1>علاقه‌مندی‌ها</h1>
        <EmptyState title="هنوز خودرویی را ذخیره نکرده‌اید" description="با دکمهٔ قلب روی کارت خودروها، آن‌ها را برای بعد ذخیره کنید.">
          <Link to="/cars" className="btn btn-primary">مشاهدهٔ موجودی</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>علاقه‌مندی‌ها</h1>
      {loading ? (
        <div className="skeleton skeleton-block" />
      ) : (
        <div className="vehicle-grid">
          {vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      )}
    </div>
  );
}
