import React, { useEffect, useState } from 'react';
import './Modal.css';

function ImportModal({ file, onConfirm, onCancel, loading, error }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!file) return null;

  return (
    <div className="modal-overlay" onClick={loading ? undefined : onCancel}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Import from image</h2>

        <div className="modal-preview">
          {previewUrl && (
            <img
              src={previewUrl}
              alt={file.name}
              className={`modal-preview-img${loading ? ' modal-preview-img--dim' : ''}`}
            />
          )}
          {loading && <div className="modal-preview-spinner">Detecting numbers…</div>}
        </div>

        <p className="modal-filename">{file.name}</p>

        {error && <p className="modal-error">{error}</p>}

        <div className="modal-actions">
          <button onClick={onCancel} disabled={loading} className="btn btn-generate">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className="btn btn-solve">
            {error ? 'Try again' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImportModal;
