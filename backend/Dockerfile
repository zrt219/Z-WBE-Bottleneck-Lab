# Google Cloud Run Dockerfile for Z-WBE Bottleneck Lab Backend
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root and package descriptors
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install all dependencies for build
RUN npm install

# Copy source files
COPY shared ./shared
COPY backend ./backend
COPY frontend ./frontend

# Build shared, backend, and frontend
RUN npm run build:shared
RUN npm run build:backend
RUN npm run build:frontend

# Runner stage
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled dist
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/shared/src ./shared/src

EXPOSE 8080

CMD ["node", "backend/dist/server.js"]
