import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/client';
import { CONTENT_TYPES, STATUS_OPTIONS } from '../../../config/contentTypes';
import FieldInput from '../../../components/ui/FieldInput';
import { LoadingState, ErrorState } from '../../../components/ui/LoadingState';
import { useAuth } from '../../../context/AuthContext';
import RevisionHistory from './RevisionHistory';

function emptyForm(config) {
  const form = { status: 'draft', seo: { metaTitle: '', metaDescription: '', ogImage: '' } };
  config.fields.forEach((f) => {
    form[f.name] = f.type === 'images' ? [] : f.type === 'tags' ? [] : f.type === 'number' ? 0 : '';
  });
  return form;
}

export default function ContentEditor() {
  const { type, id } = useParams();
  const config = CONTENT_TYPES[type];
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const isNew = id === 'new';
  const canPublish = hasRole('editor', 'super_admin');

  const [form, setForm] = useState(() => emptyForm(config));
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [revisionKey, setRevisionKey] = useState(0);

  function load() {
    if (isNew) return;
    setLoading(true);
    setError(false);
    api
      .get(`${config.endpoint}/${id}`)
      .then((res) => setForm({ ...emptyForm(config), ...res.data, seo: { ...emptyForm(config).seo, ...res.data.seo } }))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(load, [type, id]);

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    try {
      if (isNew) {
        const res = await api.post(config.endpoint, form);
        navigate(`/admin/content/${type}/${res.data._id}`, { replace: true });
      } else {
        const res = await api.put(`${config.endpoint}/${id}`, form);
        setForm({ ...emptyForm(config), ...res.data, seo: { ...emptyForm(config).seo, ...res.data.seo } });
        setRevisionKey((k) => k + 1);
      }
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (!config) return <ErrorState message="Unknown content type." />;
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message="Could not load this item." onRetry={load} />;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Link to={`/admin/content/${type}`} className="small text-muted-warm">← Back to {config.pluralLabel}</Link>
          <h1 className="h3 mb-0">{isNew ? `New ${config.label}` : `Edit ${config.label}`}</h1>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4">
            {config.fields.map((field) => (
              <FieldInput key={field.name} field={field} value={form[field.name]} onChange={(v) => updateField(field.name, v)} />
            ))}

            <hr className="my-4" />
            <h2 className="h6">SEO</h2>
            <div className="mb-3">
              <label className="form-label">Meta Title</label>
              <input className="form-control" maxLength={70} value={form.seo?.metaTitle || ''} onChange={(e) => updateField('seo', { ...form.seo, metaTitle: e.target.value })} />
            </div>
            <div className="mb-3">
              <label className="form-label">Meta Description</label>
              <textarea className="form-control" rows={2} maxLength={160} value={form.seo?.metaDescription || ''} onChange={(e) => updateField('seo', { ...form.seo, metaDescription: e.target.value })} />
            </div>

            {saveError && <div className="alert alert-danger py-2">{saveError}</div>}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </form>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h2 className="h6">Status</h2>
            <select
              className="form-select mb-2"
              value={form.status}
              disabled={!canPublish && form.status === 'published'}
              onChange={(e) => updateField('status', e.target.value)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} disabled={s === 'published' && !canPublish}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
            <p className="small text-muted-warm mb-0">
              {canPublish ? 'You can publish directly.' : 'Contributors can save drafts; an editor must publish.'}
            </p>
          </div>

          {!isNew && (
            <div className="card border-0 shadow-sm p-4">
              <h2 className="h6">Revision History</h2>
              <RevisionHistory key={revisionKey} endpoint={config.endpoint} id={id} labelField={config.labelField} onRestored={load} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
