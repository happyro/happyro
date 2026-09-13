FROM node:22-bookworm AS client-builder

ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1
WORKDIR /src/client
RUN npm install --global npm@11.19.1
COPY repos/happyro-client/package.json ./
RUN npm install --ignore-scripts
COPY repos/happyro-client/ ./
RUN npm run build:pwa

FROM node:22-bookworm-slim AS gateway

ENV NODE_ENV=production \
    PORT=3338 \
    ENABLE_WSPROXY=true \
    ENABLE_STATIC_SERVE=true \
    ROBROWSER_PATH=/opt/robrowser \
    ROBROWSER_PUBLIC_PATH=/applications/pwa \
    DATA_OVERRIDE_PATH=/opt/overrides

WORKDIR /opt/gateway
COPY repos/happyro-gateway/package.json ./
RUN npm install --omit=dev --ignore-scripts
COPY repos/happyro-gateway/ ./
COPY --from=client-builder /src/client/dist/Web /opt/robrowser
COPY localization/client/data/ /opt/overrides/

RUN mkdir -p /opt/gateway/resources /opt/overrides /opt/gateway/logs \
    && rm -rf /opt/gateway/resources /opt/gateway/AI /opt/gateway/BGM /opt/gateway/System \
    && ln -s /resources/kro-20211105 /opt/gateway/resources \
    && ln -s /resources/kro-20211105/AI /opt/gateway/AI \
    && ln -s /resources/kro-20211105/BGM /opt/gateway/BGM \
    && ln -s /resources/kro-20211105/System /opt/gateway/System \
    && chown -R node:node /opt/gateway /opt/robrowser
USER node
EXPOSE 3338
CMD ["node", "start-prod.js"]
