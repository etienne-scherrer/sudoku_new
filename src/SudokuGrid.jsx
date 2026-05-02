import React from 'react';
import useSudoku from './hooks/useSudoku';
import SudokuBoard from './components/SudokuBoard';
import Controls from './components/Controls';
import Modal from './components/Modal';

function SudokuGrid() {
  const {
    grid,
    conflicts,
    isComplete,
    isModalOpen,
    loading,
    error,
    fetchGrid,
    solveSudoku,
    clearGrid,
    handleInputChange,
    handleKeyDown,
    dismissModal,
  } = useSudoku();

  const modalContent = () => {
    if (loading) return <p>Loading...</p>;
    if (isComplete) return <p>Puzzle complete!</p>;
    if (error) return <p>{error}</p>;
    return null;
  };

  return (
    <div>
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
        loading={loading}
      />
    </div>
  );
}

export default SudokuGrid;
