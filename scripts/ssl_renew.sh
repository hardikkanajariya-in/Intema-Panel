#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-all}"

if [[ "${TARGET}" == "all" ]]; then
    certbot renew --quiet
    echo "All certificates renewed"
    exit 0
fi

certbot renew --cert-name "${TARGET}" --quiet
echo "Certificate renewed: ${TARGET}"
exit 0
