import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../../api/client';
import { LoadingState, ErrorState } from '../../../components/ui/LoadingState';
import { BLOCK_TYPES } from '../../../components/blocks/BlockRenderer';
import BlockConfigEditor from './BlockConfigEditor';
import RevisionHistory from '../content/RevisionHistory';
import { STATUS_OPTIONS } from '../../../config/contentTypes';
import { useAuth } from '../../../context/AuthContext';

const BLOCK_LABELS = {
  hero: 'Hero',
  text_image: 'Text + Image',
  stat_counters: 'Stat Counters',
  card_grid: 'Card Grid',
  testimonial_carousel: 'Testimonial Carousel',
  cta_banner: 'CTA Banner',
  gallery_grid: 'Gallery Grid',
};

export default function PageEditor() {
  const { id } = useParams();
  const { hasRole } = useAuth();
  const canPublish = hasRole('editor', 'super_admin');

  const [page, setPage] = useState(null);
  const [error, setError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newBlockType, setNewBlockType] = useState(BLOCK_TYPES[0]);
  const [revisionKey, setRevisionKey] = useState(0);

  function load() {
    setError(false);
    setPage(null);
    api.get(`/pages/${id}`).then((res) => setPage(res.data)).catch(() => setError(true));
  }
  useEffect(load, [id]);

  function updateBlocks(blocks) {
    setPage((p) => ({ ...p, blocks }));
  }

  function addBlock() {
    const blocks = [...page.blocks, { type: newBlockType, order: page.blocks.length, config: {} }];
    updateBlocks(blocks);
  }

  function removeBlock(index) {
    const blocks = page.blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, order: i }));
    updateBlocks(blocks);
  }

  function moveBlock(index, dir) {
    const target = index + dir;
    if (target < 0 || target >= page.blocks.length) return;
    const blocks = [...page.blocks];
    [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
    updateBlocks(blocks.map((b, i) => ({ ...b, order: i })));
  }

  function updateBlockConfig(index, config) {
    const blocks = [...page.blocks];
    blocks[index] = { ...blocks[index], config };
    updateBlocks(blocks);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await api.put(`/pages/${id}`, page);
      setPage(res.data);
      setRevisionKey((k) => k + 1);
    } finally {
      setSaving(false);
    }
  }

  if (error) return <ErrorState onRetry={load} />;
  if (!page) return <LoadingState />;

  const sortedBlocks = [...page.blocks].sort((a, b) => a.order - b.order);

  return (
    <div>
      <Link to="/admin/pages" className="small text-muted-warm">← Back to Pages</Link>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h1 className="h3 mb-0">{page.title} <code className="small">/{page.slug}</code></h1>
        <div className="d-flex gap-2 align-items-center">
          <select className="form-select form-select-sm" value={page.status} onChange={(e) => setPage({ ...page, status: e.target.value })} disabled={!canPublish}>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save Page'}</button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="d-flex flex-column gap-3">
            {sortedBlocks.length === 0 && <p className="text-muted-warm">No blocks yet — add one below.</p>}
            {sortedBlocks.map((block, i) => (
              <div key={block._id || i} className="card border-0 shadow-sm p-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <strong>{BLOCK_LABELS[block.type] || block.type}</strong>
                  <div className="d-flex gap-1">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => moveBlock(i, -1)} disabled={i === 0}>↑</button>
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => moveBlock(i, 1)} disabled={i === sortedBlocks.length - 1}>↓</button>
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removeBlock(i)}>Remove</button>
                  </div>
                </div>
                <BlockConfigEditor type={block.type} config={block.config || {}} onChange={(cfg) => updateBlockConfig(i, cfg)} />
              </div>
            ))}
          </div>

          <div className="card border-0 shadow-sm p-3 mt-3">
            <div className="d-flex gap-2 align-items-end">
              <div className="flex-grow-1">
                <label className="form-label small">Add Block</label>
                <select className="form-select form-select-sm" value={newBlockType} onChange={(e) => setNewBlockType(e.target.value)}>
                  {BLOCK_TYPES.map((t) => <option key={t} value={t}>{BLOCK_LABELS[t]}</option>)}
                </select>
              </div>
              <button type="button" className="btn btn-outline-primary btn-sm" onClick={addBlock}>+ Add</button>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm p-4">
            <h2 className="h6">Revision History</h2>
            <RevisionHistory key={revisionKey} endpoint="/pages" id={id} labelField="title" onRestored={load} />
          </div>
        </div>
      </div>
    </div>
  );
}
