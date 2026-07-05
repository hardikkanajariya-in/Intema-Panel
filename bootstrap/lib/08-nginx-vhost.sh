#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR="${PANEL_INSTALL_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
if [[ -z "${PANEL_DOMAIN:-}" ]]; then
    echo "ERROR: PANEL_DOMAIN is required to configure the Nginx virtual host." >&2
    exit 1
fi

cat > /etc/nginx/sites-available/intema-panel <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${PANEL_DOMAIN};
    root ${APP_DIR}/public;
    index index.php;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
    }
}
EOF

ln -sf /etc/nginx/sites-available/intema-panel /etc/nginx/sites-enabled/intema-panel
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
systemctl restart php8.4-fpm

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

if command -v certbot >/dev/null 2>&1; then
    echo "Attempting to obtain SSL certificate for ${PANEL_DOMAIN} using Certbot..."
    if certbot --nginx -d "${PANEL_DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email --redirect; then
        echo "SSL certificate installed successfully."
    else
        echo "WARNING: Certbot failed to obtain a certificate. You can configure SSL later via the panel. Accessing the panel via http://${PANEL_DOMAIN} will still be active."
    fi
    systemctl reload nginx
fi

SWAP_SIZE="${PANEL_SWAP_SIZE:-2G}"
if ! swapon --show | grep -q '/swapfile'; then
    fallocate -l "${SWAP_SIZE}" /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
