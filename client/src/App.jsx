import { Routes, Route } from 'react-router-dom';

import PublicLayout from './components/layout/PublicLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ui/ProtectedRoute';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Crops from './pages/public/Crops';
import CropDetail from './pages/public/CropDetail';
import Products from './pages/public/Products';
import ProductDetail from './pages/public/ProductDetail';
import NGOHub from './pages/public/NGOHub';
import NGOProgramDetail from './pages/public/NGOProgramDetail';
import Donate from './pages/public/Donate';
import Volunteer from './pages/public/Volunteer';
import Blog from './pages/public/Blog';
import BlogPostDetail from './pages/public/BlogPostDetail';
import Gallery from './pages/public/Gallery';
import Contact from './pages/public/Contact';
import Shop from './pages/public/Shop';
import NotFound from './pages/public/NotFound';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ContentList from './pages/admin/content/ContentList';
import ContentEditor from './pages/admin/content/ContentEditor';
import Testimonials from './pages/admin/Testimonials';
import MediaLibrary from './pages/admin/MediaLibrary';
import PagesList from './pages/admin/pages/PagesList';
import PageEditor from './pages/admin/pages/PageEditor';
import Users from './pages/admin/Users';
import AuditLog from './pages/admin/AuditLog';
import Inquiries from './pages/admin/Inquiries';
import SiteSettingsAdmin from './pages/admin/SiteSettingsAdmin';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/crops" element={<Crops />} />
        <Route path="/crops/:slug" element={<CropDetail />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/ngo" element={<NGOHub />} />
        <Route path="/ngo/programs/:slug" element={<NGOProgramDetail />} />
        <Route path="/ngo/donate" element={<Donate />} />
        <Route path="/ngo/volunteer" element={<Volunteer />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPostDetail />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop" element={<Shop />} />
      </Route>

      <Route path="/admin/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="content/:type" element={<ContentList />} />
        <Route path="content/:type/:id" element={<ContentEditor />} />
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="pages" element={<PagesList />} />
        <Route path="pages/:id" element={<PageEditor />} />
        <Route path="inquiries" element={<Inquiries />} />
        <Route
          path="audit-log"
          element={
            <ProtectedRoute roles={['editor', 'super_admin']}>
              <AuditLog />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute roles={['super_admin']}>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute roles={['super_admin']}>
              <SiteSettingsAdmin />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
