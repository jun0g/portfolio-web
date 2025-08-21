# 1) deps
FROM node:24.5.0-alpine3.22 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2) builder
FROM node:24.5.0-alpine3.22 AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) runner
FROM node:24.5.0-alpine3.22 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# RUN chown -R node:node /app
USER node

EXPOSE 3000
CMD ["node", "server.js"]
