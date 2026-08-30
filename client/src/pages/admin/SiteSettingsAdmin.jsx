import { useEffect, useState } from 'react';
import api from '../../api/client';
import { LoadingState } from '../../components/ui/LoadingState';
import ImagePicker from '../../components/ui/ImagePicker';

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function load() {
    api.get('/site-settings').then((res) => setSettings(res.data));
  }
  useEffect(load, []);

  function update(field, value) {
    setSettings((s) => ({ ...s, [field]: value }));
  }
  function updateSocial(field, value) {
    setSettings((s) => ({ ...s, social: { ...s.social, [field]: value } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await api.put('/site-settings', settings);
      setSettings(res.data);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return <LoadingState />;

  return (
    <div>
      <h1 className="h3 mb-4">Site Settings</h1>
      <form onSubmit={handleSubmit} className="card border-0 shadow-sm p-4" style={{ maxWidth: 640 }}>
        <ImagePicker label="Logo" single value={settings.logo ? [settings.logo] : []} onChange={(v) => update('logo', v[0] || '')} />
        <div className="mb-3"><label className="form-label">Site Name</label><input className="form-control" value={settings.siteName || ''} onChange={(e) => update('siteName', e.target.value)} /></div>
        <div className="mb-3"><label className="form-label">Tagline</label><input className="form-control" value={settings.tagline || ''} onChange={(e) => update('tagline', e.target.value)} /></div>
        <div className="mb-3"><label className="form-label">Contact Email</label><input type="email" className="form-control" value={settings.contactEmail || ''} onChange={(e) => update('contactEmail', e.target.value)} /></div>
        <div className="mb-3"><label className="form-label">Contact Phone</label><input className="form-control" value={settings.contactPhone || ''} onChange={(e) => update('contactPhone', e.target.value)} /></div>
        <div className="mb-3"><label className="form-label">Address</label><input className="form-control" value={settings.address || ''} onChange={(e) => update('address', e.target.value)} /></div>
        <div className="mb-3"><label className="form-label">Footer Text</label><textarea className="form-control" rows={2} value={settings.footerText || ''} onChange={(e) => update('footerText', e.target.value)} /></div>

        <hr className="my-3" />
        <h2 className="h6">Social Links</h2>
        {['facebook', 'instagram', 'twitter', 'linkedin'].map((key) => (
          <div className="mb-2" key={key}>
            <label className="form-label text-capitalize small">{key}</label>
            <input className="form-control form-control-sm" value={settings.social?.[key] || ''} onChange={(e) => updateSocial(key, e.target.value)} />
          </div>
        ))}

        {saved && <div className="alert alert-success py-2 mt-3">Settings saved.</div>}
        <button type="submit" className="btn btn-primary mt-3" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
