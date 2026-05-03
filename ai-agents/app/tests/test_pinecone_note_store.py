"""Tests for src.services.pinecone_note_store."""

from __future__ import annotations

from collections.abc import Callable
from unittest.mock import MagicMock, patch

from src.config import ApplicationSettings
from src.services import pinecone_note_store as pinecone_module
from src.services.pinecone_note_store import upsert_journal_note_vector


def test_upsert_skipped_without_pinecone_api_key(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(pinecone_api_key="")

    with (
        patch.object(pinecone_module, "Pinecone") as pinecone_class,
        patch.object(pinecone_module, "embed_text_for_pinecone") as embed_mock,
    ):
        upsert_journal_note_vector(settings, "c", "u", "combined", "summary")

    pinecone_class.assert_not_called()
    embed_mock.assert_not_called()


def test_upsert_skipped_without_pinecone_index_name(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(pinecone_index_name="")

    with (
        patch.object(pinecone_module, "Pinecone") as pinecone_class,
        patch.object(pinecone_module, "embed_text_for_pinecone") as embed_mock,
    ):
        upsert_journal_note_vector(settings, "c", "u", "combined", "summary")

    pinecone_class.assert_not_called()
    embed_mock.assert_not_called()


def test_upsert_calls_pinecone_with_full_payload(
    settings: ApplicationSettings,
) -> None:
    fake_index = MagicMock()
    fake_pinecone_client = MagicMock()
    fake_pinecone_client.Index.return_value = fake_index

    embedding_vector = [0.1, 0.2, 0.3]

    with (
        patch.object(pinecone_module, "Pinecone", return_value=fake_pinecone_client) as pinecone_class,
        patch.object(pinecone_module, "embed_text_for_pinecone", return_value=embedding_vector) as embed_mock,
    ):
        upsert_journal_note_vector(
            settings,
            "corr-42",
            "user-7",
            "combined text payload",
            "short summary",
        )

    embed_mock.assert_called_once_with("combined text payload", settings)
    pinecone_class.assert_called_once_with(api_key=settings.pinecone_api_key)
    fake_pinecone_client.Index.assert_called_once_with(settings.pinecone_index_name)
    fake_index.upsert.assert_called_once()
    upsert_kwargs = fake_index.upsert.call_args.kwargs
    assert "vectors" in upsert_kwargs
    vectors = upsert_kwargs["vectors"]
    assert len(vectors) == 1
    vector_record = vectors[0]
    assert vector_record["id"] == "corr-42"
    assert vector_record["values"] == embedding_vector
    assert vector_record["metadata"] == {
        "user_id": "user-7",
        "correlation_id": "corr-42",
        "summary_preview": "short summary",
    }


def test_upsert_truncates_summary_preview_to_500_chars(
    settings: ApplicationSettings,
) -> None:
    long_summary = "x" * 1200
    fake_index = MagicMock()
    fake_pinecone_client = MagicMock()
    fake_pinecone_client.Index.return_value = fake_index

    with (
        patch.object(pinecone_module, "Pinecone", return_value=fake_pinecone_client),
        patch.object(pinecone_module, "embed_text_for_pinecone", return_value=[0.0]),
    ):
        upsert_journal_note_vector(settings, "c", "u", "combined", long_summary)

    metadata = fake_index.upsert.call_args.kwargs["vectors"][0]["metadata"]
    assert len(metadata["summary_preview"]) == 500


def test_upsert_returns_silently_when_embedding_fails(
    settings: ApplicationSettings,
) -> None:
    fake_pinecone_client = MagicMock()

    with (
        patch.object(pinecone_module, "Pinecone", return_value=fake_pinecone_client) as pinecone_class,
        patch.object(
            pinecone_module,
            "embed_text_for_pinecone",
            side_effect=RuntimeError("openai down"),
        ),
    ):
        # Must not raise — the pipeline relies on this for resilience.
        upsert_journal_note_vector(settings, "c", "u", "combined", "summary")

    pinecone_class.assert_not_called()
