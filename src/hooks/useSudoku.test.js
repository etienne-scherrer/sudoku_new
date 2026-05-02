import { computeConflicts } from './useSudoku';

const emptyGrid = () =>
  Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => ({ value: '', readOnly: false }))
  );

test('no conflicts on empty grid', () => {
  expect(computeConflicts(emptyGrid()).size).toBe(0);
});

test('detects row conflict', () => {
  const grid = emptyGrid();
  grid[0][0].value = '5';
  grid[0][5].value = '5';
  const conflicts = computeConflicts(grid);
  expect(conflicts.has('0-0')).toBe(true);
  expect(conflicts.has('0-5')).toBe(true);
  expect(conflicts.size).toBe(2);
});

test('detects column conflict', () => {
  const grid = emptyGrid();
  grid[1][3].value = '7';
  grid[6][3].value = '7';
  const conflicts = computeConflicts(grid);
  expect(conflicts.has('1-3')).toBe(true);
  expect(conflicts.has('6-3')).toBe(true);
  expect(conflicts.size).toBe(2);
});

test('detects 3x3 box conflict', () => {
  const grid = emptyGrid();
  grid[0][0].value = '3';
  grid[2][2].value = '3';
  const conflicts = computeConflicts(grid);
  expect(conflicts.has('0-0')).toBe(true);
  expect(conflicts.has('2-2')).toBe(true);
  expect(conflicts.size).toBe(2);
});

test('no conflict for same value in different rows, columns, and boxes', () => {
  const grid = emptyGrid();
  grid[0][0].value = '1';
  grid[4][4].value = '1';
  grid[8][8].value = '1';
  expect(computeConflicts(grid).size).toBe(0);
});

test('three-way row conflict marks all three cells', () => {
  const grid = emptyGrid();
  grid[0][0].value = '9';
  grid[0][4].value = '9';
  grid[0][8].value = '9';
  const conflicts = computeConflicts(grid);
  expect(conflicts.has('0-0')).toBe(true);
  expect(conflicts.has('0-4')).toBe(true);
  expect(conflicts.has('0-8')).toBe(true);
});
