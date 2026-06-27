#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

log() {
    echo "[uninstall] $1"
}

warning() {
    echo "[uninstall] WARNING: $1"
}

log "This will remove build artifacts and caches."
log "Database files and .env will be preserved."

read -r -p "Continue? [y/N] " confirm
if [[ "${confirm}" != "y" && "${confirm}" != "Y" ]]; then
    log "Aborted."
    exit 0
fi

log "Removing node_modules..."
rm -rf node_modules

log "Removing vendor..."
rm -rf vendor

log "Removing build artifacts..."
rm -rf public/build

log "Clearing Laravel caches..."
rm -rf bootstrap/cache/*.php storage/framework/cache/data/* 2>/dev/null || true

warning "SQLite database preserved at database/database.sqlite"
warning "Environment file preserved at .env"
log "Uninstall complete. Run ./install.sh to reinstall."
