<?php

namespace App\Tests\Sudoku;

use App\Sudoku\Board;
use PHPUnit\Framework\TestCase;

class BoardTest extends TestCase
{
    public function testEmptyBoardHasAllZeros(): void
    {
        $board = Board::empty();
        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                $this->assertSame(0, $board->getValue($r, $c));
                $this->assertFalse($board->isReadOnly($r, $c));
            }
        }
    }

    public function testSetAndGetValue(): void
    {
        $board = Board::empty();
        $board->setValue(0, 0, 5);
        $this->assertSame(5, $board->getValue(0, 0));
        $this->assertSame(0, $board->getValue(0, 1));
    }

    public function testFromArrayRoundTrip(): void
    {
        $data = array_fill(0, 9, array_fill(0, 9, ['value' => 0, 'readOnly' => false]));
        $data[3][4] = ['value' => 7, 'readOnly' => true];
        $board = Board::fromArray($data);
        $this->assertSame(7, $board->getValue(3, 4));
        $this->assertTrue($board->isReadOnly(3, 4));
        $this->assertSame(0, $board->getValue(0, 0));
    }

    public function testToArrayMatchesInput(): void
    {
        $board = Board::empty();
        $board->setValue(1, 2, 9);
        $board->setReadOnly(1, 2, true);
        $arr = $board->toArray();
        $this->assertSame(9, $arr[1][2]['value']);
        $this->assertTrue($arr[1][2]['readOnly']);
    }

    public function testIsSafeDetectsRowConflict(): void
    {
        $board = Board::empty();
        $board->setValue(0, 0, 5);
        $this->assertFalse($board->isSafe(0, 3, 5));
    }

    public function testIsSafeDetectsColumnConflict(): void
    {
        $board = Board::empty();
        $board->setValue(0, 0, 5);
        $this->assertFalse($board->isSafe(3, 0, 5));
    }

    public function testIsSafeDetectsBoxConflict(): void
    {
        $board = Board::empty();
        $board->setValue(0, 0, 5);
        $this->assertFalse($board->isSafe(1, 1, 5));
    }

    public function testIsSafeAllowsValidPlacement(): void
    {
        $board = Board::empty();
        $board->setValue(0, 0, 5);
        $this->assertTrue($board->isSafe(3, 3, 5));
    }
}
