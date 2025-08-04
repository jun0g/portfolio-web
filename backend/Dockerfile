FROM golang:1.24-alpine3.21 AS build

WORKDIR /app

COPY . .

RUN go build -o server

FROM alpine:3.21
WORKDIR /app
COPY --from=build /app/server .
EXPOSE 4030
CMD ["./server"]
