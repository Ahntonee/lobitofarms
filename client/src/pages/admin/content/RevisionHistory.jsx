import { useEffect, useState } from 'react';
import api from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import useConfirm from '../../../hooks/useConfirm';

export default function RevisionHistory({ endpoint, id, labelField, onRestored }) {
  const [revisions, setRevisions] = useState([]);
  const { hasRole } = useAuth();
  const canRestore = hasRole('editor', 'super_admin');
  const { confirm, ConfirmDialog } = useConfirm();

  function load() {
    api.get(`${endpoint}/${id}/revisions`).then((res) => setRevisions(res.data)).catch(() => {});
  }

  useEffect(load, [endpoint, id]);

  async function handleRestore(index) {
    const ok = await confirm({ title: 'Restore Version', message: 'The current version will be saved to history first, then this version will be restored.', confirmLabel: 'Restore' });
    if (!ok) return;
    await api.post(`${endpoint}/${id}/revisions/${index}/restore`);
    load();
    onRestored?.();
  }

  if (revisions.length === 0) {
    return <p className="text-muted-warm small mb-0">No revisions yet — saved edits will appear here.</p>;
  }

  return (
    <>
    {ConfirmDialog}
    <ul className="list-group">
      {revisions.map((rev, i) => (
        <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <div className="small fw-semibold">{rev.data?.[labelField] || 'Untitled'}</div>
            <div className="small text-muted-warm">{new Date(rev.editedAt).toLocaleString()}</div>
          </div>
          {canRestore && (
            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleRestore(i)}>Restore</button>
          )}
        </li>
      ))}
    </ul>
    </>
  );
}
