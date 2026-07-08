#!/usr/bin/env bash
set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lib/common.sh"

log "Intema CLI Installer"
log "Installing CLI tool to /usr/local/bin/intema"

readonly INSTALL_DIR="${PANEL_INSTALL_PATH:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"

# Set permissions on all scripts
chmod +x "${INSTALL_DIR}/bin/intema" 2>/dev/null || true
chmod +x "${INSTALL_DIR}/bootstrap/lib/"*.sh 2>/dev/null || true
chmod +x "${INSTALL_DIR}/scripts/"*.sh 2>/dev/null || true

# Create symlink
ln -sf "${INSTALL_DIR}/bin/intema" /usr/local/bin/intema

success "Intema CLI installed!"
log ""
log "Usage:"
log "  sudo intema install web    # Install web stack"
log "  sudo intema install db     # Install PostgreSQL"
log "  intema --help              # Show all commands"
