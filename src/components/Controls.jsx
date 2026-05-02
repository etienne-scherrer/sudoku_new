import React from 'react';

function Controls({ onClear, onGenerate, onSolve, loading }) {
  return (
    <div className="button-container">
      <button className="btn btn-clear" onClick={onClear} disabled={loading}>
        Clear
      </button>
      <button className="btn btn-generate" onClick={onGenerate} disabled={loading}>
        Generate
      </button>
      <button className="btn btn-solve" onClick={onSolve} disabled={loading}>
        Solve
      </button>
    </div>
  );
}

export default Controls;
