SHELL := /bin/bash
ENV_FILE := ./_common/.env
PNPM_CMD := env -u PNPM_STORE_DIR -u npm_config_store_dir pnpm

.PHONY: help install backend-install frontend-install mobile-install ui-kit-install ai-agents-install kafka-install kafka-stop \
        supabase-migrate \
        backend api frontend web mobile \
        ai-agents ai \
        storybook \
        lint lint-fix \
        ci \
        pre-commit-check \
        test test-backend test-web test-common test-mobile test-ai \
        test-coverage test-backend-coverage test-web-coverage test-common-coverage test-mobile-coverage \
        mobile-build mobile-capacitor-sync mobile-run-android mobile-run-ios \
        fullstack-web fullstack-mobile start-all \
        docker-restart docker-run-all docker-stop-all \
        kill-backend-ports kill-frontend-ports kill-mobile-ports kill-ai-agents-ports kill-storybook-ports kill-all-ports

help:
	@echo ""
	@echo "Setup:"
	@echo "  make install              - Install root git hooks (husky), backend, frontend, ui-kit, mobile, AI agents"
	@echo "  make backend-install      - Install backend dependencies"
	@echo "  make frontend-install     - Install frontend workspace dependencies"
	@echo "  make ui-kit-install       - Install shared ui-kit workspace dependencies"
	@echo "  make mobile-install       - Install mobile workspace dependencies"
	@echo "  make ai-agents-install    - Install AI agents app (uv sync in ai-agents/app/)"
	@echo ""
	@echo "Local dev:"
	@echo "  make backend app        - Run backend api (:4000)"
	@echo "  make web / frontend       - Run web app (:3000)"
	@echo "  make mobile               - Run mobile shell (:8100)"
	@echo "  make fullstack-web        - Kafka (docker) + backend + web + ai-agents"
	@echo "  make fullstack-mobile     - Kafka (docker) + backend + mobile + ai-agents"
	@echo "  make start-all            - Kafka (docker) + backend + web + mobile + ai-agents"
	@echo "  make ai-agents / ai       - Run AI agents FastAPI (uv), port from AI_AGENTS_PORT (:8080)"
	@echo "  make storybook            - Run Storybook for @common/shared ui-kit (:6006)"
	@echo "  make mobile-build         - Build mobile web bundle"
	@echo "  make mobile-capacitor-sync - Sync mobile bundle to native platforms"
	@echo "  make mobile-run-android   - Build, sync, and run on Android"
	@echo "  make mobile-run-ios       - Build, sync, and run on iOS"
	@echo "  make lint                 - Run backend + web + mobile linters"
	@echo "  make lint-fix             - Run backend + web + mobile linters with --fix"
	@echo "  make ci                   - Run lint + tests + backend build + frontend typecheck"
	@echo "  make pre-commit-check     - Run lint + tests used by the git pre-commit hook"
	@echo "  make test                 - Run all unit tests (backend, web, _common, mobile, ai-agents)"
	@echo "  make test-backend         - Run backend api Jest tests"
	@echo "  make test-web             - Run web Jest tests"
	@echo "  make test-common          - Run frontend/_common (@common/shared) Jest tests"
	@echo "  make test-mobile          - Run mobile Jest tests"
	@echo "  make test-ai              - Run AI agents pytest suite"
	@echo "  make test-coverage        - Run test:coverage in all packages above"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-run-all       - Down existing compose stack, then build and start all services (detached)"
	@echo "  make docker-stop-all      - Stop, remove containers and compose images"
	@echo "  make docker-restart       - Stop, rebuild, and start all services"
	@echo "  make kafka-install        - Pull if needed and start Kafka (apache/kafka, port 9092)"
	@echo "  make kafka-stop           - Stop the Kafka container only"
	@echo ""
	@echo "Supabase:"
	@echo "  make supabase-migrate     - Run backend/app/scripts/run-supabase-migrations.ts (via pnpm migrate:supabase)"
	@echo ""
	@echo "Ports:"
	@echo "  make kill-backend-ports   - Kill port 4000"
	@echo "  make kill-frontend-ports  - Kill port 3000"
	@echo "  make kill-mobile-ports    - Kill port 8100"
	@echo "  make kill-storybook-ports - Kill port 6006"
	@echo "  make kill-all-ports       - Kill ports 3000, 4000, 6006, 8080, 8100"
	@echo ""

