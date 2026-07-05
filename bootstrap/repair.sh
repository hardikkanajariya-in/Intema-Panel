#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/common.sh"

log "Repairing Intema Panel"
APP_DIR="${PANEL_INSTALL_PATH:-$(dirname "${BASH_SOURCE[0]}")/..}"
cd "${APP_DIR}"

mkdir -p "${APP_DIR}/apps" /var/www 2>/dev/null || true
chmod +x scripts/*.sh bootstrap/*.sh bin/intema 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache database apps /var/www 2>/dev/null || true
chmod -R 775 storage bootstrap/cache apps /var/www 2>/dev/null || true
php artisan migrate --force
php artisan config:clear
php artisan route:clear
php artisan view:clear
if [[ -f package.json ]] && { [[ -d node_modules ]] || command -v pnpm >/dev/null 2>&1 || command -v npm >/dev/null 2>&1; }; then
    if command -v pnpm >/dev/null 2>&1; then
        pnpm run build 2>/dev/null || true
    else
        npm run build 2>/dev/null || true
    fi
fi
php artisan config:cache 2>/dev/null || true
php artisan route:cache 2>/dev/null || true
php artisan view:cache 2>/dev/null || true
systemctl restart php8.4-fpm 2>/dev/null || true
systemctl restart nginx 2>/dev/null || true

trap - ERR
log "Repair complete."
