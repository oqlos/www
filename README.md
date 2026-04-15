# OqlOS Portal

Industrial Test Automation DSL - Web Portal

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (default: http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_TEST_URL` | `http://localhost:3000` | Base URL for E2E tests |
| `VITE_DEV_PORT` | `3000` | Dev server port |
| `VITE_LOG_LEVEL` | `info` | Log level (trace/debug/info/warn/error) |
| `VITE_LOG_TO_FILE` | `false` | Enable file logging |
| `VITE_LOG_TO_DB` | `false` | Enable SQLite logging |
| `VITE_SQLITE_DB_PATH` | `./logs/oqlos-portal.db` | SQLite database path |
| `DEPLOY_DIR` | `/opt/oqlos/www` | Ansible deploy directory |
| `APP_PORT` | `3000` | Application port for Ansible |
| `SERVICE_NAME` | `oqlos-portal` | Systemd service name |

## Testing

### Local Testing (Shell)
```bash
npm run test              # Run full test suite
make test                 # Using Makefile
bash test.sh              # Alternative: direct shell script
```

### E2E Testing with Playwright
```bash
# Standard run
npm run test:e2e

# With UI debugger
npm run test:e2e:ui

# CI mode (chromium only)
npx playwright test --project=chromium --reporter=line

# Custom URL
VITE_TEST_URL=http://localhost:8080 npm run test:e2e
```

### Ansible E2E Tests
```bash
# Standard run
npm run ansible:test

# With custom port
APP_PORT=8080 ansible-playbook -i ansible/inventory.ini ansible/playbook-test.yml
```

## Pipeline (pyqual.yaml)

Quality pipeline stages:
1. **install** - `npm ci`
2. **lint** - ESLint check
3. **build** - Vite build
4. **test-unit** - Unit tests (placeholder)
5. **e2e-playwright** - E2E tests
6. **security-scan** - npm audit
7. **collect-metrics** - Generate coverage & metrics

### Run pipeline locally:
```bash
make ci                    # Full CI pipeline
make analyze               # Run code analysis
```

## Deployment

### Ansible Deployment
```bash
# Standard deploy
npm run ansible:deploy

# Custom settings
DEPLOY_DIR=/var/www/oqlos APP_PORT=8080 ansible-playbook -i ansible/inventory.ini ansible/playbook-deploy.yml
```

### Docker (optional)
```bash
make docker-build          # Build Docker image
make docker-run            # Run container
```

## Project Structure

```
├── src/                    # React application source
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── utils/              # Utilities (logger, etc.)
│   └── styles/             # CSS styles
├── e2e/                    # Playwright E2E tests
├── ansible/                # Ansible playbooks
│   ├── inventory.ini       # Host inventory
│   ├── playbook-test.yml   # Test playbook
│   ├── playbook-deploy.yml # Deploy playbook
│   └── templates/          # Jinja2 templates
├── test.sh                 # Shell-based test runner
├── project.sh              # Code analysis script
├── pyqual.yaml             # Quality pipeline config
├── playwright.config.js    # Playwright configuration
├── Makefile                # Build automation
└── vite.config.js          # Vite configuration
```

## Key Dependencies

- **React 18** - UI framework
- **React Router DOM** - Routing
- **Vite** - Build tool
- **Playwright** - E2E testing
- **loglevel** - Client-side logging
- **sql.js** - SQLite in browser

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make dev` | Start dev server |
| `make build` | Production build |
| `make test` | Full test suite |
| `make test-e2e` | Playwright E2E |
| `make test-e2e-ci` | CI E2E (chromium) |
| `make ansible-test` | Ansible tests |
| `make ansible-deploy` | Deploy |
| `make clean` | Clean build artifacts |
| `make clean-all` | Clean + node_modules |
| `make ci` | Full CI pipeline |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run test` | Full test suite |
| `npm run test:e2e` | E2E tests |
| `npm run test:e2e:ui` | E2E with UI |
| `npm run lint` | ESLint check |
| `npm run ansible:test` | Ansible E2E |
| `npm run ansible:deploy` | Deploy with Ansible |

## License

Licensed under Apache-2.0.
