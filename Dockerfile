# 1. Build-Stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm  # Globale Installation
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# 2. Runtime-Image mit pnpm-Installation
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# pnpm im Runtime-Image installieren (zuverlässiger)
RUN npm install -g pnpm  # Direkte Installation im Runtime-Image

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

EXPOSE 3000
CMD ["pnpm", "start"]
