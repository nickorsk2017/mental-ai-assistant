"""Structured journal note analysis produced from a free-form chat message."""

from pydantic import BaseModel, Field


class JournalNoteAnalysis(BaseModel):
    """Fields persisted to the patient journal table."""

    mood_key: str | None = Field(default=None)
    mood_label: str | None = Field(default=None)
    mood_score: int | None = Field(default=None, ge=1, le=10)
    activity_tags: list[str] = Field(default_factory=list)
    summary_text: str
    assistant_vibe_check: str
