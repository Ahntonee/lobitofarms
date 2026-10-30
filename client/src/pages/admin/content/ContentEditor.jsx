import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../../api/client';
import { CONTENT_TYPES, STATUS_OPTIONS } from '../../../config/contentTypes';
import FieldInput from '../../../components/ui/FieldInput';
import { LoadingState, ErrorState } from '../../../components/ui/LoadingState';
import { useAuth } from '../../../context/AuthContext';
import RevisionHistory from './RevisionHistory';

// Single-image fields are stored as a plain string server-side but edited as an array by ImagePicker.
function toFormShape(config, data) {
  const out = { ...data };
  config.fields.forEach((f) => {
    if (f.type === 'images' && f.single) {
      const v = out[f.name];
      out[f.name] = Array.isArray(v) ? v : v ? [v] : [];
    }
  });
  return out;
}

function toApiShape(config, form) {
  const out = { ...form };
  config.fields.forEach((f) => {
    if (f.type === 'images' && f.single) out[f.name] = Array.isArray(out[f.name]) ? out[f.name][0] || '' : out[f.name] || '';
  });
  return out;
}

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
      .then((res) => setForm({ ...emptyForm(config), ...toFormShape(config, res.data), seo: { ...emptyForm(config).seo, ...res.data.seo } }))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }

  useEffect(load, [type, id]);

  function updateField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
  }

  const supportsSchedule = config?.fields.some((f) => f.name === 'publishAt');
  const isPublished = form.status === 'published';
  const scheduledFor = supportsSchedule && !isPublished && form.publishAt && new Date(form.publishAt) > new Date() ? new Date(form.publishAt) : null;

  async function save(overrides = {}) {
    if (overrides.schedule) {
      if (!form.publishAt || new Date(form.publishAt) <= new Date()) {
        setSaveError('Pick a publish date and time in the future, then click Schedule.');
        return;
      }
      delete overrides.schedule;
    }
    const payload = { ...form, ...overrides };
    setSaving(true);
    setSaveError('');
    try {
      if (isNew) {
        const res = await api.post(config.endpoint, toApiShape(config, payload));
        navigate(`/admin/content/${type}/${res.data._id}`, { replace: true });
      } else {
        const res = await api.put(`${config.endpoint}/${id}`, toApiShape(config, payload));
        setForm({ ...emptyForm(config), ...toFormShape(config, res.data), seo: { ...emptyForm(config).seo, ...res.data.seo } });
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
          <form onSubmit={(e) => e.preventDefault()} className="card border-0 shadow-sm p-4">
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
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="btn btn-outline-secondary" disabled={saving} onClick={() => save({ status: 'draft' })}>
                {saving ? 'Saving…' : 'Save as Draft'}
              </button>
              {canPublish && (
                <button type="button" className="btn btn-primary" disabled={saving} onClick={() => save({ status: 'published', publishAt: null })}>
                  {isPublished ? 'Update Published' : 'Publish Now'}
                </button>
              )}
              {canPublish && supportsSchedule && (
                <button type="button" className="btn btn-outline-primary" disabled={saving} onClick={() => save({ status: 'draft', schedule: true })}>
                  Schedule
                </button>
              )}
            </div>
            {supportsSchedule && canPublish && (
              <p className="small text-muted-warm mt-2 mb-0">To schedule: set the Scheduled Publish Time above, then click Schedule. It publishes automatically within a minute of that time.</p>
            )}
          </form>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4 mb-4">
            <h2 className="h6">Status</h2>
            <p className="mb-2">
              <span className={`badge ${isPublished ? 'text-bg-success' : scheduledFor ? 'text-bg-info' : 'text-bg-secondary'}`}>
                {scheduledFor ? 'Scheduled' : form.status.replace('_', ' ')}
              </span>
            </p>
            {scheduledFor && (
              <p className="small mb-2">Will publish automatically on {scheduledFor.toLocaleString()}.</p>
            )}
            {canPublish && !isNew && form.status !== 'archived' && (
              <button type="button" className="btn btn-sm btn-outline-danger mb-2" disabled={saving} onClick={() => save({ status: 'archived' })}>
                Archive
              </button>
            )}
            <p className="small text-muted-warm mb-0">
              {canPublish ? 'Save as Draft, Publish Now, or Schedule for later.' : 'Contributors can save drafts; an editor must publish.'}
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
