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
  --domain=DOMAIN   Required: Domain name for the panel (e.g. panel.example.com)
  --upgrade         Upgrade an existing installation (preserves .env and database)
  --repair          Run repair on an existing installation
  -y, --yes         Non-interactive: assume yes for prompts
  -h, --help        Show this help

Examples:
  curl -fsSL https://install.intemapanel.com | sudo bash
  ./bootstrap.sh --domain=panel.example.com
  ./bootstrap.sh --version=v1.0.0 --domain=panel.example.com
  ./bootstrap.sh --branch=main --domain=panel.example.com
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
            --domain=*)
                PANEL_DOMAIN="${1#*=}"
                ;;
            --domain)
                shift
                PANEL_DOMAIN="${1:-}"
                [[ -n "${PANEL_DOMAIN}" ]] || error "Missing value for --domain" 1
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

verify_archive_integrity() {
    local archive="$1"

    log "Verifying archive integrity"

    if ! gzip -t "${archive}" 2>/dev/null; then
        error "Archive integrity check failed (corrupt gzip)." 4
    fi

    if ! tar -tzf "${archive}" >/dev/null 2>&1; then
        error "Archive integrity check failed (invalid tar archive)." 4
    fi

    log "Archive integrity verified."
}

verify_package_contents() {
    local source_dir="$1"

    if [[ -f "${source_dir}/.env" ]]; then
        error "Release package must not contain .env (only .env.example is allowed)." 4
    fi

    if [[ ! -f "${source_dir}/.env.example" ]]; then
        error "Release package is missing .env.example." 3
    fi

    if [[ ! -f "${source_dir}/bootstrap/install.sh" ]]; then
        error "Release package is missing bootstrap/install.sh." 3
    fi

    log "Package contents verified."
}

resolve_package_root() {
    local base_dir="$1"
    local source_dir="${base_dir}"

    if [[ "$(find "${base_dir}" -mindepth 1 -maxdepth 1 | wc -l)" -eq 1 ]]; then
        local nested
        nested="$(find "${base_dir}" -mindepth 1 -maxdepth 1 -type d | head -1)"
        if [[ -f "${nested}/bootstrap/install.sh" ]]; then
            source_dir="${nested}"
        fi
    fi

    echo "${source_dir}"
}

cleanup_partial_installation() {
    if [[ "${INTEMA_ACTION}" == "upgrade" ]] || has_panel_data; then
        return 0
    fi

    if [[ -d "${INTEMA_INSTALL_DIR}" ]]; then
        log "Removing partial installation at ${INTEMA_INSTALL_DIR}"
        rm -rf "${INTEMA_INSTALL_DIR}"
    fi
}

deploy_package() {
    local source_dir="$1"
    local is_upgrade="$2"

    verify_package_contents "${source_dir}"

    if [[ "${is_upgrade}" == "true" ]]; then
        log "Upgrading installation at ${INTEMA_INSTALL_DIR}"
        rsync -a --delete \
            --exclude='.env' \
            --exclude='database/database.sqlite' \
            --exclude='storage/app/' \
            --exclude='storage/logs/' \
            "${source_dir}/" "${INTEMA_INSTALL_DIR}/"
    else
        log "Deploying to ${INTEMA_INSTALL_DIR}"
        if [[ -d "${INTEMA_INSTALL_DIR}" ]] && ! has_panel_data; then
            rm -rf "${INTEMA_INSTALL_DIR}"
        fi
        mkdir -p "${INTEMA_INSTALL_DIR}"
        rsync -a "${source_dir}/" "${INTEMA_INSTALL_DIR}/"
    fi
}

