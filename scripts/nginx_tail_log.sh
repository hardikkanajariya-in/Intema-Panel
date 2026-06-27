#!/usr/bin/env bash
set -euo pipefail

LOG_TYPE="${1:-error}"
LINES="${2:-100}"
LOG_FILE="/var/log/nginx/${LOG_TYPE}.log"

if [[ ! -f "${LOG_FILE}" ]]; then
    echo "ERROR: log file not found" >&2
    exit 1
fi

tail -n "${LINES}" "${LOG_FILE}"
exit 0
