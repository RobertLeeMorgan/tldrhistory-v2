FROM node:22.23.3-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

RUN mkdir -p public
COPY prisma ./prisma
COPY tsconfig.json ./tsconfig.json
COPY src ./src
COPY tests ./tests
RUN npx prisma generate \
    && npm test \
    && npm run build \
    && npm pkg delete devDependencies.prisma \
    && npm prune --omit=dev --omit=peer \
    && test ! -d node_modules/prisma \
    && test ! -d node_modules/@prisma/config \
    && test ! -d node_modules/deepmerge-ts

FROM node:22.23.3-bookworm-slim AS runtime
ENV NODE_ENV=production PORT=5000 SERVE_FRONTEND=false
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/prisma ./prisma

USER node
EXPOSE 5000
STOPSIGNAL SIGTERM
CMD ["node", "dist/index.js"]
