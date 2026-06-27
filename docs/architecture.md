# Architecture

## Overview

Intema Panel is a single-server hosting control panel built with Laravel and Inertia React.

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (React)                      │
└─────────────────────────┬───────────────────────────────┘
                          │ Inertia
┌─────────────────────────▼───────────────────────────────┐
│  Controllers → Form Requests → Actions → Services        │
└─────────────────────────┬───────────────────────────────┘
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     SQLite (meta)   Shell Scripts    Symfony Process
                          │               │
                          ▼               ▼
                    PostgreSQL         Linux Services
```

## Layers

| Layer | Responsibility |
|-------|----------------|
| **Controllers** | HTTP boundary, Inertia responses |
| **Form Requests** | Validation and authorization |
| **Actions** | Single-purpose business operations with transactions |
| **Services** | Reusable domain logic |
| **DTOs** | Typed data transfer between layers |
| **Shell Scripts** | Idempotent PostgreSQL/Nginx/SSL operations |

## Data Storage

- **SQLite** — panel metadata (clients, settings, activity logs)
- **PostgreSQL** — client application databases (managed externally)

## Security

- Encrypted database credentials at rest
- Validated shell script invocation (no command concatenation)
- Allowlisted systemctl service actions
- File manager restricted to configured roots

## Bootstrap

The `bootstrap/` package installs all server dependencies on Ubuntu 24.04 LTS and configures Nginx to serve the panel. The `bin/intema` CLI delegates to bootstrap scripts.
