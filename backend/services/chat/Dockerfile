FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY ./services/chat/package*.json ./services/chat/
RUN cd services/chat && (npm ci --omit=dev || npm install --omit=dev)

COPY services/chat ./services/chat
COPY shared ./shared

WORKDIR /app/services/chat

EXPOSE 8002

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8002/healthz || exit 1

CMD ["node", "index.js"]
