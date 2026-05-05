<?php

namespace App\Tests\Sudoku;

use App\Sudoku\Board;
use App\Sudoku\Generator;
use App\Sudoku\Solver;
use PHPUnit\Framework\TestCase;

class GeneratorTest extends TestCase
{
    private Generator $generator;
    private Solver $solver;

    protected function setUp(): void
    {
        $this->solver    = new Solver();
        $this->generator = new Generator($this->solver);
    }

    public function testGeneratedBoardIsSolvable(): void
    {
        $board = $this->generator->generate();
        $copy  = Board::fromArray($board->toArray());
        $this->assertTrue($this->solver->solve($copy));
    }

    public function testGeneratedBoardHasReadOnlyClues(): void
    {
        $board = $this->generator->generate();
        $hasReadOnly = false;
        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                if ($board->isReadOnly($r, $c)) {
                    $hasReadOnly = true;
                    $this->assertNotSame(0, $board->getValue($r, $c));
                }
            }
        }
        $this->assertTrue($hasReadOnly);
    }

    public function testGeneratedBoardHasAtLeast17Clues(): void
    {
        $board  = $this->generator->generate();
        $clues  = 0;
        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                if ($board->getValue($r, $c) !== 0) $clues++;
            }
        }
        $this->assertGreaterThanOrEqual(17, $clues);
    }
}
