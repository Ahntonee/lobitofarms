import { useRef, useState } from 'react';
import api from '../../api/client';

// Lets a CMS editor either upload a new image (stored in the Media Library) or paste
// an existing URL. `value` is always an array of URL strings; `single` collapses the
// UI to one image but still stores/returns an array for schema consistency upstream.
export default function ImagePicker({ label, value = [], onChange, single = false }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data.url;
      onChange(single ? [url] : [...value, url]);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  function removeAt(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="mb-3">
      {label && <label className="form-label d-block">{label}</label>}
      <div className="d-flex flex-wrap gap-2 mb-2">
        {value.map((url, i) => (
          <div key={url + i} className="position-relative">
            <img src={url} alt="" style={{ width: 90, height: 90, objectFit: 'cover' }} className="rounded border" />
            <button
              type="button"
              className="btn btn-sm btn-danger position-absolute top-0 end-0 py-0 px-1"
              style={{ transform: 'translate(30%, -30%)', borderRadius: '50%' }}
              onClick={() => removeAt(i)}
              aria-label="Remove image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <input ref={fileInput} type="file" accept="image/*" className="form-control form-control-sm" style={{ maxWidth: 280 }} onChange={handleFile} disabled={uploading || (single && value.length > 0)} />
      {uploading && <div className="small text-muted-warm mt-1">Uploading…</div>}
      {error && <div className="small text-danger mt-1">{error}</div>}
      {single && value.length > 0 && (
        <button type="button" className="btn btn-sm btn-link p-0 mt-1" onClick={() => onChange([])}>
          Replace image
        </button>
      )}
    </div>
  );
}
