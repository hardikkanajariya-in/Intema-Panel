#!/usr/bin/env bash
set -euo pipefail

readonly APP_DIR="${PANEL_INSTALL_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
readonly INSTALL_MODE="${INTEMA_INSTALL_MODE:-auto}"
readonly REPO_URL="${PANEL_REPO_URL:-https://github.com/hardikkanajariya-in/Intema-Panel.git}"

is_built_package() {
    [[ -f "${APP_DIR}/public/build/manifest.json" && -f "${APP_DIR}/vendor/autoload.php" ]]
}

needs_development_build() {
    [[ "${INSTALL_MODE}" == "development" ]] && ! is_built_package
}

configure_application() {
    cd "${APP_DIR}"

    if [[ ! -f .env ]]; then
        cp .env.example .env
    fi

    if ! grep -qE '^APP_KEY=base64:' .env 2>/dev/null; then
        php artisan key:generate --force
    fi

    if [[ ! -f database/database.sqlite ]]; then
        touch database/database.sqlite
    fi

    php artisan migrate --force
    php artisan storage:link --force 2>/dev/null || php artisan storage:link 2>/dev/null || true

    php artisan config:clear 2>/dev/null || true
    php artisan route:clear 2>/dev/null || true
    php artisan view:clear 2>/dev/null || true
    rm -f bootstrap/cache/*.php 2>/dev/null || true

    php artisan config:cache
    php artisan route:cache
    php artisan view:cache

    chmod +x scripts/*.sh bootstrap/*.sh bin/intema 2>/dev/null || true
    chown -R www-data:www-data storage bootstrap/cache database
    chmod -R 775 storage bootstrap/cache
}

build_development_application() {
    mkdir -p "${APP_DIR}"

    if [[ ! -f "${APP_DIR}/composer.json" ]]; then
        git clone "${REPO_URL}" "${APP_DIR}"
    fi

    cd "${APP_DIR}"

    composer install --no-dev --optimize-autoloader --no-interaction --no-cache

    if command -v pnpm >/dev/null 2>&1; then
        pnpm install --frozen-lockfile 2>/dev/null || pnpm install
        pnpm run build
        pnpm store prune || true
    else
        npm ci 2>/dev/null || npm install
        npm run build
        npm cache clean --force || true
    fi

    configure_application
}

mkdir -p "${APP_DIR}"

if [[ "${INSTALL_MODE}" == "production" ]]; then
    if ! is_built_package; then
        echo "ERROR: Production package is incomplete (missing vendor/ or public/build/manifest.json)." >&2
        exit 1
    fi
    configure_application
elif is_built_package; then
    configure_application
elif needs_development_build; then
    build_development_application
elif [[ -d "${APP_DIR}/.git" ]]; then
    build_development_application
else
    if ! is_built_package; then
        echo "ERROR: Application files not found at ${APP_DIR}." >&2
        exit 1
    fi
    configure_application
fi
