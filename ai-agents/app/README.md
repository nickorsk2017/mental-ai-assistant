# AI agents (Python / FastAPI)

Python service: **FastAPI** exposes **`POST /chat/messages/stream`** (Serene chat, streamed to the NestJS API), runs a **Kafka** consumer for async journaling, and persists **embeddings to Pinecone** plus **rows to Supabase** (`patient_notes`).

## Configuration

**Single source of truth:** `_common/.env` (see `_common/.env.example`). Relevant keys include `AI_AGENTS_BASE_URL` (used by the API client only), `KAFKA_*`, `OPENAI_*`, `PINECONE_*`, `SUPABASE_*`, `SUPABASE_PATIENT_NOTES_TABLE`.

`src/config.py` loads, in order:

1. `_common/.env` at repository root
2. Optional `ai-agents/.env` for local overrides only

Process environment variables still override file values.

## Layout

| Path | Role |
|------|------|
| `src/main.py` | FastAPI app and lifespan (Kafka consumer thread) |
| `src/config.py` | Pydantic settings |
| `src/prompts/` | Serene system prompt for REST chat |
| `src/routers/` | HTTP routes (`GET /health`, `POST /chat/messages/stream`) |
| `src/schemas/` | Pydantic models for Kafka/API payloads |
| `src/services/` | Chat stream, Kafka pipeline, Pinecone / Supabase writers |

Project metadata and tooling live in `ai-agents/app/` next to the `src/` package: `pyproject.toml`, `Makefile`, `Dockerfile`.

## Local run

From `ai-agents/app/` after copying `_common/.env.example` → `_common/.env` and filling values:

```bash
uv sync
uv run uvicorn src.main:application --reload --host 0.0.0.0 --port 8080
```

Or from the repository root: `make ai-agents`.

Bind address and port follow `AI_AGENTS_HOST` and `AI_AGENTS_PORT` from the environment (see `_common/.env`).

## Pipeline

1. Browser → NestJS `POST /chat/messages/stream` → proxies streaming tokens from this service (same path).
2. NestJS **also** publishes the journal payload to Kafka (`KAFKA_CHAT_TOPIC`).
3. This service consumes Kafka jobs, validates with `src/schemas/journal_message.py`, runs `src/services/journal_analysis_pipeline.py` (summary → Pinecone upsert → Supabase insert).

See the repository root `README.md` for the end-to-end diagram and SQL for `patient_notes`.
