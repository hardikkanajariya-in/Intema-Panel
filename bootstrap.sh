#!/usr/bin/env bash
#
# Intema Panel Bootstrap Loader
# Self-contained entry point for production and development installation.
# Usage:
#   curl -fsSL https://install.intemapanel.com | sudo bash
#   curl -fsSL https://raw.githubusercontent.com/hardikkanajariya-in/Intema-Panel/main/bootstrap.sh | sudo bash
#   ./bootstrap.sh [--version=v0.1.0] [--branch=main] [--upgrade] [--repair] [-y]
#
set -euo pipefail

readonly INTEMA_GITHUB_REPO="${INTEMA_GITHUB_REPO:-hardikkanajariya-in/Intema-Panel}"
readonly INTEMA_INSTALL_DIR="${PANEL_INSTALL_PATH:-/opt/intema-panel}"
readonly INTEMA_RELEASE_ASSET="intema-panel.tar.gz"
readonly INTEMA_CHECKSUM_ASSET="intema-panel.tar.gz.sha256"

INTEMA_INSTALL_MODE="${INTEMA_INSTALL_MODE:-}"
INTEMA_VERSION=""
INTEMA_BRANCH=""
INTEMA_ACTION="install"
INTEMA_ASSUME_YES=false
INSTALLER_ARGS=()

log() {
    echo "[intema-bootstrap] $*"
}

error() {
    echo "[intema-bootstrap] ERROR: $*" >&2
    exit "${2:-1}"
}

usage() {
    cat <<'EOF'
Intema Panel Bootstrap Loader

Usage:
  bootstrap.sh [options] [-- installer-args]

Options:
  --version=TAG     Install a specific release (e.g. v0.1.0)
  --branch=BRANCH   Development mode: use a Git branch archive
  --upgrade         Upgrade an existing installation (preserves .env and database)
  --repair          Run repair on an existing installation
  -y, --yes         Non-interactive: assume yes for prompts
  -h, --help        Show this help

Examples:
  curl -fsSL https://install.intemapanel.com | sudo bash
  ./bootstrap.sh
  ./bootstrap.sh --version=v1.0.0
  ./bootstrap.sh --branch=main
  ./bootstrap.sh --upgrade -y
EOF
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --version=*)
                INTEMA_VERSION="${1#*=}"
                ;;
            --version)
                shift
                INTEMA_VERSION="${1:-}"
                [[ -n "${INTEMA_VERSION}" ]] || error "Missing value for --version" 1
                ;;
            --branch=*)
                INTEMA_BRANCH="${1#*=}"
                INTEMA_INSTALL_MODE="development"
                ;;
            --branch)
                shift
                INTEMA_BRANCH="${1:-}"
                [[ -n "${INTEMA_BRANCH}" ]] || error "Missing value for --branch" 1
                INTEMA_INSTALL_MODE="development"
                ;;
            --upgrade)
                INTEMA_ACTION="upgrade"
                ;;
            --repair)
                INTEMA_ACTION="repair"
                ;;
            -y | --yes)
                INTEMA_ASSUME_YES=true
                ;;
            -h | --help)
                usage
                exit 0
                ;;
            --)
                shift
                INSTALLER_ARGS+=("$@")
                break
                ;;
            *)
                INSTALLER_ARGS+=("$1")
                ;;
        esac
        shift
    done
}

require_root() {
    if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
        error "This installer must be run as root (use sudo)." 1
    fi
}

detect_architecture() {
    local arch
    arch="$(uname -m)"
    case "${arch}" in
        x86_64 | amd64)
            echo "amd64"
            ;;
        aarch64 | arm64)
            echo "arm64"
            ;;
        *)
            error "Unsupported architecture: ${arch}" 2
            ;;
    esac
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

    log "Detected Ubuntu ${VERSION_ID:-unknown} ($(detect_architecture))"
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

installation_exists() {
    [[ -d "${INTEMA_INSTALL_DIR}" ]] && [[ -f "${INTEMA_INSTALL_DIR}/bootstrap/install.sh" ]]
}

has_panel_data() {
    [[ -f "${INTEMA_INSTALL_DIR}/.env" ]] || [[ -f "${INTEMA_INSTALL_DIR}/database/database.sqlite" ]]
}

