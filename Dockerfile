# Production Dockerfile for Next.js on Cloud Run
# This Dockerfile is designed to be run from the repository root
# Multi-stage build for optimized image size

# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app

# Copy package files from frontend directory
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci

# Stage 2: Build the application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all frontend source files
COPY frontend/ ./

# Set build-time environment variables
ARG DISCOVERY_ENGINE_PROJECT_ID=922876587313
ARG DISCOVERY_ENGINE_LOCATION=global
ARG DISCOVERY_ENGINE_COLLECTION=default_collection
ARG DISCOVERY_ENGINE_ENGINE_ID=ai-policy-assistant_1763955939617

ENV NEXT_TELEMETRY_DISABLED 1
ENV DISCOVERY_ENGINE_PROJECT_ID=$DISCOVERY_ENGINE_PROJECT_ID
ENV DISCOVERY_ENGINE_LOCATION=$DISCOVERY_ENGINE_LOCATION
ENV DISCOVERY_ENGINE_COLLECTION=$DISCOVERY_ENGINE_COLLECTION
ENV DISCOVERY_ENGINE_ENGINE_ID=$DISCOVERY_ENGINE_ENGINE_ID

# Build Next.js application
# This creates an optimized production build with standalone output
RUN npm run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy the standalone build output
# Next.js automatically creates this with output: 'standalone' in next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose Cloud Run port
EXPOSE 8080

# Set runtime environment variables
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

# Start the Next.js server
CMD ["node", "server.js"]
