# Production Dockerfile for CamperMap TN
FROM node:22-slim AS builder

WORKDIR /app

# Install essential build tools for better-sqlite3 compilation
RUN apt-get update && apt-get install -y python3 make g++ gcc --no-install-recommends && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Stage
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/data ./data

EXPOSE 3001

CMD ["npx", "tsx", "server/index.ts"]
