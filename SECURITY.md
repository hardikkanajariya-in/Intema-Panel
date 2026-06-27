# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

Please **do not** report security vulnerabilities via public GitHub issues.

Email security concerns to the maintainer via the support email listed in the repository profile, or open a private security advisory on GitHub.

Include:

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We aim to respond within 72 hours.

## Security Practices

- Database passwords are encrypted at rest
- Shell commands use validated arguments via Symfony Process
- No command concatenation with user input
- Single administrator model with session authentication
