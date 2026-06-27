# Configuration

All panel configuration is managed via environment variables and the Settings UI.

## Environment Variables

### Panel Branding

| Variable | Description | Default |
|----------|-------------|---------|
| `PANEL_NAME` | Panel display name | Intema Panel |
| `PANEL_TAGLINE` | Panel tagline | Open Source Lightweight Hosting Control Panel |
| `PANEL_COMPANY` | Company / creator name | Hardik Kanajariya |
| `PANEL_WEBSITE` | Website URL | https://hardikkanajariya.in |
| `PANEL_GITHUB` | GitHub repository URL | https://github.com/hardikkanajariya/intema-panel |
| `PANEL_SUPPORT_EMAIL` | Support email | hello@hardikkanajariya.in |

### PostgreSQL Administration

| Variable | Description | Default |
|----------|-------------|---------|
| `PANEL_PG_HOST` | PostgreSQL host | 127.0.0.1 |
| `PANEL_PG_PORT` | PostgreSQL port | 5432 |
| `PANEL_PG_ADMIN_USER` | Admin user for provisioning | postgres |
| `PANEL_PG_ADMIN_PASSWORD` | Admin password | (empty) |

### Shell Execution

| Variable | Description | Default |
|----------|-------------|---------|
| `PANEL_SCRIPTS_PATH` | Path to shell scripts | `{project}/scripts` |
| `PANEL_SHELL_TIMEOUT` | Script timeout (seconds) | 60 |
| `PANEL_SHELL_ENABLED` | Enable shell execution | true |

### Administrator

| Variable | Description | Default |
|----------|-------------|---------|
| `ADMIN_NAME` | Administrator display name | Administrator |
| `ADMIN_EMAIL` | Login email | admin@localhost |
| `ADMIN_PASSWORD` | Login password | (set during install) |

## Settings UI

Runtime settings stored in SQLite override environment defaults for branding and provisioning configuration.
