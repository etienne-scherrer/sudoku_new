import React, { useRef } from 'react';

function Controls({ onClear, onGenerate, onSolve, onImport, loading }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImport(file);
      e.target.value = '';
    }
  };

  return (
    <div className="button-container">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button className="btn btn-clear" onClick={onClear} disabled={loading}>
        Clear
      </button>
      <button className="btn btn-generate" onClick={onGenerate} disabled={loading}>
        Generate
      </button>
      <button className="btn btn-import" onClick={() => fileInputRef.current.click()} disabled={loading}>
        Import
      </button>
      <button className="btn btn-solve" onClick={onSolve} disabled={loading}>
        Solve
      </button>
    </div>
  );
}

export default Controls;
