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

# ─── Configure Remote Access & SSL (Cloud-ready) ──────────────────────────

# Determine PostgreSQL version and config path
readonly PG_VERSION=$(psql --version | awk '{print $3}' | cut -d. -f1)
readonly PG_CONF_DIR="/etc/postgresql/${PG_VERSION}/main"

if [[ -d "${PG_CONF_DIR}" ]]; then
    echo "Configuring PostgreSQL ${PG_VERSION} for secure remote access..."

    # 1. Listen on all network interfaces
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" "${PG_CONF_DIR}/postgresql.conf"
    sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/g" "${PG_CONF_DIR}/postgresql.conf"

    # 2. Force SSL/TLS and use SCRAM-SHA-256 for all remote host connections
    # We append these to pg_hba.conf
    if [[ -f "${PG_CONF_DIR}/pg_hba.conf" ]]; then
        # Add scram-sha-256 as default encryption method if not already there
        sed -i "s/#password_encryption = scram-sha-256/password_encryption = scram-sha-256/g" "${PG_CONF_DIR}/postgresql.conf" || true
        
        # Remove old matching wildcard records to avoid duplicate rules
        sed -i '/hostssl.*all.*all.*0.0.0.0\/0/d' "${PG_CONF_DIR}/pg_hba.conf"
        sed -i '/hostssl.*all.*all.*::\/0/d' "${PG_CONF_DIR}/pg_hba.conf"

        # Append remote SSL-only SCRAM rules
        echo "hostssl all all 0.0.0.0/0 scram-sha-256" >> "${PG_CONF_DIR}/pg_hba.conf"
        echo "hostssl all all ::/0 scram-sha-256" >> "${PG_CONF_DIR}/pg_hba.conf"
    fi

    # Restart PostgreSQL to apply changes
    systemctl restart postgresql
    echo "PostgreSQL remote connections enabled & SSL required successfully."
else
    echo "WARNING: Could not find PostgreSQL config directory at ${PG_CONF_DIR}." >&2
fi

# ─── Configure Firewall ──────────────────────────────────────────────────────

if command -v ufw >/dev/null 2>&1; then
    echo "Opening PostgreSQL port 5432 in firewall..."
    ufw allow 5432/tcp
    if ufw status | grep -q "Status: active"; then
        ufw reload
    fi
fi

# ─── Save Configuration ──────────────────────────────────────────────────────

echo "Saving global configuration..."
mkdir -p /etc/intema
if [[ -n "${INTEMA_SUPER_DOMAIN:-}" ]]; then
    echo "INTEMA_DB_DOMAIN=\"${INTEMA_SUPER_DOMAIN}\"" > /etc/intema/config
else
    touch /etc/intema/config
fi
