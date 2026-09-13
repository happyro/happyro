#!/bin/bash
set -eu
case "$(cat /run/happyro-service)" in
  login-server) port=6900 ;;
  char-server) port=6121 ;;
  map-server) port=5121 ;;
  web-server) port=8889 ;;
  *) exit 1 ;;
esac
exec 3<>/dev/tcp/127.0.0.1/$port
