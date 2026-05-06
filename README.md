# Sudoku

A browser-based Sudoku app. Generate puzzles, solve them, or import a photo via OCR.

Live at **[sudoku.etienne-scherrer.ch](https://sudoku.etienne-scherrer.ch)**

## Stack

- **Frontend:** React 19 + Vite, served by nginx
- **Backend:** PHP 8.5-fpm, OOP with Composer (PSR-4), MRV backtracking solver
- **OCR:** tesseract-ocr for image-to-grid import
- **Infrastructure:** Docker Compose + Traefik (Let's Encrypt TLS)
- **CI/CD:** GitHub Actions — tests on push, SSH deploy on pass

## Project structure

```
api/
├── public/index.php          ← front controller
├── src/
│   ├── Controllers/
│   ├── Http/                 ← Request, Response, Router
│   └── Sudoku/               ← Board, Solver, Generator, Importer
└── tests/
src/                          ← React app
.docker/
├── nginx/                    ← multi-stage Dockerfile + nginx config
└── php/                      ← php:8.5-fpm-alpine + gd + tesseract
compose.yml
.github/workflows/
├── tests.yml                 ← JS + PHP tests
└── deploy.yml                ← SSH deploy to VPS
```

## Run locally

```bash
make dev   # PHP API on :8080, Vite on :5173 — Ctrl+C stops both
```

Or with Docker (requires `compose.override.yml` — see below):

```bash
make build   # http://localhost:8080
```

### compose.override.yml

Create this file locally (it's gitignored, never deployed):

```yaml
services:
  frontend:
    ports:
      - "127.0.0.1:8080:80"

networks:
  traefik:
    external: false
    name: sudoku-traefik-local
```

## Tests

```bash
npm test -- --run          # JS
cd api && ./vendor/bin/phpunit   # PHP
```

## Deploy

Push to `main`. GitHub Actions runs tests then deploys via SSH.
