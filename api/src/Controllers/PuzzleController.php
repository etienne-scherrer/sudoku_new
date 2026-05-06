<?php

namespace App\Controllers;

use App\Http\Request;
use App\Http\Response;
use App\Sudoku\Board;
use App\Sudoku\Generator;
use App\Sudoku\Importer;
use App\Sudoku\Solver;
use RuntimeException;

class PuzzleController
{
    private Solver    $solver;
    private Generator $generator;

    public function __construct()
    {
        $this->solver    = new Solver();
        $this->generator = new Generator($this->solver);
    }

    public function generate(Request $req): Response
    {
        $board = $this->generator->generate();
        return Response::json($board->toArray());
    }

    public function solve(Request $req): Response
    {
        $data = $req->getBody();
        if (!isset($data['grid']) || !is_array($data['grid']) || count($data['grid']) !== 9) {
            return Response::error('Invalid request', 400);
        }
        $board = Board::fromArray($data['grid']);
        if (!$this->solver->validate($board)) {
            return Response::error('Invalid board configuration', 422);
        }
        if (!$this->solver->solve($board)) {
            return Response::error('No solution exists for the provided board', 422);
        }
        return Response::json(['result' => $board->toArray()]);
    }

    public function import(Request $req): Response
    {
        $file = $req->getFile('image');
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            return Response::error('No image uploaded', 400);
        }
        $finfo   = new \finfo(FILEINFO_MIME_TYPE);
        $mime    = $finfo->file($file['tmp_name']);
        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($mime, $allowed, true)) {
            return Response::error('Invalid file type. Upload JPEG, PNG, or WEBP.', 400);
        }
        if ($file['size'] > 5 * 1024 * 1024) {
            return Response::error('Image too large. Maximum 5 MB.', 400);
        }
        try {
            $importer = new Importer();
            $board    = $importer->import($file['tmp_name']);
            return Response::json(['grid' => $board->toArray()]);
        } catch (RuntimeException $e) {
            return Response::error($e->getMessage(), 422);
        }
    }

    public function health(Request $req): Response
    {
        return Response::json(['status' => 'ok']);
    }
}
