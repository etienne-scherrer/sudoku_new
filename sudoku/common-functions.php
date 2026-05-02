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

function solveSudoku(array &$board): bool {
    $rows  = array_fill(0, 9, 0);
    $cols  = array_fill(0, 9, 0);
    $boxes = array_fill(0, 9, 0);

    for ($r = 0; $r < 9; $r++) {
        for ($c = 0; $c < 9; $c++) {
            $v = $board[$r][$c]['value'];
            if ($v !== 0) {
                $bit = 1 << $v;
                $rows[$r]  |= $bit;
                $cols[$c]  |= $bit;
                $boxes[intdiv($r, 3) * 3 + intdiv($c, 3)] |= $bit;
            }
        }
    }

    return _solve($board, $rows, $cols, $boxes);
}

function _solve(array &$board, array &$rows, array &$cols, array &$boxes): bool {
    $minCount = 10;
    $bestRow  = -1;
    $bestCol  = -1;

    for ($r = 0; $r < 9; $r++) {
        for ($c = 0; $c < 9; $c++) {
            if ($board[$r][$c]['value'] !== 0) continue;
            $used  = $rows[$r] | $cols[$c] | $boxes[intdiv($r, 3) * 3 + intdiv($c, 3)];
            $count = 0;
            for ($n = 1; $n <= 9; $n++) {
                if (!($used & (1 << $n))) $count++;
            }
            if ($count === 0) return false;
            if ($count < $minCount) {
                $minCount = $count;
                $bestRow  = $r;
                $bestCol  = $c;
                if ($count === 1) break 2;
            }
        }
    }

    if ($bestRow === -1) return true;

    $box  = intdiv($bestRow, 3) * 3 + intdiv($bestCol, 3);
    $used = $rows[$bestRow] | $cols[$bestCol] | $boxes[$box];

    for ($n = 1; $n <= 9; $n++) {
        if ($used & (1 << $n)) continue;
        $bit = 1 << $n;
        $board[$bestRow][$bestCol]['value'] = $n;
        $rows[$bestRow]  |= $bit;
        $cols[$bestCol]  |= $bit;
        $boxes[$box]     |= $bit;

        if (_solve($board, $rows, $cols, $boxes)) return true;

        $board[$bestRow][$bestCol]['value'] = 0;
        $rows[$bestRow]  &= ~$bit;
        $cols[$bestCol]  &= ~$bit;
        $boxes[$box]     &= ~$bit;
    }

    return false;
}