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
                    error_log("Board invalid at row $row col $col with number $num");
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

$board = array_map(function($row) {
    return array_map(function($cell) {
        $cell['value'] = (int)$cell['value'];  // Convert to integer if coming in as string
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