prompt_existing_installation() {
    if ! has_panel_data; then
        return 0
    fi

    if [[ "${INTEMA_ASSUME_YES}" == "true" ]]; then
        case "${INTEMA_ACTION}" in
            upgrade | repair)
                return 0
                ;;
            install)
                log "Existing installation detected; proceeding with upgrade (--yes)."
                INTEMA_ACTION="upgrade"
                return 0
                ;;
        esac
    fi

    if [[ ! -t 0 ]]; then
        error "Existing installation detected at ${INTEMA_INSTALL_DIR}. Re-run with --upgrade, --repair, or -y." 6
    fi

    echo ""
    echo "Existing Intema Panel installation detected at ${INTEMA_INSTALL_DIR}"
    echo ""
    echo "  1) Upgrade  — install latest release, preserve .env and database"
    echo "  2) Repair   — fix permissions and re-run migrations"
    echo "  3) Cancel"
    echo ""
    read -r -p "Choose an option [1/2/3]: " choice

    case "${choice}" in
        1)
            INTEMA_ACTION="upgrade"
            ;;
        2)
            INTEMA_ACTION="repair"
            ;;
        3 | *)
            log "Installation cancelled."
            exit 5
            ;;
    esac
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
        error "curl or wget is required to download the release package." 3
    fi
}

verify_checksum() {
    local archive="$1"
    local checksum_file="$2"

    if [[ ! -s "${checksum_file}" ]]; then
        log "Checksum file not available; skipping SHA256 verification."
        return 0
    fi

    log "Verifying SHA256 checksum"
    local expected actual
    expected="$(awk '{print $1}' "${checksum_file}")"
    actual="$(sha256sum "${archive}" | awk '{print $1}')"

    if [[ "${expected}" != "${actual}" ]]; then
        error "Checksum verification failed. The download may be corrupted." 4
    fi

    log "Checksum verified."
}

release_download_url() {
    if [[ -n "${INTEMA_VERSION}" ]]; then
        local tag="${INTEMA_VERSION}"
        if [[ "${tag}" != v* ]]; then
            tag="v${tag}"
        fi
        echo "https://github.com/${INTEMA_GITHUB_REPO}/releases/download/${tag}/${INTEMA_RELEASE_ASSET}"
        return
    fi

    echo "https://github.com/${INTEMA_GITHUB_REPO}/releases/latest/download/${INTEMA_RELEASE_ASSET}"
}

release_checksum_url() {
    local base
    base="$(release_download_url)"
    echo "${base}.sha256"
}

branch_archive_url() {
    echo "https://github.com/${INTEMA_GITHUB_REPO}/archive/refs/heads/${INTEMA_BRANCH}.tar.gz"
}

extract_archive() {
    local archive="$1"
    local dest="$2"
    local strip="${3:-0}"

    mkdir -p "${dest}"

    if [[ "${strip}" -gt 0 ]]; then
        tar -xzf "${archive}" -C "${dest}" --strip-components="${strip}"
    else
        tar -xzf "${archive}" -C "${dest}"
    fi
}

detect_github_archive_strip() {
    local archive="$1"
    local top
    top="$(tar -tzf "${archive}" | head -1 | cut -d/ -f1)"
    [[ -n "${top}" ]] || error "Unable to inspect downloaded archive." 3
    echo "${top}"
}

