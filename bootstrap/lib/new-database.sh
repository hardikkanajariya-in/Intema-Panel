#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

readonly DB_NAME="${INTEMA_DB_NAME:?INTEMA_DB_NAME is required}"
readonly DB_USER="${INTEMA_DB_USER:?INTEMA_DB_USER is required}"
readonly DB_PASSWORD="${INTEMA_DB_PASSWORD:?INTEMA_DB_PASSWORD is required}"
readonly IDENTIFIER_PATTERN='^[a-z][a-z0-9_]{0,62}$'

# Validate identifiers
if ! [[ "${DB_NAME}" =~ ${IDENTIFIER_PATTERN} ]]; then
    error "Invalid database name: ${DB_NAME}. Must match: ${IDENTIFIER_PATTERN}"
fi

if ! [[ "${DB_USER}" =~ ${IDENTIFIER_PATTERN} ]]; then
    error "Invalid username: ${DB_USER}. Must match: ${IDENTIFIER_PATTERN}"
fi

if [[ ${#DB_PASSWORD} -lt 8 ]]; then
    error "Password must be at least 8 characters."
fi

# Check PostgreSQL is running
if ! command -v psql >/dev/null 2>&1; then
    error "PostgreSQL is not installed. Run 'sudo intema install db' first."
fi

if ! pg_isready >/dev/null 2>&1; then
    error "PostgreSQL is not running. Start it with: sudo systemctl start postgresql"
fi

log "Creating PostgreSQL database: ${DB_NAME}"

# Create user if it doesn't exist
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname = '${DB_USER}'" | grep -q 1; then
    log "User already exists: ${DB_USER}"
else
    sudo -u postgres psql -c "CREATE USER \"${DB_USER}\" WITH PASSWORD '${DB_PASSWORD}'"
    success "User created: ${DB_USER}"
fi

# Create database if it doesn't exist
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1; then
    log "Database already exists: ${DB_NAME}"
else
    sudo -u postgres psql -c "CREATE DATABASE \"${DB_NAME}\" OWNER \"${DB_USER}\""
    success "Database created: ${DB_NAME}"
fi

# Isolation: revoke public access, grant only to the owner
sudo -u postgres psql -d "${DB_NAME}" -c "REVOKE ALL ON SCHEMA public FROM PUBLIC"
sudo -u postgres psql -d "${DB_NAME}" -c "GRANT ALL ON SCHEMA public TO \"${DB_USER}\""
sudo -u postgres psql -d "${DB_NAME}" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO \"${DB_USER}\""
sudo -u postgres psql -d "${DB_NAME}" -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO \"${DB_USER}\""

success "Database ready: ${DB_NAME}"
log ""
log "  Database: ${DB_NAME}"
log "  User:     ${DB_USER}"
log "  Host:     localhost"
log "  Port:     5432"
log ""
log "Connection string:"
log "  postgresql://${DB_USER}:<password>@localhost:5432/${DB_NAME}"
