<?php

namespace App\Sudoku;

class Solver
{
    public function solve(Board $board): bool
    {
        if (!$this->validate($board)) {
            return false;
        }

        $rows  = array_fill(0, 9, 0);
        $cols  = array_fill(0, 9, 0);
        $boxes = array_fill(0, 9, 0);

        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                $v = $board->getValue($r, $c);
                if ($v !== 0) {
                    $bit = 1 << $v;
                    $rows[$r]  |= $bit;
                    $cols[$c]  |= $bit;
                    $boxes[intdiv($r, 3) * 3 + intdiv($c, 3)] |= $bit;
                }
            }
        }

        return $this->backtrack($board, $rows, $cols, $boxes);
    }

    public function validate(Board $board): bool
    {
        for ($row = 0; $row < 9; $row++) {
            for ($col = 0; $col < 9; $col++) {
                $num = $board->getValue($row, $col);
                if ($num === 0) continue;
                $board->setValue($row, $col, 0);
                $safe = $board->isSafe($row, $col, $num);
                $board->setValue($row, $col, $num);
                if (!$safe) return false;
            }
        }
        return true;
    }

    private function backtrack(Board $board, array &$rows, array &$cols, array &$boxes): bool
    {
        $minCount = 10;
        $bestRow  = -1;
        $bestCol  = -1;

        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                if ($board->getValue($r, $c) !== 0) continue;
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
            $board->setValue($bestRow, $bestCol, $n);
            $rows[$bestRow]  |= $bit;
            $cols[$bestCol]  |= $bit;
            $boxes[$box]     |= $bit;

            if ($this->backtrack($board, $rows, $cols, $boxes)) return true;

            $board->setValue($bestRow, $bestCol, 0);
            $rows[$bestRow]  &= ~$bit;
            $cols[$bestCol]  &= ~$bit;
            $boxes[$box]     &= ~$bit;
        }

        return false;
    }
}
