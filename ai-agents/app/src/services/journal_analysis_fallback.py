"""Conservative fallback for journal analysis when structured output fails."""

import re

from src.schemas.journal_note_analysis import JournalNoteAnalysis
from src.services.journal_analysis_rules import ACTIVITY_TAG_TRANSLATIONS


def build_fallback_journal_analysis(
    message_text: str,
    elevated_mood_signal: bool = False,
) -> JournalNoteAnalysis:
    """Fill basic note fields when the model is unavailable."""
    lowered_message = message_text.lower()
    should_create_note = should_create_fallback_note(lowered_message)
    activity_tags = extract_activity_tags(lowered_message)
    mood_key, mood_label, mood_score, assistant_vibe_check = resolve_fallback_mood(
        lowered_message,
        elevated_mood_signal,
    )

    return JournalNoteAnalysis(
        should_create_note=should_create_note,
        mood_key=mood_key,
        mood_label=mood_label,
        mood_score=mood_score,
        activity_tags=activity_tags,
        summary_text=build_fallback_summary_text(message_text),
        assistant_vibe_check=assistant_vibe_check,
    )


def should_create_fallback_note(lowered_message: str) -> bool:
    """Reject conversational replies that do not describe patient state."""
    cleaned_message = lowered_message.strip(" .,!?:;")
    simple_replies = {
        "okay",
        "ok",
        "thanks",
        "thank you",
        "got it",
        "yes",
    }

    if cleaned_message in simple_replies:
        return False

    non_note_markers = ["i will try", "i will do it", "i will write later"]

    if any(marker in cleaned_message for marker in non_note_markers) and len(cleaned_message) < 80:
        return False

    note_markers = [
        "today",
        "feel",
        "mood",
        "score",
        "rating",
        "pain",
        "tired",
        "work",
        "boss",
        "stress",
        "sleep",
        "insomnia",
        "anxious",
        "depressed",
    ]

    return any(marker in cleaned_message for marker in note_markers) or len(cleaned_message) >= 80


def resolve_fallback_mood(
    lowered_message: str,
    elevated_mood_signal: bool,
) -> tuple[str, str, int, str]:
    """Resolve obvious mood signals without model access."""
    if has_crisis_signal(lowered_message):
        return (
            "crisis",
            "Crisis",
            1,
            "This sounds very serious. If there is any risk of harm, contact local emergency "
            "services or someone nearby right now.",
        )

    if elevated_mood_signal:
        return (
            "euphoric",
            "Elevated",
            9,
            "Note saved. If this high energy includes little sleep or impulsive behavior, "
            "slow down and consider contacting a trusted person or clinician.",
        )

    if any(word in lowered_message for word in ["pain", "headache", "tired", "insomnia"]):
        return ("unwell", "Unwell", 4, "Note saved. A small pause and basic care may help right now.")

    if any(word in lowered_message for word in ["anxiety", "anxious"]):
        return ("anxious", "Anxious", 4, "Note saved. Try slowing down and taking one small step.")

    return ("neutral", "Neutral", 6, "Note saved. This sounds closer to a stable state right now.")


def extract_activity_tags(lowered_message: str) -> list[str]:
    """Extract explicit tags and obvious contextual tags from a message."""
    tag_values: list[str] = []
    tag_match = re.search(r"tags\s*[:：-]?\s*(.+)$", lowered_message)

    if tag_match:
        raw_tag_values = re.split(r"[,;]+|\s+and\s+", tag_match.group(1))
        tag_values.extend(filter(None, [normalize_activity_tag(value) for value in raw_tag_values]))

    for source_value, normalized_tag in ACTIVITY_TAG_TRANSLATIONS.items():
        if source_value in lowered_message:
            tag_values.append(normalized_tag)

    return list(dict.fromkeys(tag_values))


def has_crisis_signal(lowered_message: str) -> bool:
    """Detect obvious crisis wording for a conservative fallback score."""
    crisis_markers = ["kill myself", "suicide", "self harm", "end my life"]

    return any(marker in lowered_message for marker in crisis_markers)


def build_fallback_summary_text(message_text: str) -> str:
    """Build a concise first-person journal note without model access."""
    cleaned_message = re.sub(r"tags\s*[:：-]?\s*.+$", "", message_text, flags=re.IGNORECASE).strip()
    cleaned_message = cleaned_message.strip(" .,!?:;")

    if not cleaned_message:
        return "Today I left a short note about my state."

    if cleaned_message.lower().startswith("today"):
        return f"{cleaned_message[:1].upper()}{cleaned_message[1:]}."

    return f"Today I noted: {cleaned_message[:1].lower()}{cleaned_message[1:]}."


def normalize_activity_tag(raw_tag_value: str) -> str | None:
    """Normalize user-facing tags to canonical storage tags."""
    cleaned_tag_value = raw_tag_value.strip(" .!?,;:()[]{}\"'")

    if not cleaned_tag_value:
        return None

    return ACTIVITY_TAG_TRANSLATIONS.get(cleaned_tag_value, cleaned_tag_value.replace(" ", "_"))
