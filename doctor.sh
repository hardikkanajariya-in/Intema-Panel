#!/usr/bin/env bash
set -euo pipefail

readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "${SCRIPT_DIR}"

pass() { echo "[doctor] ✓ $1"; }
fail() { echo "[doctor] ✗ $1"; }
warn() { echo "[doctor] ! $1"; }

ERRORS=0

check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        pass "$1 found"
    else
        fail "$1 not found"
        ERRORS=$((ERRORS + 1))
    fi
}

log_section() {
    echo ""
    echo "[doctor] === $1 ==="
}

log_section "Commands"
check_command php
check_command composer
check_command node
check_command npm

log_section "PHP"
php -v | head -1
php -m | grep -q pdo_sqlite && pass "pdo_sqlite extension" || { fail "pdo_sqlite extension"; ERRORS=$((ERRORS + 1)); }

log_section "Environment"
[[ -f .env ]] && pass ".env exists" || { fail ".env missing"; ERRORS=$((ERRORS + 1)); }
[[ -f database/database.sqlite ]] && pass "SQLite database exists" || warn "SQLite database not created yet"

log_section "Permissions"
[[ -w storage ]] && pass "storage writable" || { fail "storage not writable"; ERRORS=$((ERRORS + 1)); }
[[ -w bootstrap/cache ]] && pass "bootstrap/cache writable" || { fail "bootstrap/cache not writable"; ERRORS=$((ERRORS + 1)); }

log_section "Scripts"
for script in scripts/*.sh; do
    if [[ -x "${script}" ]]; then
        pass "$(basename "${script}") executable"
    else
        warn "$(basename "${script}") not executable (run: chmod +x ${script})"
    fi
done

log_section "Services"
if command -v pg_isready >/dev/null 2>&1; then
    pg_isready >/dev/null 2>&1 && pass "PostgreSQL reachable" || warn "PostgreSQL not reachable"
else
    warn "pg_isready not found"
fi

if command -v systemctl >/dev/null 2>&1; then
    systemctl is-active nginx >/dev/null 2>&1 && pass "Nginx running" || warn "Nginx not running"
else
    warn "systemctl not found"
fi

log_section "Build"
[[ -f public/build/manifest.json ]] && pass "Vite build exists" || warn "Run npm run build"

echo ""
if [[ ${ERRORS} -eq 0 ]]; then
    echo "[doctor] All critical checks passed."
    exit 0
else
    echo "[doctor] ${ERRORS} critical issue(s) found."
    exit 1
fi
