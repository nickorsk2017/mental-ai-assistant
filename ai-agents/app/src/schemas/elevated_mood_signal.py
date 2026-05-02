"""Elevated mood classifier result."""

from pydantic import BaseModel, Field


class ElevatedMoodSignal(BaseModel):
    """Whether a note contains elevated or mania-risk mood signals."""

    has_elevated_mood_signal: bool = Field(default=False)
