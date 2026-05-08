from __future__ import annotations

from .board import Board


class Solver:
    def solve(self, board: Board) -> bool:
        if not self.validate(board):
            return False

        rows = [0] * 9
        cols = [0] * 9
        boxes = [0] * 9

        for r in range(9):
            for c in range(9):
                v = board.get_value(r, c)
                if v != 0:
                    bit = 1 << v
                    rows[r] |= bit
                    cols[c] |= bit
                    boxes[(r // 3) * 3 + (c // 3)] |= bit

        return self._backtrack(board, rows, cols, boxes)

    def validate(self, board: Board) -> bool:
        for row in range(9):
            for col in range(9):
                num = board.get_value(row, col)
                if num == 0:
                    continue
                board.set_value(row, col, 0)
                safe = board.is_safe(row, col, num)
                board.set_value(row, col, num)
                if not safe:
                    return False
        return True

    def _backtrack(self, board: Board, rows: list[int], cols: list[int], boxes: list[int]) -> bool:
        min_count = 10
        best_row = -1
        best_col = -1

        found_one = False
        for r in range(9):
            for c in range(9):
                if board.get_value(r, c) != 0:
                    continue
                used = rows[r] | cols[c] | boxes[(r // 3) * 3 + (c // 3)]
                count = 0
                for n in range(1, 10):
                    if not (used & (1 << n)):
                        count += 1
                if count == 0:
                    return False
                if count < min_count:
                    min_count = count
                    best_row = r
                    best_col = c
                    if count == 1:
                        found_one = True
                        break
            if found_one:
                break

        if best_row == -1:
            return True

        box = (best_row // 3) * 3 + (best_col // 3)
        used = rows[best_row] | cols[best_col] | boxes[box]

        for n in range(1, 10):
            if used & (1 << n):
                continue
            bit = 1 << n
            board.set_value(best_row, best_col, n)
            rows[best_row] |= bit
            cols[best_col] |= bit
            boxes[box] |= bit

            if self._backtrack(board, rows, cols, boxes):
                return True

            board.set_value(best_row, best_col, 0)
            rows[best_row] &= ~bit
            cols[best_col] &= ~bit
            boxes[box] &= ~bit

        return False
