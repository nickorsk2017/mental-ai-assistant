"""Tests for LangSmith tracing configuration."""

from collections.abc import Callable
from unittest.mock import MagicMock, patch

from src.config import ApplicationSettings
from src.services.langsmith_tracing_service import (
    build_langsmith_run_config,
    configure_langsmith_tracing,
)


def test_configure_disables_langsmith_when_tracing_is_false(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(langsmith_tracing=False)

    with patch("src.services.langsmith_tracing_service.langsmith_client") as langsmith_module:
        configure_langsmith_tracing(settings)

    langsmith_module.configure.assert_called_once_with(enabled=False)
    langsmith_module.Client.assert_not_called()


def test_configure_enables_langsmith_with_client(
    make_settings: Callable[..., ApplicationSettings],
) -> None:
    settings = make_settings(
        langsmith_tracing=True,
        langsmith_api_key="test-langsmith-key",
        langsmith_endpoint="https://api.smith.langchain.com",
        langsmith_project="assistant-test",
        langsmith_workspace_id="workspace-1",
    )
    client = MagicMock()

    with patch("src.services.langsmith_tracing_service.langsmith_client") as langsmith_module:
        langsmith_module.Client.return_value = client
        configure_langsmith_tracing(settings)

    langsmith_module.Client.assert_called_once_with(
        api_key="test-langsmith-key",
        api_url="https://api.smith.langchain.com",
        workspace_id="workspace-1",
    )
    langsmith_module.configure.assert_called_once_with(
        client=client,
        enabled=True,
        project_name="assistant-test",
        tags=["assistant-ai-agents"],
    )


def test_build_langsmith_run_config_labels_operation() -> None:
    config = build_langsmith_run_config("journal_analysis")

    assert config["run_name"] == "journal_analysis"
    assert config["tags"] == ["assistant-ai-agents", "journal_analysis"]
    assert config["metadata"] == {"operation_name": "journal_analysis"}
