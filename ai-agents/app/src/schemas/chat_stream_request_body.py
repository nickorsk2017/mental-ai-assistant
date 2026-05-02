"""Request body for POST /chat/messages/stream (camelCase from the NestJS API)."""

from pydantic import BaseModel, ConfigDict, Field


class ChatStreamRequestBody(BaseModel):
    """Validated chat payload from the API gateway."""

    model_config = ConfigDict(populate_by_name=True)

    message_text: str = Field(alias="messageText")
