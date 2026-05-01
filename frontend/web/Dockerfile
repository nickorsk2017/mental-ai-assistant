# syntax=docker/dockerfile:1
# Build context: ./frontend

FROM node:22-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

# ─── Dependencies ────────────────────────────────────────────────────────────
FROM base AS dependencies
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml .npmrc* ./
COPY web/package.json ./web/
COPY _common/hooks/package.json ./_common/hooks/
COPY _common/schemas/package.json ./_common/schemas/
COPY _common/services/package.json ./_common/services/
COPY _common/stores/package.json ./_common/stores/
COPY _common/utils/package.json ./_common/utils/
RUN pnpm install --frozen-lockfile --filter web... --prod=false

# ─── Builder ─────────────────────────────────────────────────────────────────
FROM dependencies AS builder
COPY tsconfig.json ./tsconfig.json
COPY _common/ ./_common/
COPY web/ ./web/
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build

# ─── Runner ──────────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/web/.next/standalone ./
COPY --from=builder /app/web/.next/static ./web/.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "web/server.js"]
