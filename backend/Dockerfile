FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY tsconfig.json ./
COPY app.ts server.ts ./
COPY middleware ./middleware
COPY modules ./modules
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/middleware/database/migrations ./dist/middleware/database/migrations

RUN mkdir -p uploads && chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3005/health || exit 1

CMD ["node", "dist/server.js"]
