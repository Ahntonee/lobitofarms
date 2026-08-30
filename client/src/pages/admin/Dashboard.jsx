import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const COUNTERS = [
  { label: 'Crops', endpoint: '/crops', to: '/admin/content/crops' },
  { label: 'Products', endpoint: '/products', to: '/admin/content/products' },
  { label: 'Blog Posts', endpoint: '/blog', to: '/admin/content/blog' },
  { label: 'NGO Programs', endpoint: '/ngo-programs', to: '/admin/content/ngo-programs' },
];

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const [counts, setCounts] = useState({});
  const [newInquiries, setNewInquiries] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    Promise.all(COUNTERS.map((c) => api.get(c.endpoint))).then((results) => {
      const next = {};
      results.forEach((res, i) => (next[COUNTERS[i].label] = res.data.length));
      setCounts(next);
    });
    api.get('/inquiries', { params: { status: 'new' } }).then((res) => setNewInquiries(res.data.length)).catch(() => setNewInquiries(0));
    if (hasRole('editor', 'super_admin')) {
      api.get('/audit-log', { params: { limit: 8 } }).then((res) => setRecentActivity(res.data)).catch(() => {});
    }
  }, [hasRole]);

  return (
    <div>
      <h1 className="h3 mb-1">Welcome back, {user?.name?.split(' ')[0]}</h1>
      <p className="text-muted-warm mb-4">Here's what's happening across Lobito Farms.</p>

      <div className="row g-3 mb-4">
        {COUNTERS.map((c) => (
          <div className="col-6 col-md-3" key={c.label}>
            <Link to={c.to} className="text-decoration-none">
              <div className="card border-0 shadow-sm p-3 text-center h-100">
                <div className="display-6 fw-bold text-primary">{counts[c.label] ?? '—'}</div>
                <div className="small text-muted-warm">{c.label}</div>
              </div>
            </Link>
          </div>
        ))}
        <div className="col-6 col-md-3">
          <Link to="/admin/inquiries" className="text-decoration-none">
            <div className="card border-0 shadow-sm p-3 text-center h-100">
              <div className="display-6 fw-bold text-accent">{newInquiries ?? '—'}</div>
              <div className="small text-muted-warm">New Inquiries</div>
            </div>
          </Link>
        </div>
      </div>

      {hasRole('editor', 'super_admin') && (
        <div className="card border-0 shadow-sm p-4">
          <h2 className="h6 mb-3">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-muted-warm small mb-0">No activity yet.</p>
          ) : (
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              {recentActivity.map((entry) => (
                <li key={entry._id} className="d-flex justify-content-between border-bottom pb-2">
                  <span>
                    <strong>{entry.userName}</strong> {entry.action.replace(':', ' → ')} {entry.entityType.toLowerCase()}{' '}
                    <em>{entry.entityLabel}</em>
                  </span>
                  <span className="text-muted-warm">{new Date(entry.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
