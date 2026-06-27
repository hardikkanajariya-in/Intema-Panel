#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

log() {
    echo "[update] $1"
}

log "Updating PHP dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader

log "Updating Node.js dependencies..."
npm install

log "Running migrations..."
php artisan migrate --force

log "Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

log "Rebuilding frontend assets..."
npm run build

log "Update complete."
