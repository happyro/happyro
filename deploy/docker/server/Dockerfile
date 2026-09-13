ARG TARGETPLATFORM
FROM --platform=$TARGETPLATFORM debian:bookworm AS builder

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates cmake g++ make \
       libmariadb-dev libmariadb-dev-compat zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src
COPY repos/happyro-server/ ./
RUN cmake -S . -B /tmp/build -DPACKETVER=20211103 -DCMAKE_BUILD_TYPE=Release \
    && cmake --build /tmp/build --parallel 2

FROM --platform=$TARGETPLATFORM debian:bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends libmariadb3 zlib1g \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/rathena
COPY --from=builder /src/conf/ ./conf/
COPY --from=builder /src/db/ ./db/
COPY --from=builder /src/npc/ ./npc/
COPY --from=builder /src/login-server /opt/rathena/login-server
COPY --from=builder /src/char-server /opt/rathena/char-server
COPY --from=builder /src/map-server /opt/rathena/map-server
COPY --from=builder /src/web-server /opt/rathena/web-server
COPY deploy/docker/server/entrypoint.sh /usr/local/bin/happyro-server
COPY deploy/docker/server/healthcheck.sh /usr/local/bin/happyro-server-health

RUN chmod +x /opt/rathena/login-server /opt/rathena/char-server \
      /opt/rathena/map-server /opt/rathena/web-server /usr/local/bin/happyro-server \
    && chmod +x /usr/local/bin/happyro-server-health \
    && mkdir -p /opt/rathena/log

EXPOSE 6900 6121 5121 8889
ENTRYPOINT ["/usr/local/bin/happyro-server"]
HEALTHCHECK --interval=5s --timeout=3s --retries=60 CMD ["/usr/local/bin/happyro-server-health"]
