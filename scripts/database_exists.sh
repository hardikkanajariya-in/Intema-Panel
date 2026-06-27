#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_NAME="database_exists"
readonly IDENTIFIER_PATTERN='^[a-z][a-z0-9_]{0,62}$'

log_error() {
    echo "ERROR [${SCRIPT_NAME}]: $1" >&2
}

DATABASE_NAME="${1:-}"

if [[ -z "${DATABASE_NAME}" ]]; then
    log_error "database name is required"
    exit 1
fi

if ! [[ "${DATABASE_NAME}" =~ ${IDENTIFIER_PATTERN} ]]; then
    log_error "Invalid database name"
    exit 2
fi

if [[ -z "${PGHOST:-}" || -z "${PGPORT:-}" || -z "${PGUSER:-}" ]]; then
    log_error "PostgreSQL connection environment variables are required (PGHOST, PGPORT, PGUSER)"
    exit 3
fi

export PGPASSWORD="${PGPASSWORD:-}"

if psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres -tAc \
    "SELECT 1 FROM pg_database WHERE datname = '${DATABASE_NAME}'" | grep -q 1; then
    echo "exists"
    exit 0
fi

echo "not_found"
exit 1
