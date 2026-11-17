FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY ./services/billing/package*.json ./services/billing/
RUN cd services/billing && (npm ci --omit=dev || npm install --omit=dev)

COPY services/billing ./services/billing
COPY shared ./shared

WORKDIR /app/services/billing

EXPOSE 8004

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8004/healthz || exit 1

CMD ["node", "index.js"]
