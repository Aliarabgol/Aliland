import { useEffect, useState } from 'react';
import { NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { api } from '../../api.js';

const NAV = [
  { to: '/admin', label: 'داشبورد', end: true },
  { to: '/admin/vehicles', label: 'خودروها' },
  { to: '/admin/leads', label: 'درخواست‌ها' },
  { to: '/admin/articles', label: 'مقالات' },
  { to: '/admin/settings', label: 'تنظیمات', adminOnly: true },
  { to: '/admin/staff', label: 'کارکنان', adminOnly: true },
];

export default function AdminLayout() {
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) {
    return <div className="admin-shell"><div className="skeleton skeleton-block" /></div>;
  }
  if (!user) return <Navigate to="/admin/login" replace />;

  const logout = async () => {
    await api.post('/auth/logout', {});
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">پنل نمایشگاه</div>
        <nav aria-label="منوی پنل">
          {NAV.filter((n) => !n.adminOnly || user.role === 'admin').map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className="admin-link">
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <span>{user.name}</span>
          <span className="badge badge-muted">{user.role === 'admin' ? 'مدیر' : 'کارشناس فروش'}</span>
          <button type="button" className="link-btn" onClick={logout}>خروج</button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet context={{ user }} />
      </div>
    </div>
  );
}
