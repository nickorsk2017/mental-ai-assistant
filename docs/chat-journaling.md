# Chat streaming and journaling

End-to-end flow for patient chat, asynchronous journaling, and AI-side processing.

## Overview

1. **Clients** (`frontend/web`, `frontend/mobile`) send chat traffic through the **NestJS API** (`backend/app`).
2. The API **proxies streaming chat** to **AI agents** (`AI_AGENTS_BASE_URL`) for token streaming to the client.
3. The API **publishes journal payloads** to **Kafka** (`KAFKA_BROKERS`, `KAFKA_CHAT_TOPIC`) for asynchronous work.
4. **AI agents** run a **Kafka consumer** that processes messages into structured **Supabase** patient notes (OpenAI-assisted analysis).

Configure brokers and URLs in **`_common/.env`** (see **`_common/.env.example`**).

## Key environment variables

| Variable | Role |
|----------|------|
| `AI_AGENTS_BASE_URL` | NestJS → FastAPI base URL for streaming chat |
| `KAFKA_BROKERS` | Host uses `127.0.0.1:9092`; in Docker Compose the API and workers use the internal listener (`kafka:29092`) |
| `KAFKA_CHAT_TOPIC` | Topic for journal/chat payloads consumed by Python |
| `KAFKA_CONSUMER_GROUP` | Consumer group id for the ai-agents consumer |
| `SUPABASE_*` | Database and service role access for patient notes and related tables |
| `SUPABASE_PATIENT_NOTES_TABLE` | Target table for async note writes |
| `OPENAI_*` | Chat model for streaming and structured journal analysis |

## Local Kafka

Use **`make kafka-install`** (starts the `kafka` service from **`docker-compose.yml`**) before flows that require the broker. Targets **`make fullstack-web`**, **`make fullstack-mobile`**, and **`make start-all`** invoke **`make kafka-install`** first.

## Schema

SQL migrations under **`_common/migrations/`** define tables used by journaling and notes.

**You must run migrations** before the stack can persist chat or notes correctly:

```bash
make supabase-migrate
```

Requires **`SUPABASE_DB_URL`** or **`SUPABASE_MIGRATE_DB_URL`** (and related Supabase keys) in **`_common/.env`**. Run once per new database or clone, and again whenever new migration files are added upstream.

## Related code (starting points)

| Area | Location |
|------|----------|
| API chat proxy / Kafka publish | `backend/app/src/chat/` |
| Kafka producer wiring | `backend/app/src/providers/kafka/` |
| AI agents HTTP + consumers | `ai-agents/app/src/` |

For repository layout and run commands, see **[`README.md`](../README.md)**.
