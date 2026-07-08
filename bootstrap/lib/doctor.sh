#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

ERRORS=0

pass() { echo "[intema] ✓ $1"; }
fail() { echo "[intema] ✗ $1"; ERRORS=$((ERRORS + 1)); }
info() { echo "[intema] ! $1"; }
section() { echo ""; echo "[intema] === $1 ==="; }

check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        pass "$1 $(command -v "$1")"
    else
        fail "$1 not found"
    fi
}

echo "[intema] System Health Check"

section "Web Stack"
check_command nginx
check_command certbot
check_command node
check_command pnpm
check_command pm2
check_command php
check_command composer

section "Database"
if command -v psql >/dev/null 2>&1; then
    pass "PostgreSQL client installed"
    if pg_isready >/dev/null 2>&1; then
        pass "PostgreSQL server running"
    else
        info "PostgreSQL server not running"
    fi
else
    info "PostgreSQL not installed (run: sudo intema install db)"
fi

section "Services"
if command -v systemctl >/dev/null 2>&1; then
    for svc in nginx php8.4-fpm postgresql; do
        if systemctl is-active "${svc}" >/dev/null 2>&1; then
            pass "${svc} running"
        else
            info "${svc} not running"
        fi
    done
fi

section "PHP Extensions"
if command -v php >/dev/null 2>&1; then
    php -v | head -1
    for ext in pdo_pgsql pdo_mysql pdo_sqlite mbstring xml curl zip bcmath intl gd redis imagick; do
        if php -m 2>/dev/null | grep -qi "^${ext}$"; then
            pass "php-${ext}"
        else
            info "php-${ext} not loaded"
        fi
    done
fi

section "Firewall"
if command -v ufw >/dev/null 2>&1; then
    if ufw status | grep -q "Status: active"; then
        pass "UFW active"
    else
        info "UFW not active"
    fi
fi

section "Sites"
if [[ -d /etc/nginx/sites-enabled ]]; then
    for site in /etc/nginx/sites-enabled/*; do
        if [[ -f "${site}" ]] && [[ "$(basename "${site}")" != "default" ]]; then
            pass "Site: $(basename "${site}")"
        fi
    done
fi

echo ""
if [[ ${ERRORS} -eq 0 ]]; then
    echo "[intema] All checks passed."
    exit 0
else
    echo "[intema] ${ERRORS} issue(s) found."
    exit 1
fi
