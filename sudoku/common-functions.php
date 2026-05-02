<?php

// Common functions used in both generating and solving Sudoku.

function isSafe(array $board, int $row, int $col, int $num): bool {
    // Check the row and column
    for ($i = 0; $i < 9; $i++) {
        if ($board[$row][$i]['value'] === $num || $board[$i][$col]['value'] === $num) {
            return false;
        }
    }

    // Check the 3x3 box
    $startRow = $row - $row % 3;
    $startCol = $col - $col % 3;
    for ($i = 0; $i < 3; $i++) {
        for ($j = 0; $j < 3; $j++) {
            if ($board[$i + $startRow][$j + $startCol]['value'] === $num) {
                return false;
            }
        }
    }
    return true;
}

function solveSudoku(array &$board, int $row = 0, int $col = 0): bool {
    if ($row == 9) {  // Successfully filled the grid
        return true;
    }

    if ($col == 9) {  // Move to the next row
        return solveSudoku($board, $row + 1, 0);
    }

    if ((int)$board[$row][$col]['value'] !== 0) {  // Skip filled cells
        return solveSudoku($board, $row, $col + 1);
    }

    for ($num = 1; $num <= 9; $num++) {
        if (isSafe($board, $row, $col, $num)) {
            $board[$row][$col]['value'] = $num;
            if (solveSudoku($board, $row, $col + 1)) {
                return true;
            }
            $board[$row][$col]['value'] = 0;  // Backtrack
        }
    }

    return false;  // No solution found from this configuration
}