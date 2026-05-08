from __future__ import annotations

import random

from .board import Board
from .solver import Solver


class Generator:
    def __init__(self) -> None:
        self._solver = Solver()

    def generate(self) -> Board:
        board = Board.empty()
        self._fill_diagonal_boxes(board)
        self._solver.solve(board)
        self._remove_numbers(board)
        return board

    def _fill_diagonal_boxes(self, board: Board) -> None:
        for box in range(3):
            numbers = list(range(1, 10))
            random.shuffle(numbers)
            i = 0
            for r in range(box * 3, box * 3 + 3):
                for c in range(box * 3, box * 3 + 3):
                    board.set_value(r, c, numbers[i])
                    i += 1

    def _remove_numbers(self, board: Board, attempts: int = 60) -> None:
        while attempts > 0:
            row = random.randint(0, 8)
            col = random.randint(0, 8)
            if board.get_value(row, col) != 0:
                backup = board.get_value(row, col)
                board.set_value(row, col, 0)
                copy = Board.from_array(board.to_array())
                if not self._solver.solve(copy):
                    board.set_value(row, col, backup)
                attempts -= 1

        for r in range(9):
            for c in range(9):
                board.set_read_only(r, c, board.get_value(r, c) != 0)
