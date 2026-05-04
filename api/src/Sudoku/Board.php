<?php

namespace App\Sudoku;

class Board
{
    private array $cells;

    private function __construct(array $cells)
    {
        $this->cells = $cells;
    }

    public static function empty(): self
    {
        $cells = [];
        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                $cells[$r][$c] = ['value' => 0, 'readOnly' => false];
            }
        }
        return new self($cells);
    }

    public static function fromArray(array $data): self
    {
        $cells = [];
        foreach ($data as $r => $row) {
            foreach ($row as $c => $cell) {
                $cells[$r][$c] = [
                    'value'    => (int)($cell['value'] ?? 0),
                    'readOnly' => (bool)($cell['readOnly'] ?? false),
                ];
            }
        }
        return new self($cells);
    }

    public function getValue(int $row, int $col): int
    {
        return $this->cells[$row][$col]['value'];
    }

    public function setValue(int $row, int $col, int $value): void
    {
        $this->cells[$row][$col]['value'] = $value;
    }

    public function isReadOnly(int $row, int $col): bool
    {
        return $this->cells[$row][$col]['readOnly'];
    }

    public function setReadOnly(int $row, int $col, bool $readOnly): void
    {
        $this->cells[$row][$col]['readOnly'] = $readOnly;
    }

    public function isSafe(int $row, int $col, int $num): bool
    {
        for ($i = 0; $i < 9; $i++) {
            if ($this->cells[$row][$i]['value'] === $num || $this->cells[$i][$col]['value'] === $num) {
                return false;
            }
        }
        $startRow = $row - $row % 3;
        $startCol = $col - $col % 3;
        for ($i = 0; $i < 3; $i++) {
            for ($j = 0; $j < 3; $j++) {
                if ($this->cells[$i + $startRow][$j + $startCol]['value'] === $num) {
                    return false;
                }
            }
        }
        return true;
    }

    public function toArray(): array
    {
        return $this->cells;
    }
}
