#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_NAME="create_database"
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
DATABASE_USER="${2:-}"
validate_identifier "${DATABASE_NAME}" "database name"
validate_identifier "${DATABASE_USER}" "database user"

if [[ -z "${PGHOST:-}" || -z "${PGPORT:-}" || -z "${PGUSER:-}" ]]; then
    log_error "PostgreSQL connection environment variables are required (PGHOST, PGPORT, PGUSER)"
    exit 3
fi

export PGPASSWORD="${PGPASSWORD:-}"

if psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres -tAc \
    "SELECT 1 FROM pg_database WHERE datname = '${DATABASE_NAME}'" | grep -q 1; then
    echo "Database already exists: ${DATABASE_NAME}"
    exit 0
fi

psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres -v ON_ERROR_STOP=1 \
    -c "CREATE DATABASE \"${DATABASE_NAME}\" OWNER \"${DATABASE_USER}\""

echo "Database created: ${DATABASE_NAME} (Owner: ${DATABASE_USER})"
exit 0
