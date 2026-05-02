"""Request body for POST /chat/messages/stream (camelCase from the NestJS API)."""

from pydantic import BaseModel, ConfigDict, Field


class ChatStreamHistoryMessage(BaseModel):
    """One persisted chat message from the current day."""

    role: str
    content: str


class ChatStreamRequestBody(BaseModel):
    """Validated chat payload from the API gateway."""

    model_config = ConfigDict(populate_by_name=True)

    message_text: str = Field(alias="messageText")
    enforce_minimum_length: bool = Field(default=True, alias="enforceMinimumLength")
    daily_messages: list[ChatStreamHistoryMessage] = Field(default_factory=list, alias="dailyMessages")
    client_local_date: str | None = Field(default=None, alias="clientLocalDate")
    client_time_zone: str | None = Field(default=None, alias="clientTimeZone")
