#!/usr/bin/env bash
#
# Intema CLI Bootstrap Loader
# Downloads and installs the Intema CLI tool.
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/hardikkanajariya-in/Intema-Panel/main/bootstrap.sh | sudo bash
#   ./bootstrap.sh [--version=v1.0.0] [--branch=main] [-y]
#
set -euo pipefail

readonly INTEMA_GITHUB_REPO="${INTEMA_GITHUB_REPO:-hardikkanajariya-in/Intema-Panel}"
readonly INTEMA_INSTALL_DIR="${INTEMA_INSTALL_DIR:-/opt/intema}"
readonly INTEMA_RELEASE_ASSET="intema.tar.gz"
readonly INTEMA_CHECKSUM_ASSET="intema.tar.gz.sha256"

INTEMA_VERSION=""
INTEMA_BRANCH=""
INTEMA_ASSUME_YES=false

log() {
    echo "[intema-bootstrap] $*"
}

error() {
    echo "[intema-bootstrap] ERROR: $*" >&2
    exit "${2:-1}"
}

usage() {
    cat <<'EOF'
Intema CLI Bootstrap Loader

Usage:
  bootstrap.sh [options]

Options:
  --version=TAG     Install a specific release (e.g. v1.0.0)
  --branch=BRANCH   Development mode: use a Git branch archive
  -y, --yes         Non-interactive: assume yes for prompts
  -h, --help        Show this help

Examples:
  curl -fsSL https://raw.githubusercontent.com/hardikkanajariya-in/Intema-Panel/main/bootstrap.sh | sudo bash
  ./bootstrap.sh --version=v1.0.0
  ./bootstrap.sh --branch=main
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --version=*) INTEMA_VERSION="${1#*=}" ;;
            --version) shift; INTEMA_VERSION="${1:-}"; [[ -n "${INTEMA_VERSION}" ]] || error "Missing value for --version" 1 ;;
            --branch=*) INTEMA_BRANCH="${1#*=}" ;;
            --branch) shift; INTEMA_BRANCH="${1:-}"; [[ -n "${INTEMA_BRANCH}" ]] || error "Missing value for --branch" 1 ;;
            -y | --yes) INTEMA_ASSUME_YES=true ;;
            -h | --help) usage; exit 0 ;;
            *) error "Unknown option: $1" 1 ;;
        esac
        shift
    done
}

require_root() {
    if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
        error "This installer must be run as root (use sudo)." 1
    fi
}

detect_ubuntu() {
    if [[ ! -f /etc/os-release ]]; then
        error "Cannot detect operating system (/etc/os-release missing)." 2
    fi

    # shellcheck disable=SC1091
    source /etc/os-release

    if [[ "${ID:-}" != "ubuntu" ]]; then
        error "Ubuntu is required (detected: ${ID:-unknown})." 2
    fi

    local arch
    arch="$(uname -m)"
    log "Detected Ubuntu ${VERSION_ID:-unknown} (${arch})"
}

detect_local_repository() {
    local script_source="${BASH_SOURCE[0]:-}"

    if [[ -z "${script_source}" || "${script_source}" == "bash" || "${script_source}" == "/dev/fd/"* || "${script_source}" == "/dev/stdin" ]]; then
        return 1
    fi

    if [[ ! -f "${script_source}" ]]; then
        return 1
    fi

    local script_dir
    script_dir="$(cd "$(dirname "${script_source}")" && pwd)"

    if [[ -f "${script_dir}/bootstrap/install.sh" ]]; then
        echo "${script_dir}"
        return 0
    fi

    return 1
}

download_file() {
    local url="$1"
    local dest="$2"

    log "Downloading ${url}"
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL --retry 3 --retry-delay 2 -o "${dest}" "${url}"
    elif command -v wget >/dev/null 2>&1; then
        wget -q -O "${dest}" "${url}"
    else
        error "curl or wget is required." 3
    fi
}

release_download_url() {
    if [[ -n "${INTEMA_VERSION}" ]]; then
        local tag="${INTEMA_VERSION}"
        [[ "${tag}" == v* ]] || tag="v${tag}"
        echo "https://github.com/${INTEMA_GITHUB_REPO}/releases/download/${tag}/${INTEMA_RELEASE_ASSET}"
        return
    fi
    echo "https://github.com/${INTEMA_GITHUB_REPO}/releases/latest/download/${INTEMA_RELEASE_ASSET}"
}

branch_archive_url() {
    echo "https://github.com/${INTEMA_GITHUB_REPO}/archive/refs/heads/${INTEMA_BRANCH}.tar.gz"
}

install_from_archive() {
    local archive_url="$1"
    local strip="${2:-0}"

    local temp_dir
    temp_dir="$(mktemp -d)"
    local archive="${temp_dir}/intema.tar.gz"

    trap "rm -rf '${temp_dir}'" EXIT

    download_file "${archive_url}" "${archive}"

    # Verify archive integrity
    if ! gzip -t "${archive}" 2>/dev/null; then
        error "Archive integrity check failed." 4
    fi

    # Extract
    log "Extracting..."
    mkdir -p "${INTEMA_INSTALL_DIR}"
    if [[ "${strip}" -gt 0 ]]; then
        tar -xzf "${archive}" -C "${INTEMA_INSTALL_DIR}" --strip-components="${strip}"
    else
        # Check if archive has a single root directory
        local root_count
        root_count="$(tar -tzf "${archive}" | head -20 | sed 's|/.*||' | sort -u | wc -l)"
        if [[ "${root_count}" -eq 1 ]]; then
            tar -xzf "${archive}" -C "${INTEMA_INSTALL_DIR}" --strip-components=1
        else
            tar -xzf "${archive}" -C "${INTEMA_INSTALL_DIR}"
        fi
    fi

    rm -rf "${temp_dir}"
    trap - EXIT
}

set_permissions() {
    chmod +x "${INTEMA_INSTALL_DIR}/bin/intema" 2>/dev/null || true
    chmod +x "${INTEMA_INSTALL_DIR}/bootstrap/"*.sh 2>/dev/null || true
    chmod +x "${INTEMA_INSTALL_DIR}/bootstrap/lib/"*.sh 2>/dev/null || true
    chmod +x "${INTEMA_INSTALL_DIR}/scripts/"*.sh 2>/dev/null || true
}

install_symlink() {
    ln -sf "${INTEMA_INSTALL_DIR}/bin/intema" /usr/local/bin/intema
    log "CLI available: intema"
}

main() {
    parse_args "$@"
    require_root
    detect_ubuntu

    # Local development mode
    local local_repo=""
    if local_repo="$(detect_local_repository)"; then
        log "Development mode: local repository at ${local_repo}"
        export PANEL_INSTALL_PATH="${local_repo}"
        set_permissions
        bash "${local_repo}/bootstrap/install.sh"
        log "Installation complete."
        exit 0
    fi

    # Remote installation
    if [[ -n "${INTEMA_BRANCH}" ]]; then
        log "Development mode: branch ${INTEMA_BRANCH}"
        install_from_archive "$(branch_archive_url)" 1
    else
        log "Downloading latest release..."
        install_from_archive "$(release_download_url)" 0
    fi

    set_permissions
    install_symlink

    log "Installation complete."
    log ""
    log "Get started:"
    log "  sudo intema install web    # Install web stack"
    log "  sudo intema install db     # Install PostgreSQL"
    log "  intema --help              # Show all commands"
}

main "$@"
