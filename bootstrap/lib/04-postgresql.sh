#!/usr/bin/env bash
set -euo pipefail

readonly SUPER_USER="${INTEMA_SUPER_USER:?INTEMA_SUPER_USER is required}"
readonly SUPER_PASSWORD="${INTEMA_SUPER_PASSWORD:?INTEMA_SUPER_PASSWORD is required}"
readonly IDENTIFIER_PATTERN='^[a-z][a-z0-9_]{0,62}$'

if ! [[ "${SUPER_USER}" =~ ${IDENTIFIER_PATTERN} ]]; then
    echo "ERROR: Invalid username: ${SUPER_USER}. Must match ${IDENTIFIER_PATTERN}" >&2
    exit 1
fi

if [[ ${#SUPER_PASSWORD} -lt 8 ]]; then
    echo "ERROR: Password must be at least 8 characters." >&2
    exit 2
fi

# Install PostgreSQL
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql

# Alter default 'postgres' user password
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '${SUPER_PASSWORD}';"

# If a custom superuser was requested, create them
if [[ "${SUPER_USER}" != "postgres" ]]; then
    if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname = '${SUPER_USER}'" | grep -q 1; then
        sudo -u postgres psql -c "ALTER USER \"${SUPER_USER}\" WITH SUPERUSER PASSWORD '${SUPER_PASSWORD}';"
    else
        sudo -u postgres psql -c "CREATE USER \"${SUPER_USER}\" WITH SUPERUSER PASSWORD '${SUPER_PASSWORD}';"
    fi
fi
