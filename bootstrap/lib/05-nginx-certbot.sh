#!/usr/bin/env bash
set -euo pipefail

apt-get install -y nginx certbot python3-certbot-nginx
systemctl enable nginx
systemctl start nginx
