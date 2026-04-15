# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Test user login** — `test@test.com` with auto-login via `/login?plan=pro`
- **E2E test suite** — `e2e/test-user.spec.js` with 34 Playwright tests covering login, dashboard, OQL scenarios, IQL scenarios, NLP console, billing, navigation, logout, and protected routes
- **Test data services** — `infra/docker/dev/docker-compose.test.yml` with PostgreSQL (port 5433) and Redis (port 6380), pre-seeded with test users and scenarios
- **SQL init script** — `infra/docker/dev/init-test-data.sql` for test database bootstrapping
- **Playwright route mocking** — E2E tests intercept all backend API calls, no running backend required
- **Ansible test pipeline** — expanded `ansible/playbook-test.yml` with 10 separate test suites (smoke, landing, login, dashboard, OQL, IQL, NLP, billing, navigation, protected routes)
- **Test report template** — updated `ansible/templates/test_report.txt.j2` with per-suite results table

### Changed
- `src/pages/Login.jsx` — `handleSubmit` now detects `testMode` responses, sets JWT + user in localStorage, and redirects to dashboard (or billing when `plan` param is present)
- `src/mocks/api.js` — expanded mock data store with test users, scenarios, billing, and subscription endpoints

## [0.1.1] - 2026-04-15

### Docs
- Update TODO/oqlos-saas-implementation-plan.md
- Update docs/README.md
- Update project/README.md
- Update project/context.md

### Test
- Update test/oqlos-portal.test.js

### Other
- Update .env.example
- Update .gitignore
- Update TODO/oqlos-landing.jsx
- Update index.html
- Update nginx.conf
- Update package-lock.json
- Update project.sh
- Update project/analysis.toon.yaml
- Update project/calls.mmd
- Update project/calls.png
- ... and 29 more files

