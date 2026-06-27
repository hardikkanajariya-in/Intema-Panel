#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR="${PANEL_INSTALL_PATH:-/var/www/intema-panel}"
readonly REPO_URL="${PANEL_REPO_URL:-https://github.com/hardikkanajariya/intema-panel.git}"

mkdir -p "${APP_DIR}"
if [[ ! -d "${APP_DIR}/.git" ]]; then
    git clone "${REPO_URL}" "${APP_DIR}"
fi

cd "${APP_DIR}"
composer install --no-dev --optimize-autoloader --no-interaction
npm ci
cp -n .env.example .env
php artisan key:generate --force
touch database/database.sqlite
php artisan migrate --force
chmod +x scripts/*.sh bootstrap/*.sh bin/intema 2>/dev/null || true
npm run build
chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache
