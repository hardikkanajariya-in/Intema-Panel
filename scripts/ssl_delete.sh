#!/usr/bin/env bash
set -euo pipefail

DOMAIN="${1:-}"

if [[ -z "${DOMAIN}" ]]; then
    echo "ERROR: domain required" >&2
    exit 1
fi

certbot delete --cert-name "${DOMAIN}" --non-interactive
echo "Certificate deleted: ${DOMAIN}"
exit 0
