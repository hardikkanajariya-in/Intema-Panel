#!/usr/bin/env bash
set -euo pipefail

readonly BOOTSTRAP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly LOG_DIR="${BOOTSTRAP_DIR}/logs"
readonly LOG_FILE="${LOG_DIR}/$(basename "${BASH_SOURCE[0]}" .sh)-$(date +%Y%m%d_%H%M%S).log"
readonly ROLLBACK_STACK=()

mkdir -p "${LOG_DIR}"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "${LOG_FILE}"
}

error() {
    log "ERROR: $*"
    exit 1
}

register_rollback() {
    ROLLBACK_STACK+=("$1")
}

run_rollback() {
    log "Rolling back..."
    for ((i=${#ROLLBACK_STACK[@]}-1; i>=0; i--)); do
        log "Rollback: ${ROLLBACK_STACK[$i]}"
        bash -c "${ROLLBACK_STACK[$i]}" || true
    done
}

on_error() {
    log "Command failed. Initiating rollback."
    run_rollback
    exit 1
}

trap on_error ERR

run_step() {
    local name="$1"
    local script="$2"
    log "==> ${name}"
    bash "${BOOTSTRAP_DIR}/lib/${script}" 2>&1 | tee -a "${LOG_FILE}"
}
