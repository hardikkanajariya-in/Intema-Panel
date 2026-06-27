#!/usr/bin/env bash
set -euo pipefail

readonly IDENTIFIER_PATTERN='^[a-z][a-z0-9_]{0,62}$'

DATABASE_NAME="${1:-}"
BACKUP_DIR="${PANEL_BACKUP_DIR:-/var/backups/intema-panel}"

if [[ -z "${DATABASE_NAME}" ]]; then
    echo "ERROR: database name required" >&2
    exit 1
fi

if ! [[ "${DATABASE_NAME}" =~ ${IDENTIFIER_PATTERN} ]]; then
    echo "ERROR: invalid database name" >&2
    exit 2
fi

mkdir -p "${BACKUP_DIR}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
FILE="${BACKUP_DIR}/${DATABASE_NAME}_${TIMESTAMP}.sql.gz"

pg_dump -h "${PGHOST}" -p "${PGPORT}" -U "${PGUSER}" "${DATABASE_NAME}" | gzip > "${FILE}"
echo "Backup created: ${FILE}"
exit 0
