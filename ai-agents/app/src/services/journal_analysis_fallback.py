"""Deterministic fallback for journal analysis when the model is unavailable."""

import re

from src.schemas.journal_note_analysis import JournalNoteAnalysis
from src.services.journal_analysis_rules import ACTIVITY_TAG_TRANSLATIONS


def build_fallback_journal_analysis(message_text: str) -> JournalNoteAnalysis:
    """Fill basic note fields when the model is unavailable."""
    lowered_message = message_text.lower()
    activity_tags = extract_activity_tags(lowered_message)
    mood_key, mood_label, mood_score, assistant_vibe_check = resolve_fallback_mood(lowered_message)

    return JournalNoteAnalysis(
        mood_key=mood_key,
        mood_label=mood_label,
        mood_score=mood_score,
        activity_tags=activity_tags,
        summary_text=build_fallback_summary_text(message_text),
        assistant_vibe_check=assistant_vibe_check,
    )


def resolve_fallback_mood(lowered_message: str) -> tuple[str, str, int, str]:
    """Resolve obvious mood signals without model access."""
    if has_crisis_signal(lowered_message):
        return (
            "crisis",
            "Кризис",
            1,
            "Это звучит очень тяжело. Если есть риск навредить себе, пожалуйста, сразу обратись "
            "в местную экстренную службу или к человеку рядом.",
        )

    if has_elevated_mood_signal(lowered_message):
        return (
            "euphoric",
            "Сильный подъем",
            9,
            "Заметка сохранена. Если подъем сопровождается бессонницей или импульсивностью, "
            "стоит замедлиться и обсудить это с доверенным человеком или специалистом.",
        )

    if any(word in lowered_message for word in ["болит", "голова", "устал", "бессонница", "безсонница"]):
        return ("unwell", "Нездоровится", 4, "Заметка сохранена. Сейчас важно дать себе немного заботы и паузы.")

    if any(word in lowered_message for word in ["тревога", "тревожно", "anxious"]):
        return ("anxious", "Тревожно", 4, "Заметка сохранена. Можно снизить темп и сделать один маленький шаг.")

    return ("neutral", "Нейтрально", 6, "Заметка сохранена. Похоже, состояние сейчас ближе к устойчивому.")


def extract_activity_tags(lowered_message: str) -> list[str]:
    """Extract explicit tags and obvious contextual tags from a message."""
    tag_values: list[str] = []
    tag_match = re.search(r"(?:теги|tags)\s*[:：-]?\s*(.+)$", lowered_message)

    if tag_match:
        raw_tag_values = re.split(r"[,;]+|\s+и\s+", tag_match.group(1))
        tag_values.extend(filter(None, [normalize_activity_tag(value) for value in raw_tag_values]))

    for source_value, normalized_tag in ACTIVITY_TAG_TRANSLATIONS.items():
        if source_value in lowered_message:
            tag_values.append(normalized_tag)

    return list(dict.fromkeys(tag_values))


def has_crisis_signal(lowered_message: str) -> bool:
    """Detect obvious crisis wording for a conservative fallback score."""
    crisis_markers = ["суицид", "самоуб", "не хочу жить", "убить себя", "kill myself", "suicide"]

    return any(marker in lowered_message for marker in crisis_markers)


def has_elevated_mood_signal(lowered_message: str) -> bool:
    """Detect obvious high-energy mood wording for a conservative fallback score."""
    sleepless_markers = ["не спал", "не спала", "без сна", "no sleep", "sleepless"]
    elevated_markers = ["эйфория", "идей миллион", "могу все", "неуязвим", "euphoria", "unstoppable"]

    return any(marker in lowered_message for marker in elevated_markers) or (
        any(marker in lowered_message for marker in sleepless_markers)
        and any(word in lowered_message for word in ["энерг", "супер", "идей", "могу", "great"])
    )


def build_fallback_summary_text(message_text: str) -> str:
    """Build a concise first-person journal note without model access."""
    cleaned_message = re.sub(r"(?:теги|tags)\s*[:：-]?\s*.+$", "", message_text, flags=re.IGNORECASE).strip()
    cleaned_message = cleaned_message.strip(" .,!?:;")

    if not cleaned_message:
        return "Сегодня оставил короткую заметку о своем состоянии."

    return f"Сегодня {cleaned_message[:1].lower()}{cleaned_message[1:]}."


def normalize_activity_tag(raw_tag_value: str) -> str | None:
    """Normalize user-facing tags to canonical storage tags."""
    cleaned_tag_value = raw_tag_value.strip(" .!?,;:()[]{}\"'")

    if not cleaned_tag_value:
        return None

    return ACTIVITY_TAG_TRANSLATIONS.get(cleaned_tag_value, cleaned_tag_value.replace(" ", "_"))
