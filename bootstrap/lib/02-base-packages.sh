#!/usr/bin/env bash
set -euo pipefail

PACKAGES=(git curl unzip sqlite3 ufw fail2ban software-properties-common)

apt-get install -y "${PACKAGES[@]}"
