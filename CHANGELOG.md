# Changelog

All notable changes to Intema Panel will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-27

### Added

- Resource-based architecture: Projects, Applications, Databases, Domains, SSL Certificates, Deployments
- Provision Engine with reusable tasks and application-specific provisioners
- Resource Wizard for guided resource creation
- Policies, rate limiting, and UUID-based routing for all resources
- Expanded dashboard with server health, activity, and deployment history

### Changed

- **Breaking:** Removed client-centric model; migrated to independent resources
- Branding subtitle: Infrastructure Resource Manager
- Navigation restructured around projects and resources

### Removed

- Client module and Cloudflare placeholder

### Added

- Fresh Ubuntu bootstrap installer (`bootstrap/`)
- Browser setup wizard (first-boot experience)
- `intema` CLI launcher
- System Manager with service detection and control
- PostgreSQL management module UI
- Nginx virtual host management
- SSL / Let's Encrypt management
- Lightweight file manager
- System monitoring page with load average and process count
- 15+ new shell scripts for nginx, ssl, and backups

## [1.0.0] - 2026-06-27

### Added

- Initial public release
- Client CRUD with PostgreSQL auto-provisioning
- Shell script layer for database operations
- Dashboard with system metrics
- Activity logging with actor and status
- Settings module with SQLite storage
- Single administrator authentication
- Light / dark / system theme support
- Open source documentation and CI workflows
- Modular installer scripts
