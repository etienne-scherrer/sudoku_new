<?php
include 'common-functions.php';

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

function generateSudoku(): array {
    $grid = array_fill(0, 9, array_fill(0, 9, ['value' => 0, 'readOnly' => false]));

    // Attempt to randomly fill and solve the grid multiple times if necessary
    do {
        resetGrid($grid); // Clears the grid before a new fill attempt
        fillGridRandomly($grid);
    } while (!solveSudoku($grid)); // Check if the randomly filled grid is solvable

    // Optionally, remove numbers to create a puzzle
    removeNumbers($grid);

    return $grid;
}

function resetGrid(array &$grid): void {
    for ($i = 0; $i < 9; $i++) {
        for ($j = 0; $j < 9; $j++) {
            $grid[$i][$j] = ['value' => 0, 'readOnly' => false];
        }
    }
}

function fillGridRandomly(array &$grid): void {
    for ($i = 0; $i < 9; $i++) {
        $numbers = range(1, 9);
        shuffle($numbers); // Shuffle numbers to randomly assign to row
        for ($j = 0; $j < 9; $j++) {
            // Only attempt to place a number if the cell is empty
            if ($grid[$i][$j]['value'] == 0 && isSafe($grid, $i, $j, $numbers[$j % 9])) {
                $grid[$i][$j]['value'] = $numbers[$j % 9];
            }
        }
    }
}

function removeNumbers(array &$grid, int $attempts = 60): void {
    while ($attempts > 0) {
        $row = rand(0, 8);
        $col = rand(0, 8);
        if ($grid[$row][$col]['value'] !== 0) {
            $backup = $grid[$row][$col]['value'];
            $grid[$row][$col]['value'] = 0;
            $copyGrid = $grid;
            if (!solveSudoku($copyGrid)) {
                $grid[$row][$col]['value'] = $backup;
            }
            $attempts--;
        }
    }
}

$puzzle = generateSudoku();
echo json_encode($puzzle);