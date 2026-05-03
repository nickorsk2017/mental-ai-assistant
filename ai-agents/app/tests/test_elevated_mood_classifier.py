"""Tests for src.services.elevated_mood_classifier."""

from __future__ import annotations

from collections.abc import Callable
from unittest.mock import MagicMock, patch

from src.config import ApplicationSettings
from src.schemas.elevated_mood_signal import ElevatedMoodSignal
from src.services.elevated_mood_classifier import has_elevated_mood_signal


def test_returns_false_when_openai_key_missing(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(openai_api_key="")
    assert has_elevated_mood_signal("I haven't slept in 3 days!", settings) is False


def test_returns_true_when_model_signals_elevated_mood(
    settings: ApplicationSettings,
) -> None:
    fake_structured = MagicMock()
    fake_structured.invoke.return_value = ElevatedMoodSignal(has_elevated_mood_signal=True)
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.elevated_mood_classifier.ChatOpenAI",
        return_value=fake_model,
    ) as chat_openai_class:
        result = has_elevated_mood_signal("Racing thoughts and zero sleep!", settings)

    assert result is True
    chat_openai_class.assert_called_once_with(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
    )
    fake_model.with_structured_output.assert_called_once_with(ElevatedMoodSignal)


def test_returns_false_when_model_signals_no_elevated_mood(
    settings: ApplicationSettings,
) -> None:
    fake_structured = MagicMock()
    fake_structured.invoke.return_value = ElevatedMoodSignal(has_elevated_mood_signal=False)
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.elevated_mood_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        assert has_elevated_mood_signal("Calm and productive day.", settings) is False


def test_returns_false_when_model_raises(
    settings: ApplicationSettings,
) -> None:
    fake_structured = MagicMock()
    fake_structured.invoke.side_effect = RuntimeError("api error")
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.elevated_mood_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        assert has_elevated_mood_signal("anything", settings) is False


def test_validates_dict_response_from_model(
    settings: ApplicationSettings,
) -> None:
    fake_structured = MagicMock()
    fake_structured.invoke.return_value = {"has_elevated_mood_signal": True}
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.elevated_mood_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        assert has_elevated_mood_signal("text", settings) is True


def test_strips_whitespace_from_input(
    settings: ApplicationSettings,
) -> None:
    captured: dict[str, list] = {}

    def capture(messages):
        captured["messages"] = messages
        return ElevatedMoodSignal(has_elevated_mood_signal=False)

    fake_structured = MagicMock()
    fake_structured.invoke.side_effect = capture
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.elevated_mood_classifier.ChatOpenAI",
        return_value=fake_model,
    ):
        has_elevated_mood_signal("   hello   ", settings)

    human_messages = [m for m in captured["messages"] if type(m).__name__ == "HumanMessage"]
    assert human_messages[0].content == "hello"
