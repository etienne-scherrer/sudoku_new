import React from 'react';
import SudokuCell from './SudokuCell';

function SudokuBoard({ grid, conflicts, peers, sameValue, selectedCell, isComplete, onInputChange, onKeyDown, onCellFocus }) {
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
                isPeer={peers.has(`${rowIndex}-${colIndex}`)}
                isSameValue={sameValue.has(`${rowIndex}-${colIndex}`)}
                isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
                onChange={onInputChange}
                onKeyDown={onKeyDown}
                onFocus={onCellFocus}
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
