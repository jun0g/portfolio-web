# Dockerfile  (Production)
# 1) deps: 패키지 설치 전용
FROM node:24.5.0-alpine3.22 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# 2) builder: 빌드
FROM node:24.5.0-alpine3.22 AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# 환경변수는 빌드시 필요한 경우만 ARG/ENV로 주입
# ARG SITE_ORIGIN
# ARG API_BASE_URL
RUN npm run build

# 3) runner: 실행만 하는 가벼운 이미지
FROM node:24.5.0-alpine3.22 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# 런타임 환경변수(실행시 -e로 덮어쓰기 가능)
# ENV SITE_ORIGIN=https://your-domain.com
# ENV API_BASE_URL=https://api.your-domain.com

# next standalone 출력물 복사
# .next/standalone 에 서버 실행에 필요한 node_modules까지 포함됨
COPY --from=builder /app/.next/standalone ./ 
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 보안: non-root 사용자
USER node

EXPOSE 3000
CMD ["node", "server.js"]