#!/bin/sh
set -eu
if [ "$#" -eq 0 ]; then
    printf '\n\033[1;36mHappyRO Admin\033[0m\n\n\033[1;33mCommands\033[0m\n  \033[1;32mserve | initialize | artisan\033[0m\n\n\033[36mExample: happyro-admin artisan gm:user:create administrator\033[0m\n\n'
    exit 0
fi
if [ "$1" = '--no-color' ] || [ "$1" = '--help' ]; then
    printf '\nHappyRO Admin\n\nCommands: serve | initialize | artisan\nExample: happyro-admin artisan gm:user:create administrator\n\n'
    exit 0
fi
: "${APP_KEY:?APP_KEY is required}"
mkdir -p /opt/admin/storage/framework/cache /opt/admin/storage/framework/sessions /opt/admin/storage/framework/views /opt/admin/storage/logs /run/happyro-settings
chown -R www-data:www-data /opt/admin/storage /opt/admin/bootstrap/cache
chown www-data:www-data /run/happyro-settings
if [ -f /run/happyro-settings/battle_conf.txt ]; then
    chown www-data:www-data /run/happyro-settings/battle_conf.txt
fi
case "$1" in
    serve) exec supervisord -c /etc/supervisor/supervisord.conf ;;
    initialize)
        php artisan migrate --force
        php -d memory_limit=512M artisan game-data:import-items --all --no-color
        php -d memory_limit=512M artisan game-data:import-monsters --renewal --no-color
        ;;
    artisan) shift; exec php artisan "$@" ;;
    *) printf 'Unknown command: %s\n' "$1" >&2; exit 2 ;;
esac
