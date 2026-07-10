#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

readonly DOMAIN="${INTEMA_DOMAIN:?INTEMA_DOMAIN is required}"
readonly PLATFORM="${INTEMA_PLATFORM:?INTEMA_PLATFORM is required}"
readonly DOMAIN_PATTERN='^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$'

# Validate domain
if ! [[ "${DOMAIN}" =~ ${DOMAIN_PATTERN} ]]; then
    error "Invalid domain: ${DOMAIN}"
fi

# Validate platform
case "${PLATFORM}" in
    nextjs|nestjs|laravel|static) ;;
    *) error "Unknown platform: ${PLATFORM}. Supported: nextjs, nestjs, laravel, static" ;;
esac

# Determine port for reverse proxy platforms
PORT="${INTEMA_PORT:-}"
if [[ -z "${PORT}" ]]; then
    case "${PLATFORM}" in
        nextjs|nestjs) PORT="3000" ;;
    esac
fi

readonly SITE_ROOT="/var/www/${DOMAIN}"
readonly NGINX_CONF="/etc/nginx/sites-available/${DOMAIN}"
readonly NGINX_LINK="/etc/nginx/sites-enabled/${DOMAIN}"

# Check if site already exists
if [[ -f "${NGINX_CONF}" ]]; then
    error "Site already exists: ${DOMAIN}. Remove ${NGINX_CONF} first."
fi

# Create site directory
log "Creating site directory: ${SITE_ROOT}"
mkdir -p "${SITE_ROOT}"
chown -R www-data:www-data "${SITE_ROOT}"
chmod -R 775 "${SITE_ROOT}"

# Generate nginx config based on platform
log "Generating Nginx config for ${PLATFORM}..."

case "${PLATFORM}" in
    nextjs|nestjs)
        cat > "${NGINX_CONF}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${SITE_ROOT};

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINX
        ;;
    laravel)
        cat > "${NGINX_CONF}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${SITE_ROOT}/public;
    index index.php index.html;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    charset utf-8;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.4-fpm.sock;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
NGINX
        ;;
    static)
        cat > "${NGINX_CONF}" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};
    root ${SITE_ROOT};
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINX
        ;;
esac

# Enable site
log "Enabling site..."
ln -sf "${NGINX_CONF}" "${NGINX_LINK}"

# Test nginx config
log "Testing Nginx configuration..."
if ! nginx -t 2>&1; then
    rm -f "${NGINX_LINK}"
    rm -f "${NGINX_CONF}"
    error "Nginx configuration test failed. Site files removed."
fi

# Reload nginx
systemctl reload nginx

# Obtain SSL certificate
log "Obtaining SSL certificate for ${DOMAIN}..."
if certbot --nginx -d "${DOMAIN}" --non-interactive --agree-tos --register-unsafely-without-email --redirect 2>&1; then
    success "SSL certificate installed for ${DOMAIN}"
else
    warn "Certbot failed. Site is accessible via HTTP. You can retry SSL later with:"
    warn "  sudo intema ssl --domain=${DOMAIN}"
fi

systemctl reload nginx

success "Site created: ${DOMAIN}"
log ""
log "  Platform:   ${PLATFORM}"
log "  Root:       ${SITE_ROOT}"
log "  Nginx conf: ${NGINX_CONF}"
if [[ -n "${PORT:-}" ]]; then
    log "  Proxy port: ${PORT}"
fi
log ""
case "${PLATFORM}" in
    nextjs)
        log "Deploy your Next.js app to ${SITE_ROOT} and run:"
        log "  cd ${SITE_ROOT} && pnpm install && pnpm build"
        log "  pm2 start pnpm --name ${DOMAIN} -- start"
        log "  pm2 save"
        ;;
    nestjs)
        log "Deploy your NestJS app to ${SITE_ROOT} and run:"
        log "  cd ${SITE_ROOT} && pnpm install && pnpm build"
        log "  pm2 start dist/main.js --name ${DOMAIN}"
        log "  pm2 save"
        ;;
    laravel)
        log "Deploy your Laravel app to ${SITE_ROOT} and run:"
        log "  cd ${SITE_ROOT} && composer install --no-dev --optimize-autoloader"
        log "  php artisan migrate --force"
        ;;
    static)
        log "Place your static files in ${SITE_ROOT}"
        ;;
esac
