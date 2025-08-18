# ---------- build stage ----------
FROM golang:1.24-alpine3.22 AS builder
WORKDIR /app

COPY . .
ENV CGO_ENABLED=0
# API 바이너리와 시드 바이너리를 함께 빌드
RUN --mount=type=cache,target=/root/.cache/go-build \
    go build -o /bin/api  ./cmd/api && \
    go build -o /bin/seed ./cmd/seed

# ---------- runtime stage ----------
FROM alpine:3.22
# 비루트 사용자 + CA 인증서
RUN adduser -D -u 10001 app && apk add --no-cache ca-certificates
USER app

COPY --from=builder /bin/api  /bin/api
COPY --from=builder /bin/seed /bin/seed

ENV PORT=8043
EXPOSE 8043
ENTRYPOINT ["/bin/api"]
