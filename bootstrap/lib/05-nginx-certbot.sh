#!/usr/bin/env bash
set -euo pipefail

apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
systemctl start nginx

# Ensure the web server has full permission to /var/www
mkdir -p /var/www
chown -R www-data:www-data /var/www
chmod -R 775 /var/www
