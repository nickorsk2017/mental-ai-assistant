"""Tests for src.services.chat_stream_service."""

from __future__ import annotations

from collections.abc import Callable
from types import SimpleNamespace
from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from src.config import ApplicationSettings
from src.schemas.chat_stream_request_body import ChatStreamHistoryMessage
from src.schemas.topic_relevance_signal import TopicRelevanceSignal
from src.services.chat_stream_service import (
    build_unconfigured_chat_reply,
    stream_serene_chat_tokens,
)
from src.services.topic_relevance_classifier import DEFAULT_OFF_TOPIC_REPLY_TEXT


def make_async_chunks(*payloads: Any):
    """Return an async-generator factory that yields chunk-shaped objects."""

    async def _astream(_messages):
        for payload in payloads:
            if isinstance(payload, str):
                yield SimpleNamespace(content=payload)
            else:
                yield payload

    return _astream


async def collect_async_iter(async_iterator) -> list[str]:
    return [token async for token in async_iterator]


def patch_topic_classifier_on_topic():
    """Patch the classifier used inside chat_stream_service to always return on-topic."""
    return patch(
        "src.services.chat_stream_service.classify_chat_message_relevance",
        return_value=TopicRelevanceSignal(is_on_topic=True, off_topic_reply_text=""),
    )


def patch_topic_classifier_off_topic(reply_text: str = ""):
    """Patch the classifier to return an off-topic verdict with optional reply text."""
    return patch(
        "src.services.chat_stream_service.classify_chat_message_relevance",
        return_value=TopicRelevanceSignal(
            is_on_topic=False,
            off_topic_reply_text=reply_text,
        ),
    )


def test_build_unconfigured_chat_reply_returns_safe_message() -> None:
    reply = build_unconfigured_chat_reply("anything")

    assert "unavailable" in reply.lower()
    assert "doctor" in reply.lower()


