import pytest
from sudoku.board import Board
from sudoku.solver import Solver

# A well-known sudoku puzzle (0 = empty)
KNOWN_PUZZLE = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

KNOWN_SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
]


def _make_board_from_grid(grid):
    data = [[{"value": grid[r][c], "readOnly": False} for c in range(9)] for r in range(9)]
    return Board.from_array(data)


def test_solve_known_puzzle():
    board = _make_board_from_grid(KNOWN_PUZZLE)
    solver = Solver()
    result = solver.solve(board)
    assert result is True
    for r in range(9):
        for c in range(9):
            assert board.get_value(r, c) == KNOWN_SOLUTION[r][c]


def test_validate_detects_conflict():
    # Row conflict: two 5s in row 0
    board = Board.empty()
    board.set_value(0, 0, 5)
    board.set_value(0, 5, 5)
    solver = Solver()
    assert solver.validate(board) is False


def test_validate_detects_col_conflict():
    board = Board.empty()
    board.set_value(1, 3, 7)
    board.set_value(7, 3, 7)
    solver = Solver()
    assert solver.validate(board) is False


def test_validate_detects_box_conflict():
    board = Board.empty()
    board.set_value(0, 0, 3)
    board.set_value(2, 2, 3)
    solver = Solver()
    assert solver.validate(board) is False


def test_solve_returns_false_on_invalid():
    # Two 1s in the same row → unsolvable
    board = Board.empty()
    board.set_value(0, 0, 1)
    board.set_value(0, 8, 1)
    solver = Solver()
    assert solver.solve(board) is False


def test_solve_already_complete():
    board = _make_board_from_grid(KNOWN_SOLUTION)
    solver = Solver()
    assert solver.solve(board) is True
    # Board unchanged
    for r in range(9):
        for c in range(9):
            assert board.get_value(r, c) == KNOWN_SOLUTION[r][c]
