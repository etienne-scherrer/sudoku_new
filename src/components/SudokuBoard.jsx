import React from 'react';
import SudokuCell from './SudokuCell';

function SudokuBoard({ grid, conflicts, isComplete, onInputChange, onKeyDown }) {
  return (
    <table id="sudoku-grid" className={`sudoku-table${isComplete ? ' complete' : ''}`}>
      <tbody>
        {grid.map((row, rowIndex) => (
          <tr key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <SudokuCell
                key={colIndex}
                value={cell.value}
                readOnly={cell.readOnly}
                isConflict={conflicts.has(`${rowIndex}-${colIndex}`)}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                row={rowIndex}
                col={colIndex}
              />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SudokuBoard;
