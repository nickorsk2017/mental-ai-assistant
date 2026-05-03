"""Insert asynchronous journal rows into Supabase via PostgREST (service role)."""

import logging

import httpx

from src.config import ApplicationSettings

LOGGER = logging.getLogger(__name__)


def insert_patient_note_row(
    settings: ApplicationSettings,
    user_id: str,
    correlation_id: str,
    mood_key: str | None,
    mood_label: str | None,
    mood_score: int | None,
    activity_tags: list[str],
    summary_text: str,
) -> None:
    """Persist a note row when Supabase URL and secret key are configured."""
    if not settings.supabase_url or not settings.supabase_secret_key:
        LOGGER.warning("Supabase is not configured; skipping patient note insert.")
        return

    base_url = settings.supabase_url.rstrip("/")
    table_name = settings.supabase_patient_notes_table
    request_url = f"{base_url}/rest/v1/{table_name}"
    payload = {
        "user_id": user_id,
        "correlation_id": correlation_id,
        "mood_key": mood_key,
        "mood_label": mood_label,
        "mood_score": mood_score,
        "activity_tags": activity_tags,
        "summary_text": summary_text,
    }
    headers = {
        "apikey": settings.supabase_secret_key,
        "Authorization": f"Bearer {settings.supabase_secret_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

    try:
        with httpx.Client(timeout=30.0) as http_client:
            response = http_client.post(request_url, json=payload, headers=headers)
            response.raise_for_status()
        LOGGER.info("Supabase note inserted correlation=%s", correlation_id)
    except httpx.HTTPStatusError as status_error:
        status_code = status_error.response.status_code

        if status_code == 404:
            LOGGER.warning(
                "Supabase table missing or wrong name (404 for %r). "
                "Create `public.%s` per docs/chat-journaling.md or set SUPABASE_PATIENT_NOTES_TABLE.",
                request_url,
                table_name,
            )

            return

        LOGGER.warning(
            "Supabase insert HTTP %s correlation=%s response=%s",
            status_code,
            correlation_id,
            status_error.response.text[:400],
        )
    except httpx.HTTPError:
        LOGGER.exception("Supabase insert failed correlation=%s", correlation_id)
