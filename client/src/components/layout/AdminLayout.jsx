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
      {open && <div className="admin-sidebar-backdrop d-lg-none" onClick={() => setOpen(false)} />}

      <aside
        className={`admin-sidebar bg-primary-dark text-white p-3 ${open ? 'is-open' : ''}`}
        style={{ width: 240 }}
      >
        <Link to="/" className="d-flex align-items-center text-white text-decoration-none fw-bold fs-5 mb-4">
          {settings.logo ? (
            <img src={settings.logo} alt={settings.siteName || 'Lobito Farms'} style={{ height: 44 }} />
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
        <header className="bg-white border-bottom d-flex align-items-center gap-2 px-3 py-2">
          <button className="btn btn-outline-secondary btn-sm d-lg-none flex-shrink-0" onClick={() => setOpen((o) => !o)}>
            Menu
          </button>
          <div className="ms-auto d-flex align-items-center gap-2 gap-sm-3" style={{ minWidth: 0 }}>
            <span className="small text-muted-warm text-truncate d-none d-sm-block" style={{ maxWidth: 180 }}>
              {user?.name} <span className="text-uppercase">({user?.role.replace('_', ' ')})</span>
            </span>
            <button className="btn btn-sm btn-outline-secondary flex-shrink-0" onClick={logout}>Log Out</button>
          </div>
        </header>
        <main className="p-3 p-md-4 flex-grow-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
