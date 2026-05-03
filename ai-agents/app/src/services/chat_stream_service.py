"""OpenAI streaming completion for the public chat endpoint."""

from collections.abc import AsyncIterator

from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from src.config import ApplicationSettings
from src.prompts.serene_chat_system_prompt import SERENE_CHAT_SYSTEM_PROMPT
from src.schemas.chat_stream_request_body import ChatStreamHistoryMessage


def build_unconfigured_chat_reply(message_text: str) -> str:
    """Return a safe patient-facing reply when the model is not configured."""
    return (
        "Service is unavailable, please contact your doctor."
    )


async def stream_serene_chat_tokens(
    message_text: str,
    settings: ApplicationSettings,
    daily_messages: list[ChatStreamHistoryMessage] | None = None,
    client_local_date: str | None = None,
    client_time_zone: str | None = None,
) -> AsyncIterator[str]:
    """Yield plain-text chunks for an HTTP streaming response."""
    stripped = message_text.strip()

    if not settings.openai_api_key:
        yield build_unconfigured_chat_reply(stripped)
        return

    model = ChatOpenAI(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
        streaming=True,
    )
    messages = [SystemMessage(content=SERENE_CHAT_SYSTEM_PROMPT)]
    if client_local_date and client_time_zone:
        messages.append(
            SystemMessage(
                content=(
                    f"The user's current local date is {client_local_date} "
                    f"in the {client_time_zone} time zone. The conversation history "
                    "included below has been filtered to that exact local date. "
                    "Use only this today's context. Do not answer from previous days."
                )
            )
        )
    history_messages = daily_messages or [ChatStreamHistoryMessage(role="user", content=stripped)]

    for history_message in history_messages:
        if history_message.role == "assistant":
            messages.append(AIMessage(content=history_message.content))
        else:
            messages.append(HumanMessage(content=history_message.content))

    async for chunk in model.astream(messages):
        token = chunk.content
        if isinstance(token, str) and token:
            yield token
