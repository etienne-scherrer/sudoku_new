from __future__ import annotations


class Board:
    def __init__(self, cells: list[list[dict]]) -> None:
        self._cells = cells

    @classmethod
    def empty(cls) -> "Board":
        cells = [[{"value": 0, "readOnly": False} for _ in range(9)] for _ in range(9)]
        return cls(cells)

    @classmethod
    def from_array(cls, data: list[list[dict]]) -> "Board":
        cells = [
            [
                {
                    "value": int(cell.get("value", 0)),
                    "readOnly": bool(cell.get("readOnly", False)),
                }
                for cell in row
            ]
            for row in data
        ]
        return cls(cells)

    def get_value(self, row: int, col: int) -> int:
        return self._cells[row][col]["value"]

    def set_value(self, row: int, col: int, value: int) -> None:
        self._cells[row][col]["value"] = value

    def is_read_only(self, row: int, col: int) -> bool:
        return self._cells[row][col]["readOnly"]

    def set_read_only(self, row: int, col: int, read_only: bool) -> None:
        self._cells[row][col]["readOnly"] = read_only

    def is_safe(self, row: int, col: int, num: int) -> bool:
        for i in range(9):
            if self._cells[row][i]["value"] == num or self._cells[i][col]["value"] == num:
                return False
        start_row = row - row % 3
        start_col = col - col % 3
        for i in range(3):
            for j in range(3):
                if self._cells[start_row + i][start_col + j]["value"] == num:
                    return False
        return True

    def to_array(self) -> list[list[dict]]:
        return [
            [{"value": cell["value"], "readOnly": cell["readOnly"]} for cell in row]
            for row in self._cells
        ]
