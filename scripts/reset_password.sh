#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_NAME="reset_password"
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

USERNAME="${1:-}"
PASSWORD="${2:-}"

validate_identifier "${USERNAME}" "username"

if [[ -z "${PASSWORD}" ]]; then
    log_error "password is required"
    exit 1
fi

if [[ ${#PASSWORD} -lt 12 ]]; then
    log_error "password must be at least 12 characters"
    exit 2
fi

if [[ -z "${PGHOST:-}" || -z "${PGPORT:-}" || -z "${PGUSER:-}" ]]; then
    log_error "PostgreSQL connection environment variables are required (PGHOST, PGPORT, PGUSER)"
    exit 3
fi

export PGPASSWORD="${PGPASSWORD:-}"

if ! psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres -tAc \
    "SELECT 1 FROM pg_roles WHERE rolname = '${USERNAME}'" | grep -q 1; then
    log_error "User does not exist: ${USERNAME}"
    exit 4
fi

psql -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" -d postgres -v ON_ERROR_STOP=1 \
    -c "ALTER USER \"${USERNAME}\" WITH PASSWORD '${PASSWORD}'"

echo "Password reset: ${USERNAME}"
exit 0
