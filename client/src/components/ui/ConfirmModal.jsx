import { useEffect } from 'react';

export default function ConfirmModal({ message, title = 'Are you sure?', confirmLabel = 'Confirm', destructive = false, onOk, onCancel }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, padding: '36px 32px 28px',
          maxWidth: 400, width: '100%',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          textAlign: 'center',
          animation: 'confirmPop 0.18s ease',
        }}
      >
        {/* Icon */}
        <div style={{
          width: 60, height: 60, borderRadius: '50%', margin: '0 auto 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          background: destructive ? '#fff0f0' : '#fff8ec',
        }}>
          {destructive ? '🗑️' : '⚠️'}
        </div>

        <h5 style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a', marginBottom: 10 }}>{title}</h5>
        <p style={{ color: '#777', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>{message}</p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 8,
              border: '1.5px solid #e0e0e0', background: '#fff',
              fontWeight: 600, fontSize: 14, cursor: 'pointer', color: '#555',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onOk}
            style={{
              flex: 1, padding: '11px 0', borderRadius: 8, border: 'none',
              background: destructive ? '#c0392b' : '#2d5a27',
              color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes confirmPop {
          from { transform: scale(0.92); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
