"""Background Kafka consumer for journal jobs published by the NestJS API."""

from __future__ import annotations

import logging
import threading

from kafka import KafkaConsumer

from src.config import ApplicationSettings
from src.services.journal_analysis_pipeline import (
    process_journal_message_from_kafka,
    safe_parse_kafka_payload,
)

LOGGER = logging.getLogger(__name__)


def run_kafka_consumer_loop(
    settings: ApplicationSettings,
    shutdown_event: threading.Event,
) -> None:
    """Block until `shutdown_event` is set, processing journal messages from Kafka."""
    broker_list = [item.strip() for item in settings.kafka_brokers.split(",") if item.strip()]

    if not broker_list:
        LOGGER.warning("KAFKA_BROKERS is empty; the Kafka consumer thread exits immediately.")
        return

    consumer = KafkaConsumer(
        settings.kafka_chat_topic,
        bootstrap_servers=broker_list,
        group_id=settings.kafka_consumer_group,
        enable_auto_commit=True,
        value_deserializer=lambda raw: raw.decode("utf-8"),
        consumer_timeout_ms=1000,
    )

    LOGGER.info("Kafka consumer subscribed topic=%s brokers=%s", settings.kafka_chat_topic, broker_list)

    try:
        while not shutdown_event.is_set():
            records = consumer.poll(timeout_ms=1000)

            if shutdown_event.is_set():
                break

            for _partition_key, message_batch in records.items():
                for kafka_message in message_batch:
                    if shutdown_event.is_set():
                        break

                    payload_model = safe_parse_kafka_payload(kafka_message.value)

                    if payload_model is None:
                        continue

                    try:
                        summary_text = process_journal_message_from_kafka(payload_model, settings)
                        LOGGER.info(
                            "Processed journal job correlation=%s preview=%s",
                            payload_model.correlation_id,
                            summary_text[:160],
                        )
                    except Exception:
                        LOGGER.exception(
                            "Journal pipeline failed correlation=%s",
                            getattr(payload_model, "correlation_id", ""),
                        )
    finally:
        consumer.close()
        LOGGER.info("Kafka consumer stopped.")


def start_kafka_consumer_background(settings: ApplicationSettings) -> threading.Event:
    """Start a daemon thread that runs the Kafka consumer when brokers are configured."""
    shutdown_event = threading.Event()
    broker_list = [item.strip() for item in settings.kafka_brokers.split(",") if item.strip()]

    if not broker_list:
        LOGGER.warning("Kafka consumer not started (no KAFKA_BROKERS).")
        return shutdown_event

    worker_thread = threading.Thread(
        target=run_kafka_consumer_loop,
        args=(settings, shutdown_event),
        name="kafka-journal-consumer",
        daemon=True,
    )
    worker_thread.start()
    return shutdown_event


def stop_kafka_consumer_background(shutdown_event: threading.Event) -> None:
    """Signal the Kafka consumer thread to exit."""
    shutdown_event.set()
