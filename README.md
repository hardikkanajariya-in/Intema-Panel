# Intema Panel

**Infrastructure Resource Manager**

Intema Panel is an open-source, self-hosted infrastructure management system for single-server VPS environments. Organize independent resources — applications, databases, domains, and SSL certificates — under optional projects, with a provision engine that executes reusable native Linux tasks.

Created by [Hardik Kanajariya](https://hardikkanajariya.in).

## Features

- **Project-based organization** — group resources optionally; nothing is auto-coupled
- **Independent resources** — applications, PostgreSQL databases, domains, SSL certificates
- **Provision Engine** — composable tasks (folder, user, clone, composer, nginx, SSL, etc.)
- **Application provisioners** — Laravel, PHP, Static, Next.js (Vercel metadata), NestJS (metadata), API, Custom
- **Encrypted credential storage** (SQLite metadata)
- **Activity logging** with audit trail
- **Dashboard** — projects, resources, server health, expiring certificates, deployments
- **Server management** — PHP, Composer, Node, PostgreSQL, Nginx, Certbot, Git, Supervisor, Fail2Ban, UFW
- **Light / dark mode** and single administrator authentication

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
intema install    # Full server bootstrap (idempotent)
intema update     # Update panel
intema doctor     # Health checks
intema repair     # Fix permissions and rebuild
intema verify     # Validate installation
intema uninstall  # Remove build artifacts
```

## Configuration

Copy `.env.example` to `.env` and configure:

- `PANEL_PG_*` — PostgreSQL admin credentials
- `PANEL_NAME`, `PANEL_TAGLINE`, `PANEL_COMPANY`, `PANEL_WEBSITE` — branding (defaults in `config/panel.php`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — administrator account

## Development

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate
composer run dev
```

## Architecture

```
Project (organizational)
  └── Resources (independent)
        ├── Applications  → Provisioners → Tasks → Shell
        ├── Databases     → PostgreSQL scripts
        ├── Domains       → Nginx (optional)
        └── SSL           → Certbot (optional)
```

- **Laravel 13** — backend, authentication, policies, validation
- **React + Inertia v3** — SPA frontend with TypeScript
- **SQLite** — panel metadata (`projects`, `applications`, `databases`, `domains`, `ssl_certificates`, `deployments`)
- **Shell scripts** — native Linux provisioning (no Docker)

See [docs/architecture.md](docs/architecture.md) for details.

## License

MIT — see [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security issues: see [SECURITY.md](SECURITY.md).
