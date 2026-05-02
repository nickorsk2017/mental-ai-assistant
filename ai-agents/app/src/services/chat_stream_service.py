"""OpenAI streaming completion for the public chat endpoint."""

from collections.abc import AsyncIterator

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from src.config import ApplicationSettings
from src.prompts.serene_chat_system_prompt import SERENE_CHAT_SYSTEM_PROMPT


async def stream_serene_chat_tokens(
    message_text: str,
    settings: ApplicationSettings,
) -> AsyncIterator[str]:
    """Yield plain-text chunks for an HTTP streaming response."""
    stripped = message_text.strip()

    if not settings.openai_api_key:
        yield "Serene is not configured: set OPENAI_API_KEY in the environment."
        return

    model = ChatOpenAI(
        api_key=settings.openai_api_key,
        model=settings.openai_chat_model,
        streaming=True,
    )
    messages = [
        SystemMessage(content=SERENE_CHAT_SYSTEM_PROMPT),
        HumanMessage(content=stripped),
    ]

    async for chunk in model.astream(messages):
        token = chunk.content
        if isinstance(token, str) and token:
            yield token
