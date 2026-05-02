"""AI classifier for elevated mood signals."""

import logging

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from src.config import ApplicationSettings
from src.schemas.elevated_mood_signal import ElevatedMoodSignal

LOGGER = logging.getLogger(__name__)

ELEVATED_MOOD_SIGNAL_PROMPT = """Classify whether the message contains elevated mood or mania-risk signals.

Return true only for clear signs such as unusually high energy, euphoria, racing thoughts,
grandiosity, impulsive or risky behavior, or reduced need for sleep combined with high activation.
Return false for ordinary happiness, calmness, or stable productivity.
"""


def has_elevated_mood_signal(
    message_text: str,
    settings: ApplicationSettings,
) -> bool:
    """Ask the model to classify elevated mood signals."""
    if not settings.openai_api_key:
        return False

    model = ChatOpenAI(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
    )
    structured_model = model.with_structured_output(ElevatedMoodSignal)

    try:
        response = structured_model.invoke(
            [
                SystemMessage(content=ELEVATED_MOOD_SIGNAL_PROMPT),
                HumanMessage(content=message_text.strip()),
            ]
        )
    except Exception:
        LOGGER.exception("OpenAI elevated mood classification failed.")

        return False

    if isinstance(response, ElevatedMoodSignal):
        return response.has_elevated_mood_signal

    return ElevatedMoodSignal.model_validate(response).has_elevated_mood_signal
