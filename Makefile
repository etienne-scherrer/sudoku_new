.PHONY: help dev start stop restart build rebuild logs bash test composer health

PROJECT_NAME ?= sudoku
DC := docker compose -p $(PROJECT_NAME)

help:
	@echo "Local development (no Docker):"
	@echo "  make dev                 - Start PHP API on :8000 and Vite on :5173"
	@echo ""
	@echo "Docker:"
	@echo "  make start               - Start containers"
	@echo "  make stop                - Stop containers"
	@echo "  make restart             - Restart containers"
	@echo "  make build               - Build and start containers"
	@echo "  make rebuild             - Rebuild images from scratch"
	@echo "  make logs                - Tail container logs"
	@echo "  make bash                - Shell into the backend container"
	@echo "  make health              - Health check (requires running stack)"
	@echo ""
	@echo "Testing:"
	@echo "  make test                - Run JS and PHP test suites"
	@echo ""
	@echo "PHP:"
	@echo "  make composer cmd=...    - Run a Composer command inside api/"

# ── Local dev ──────────────────────────────────────────────────────────────────

dev:
	@trap 'kill 0' INT; \
	php -S localhost:8000 api/public/index.php & \
	npm run dev

# ── Docker ─────────────────────────────────────────────────────────────────────

start:
	$(DC) up -d --remove-orphans

stop:
	$(DC) down

restart:
	$(DC) restart

build:
	$(DC) up -d --force-recreate --build --remove-orphans

rebuild:
	$(DC) down
	$(DC) build --no-cache
	$(DC) up -d

logs:
	$(DC) logs -f

bash:
	$(DC) exec backend sh

health:
	curl -sf http://localhost/api/health | python3 -m json.tool

# ── Testing ────────────────────────────────────────────────────────────────────

test:
	npm test -- --run
	cd api && ./vendor/bin/phpunit

# ── PHP ────────────────────────────────────────────────────────────────────────

composer:
	cd api && composer $(cmd)
