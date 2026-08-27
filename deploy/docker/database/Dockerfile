FROM mariadb:10.11

COPY repos/happyro-server/sql-files/ /opt/rathena/sql/
COPY deploy/mariadb/init/20-happyro-databases.sh /docker-entrypoint-initdb.d/20-happyro-databases.sh
