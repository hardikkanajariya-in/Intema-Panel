#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR="${PANEL_INSTALL_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
readonly SERVER_NAME="${PANEL_SERVER_NAME:-_}"

cat > /etc/nginx/sites-available/intema-panel <<EOF
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name ${SERVER_NAME};
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

SWAP_SIZE="${PANEL_SWAP_SIZE:-2G}"
if ! swapon --show | grep -q '/swapfile'; then
    fallocate -l "${SWAP_SIZE}" /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    grep -q '/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi
