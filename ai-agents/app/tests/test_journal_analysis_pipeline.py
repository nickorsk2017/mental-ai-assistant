"""Tests for src.services.journal_analysis_pipeline."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any
from unittest.mock import MagicMock, patch

import pytest

from src.config import ApplicationSettings
from src.constants import DEFAULT_ACTIVITY_TAGS
from src.schemas.journal_message import JournalKafkaPayload
from src.schemas.journal_note_analysis import JournalNoteAnalysis
from src.services import journal_analysis_pipeline as pipeline_module
from src.services.journal_analysis_pipeline import (
    SERVICE_UNAVAILABLE_MESSAGE,
    analyze_journal_with_openai,
    process_journal_message_from_kafka,
    resolve_allowed_activity_tags,
    safe_parse_kafka_payload,
    sanitize_note_analysis_tags,
    upsert_journal_note_vector_safely,
)


def make_payload(**overrides: Any) -> JournalKafkaPayload:
    base: dict[str, Any] = {
        "correlation_id": "corr-1",
        "user_id": "user-1",
        "message_text": "Today I went to the gym and felt energized.",
        "allowed_activity_tags": ["work", "fitness", "sleep"],
        "requested_at": "2026-05-03T12:00:00Z",
    }
    base.update(overrides)
    return JournalKafkaPayload(**base)


def make_analysis(**overrides: Any) -> JournalNoteAnalysis:
    base: dict[str, Any] = {
        "should_create_note": True,
        "mood_key": "calm",
        "mood_label": "Calm",
        "mood_score": 7,
        "activity_tags": ["fitness"],
        "summary_text": "User exercised and felt energized.",
        "assistant_vibe_check": "Sounds like a positive day.",
    }
    base.update(overrides)
    return JournalNoteAnalysis(**base)


# ─── resolve_allowed_activity_tags ────────────────────────────────────────────

def test_resolve_allowed_activity_tags_normalizes_and_dedupes() -> None:
    result = resolve_allowed_activity_tags(["Work", " WORK ", "fitness", ""])
    assert result == ["work", "fitness"]


def test_resolve_allowed_activity_tags_falls_back_to_defaults_when_empty() -> None:
    assert resolve_allowed_activity_tags([]) == DEFAULT_ACTIVITY_TAGS
    assert resolve_allowed_activity_tags(["", "  "]) == DEFAULT_ACTIVITY_TAGS


# ─── sanitize_note_analysis_tags ──────────────────────────────────────────────

def test_sanitize_note_analysis_tags_drops_unknown_and_dedupes() -> None:
    analysis = make_analysis(activity_tags=["fitness", "FITNESS", "junk", "work"])
    result = sanitize_note_analysis_tags(analysis, ["fitness", "work"])
    assert result.activity_tags == ["fitness", "work"]


def test_sanitize_note_analysis_tags_returns_empty_when_no_match() -> None:
    analysis = make_analysis(activity_tags=["nonsense", "other"])
    result = sanitize_note_analysis_tags(analysis, ["fitness"])
    assert result.activity_tags == []


# ─── safe_parse_kafka_payload ─────────────────────────────────────────────────

def test_safe_parse_kafka_payload_accepts_camel_case_json() -> None:
    raw = (
        '{"correlationId":"c","userId":"u","messageText":"m",'
        '"allowedActivityTags":["work"],"requestedAt":"2026-05-03T00:00:00Z"}'
    )
    parsed = safe_parse_kafka_payload(raw)
    assert parsed is not None
    assert parsed.correlation_id == "c"
    assert parsed.allowed_activity_tags == ["work"]


def test_safe_parse_kafka_payload_returns_none_for_invalid_json() -> None:
    assert safe_parse_kafka_payload("{not json}") is None


def test_safe_parse_kafka_payload_returns_none_for_missing_fields() -> None:
    assert safe_parse_kafka_payload('{"correlationId":"c"}') is None


# ─── analyze_journal_with_openai ──────────────────────────────────────────────

def test_analyze_journal_returns_none_without_openai_key(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(openai_api_key="")
    assert analyze_journal_with_openai("text", settings, ["work"]) is None


def test_analyze_journal_invokes_structured_model_and_filters_tags(
    settings: ApplicationSettings,
) -> None:
    raw_analysis = make_analysis(activity_tags=["fitness", "junk", "work"])

    fake_structured = MagicMock()
    fake_structured.invoke.return_value = raw_analysis
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.journal_analysis_pipeline.ChatOpenAI",
        return_value=fake_model,
    ) as chat_openai_class:
        result = analyze_journal_with_openai(
            "I went to the gym",
            settings,
            ["fitness", "work"],
        )

    assert result is not None
    assert result.activity_tags == ["fitness", "work"]
    chat_openai_class.assert_called_once_with(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
    )
    fake_model.with_structured_output.assert_called_once_with(JournalNoteAnalysis)
    fake_structured.invoke.assert_called_once()


def test_analyze_journal_returns_none_when_model_raises(
    settings: ApplicationSettings,
) -> None:
    fake_structured = MagicMock()
    fake_structured.invoke.side_effect = RuntimeError("api error")
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.journal_analysis_pipeline.ChatOpenAI",
        return_value=fake_model,
    ):
        assert analyze_journal_with_openai("x", settings, ["work"]) is None


def test_analyze_journal_validates_dict_response(
    settings: ApplicationSettings,
) -> None:
    fake_structured = MagicMock()
    fake_structured.invoke.return_value = {
        "should_create_note": True,
        "mood_key": "calm",
        "mood_label": "Calm",
        "mood_score": 6,
        "activity_tags": ["work"],
        "summary_text": "Productive day.",
        "assistant_vibe_check": "Solid.",
    }
    fake_model = MagicMock()
    fake_model.with_structured_output.return_value = fake_structured

    with patch(
        "src.services.journal_analysis_pipeline.ChatOpenAI",
        return_value=fake_model,
    ):
        result = analyze_journal_with_openai("x", settings, ["work"])

    assert result is not None
    assert result.summary_text == "Productive day."
    assert result.activity_tags == ["work"]


# ─── upsert_journal_note_vector_safely ────────────────────────────────────────

def test_upsert_safely_swallows_exceptions(
    settings: ApplicationSettings,
) -> None:
    with patch(
        "src.services.journal_analysis_pipeline.upsert_journal_note_vector",
        side_effect=RuntimeError("pinecone down"),
    ) as upsert_mock:
        # Should NOT raise; the pipeline must be resilient to vector-store failures.
        upsert_journal_note_vector_safely(
            settings, "corr-1", "user-1", "combined", "summary"
        )
    upsert_mock.assert_called_once()


# ─── process_journal_message_from_kafka ───────────────────────────────────────

def test_process_journal_message_returns_unavailable_when_analysis_none(
    settings: ApplicationSettings,
) -> None:
    payload = make_payload()
    with patch.object(pipeline_module, "analyze_journal_with_openai", return_value=None):
        result = process_journal_message_from_kafka(payload, settings)
    assert result == SERVICE_UNAVAILABLE_MESSAGE


def test_process_journal_message_skips_when_should_create_note_false(
    settings: ApplicationSettings,
) -> None:
    payload = make_payload()
    analysis = make_analysis(should_create_note=False)
    with (
        patch.object(pipeline_module, "analyze_journal_with_openai", return_value=analysis),
        patch.object(pipeline_module, "insert_patient_note_row") as insert_mock,
        patch.object(pipeline_module, "upsert_journal_note_vector_safely") as upsert_mock,
    ):
        result = process_journal_message_from_kafka(payload, settings)

    assert "Skipped" in result
    insert_mock.assert_not_called()
    upsert_mock.assert_not_called()


def test_process_journal_message_persists_note_and_vector_on_happy_path(
    settings: ApplicationSettings,
) -> None:
    payload = make_payload()
    analysis = make_analysis(
        mood_key="calm",
        mood_label="Calm",
        mood_score=7,
        activity_tags=["fitness"],
        summary_text="User exercised and felt energized.",
    )

    with (
        patch.object(pipeline_module, "analyze_journal_with_openai", return_value=analysis),
        patch.object(pipeline_module, "insert_patient_note_row") as insert_mock,
        patch.object(pipeline_module, "upsert_journal_note_vector_safely") as upsert_mock,
    ):
        result = process_journal_message_from_kafka(payload, settings)

    assert result == "User exercised and felt energized."

    insert_mock.assert_called_once_with(
        settings,
        payload.user_id,
        payload.correlation_id,
        "calm",
        "Calm",
        7,
        ["fitness"],
        "User exercised and felt energized.",
    )

    upsert_mock.assert_called_once()
    upsert_args = upsert_mock.call_args.args
    assert upsert_args[0] is settings
    assert upsert_args[1] == payload.correlation_id
    assert upsert_args[2] == payload.user_id
    combined_text = upsert_args[3]
    summary_for_vector = upsert_args[4]
    assert payload.message_text.strip() in combined_text
    assert "Mood: Calm" in combined_text
    assert "Tags: fitness" in combined_text
    assert "Summary:" in combined_text
    assert summary_for_vector == "User exercised and felt energized."


def test_process_journal_message_uses_mood_key_when_label_missing(
    settings: ApplicationSettings,
) -> None:
    payload = make_payload()
    analysis = make_analysis(mood_label=None, mood_key="calm")

    with (
        patch.object(pipeline_module, "analyze_journal_with_openai", return_value=analysis),
        patch.object(pipeline_module, "insert_patient_note_row"),
        patch.object(pipeline_module, "upsert_journal_note_vector_safely") as upsert_mock,
    ):
        process_journal_message_from_kafka(payload, settings)

    combined_text = upsert_mock.call_args.args[3]
    assert "Mood: calm" in combined_text


def test_process_journal_message_falls_back_to_unknown_mood(
    settings: ApplicationSettings,
) -> None:
    payload = make_payload()
    analysis = make_analysis(mood_label=None, mood_key=None)

    with (
        patch.object(pipeline_module, "analyze_journal_with_openai", return_value=analysis),
        patch.object(pipeline_module, "insert_patient_note_row"),
        patch.object(pipeline_module, "upsert_journal_note_vector_safely") as upsert_mock,
    ):
        process_journal_message_from_kafka(payload, settings)

    combined_text = upsert_mock.call_args.args[3]
    assert "Mood: unknown" in combined_text


def test_process_journal_message_uses_default_tags_when_payload_empty(
    settings: ApplicationSettings,
) -> None:
    payload = make_payload(allowed_activity_tags=[])
    analysis = make_analysis()

    captured_tags: list[list[str]] = []

    def capture_analyze(_text, _settings, allowed_tags):
        captured_tags.append(allowed_tags)
        return analysis

    with (
        patch.object(pipeline_module, "analyze_journal_with_openai", side_effect=capture_analyze),
        patch.object(pipeline_module, "insert_patient_note_row"),
        patch.object(pipeline_module, "upsert_journal_note_vector_safely"),
    ):
        process_journal_message_from_kafka(payload, settings)

    assert captured_tags == [DEFAULT_ACTIVITY_TAGS]


@pytest.mark.parametrize("raises", [RuntimeError("db down")])
def test_process_journal_message_propagates_supabase_failure(
    settings: ApplicationSettings,
    raises: Exception,
) -> None:
    """If the note-insert raises, the consumer's outer except handles it.

    We assert here that the pipeline does NOT silently swallow database failures.
    """
    payload = make_payload()
    analysis = make_analysis()

    with (
        patch.object(pipeline_module, "analyze_journal_with_openai", return_value=analysis),
        patch.object(pipeline_module, "insert_patient_note_row", side_effect=raises),
        patch.object(pipeline_module, "upsert_journal_note_vector_safely") as upsert_mock,
        pytest.raises(RuntimeError),
    ):
        process_journal_message_from_kafka(payload, settings)

    # Vector upsert is only attempted after insert succeeds.
    upsert_mock.assert_not_called()
