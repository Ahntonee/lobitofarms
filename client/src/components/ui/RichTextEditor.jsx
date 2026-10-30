import { useEffect, useRef, useState } from 'react';
import api from '../../api/client';

const BLOCKS = [
  { value: 'p', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
  { value: 'h5', label: 'Heading 5' },
  { value: 'h6', label: 'Heading 6' },
  { value: 'blockquote', label: 'Quote' },
];

// Maps to the browser's 1-7 fontSize scale; styleWithCSS turns it into a span font-size.
const SIZES = [
  { value: '2', label: 'Small' },
  { value: '3', label: 'Normal' },
  { value: '5', label: 'Large' },
  { value: '6', label: 'X-Large' },
  { value: '7', label: 'XX-Large' },
];

const INLINE = [
  { cmd: 'bold', label: 'B', title: 'Bold', style: { fontWeight: 700 } },
  { cmd: 'italic', label: 'I', title: 'Italic', style: { fontStyle: 'italic' } },
  { cmd: 'underline', label: 'U', title: 'Underline', style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', label: 'S', title: 'Strikethrough', style: { textDecoration: 'line-through' } },
];

const LISTS = [
  { cmd: 'insertUnorderedList', label: '• Bullets', title: 'Bulleted list' },
  { cmd: 'insertOrderedList', label: '1. Numbers', title: 'Numbered list' },
];

const EDIT = [
  { cmd: 'cut', label: 'Cut', title: 'Cut (Ctrl+X)' },
  { cmd: 'copy', label: 'Copy', title: 'Copy (Ctrl+C)' },
  { cmd: 'undo', label: '↶', title: 'Undo' },
  { cmd: 'redo', label: '↷', title: 'Redo' },
  { cmd: 'removeFormat', label: 'Clear', title: 'Clear formatting' },
];

// Dependency-free WYSIWYG editor built on contentEditable + execCommand.
// Paste works natively (Ctrl+V / right-click); browsers don't let a button read the clipboard.
export default function RichTextEditor({ value, onChange, placeholder = 'Write here…' }) {
  const ref = useRef(null);
  const fileInput = useRef(null);
  const savedRange = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function remember() {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0 && ref.current?.contains(sel.anchorNode)) {
        savedRange.current = sel.getRangeAt(0).cloneRange();
      }
    }
    document.addEventListener('selectionchange', remember);
    return () => document.removeEventListener('selectionchange', remember);
  }, []);

  function restoreSelection() {
    ref.current?.focus();
    if (savedRange.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
  }

  function emit() {
    onChange(ref.current.innerHTML);
  }

  function exec(cmd, arg = null) {
    restoreSelection();
    document.execCommand(cmd, false, arg);
    emit();
  }

  function applySize(size) {
    if (!size) return;
    restoreSelection();
    document.execCommand('styleWithCSS', false, true);
    document.execCommand('fontSize', false, size);
    document.execCommand('styleWithCSS', false, false);
    emit();
  }

  function handleLink() {
    restoreSelection();
    const url = window.prompt('Link URL (e.g. https://example.com)');
    if (!url) return;
    const href = /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`;
    exec('createLink', href);
  }

  async function handleImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/media/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      exec('insertImage', res.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  const keep = (e) => e.preventDefault();
  const btn = 'btn btn-sm btn-outline-secondary';

  return (
    <div className="border rounded">
      <div className="d-flex flex-wrap align-items-center gap-1 border-bottom p-2 bg-cream-dark bg-opacity-25">
        <select className="form-select form-select-sm w-auto" title="Paragraph style" defaultValue="" onChange={(e) => { if (e.target.value) exec('formatBlock', e.target.value); e.target.value = ''; }}>
          <option value="" disabled>Style</option>
          {BLOCKS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
        </select>
        <select className="form-select form-select-sm w-auto" title="Font size" defaultValue="" onChange={(e) => { applySize(e.target.value); e.target.value = ''; }}>
          <option value="" disabled>Size</option>
          {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        {INLINE.map((c) => (
          <button key={c.cmd} type="button" className={btn} style={c.style} title={c.title} onMouseDown={keep} onClick={() => exec(c.cmd)}>{c.label}</button>
        ))}
        {LISTS.map((c) => (
          <button key={c.cmd} type="button" className={btn} title={c.title} onMouseDown={keep} onClick={() => exec(c.cmd)}>{c.label}</button>
        ))}
        <button type="button" className={btn} title="Add link" onMouseDown={keep} onClick={handleLink}>Link</button>
        <button type="button" className={btn} title="Remove link" onMouseDown={keep} onClick={() => exec('unlink')}>Unlink</button>
        <button type="button" className={btn} title="Insert image at the cursor" onMouseDown={keep} onClick={() => fileInput.current?.click()} disabled={uploading}>
          {uploading ? 'Uploading…' : 'Image'}
        </button>
        {EDIT.map((c) => (
          <button key={c.cmd} type="button" className={btn} title={c.title} onMouseDown={keep} onClick={() => exec(c.cmd)}>{c.label}</button>
        ))}
        <input ref={fileInput} type="file" accept="image/*" className="d-none" onChange={handleImage} />
      </div>
      {error && <div className="small text-danger px-2 pt-1">{error}</div>}
      <div
        ref={ref}
        className="p-3 rich-content"
        style={{ minHeight: '240px' }}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}
