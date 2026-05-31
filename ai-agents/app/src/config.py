"""Application configuration loaded from environment variables."""

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


def resolve_environment_file_paths() -> tuple[Path, ...]:
    """Resolve `.env` paths: shared repo config first, then optional `ai-agents/.env` override."""
    application_package_directory = Path(__file__).resolve().parent
    ai_agents_tooling_directory = application_package_directory.parent
    ai_agents_directory = ai_agents_tooling_directory.parent
    repository_root = ai_agents_directory.parent
    common_env_file = repository_root / "_common" / ".env"
    local_override_env_file = ai_agents_directory / ".env"
    paths: list[Path] = []

    if common_env_file.is_file():
        paths.append(common_env_file)

    if local_override_env_file.is_file():
        paths.append(local_override_env_file)

    return tuple(paths)


PATIENT_NOTES_TABLE_NAME = "patient_notes"


class ApplicationSettings(BaseSettings):
    """Runtime settings for the AI agent HTTP service and Kafka consumer."""

    model_config = SettingsConfigDict(
        env_file=resolve_environment_file_paths(),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    ai_agents_host: str = "0.0.0.0"
    ai_agents_port: int = 8080

    kafka_brokers: str = ""
    kafka_chat_topic: str = "assistant.chat.requests"
    kafka_consumer_group: str = "assistant-ai-agents"

    openai_api_key: str = ""
    openai_chat_model: str = "gpt-4o-mini"

    langsmith_tracing: bool = False
    langsmith_api_key: str = ""
    langsmith_endpoint: str = "https://api.smith.langchain.com"
    langsmith_project: str = "assistant-ai-agents"
    langsmith_workspace_id: str = ""

    supabase_url: str = ""
    supabase_secret_key: str = ""


@lru_cache
def load_application_settings() -> ApplicationSettings:
    """Return a cached settings instance."""
    return ApplicationSettings()
