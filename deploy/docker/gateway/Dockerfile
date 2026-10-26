FROM python:3.12-slim-bookworm AS navi-review

WORKDIR /workspace
COPY tools/resources/navigation/ ./tools/resources/navigation/
COPY localization/sources/kro-20211105/merged/files/lub/ ./localization/sources/kro-20211105/merged/files/lub/
COPY repos/happyro-server/npc/ ./repos/happyro-server/npc/
COPY repos/happyro-server/conf/ ./repos/happyro-server/conf/
COPY repos/happyro-server/db/ ./repos/happyro-server/db/
COPY repos/happyro-server/src/map/ ./repos/happyro-server/src/map/
COPY repos/happyro-server/src/common/mmo.hpp ./repos/happyro-server/src/common/mmo.hpp
COPY repos/happyro-client/src/DB/Map/SupportedMapTable.js ./repos/happyro-client/src/DB/Map/SupportedMapTable.js
COPY repos/happyro-client/src/DB/Navigation/NaviTargets.json ./repos/happyro-client/src/DB/Navigation/NaviTargets.json
RUN python3 tools/resources/navigation/review.py check --root /workspace --no-color

FROM node:22-bookworm AS client-builder

ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1
WORKDIR /src/client
RUN npm install --global npm@11.19.1
COPY repos/happyro-client/package.json ./
RUN npm install --ignore-scripts
COPY repos/happyro-client/ ./
COPY --from=navi-review /workspace/repos/happyro-client/src/DB/Navigation/NaviTargets.json ./src/DB/Navigation/NaviTargets.json
RUN npm run build:pwa

FROM node:22-bookworm-slim AS gateway

RUN apt-get update && apt-get install -y --no-install-recommends gosu \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production \
    HAPPYRO_GATEWAY_LISTEN_PORT=3338 \
    HAPPYRO_GATEWAY_WS_PROXY_ENABLED=true \
    HAPPYRO_GATEWAY_STATIC_SERVE_ENABLED=true \
    HAPPYRO_GATEWAY_PWA_DIR=/opt/robrowser \
    HAPPYRO_GATEWAY_PWA_PUBLIC_PATH=/applications/pwa \
    HAPPYRO_GATEWAY_RESOURCE_OVERRIDE_DIRS=/opt/overrides

WORKDIR /opt/gateway
COPY repos/happyro-gateway/package.json ./
RUN npm install --omit=dev --ignore-scripts \
    && npm cache clean --force \
    && rm -rf /root/.npm \
    && chown -R node:node /opt/gateway
COPY --chown=node:node repos/happyro-gateway/ ./
COPY --from=client-builder --chown=node:node /src/client/dist/Web /opt/robrowser
COPY localization/client/data/ /opt/overrides/
COPY --chmod=755 deploy/docker/gateway/entrypoint.sh /usr/local/bin/happyro-gateway

RUN mkdir -p /opt/gateway/resources /opt/overrides /opt/gateway/logs \
    && rm -rf /opt/gateway/resources /opt/gateway/AI /opt/gateway/BGM /opt/gateway/System \
    && ln -s /resources/kro-20211105 /opt/gateway/resources \
    && ln -s /resources/kro-20211105/AI /opt/gateway/AI \
    && ln -s /resources/kro-20211105/BGM /opt/gateway/BGM \
    && ln -s /resources/kro-20211105/System /opt/gateway/System \
    && chown node:node /opt/gateway/logs
ENTRYPOINT ["/usr/local/bin/happyro-gateway"]
EXPOSE 3338
CMD ["node", "start-prod.js"]
