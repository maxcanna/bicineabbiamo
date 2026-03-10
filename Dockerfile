# Builder stage
FROM golang:1.26-alpine AS builder

WORKDIR /app
COPY go.mod ./
# COPY go.sum ./ # Only if we have dependencies
# RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o server ./cmd/server

# Final stage
FROM alpine:3.19

LABEL org.opencontainers.image.authors="massi@massi.dev"

WORKDIR /app

# Copy the binary and static files
COPY --from=builder /app/server .
COPY public/ public/

ENV PORT=3000
EXPOSE 3000

# Health check to ensure service is responding
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -q -O /dev/stdout http://localhost:3000/api?onlyFirstResult=true || exit 1

CMD ["./server"]