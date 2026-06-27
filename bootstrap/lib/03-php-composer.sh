#!/usr/bin/env bash
set -euo pipefail

add-apt-repository -y ppa:ondrej/php
apt-get update -y
apt-get install -y \
    php8.3 php8.3-cli php8.3-fpm php8.3-sqlite3 php8.3-pgsql php8.3-mbstring \
    php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl php8.3-gd

if ! command -v composer >/dev/null 2>&1; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi
