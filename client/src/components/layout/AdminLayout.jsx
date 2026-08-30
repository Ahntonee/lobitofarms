import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/content/crops', label: 'Crops' },
  { to: '/admin/content/products', label: 'Products' },
  { to: '/admin/content/blog', label: 'Blog Posts' },
  { to: '/admin/content/ngo-programs', label: 'NGO Programs' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/pages', label: 'Pages' },
  { to: '/admin/media', label: 'Media Library' },
  { to: '/admin/inquiries', label: 'Inquiries' },
  { to: '/admin/audit-log', label: 'Audit Log', roles: ['editor', 'super_admin'] },
  { to: '/admin/users', label: 'Users', roles: ['super_admin'] },
  { to: '/admin/settings', label: 'Site Settings', roles: ['super_admin'] },
];

export default function AdminLayout() {
  const { user, logout, hasRole } = useAuth();
  const settings = useSiteSettings();
  const [open, setOpen] = useState(false);

  const links = NAV.filter((item) => !item.roles || hasRole(...item.roles));

  return (
    <div className="d-flex min-vh-100 bg-cream">
      <aside
        className={`bg-primary-dark text-white p-3 ${open ? 'd-block' : 'd-none'} d-lg-block`}
        style={{ width: 240, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}
      >
        <Link to="/" className="d-flex align-items-center text-white text-decoration-none fw-bold fs-5 mb-4">
          {settings.logo ? (
            <img src={settings.logo} alt={settings.siteName || 'Lobito Farms'} style={{ height: 32 }} />
          ) : (
            settings.siteName || 'Lobito Farms'
          )}
        </Link>
        <nav className="nav flex-column gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link text-white px-2 py-2 rounded ${isActive ? 'bg-primary' : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <header className="bg-white border-bottom d-flex align-items-center justify-content-between px-3 py-2">
          <button className="btn btn-outline-secondary btn-sm d-lg-none" onClick={() => setOpen((o) => !o)}>
            Menu
          </button>
          <div className="ms-auto d-flex align-items-center gap-3">
            <span className="small text-muted-warm">
              {user?.name} <span className="text-uppercase">({user?.role.replace('_', ' ')})</span>
            </span>
            <button className="btn btn-sm btn-outline-secondary" onClick={logout}>Log Out</button>
          </div>
        </header>
        <main className="p-3 p-md-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
