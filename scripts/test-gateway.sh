#!/usr/bin/env bash
set -euo pipefail

# shellcheck disable=SC1091
source "$(dirname "$0")/lib.sh"

cd "$GATEWAY_REPO"

[[ -d node_modules ]] || npm install --ignore-scripts

node --check index.js
node --check src/controllers/clientController.js
node --check src/validators/startupValidator.js

if [[ -f resources/DATA.INI ]]; then
	npm run doctor
else
	echo "gateway static checks passed; resource validation pending (resources/DATA.INI is absent)"
fi
