FROM node:22-alpine

WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.33.2 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY mobile/package.json ./mobile/
COPY _common/hooks/package.json ./_common/hooks/
COPY _common/schemas/package.json ./_common/schemas/
COPY _common/services/package.json ./_common/services/
COPY _common/stores/package.json ./_common/stores/
COPY _common/ui-kit/package.json ./_common/ui-kit/
COPY _common/utils/package.json ./_common/utils/
RUN pnpm install --frozen-lockfile --filter mobile...

COPY mobile ./mobile
COPY _common ./_common

WORKDIR /app/mobile
EXPOSE 8100
CMD ["pnpm", "dev", "--", "--host", "0.0.0.0", "--port", "8100"]
