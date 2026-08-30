import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../../api/client';
import { LoadingState, EmptyState } from '../../../components/ui/LoadingState';
import StatusBadge from '../../../components/ui/StatusBadge';

export default function PagesList() {
  const [pages, setPages] = useState(null);
  const navigate = useNavigate();

  function load() {
    api.get('/pages').then((res) => setPages(res.data));
  }
  useEffect(load, []);

  async function handleCreate() {
    const slug = window.prompt('New page slug (e.g. "landing-partners")');
    if (!slug) return;
    const title = window.prompt('Page title', slug) || slug;
    const res = await api.post('/pages', { slug, title, blocks: [], status: 'draft' });
    navigate(`/admin/pages/${res.data._id}`);
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Pages</h1>
        <button className="btn btn-primary btn-sm" onClick={handleCreate}>+ New Page</button>
      </div>
      {!pages ? (
        <LoadingState />
      ) : pages.length === 0 ? (
        <EmptyState message="No pages yet." />
      ) : (
        <div className="table-responsive">
          <table className="table bg-white align-middle">
            <thead>
              <tr><th>Title</th><th>Slug</th><th>Status</th><th>Blocks</th><th /></tr>
            </thead>
            <tbody>
              {pages.map((p) => (
                <tr key={p._id}>
                  <td>{p.title}</td>
                  <td><code>/{p.slug}</code></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{p.blocks?.length || 0}</td>
                  <td><Link className="btn btn-sm btn-outline-secondary" to={`/admin/pages/${p._id}`}>Edit</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
