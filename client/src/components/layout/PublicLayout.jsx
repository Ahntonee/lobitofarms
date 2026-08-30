import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PublicLayout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <Navbar />
      <main id="main-content" className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
