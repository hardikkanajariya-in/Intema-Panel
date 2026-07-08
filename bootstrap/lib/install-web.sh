#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "Installing web stack..."
log "This will install: Nginx, Certbot, Node.js LTS, pnpm, PM2, PHP 8.4 (with extensions)"

export DEBIAN_FRONTEND=noninteractive

run_step "Updating system packages" "01-apt-update.sh"
run_step "Installing base packages" "02-base-packages.sh"
run_step "Installing PHP 8.4 and Composer" "03-php-composer.sh"
run_step "Installing Nginx and Certbot" "05-nginx-certbot.sh"
run_step "Installing Node.js, pnpm, and PM2" "06-node-supervisor.sh"

# Configure firewall
log "Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

success "Web stack installed successfully!"
log ""
log "Installed components:"
log "  - Nginx (web server)"
log "  - Certbot (SSL certificates)"
log "  - PHP 8.4 + FPM (with pgsql, mysql, sqlite, redis, gd, imagick extensions)"
log "  - Composer (PHP package manager)"
log "  - Node.js LTS + pnpm + PM2 (Node runtime and process manager)"
log "  - UFW firewall (SSH + HTTP/HTTPS allowed)"
log ""
log "Next steps:"
log "  sudo intema install db        # Install PostgreSQL (optional)"
log "  sudo intema new --domain=example.com --plt=nextjs   # Create a site"
