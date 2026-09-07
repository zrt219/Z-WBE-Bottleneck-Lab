# Google Cloud Run Multi-Stage Dockerfile for Z-WBE Bottleneck Lab
# Builds shared libraries, backend Express API, and React Vite frontend into a single production container.

# -----------------------------------------------------------------------------
# Stage 1: Build Stage
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

WORKDIR /app

# Copy root and package manifests for workspace resolution
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install build dependencies
RUN npm install

# Copy complete source directories and public assets
COPY shared ./shared
COPY backend ./backend
COPY frontend ./frontend
COPY public ./public

# Compile TypeScript and bundle frontend assets
RUN npm run build:shared
RUN npm run build:backend
RUN npm run build:frontend

# -----------------------------------------------------------------------------
# Stage 2: Production Runner
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy manifests for production dependency installation
COPY package*.json ./
COPY shared/package*.json ./shared/
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install only production dependencies for runtime services
RUN npm install --omit=dev

# Copy compiled artifacts from builder stage
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist
COPY --from=builder /app/public ./public

# Google Cloud Run default listening port
EXPOSE 8080

# Launch production server
CMD ["node", "backend/dist/server.js"]
