#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

readonly DB_NAME="${INTEMA_DB_NAME:?INTEMA_DB_NAME is required}"
readonly IDENTIFIER_PATTERN='^[a-z][a-z0-9_]{0,62}$'

# Validate identifier
if ! [[ "${DB_NAME}" =~ ${IDENTIFIER_PATTERN} ]]; then
    error "Invalid database name: ${DB_NAME}. Must match: ${IDENTIFIER_PATTERN}"
fi

# Check PostgreSQL is running
if ! command -v psql >/dev/null 2>&1; then
    error "PostgreSQL is not installed."
fi

if ! pg_isready >/dev/null 2>&1; then
    error "PostgreSQL is not running. Start it with: sudo systemctl start postgresql"
fi

log "Deleting PostgreSQL database: ${DB_NAME}"

# Terminate active connections to the database so we can drop it
sudo -u postgres psql -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${DB_NAME}' AND pid <> pg_backend_pid()" || true

# Drop database if it exists
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1; then
    sudo -u postgres psql -c "DROP DATABASE \"${DB_NAME}\""
    success "Database deleted: ${DB_NAME}"
else
    log "Database does not exist: ${DB_NAME}"
fi
