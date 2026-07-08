# Intema

A CLI tool to quickly provision Ubuntu VPS servers with a production-ready web stack.

## Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/hardikkanajariya-in/Intema-Panel/main/bootstrap.sh | sudo bash
```

## Usage

### 1. Install Web Stack

Installs Nginx, Certbot, Node.js LTS, pnpm, PM2, PHP 8.4 (with PostgreSQL, MySQL, SQLite, Redis, GD, Imagick extensions), and Composer.

```bash
sudo intema install web
```

### 2. Install Database

Installs the latest PostgreSQL server, sets the database root password, and saves your custom database domain (e.g. routed via Cloudflare DNS) globally.

```bash
sudo intema install db --password=secretpass123 --domain=db.example.com
```

Options:
* `--password` (Required): The password for the database root user.
* `--user` (Optional): The database root username (defaults to `postgres`).
* `--domain` (Optional): Saves the domain globally in `/etc/intema/config` for all future database connection strings.

### 3. Create a New Site

Creates a Nginx virtual host with platform-specific configuration and obtains an SSL certificate automatically.

```bash
sudo intema new --domain=mydomain.com --plt=nextjs
sudo intema new --domain=api.mydomain.com --plt=nestjs --port=4000
sudo intema new --domain=app.mydomain.com --plt=laravel
sudo intema new --domain=docs.mydomain.com --plt=static
```

**Supported platforms:**

| Platform | Config |
|----------|--------|
| `nextjs` | Reverse proxy → `127.0.0.1:3000` |
| `nestjs` | Reverse proxy → `127.0.0.1:3000` |
| `laravel` | PHP-FPM with `try_files` rewrite |
| `static` | Plain file serving |

### 4. Create a Database

Creates a PostgreSQL database with a dedicated user, proper isolation, and outputs ready-to-use connection strings. It automatically uses the domain you configured globally during `install db` (or falls back to the public IP).

```bash
sudo intema new database --name=mydb --user=myuser --password=mypassword
```

### 5. PostgreSQL Public Access Toggle

Easily enable or disable public TCP access to your database from external networks (like Vercel, Railway, or Render) at the firewall level without any service downtime.

```bash
# Block all external TCP access (local connections still work)
sudo intema db:off

# Allow remote TCP access (port 5432)
sudo intema db:on
```

### 6. Secure VPS

Applies production security hardening in one command — no interaction needed.

```bash
sudo intema secure
```

**What it configures:**

| Area | Details |
|------|---------|
| SSH | Disables root login, limits auth tries to 3, keeps agent/TCP forwarding for dev workflows |
| Passwords | Disables password auth (only if SSH keys detected — prevents lockout) |
| Firewall | UFW with deny-all incoming, allows only SSH + HTTP + HTTPS |
| Fail2ban | Jails for SSH brute force + Nginx bad bots + HTTP auth attacks |
| Kernel | SYN flood protection, IP spoofing, ICMP hardening, disabled source routing |
| Shared memory | Mounted with `noexec` and `nosuid` |
| Protocols | Disables unused protocols (dccp, sctp, rds, tipc) |
| Nginx | Security headers (X-Frame-Options, X-Content-Type-Options, etc.), hides version |

### 7. Health Check

```bash
sudo intema doctor
```

## Requirements

- Ubuntu 22.04+ (amd64 or arm64)
- Root access

## License

[MIT](LICENSE)
