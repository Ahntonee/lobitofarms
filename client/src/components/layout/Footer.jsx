import { Link } from 'react-router-dom';
import { useSiteSettings } from '../../context/SiteSettingsContext';

const SOCIAL_LABELS = { facebook: 'Facebook', instagram: 'Instagram', twitter: 'Twitter', linkedin: 'LinkedIn' };

// Fallback shown only until site settings load (or if an admin clears the groups) — the
// real, admin-editable groups live in Site Settings → Navigation.
const FALLBACK_GROUPS = [
  { title: 'Explore', links: [
    { label: 'Our Crops', path: '/crops' },
    { label: 'Products', path: '/products' },
    { label: 'Shop', path: '/shop' },
    { label: 'Blog', path: '/blog' },
    { label: 'Gallery', path: '/gallery' },
  ] },
  { title: 'Foundation', links: [
    { label: 'Programs', path: '/ngo' },
    { label: 'Donate', path: '/ngo/donate' },
    { label: 'Volunteer', path: '/ngo/volunteer' },
  ] },
];

export default function Footer() {
  const settings = useSiteSettings();
  const year = new Date().getFullYear();
  const linkGroups = settings.footerLinkGroups?.length ? settings.footerLinkGroups : FALLBACK_GROUPS;

  // '#' is the seed/admin-form placeholder for "not set yet" — only show platforms an
  // admin has actually filled in with a real URL.
  const socialLinks = Object.entries(settings.social || {}).filter(([, url]) => url && url !== '#');

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
          {linkGroups.map((group) => (
            <div className="col-6 col-md-2" key={group.title}>
              <h3 className="h6 mb-3">{group.title}</h3>
              <ul className="list-unstyled small d-flex flex-column gap-2">
                {group.links.map((link) => (
                  <li key={link.path}><Link to={link.path}>{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-12 col-md-4">
            <h3 className="h6 mb-3">Contact</h3>
            <ul className="list-unstyled small d-flex flex-column gap-2">
              {settings.contactEmail && <li>{settings.contactEmail}</li>}
              {settings.contactPhone && <li>{settings.contactPhone}</li>}
              {settings.address && <li>{settings.address}</li>}
            </ul>
            {socialLinks.length > 0 && (
              <div className="d-flex gap-3 mt-3">
                {socialLinks.map(([key, url]) => (
                  <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="small">
                    {SOCIAL_LABELS[key] || key}
                  </a>
                ))}
              </div>
            )}
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
