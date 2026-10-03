import ImagePicker from '../../../components/ui/ImagePicker';
import RichTextEditor from '../../../components/ui/RichTextEditor';

function CtaFields({ label, value = {}, onChange }) {
  return (
    <div className="row g-2 mb-2">
      <div className="col-6">
        <label className="form-label small">{label} label</label>
        <input className="form-control form-control-sm" value={value.label || ''} onChange={(e) => onChange({ ...value, label: e.target.value })} />
      </div>
      <div className="col-6">
        <label className="form-label small">{label} link</label>
        <input className="form-control form-control-sm" placeholder="/crops" value={value.href || ''} onChange={(e) => onChange({ ...value, href: e.target.value })} />
      </div>
    </div>
  );
}

export default function BlockConfigEditor({ type, config, onChange }) {
  function set(patch) {
    onChange({ ...config, ...patch });
  }

  switch (type) {
    case 'hero':
      return (
        <>
          <div className="mb-2"><label className="form-label small">Heading</label><input className="form-control form-control-sm" value={config.heading || ''} onChange={(e) => set({ heading: e.target.value })} /></div>
          <div className="mb-2"><label className="form-label small">Subheading</label><textarea className="form-control form-control-sm" rows={2} value={config.subheading || ''} onChange={(e) => set({ subheading: e.target.value })} /></div>
          <ImagePicker label="Background Image" single value={config.image ? [config.image] : []} onChange={(v) => set({ image: v[0] || '' })} />
          <CtaFields label="Primary CTA" value={config.primaryCta} onChange={(v) => set({ primaryCta: v })} />
          <CtaFields label="Secondary CTA" value={config.secondaryCta} onChange={(v) => set({ secondaryCta: v })} />
        </>
      );
    case 'text_image':
      return (
        <>
          <div className="mb-2"><label className="form-label small">Heading</label><input className="form-control form-control-sm" value={config.heading || ''} onChange={(e) => set({ heading: e.target.value })} /></div>
          <div className="mb-2">
            <label className="form-label small">Body</label>
            <RichTextEditor value={config.body || ''} onChange={(v) => set({ body: v })} />
          </div>
          <ImagePicker label="Image" single value={config.image ? [config.image] : []} onChange={(v) => set({ image: v[0] || '' })} />
          <div className="mb-2">
            <label className="form-label small">Image Position</label>
            <select className="form-select form-select-sm" value={config.imagePosition || 'right'} onChange={(e) => set({ imagePosition: e.target.value })}>
              <option value="right">Right</option>
              <option value="left">Left</option>
            </select>
          </div>
        </>
      );
    case 'stat_counters': {
      const stats = config.stats || [];
      return (
        <div>
          <label className="form-label small">Stats</label>
          {stats.map((s, i) => (
            <div className="row g-2 mb-2" key={i}>
              <div className="col-6">
                <input className="form-control form-control-sm" placeholder="Label" value={s.label} onChange={(e) => { const next = [...stats]; next[i] = { ...s, label: e.target.value }; set({ stats: next }); }} />
              </div>
              <div className="col-4">
                <input type="number" className="form-control form-control-sm" placeholder="Value" value={s.value} onChange={(e) => { const next = [...stats]; next[i] = { ...s, value: Number(e.target.value) }; set({ stats: next }); }} />
              </div>
              <div className="col-2">
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => set({ stats: stats.filter((_, idx) => idx !== i) })}>×</button>
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => set({ stats: [...stats, { label: '', value: 0 }] })}>
            + Add Stat
          </button>
        </div>
      );
    }
    case 'card_grid':
      return (
        <>
          <div className="mb-2"><label className="form-label small">Heading</label><input className="form-control form-control-sm" value={config.heading || ''} onChange={(e) => set({ heading: e.target.value })} /></div>
          <div className="mb-2">
            <label className="form-label small">Source</label>
            <select className="form-select form-select-sm" value={config.source || 'crops'} onChange={(e) => set({ source: e.target.value })}>
              <option value="crops">Crops</option>
              <option value="products">Products</option>
              <option value="ngoPrograms">NGO Programs</option>
              <option value="blog">Blog Posts</option>
            </select>
          </div>
          <div className="mb-2"><label className="form-label small">Limit</label><input type="number" className="form-control form-control-sm" value={config.limit ?? 3} onChange={(e) => set({ limit: Number(e.target.value) })} /></div>
          <div className="mb-2">
            <label className="form-label small">Anchor ID (optional, for linking a button to this section, e.g. "programs")</label>
            <input className="form-control form-control-sm" value={config.anchor || ''} onChange={(e) => set({ anchor: e.target.value.trim() })} />
          </div>
        </>
      );
    case 'testimonial_carousel':
      return <div className="mb-2"><label className="form-label small">Heading</label><input className="form-control form-control-sm" value={config.heading || ''} onChange={(e) => set({ heading: e.target.value })} /></div>;
    case 'cta_banner':
      return (
        <>
          <div className="mb-2"><label className="form-label small">Heading</label><input className="form-control form-control-sm" value={config.heading || ''} onChange={(e) => set({ heading: e.target.value })} /></div>
          <div className="mb-2"><label className="form-label small">Subheading</label><input className="form-control form-control-sm" value={config.subheading || ''} onChange={(e) => set({ subheading: e.target.value })} /></div>
          <CtaFields label="Button" value={config.cta} onChange={(v) => set({ cta: v })} />
        </>
      );
    case 'gallery_grid': {
      const images = (config.images || []).map((i) => i.url);
      return (
        <>
          <div className="mb-2"><label className="form-label small">Heading</label><input className="form-control form-control-sm" value={config.heading || ''} onChange={(e) => set({ heading: e.target.value })} /></div>
          <ImagePicker label="Images" value={images} onChange={(urls) => set({ images: urls.map((url) => ({ url })) })} />
        </>
      );
    }
    case 'page_header':
      return (
        <>
          <div className="mb-2"><label className="form-label small">Eyebrow (small label above the title)</label><input className="form-control form-control-sm" value={config.eyebrow || ''} onChange={(e) => set({ eyebrow: e.target.value })} /></div>
          <div className="mb-2"><label className="form-label small">Title</label><input className="form-control form-control-sm" value={config.title || ''} onChange={(e) => set({ title: e.target.value })} /></div>
          <div className="mb-2"><label className="form-label small">Subtitle</label><textarea className="form-control form-control-sm" rows={2} value={config.subtitle || ''} onChange={(e) => set({ subtitle: e.target.value })} /></div>
        </>
      );
    case 'donate_form': {
      const amounts = config.amounts || [];
      return (
        <>
          <div className="mb-2">
            <label className="form-label small">Preset Amounts ($)</label>
            {amounts.map((a, i) => (
              <div className="row g-2 mb-2" key={i}>
                <div className="col-8">
                  <input type="number" min="1" className="form-control form-control-sm" value={a} onChange={(e) => { const next = [...amounts]; next[i] = Number(e.target.value); set({ amounts: next }); }} />
                </div>
                <div className="col-2">
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => set({ amounts: amounts.filter((_, idx) => idx !== i) })}>×</button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => set({ amounts: [...amounts, 25] })}>
              + Add Amount
            </button>
          </div>
          <div className="mb-2">
            <label className="form-label small">Note (shown above the form, e.g. explaining payment isn't live)</label>
            <textarea className="form-control form-control-sm" rows={2} value={config.note || ''} onChange={(e) => set({ note: e.target.value })} />
          </div>
        </>
      );
    }
    default:
      return <p className="small text-muted-warm">No editor for this block type.</p>;
  }
}
