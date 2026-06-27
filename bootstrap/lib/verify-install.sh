#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR="${PANEL_INSTALL_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

cd "${APP_DIR}"
php artisan about --only=environment,cache,drivers
test -f public/build/manifest.json
test -f .env
test -f database/database.sqlite
