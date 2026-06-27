# Intema Panel

**Open Source Lightweight Hosting Control Panel**

Intema Panel is a self-hosted infrastructure management tool for single-server VPS environments. Manage clients, PostgreSQL databases, Nginx, SSL, and Cloudflare from a clean modern web interface.

Created by [Hardik Kanajariya](https://hardikkanajariya.in).

## Features

- Client management with automatic PostgreSQL provisioning
- Encrypted credential storage (SQLite metadata)
- Activity logging and audit trail
- Real-time system metrics dashboard
- Light / dark mode
- Single administrator authentication
- Modular shell script layer for database operations

## Requirements

- PHP 8.3+
- Node.js 20+
- Composer 2+
- PostgreSQL 14+
- Nginx
- Linux server (Ubuntu/Debian recommended)

## Quick Install (Ubuntu 24.04 LTS)

```bash
curl -fsSL https://raw.githubusercontent.com/hardikkanajariya/intema-panel/main/bootstrap/install.sh | sudo bash
```

Or clone and run:

```bash
git clone https://github.com/hardikkanajariya/intema-panel.git
cd intema-panel
sudo chmod +x bootstrap/install.sh bin/intema scripts/*.sh
sudo ./bootstrap/install.sh
```

Open `http://SERVER-IP` and complete the **Setup Wizard**.

## CLI

```bash
sudo ln -sf /var/www/intema-panel/bin/intema /usr/local/bin/intema
intema install    # Full server bootstrap
intema update     # Update panel
intema doctor     # Health checks
intema repair     # Fix permissions and rebuild
intema verify     # Validate installation
intema uninstall  # Remove build artifacts
```

## Configuration

Copy `.env.example` to `.env` and configure:

- `PANEL_PG_*` — PostgreSQL admin credentials
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — administrator account
- `PANEL_*` — branding and defaults

## Development

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
composer run dev
```

## Architecture

- **Laravel** — backend API, authentication, business logic
- **React + Inertia** — SPA frontend with TypeScript
- **SQLite** — panel metadata storage
- **PostgreSQL** — managed client databases
- **Shell scripts** — idempotent database operations invoked via Symfony Process

## License

MIT License — see [LICENSE](LICENSE).

## Links

- Website: https://hardikkanajariya.in
- GitHub: https://github.com/hardikkanajariya/intema-panel
- Issues: https://github.com/hardikkanajariya/intema-panel/issues