download_and_extract_release() {
    local temp_dir archive checksum target_dir
    temp_dir="$(mktemp -d)"
    archive="${temp_dir}/${INTEMA_RELEASE_ASSET}"
    checksum="${temp_dir}/${INTEMA_CHECKSUM_ASSET}"
    target_dir="${temp_dir}/extract"

    trap 'rm -rf "${temp_dir}"' RETURN

    download_file "$(release_download_url)" "${archive}"

    if ! download_file "$(release_checksum_url)" "${checksum}" 2>/dev/null; then
        : >"${checksum}"
    fi

    verify_checksum "${archive}" "${checksum}"

    if [[ "${INTEMA_ACTION}" == "upgrade" ]] && installation_exists; then
        log "Upgrading installation at ${INTEMA_INSTALL_DIR}"
        extract_archive "${archive}" "${target_dir}" 0

        local source_dir="${target_dir}"
        if [[ "$(find "${target_dir}" -mindepth 1 -maxdepth 1 | wc -l)" -eq 1 ]]; then
            source_dir="$(find "${target_dir}" -mindepth 1 -maxdepth 1 -type d | head -1)"
        fi

        rsync -a --delete \
            --exclude='.env' \
            --exclude='database/database.sqlite' \
            --exclude='storage/app/' \
            --exclude='storage/logs/' \
            "${source_dir}/" "${INTEMA_INSTALL_DIR}/"
    else
        log "Extracting to ${INTEMA_INSTALL_DIR}"
        mkdir -p "${INTEMA_INSTALL_DIR}"
        extract_archive "${archive}" "${INTEMA_INSTALL_DIR}" 0

        if [[ "$(find "${INTEMA_INSTALL_DIR}" -mindepth 1 -maxdepth 1 | wc -l)" -eq 1 ]]; then
            local nested
            nested="$(find "${INTEMA_INSTALL_DIR}" -mindepth 1 -maxdepth 1 -type d | head -1)"
            if [[ -f "${nested}/bootstrap/install.sh" ]]; then
                shopt -s dotglob
                mv "${nested}"/* "${INTEMA_INSTALL_DIR}/"
                rmdir "${nested}" 2>/dev/null || true
                shopt -u dotglob
            fi
        fi
    fi

    INTEMA_INSTALL_MODE="${INTEMA_INSTALL_MODE:-production}"
}

download_and_extract_branch() {
    local temp_dir archive target_dir top_dir
    temp_dir="$(mktemp -d)"
    archive="${temp_dir}/branch.tar.gz"
    target_dir="${temp_dir}/extract"

    trap 'rm -rf "${temp_dir}"' RETURN

    download_file "$(branch_archive_url)" "${archive}"

    top_dir="$(detect_github_archive_strip "${archive}")"
    mkdir -p "${INTEMA_INSTALL_DIR}"

    if [[ "${INTEMA_ACTION}" == "upgrade" ]] && installation_exists; then
        extract_archive "${archive}" "${target_dir}" 1
        rsync -a --delete \
            --exclude='.env' \
            --exclude='database/database.sqlite' \
            --exclude='storage/app/' \
            --exclude='storage/logs/' \
            "${target_dir}/" "${INTEMA_INSTALL_DIR}/"
    else
        extract_archive "${archive}" "${INTEMA_INSTALL_DIR}" 1
    fi

    INTEMA_INSTALL_MODE="development"
}

set_permissions() {
    local install_dir="${PANEL_INSTALL_PATH:-${INTEMA_INSTALL_DIR}}"

    chmod +x "${install_dir}/bootstrap/"*.sh 2>/dev/null || true
    chmod +x "${install_dir}/scripts/"*.sh 2>/dev/null || true
    chmod +x "${install_dir}/bin/intema" 2>/dev/null || true
}

run_installer() {
    export PANEL_INSTALL_PATH="${INTEMA_INSTALL_DIR}"
    export INTEMA_INSTALL_MODE="${INTEMA_INSTALL_MODE:-production}"

    log "Launching installer at ${INTEMA_INSTALL_DIR}/bootstrap/install.sh"
    bash "${INTEMA_INSTALL_DIR}/bootstrap/install.sh" "${INSTALLER_ARGS[@]}"
}

run_repair() {
    export PANEL_INSTALL_PATH="${INTEMA_INSTALL_DIR}"

    if ! installation_exists; then
        error "No installation found at ${INTEMA_INSTALL_DIR}." 1
    fi

    log "Running repair"
    bash "${INTEMA_INSTALL_DIR}/bootstrap/repair.sh"
}

install_cli_symlink() {
    local install_dir="${PANEL_INSTALL_PATH:-${INTEMA_INSTALL_DIR}}"

    if [[ -x "${install_dir}/bin/intema" ]]; then
        ln -sf "${install_dir}/bin/intema" /usr/local/bin/intema
        log "CLI available: intema"
    fi
}

main() {
    parse_args "$@"
    require_root
    detect_ubuntu

    local local_repo=""
    if local_repo="$(detect_local_repository)"; then
        log "Development mode: local repository detected at ${local_repo}"
        export PANEL_INSTALL_PATH="${local_repo}"
        export INTEMA_INSTALL_MODE="${INTEMA_INSTALL_MODE:-development}"

        if [[ "${INTEMA_ACTION}" == "repair" ]]; then
            export PANEL_INSTALL_PATH="${local_repo}"
            bash "${local_repo}/bootstrap/repair.sh"
            exit 0
        fi

        set_permissions
        bash "${local_repo}/bootstrap/install.sh" "${INSTALLER_ARGS[@]}"
        install_cli_symlink
        log "Installation complete."
        exit 0
    fi

    if [[ "${INTEMA_ACTION}" == "repair" ]]; then
        run_repair
        exit 0
    fi

    if installation_exists; then
        prompt_existing_installation
    fi

    if [[ "${INTEMA_ACTION}" == "repair" ]]; then
        run_repair
        exit 0
    fi

    if [[ -n "${INTEMA_BRANCH}" ]]; then
        log "Development mode: branch ${INTEMA_BRANCH}"
        download_and_extract_branch
    elif [[ "${INTEMA_ACTION}" == "upgrade" ]] || [[ ! -d "${INTEMA_INSTALL_DIR}/bootstrap" ]]; then
        log "Production mode: downloading release package"
        download_and_extract_release
    else
        log "Using existing files at ${INTEMA_INSTALL_DIR}"
        INTEMA_INSTALL_MODE="${INTEMA_INSTALL_MODE:-production}"
    fi

    if [[ ! -f "${INTEMA_INSTALL_DIR}/bootstrap/install.sh" ]]; then
        error "Installer not found at ${INTEMA_INSTALL_DIR}/bootstrap/install.sh after extraction." 3
    fi

    set_permissions
    run_installer
    install_cli_symlink

    log "Installation complete."
    log "Open http://$(hostname -I 2>/dev/null | awk '{print $1}') to complete the setup wizard."
}

main "$@"
