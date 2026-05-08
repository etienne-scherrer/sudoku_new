from __future__ import annotations

import cv2
import numpy as np
import pytesseract

from .board import Board


def _order_points(pts: np.ndarray) -> np.ndarray:
    """Order 4 corner points as: top-left, top-right, bottom-right, bottom-left."""
    rect = np.zeros((4, 2), dtype=np.float32)
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]   # top-left: min sum
    rect[2] = pts[np.argmax(s)]   # bottom-right: max sum
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # top-right: min diff
    rect[3] = pts[np.argmax(diff)]  # bottom-left: max diff
    return rect


class Importer:
    def import_image(self, image_bytes: bytes) -> Board:
        # 1. Decode
        buf = np.frombuffer(image_bytes, np.uint8)
        gray = cv2.imdecode(buf, cv2.IMREAD_GRAYSCALE)
        if gray is None:
            raise RuntimeError("Failed to decode image")

        # 2. Threshold
        binary = cv2.adaptiveThreshold(
            gray, 255,
            cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
            cv2.THRESH_BINARY_INV,
            11, 2,
        )

        # 3. Find grid contour
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        grid_contour = None
        for cnt in sorted(contours, key=cv2.contourArea, reverse=True):
            peri = cv2.arcLength(cnt, True)
            approx = cv2.approxPolyDP(cnt, 0.02 * peri, True)
            if len(approx) == 4:
                grid_contour = approx
                break
        else:
            raise RuntimeError(
                "No sudoku grid detected in this image. Try a clearer photo or screenshot."
            )

        # 4. Perspective warp to 450×450
        pts = grid_contour.reshape(4, 2).astype(np.float32)
        rect = _order_points(pts)
        dst = np.array([[0, 0], [449, 0], [449, 449], [0, 449]], dtype=np.float32)
        M = cv2.getPerspectiveTransform(rect, dst)
        warped = cv2.warpPerspective(gray, M, (450, 450))

        # 5. Extract cells and OCR
        cell_size = 50
        inset = 4  # 8% of 50px
        board = Board.empty()

        for r in range(9):
            for c in range(9):
                y0 = r * cell_size
                x0 = c * cell_size
                inner = warped[y0 + inset: y0 + cell_size - inset,
                               x0 + inset: x0 + cell_size - inset]
                cell_img = cv2.resize(inner, (100, 100), interpolation=cv2.INTER_LANCZOS4)
                cell_img = np.where(cell_img < 128, 0, 255).astype(np.uint8)

                result = pytesseract.image_to_string(
                    cell_img,
                    config="--psm 10 -c tessedit_char_whitelist=123456789",
                )
                try:
                    d = int(result.strip())
                    if d < 1 or d > 9:
                        d = 0
                except ValueError:
                    d = 0

                if d != 0:
                    board.set_value(r, c, d)

        # 6. Build Board
        return board
