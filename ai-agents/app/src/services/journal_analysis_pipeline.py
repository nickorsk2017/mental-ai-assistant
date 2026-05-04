"""LangChain + OpenAI analysis for patient journal text; persists to Supabase."""

import logging

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import ValidationError

from src.config import ApplicationSettings
from src.constants import DEFAULT_ACTIVITY_TAGS
from src.prompts.journal_analysis_system_prompt import build_journal_analysis_system_prompt
from src.schemas.journal_message import JournalKafkaPayload
from src.schemas.journal_note_analysis import JournalNoteAnalysis
from src.services.supabase_patient_note_writer import insert_patient_note_row

LOGGER = logging.getLogger(__name__)
SERVICE_UNAVAILABLE_MESSAGE = "Service is unavailable, please contact your doctor."


def process_journal_message_from_kafka(
    payload: JournalKafkaPayload,
    settings: ApplicationSettings,
) -> str:
    """Run analysis and insert a patient note row for the journal job."""
    allowed_activity_tags = resolve_allowed_activity_tags(payload.allowed_activity_tags)
    note_analysis = analyze_journal_with_openai(
        payload.message_text,
        settings,
        allowed_activity_tags,
    )

    if note_analysis is None:
        LOGGER.warning("Journal analysis unavailable correlation=%s", payload.correlation_id)

        return SERVICE_UNAVAILABLE_MESSAGE

    if not note_analysis.should_create_note:
        LOGGER.info("Skipped non-journal chat reply correlation=%s", payload.correlation_id)

        return "Skipped non-journal chat reply."

    insert_patient_note_row(
        settings,
        payload.user_id,
        payload.correlation_id,
        note_analysis.mood_key,
        note_analysis.mood_label,
        note_analysis.mood_score,
        note_analysis.activity_tags,
        note_analysis.summary_text,
    )
    return note_analysis.summary_text


def analyze_journal_with_openai(
    message_text: str,
    settings: ApplicationSettings,
    allowed_activity_tags: list[str],
) -> JournalNoteAnalysis | None:
    """Invoke OpenAI for structured journal fields."""
    if not settings.openai_api_key:
        LOGGER.warning("OPENAI_API_KEY is not set; journal analysis is unavailable.")

        return None

    model = ChatOpenAI(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
    )
    structured_model = model.with_structured_output(JournalNoteAnalysis)
    try:
        response = structured_model.invoke(
            [
                SystemMessage(content=build_journal_analysis_system_prompt(allowed_activity_tags)),
                HumanMessage(content=message_text.strip()),
            ]
        )
    except Exception:
        LOGGER.exception("OpenAI structured journal analysis failed.")

        return None

    if isinstance(response, JournalNoteAnalysis):
        return sanitize_note_analysis_tags(response, allowed_activity_tags)

    return sanitize_note_analysis_tags(
        JournalNoteAnalysis.model_validate(response),
        allowed_activity_tags,
    )


def resolve_allowed_activity_tags(incoming_tags: list[str]) -> list[str]:
    """Use backend-provided tags, falling back to the local copy for older messages."""
    normalized_tags = [tag.strip().lower() for tag in incoming_tags if tag.strip()]

    return list(dict.fromkeys(normalized_tags)) or DEFAULT_ACTIVITY_TAGS


def sanitize_note_analysis_tags(
    note_analysis: JournalNoteAnalysis,
    allowed_activity_tags: list[str],
) -> JournalNoteAnalysis:
    """Drop any model-created tags outside the backend allowlist."""
    allowed_tag_set = set(allowed_activity_tags)
    filtered_tags = [
        tag.strip().lower()
        for tag in note_analysis.activity_tags
        if tag.strip().lower() in allowed_tag_set
    ]
    note_analysis.activity_tags = list(dict.fromkeys(filtered_tags))

    return note_analysis


def safe_parse_kafka_payload(raw_json: str) -> JournalKafkaPayload | None:
    """Parse and validate a Kafka message body. Returns None if validation fails."""
    try:
        return JournalKafkaPayload.model_validate_json(raw_json)
    except ValidationError as validation_error:
        LOGGER.warning("Rejected Kafka message: %s", validation_error.errors())
        return None
