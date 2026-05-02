"""FastAPI entrypoint: HTTP API plus optional Kafka consumer lifecycle."""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI

from src.config import load_application_settings
from src.routers.chat import router as chat_router
from src.routers.health import router as health_router
from src.services.kafka_journal_consumer import (
    start_kafka_consumer_background,
    stop_kafka_consumer_background,
)

logging.basicConfig(level=logging.INFO)


def configure_third_party_logging_levels() -> None:
    """kafka-python emits INFO on every coordinator reconnect; join-group retries are normal."""
    logging.getLogger("kafka").setLevel(logging.WARNING)


configure_third_party_logging_levels()


@asynccontextmanager
async def lifespan(fastapi_application: FastAPI):
    """Start background workers when the process boots; stop them on shutdown."""
    settings = load_application_settings()
    shutdown_event = start_kafka_consumer_background(settings)
    fastapi_application.state.kafka_shutdown_event = shutdown_event
    yield
    stop_kafka_consumer_background(shutdown_event)


application = FastAPI(
    title="Serene AI Agents",
    description="FastAPI service for LangChain, OpenAI, and Kafka-driven journal processing.",
    lifespan=lifespan,
)
application.include_router(health_router)
application.include_router(chat_router)


def run_development_server() -> None:
    """Run Uvicorn using settings from the environment (used by local tooling)."""
    import uvicorn

    settings = load_application_settings()
    uvicorn.run(
        "src.main:application",
        host=settings.ai_agents_host,
        port=settings.ai_agents_port,
        reload=True,
    )


if __name__ == "__main__":
    run_development_server()
