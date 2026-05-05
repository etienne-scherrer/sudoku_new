<?php

require __DIR__ . '/../vendor/autoload.php';

use App\Http\Request;
use App\Http\Router;
use App\Controllers\PuzzleController;

Router::setCorsHeaders();

$router = new Router();
$c      = new PuzzleController();

$router->get( '/api/puzzle',        [$c, 'generate']);
$router->post('/api/puzzle/solve',  [$c, 'solve']);
$router->post('/api/puzzle/import', [$c, 'import']);
$router->get( '/api/health',        [$c, 'health']);

$router->dispatch(Request::fromGlobals())->send();
