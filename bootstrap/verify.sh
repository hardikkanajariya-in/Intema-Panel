#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/common.sh"

log "Verifying Intema Panel installation"
bash "$(dirname "${BASH_SOURCE[0]}")/doctor.sh"
cd "${PANEL_INSTALL_PATH:-$(dirname "${BASH_SOURCE[0]}")/..}"
php artisan about --only=environment,cache,drivers 2>&1 | tee -a "${LOG_FILE}"
test -f public/build/manifest.json
log "Verification passed."
