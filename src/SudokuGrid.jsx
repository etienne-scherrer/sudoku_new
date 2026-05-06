import React, { useState, useMemo } from 'react';
import useSudoku from './hooks/useSudoku';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import Modal from './components/Modal';
import ImportModal from './components/ImportModal';

function computeHighlights(grid, selectedCell) {
  if (!selectedCell) return { peers: new Set(), sameValue: new Set() };
  const { row, col } = selectedCell;
  const value = grid[row][col].value;
  const peers = new Set();
  const sameValue = new Set();

  for (let c = 0; c < 9; c++) if (c !== col) peers.add(`${row}-${c}`);
  for (let r = 0; r < 9; r++) if (r !== row) peers.add(`${r}-${col}`);
  const br = Math.floor(row / 3) * 3;
  const bc = Math.floor(col / 3) * 3;
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (r !== row || c !== col) peers.add(`${r}-${c}`);

  if (value > 0)
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if ((r !== row || c !== col) && grid[r][c].value === value)
          sameValue.add(`${r}-${c}`);

  return { peers, sameValue };
}

function SudokuGrid() {
  const {
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
  } = useSudoku();

  const [pendingImportFile, setPendingImportFile] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const { peers, sameValue } = useMemo(
    () => computeHighlights(grid, selectedCell),
    [grid, selectedCell]
  );

  const handleImport = (file) => setPendingImportFile(file);

  const handleImportConfirm = async () => {
    const success = await importGrid(pendingImportFile);
    if (success) setPendingImportFile(null);
  };

  const handleImportCancel = () => {
    setPendingImportFile(null);
  };

  const modalContent = () => {
    if (loading) return <p>Loading...</p>;
    if (isComplete) return <p>Puzzle complete!</p>;
    if (error) return <p>{error}</p>;
    return null;
  };

  return (
    <div>
      <ImportModal
        file={pendingImportFile}
        onConfirm={handleImportConfirm}
        onCancel={handleImportCancel}
        loading={importing}
        error={importError}
      />
      <Modal isOpen={isModalOpen} onClose={dismissModal}>
        {modalContent()}
      </Modal>
      <SudokuBoard
        grid={grid}
        conflicts={conflicts}
        peers={peers}
        sameValue={sameValue}
        selectedCell={selectedCell}
        isComplete={isComplete}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onCellFocus={setSelectedCell}
      />
      <Controls
        onClear={clearGrid}
        onGenerate={fetchGrid}
        onSolve={solveSudoku}
        onImport={handleImport}
        loading={loading}
      />
    </div>
  );
}

export default SudokuGrid;
