FROM node:22.23.3-bookworm-slim AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
ENV DISABLE_PRERENDER=true
RUN npm run build && npm prune --omit=dev

FROM node:22.23.3-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=3000
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/server.mjs ./server.mjs
COPY --from=build --chown=node:node /app/build ./build

USER node
EXPOSE 3000
STOPSIGNAL SIGTERM
CMD ["node", "server.mjs"]
