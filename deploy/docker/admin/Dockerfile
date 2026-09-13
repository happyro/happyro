FROM node:22-bookworm AS frontend
WORKDIR /build
COPY repos/happyro-admin/frontend/package*.json ./
COPY repos/happyro-admin/frontend/.npmrc ./
RUN npm ci --ignore-scripts
COPY repos/happyro-admin/frontend/ ./
RUN npx max setup && npm run build

FROM php:8.4-fpm-bookworm AS backend
RUN apt-get update && apt-get install -y --no-install-recommends nginx supervisor libicu-dev libonig-dev libzip-dev unzip curl \
    && docker-php-ext-install pdo_mysql mbstring intl zip opcache bcmath \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
WORKDIR /opt/admin
COPY repos/happyro-admin/backend/ ./
RUN composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache
COPY --from=frontend /build/dist/ /opt/admin-ui/
COPY repos/happyro-server/db/map_index.txt /opt/admin/resources/map_index.txt
COPY deploy/docker/admin/nginx.conf /etc/nginx/nginx.conf
COPY deploy/docker/admin/supervisord.conf /etc/supervisor/supervisord.conf
COPY deploy/docker/admin/entrypoint.sh /usr/local/bin/happyro-admin
COPY deploy/docker/admin/exit-listener.py /usr/local/bin/happyro-exit-listener
RUN chmod +x /usr/local/bin/happyro-admin /usr/local/bin/happyro-exit-listener \
    && find /opt/admin /opt/admin-ui -type d -exec chmod 755 {} + \
    && find /opt/admin /opt/admin-ui -type f -exec chmod a+r {} + \
    && chmod 644 /etc/nginx/nginx.conf /etc/supervisor/supervisord.conf
ENV APP_ENV=production APP_DEBUG=false LOG_CHANNEL=stderr
EXPOSE 8080
ENTRYPOINT ["happyro-admin"]
CMD ["serve"]
