"""Tests for src.services.kafka_journal_consumer."""

from __future__ import annotations

import threading
from collections.abc import Callable
from unittest.mock import MagicMock, patch

from kafka.errors import KafkaError

from src.config import ApplicationSettings
from src.services import kafka_journal_consumer as consumer_module
from src.services.kafka_journal_consumer import (
    run_kafka_consumer_loop,
    start_kafka_consumer_background,
    stop_kafka_consumer_background,
)


# ─── start / stop helpers ─────────────────────────────────────────────────────

def test_start_kafka_consumer_does_not_spawn_thread_without_brokers(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(kafka_brokers="")

    with patch("threading.Thread") as thread_class:
        event = start_kafka_consumer_background(settings)

    thread_class.assert_not_called()
    assert isinstance(event, threading.Event)
    assert not event.is_set()


def test_start_kafka_consumer_spawns_daemon_thread_when_configured(
    settings: ApplicationSettings,
) -> None:
    fake_thread = MagicMock()

    with patch("threading.Thread", return_value=fake_thread) as thread_class:
        event = start_kafka_consumer_background(settings)

    thread_class.assert_called_once()
    kwargs = thread_class.call_args.kwargs
    assert kwargs["target"] is run_kafka_consumer_loop
    assert kwargs["daemon"] is True
    assert kwargs["name"] == "kafka-journal-consumer"
    assert kwargs["args"] == (settings, event)
    fake_thread.start.assert_called_once()


def test_stop_kafka_consumer_sets_event() -> None:
    event = threading.Event()
    assert not event.is_set()
    stop_kafka_consumer_background(event)
    assert event.is_set()


# ─── run_kafka_consumer_loop ──────────────────────────────────────────────────

def test_run_loop_exits_immediately_when_brokers_empty(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(kafka_brokers="   ,  ")
    event = threading.Event()

    with patch.object(consumer_module, "build_kafka_consumer") as build_mock:
        run_kafka_consumer_loop(settings, event)

    build_mock.assert_not_called()


def test_run_loop_exits_when_shutdown_event_already_set(
    settings: ApplicationSettings,
) -> None:
    event = threading.Event()
    event.set()

    with patch.object(consumer_module, "build_kafka_consumer") as build_mock:
        run_kafka_consumer_loop(settings, event)

    build_mock.assert_not_called()


def test_run_loop_processes_valid_message_and_calls_pipeline(
    settings: ApplicationSettings,
) -> None:
    event = threading.Event()

    valid_json = (
        '{"correlationId":"c-1","userId":"u-1","messageText":"m-1",'
        '"allowedActivityTags":["work"],"requestedAt":"2026-05-03T00:00:00Z"}'
    )
    fake_message = MagicMock(value=valid_json)
    fake_consumer = MagicMock()

    poll_calls: list[int] = []

    def fake_poll(timeout_ms: int):
        poll_calls.append(timeout_ms)
        if len(poll_calls) == 1:
            return {"partition-0": [fake_message]}
        # Stop the loop on the second poll.
        event.set()
        return {}

    fake_consumer.poll.side_effect = fake_poll

    with (
        patch.object(consumer_module, "build_kafka_consumer", return_value=fake_consumer) as build_mock,
        patch.object(
            consumer_module,
            "process_journal_message_from_kafka",
            return_value="summary preview",
        ) as process_mock,
    ):
        run_kafka_consumer_loop(settings, event)

    build_mock.assert_called_once()
    process_mock.assert_called_once()
    payload_arg = process_mock.call_args.args[0]
    assert payload_arg.correlation_id == "c-1"
    fake_consumer.close.assert_called_once()


def test_run_loop_skips_invalid_payload_without_calling_pipeline(
    settings: ApplicationSettings,
) -> None:
    event = threading.Event()
    fake_message = MagicMock(value="{not json}")
    fake_consumer = MagicMock()

    poll_calls: list[int] = []

    def fake_poll(timeout_ms: int):
        poll_calls.append(timeout_ms)
        if len(poll_calls) == 1:
            return {"partition-0": [fake_message]}
        event.set()
        return {}

    fake_consumer.poll.side_effect = fake_poll

    with (
        patch.object(consumer_module, "build_kafka_consumer", return_value=fake_consumer),
        patch.object(consumer_module, "process_journal_message_from_kafka") as process_mock,
    ):
        run_kafka_consumer_loop(settings, event)

    process_mock.assert_not_called()
    fake_consumer.close.assert_called_once()


def test_run_loop_keeps_running_when_pipeline_raises(
    settings: ApplicationSettings,
) -> None:
    """A pipeline exception for one message must not crash the consumer thread."""
    event = threading.Event()

    valid_json = (
        '{"correlationId":"c-1","userId":"u-1","messageText":"m-1",'
        '"allowedActivityTags":["work"],"requestedAt":"2026-05-03T00:00:00Z"}'
    )
    fake_message = MagicMock(value=valid_json)
    fake_consumer = MagicMock()

    poll_calls: list[int] = []

    def fake_poll(timeout_ms: int):
        poll_calls.append(timeout_ms)
        if len(poll_calls) == 1:
            return {"partition-0": [fake_message]}
        event.set()
        return {}

    fake_consumer.poll.side_effect = fake_poll

    with (
        patch.object(consumer_module, "build_kafka_consumer", return_value=fake_consumer),
        patch.object(
            consumer_module,
            "process_journal_message_from_kafka",
            side_effect=RuntimeError("pipeline boom"),
        ) as process_mock,
    ):
        run_kafka_consumer_loop(settings, event)

    process_mock.assert_called_once()
    fake_consumer.close.assert_called_once()


def test_run_loop_retries_after_kafka_error(
    settings: ApplicationSettings,
) -> None:
    event = threading.Event()

    call_count = {"value": 0}

    def fake_build(_settings, _brokers):
        call_count["value"] += 1
        if call_count["value"] == 1:
            raise KafkaError("connection refused")
        # Second iteration: trip the shutdown immediately.
        event.set()
        consumer = MagicMock()
        consumer.poll.return_value = {}
        return consumer

    with (
        patch.object(consumer_module, "build_kafka_consumer", side_effect=fake_build),
        patch.object(consumer_module, "time") as time_mock,
    ):
        run_kafka_consumer_loop(settings, event)

    assert call_count["value"] >= 1
    time_mock.sleep.assert_called()
