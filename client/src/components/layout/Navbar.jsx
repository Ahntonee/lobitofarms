import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';

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
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);
  const location = useLocation();

  // Close on route change (link click)
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (navRef.current && !navRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    document.addEventListener('touchstart', handle);
    return () => {
      document.removeEventListener('mousedown', handle);
      document.removeEventListener('touchstart', handle);
    };
  }, [open]);

  return (
    <nav ref={navRef} className="navbar navbar-expand-lg bg-white sticky-top shadow-sm py-3">
      <div className="container">
        <NavLink className="navbar-brand fs-4 d-flex align-items-center gap-2" to="/">
          <img
            src={settings.logo || '/images/lobito_logo.webp'}
            alt={settings.siteName || 'Lobito Farms'}
            style={{ height: 70, clipPath: 'circle(46%)' }}
          />
        </NavLink>

        <button
          className={`navbar-toggler${open ? '' : ' collapsed'}`}
          type="button"
          aria-controls="mainNav"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${open ? ' show' : ''}`} id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {links.map((link) => (
              <li className="nav-item" key={link.path}>
                <NavLink
                  to={link.path}
                  end={link.path === '/'}
                  className="nav-link"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
              <NavLink
                to="/ngo/donate"
                className="btn btn-accent btn-sm w-100"
                onClick={() => setOpen(false)}
              >
                Donate
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
