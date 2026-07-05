#!/usr/bin/env bash
set -euo pipefail

DOMAIN_PATTERN='^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'

SITE_NAME="${1:-}"
DOMAIN="${2:-}"
ROOT="${3:-}"
PHP_SOCKET="${4:-unix:/run/php/php8.4-fpm.sock}"

SITES_AVAILABLE="${PANEL_NGINX_SITES_AVAILABLE:-/etc/nginx/sites-available}"

if [[ -z "${SITE_NAME}" || -z "${DOMAIN}" || -z "${ROOT}" ]]; then
    echo "ERROR: site name, domain, and root are required" >&2
    exit 1
fi

if ! [[ "${DOMAIN}" =~ ${DOMAIN_PATTERN} ]]; then
    echo "ERROR: invalid domain" >&2
    exit 2
fi

CONFIG="${SITES_AVAILABLE}/${SITE_NAME}"

if [[ -f "${CONFIG}" ]]; then
    echo "Virtual host already exists: ${SITE_NAME}"
    exit 0
fi

cat > "${CONFIG}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${ROOT};
    index index.php index.html;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass ${PHP_SOCKET};
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

echo "Virtual host created: ${SITE_NAME}"
exit 0
