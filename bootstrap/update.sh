#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/common.sh"

readonly APP_DIR="${PANEL_INSTALL_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

log "Updating Intema Panel at ${APP_DIR}"
cd "${APP_DIR}"

git pull --ff-only 2>/dev/null || log "Skipping git pull (not a git repository)"
composer install --no-dev --optimize-autoloader --no-interaction

if ! command -v pnpm >/dev/null 2>&1; then
    log "Installing pnpm..."
    npm install -g pnpm
fi

pnpm install --frozen-lockfile 2>/dev/null || pnpm install
php artisan migrate --force
php artisan config:clear
php artisan route:clear
php artisan view:clear
pnpm run build
pnpm store prune || true
systemctl reload php8.4-fpm 2>/dev/null || true
systemctl reload nginx 2>/dev/null || true

trap - ERR
log "Update complete."
