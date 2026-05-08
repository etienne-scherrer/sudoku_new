import pytest
from sudoku.board import Board


def test_empty_board():
    board = Board.empty()
    for r in range(9):
        for c in range(9):
            assert board.get_value(r, c) == 0
            assert board.is_read_only(r, c) is False


def test_from_array():
    data = [[{"value": 0, "readOnly": False}] * 9 for _ in range(9)]
    data[0][0] = {"value": "5", "readOnly": True}
    data[3][4] = {"value": 7, "readOnly": False}
    board = Board.from_array(data)
    assert board.get_value(0, 0) == 5
    assert board.is_read_only(0, 0) is True
    assert board.get_value(3, 4) == 7
    assert board.is_read_only(3, 4) is False
    assert board.get_value(1, 1) == 0
    assert board.is_read_only(1, 1) is False


def test_is_safe_row():
    board = Board.empty()
    board.set_value(0, 3, 5)
    # 5 is already in row 0 at col 3; col 7 is empty
    assert board.is_safe(0, 7, 5) is False


def test_is_safe_col():
    board = Board.empty()
    board.set_value(4, 2, 3)
    # 3 is already in col 2 at row 4; row 8 is empty
    assert board.is_safe(8, 2, 3) is False


def test_is_safe_box():
    board = Board.empty()
    # Place 9 in top-left box at (1, 1)
    board.set_value(1, 1, 9)
    # (2, 0) is in the same 3x3 box; row and col are otherwise clear
    assert board.is_safe(2, 0, 9) is False


def test_is_safe_passes():
    board = Board.empty()
    for n in range(1, 10):
        assert board.is_safe(4, 4, n) is True


def test_to_array_round_trip():
    original_data = [[{"value": 0, "readOnly": False}] * 9 for _ in range(9)]
    original_data[2][5] = {"value": 4, "readOnly": True}
    original_data[8][8] = {"value": 9, "readOnly": False}
    board = Board.from_array(original_data)
    exported = board.to_array()
    board2 = Board.from_array(exported)
    for r in range(9):
        for c in range(9):
            assert board2.get_value(r, c) == board.get_value(r, c)
            assert board2.is_read_only(r, c) == board.is_read_only(r, c)
