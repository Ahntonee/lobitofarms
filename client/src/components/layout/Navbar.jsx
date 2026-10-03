import { NavLink } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';

// Fallback shown only until site settings load (or if an admin clears the list) so the
// navbar is never empty — the real, admin-editable list lives in Site Settings.
const FALLBACK_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/crops', label: 'Crops' },
  { path: '/products', label: 'Products' },
  { path: '/shop', label: 'Shop' },
  { path: '/ngo', label: 'NGO' },
  { path: '/blog', label: 'Blog' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const settings = useSiteSettings();
  const links = settings.navLinks?.length ? settings.navLinks : FALLBACK_LINKS;

  return (
    <nav className="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
      <div className="container">
        <NavLink className="navbar-brand fs-4 d-flex align-items-center gap-2" to="/">
          {settings.logo ? (
            <img src={settings.logo} alt={settings.siteName || 'Lobito Farms'} style={{ height: 56 }} />
          ) : (
            settings.siteName || 'Lobito Farms'
          )}
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {links.map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink to={link.path} end={link.path === '/'} className="nav-link">
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <NavLink to="/ngo/donate" className="btn btn-accent btn-sm w-100">
                Donate
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
