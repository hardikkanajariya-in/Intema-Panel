#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_NAME="postgres_restore"
readonly IDENTIFIER_PATTERN='^[a-z][a-z0-9_]{0,62}$'

log_error() {
    echo "ERROR [${SCRIPT_NAME}]: $1" >&2
}

validate_identifier() {
    local value="$1"
    local label="$2"

    if [[ -z "${value}" ]]; then
        log_error "${label} is required"
        exit 1
    fi

    if ! [[ "${value}" =~ ${IDENTIFIER_PATTERN} ]]; then
        log_error "Invalid ${label}: must match ${IDENTIFIER_PATTERN}"
        exit 2
    fi
}

DATABASE_NAME="${1:-}"
BACKUP_FILE="${2:-}"
DATABASE_USER="${3:-}"

validate_identifier "${DATABASE_NAME}" "database name"

if [[ -z "${BACKUP_FILE}" ]]; then
    log_error "backup file path is required"
    exit 1
fi

if [[ ! -f "${BACKUP_FILE}" ]]; then
    log_error "Backup file not found: ${BACKUP_FILE}"
    exit 2
fi

if [[ -z "${PGHOST:-}" || -z "${PGPORT:-}" || -z "${PGUSER:-}" ]]; then
    log_error "PostgreSQL connection environment variables are required (PGHOST, PGPORT, PGUSER)"
    exit 3
fi

export PGPASSWORD="${PGPASSWORD:-}"

# Check if database exists
if ! psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres -tAc \
    "SELECT 1 FROM pg_database WHERE datname = '${DATABASE_NAME}'" | grep -q 1; then
    log_error "Database does not exist: ${DATABASE_NAME}"
    exit 4
fi

# Clean the public schema to ensure a clean restore
psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${DATABASE_NAME}" -v ON_ERROR_STOP=1 \
    -c "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;"

if [[ -n "${DATABASE_USER}" ]]; then
    # Grant permissions and ownership to database user
    psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${DATABASE_NAME}" -v ON_ERROR_STOP=1 \
        -c "GRANT ALL ON SCHEMA public TO \"${DATABASE_USER}\"; ALTER SCHEMA public OWNER TO \"${DATABASE_USER}\";"
fi

# Restore database
if [[ "${BACKUP_FILE}" == *.gz ]]; then
    gunzip -c "${BACKUP_FILE}" | psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${DATABASE_NAME}" -v ON_ERROR_STOP=1
else
    psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${DATABASE_NAME}" -v ON_ERROR_STOP=1 < "${BACKUP_FILE}"
fi

echo "Database restored successfully: ${DATABASE_NAME}"
exit 0
