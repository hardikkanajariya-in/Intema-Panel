#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/common.sh"

readonly APP_DIR="${PANEL_INSTALL_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

log "Updating Intema Panel at ${APP_DIR}"
cd "${APP_DIR}"

if [[ ! -d "${APP_DIR}/.git" ]]; then
    log "Non-git installation detected. Downloading and running the installer in upgrade mode..."
    curl -fsSL https://raw.githubusercontent.com/hardikkanajariya-in/Intema-Panel/main/bootstrap.sh | bash -s -- --upgrade -y
    exit 0
fi

git pull --ff-only
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
