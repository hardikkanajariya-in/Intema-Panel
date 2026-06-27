# Intema Panel 1.0.0

**Release Date:** 2026-06-27  
**Status:** Production Ready | GitHub Ready | Open Source Ready

First stable release of Intema Panel, an open-source Infrastructure Resource Manager for managing projects, applications, databases, domains and SSL on native Ubuntu servers.

## Git Tag Metadata

```
Version:         v1.0.0
Release Name:    Intema Panel 1.0.0
Tag Message:     First stable release
```

```bash
git tag -a v1.0.0 -m "Intema Panel 1.0.0 - First stable release"
git push origin v1.0.0
```

### Highlights

- Complete architectural refactor from client-centric to **resource-based infrastructure management**
- **Projects** as organizational containers; all resources are independent
- **Provision Engine** with reusable tasks and framework-specific application provisioners
- **Resource Wizard** — create applications, databases, domains, or SSL in guided steps
- **Dashboard** — projects, applications, databases, domains, SSL, server health, activity, deployments
- Policies, rate limiting, encrypted secrets, and escaped shell arguments throughout
- Idempotent installer with `install`, `update`, `doctor`, `repair`, `verify`, `uninstall` CLI commands

### Application Types

| Type | Provisioning |
|------|-------------|
| Static Website | Full native provisioning |
| Laravel | Full native provisioning |
| Standard PHP | Full native provisioning |
| API Only | Full native provisioning |
| Custom | Configurable task pipeline |
| Next.js | Vercel deployment metadata only |
| NestJS | Metadata only (future ready) |

### Breaking Changes from RC1

- `clients` table removed — use `projects` + independent resources
- Routes changed: `/clients` → `/projects`, `/ssl` → `/ssl-certificates`
- Cloudflare placeholder removed (planned for future release)

### Known Limitations

- Next.js and NestJS are metadata-only in v1.0
- File manager is read-only except `.env`
- Package installation is via bootstrap CLI, not panel UI

---

Created by [Hardik Kanajariya](https://hardikkanajariya.in)
