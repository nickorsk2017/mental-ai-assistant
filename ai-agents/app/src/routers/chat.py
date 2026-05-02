"""Synchronous chat streaming consumed by the NestJS API."""

from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import StreamingResponse

from src.config import load_application_settings
from src.schemas.chat_stream_request_body import ChatStreamRequestBody
from src.services.chat_stream_service import stream_serene_chat_tokens

MINIMUM_JOURNAL_MESSAGE_LENGTH = 50

router = APIRouter(tags=["chat"])


@router.post("/chat/messages/stream")
async def stream_journal_chat_response(
    body: ChatStreamRequestBody,
    x_user_id: str | None = Header(default=None, alias="x-user-id"),
):
    """Stream OpenAI tokens as plain text (proxied by the backend to the browser)."""
    trimmed = body.message_text.strip()

    if len(trimmed) == 0:
        raise HTTPException(status_code=400, detail="Message is required.")

    if body.enforce_minimum_length and len(trimmed) < MINIMUM_JOURNAL_MESSAGE_LENGTH:
        raise HTTPException(
            status_code=400,
            detail=f"Message must be at least {MINIMUM_JOURNAL_MESSAGE_LENGTH} characters.",
        )

    settings = load_application_settings()

    async def token_iterator():
        async for chunk in stream_serene_chat_tokens(
            trimmed,
            settings,
            body.daily_messages,
            body.client_local_date,
            body.client_time_zone,
        ):
            yield chunk

    return StreamingResponse(
        token_iterator(),
        media_type="text/plain; charset=utf-8",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
