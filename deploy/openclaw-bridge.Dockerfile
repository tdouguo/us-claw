FROM node:24-alpine

WORKDIR /app

COPY services/openclaw-bridge/package.json ./package.json
COPY services/openclaw-bridge/package-lock.json ./package-lock.json
COPY services/openclaw-bridge/tsconfig.json ./tsconfig.json
RUN npm ci

COPY services/openclaw-bridge/src ./src

EXPOSE 8787

CMD ["npm", "run", "dev"]
