#!/usr/bin/env bash
set -euo pipefail

systemctl restart nginx
echo "Nginx restarted"
exit 0
