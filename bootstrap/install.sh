#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/common.sh"

log "Intema Panel Bootstrap Installer"
log "Log file: ${LOG_FILE}"

run_step "Updating Ubuntu" "01-apt-update.sh"
run_step "Installing base packages" "02-base-packages.sh"
run_step "Installing PHP and Composer" "03-php-composer.sh"
run_step "Installing PostgreSQL" "04-postgresql.sh"
run_step "Installing Nginx and Certbot" "05-nginx-certbot.sh"
run_step "Installing Node.js and Supervisor" "06-node-supervisor.sh"
run_step "Deploying application" "07-application.sh"
run_step "Configuring Nginx virtual host" "08-nginx-vhost.sh"
run_step "Verifying installation" "verify-install.sh"

trap - ERR
log "Installation complete."
log "Open http://$(hostname -I | awk '{print $1}') to complete the setup wizard."
