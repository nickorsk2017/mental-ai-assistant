"""Upsert journal embeddings into Pinecone for later semantic search."""

import logging

from pinecone import Pinecone

from src.config import ApplicationSettings
from src.services.embedding_service import embed_text_for_pinecone

LOGGER = logging.getLogger(__name__)


def upsert_journal_note_vector(
    settings: ApplicationSettings,
    correlation_id: str,
    user_id: str,
    combined_text: str,
    summary_text: str,
) -> None:
    """Store one vector per Kafka job when Pinecone credentials and index name are set."""
    if not settings.pinecone_api_key or not settings.pinecone_index_name:
        LOGGER.warning("Pinecone is not configured; skipping vector upsert.")
        return

    try:
        vector_values = embed_text_for_pinecone(combined_text, settings)
    except Exception:
        LOGGER.exception("Embedding failed for correlation=%s", correlation_id)
        return

    pinecone_client = Pinecone(api_key=settings.pinecone_api_key)
    index = pinecone_client.Index(settings.pinecone_index_name)
    metadata = {
        "user_id": user_id,
        "correlation_id": correlation_id,
        "summary_preview": summary_text[:500],
    }
    index.upsert(vectors=[{"id": correlation_id, "values": vector_values, "metadata": metadata}])
    LOGGER.info("Pinecone upsert completed correlation=%s", correlation_id)
