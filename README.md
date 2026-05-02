# Sudoku Solver

A browser-based Sudoku game built with React 19 and Vite. Generate puzzles, fill them in, and solve them — or let the solver do it. Puzzles are generated and solved server-side using a PHP 8.5 backtracking algorithm.

## Prerequisites

- Node.js 22.12.0+ (see `.node-version`)
- PHP 8.5 (for the backend API)

## Run locally

Start the PHP development server:

```bash
php -S localhost:8000 -t .
```

In a separate terminal, start Vite:

```bash
npm run dev
```

Open `http://localhost:5173`. Set your API base URL in `.env.local`:

```
VITE_API_BASE_URL=http://localhost:8000/
```

## Build and deploy

```bash
BUILD_ENV=production npm run build
```

Copy the `dist/` folder and the `sudoku/` folder to the VPS:

```bash
scp -r dist/* etienne@128.140.44.112:/var/www/dev.etienne-scherrer.ch/html/projects/sudoku-solver/
scp -r sudoku/ etienne@128.140.44.112:/var/www/dev.etienne-scherrer.ch/html/projects/sudoku-solver/sudoku/
```
