"""Journal messages produced by the NestJS API and consumed from Kafka."""

from pydantic import BaseModel, ConfigDict, Field


class JournalKafkaPayload(BaseModel):
    """Payload published by `backend/app/src/chat/chat.service.ts` (camelCase JSON)."""

    model_config = ConfigDict(populate_by_name=True)

    correlation_id: str = Field(alias="correlationId")
    user_id: str = Field(alias="userId")
    message_text: str = Field(alias="messageText")
    requested_at: str = Field(alias="requestedAt")
