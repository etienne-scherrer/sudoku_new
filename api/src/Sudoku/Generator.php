<?php

namespace App\Sudoku;

class Generator
{
    public function __construct(private Solver $solver) {}

    public function generate(): Board
    {
        $board = Board::empty();
        $this->fillDiagonalBoxes($board);
        $this->solver->solve($board);
        $this->removeNumbers($board);
        return $board;
    }

    private function fillDiagonalBoxes(Board $board): void
    {
        // The 3 diagonal 3×3 boxes don't share rows or columns with each other,
        // so they can be filled with random shuffles without any conflict checks.
        for ($box = 0; $box < 3; $box++) {
            $numbers = range(1, 9);
            shuffle($numbers);
            $i = 0;
            for ($r = $box * 3; $r < $box * 3 + 3; $r++) {
                for ($c = $box * 3; $c < $box * 3 + 3; $c++) {
                    $board->setValue($r, $c, $numbers[$i++]);
                }
            }
        }
    }

    private function removeNumbers(Board $board, int $attempts = 60): void
    {
        while ($attempts > 0) {
            $row = rand(0, 8);
            $col = rand(0, 8);
            if ($board->getValue($row, $col) !== 0) {
                $backup = $board->getValue($row, $col);
                $board->setValue($row, $col, 0);
                $copy = Board::fromArray($board->toArray());
                if (!$this->solver->solve($copy)) {
                    $board->setValue($row, $col, $backup);
                }
                $attempts--;
            }
        }
        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                $board->setReadOnly($r, $c, $board->getValue($r, $c) !== 0);
            }
        }
    }
}