# ─── Install ──────────────────────────────────────────────────────────────────

install: root-install backend-install frontend-install ui-kit-install mobile-install ai-agents-install

root-install:
	$(PNPM_CMD) install

backend-install:
	$(PNPM_CMD) --dir backend/app install

frontend-install:
	$(PNPM_CMD) --dir frontend install

mobile-install:
	$(PNPM_CMD) --dir frontend/mobile install

ui-kit-install:
	$(PNPM_CMD) --dir frontend --filter @common/shared install

ai-agents-install:
	uv sync --directory ai-agents/app --group dev

# ─── Local dev ────────────────────────────────────────────────────────────────

backend: kill-backend-ports
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev

web: kill-frontend-ports
	$(PNPM_CMD) --dir frontend dev:web

mobile: kill-mobile-ports
	$(PNPM_CMD) --dir frontend/mobile dev --host 0.0.0.0 --port 8100

ai-agents: kill-ai-agents-ports
	@set -a; source $(ENV_FILE); set +a; \
	  cd ai-agents/app && uv run uvicorn src.main:application \
	    --reload \
	    --host "$${AI_AGENTS_HOST:-0.0.0.0}" \
	    --port "$${AI_AGENTS_PORT:-8080}"

ai: ai-agents

storybook: kill-storybook-ports
	$(PNPM_CMD) --dir frontend storybook

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

test: test-backend test-web test-common test-mobile test-ai

test-backend:
	$(PNPM_CMD) --dir backend/app test

test-ai:
	uv run --directory ai-agents/app --group dev pytest

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
	@$(MAKE) kafka-install
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev & \
	  $(PNPM_CMD) --dir frontend dev:web & \
	  ( cd ai-agents/app && uv run uvicorn src.main:application \
	      --reload \
	      --host "$${AI_AGENTS_HOST:-0.0.0.0}" \
	      --port "$${AI_AGENTS_PORT:-8080}" ) & \
	  wait

fullstack-mobile: kill-all-ports
	@$(MAKE) kafka-install
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev & \
	  $(PNPM_CMD) --dir frontend/mobile dev --host 0.0.0.0 --port 8100 & \
	  ( cd ai-agents/app && uv run uvicorn src.main:application \
	      --reload \
	      --host "$${AI_AGENTS_HOST:-0.0.0.0}" \
	      --port "$${AI_AGENTS_PORT:-8080}" ) & \
	  wait

start-all: kill-all-ports
	@$(MAKE) kafka-install
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev & \
	  $(PNPM_CMD) --dir frontend dev:web & \
	  $(PNPM_CMD) --dir frontend/mobile dev --host 0.0.0.0 --port 8100 & \
	  ( cd ai-agents/app && uv run uvicorn src.main:application \
	      --reload \
	      --host "$${AI_AGENTS_HOST:-0.0.0.0}" \
	      --port "$${AI_AGENTS_PORT:-8080}" ) & \
	  wait

# ─── Docker ───────────────────────────────────────────────────────────────────

docker-run-all:
	docker compose down --remove-orphans
	@kafka_container_identifiers=$$(docker ps -aq --filter ancestor=apache/kafka:latest); \
	if [ -n "$$kafka_container_identifiers" ]; then \
		echo "Removing other apache/kafka containers (free host port 9092)"; \
		docker rm -f $$kafka_container_identifiers; \
	fi
	docker compose up -d --build

docker-stop-all:
	docker compose down --rmi all --remove-orphans

docker-restart:
	docker compose down
	docker compose up --build

kafka-install:
	docker compose up -d kafka

kafka-stop:
	docker compose stop kafka

supabase-migrate:
	$(PNPM_CMD) --dir backend/app run migrate:supabase

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

kill-ai-agents-ports:
	$(call kill_port,8080)

kill-storybook-ports:
	$(call kill_port,6006)

kill-all-ports:
	$(call kill_port,3000)
	$(call kill_port,4000)
	$(call kill_port,6006)
	$(call kill_port,8080)
	$(call kill_port,8100)
