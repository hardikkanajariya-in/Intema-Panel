#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/common.sh"

log "Repairing Intema Panel"
APP_DIR="${PANEL_INSTALL_PATH:-$(dirname "${BASH_SOURCE[0]}")/..}"
cd "${APP_DIR}"

chmod +x scripts/*.sh bootstrap/*.sh bin/intema 2>/dev/null || true
chown -R www-data:www-data storage bootstrap/cache database 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true
php artisan migrate --force
php artisan config:clear
php artisan route:clear
php artisan view:clear
npm run build || pnpm run build
systemctl restart php8.3-fpm 2>/dev/null || true
systemctl restart nginx 2>/dev/null || true

trap - ERR
log "Repair complete."
