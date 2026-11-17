FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY ./services/auth/package*.json ./services/auth/
RUN cd services/auth && (npm ci --omit=dev || npm install --omit=dev)

COPY services/auth ./services/auth
COPY shared ./shared

WORKDIR /app/services/auth

EXPOSE 8001

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8001/healthz || exit 1

CMD ["node", "index.js"]
