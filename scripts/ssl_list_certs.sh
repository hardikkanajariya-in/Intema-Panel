#!/usr/bin/env bash
set -euo pipefail

CERT_ROOT="${CERTBOT_ROOT:-/etc/letsencrypt/live}"

if [[ ! -d "${CERT_ROOT}" ]]; then
    exit 0
fi

for domain_path in "${CERT_ROOT}"/*; do
    [[ -d "${domain_path}" ]] || continue
    domain="$(basename "${domain_path}")"
    expiry="$(openssl x509 -enddate -noout -in "${domain_path}/cert.pem" 2>/dev/null | cut -d= -f2 || echo 'unknown')"
    echo "${domain}|${expiry}"
done

exit 0
