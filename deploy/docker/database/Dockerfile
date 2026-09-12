FROM mariadb:10.11

COPY repos/happyro-server/sql-files/ /opt/rathena/sql/
COPY deploy/mariadb/init/20-happyro-databases.sh /docker-entrypoint-initdb.d/20-happyro-databases.sh
COPY deploy/docker/database/30-admin.sh /docker-entrypoint-initdb.d/30-admin.sh
RUN chmod 755 /docker-entrypoint-initdb.d/*.sh \
    && find /opt/rathena/sql -type d -exec chmod 755 {} + \
    && find /opt/rathena/sql -type f -exec chmod 644 {} +
