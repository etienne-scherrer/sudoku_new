import React from 'react';
import SudokuGrid from './SudokuGrid';
import './main.css';

function App() {
  return (
      <div className="App">
        <h1>Sudoku Solver</h1>
        <SudokuGrid />
      </div>
  );
}

export default App;
