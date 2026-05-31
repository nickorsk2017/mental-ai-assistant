"""LangSmith tracing configuration for LangChain model calls."""

import logging
from typing import Any

import langsmith as langsmith_client

from src.config import ApplicationSettings

LOGGER = logging.getLogger(__name__)
DEFAULT_LANGSMITH_TAGS = ["assistant-ai-agents"]


def configure_langsmith_tracing(settings: ApplicationSettings) -> None:
    """Configure LangSmith from ApplicationSettings instead of raw process environment."""
    if not settings.langsmith_tracing:
        langsmith_client.configure(enabled=False)
        return

    if not settings.langsmith_api_key:
        LOGGER.warning("LANGSMITH_TRACING is enabled but LANGSMITH_API_KEY is missing.")
        langsmith_client.configure(enabled=False)
        return

    client = langsmith_client.Client(
        api_key=settings.langsmith_api_key,
        api_url=settings.langsmith_endpoint,
        workspace_id=settings.langsmith_workspace_id or None,
    )
    langsmith_client.configure(
        client=client,
        enabled=True,
        project_name=settings.langsmith_project,
        tags=DEFAULT_LANGSMITH_TAGS,
    )


def build_langsmith_run_config(operation_name: str) -> dict[str, Any]:
    """Return a LangChain RunnableConfig with stable LangSmith labels."""
    return {
        "run_name": operation_name,
        "tags": [*DEFAULT_LANGSMITH_TAGS, operation_name],
        "metadata": {"operation_name": operation_name},
    }
