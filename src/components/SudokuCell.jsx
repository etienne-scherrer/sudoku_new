import React from 'react';

function SudokuCell({ value, readOnly, isConflict, onChange, onKeyDown, row, col }) {
  return (
    <td className="sudoku-cell">
      <input
        type="text"
        className={`sudoku-input${isConflict ? ' conflict' : ''}`}
        value={value}
        onChange={e => onChange(e.target.value, row, col)}
        onKeyDown={e => onKeyDown(e, row, col)}
        readOnly={readOnly}
        maxLength="1"
        aria-label={`Row ${row + 1} Column ${col + 1}`}
        data-row={row}
        data-col={col}
      />
    </td>
  );
}

export default SudokuCell;
