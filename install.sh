#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

log() {
    echo "[install] $1"
}

error() {
    echo "[install] ERROR: $1" >&2
    exit 1
}

require_command() {
    if ! command -v "$1" >/dev/null 2>&1; then
        error "Required command not found: $1"
    fi
}

log "Checking system requirements..."
require_command php
require_command composer
require_command node
require_command npm

PHP_VERSION="$(php -r 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;')"
log "PHP version: ${PHP_VERSION}"

log "Installing PHP dependencies..."
composer install --no-interaction --prefer-dist

log "Installing Node.js dependencies..."
npm install

if [[ ! -f .env ]]; then
    log "Creating environment file..."
    cp .env.example .env
    php artisan key:generate --force
fi

if [[ ! -f database/database.sqlite ]]; then
    log "Creating SQLite database..."
    touch database/database.sqlite
fi

log "Running migrations..."
php artisan migrate --force

if [[ -z "${ADMIN_PASSWORD:-}" ]]; then
    ADMIN_PASSWORD="$(openssl rand -base64 16)"
    log "Generated administrator password"
fi

export ADMIN_PASSWORD
log "Seeding administrator account..."
php artisan db:seed --force

log "Making scripts executable..."
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x update.sh uninstall.sh doctor.sh 2>/dev/null || true

log "Building frontend assets..."
npm run build

log "Installation complete."
log "Administrator email: ${ADMIN_EMAIL:-admin@localhost}"
log "Administrator password: ${ADMIN_PASSWORD}"
log "Start the development server with: composer run dev"
log "Production URL: configure Nginx to serve the public/ directory"
