import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/client';
import { CONTENT_TYPES, STATUS_OPTIONS } from '../../../config/contentTypes';
import { LoadingState, ErrorState, EmptyState } from '../../../components/ui/LoadingState';
import StatusBadge from '../../../components/ui/StatusBadge';
import { useAuth } from '../../../context/AuthContext';

export default function ContentList() {
  const { type } = useParams();
  const config = CONTENT_TYPES[type];
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const canPublish = hasRole('editor', 'super_admin');

  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  function load() {
    setError(false);
    setItems(null);
    const params = statusFilter ? { status: statusFilter } : {};
    api.get(config.endpoint, { params }).then((res) => setItems(res.data)).catch(() => setError(true));
  }

  useEffect(load, [type, statusFilter]);

  async function handleDelete(id) {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    await api.delete(`${config.endpoint}/${id}`);
    load();
  }

  async function handleStatusChange(id, status) {
    await api.patch(`${config.endpoint}/${id}/status`, { status });
    load();
  }

  if (!config) return <ErrorState message="Unknown content type." />;

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h1 className="h3 mb-0">{config.pluralLabel}</h1>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select form-select-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: 160 }}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(`/admin/content/${type}/new`)}>
            + New {config.label}
          </button>
        </div>
      </div>

      {error ? (
        <ErrorState onRetry={load} />
      ) : !items ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState message={`No ${config.pluralLabel.toLowerCase()} yet.`} />
      ) : (
        <div className="table-responsive">
          <table className="table align-middle bg-white">
            <thead>
              <tr>
                {config.listColumns.map((col) => (
                  <th key={col} className="text-capitalize">{col}</th>
                ))}
                <th style={{ width: 220 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {config.listColumns.map((col) => (
                    <td key={col}>
                      {col === 'status' ? <StatusBadge status={item.status} /> : String(item[col] ?? '—')}
                    </td>
                  ))}
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      <Link className="btn btn-sm btn-outline-secondary" to={`/admin/content/${type}/${item._id}`}>Edit</Link>
                      {canPublish && item.status !== 'published' && (
                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleStatusChange(item._id, 'published')}>Publish</button>
                      )}
                      {canPublish && item.status === 'published' && (
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => handleStatusChange(item._id, 'archived')}>Archive</button>
                      )}
                      {canPublish && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
