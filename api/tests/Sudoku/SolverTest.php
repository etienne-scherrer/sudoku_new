<?php

namespace App\Tests\Sudoku;

use App\Sudoku\Board;
use App\Sudoku\Solver;
use PHPUnit\Framework\TestCase;

class SolverTest extends TestCase
{
    private Solver $solver;

    protected function setUp(): void
    {
        $this->solver = new Solver();
    }

    public function testSolvesValidPuzzle(): void
    {
        // Known puzzle with unique solution
        $raw = [
            [5,3,0,0,7,0,0,0,0],
            [6,0,0,1,9,5,0,0,0],
            [0,9,8,0,0,0,0,6,0],
            [8,0,0,0,6,0,0,0,3],
            [4,0,0,8,0,3,0,0,1],
            [7,0,0,0,2,0,0,0,6],
            [0,6,0,0,0,0,2,8,0],
            [0,0,0,4,1,9,0,0,5],
            [0,0,0,0,8,0,0,7,9],
        ];
        $board = $this->makeBoard($raw);
        $this->assertTrue($this->solver->solve($board));
        // Check one known cell in the solution
        $this->assertSame(4, $board->getValue(0, 2));
        // All cells filled
        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                $this->assertNotSame(0, $board->getValue($r, $c));
            }
        }
    }

    public function testReturnsFalseForUnsolvableBoard(): void
    {
        // Two 5s in the same row — no solution possible
        $raw = array_fill(0, 9, array_fill(0, 9, 0));
        $raw[0][0] = 5;
        $raw[0][1] = 5;
        $board = $this->makeBoard($raw);
        $this->assertFalse($this->solver->solve($board));
    }

    public function testValidatesValidBoard(): void
    {
        $raw = array_fill(0, 9, array_fill(0, 9, 0));
        $raw[0][0] = 5;
        $raw[0][1] = 3;
        $board = $this->makeBoard($raw);
        $this->assertTrue($this->solver->validate($board));
    }

    public function testValidatesInvalidBoardRowDuplicate(): void
    {
        $raw = array_fill(0, 9, array_fill(0, 9, 0));
        $raw[0][0] = 5;
        $raw[0][3] = 5;
        $board = $this->makeBoard($raw);
        $this->assertFalse($this->solver->validate($board));
    }

    private function makeBoard(array $raw): Board
    {
        $data = [];
        foreach ($raw as $r => $row) {
            foreach ($row as $c => $v) {
                $data[$r][$c] = ['value' => $v, 'readOnly' => $v !== 0];
            }
        }
        return Board::fromArray($data);
    }
}
