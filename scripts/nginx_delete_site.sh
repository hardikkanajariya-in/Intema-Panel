#!/usr/bin/env bash
set -euo pipefail

SITE="${1:-}"
SITES_AVAILABLE="${PANEL_NGINX_SITES_AVAILABLE:-/etc/nginx/sites-available}"
SITES_ENABLED="${PANEL_NGINX_SITES_ENABLED:-/etc/nginx/sites-enabled}"

if [[ -z "${SITE}" ]]; then
    echo "ERROR: site name required" >&2
    exit 1
fi

rm -f "${SITES_ENABLED}/${SITE}" "${SITES_AVAILABLE}/${SITE}"
echo "Site deleted: ${SITE}"
exit 0
