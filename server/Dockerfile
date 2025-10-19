# Multi-stage build for smaller image
FROM node:18-alpine AS deps
WORKDIR /app

# Install build deps (if needed)
COPY package.json package-lock.json* ./
RUN npm ci --production

FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
# copy deps
COPY --from=deps /app/node_modules ./node_modules
# copy source
COPY . .
# ensure env is set in runtime; for production set NODE_ENV=production
ENV NODE_ENV=production
# expose API port
EXPOSE 5000

# change owner to non-root user
RUN chown -R appuser:appgroup /app
USER appuser

CMD ["node", "src/server.js"]
