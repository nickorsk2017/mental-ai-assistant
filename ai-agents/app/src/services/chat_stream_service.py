"""OpenAI streaming completion for the public chat endpoint."""

from collections.abc import AsyncIterator

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI

from src.config import ApplicationSettings
from src.prompts.serene_chat_system_prompt import SERENE_CHAT_SYSTEM_PROMPT


def build_unconfigured_chat_reply(message_text: str) -> str:
    """Return a safe patient-facing reply when the model is not configured."""
    lowered_message = message_text.lower()

    if any(marker in lowered_message for marker in ["суицид", "самоуб", "не хочу жить", "убить себя"]):
        return (
            "Мне очень жаль, что тебе сейчас настолько тяжело. "
            "Если есть риск навредить себе, пожалуйста, обратись в местную экстренную службу "
            "или к человеку рядом прямо сейчас. Я рядом, но такую ситуацию важно не держать в одиночку."
        )

    if any(marker in lowered_message for marker in ["депресс", "совсем плохо", "без сил", "не могу"]):
        return (
            "Похоже, тебе сейчас очень тяжело, и это заслуживает бережного внимания. "
            "Попробуй сегодня сделать самый маленький поддерживающий шаг: вода, еда, сон или сообщение близкому. "
            "Если такое состояние держится или усиливается, лучше обратиться к врачу или психотерапевту."
        )

    return (
        "Я слышу, что день дается непросто. "
        "Попробуй сейчас немного замедлиться и выбрать один маленький следующий шаг. "
        "Если состояние становится пугающим или резко ухудшается, стоит обратиться к врачу или доверенному человеку."
    )


async def stream_serene_chat_tokens(
    message_text: str,
    settings: ApplicationSettings,
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
    messages = [
        SystemMessage(content=SERENE_CHAT_SYSTEM_PROMPT),
        HumanMessage(content=stripped),
    ]

    async for chunk in model.astream(messages):
        token = chunk.content
        if isinstance(token, str) and token:
            yield token
