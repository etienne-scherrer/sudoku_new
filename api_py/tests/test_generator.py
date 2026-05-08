import pytest
from sudoku.board import Board
from sudoku.generator import Generator
from sudoku.solver import Solver


def test_generate_returns_board():
    gen = Generator()
    board = gen.generate()
    assert isinstance(board, Board)
    arr = board.to_array()
    assert len(arr) == 9
    for row in arr:
        assert len(row) == 9


def test_generate_has_clues():
    gen = Generator()
    board = gen.generate()
    clues = sum(
        1
        for r in range(9)
        for c in range(9)
        if board.is_read_only(r, c)
    )
    assert clues > 0


def test_generate_is_valid():
    gen = Generator()
    board = gen.generate()
    solver = Solver()
    assert solver.validate(board) is True


def test_generate_is_solvable():
    gen = Generator()
    board = gen.generate()
    copy = Board.from_array(board.to_array())
    solver = Solver()
    assert solver.solve(copy) is True


def test_generate_different_puzzles():
    gen = Generator()
    puzzles = []
    for _ in range(3):
        board = gen.generate()
        puzzles.append(
            tuple(board.get_value(r, c) for r in range(9) for c in range(9))
        )
    # At least two of the three puzzles must differ
    assert len(set(puzzles)) > 1
