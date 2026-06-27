# Release Candidate 1 (RC1)

**Release Date:** 2026-06-27  
**Version:** 1.0.0-rc1

## Highlights

- Fresh Ubuntu 24.04 bootstrap installer with modular scripts
- Browser-based first-boot setup wizard
- Production-ready client management with PostgreSQL auto-provisioning
- System Manager with native Linux service detection and control
- PostgreSQL, Nginx, and SSL management modules
- Lightweight file manager for logs and `.env` editing
- Real-time system monitoring dashboard
- `intema` CLI launcher (`install`, `update`, `doctor`, `repair`, `uninstall`, `verify`)

## Upgrade Notes

- Run `./bootstrap/update.sh` or `intema update` to upgrade from v1.0.0
- Complete the setup wizard on first boot if `setup_completed` is not set

## Known Limitations (RC1)

- Cloudflare module remains a placeholder (planned v1.1)
- File manager is read-only except `.env`
- System package installation buttons require server-side bootstrap (not triggered from panel UI yet)
