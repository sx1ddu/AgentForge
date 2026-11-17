FROM node:20-alpine

WORKDIR /app

# Install root backend dependencies
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Install gateway dependencies
COPY ./gateway/package*.json ./gateway/
RUN cd gateway && (npm ci --omit=dev || npm install --omit=dev)

# Copy source
COPY gateway ./gateway
COPY shared ./shared

WORKDIR /app/gateway

EXPOSE 8000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8000/healthz || exit 1

CMD ["node", "index.js"]
