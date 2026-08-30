import { useEffect, useRef } from 'react';

const COMMANDS = [
  { cmd: 'bold', label: 'B', style: { fontWeight: 700 } },
  { cmd: 'italic', label: 'I', style: { fontStyle: 'italic' } },
  { cmd: 'insertUnorderedList', label: '• List' },
  { cmd: 'insertOrderedList', label: '1. List' },
  { cmd: 'formatBlock:h2', label: 'H2' },
  { cmd: 'formatBlock:h3', label: 'H3' },
  { cmd: 'formatBlock:p', label: 'P' },
];

// Minimal dependency-free WYSIWYG editor built on contentEditable + execCommand.
// Sufficient for CMS blog/program body copy without adding a heavier editor package.
export default function RichTextEditor({ value, onChange, placeholder = 'Write here…' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function runCommand(cmd) {
    ref.current?.focus();
    if (cmd.startsWith('formatBlock:')) {
      document.execCommand('formatBlock', false, cmd.split(':')[1]);
    } else {
      document.execCommand(cmd, false, null);
    }
    onChange(ref.current.innerHTML);
  }

  function handleLink() {
    const url = window.prompt('Link URL');
    if (!url) return;
    ref.current?.focus();
    document.execCommand('createLink', false, url);
    onChange(ref.current.innerHTML);
  }

  return (
    <div className="border rounded">
      <div className="d-flex flex-wrap gap-1 border-bottom p-2 bg-cream-dark bg-opacity-25">
        {COMMANDS.map((c) => (
          <button
            key={c.label}
            type="button"
            className="btn btn-sm btn-outline-secondary"
            style={c.style}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand(c.cmd)}
          >
            {c.label}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleLink}
        >
          Link
        </button>
      </div>
      <div
        ref={ref}
        className="p-3"
        style={{ minHeight: '200px' }}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
      />
    </div>
  );
}
