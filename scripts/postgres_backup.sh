#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_NAME="postgres_backup"
readonly IDENTIFIER_PATTERN='^[a-z][a-z0-9_]{0,62}$'

log_error() {
    echo "ERROR [${SCRIPT_NAME}]: $1" >&2
}

DATABASE_NAME="${1:-}"
FILE_PATH="${2:-}"

if [[ -z "${DATABASE_NAME}" ]]; then
    log_error "database name required"
    exit 1
fi

if ! [[ "${DATABASE_NAME}" =~ ${IDENTIFIER_PATTERN} ]]; then
    log_error "invalid database name"
    exit 2
fi

if [[ -z "${PGHOST:-}" || -z "${PGPORT:-}" || -z "${PGUSER:-}" ]]; then
    log_error "PostgreSQL connection environment variables are required (PGHOST, PGPORT, PGUSER)"
    exit 3
fi

export PGPASSWORD="${PGPASSWORD:-}"

if [[ -z "${FILE_PATH}" ]]; then
    TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
    BACKUP_DIR="${PANEL_BACKUP_DIR:-/var/backups/intema-panel}"
    mkdir -p "${BACKUP_DIR}"
    FILE_PATH="${BACKUP_DIR}/${DATABASE_NAME}_${TIMESTAMP}.sql"
fi

# Ensure parent directory exists
mkdir -p "$(dirname "${FILE_PATH}")"

# Dump database without owner or privilege settings
if [[ "${FILE_PATH}" == *.gz ]]; then
    pg_dump -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -O -x "${DATABASE_NAME}" | gzip > "${FILE_PATH}"
else
    pg_dump -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -O -x "${DATABASE_NAME}" > "${FILE_PATH}"
fi

echo "Backup created: ${FILE_PATH}"
exit 0
