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

Installs the latest PostgreSQL server, enables and starts the service. Ready to use.

```bash
sudo intema install db
```

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

Creates a PostgreSQL database with a dedicated user and proper isolation.

```bash
sudo intema new database --name=mydb --user=myuser --password=mypassword
```

### 5. Health Check

```bash
sudo intema doctor
```

## Requirements

- Ubuntu 22.04+ (amd64 or arm64)
- Root access

## License

[MIT](LICENSE)
