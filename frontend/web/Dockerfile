# syntax=docker/dockerfile:1
# Build context: repository root (see docker-compose.yml)

FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

FROM base AS dependencies
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml .npmrc* ./
COPY frontend/web/package.json ./web/
COPY frontend/mobile/package.json ./mobile/
COPY frontend/_common/package.json ./_common/package.json
RUN pnpm install --frozen-lockfile --filter web... --prod=false

FROM dependencies AS builder
COPY frontend/tsconfig.json ./tsconfig.json
COPY frontend/_common ./_common/
COPY frontend/web ./web/
COPY _common/types /app/_common/types
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/web/.next/standalone ./
COPY --from=builder /app/frontend/web/.next/static ./web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "web/server.js"]
