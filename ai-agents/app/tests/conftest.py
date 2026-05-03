"""Shared pytest fixtures for the ai-agents test suite."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any

import pytest

from src.config import ApplicationSettings


@pytest.fixture
def make_settings() -> Callable[..., ApplicationSettings]:
    """Build an ApplicationSettings instance with safe defaults, allowing per-test overrides.

    Default values pretend that every external integration is configured so
    that the unit under test takes the happy path. Tests that need to exercise
    "unconfigured" branches override the relevant fields explicitly.
    """

    def _build(**overrides: Any) -> ApplicationSettings:
        defaults: dict[str, Any] = {
            "openai_api_key": "test-openai-key",
            "openai_chat_model": "gpt-4o-mini",
            "openai_embedding_model": "text-embedding-3-small",
            "kafka_brokers": "localhost:9092",
            "kafka_chat_topic": "serene.chat.requests",
            "kafka_consumer_group": "serene-ai-agents-test",
            "supabase_url": "https://example.supabase.co",
            "supabase_secret_key": "test-supabase-secret",
            "supabase_patient_notes_table": "patient_notes",
            "pinecone_api_key": "test-pinecone-key",
            "pinecone_index_name": "test-index",
        }
        defaults.update(overrides)
        return ApplicationSettings(**defaults)

    return _build


@pytest.fixture
def settings(make_settings: Callable[..., ApplicationSettings]) -> ApplicationSettings:
    """A fully-configured ApplicationSettings instance for happy-path tests."""
    return make_settings()
