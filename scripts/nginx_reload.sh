#!/usr/bin/env bash
set -euo pipefail

systemctl reload nginx
echo "Nginx reloaded"
exit 0
