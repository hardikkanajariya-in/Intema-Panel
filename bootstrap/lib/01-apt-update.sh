#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

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
    # Remove the broken PPA if it was added in previous failed runs
    rm -f /etc/apt/sources.list.d/*ondrej*php*.list
    rm -f /etc/apt/sources.list.d/*ondrej*php*.sources
fi

apt-get update -y
apt-get upgrade -y
