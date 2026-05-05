<?php

namespace App\Http;

class Request
{
    private function __construct(
        private string $method,
        private string $path,
        private array  $body,
        private array  $files
    ) {}

    public static function fromGlobals(): self
    {
        $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $body = [];
        $raw  = file_get_contents('php://input');
        if ($raw) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) $body = $decoded;
        }
        return new self(
            strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET'),
            $path,
            $body,
            $_FILES
        );
    }

    public function getMethod(): string { return $this->method; }
    public function getPath(): string   { return $this->path; }
    public function getBody(): array    { return $this->body; }

    public function getFile(string $key): ?array
    {
        return isset($this->files[$key]) ? $this->files[$key] : null;
    }
}
