<?php

namespace App\Http;

class Response
{
    private function __construct(
        private mixed $data,
        private int   $status
    ) {}

    public static function json(mixed $data, int $status = 200): self
    {
        return new self($data, $status);
    }

    public static function error(string $message, int $status = 400): self
    {
        return new self(['error' => $message], $status);
    }

    public function send(): void
    {
        http_response_code($this->status);
        header('Content-Type: application/json');
        echo json_encode($this->data);
    }
}
