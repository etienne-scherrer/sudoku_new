<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'common-functions.php';

function validateBoard(array $board): bool {
    for ($row = 0; $row < 9; $row++) {
        for ($col = 0; $col < 9; $col++) {
            $num = (int)$board[$row][$col]['value'];
            if ($num !== 0) {
                $board[$row][$col]['value'] = 0;
                if (!isSafe($board, $row, $col, $num)) {
                    $board[$row][$col]['value'] = $num;
                    return false;
                }
                $board[$row][$col]['value'] = $num;
            }
        }
    }
    return true;
}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!isset($data['grid']) || !is_array($data['grid']) || count($data['grid']) !== 9) {
    echo json_encode(['error' => 'Invalid request']);
    exit;
}

$board = array_map(function($row) {
    return array_map(function($cell) {
        $cell['value'] = (int)($cell['value'] ?? 0);
        return $cell;
    }, $row);
}, $data['grid']);

if (!validateBoard($board)) {
    echo json_encode(['error' => 'Invalid board configuration']);
} else {
    if (solveSudoku($board)) {
        echo json_encode(['result' => $board]);
    } else {
        echo json_encode(['error' => 'No solution exists for the provided board']);
    }
}