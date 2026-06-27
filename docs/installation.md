# Installation Guide

## System Requirements

| Component | Minimum Version |
|-----------|----------------|
| PHP | 8.3 |
| Node.js | 20 |
| Composer | 2 |
| PostgreSQL | 14 |
| Nginx | 1.18 |

## Automated Installation

```bash
chmod +x install.sh scripts/*.sh
./install.sh
```

The installer will:

1. Verify system dependencies
2. Install Composer and npm packages
3. Configure environment
4. Run migrations
5. Create administrator account
6. Build frontend assets

## Manual Installation

```bash
composer install --no-dev --optimize-autoloader
npm ci
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --force
php artisan db:seed --force
npm run build
```

## Post-Installation

1. Configure Nginx to point to the `public/` directory
2. Set `PANEL_PG_ADMIN_PASSWORD` in `.env`
3. Visit `/login` and sign in with your administrator credentials
