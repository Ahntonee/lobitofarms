import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ShareButton from '../ui/ShareButton';
import { setCanonical } from '../../utils/meta';

export default function PublicLayout() {
  const { pathname } = useLocation();

  // Every route shares one HTML shell, so each page declares its own canonical URL
  // (always the apex domain) — this is what stops Google flagging pages as duplicates.
  useEffect(() => {
    setCanonical(pathname);
  }, [pathname]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <ShareButton />
    </div>
  );
}