download_and_extract_release() {
    local temp_dir archive checksum staging_dir source_dir is_upgrade=false
    temp_dir="$(mktemp -d)"
    archive="${temp_dir}/${INTEMA_RELEASE_ASSET}"
    checksum="${temp_dir}/${INTEMA_CHECKSUM_ASSET}"
    staging_dir="${temp_dir}/staging"

    if [[ "${INTEMA_ACTION}" == "upgrade" ]] && installation_exists; then
        is_upgrade=true
    fi

    cleanup_on_failure() {
        local exit_code=$?
        rm -rf "${temp_dir}"
        if [[ "${exit_code}" -ne 0 ]] && [[ "${is_upgrade}" != "true" ]]; then
            cleanup_partial_installation
        fi
        return "${exit_code}"
    }
    trap cleanup_on_failure EXIT

    download_file "$(release_download_url)" "${archive}"

    if ! download_file "$(release_checksum_url)" "${checksum}" 2>/dev/null; then
        rm -f "${checksum}"
    fi

    verify_checksum "${archive}" "${checksum}"
    verify_archive_integrity "${archive}"

    log "Extracting release package"
    mkdir -p "${staging_dir}"
    extract_archive "${archive}" "${staging_dir}" 0
    source_dir="$(resolve_package_root "${staging_dir}")"

    deploy_package "${source_dir}" "${is_upgrade}"

    rm -rf "${temp_dir}"
    trap - EXIT

    log "Temporary archive removed."
    INTEMA_INSTALL_MODE="${INTEMA_INSTALL_MODE:-production}"
}

download_and_extract_branch() {
    local temp_dir archive staging_dir source_dir is_upgrade=false
    temp_dir="$(mktemp -d)"
    archive="${temp_dir}/branch.tar.gz"
    staging_dir="${temp_dir}/staging"

    if [[ "${INTEMA_ACTION}" == "upgrade" ]] && installation_exists; then
        is_upgrade=true
    fi

    cleanup_on_failure() {
        local exit_code=$?
        rm -rf "${temp_dir}"
        if [[ "${exit_code}" -ne 0 ]] && [[ "${is_upgrade}" != "true" ]]; then
            cleanup_partial_installation
        fi
        return "${exit_code}"
    }
    trap cleanup_on_failure EXIT

    download_file "$(branch_archive_url)" "${archive}"
    verify_archive_integrity "${archive}"

    log "Extracting branch archive"
    mkdir -p "${staging_dir}"
    extract_archive "${archive}" "${staging_dir}" 1
    source_dir="$(resolve_package_root "${staging_dir}")"

    if [[ -f "${source_dir}/.env" ]]; then
        error "Branch archive must not contain .env." 4
    fi

    deploy_package "${source_dir}" "${is_upgrade}"

    rm -rf "${temp_dir}"
    trap - EXIT

    log "Temporary archive removed."
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

    if ! bash "${INTEMA_INSTALL_DIR}/bootstrap/install.sh" "${INSTALLER_ARGS[@]}"; then
        if [[ "${INTEMA_ACTION}" != "upgrade" ]] && ! has_panel_data; then
            cleanup_partial_installation
        fi
        error "Installer failed." 1
    fi
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

    # Try to load existing PANEL_DOMAIN from .env if present
    if [[ -z "${PANEL_DOMAIN:-}" ]]; then
        local target_env="${INTEMA_INSTALL_DIR}/.env"
        if [[ ! -f "${target_env}" ]] && [[ -f "/opt/intema-panel/.env" ]]; then
            target_env="/opt/intema-panel/.env"
        fi

        if [[ -f "${target_env}" ]]; then
            local env_domain
            env_domain="$(grep "^PANEL_SERVER_NAME=" "${target_env}" | cut -d'=' -f2- | tr -d '"'\'' ' || true)"
            if [[ -n "${env_domain}" ]]; then
                export PANEL_DOMAIN="${env_domain}"
            fi
        fi
    fi

    if [[ "${INTEMA_ACTION}" == "install" ]] && ! installation_exists; then
        local domain=""
        if [[ -z "${PANEL_DOMAIN:-}" ]]; then
            if [[ "${INTEMA_ASSUME_YES}" != "true" ]]; then
                while [[ -z "${domain}" ]]; do
                    read -r -p "[intema-bootstrap] Enter the domain name for the panel (e.g. panel.example.com) [REQUIRED]: " domain < /dev/tty
                    if [[ -z "${domain}" ]]; then
                        echo "[intema-bootstrap] ERROR: Domain name is required." >&2
                    fi
                done
                export PANEL_DOMAIN="${domain}"
            else
                error "Domain name is required in non-interactive mode. Pass --domain=DOMAIN." 1
            fi
        else
            export PANEL_DOMAIN="${PANEL_DOMAIN}"
        fi
    fi

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
