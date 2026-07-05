#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
    apt-get install -y nodejs
fi

if ! command -v pnpm >/dev/null 2>&1; then
    npm install -g pnpm
fi

apt-get install -y supervisor
