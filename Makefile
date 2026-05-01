SHELL := /bin/bash
ENV_FILE := ./_common/.env
PNPM_CMD := env -u PNPM_STORE_DIR -u npm_config_store_dir pnpm

.PHONY: help install backend-install frontend-install mobile-install ui-kit-install \
        backend api frontend web mobile \
        lint lint-fix \
        ci \
        pre-commit-check \
        test test-backend test-web test-common test-mobile \
        test-coverage test-backend-coverage test-web-coverage test-common-coverage test-mobile-coverage \
        mobile-build mobile-capacitor-sync mobile-run-android mobile-run-ios \
        fullstack-web fullstack-mobile \
        docker-build docker-up docker-down docker-restart \
        kill-backend-ports kill-frontend-ports kill-mobile-ports kill-all-ports

help:
	@echo ""
	@echo "Setup:"
	@echo "  make install              - Install all dependencies"
	@echo "  make backend-install      - Install backend dependencies"
	@echo "  make frontend-install     - Install frontend workspace dependencies"
	@echo "  make ui-kit-install       - Install shared ui-kit workspace dependencies"
	@echo "  make mobile-install       - Install mobile workspace dependencies"
	@echo ""
	@echo "Local dev:"
	@echo "  make backend app        - Run backend api (:4000)"
	@echo "  make web / frontend       - Run web app (:3000)"
	@echo "  make mobile               - Run mobile shell (:8100)"
	@echo "  make fullstack-web        - Run backend + web"
	@echo "  make fullstack-mobile     - Run backend + mobile"
	@echo "  make mobile-build         - Build mobile web bundle"
	@echo "  make mobile-capacitor-sync - Sync mobile bundle to native platforms"
	@echo "  make mobile-run-android   - Build, sync, and run on Android"
	@echo "  make mobile-run-ios       - Build, sync, and run on iOS"
	@echo "  make lint                 - Run backend + web + mobile linters"
	@echo "  make lint-fix             - Run backend + web + mobile linters with --fix"
	@echo "  make ci                   - Run lint + tests + backend build + frontend typecheck"
	@echo "  make pre-commit-check     - Run lint + tests used by the git pre-commit hook"
	@echo "  make test                 - Run all unit tests (backend, web, _common, mobile)"
	@echo "  make test-backend         - Run backend api Jest tests"
	@echo "  make test-web             - Run web Jest tests"
	@echo "  make test-common          - Run frontend/_common (@common/shared) Jest tests"
	@echo "  make test-mobile          - Run mobile Jest tests"
	@echo "  make test-coverage        - Run test:coverage in all packages above"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build         - Build all service images"
	@echo "  make docker-up            - Build and start all services"
	@echo "  make docker-down          - Stop all services"
	@echo "  make docker-restart       - Stop, rebuild, and start all services"
	@echo ""
	@echo "Ports:"
	@echo "  make kill-backend-ports   - Kill port 4000"
	@echo "  make kill-frontend-ports  - Kill port 3000"
	@echo "  make kill-mobile-ports    - Kill port 8100"
	@echo "  make kill-all-ports       - Kill ports 3000, 4000, 8100"
	@echo ""

# ─── Install ──────────────────────────────────────────────────────────────────

install: backend-install frontend-install ui-kit-install mobile-install

backend-install:
	$(PNPM_CMD) --dir backend/app install

frontend-install:
	$(PNPM_CMD) --dir frontend install

mobile-install:
	$(PNPM_CMD) --dir frontend/mobile install

ui-kit-install:
	$(PNPM_CMD) --dir frontend --filter @common/shared install

# ─── Local dev ────────────────────────────────────────────────────────────────

backend: kill-backend-ports
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev

web: kill-frontend-ports
	$(PNPM_CMD) --dir frontend dev:web

mobile: kill-mobile-ports
	$(PNPM_CMD) --dir frontend/mobile dev --host 0.0.0.0 --port 8100

mobile-build:
	$(PNPM_CMD) --dir frontend/mobile build

mobile-capacitor-sync: mobile-build
	$(PNPM_CMD) --dir frontend/mobile capacitor:sync

mobile-run-android: mobile-capacitor-sync
	$(PNPM_CMD) --dir frontend/mobile capacitor:run:android

mobile-run-ios: mobile-capacitor-sync
	$(PNPM_CMD) --dir frontend/mobile capacitor:run:ios

lint:
	$(PNPM_CMD) --dir backend/app lint
	$(PNPM_CMD) --dir frontend/web lint
	$(PNPM_CMD) --dir frontend/mobile lint

lint-fix:
	$(PNPM_CMD) --dir backend/app lint:fix
	$(PNPM_CMD) --dir frontend/web lint:fix
	$(PNPM_CMD) --dir frontend/mobile lint:fix

ci: lint test
	$(PNPM_CMD) --dir backend/app build
	$(PNPM_CMD) --dir frontend typecheck

pre-commit-check: lint test

# ─── Tests (Jest + React Testing Library) ─────────────────────────────────────

test: test-backend test-web test-common test-mobile

test-backend:
	$(PNPM_CMD) --dir backend/app test

test-web:
	$(PNPM_CMD) --dir frontend --filter web test

test-common:
	$(PNPM_CMD) --dir frontend --filter @common/shared test

test-mobile:
	$(PNPM_CMD) --dir frontend --filter mobile test

test-coverage: test-backend-coverage test-web-coverage test-common-coverage test-mobile-coverage

test-backend-coverage:
	$(PNPM_CMD) --dir backend/app run test:coverage

test-web-coverage:
	$(PNPM_CMD) --dir frontend --filter web run test:coverage

test-common-coverage:
	$(PNPM_CMD) --dir frontend --filter @common/shared run test:coverage

test-mobile-coverage:
	$(PNPM_CMD) --dir frontend --filter mobile run test:coverage


fullstack-web: kill-all-ports
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev & \
	  $(PNPM_CMD) --dir frontend dev:web & \
	  wait

fullstack-mobile: kill-all-ports
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev & \
	  $(PNPM_CMD) --dir frontend/mobile dev --host 0.0.0.0 --port 8100 & \
	  wait

# ─── Docker ───────────────────────────────────────────────────────────────────

docker-build:
	docker compose build

docker-up:
	docker compose up --build

docker-down:
	docker compose down

docker-restart: docker-down docker-up

# ─── Ports ────────────────────────────────────────────────────────────────────

define kill_port
	@process_id=$$(lsof -ti tcp:$(1)); \
	if [ -n "$$process_id" ]; then \
		echo "Killing port $(1) (PID $$process_id)"; \
		kill -9 $$process_id; \
	else \
		echo "Port $(1) is free"; \
	fi
endef

kill-backend-ports:
	$(call kill_port,4000)


kill-frontend-ports:
	$(call kill_port,3000)

kill-mobile-ports:
	$(call kill_port,8100)

kill-all-ports:
	$(call kill_port,3000)
	$(call kill_port,4000)
	$(call kill_port,8100)
