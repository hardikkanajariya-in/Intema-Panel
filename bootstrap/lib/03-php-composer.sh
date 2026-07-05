#!/usr/bin/env bash
set -euo pipefail

# Detect Ubuntu Codename
CODENAME=""
if [ -f /etc/os-release ]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    CODENAME="${VERSION_CODENAME:-}"
fi
if [ -z "${CODENAME}" ] && command -v lsb_release >/dev/null 2>&1; then
    CODENAME="$(lsb_release -sc)"
fi

if [[ "${CODENAME}" == "resolute" ]]; then
    # For Ubuntu Resolute, the canonical way is to use packages.sury.org
    apt-get update -y
    apt-get install -y apt-transport-https lsb-release ca-certificates curl gnupg
    curl -sSLo /usr/share/keyrings/deb.sury.org-php.gpg https://packages.sury.org/php/apt.gpg
    echo "deb [signed-by=/usr/share/keyrings/deb.sury.org-php.gpg] https://packages.sury.org/php/ resolute main" > /etc/apt/sources.list.d/php.list
else
    add-apt-repository -y ppa:ondrej/php
fi
apt-get update -y
apt-get install -y \
    php8.3 php8.3-cli php8.3-fpm php8.3-sqlite3 php8.3-pgsql php8.3-mbstring \
    php8.3-xml php8.3-curl php8.3-zip php8.3-bcmath php8.3-intl php8.3-gd

if ! command -v composer >/dev/null 2>&1; then
    curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
fi
