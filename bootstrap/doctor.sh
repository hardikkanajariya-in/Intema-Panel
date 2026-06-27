#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/common.sh"

log "Intema Panel Doctor"
FAILURES=0

check_command() {
    local label="$1"
    local binary="$2"
    if command -v "${binary}" >/dev/null 2>&1; then
        log "OK: ${label}"
    else
        log "MISSING: ${label} (${binary})"
        FAILURES=$((FAILURES + 1))
    fi
}

check_service() {
    local label="$1"
    local service="$2"
    if systemctl is-active --quiet "${service}" 2>/dev/null; then
        log "OK: ${label} service running"
    else
        log "STOPPED: ${label} service"
        FAILURES=$((FAILURES + 1))
    fi
}

check_command "Git" git
check_command "Curl" curl
check_command "PHP" php
check_command "Composer" composer
check_command "Node.js" node
check_command "NPM" npm
check_command "SQLite" sqlite3
check_command "PostgreSQL client" psql
check_command "Nginx" nginx
check_command "Certbot" certbot
check_command "Supervisor" supervisord
check_command "UFW" ufw
check_command "Fail2Ban" fail2ban-client

php -m | grep -qi sqlite && log "OK: PHP SQLite extension" || { log "MISSING: PHP SQLite extension"; FAILURES=$((FAILURES + 1)); }
php -m | grep -qi pgsql && log "OK: PHP PostgreSQL extension" || { log "MISSING: PHP PostgreSQL extension"; FAILURES=$((FAILURES + 1)); }

check_service "Nginx" nginx
check_service "PostgreSQL" postgresql
check_service "PHP-FPM" php8.3-fpm

APP_DIR="${PANEL_INSTALL_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
if [[ -f "${APP_DIR}/.env" && -f "${APP_DIR}/database/database.sqlite" ]]; then
    log "OK: Panel application configured"
else
    log "WARN: Panel application not fully configured"
    FAILURES=$((FAILURES + 1))
fi

if [[ -f "${APP_DIR}/public/build/manifest.json" ]]; then
    log "OK: Frontend build present"
else
    log "MISSING: Frontend build (public/build/manifest.json)"
    FAILURES=$((FAILURES + 1))
fi

if [[ "${FAILURES}" -gt 0 ]]; then
    log "Doctor found ${FAILURES} issue(s)."
    exit 1
fi

log "Doctor: all checks passed."
trap - ERR
