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
# Terminal 1 — PHP API
php -S localhost:8000 api/public/index.php

# Terminal 2 — React dev server (proxies /api/* to port 8000)
npm run dev
```

Open `http://localhost:5173`.

## Tests

```bash
npm test -- --run          # JS
cd api && ./vendor/bin/phpunit   # PHP
```

## Deploy

Push to `main`. GitHub Actions runs tests then deploys via SSH.
