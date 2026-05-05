<?php

namespace App\Http;

class Router
{
    private array $routes = [];

    public function get(string $path, callable $handler): void
    {
        $this->routes[] = ['GET', $path, $handler];
    }

    public function post(string $path, callable $handler): void
    {
        $this->routes[] = ['POST', $path, $handler];
    }

    public function dispatch(Request $request): Response
    {
        foreach ($this->routes as [$method, $path, $handler]) {
            if ($request->getMethod() === $method && $request->getPath() === $path) {
                return $handler($request);
            }
        }
        return Response::error('Not found', 404);
    }

    public static function setCorsHeaders(): void
    {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(204);
            exit;
        }
    }
}
