"""OpenAI embeddings for Pinecone vector upserts."""

from langchain_openai import OpenAIEmbeddings

from src.config import ApplicationSettings


def embed_text_for_pinecone(text: str, settings: ApplicationSettings) -> list[float]:
    """Return a single embedding vector for the given text."""
    if not settings.openai_api_key:
        raise ValueError("OPENAI_API_KEY is required for embeddings.")

    embeddings = OpenAIEmbeddings(
        api_key=settings.openai_api_key,
        model=settings.openai_embedding_model,
    )
    vector = embeddings.embed_query(text)
    return vector