@pytest.mark.asyncio
async def test_stream_returns_safe_reply_when_openai_key_missing(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(openai_api_key="")

    tokens = await collect_async_iter(
        stream_serene_chat_tokens("I had a long day", settings)
    )

    assert tokens == [build_unconfigured_chat_reply("I had a long day")]


@pytest.mark.asyncio
async def test_stream_yields_string_tokens_from_model(
    settings: ApplicationSettings,
) -> None:
    fake_model = MagicMock()
    fake_model.astream = make_async_chunks("Hello", " ", "world")

    with patch_topic_classifier_on_topic(), patch(
        "src.services.chat_stream_service.ChatOpenAI",
        return_value=fake_model,
    ) as chat_openai_class:
        tokens = await collect_async_iter(
            stream_serene_chat_tokens("How are you doing today?", settings)
        )

    assert tokens == ["Hello", " ", "world"]
    chat_openai_class.assert_called_once_with(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
        streaming=True,
    )


@pytest.mark.asyncio
async def test_stream_filters_non_string_and_empty_chunks(
    settings: ApplicationSettings,
) -> None:
    """LangChain may emit list payloads or empty strings; only non-empty strings stream."""
    fake_model = MagicMock()
    fake_model.astream = make_async_chunks(
        "Hi",
        SimpleNamespace(content=""),
        SimpleNamespace(content=["tool_call_token"]),
        "there",
    )

    with patch_topic_classifier_on_topic(), patch(
        "src.services.chat_stream_service.ChatOpenAI",
        return_value=fake_model,
    ):
        tokens = await collect_async_iter(
            stream_serene_chat_tokens("Tell me a joke please.", settings)
        )

    assert tokens == ["Hi", "there"]


@pytest.mark.asyncio
async def test_stream_uses_daily_messages_when_provided(
    settings: ApplicationSettings,
) -> None:
    captured_messages: list[Any] = []

    async def capture_astream(messages):
        captured_messages.extend(messages)
        yield SimpleNamespace(content="ok")

    fake_model = MagicMock()
    fake_model.astream = capture_astream

    with patch_topic_classifier_on_topic(), patch(
        "src.services.chat_stream_service.ChatOpenAI",
        return_value=fake_model,
    ):
        await collect_async_iter(
            stream_serene_chat_tokens(
                "Latest message",
                settings,
                daily_messages=[
                    ChatStreamHistoryMessage(role="user", content="hi"),
                    ChatStreamHistoryMessage(role="assistant", content="hello"),
                    ChatStreamHistoryMessage(role="user", content="how are you"),
                ],
            )
        )

    # SystemMessage(prompt) + 3 history messages = 4
    assert len(captured_messages) == 4
    roles = [type(message).__name__ for message in captured_messages]
    assert roles == ["SystemMessage", "HumanMessage", "AIMessage", "HumanMessage"]
    assert captured_messages[1].content == "hi"
    assert captured_messages[2].content == "hello"
    assert captured_messages[3].content == "how are you"


@pytest.mark.asyncio
async def test_stream_appends_local_date_system_message(
    settings: ApplicationSettings,
) -> None:
    captured_messages: list[Any] = []

    async def capture_astream(messages):
        captured_messages.extend(messages)
        yield SimpleNamespace(content="ok")

    fake_model = MagicMock()
    fake_model.astream = capture_astream

    with patch_topic_classifier_on_topic(), patch(
        "src.services.chat_stream_service.ChatOpenAI",
        return_value=fake_model,
    ):
        await collect_async_iter(
            stream_serene_chat_tokens(
                "I felt tired this morning",
                settings,
                client_local_date="2026-05-03",
                client_time_zone="Europe/Madrid",
            )
        )

    system_messages = [m for m in captured_messages if type(m).__name__ == "SystemMessage"]
    assert len(system_messages) == 2
    assert "2026-05-03" in system_messages[1].content
    assert "Europe/Madrid" in system_messages[1].content


@pytest.mark.asyncio
async def test_stream_strips_message_text_for_default_history(
    settings: ApplicationSettings,
) -> None:
    captured_messages: list[Any] = []

    async def capture_astream(messages):
        captured_messages.extend(messages)
        yield SimpleNamespace(content="ok")

    fake_model = MagicMock()
    fake_model.astream = capture_astream

    with patch_topic_classifier_on_topic(), patch(
        "src.services.chat_stream_service.ChatOpenAI",
        return_value=fake_model,
    ):
        await collect_async_iter(
            stream_serene_chat_tokens("   hello world   ", settings)
        )

    human_messages = [m for m in captured_messages if type(m).__name__ == "HumanMessage"]
    assert human_messages[0].content == "hello world"


@pytest.mark.asyncio
async def test_stream_short_circuits_with_localized_off_topic_reply(
    settings: ApplicationSettings,
) -> None:
    """Off-topic messages must skip the main LLM call and emit the canned reply."""
    fake_model = MagicMock()
    fake_model.astream = make_async_chunks("THIS SHOULD NOT BE STREAMED")

    localized_reply = "Кажется, вы пишете не по теме. Расскажите, как ваше настроение?"

    with patch_topic_classifier_off_topic(localized_reply), patch(
        "src.services.chat_stream_service.ChatOpenAI",
        return_value=fake_model,
    ) as chat_openai_class:
        tokens = await collect_async_iter(
            stream_serene_chat_tokens("asdfghjkl 1234", settings)
        )

    assert tokens == [localized_reply]
    chat_openai_class.assert_not_called()


@pytest.mark.asyncio
async def test_stream_uses_default_off_topic_reply_when_classifier_returns_empty(
    settings: ApplicationSettings,
) -> None:
    """If the classifier marks off-topic but produces no localized text, fall back to the default."""
    fake_model = MagicMock()
    fake_model.astream = make_async_chunks("nope")

    with patch_topic_classifier_off_topic(""), patch(
        "src.services.chat_stream_service.ChatOpenAI",
        return_value=fake_model,
    ) as chat_openai_class:
        tokens = await collect_async_iter(
            stream_serene_chat_tokens("write me python code", settings)
        )

    assert tokens == [DEFAULT_OFF_TOPIC_REPLY_TEXT]
    chat_openai_class.assert_not_called()
