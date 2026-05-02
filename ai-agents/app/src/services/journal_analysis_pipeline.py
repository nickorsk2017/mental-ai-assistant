"""LangChain + OpenAI analysis for patient journal text; persists to Pinecone and Supabase."""

import logging

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import ValidationError

from src.config import ApplicationSettings
from src.prompts.journal_analysis_system_prompt import JOURNAL_ANALYSIS_SYSTEM_PROMPT
from src.schemas.journal_message import JournalKafkaPayload
from src.schemas.journal_note_analysis import JournalNoteAnalysis
from src.services.journal_analysis_fallback import build_fallback_journal_analysis
from src.services.pinecone_note_store import upsert_journal_note_vector
from src.services.supabase_patient_note_writer import insert_patient_note_row

LOGGER = logging.getLogger(__name__)


def process_journal_message_from_kafka(
    payload: JournalKafkaPayload,
    settings: ApplicationSettings,
) -> str:
    """Run analysis, upsert vector metadata, and insert a note row for the journal job."""
    note_analysis = analyze_journal_with_openai(payload.message_text, settings)
    combined_text = (
        f"{payload.message_text.strip()}\n\n"
        f"Mood: {note_analysis.mood_label or note_analysis.mood_key or 'unknown'}\n"
        f"Tags: {', '.join(note_analysis.activity_tags)}\n"
        f"Summary:\n{note_analysis.summary_text}"
    )

    upsert_journal_note_vector(
        settings,
        payload.correlation_id,
        payload.user_id,
        combined_text,
        note_analysis.summary_text,
    )
    insert_patient_note_row(
        settings,
        payload.user_id,
        payload.correlation_id,
        payload.message_text,
        note_analysis.mood_key,
        note_analysis.mood_label,
        note_analysis.mood_score,
        note_analysis.activity_tags,
        note_analysis.summary_text,
        note_analysis.assistant_vibe_check,
    )
    return note_analysis.summary_text


def analyze_journal_with_openai(
    message_text: str,
    settings: ApplicationSettings,
) -> JournalNoteAnalysis:
    """Invoke OpenAI for structured journal fields."""
    if not settings.openai_api_key:
        LOGGER.warning("OPENAI_API_KEY is not set; skipping the model call.")
        return build_fallback_journal_analysis(message_text)

    model = ChatOpenAI(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
    )
    structured_model = model.with_structured_output(JournalNoteAnalysis)
    try:
        response = structured_model.invoke(
            [
                SystemMessage(content=JOURNAL_ANALYSIS_SYSTEM_PROMPT),
                HumanMessage(content=message_text.strip()),
            ]
        )
    except Exception:
        LOGGER.exception("OpenAI structured journal analysis failed.")
        return build_fallback_journal_analysis(message_text)

    if isinstance(response, JournalNoteAnalysis):
        return response

    return JournalNoteAnalysis.model_validate(response)


def safe_parse_kafka_payload(raw_json: str) -> JournalKafkaPayload | None:
    """Parse and validate a Kafka message body. Returns None if validation fails."""
    try:
        return JournalKafkaPayload.model_validate_json(raw_json)
    except ValidationError as validation_error:
        LOGGER.warning("Rejected Kafka message: %s", validation_error.errors())
        return None
