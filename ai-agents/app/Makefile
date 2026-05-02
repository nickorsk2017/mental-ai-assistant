SHELL := /bin/bash
# Paths are relative to this Makefile (`ai-agents/app/`)
COMMON_ENV_FILE := ../../_common/.env

.PHONY: install sync run dev lint

install: sync

sync:
	uv sync

# Loads `_common/.env` into the shell so Uvicorn sees AI_AGENTS_HOST / AI_AGENTS_PORT.
# Application code also reads `_common/.env` via `src/config.py`.
run dev:
	@set -a; source $(COMMON_ENV_FILE); set +a; \
	  uv run uvicorn src.main:application \
	    --reload \
	    --host "$${AI_AGENTS_HOST:-0.0.0.0}" \
	    --port "$${AI_AGENTS_PORT:-8080}"

lint:
	uv run python -m compileall -q src
