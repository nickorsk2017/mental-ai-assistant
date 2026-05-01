# Build context: repo root (.)

FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

# ─── Dependencies ─────────────────────────────────────────────────────────────
FROM base AS dependencies
COPY backend/app/package.json backend/app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ─── Builder ──────────────────────────────────────────────────────────────────
FROM dependencies AS builder
COPY backend/app/tsconfig.json ./
COPY backend/app/src ./src
RUN pnpm build

# ─── Runner ───────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate
COPY backend/app/package.json backend/app/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/main"]
