import React from 'react';
import './Modal.css';

function ImportModal({ file, onConfirm, onCancel, loading, error }) {
  if (!file) return null;

  return (
    <div className="modal-overlay" onClick={loading ? undefined : onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {error ? (
          <>
            <p style={{ color: '#dc2626', marginBottom: 8 }}>{error}</p>
            <p style={{ marginBottom: 16 }}>Try a clearer photo or screenshot.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={onCancel} className="close-button" style={{ position: 'static' }}>Cancel</button>
              <button onClick={onConfirm} className="close-button" style={{ position: 'static', background: '#2563eb', color: 'white', border: 'none' }}>Try again</button>
            </div>
          </>
        ) : loading ? (
          <>
            <p style={{ color: '#475569', marginBottom: 8 }}>{file.name}</p>
            <p style={{ marginBottom: 16 }}>Detecting numbers…</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button disabled className="close-button" style={{ position: 'static', opacity: 0.4 }}>Cancel</button>
              <button disabled className="close-button" style={{ position: 'static', opacity: 0.4 }}>Import</button>
            </div>
          </>
        ) : (
          <>
            <p style={{ color: '#475569', marginBottom: 8 }}>{file.name}</p>
            <p style={{ marginBottom: 16 }}>Image looks good? Click Import to run OCR.</p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={onCancel} className="close-button" style={{ position: 'static' }}>Cancel</button>
              <button onClick={onConfirm} className="close-button" style={{ position: 'static', background: '#2563eb', color: 'white', border: 'none' }}>Import</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImportModal;
