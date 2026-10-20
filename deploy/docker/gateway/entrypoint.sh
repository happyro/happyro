#!/bin/sh
set -eu

if [ "$#" -eq 0 ] || [ "$1" = '--help' ] || [ "$1" = '--no-color' ]; then
    if [ "${1:-}" = '--no-color' ] || [ "${2:-}" = '--no-color' ]; then
        printf '\nHappyRO Gateway\n\nUsage: happyro-gateway COMMAND [ARGUMENTS...]\n\nExample: happyro-gateway node start-prod.js\n\n'
    else
        printf '\n\033[1;36mHappyRO Gateway\033[0m\n\n\033[1;33mUsage\033[0m\n  \033[1;32mhappyro-gateway COMMAND [ARGUMENTS...]\033[0m\n\n\033[1;33mExample\033[0m\n  \033[36mhappyro-gateway node start-prod.js\033[0m\n\n'
    fi
    exit 0
fi

logs=/opt/gateway/logs
fail() {
    printf 'HappyRO Gateway: cannot initialize %s; ensure the log mount is writable and permits ownership and permission changes.\n' "$logs" >&2
    exit 1
}

# Bind mounts hide the ownership set in the image. Only repair logs, never resources.
[ ! -L "$logs" ] || fail
mkdir -p "$logs" || fail
# Do not follow links in existing logs into other mounted directories.
find "$logs" -xdev \( -type d -o -type f \) -exec chown --no-dereference node:node {} + || fail
find "$logs" -xdev -type d -exec chmod u+rwx {} + || fail
find "$logs" -xdev -type f -exec chmod u+rw {} + || fail

exec gosu node "$@"
