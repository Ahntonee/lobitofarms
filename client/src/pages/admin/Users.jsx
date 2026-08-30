import { useEffect, useState } from 'react';
import api from '../../api/client';
import { LoadingState } from '../../components/ui/LoadingState';
import { useAuth } from '../../context/AuthContext';

const ROLES = ['contributor', 'editor', 'super_admin'];
const EMPTY = { name: '', email: '', password: '', role: 'contributor' };

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');

  function load() {
    api.get('/users').then((res) => setUsers(res.data));
  }
  useEffect(load, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/users', form);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create user');
    }
  }

  async function handleRoleChange(id, role) {
    await api.put(`/users/${id}`, { role });
    load();
  }

  async function handleToggleActive(u) {
    await api.put(`/users/${u.id}`, { active: !u.active });
    load();
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this user?')) return;
    await api.delete(`/users/${id}`);
    load();
  }

  return (
    <div>
      <h1 className="h3 mb-4">Users</h1>
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <form onSubmit={handleCreate} className="card border-0 shadow-sm p-4">
            <h2 className="h6 mb-3">Invite User</h2>
            <div className="mb-3"><label className="form-label">Name</label><input className="form-control" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="mb-3"><label className="form-label">Email</label><input type="email" className="form-control" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="mb-3"><label className="form-label">Temporary Password</label><input className="form-control" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
              </select>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            <button type="submit" className="btn btn-primary">Create User</button>
          </form>
        </div>
        <div className="col-12 col-lg-7">
          {!users ? <LoadingState /> : (
            <div className="table-responsive">
              <table className="table bg-white align-middle">
                <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th /></tr></thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <select className="form-select form-select-sm" value={u.role} onChange={(e) => handleRoleChange(u.id, e.target.value)} disabled={u.id === me.id}>
                          {ROLES.map((r) => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                      <td>
                        <button className={`btn btn-sm ${u.active ? 'btn-outline-secondary' : 'btn-outline-success'}`} onClick={() => handleToggleActive(u)} disabled={u.id === me.id}>
                          {u.active ? 'Active' : 'Deactivated'}
                        </button>
                      </td>
                      <td>
                        {u.id !== me.id && <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(u.id)}>Delete</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
