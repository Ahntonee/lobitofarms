import { useEffect, useState } from 'react';
import api from '../../api/client';
import { LoadingState } from '../../components/ui/LoadingState';
import ImagePicker from '../../components/ui/ImagePicker';

function NavLinksEditor({ links, onChange }) {
  function update(i, patch) {
    const next = [...links];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function move(i, dir) {
    const target = i + dir;
    if (target < 0 || target >= links.length) return;
    const next = [...links];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  }
  function remove(i) {
    onChange(links.filter((_, idx) => idx !== i));
  }

  return (
    <div>
      {links.map((link, i) => (
        <div className="row g-2 mb-2 align-items-center" key={i}>
          <div className="col-5">
            <input className="form-control form-control-sm" placeholder="Label" value={link.label} onChange={(e) => update(i, { label: e.target.value })} />
          </div>
          <div className="col-5">
            <input className="form-control form-control-sm" placeholder="/path" value={link.path} onChange={(e) => update(i, { path: e.target.value })} />
          </div>
          <div className="col-2 d-flex gap-1">
            <button type="button" className="btn btn-sm btn-outline-secondary px-1" onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
            <button type="button" className="btn btn-sm btn-outline-secondary px-1" onClick={() => move(i, 1)} disabled={i === links.length - 1}>↓</button>
            <button type="button" className="btn btn-sm btn-outline-danger px-1" onClick={() => remove(i)}>×</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-sm btn-outline-secondary mt-1" onClick={() => onChange([...links, { label: '', path: '/' }])}>
        + Add Link
      </button>
    </div>
  );
}

function FooterGroupsEditor({ groups, onChange }) {
  function updateGroup(i, patch) {
    const next = [...groups];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }
  function moveGroup(i, dir) {
    const target = i + dir;
    if (target < 0 || target >= groups.length) return;
    const next = [...groups];
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  }
  function removeGroup(i) {
    onChange(groups.filter((_, idx) => idx !== i));
  }

  return (
    <div className="d-flex flex-column gap-3">
      {groups.map((group, i) => (
        <div className="border rounded p-3" key={i}>
          <div className="d-flex gap-2 align-items-center mb-2">
            <input
              className="form-control form-control-sm"
              placeholder="Group title (e.g. Explore)"
              value={group.title}
              onChange={(e) => updateGroup(i, { title: e.target.value })}
            />
            <button type="button" className="btn btn-sm btn-outline-secondary px-1" onClick={() => moveGroup(i, -1)} disabled={i === 0}>↑</button>
            <button type="button" className="btn btn-sm btn-outline-secondary px-1" onClick={() => moveGroup(i, 1)} disabled={i === groups.length - 1}>↓</button>
            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeGroup(i)}>Remove Group</button>
          </div>
          <NavLinksEditor links={group.links || []} onChange={(links) => updateGroup(i, { links })} />
        </div>
      ))}
      <button
        type="button"
        className="btn btn-sm btn-outline-secondary align-self-start"
        onClick={() => onChange([...groups, { title: 'New Group', links: [] }])}
      >
        + Add Group
      </button>
    </div>
  );
}

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
      <form onSubmit={handleSubmit} className="d-flex flex-column gap-4" style={{ maxWidth: 760 }}>
        <div className="card border-0 shadow-sm p-4">
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
        </div>

        <div className="card border-0 shadow-sm p-4">
          <h2 className="h6 mb-1">Main Navigation</h2>
          <p className="small text-muted-warm">Links shown in the site header, in order.</p>
          <NavLinksEditor links={settings.navLinks || []} onChange={(navLinks) => update('navLinks', navLinks)} />
        </div>

        <div className="card border-0 shadow-sm p-4">
          <h2 className="h6 mb-1">Footer Link Groups</h2>
          <p className="small text-muted-warm">Columns of links shown in the site footer.</p>
          <FooterGroupsEditor groups={settings.footerLinkGroups || []} onChange={(footerLinkGroups) => update('footerLinkGroups', footerLinkGroups)} />
        </div>

        {saved && <div className="alert alert-success py-2 mb-0">Settings saved.</div>}
        <button type="submit" className="btn btn-primary align-self-start" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
      </form>
    </div>
  );
}
