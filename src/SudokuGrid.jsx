import React, { useState } from 'react';
import useSudoku from './hooks/useSudoku';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import Modal from './components/Modal';
import ImportModal from './components/ImportModal';

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
        isComplete={isComplete}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
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
