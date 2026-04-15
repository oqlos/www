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
4. **test-unit** - Unit tests (vitest)
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

### Docker
```bash
make docker-build          # Build Docker image
make docker-run            # Run container (standalone)
```

### Docker Compose (full stack)
```bash
# Development: Traefik + API + Portal + Mailpit
make docker-dev
# → oqlos.localhost, api.oqlos.localhost, mail.oqlos.localhost

# Production: HTTPS + Let's Encrypt + Postgres + Redis
make docker-prod
# → oqlos.com, api.oqlos.com (TLS)

# Stop stacks
make docker-dev-down
make docker-prod-down
```

## Project Structure

```
├── src/                    # React application source
│   ├── components/         # React components
│   │   ├── ErrorBoundary   # Catches render errors
│   │   ├── ProtectedRoute  # Auth guard (redirects to /login)
│   │   ├── SharedNav       # Common nav bar + theme toggle
│   │   ├── ThemeToggle     # Dark/light mode switch
│   │   └── LoadingSpinner  # Reusable spinner
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.js      # Shared auth logic
│   ├── mocks/              # Dev mock API interceptor
│   ├── pages/              # Page components
│   ├── data/               # Static data (install commands)
│   ├── utils/              # Utilities (logger, etc.)
│   └── styles/             # CSS styles (dark + light themes)
├── e2e/                    # Playwright E2E tests
├── ansible/                # Ansible playbooks
│   ├── inventory.ini       # Host inventory
│   ├── playbook-test.yml   # Test playbook
│   ├── playbook-deploy.yml # Deploy playbook
│   └── templates/          # Jinja2 templates
├── infra/                  # Infrastructure configs
│   └── docker/             # Docker compose files
├── test.sh                 # Shell-based test runner
├── project.sh              # Code analysis script
├── pyqual.yaml             # Quality pipeline config
├── playwright.config.js    # Playwright configuration
├── nginx.conf              # Nginx configuration
├── Dockerfile              # Docker image build
├── Makefile                # Build automation
└── vite.config.js          # Vite configuration
```

## Key Dependencies

- **React 18** - UI framework
- **React Router DOM** - Routing
- **Vite** - Build tool
- **vitest** - Unit testing
- **@playwright/test** - E2E testing
- **loglevel** - Client-side logging (in-memory buffer)

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
| `make docker-dev` | Start dev Docker Compose stack |
| `make docker-dev-down` | Stop dev stack |
| `make docker-prod` | Start prod Docker Compose stack |
| `make docker-prod-down` | Stop prod stack |

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

## Logging

The application uses `loglevel` for client-side logging with an in-memory buffer:

```javascript
import logger from './utils/logger';

logger.info('Application started', 'Component', { data: 'value' });
logger.error('Error occurred', 'Component', { error: details });

// Query all logs
const logs = logger.getLogs();

// Filter by level
const errors = logger.getLogs('error', 100);

// Export logs
const exported = logger.exportLogs();

// Clear logs
logger.clear();
```

**Log levels:** trace, debug, info, warn, error  
**Buffer size:** 500 entries (FIFO)  
**Storage:** In-memory only (no localStorage/SQLite)

## Nginx Configuration

Production deployment uses Nginx with:

- **SPA routing** - All routes redirect to index.html
- **API proxy** - `/api`, `/auth`, `/billing/*`, `/nlp/*` proxied to backend
- **SSE support** - Streaming endpoints without buffering
- **Static caching** - 30-day cache for assets (js, css, images)
- **Security headers** - X-Frame-Options, X-Content-Type-Options, Referrer-Policy

Environment variables for Nginx:
- `NGINX_PORT` - Listening port (default: 80)
- `BACKEND_URL` - Backend API URL (default: http://oqlapi:8101)

## License

Licensed under Apache-2.0.
