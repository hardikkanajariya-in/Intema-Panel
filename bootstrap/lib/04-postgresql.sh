#!/usr/bin/env bash
set -euo pipefail

apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql
