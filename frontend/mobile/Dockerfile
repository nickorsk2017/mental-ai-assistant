# syntax=docker/dockerfile:1
# Build context: repository root (see docker-compose.yml)

FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

FROM base AS dependencies
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
COPY frontend/mobile/package.json ./mobile/
COPY frontend/web/package.json ./web/
COPY frontend/_common/package.json ./_common/package.json
RUN pnpm install --frozen-lockfile --filter mobile...

FROM dependencies AS builder
ARG BACKEND_URL=http://localhost:4000
ENV BACKEND_URL=${BACKEND_URL}
COPY frontend/tsconfig.json ./tsconfig.json
COPY frontend/mobile ./mobile
COPY frontend/_common ./_common/
COPY _common/types /app/_common/types
WORKDIR /app/frontend
RUN pnpm --filter mobile build

FROM builder AS runner
ENV NODE_ENV=production
WORKDIR /app/frontend/mobile
EXPOSE 8100
CMD ["pnpm", "exec", "vite", "preview", "--host", "0.0.0.0", "--port", "8100"]
