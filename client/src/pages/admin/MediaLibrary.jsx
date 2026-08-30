import { useEffect, useRef, useState } from 'react';
import api from '../../api/client';
import { LoadingState, EmptyState } from '../../components/ui/LoadingState';
import { useAuth } from '../../context/AuthContext';

export default function MediaLibrary() {
  const { hasRole } = useAuth();
  const canDelete = hasRole('editor', 'super_admin');
  const [items, setItems] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [folder, setFolder] = useState('');
  const fileInput = useRef(null);

  function load() {
    api.get('/media', { params: folder ? { folder } : {} }).then((res) => setItems(res.data));
  }
  useEffect(load, [folder]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);
      await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      load();
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete "${item.filename}"?`)) return;
    try {
      await api.delete(`/media/${item._id}`);
      load();
    } catch (err) {
      if (err.response?.status === 409 && window.confirm('This file is used elsewhere. Delete anyway?')) {
        await api.delete(`/media/${item._id}`, { params: { force: true } });
        load();
      }
    }
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">Media Library</h1>
        <div className="d-flex gap-2">
          <input className="form-control form-control-sm" placeholder="Filter by folder" value={folder} onChange={(e) => setFolder(e.target.value)} style={{ width: 180 }} />
          <label className="btn btn-primary btn-sm mb-0">
            {uploading ? 'Uploading…' : 'Upload Image'}
            <input ref={fileInput} type="file" accept="image/*" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {!items ? (
        <LoadingState />
      ) : items.length === 0 ? (
        <EmptyState message="No media uploaded yet." />
      ) : (
        <div className="row g-3">
          {items.map((item) => (
            <div className="col-6 col-sm-4 col-md-3 col-lg-2" key={item._id}>
              <div className="card border-0 shadow-sm h-100">
                <img src={item.url} alt={item.filename} style={{ height: 110, objectFit: 'cover' }} loading="lazy" />
                <div className="card-body p-2">
                  <div className="small text-truncate" title={item.filename}>{item.filename}</div>
                  <div className="small text-muted-warm">{item.folder}</div>
                  {canDelete && (
                    <button className="btn btn-sm btn-outline-danger w-100 mt-2" onClick={() => handleDelete(item)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
