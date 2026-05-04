"""Tests for src.services.topic_relevance_classifier."""

from __future__ import annotations

from collections.abc import Callable
from unittest.mock import MagicMock, patch

from src.config import ApplicationSettings
from src.schemas.topic_relevance_signal import TopicRelevanceSignal
from src.services.topic_relevance_classifier import (
    classify_chat_message_relevance,
    is_chat_message_on_topic,
)


def _build_fake_model(structured_response: object) -> MagicMock:
    fake_structured = MagicMock()
    fake_structured.invoke.return_value = structured_response
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured
    return fake_model


def test_returns_on_topic_when_openai_key_missing(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(openai_api_key="")
    signal = classify_chat_message_relevance("asdfghjkl", settings)
    assert signal.is_on_topic is True
    assert signal.off_topic_reply_text == ""


def test_returns_on_topic_for_blank_input(
    settings: ApplicationSettings,
) -> None:
    signal = classify_chat_message_relevance("   ", settings)
    assert signal.is_on_topic is True
    assert signal.off_topic_reply_text == ""


def test_returns_off_topic_when_model_signals_off_topic(
    settings: ApplicationSettings,
) -> None:
    fake_model = _build_fake_model(
        TopicRelevanceSignal(
            is_on_topic=False,
            off_topic_reply_text="Кажется, вы пишете не по теме. Расскажите, как ваше настроение?",
        )
    )

    with patch(
        "src.services.topic_relevance_classifier.ChatOpenAI",
        return_value=fake_model,
    ) as chat_openai_class:
        signal = classify_chat_message_relevance("asdfghjkl 1234", settings)

    assert signal.is_on_topic is False
    assert "не по теме" in signal.off_topic_reply_text
    chat_openai_class.assert_called_once_with(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
    )
    fake_model.with_structured_output.assert_called_once_with(TopicRelevanceSignal)


def test_returns_on_topic_for_wellness_message(
    settings: ApplicationSettings,
) -> None:
    fake_model = _build_fake_model(
        TopicRelevanceSignal(is_on_topic=True, off_topic_reply_text="")
    )

    with patch(
        "src.services.topic_relevance_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        signal = classify_chat_message_relevance(
            "Сегодня очень тревожно, плохо спал, оценка настроения 4.",
            settings,
        )

    assert signal.is_on_topic is True
    assert signal.off_topic_reply_text == ""


def test_fails_open_when_model_raises(
    settings: ApplicationSettings,
) -> None:
    fake_structured = MagicMock()
    fake_structured.invoke.side_effect = RuntimeError("openai outage")
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.topic_relevance_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        signal = classify_chat_message_relevance("anything", settings)

    # Fail-open: classifier outage must not block the chat or note pipeline.
    assert signal.is_on_topic is True
    assert signal.off_topic_reply_text == ""


def test_validates_dict_response_from_model(
    settings: ApplicationSettings,
) -> None:
    fake_model = _build_fake_model(
        {"is_on_topic": False, "off_topic_reply_text": "Off-topic, please share how you feel."}
    )

    with patch(
        "src.services.topic_relevance_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        signal = classify_chat_message_relevance("write me python code", settings)

    assert signal.is_on_topic is False
    assert "Off-topic" in signal.off_topic_reply_text


def test_strips_whitespace_from_input(
    settings: ApplicationSettings,
) -> None:
    captured: dict[str, list] = {}

    def capture(messages):
        captured["messages"] = messages
        return TopicRelevanceSignal(is_on_topic=True, off_topic_reply_text="")

    fake_structured = MagicMock()
    fake_structured.invoke.side_effect = capture
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.topic_relevance_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        classify_chat_message_relevance("   I feel calm today.   ", settings)

    human_messages = [m for m in captured["messages"] if type(m).__name__ == "HumanMessage"]
    assert human_messages[0].content == "I feel calm today."


def test_boolean_helper_returns_true_for_on_topic(
    settings: ApplicationSettings,
) -> None:
    fake_model = _build_fake_model(
        TopicRelevanceSignal(is_on_topic=True, off_topic_reply_text="")
    )

    with patch(
        "src.services.topic_relevance_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        assert is_chat_message_on_topic("My mood is 7 today.", settings) is True


def test_boolean_helper_returns_false_for_off_topic(
    settings: ApplicationSettings,
) -> None:
    fake_model = _build_fake_model(
        TopicRelevanceSignal(
            is_on_topic=False,
            off_topic_reply_text="This chat is for tracking your mood.",
        )
    )

    with patch(
        "src.services.topic_relevance_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        assert is_chat_message_on_topic("what is the capital of France", settings) is False
