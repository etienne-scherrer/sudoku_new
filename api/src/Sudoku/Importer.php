<?php

namespace App\Sudoku;

class Importer
{
    public function import(string $imagePath): Board
    {
        $info = @getimagesize($imagePath);
        if (!$info) throw new \RuntimeException('Failed to read image');

        $img = match ($info['mime']) {
            'image/jpeg' => imagecreatefromjpeg($imagePath),
            'image/png'  => imagecreatefrompng($imagePath),
            'image/webp' => imagecreatefromwebp($imagePath),
            default      => throw new \RuntimeException('Unsupported image format'),
        };
        if (!$img) throw new \RuntimeException('Failed to decode image');

        imagefilter($img, IMG_FILTER_GRAYSCALE);

        $w      = imagesx($img);
        $h      = imagesy($img);
        $binary = imagecreatetruecolor($w, $h);
        $black  = imagecolorallocate($binary, 0, 0, 0);
        $white  = imagecolorallocate($binary, 255, 255, 255);
        imagefill($binary, 0, 0, $white);
        for ($y = 0; $y < $h; $y++) {
            for ($x = 0; $x < $w; $x++) {
                $rgb = imagecolorat($img, $x, $y);
                if ((($rgb >> 16) & 0xFF) < 128) {
                    imagesetpixel($binary, $x, $y, $black);
                }
            }
        }
        imagedestroy($img);

        $rowDark = [];
        $colDark = [];
        for ($y = 0; $y < $h; $y++) {
            $count = 0;
            for ($x = 0; $x < $w; $x++) {
                if ((imagecolorat($binary, $x, $y) & 0xFF) === 0) $count++;
            }
            if ($count / $w > 0.30) $rowDark[] = $y;
        }
        for ($x = 0; $x < $w; $x++) {
            $count = 0;
            for ($y = 0; $y < $h; $y++) {
                if ((imagecolorat($binary, $x, $y) & 0xFF) === 0) $count++;
            }
            if ($count / $h > 0.30) $colDark[] = $x;
        }

        if (count($rowDark) < 8 || count($colDark) < 8) {
            imagedestroy($binary);
            throw new \RuntimeException('No sudoku grid detected in this image. Try a clearer photo or screenshot.');
        }

        $top    = min($rowDark);
        $bottom = max($rowDark);
        $left   = min($colDark);
        $right  = max($colDark);

        $gridW  = max(1, $right - $left);
        $gridH  = max(1, $bottom - $top);
        $square = imagecreatetruecolor(450, 450);
        imagefill($square, 0, 0, imagecolorallocate($square, 255, 255, 255));
        imagecopyresampled($square, $binary, 0, 0, $left, $top, 450, 450, $gridW, $gridH);
        imagedestroy($binary);

        $cellSize = 50;
        $tempDir  = sys_get_temp_dir();
        $board    = Board::empty();

        for ($r = 0; $r < 9; $r++) {
            for ($c = 0; $c < 9; $c++) {
                $cell = imagecreatetruecolor($cellSize, $cellSize);
                imagefill($cell, 0, 0, imagecolorallocate($cell, 255, 255, 255));
                imagecopy($cell, $square, 0, 0, $c * $cellSize, $r * $cellSize, $cellSize, $cellSize);

                $tmp = $tempDir . '/sudoku_' . $r . '_' . $c . '_' . uniqid() . '.png';
                imagepng($cell, $tmp);
                imagedestroy($cell);

                $out   = shell_exec('tesseract ' . escapeshellarg($tmp) . ' stdout --psm 10 -c tessedit_char_whitelist=123456789 2>/dev/null');
                $digit = (int)trim($out ?? '');
                unlink($tmp);

                if ($digit >= 1 && $digit <= 9) {
                    $board->setValue($r, $c, $digit);
                }
            }
        }
        imagedestroy($square);

        return $board;
    }
}
