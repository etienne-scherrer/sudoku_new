import React from 'react';

function SudokuCell({ value, readOnly, isConflict, isPeer, isSameValue, isSelected, onChange, onKeyDown, onFocus, row, col }) {
  const cls = ['sudoku-input'];
  if (isSelected) cls.push('selected');
  else if (isConflict) cls.push('conflict');
  else if (isSameValue) cls.push('same-value');
  else if (isPeer) cls.push('peer');

  return (
    <td className="sudoku-cell">
      <input
        type="text"
        className={cls.join(' ')}
        value={value}
        onChange={e => onChange(e.target.value, row, col)}
        onKeyDown={e => onKeyDown(e, row, col)}
        onFocus={() => onFocus({ row, col })}
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
