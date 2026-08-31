import { NavLink } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/crops', label: 'Crops' },
  { to: '/products', label: 'Products' },
  { to: '/ngo', label: 'NGO' },
  { to: '/blog', label: 'Blog' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const settings = useSiteSettings();

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
            {LINKS.map((link) => (
              <li className="nav-item" key={link.to}>
                <NavLink to={link.to} end={link.end} className="nav-link">
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
