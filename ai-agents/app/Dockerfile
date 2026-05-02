# syntax=docker/dockerfile:1
FROM python:3.12-slim-bookworm AS dependencies

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /application

COPY pyproject.toml uv.lock ./

RUN uv sync --frozen --no-dev

FROM python:3.12-slim-bookworm AS runner

WORKDIR /application

COPY --from=dependencies /application/.venv /application/.venv
COPY . .

ENV PATH="/application/.venv/bin:${PATH}"
ENV PYTHONUNBUFFERED=1

EXPOSE 8080

CMD ["uvicorn", "src.main:application", "--host", "0.0.0.0", "--port", "8080"]
