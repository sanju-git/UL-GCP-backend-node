# Stage 1: Build the production dependencies
# Use a specific slim image for a smaller footprint
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install *only* production dependencies. This is crucial.
RUN npm install --omit=dev

# Copy the rest of your app's source code
COPY . .

# ---

# Stage 2: Create the final, secure image
# Start from a fresh, clean base
FROM node:20-slim
WORKDIR /app

# Set the environment to production
ENV NODE_ENV=production
# Cloud Run sends traffic to 8080 by default
ENV PORT=8080

# Copy the app files AND the node_modules from the 'builder' stage
COPY --from=builder /app ./

# Create a non-root user to run the app (Best Security Practice)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

# Expose the port
EXPOSE 8080

# The command to run your server.
# Make sure your package.json has a "start" script,
# or change this to ["node", "server.js"]
CMD [ "npm", "start" ]