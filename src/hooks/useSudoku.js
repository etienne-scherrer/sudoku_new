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
