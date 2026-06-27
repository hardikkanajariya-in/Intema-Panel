#!/usr/bin/env bash
set -euo pipefail

nginx -t
echo "Nginx configuration test passed"
exit 0
