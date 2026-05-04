"""AI classifier that decides whether an inbound chat message is on-topic.

This is the gate in front of the Serene chat reply and the journal-note
pipeline. If the message is off-topic (gibberish, unrelated questions,
prompt-injection attempts, spam, jokes), the classifier returns
`is_on_topic=False` together with a short polite reply written in the
user's language. The chat endpoint streams that reply and the note
pipeline skips Supabase insert + Kafka downstream.
"""

import logging

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from src.config import ApplicationSettings
from src.prompts.topic_relevance_filter_prompt import TOPIC_RELEVANCE_FILTER_PROMPT
from src.schemas.topic_relevance_signal import TopicRelevanceSignal

LOGGER = logging.getLogger(__name__)

# Default canned reply used when the LLM is unavailable or errors. The chat
# service is allowed to override with a localized reply produced by the
# classifier when one is available.
DEFAULT_OFF_TOPIC_REPLY_TEXT = (
    "Кажется, вы пишете не по теме. Этот чат — про ваше настроение, "
    "самочувствие и день. Расскажите, как вы себя сегодня чувствуете?"
)


def classify_chat_message_relevance(
    message_text: str,
    settings: ApplicationSettings,
) -> TopicRelevanceSignal:
    """Ask the model whether the chat message belongs in the wellness journal.

    Fail-open behavior: if the API key is missing or the call raises, we
    return `is_on_topic=True` so the rest of the pipeline keeps working.
    The off-topic gate should never break the chat for users when the
    classifier itself is unhealthy.
    """
    stripped = message_text.strip()
    if not stripped:
        return TopicRelevanceSignal(is_on_topic=True, off_topic_reply_text="")

    if not settings.openai_api_key:
        return TopicRelevanceSignal(is_on_topic=True, off_topic_reply_text="")

    model = ChatOpenAI(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
    )
    structured_model = model.with_structured_output(TopicRelevanceSignal)

    try:
        response = structured_model.invoke(
            [
                SystemMessage(content=TOPIC_RELEVANCE_FILTER_PROMPT),
                HumanMessage(content=stripped),
            ]
        )
    except Exception:
        LOGGER.exception("OpenAI topic relevance classification failed.")
        return TopicRelevanceSignal(is_on_topic=True, off_topic_reply_text="")

    if isinstance(response, TopicRelevanceSignal):
        return response

    return TopicRelevanceSignal.model_validate(response)


def is_chat_message_on_topic(
    message_text: str,
    settings: ApplicationSettings,
) -> bool:
    """Convenience wrapper for callers that only need the boolean gate."""
    return classify_chat_message_relevance(message_text, settings).is_on_topic
