# Intema Panel v1.0.0 — Release Checklist

## Production Ready

- [x] Resource-based architecture (Projects → Resources)
- [x] Provision Engine with task validate / execute / rollback / health
- [x] Application provisioners (Laravel, PHP, Static, Next.js, NestJS, API, Custom)
- [x] Resource Wizard (Project → Type → Form)
- [x] Runtime management per application type
- [x] Optional resource relationships (Application ↔ Database, Domain)
- [x] System Manager (install, update, repair, validate, restart)
- [x] Dashboard with live metrics
- [x] Activity logging for provisioning and system actions
- [x] Bootstrap installer (idempotent steps, doctor, verify, repair)
- [x] Frontend production build passes
- [x] MIT License and open-source documentation

## GitHub Ready

- [x] README with installation and architecture
- [x] CHANGELOG v1.0.0
- [x] RELEASE_NOTES v1.0.0
- [x] CONTRIBUTING.md
- [x] SECURITY.md
- [x] LICENSE (MIT)
- [x] GitHub Actions workflows
- [x] Issue and PR templates

## Deploy on AWS t4g.small Ubuntu 24.04

```bash
sudo apt-get update && sudo apt-get install -y git
git clone https://github.com/hardikkanajariya/intema-panel.git
cd intema-panel
sudo chmod +x bootstrap/install.sh bin/intema scripts/*.sh
sudo ./bootstrap/install.sh
sudo intema doctor
sudo intema verify
```

Open the server IP in a browser and complete the setup wizard.

## Release Tag

| Field | Value |
|-------|-------|
| Version | v1.0.0 |
| Release Name | Intema Panel 1.0.0 |
| Description | First stable release of Intema Panel, an open-source Infrastructure Resource Manager for managing projects, applications, databases, domains and SSL on native Ubuntu servers. |

```bash
git tag -a v1.0.0 -m "Intema Panel 1.0.0 - First stable release"
git push origin v1.0.0
```
