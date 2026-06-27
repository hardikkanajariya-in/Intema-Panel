# Contributing to Intema Panel

Thank you for your interest in contributing to Intema Panel.

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Run `./install.sh` for development setup
4. Create a feature branch from `main`

## Development Standards

- Follow existing code architecture (Actions, Services, DTOs)
- Use strict typing in PHP and TypeScript
- Run `vendor/bin/pint` before committing PHP changes
- Run `npm run lint` and `npm run types:check` for frontend changes
- Never execute shell commands directly from controllers

## Pull Request Process

1. Ensure CI passes
2. Update documentation if needed
3. Write clear commit messages
4. Link related issues in the PR description

## Code of Conduct

Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before participating.
