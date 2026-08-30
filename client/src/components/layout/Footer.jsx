import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function Footer() {
  const settings = useSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer bg-primary-dark text-white pt-5 pb-4 mt-auto">
      <div className="container">
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <h2 className="h5 mb-2">{settings.siteName || 'Lobito Farms'}</h2>
            <p className="small mb-0" style={{ color: '#d9e5da' }}>
              {settings.tagline || settings.footerText}
            </p>
          </div>
          <div className="col-6 col-md-2">
            <h3 className="h6 mb-3">Explore</h3>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/crops">Our Crops</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
            </ul>
          </div>
          <div className="col-6 col-md-2">
            <h3 className="h6 mb-3">Foundation</h3>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              <li><Link to="/ngo">Programs</Link></li>
              <li><Link to="/ngo/donate">Donate</Link></li>
              <li><Link to="/ngo/volunteer">Volunteer</Link></li>
            </ul>
          </div>
          <div className="col-12 col-md-4">
            <h3 className="h6 mb-3">Contact</h3>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              {settings.contactEmail && <li>{settings.contactEmail}</li>}
              {settings.contactPhone && <li>{settings.contactPhone}</li>}
              {settings.address && <li>{settings.address}</li>}
            </ul>
          </div>
        </div>
        <hr className="border-light opacity-25 my-4" />
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small">
          <span style={{ color: '#d9e5da' }}>© {year} {settings.siteName || 'Lobito Farms'}. All rights reserved.</span>
          <Link to="/admin/login" className="text-white-50">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
