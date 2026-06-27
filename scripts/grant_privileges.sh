#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_NAME="grant_privileges"
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
USERNAME="${2:-}"

validate_identifier "${DATABASE_NAME}" "database name"
validate_identifier "${USERNAME}" "username"

if [[ -z "${PGHOST:-}" || -z "${PGPORT:-}" || -z "${PGUSER:-}" ]]; then
    log_error "PostgreSQL connection environment variables are required (PGHOST, PGPORT, PGUSER)"
    exit 3
fi

export PGPASSWORD="${PGPASSWORD:-}"

psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres -v ON_ERROR_STOP=1 \
    -c "GRANT ALL PRIVILEGES ON DATABASE \"${DATABASE_NAME}\" TO \"${USERNAME}\""

psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d "${DATABASE_NAME}" -v ON_ERROR_STOP=1 \
    -c "GRANT ALL ON SCHEMA public TO \"${USERNAME}\""

echo "Privileges granted: ${USERNAME} -> ${DATABASE_NAME}"
exit 0
