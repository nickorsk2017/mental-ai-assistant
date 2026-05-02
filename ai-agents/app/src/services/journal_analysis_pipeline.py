"""LangChain + OpenAI analysis for patient journal text; persists to Pinecone and Supabase."""

import logging

from langchain_core.messages import HumanMessage
from langchain_openai import ChatOpenAI
from pydantic import ValidationError

from src.config import ApplicationSettings
from src.schemas.journal_message import JournalKafkaPayload
from src.services.pinecone_note_store import upsert_journal_note_vector
from src.services.supabase_patient_note_writer import insert_patient_note_row

LOGGER = logging.getLogger(__name__)


def process_journal_message_from_kafka(
    payload: JournalKafkaPayload,
    settings: ApplicationSettings,
) -> str:
    """Run analysis, upsert vector metadata, and insert a note row for the journal job."""
    summary_text = analyze_journal_with_openai(payload.message_text, settings)
    combined_text = f"{payload.message_text.strip()}\n\nSummary:\n{summary_text}"

    upsert_journal_note_vector(
        settings,
        payload.correlation_id,
        payload.user_id,
        combined_text,
        summary_text,
    )
    insert_patient_note_row(
        settings,
        payload.user_id,
        payload.correlation_id,
        payload.message_text,
        summary_text,
    )
    return summary_text


def analyze_journal_with_openai(message_text: str, settings: ApplicationSettings) -> str:
    """Invoke OpenAI for a short storage-oriented summary (Kafka path, not the live chat prompt)."""
    if not settings.openai_api_key:
        LOGGER.warning("OPENAI_API_KEY is not set; skipping the model call.")
        return "Model call skipped: configure OPENAI_API_KEY."

    model = ChatOpenAI(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
    )
    prompt = (
        "The user described their day and emotional state. "
        "Reply with a very short, calm summary (2–3 sentences) for storage alongside the journal. "
        "Do not give medical advice.\n\n"
        f"User message:\n{message_text}"
    )
    response = model.invoke([HumanMessage(content=prompt)])
    content = response.content if hasattr(response, "content") else str(response)
    return content if isinstance(content, str) else str(content)


def safe_parse_kafka_payload(raw_json: str) -> JournalKafkaPayload | None:
    """Parse and validate a Kafka message body. Returns None if validation fails."""
    try:
        return JournalKafkaPayload.model_validate_json(raw_json)
    except ValidationError as validation_error:
        LOGGER.warning("Rejected Kafka message: %s", validation_error.errors())
        return None
