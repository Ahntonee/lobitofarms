import { useEffect, useState } from 'react';
import api from '../../api/client';
import { LoadingState, EmptyState } from '../../components/ui/LoadingState';

export default function AuditLog() {
  const [entries, setEntries] = useState(null);

  useEffect(() => {
    api.get('/audit-log', { params: { limit: 200 } }).then((res) => setEntries(res.data));
  }, []);

  return (
    <div>
      <h1 className="h3 mb-4">Audit Log</h1>
      {!entries ? (
        <LoadingState />
      ) : entries.length === 0 ? (
        <EmptyState message="No activity recorded yet." />
      ) : (
        <div className="table-responsive">
          <table className="table bg-white align-middle">
            <thead><tr><th>When</th><th>User</th><th>Action</th><th>Type</th><th>Item</th></tr></thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e._id}>
                  <td className="small">{new Date(e.createdAt).toLocaleString()}</td>
                  <td>{e.userName}</td>
                  <td className="text-capitalize">{e.action.replace(':', ' → ')}</td>
                  <td>{e.entityType}</td>
                  <td>{e.entityLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
