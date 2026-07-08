#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

log "Installing PostgreSQL server..."

export DEBIAN_FRONTEND=noninteractive

run_step "Updating system packages" "01-apt-update.sh"
run_step "Installing PostgreSQL" "04-postgresql.sh"

success "PostgreSQL installed and running!"
log ""
log "Next steps:"
log "  sudo intema new database --name=mydb --user=myuser --password=mypassword"
