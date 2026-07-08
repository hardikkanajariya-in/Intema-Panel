#!/usr/bin/env bash
set -euo pipefail

readonly INTEMA_ROOT="${INTEMA_ROOT:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)}"
readonly INTEMA_LOG_DIR="${INTEMA_ROOT}/logs"
readonly INTEMA_LOG_FILE="${INTEMA_LOG_DIR}/intema-$(date +%Y%m%d_%H%M%S).log"

mkdir -p "${INTEMA_LOG_DIR}"

log() {
    echo "[intema] $*" | tee -a "${INTEMA_LOG_FILE}"
}

error() {
    echo "[intema] ERROR: $*" >&2
    exit 1
}

warn() {
    echo "[intema] WARNING: $*" | tee -a "${INTEMA_LOG_FILE}"
}

success() {
    echo "[intema] ✓ $*" | tee -a "${INTEMA_LOG_FILE}"
}

run_step() {
    local name="$1"
    local script="$2"
    log "==> ${name}"
    bash "${INTEMA_ROOT}/bootstrap/lib/${script}" 2>&1 | tee -a "${INTEMA_LOG_FILE}"
}
