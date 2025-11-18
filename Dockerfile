# ---------- Stage 1: Build ----------
FROM node:20-slim AS builder
WORKDIR /app

# Install deps first for better caching
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# ---------- Stage 2: Deploy ----------
FROM node:20-slim
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Copy project + node_modules from builder
COPY --from=builder /app /app

# Create secure user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nodejs

# Give permissions to non-root user
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8080

CMD ["npm", "start"]
