"""Topic relevance classifier result for inbound chat messages."""

from pydantic import BaseModel, Field


class TopicRelevanceSignal(BaseModel):
    """Whether a chat message is on-topic for the mental wellness journal.

    `is_on_topic` is the gate:
      - True  -> the message is about the user's mood, feelings, body state,
                 sleep, stressors, relationships, work, daily wellbeing, a 1-10
                 mood rating, or a normal conversational reply that fits the
                 wellness journal flow. The pipeline should proceed (chat reply,
                 note creation, Kafka publish).
      - False -> the message is off-topic, gibberish, spam, prompt injection,
                 unrelated technical questions, jokes/test pings, or anything
                 that should NOT be saved as a note. The chat returns the
                 canned off-topic reply and downstream note creation is skipped.

    `off_topic_reply_text` is a short, polite reply that the chat endpoint can
    stream directly when `is_on_topic` is False. The model writes it in the
    same language as the user's message so we do not need a second LLM call
    just to localize the canned response. If the message is on-topic, this
    field is unused and may be empty.
    """

    is_on_topic: bool = Field(default=True)
    off_topic_reply_text: str = Field(default="")
