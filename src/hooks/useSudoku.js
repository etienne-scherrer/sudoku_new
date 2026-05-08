import { useState, useEffect } from 'react';

export function computeConflicts(grid) {
  const conflicts = new Set();
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const val = grid[row][col].value;
      if (!val) continue;
      for (let c = 0; c < 9; c++) {
        if (c !== col && grid[row][c].value === val) {
          conflicts.add(`${row}-${col}`);
          conflicts.add(`${row}-${c}`);
        }
      }
      for (let r = 0; r < 9; r++) {
        if (r !== row && grid[r][col].value === val) {
          conflicts.add(`${row}-${col}`);
          conflicts.add(`${r}-${col}`);
        }
      }
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
          if ((r !== row || c !== col) && grid[r][c].value === val) {
            conflicts.add(`${row}-${col}`);
            conflicts.add(`${r}-${c}`);
          }
        }
      }
    }
  }
  return conflicts;
}

const initialGrid = () =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: '', readOnly: false }))
  );

export default function useSudoku() {
  const [grid, setGrid] = useState(initialGrid());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [victoryDismissed, setVictoryDismissed] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState('');

  const conflicts = computeConflicts(grid);
  const allFilled = grid.every(row => row.every(cell => cell.value !== ''));
  const isComplete = allFilled && conflicts.size === 0 && !victoryDismissed;
  const isModalOpen = loading || !!error || isComplete;

  useEffect(() => {
    const saved = localStorage.getItem('sudokuGrid');
    const parsed = JSON.parse(saved);
    if (parsed && parsed.length) {
      setGrid(parsed);
    } else {
      fetchGrid();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    localStorage.setItem('sudokuGrid', JSON.stringify(grid));
  }, [grid]);

  async function fetchGrid() {
    setLoading(true);
    setVictoryDismissed(false);
    try {
      const response = await fetch('/api/puzzle', {
        headers: { 'X-API-Key': import.meta.env.VITE_API_KEY || '' },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setGrid(data.map(row =>
        row.map(cell => ({
          value: cell.value ? cell.value.toString() : '',
          readOnly: cell.value !== 0,
        }))
      ));
      setError('');
    } catch {
      setError('Failed to load the grid. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function solveSudoku() {
    setLoading(true);
    setVictoryDismissed(false);
    try {
      const response = await fetch('/api/puzzle/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': import.meta.env.VITE_API_KEY || '',
        },
        body: JSON.stringify({ grid }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setGrid(data.result);
        setError('');
      }
    } catch {
      setError('Failed to solve the grid. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function importGrid(file) {
    setImporting(true);
    setImportError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const response = await fetch('/api/puzzle/import', {
        method: 'POST',
        headers: { 'X-API-Key': import.meta.env.VITE_API_KEY || '' },
        body: formData,
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.error) {
        setImportError(data.error);
        return false;
      }
      setGrid(data.grid.map(row =>
        row.map(cell => ({
          value: cell.value ? cell.value.toString() : '',
          readOnly: false,
        }))
      ));
      setVictoryDismissed(false);
      setImportError('');
      return true;
    } catch {
      setImportError('Failed to import image. Please try again.');
      return false;
    } finally {
      setImporting(false);
    }
  }

  const clearGrid = () => {
    setGrid(g =>
      g.map(row =>
        row.map(cell => ({ ...cell, value: cell.readOnly ? cell.value : '' }))
      )
    );
    setVictoryDismissed(false);
  };

  const handleInputChange = (value, rowIndex, colIndex) => {
    if (grid[rowIndex][colIndex].readOnly || !/^[1-9]?$/.test(value)) return;
    setGrid(g =>
      g.map((row, r) =>
        row.map((cell, c) =>
          r === rowIndex && c === colIndex ? { ...cell, value } : cell
        )
      )
    );
  };

  const handleKeyDown = (e, rowIndex, colIndex) => {
    let newRowIndex = rowIndex;
    let newColIndex = colIndex;
    const startRowIndex = rowIndex;
    const startColIndex = colIndex;

    switch (e.key) {
      case 'Escape':
        e.target.blur();
        return;
      case 'ArrowRight':
      case 'Tab':
        e.preventDefault();
        do {
          newColIndex++;
          if (newColIndex > 8) { newColIndex = 0; newRowIndex++; }
          if (newRowIndex > 8) newRowIndex = 0;
        } while (
          grid[newRowIndex][newColIndex].readOnly &&
          !(newRowIndex === startRowIndex && newColIndex === startColIndex)
        );
        break;
      case 'ArrowLeft':
        e.preventDefault();
        do {
          newColIndex--;
          if (newColIndex < 0) { newColIndex = 8; newRowIndex--; }
          if (newRowIndex < 0) newRowIndex = 8;
        } while (
          grid[newRowIndex][newColIndex].readOnly &&
          !(newRowIndex === startRowIndex && newColIndex === startColIndex)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        do {
          newRowIndex--;
          if (newRowIndex < 0) { newRowIndex = 8; newColIndex--; }
          if (newColIndex < 0) newColIndex = 8;
        } while (
          grid[newRowIndex][newColIndex].readOnly &&
          !(newRowIndex === startRowIndex && newColIndex === startColIndex)
        );
        break;
      case 'ArrowDown':
        e.preventDefault();
        do {
          newRowIndex++;
          if (newRowIndex > 8) { newRowIndex = 0; newColIndex++; }
          if (newColIndex > 8) newColIndex = 0;
        } while (
          grid[newRowIndex][newColIndex].readOnly &&
          !(newRowIndex === startRowIndex && newColIndex === startColIndex)
        );
        break;
      default:
        return;
    }

    if (newRowIndex !== rowIndex || newColIndex !== colIndex) {
      const next = document.querySelector(
        `input[data-row="${newRowIndex}"][data-col="${newColIndex}"]`
      );
      if (next) next.focus();
    }
  };

  const dismissModal = () => {
    if (error) setError('');
    else if (isComplete) setVictoryDismissed(true);
  };

  return {
    grid,
    conflicts,
    isComplete,
    isModalOpen,
    loading,
    error,
    importing,
    importError,
    fetchGrid,
    solveSudoku,
    importGrid,
    clearGrid,
    handleInputChange,
    handleKeyDown,
    dismissModal,
  };
}
