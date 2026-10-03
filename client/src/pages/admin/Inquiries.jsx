import { useEffect, useState } from 'react';
import api from '../../api/client';
import { LoadingState, EmptyState } from '../../components/ui/LoadingState';

const TYPES = ['contact', 'volunteer', 'donation', 'quote', 'order'];
const STATUSES = ['new', 'read', 'responded', 'archived'];

export default function Inquiries() {
  const [items, setItems] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');

  function load() {
    api.get('/inquiries', { params: typeFilter ? { type: typeFilter } : {} }).then((res) => setItems(res.data));
  }
  useEffect(load, [typeFilter]);

  async function handleStatus(id, status) {
    await api.patch(`/inquiries/${id}/status`, { status });
    load();
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Inquiries</h1>
        <select className="form-select form-select-sm" style={{ width: 180 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All types</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {!items ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState message="No inquiries yet." />
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((item) => (
            <div key={item._id} className="card border-0 shadow-sm p-3">
              <div className="d-flex flex-wrap justify-content-between gap-2">
                <div>
                  <span className="badge bg-cream-dark text-dark text-uppercase me-2">{item.type}</span>
                  <strong>{item.name}</strong> <span className="text-muted-warm small">{item.email} {item.phone && `· ${item.phone}`}</span>
                  {item.message && <p className="small mb-1 mt-2">{item.message}</p>}
                  {item.meta && Object.keys(item.meta).length > 0 && (
                    <p className="small text-muted-warm mb-0">
                      {Object.entries(item.meta).map(([k, v]) => `${k}: ${v}`).join(' · ')}
                    </p>
                  )}
                  <p className="small text-muted-warm mb-0 mt-1">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <select className="form-select form-select-sm" style={{ width: 140, height: 'fit-content' }} value={item.status} onChange={(e) => handleStatus(item._id, e.target.value)}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
