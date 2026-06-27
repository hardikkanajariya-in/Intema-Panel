#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-}"
EMAIL="${2:-}"

if [[ -z "${DOMAIN}" || -z "${EMAIL}" ]]; then
    echo "ERROR: domain and email required" >&2
    exit 1
fi

certbot certonly --nginx -d "${DOMAIN}" --non-interactive --agree-tos -m "${EMAIL}"
echo "Certificate obtained for ${DOMAIN}"
exit 0
