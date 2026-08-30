import { useEffect, useState } from 'react';
import api from '../../api/client';
import { LoadingState, EmptyState } from '../../components/ui/LoadingState';
import { useAuth } from '../../context/AuthContext';

const EMPTY = { name: '', role: '', quote: '', image: '', featured: false };

export default function Testimonials() {
  const { hasRole } = useAuth();
  const canDelete = hasRole('editor', 'super_admin');
  const [items, setItems] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  function load() {
    api.get('/testimonials').then((res) => setItems(res.data));
  }
  useEffect(load, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/testimonials/${editingId}`, form);
      } else {
        await api.post('/testimonials', form);
      }
      setForm(EMPTY);
      setEditingId(null);
      load();
    } finally {
      setSaving(false);
    }
  }

  function startEdit(item) {
    setEditingId(item._id);
    setForm({ name: item.name, role: item.role, quote: item.quote, image: item.image, featured: item.featured });
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this testimonial?')) return;
    await api.delete(`/testimonials/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="h3 mb-4">Testimonials</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
            <h2 className="h6 mb-3">{editingId ? 'Edit Testimonial' : 'New Testimonial'}</h2>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <input className="form-control" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Quote</label>
              <textarea className="form-control" rows={3} required value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Image URL</label>
              <input className="form-control" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div className="form-check mb-3">
              <input type="checkbox" className="form-check-input" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
              <label className="form-check-label" htmlFor="featured">Featured</label>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={saving}>{editingId ? 'Update' : 'Add'}</button>
              {editingId && (
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingId(null); setForm(EMPTY); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        <div className="col-12 col-lg-7">
          {!items ? (
            <LoadingState />
          ) : items.length === 0 ? (
            <EmptyState message="No testimonials yet." />
          ) : (
            <div className="d-flex flex-column gap-3">
              {items.map((t) => (
                <div key={t._id} className="card border-0 shadow-sm p-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <strong>{t.name}</strong> <span className="text-muted-warm small">{t.role}</span>
                      {t.featured && <span className="badge bg-accent ms-2">Featured</span>}
                      <p className="small mb-0 mt-1">&ldquo;{t.quote}&rdquo;</p>
                    </div>
                    <div className="d-flex flex-column gap-1">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(t)}>Edit</button>
                      {canDelete && <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(t._id)}>Delete</button>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
