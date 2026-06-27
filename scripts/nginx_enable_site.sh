#!/usr/bin/env bash
set -euo pipefail

SITE="${1:-}"
SITES_AVAILABLE="${PANEL_NGINX_SITES_AVAILABLE:-/etc/nginx/sites-available}"
SITES_ENABLED="${PANEL_NGINX_SITES_ENABLED:-/etc/nginx/sites-enabled}"

if [[ -z "${SITE}" ]]; then
    echo "ERROR: site name required" >&2
    exit 1
fi

if [[ ! -f "${SITES_AVAILABLE}/${SITE}" ]]; then
    echo "ERROR: site config not found" >&2
    exit 2
fi

ln -sf "${SITES_AVAILABLE}/${SITE}" "${SITES_ENABLED}/${SITE}"
echo "Site enabled: ${SITE}"
exit 0
