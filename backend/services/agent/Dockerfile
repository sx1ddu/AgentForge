FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY ./services/agent/package*.json ./services/agent/
RUN cd services/agent && (npm ci --omit=dev || npm install --omit=dev)

COPY services/agent ./services/agent
COPY shared ./shared

WORKDIR /app/services/agent

EXPOSE 8003

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8003/healthz || exit 1

CMD ["node", "index.js"]
