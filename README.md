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

See `.env.example` for all available environment variables with detailed documentation.

### Configuration Levels

The OqlOS Portal supports three configuration levels:

#### Level 1: Frontend Configuration (.env)
Controls React portal behavior, API endpoints, service URLs, hardware settings, and development options.

**Key Variables:**
- `VITE_API_DEV_URL` - Backend API URL (dev)
- `VITE_API_WS_URL` - WebSocket URL for agent communication
- `VITE_TRAEFIK_DEV_URL` - Traefik dashboard URL
- `VITE_HARDWARE_MODE` - Hardware mode: `real`|`simulated`
- `VITE_FORCE_MOCK_API` - Force mock API responses (dev only)
- `VITE_LOG_LEVEL` - Log level: `trace`|`debug`|`info`|`warn`|`error`

#### Level 2: SQLite Database (Development)
File-based database for local development and testing. No external services required.

**Setup:**
- Leave `DATABASE_URL` unset or set to `sqlite:///path/to/db.sqlite`
- Backend automatically creates SQLite database
- Default path: `/var/lib/oqlos/oqlos.db` (backend default)
- No PostgreSQL or Redis services needed

**Use Case:**
- Local development without backend services
- Quick testing with mock API
- Single-machine deployments

#### Level 3: PostgreSQL Database (Production)
Production-grade database with PostgreSQL and Redis for session management and caching.

**Setup:**
- Set `DATABASE_URL` to PostgreSQL connection string
- Set `REDIS_URL` for Redis connection
- Ensure PostgreSQL and Redis services are running
- Configure in `docker-compose.prod.yml` or backend `.env`

**Example:**
```bash
DATABASE_URL=postgresql://user:password@postgres:5432/oqlos
REDIS_URL=redis://:password@redis:6379
```

**Use Case:**
- Production deployments
- Multi-user environments
- High-availability setups
- Used with Traefik + Let's Encrypt for HTTPS

### Quick Setup

```bash
# Copy environment template
cp .env.example .env

# Development (Mock API - no backend needed)
VITE_FORCE_MOCK_API=true
npm install && npm run dev

# Development (SQLite backend)
# Leave DATABASE_URL empty for SQLite
npm install && npm run dev

# Production (PostgreSQL + Redis)
DATABASE_URL=postgresql://user:pass@host:5432/oqlos
REDIS_URL=redis://:pass@host:6379
make prod
```

### Common Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_TEST_URL` | `http://localhost:3000` | Base URL for E2E tests |
| `VITE_DEV_PORT` | `3000` | Dev server port |
| `VITE_LOG_LEVEL` | `info` | Log level (trace/debug/info/warn/error) |
| `DEPLOY_DIR` | `/opt/oqlos/www` | Ansible deploy directory |
| `APP_PORT` | `3000` | Application port for Ansible |
| `SERVICE_NAME` | `oqlos-portal` | Systemd service name |

## Test Users

Built-in test accounts are available for development and E2E testing:

| Email | Password | Role | Plan |
|-------|----------|------|------|
| `test@test.com` | _(magic link / auto-login)_ | admin | pro |
| `demo@oqlos.com` | _(magic link / auto-login)_ | user | free |

### Quick test login
```
# Test user (admin, pro plan)
http://localhost:3000/login?plan=pro

# Demo user (user, free plan)
http://localhost:3000/login
```

The `?plan=pro` query auto-fills `test@test.com`, submits the form, sets JWT in localStorage, and redirects to the dashboard. For the demo user, simply enter `demo@oqlos.com` in the login form.

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

### E2E Test User Suite (34 tests)

Full test coverage for the `test@test.com` user journey with Playwright route mocking (no backend required):

```bash
# Run all test-user E2E tests
VITE_TEST_URL=http://localhost:3000 npx playwright test e2e/test-user.spec.js --project=chromium
```

### E2E Demo User Suite (6 tests)

Test coverage for the `demo@oqlos.com` user from `.env`:

```bash
# Run all demo-user E2E tests
VITE_TEST_URL=http://localhost:3000 npx playwright test e2e/demo-user.spec.js --project=chromium
```

### E2E GUI Button Tests (20 tests)

Comprehensive GUI button and interaction tests covering all buttons across the application:

```bash
# Run all GUI button tests
VITE_TEST_URL=http://localhost:3000 npx playwright test e2e/gui-buttons.spec.js --project=chromium
```

Covers: Landing page buttons, Login submit, Dashboard cards, Scenarios tabs/run button, NLP console submit, Billing subscribe, Navigation, Theme toggle, and full user journey.

| Suite | Tests | What it covers |
|-------|-------|----------------|
| Login | 4 | Form, auto-fill `?plan=pro`, JWT storage, redirect |
| Dashboard | 4 | Stats grid, quick-action navigation |
| Scenarios — OQL | 7 | Editor, tabs, keywords, custom code, syntax highlighting, terminal dry-run |
| Scenarios — IQL | 4 | API test tab, session recording, syntax, custom IQL |
| NLP Console | 5 | OQL generation, IQL generation, tab switching, placeholders |
| Billing | 4 | Pricing cards, Pro features, payment success state |
| Navigation | 2 | SharedNav, full user journey (login → dashboard → scenarios → NLP → billing) |
| Logout | 1 | Session clearing |
| Protected routes | 3 | Redirect to /login without auth |

### Ansible E2E Tests
```bash
# Standard run (runs all suites: smoke, landing, test-user)
npm run ansible:test

# With custom port
APP_PORT=8080 ansible-playbook -i ansible/inventory.ini ansible/playbook-test.yml
```

The Ansible playbook runs each test suite separately and produces a detailed report at `test-results/ansible-test-report.txt`.

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

**⚠️ Requires `oql-api` repository in `packages/oql-api` for full stack.**

demo@oqlos.com
test@test.com

```bash
# Development: Traefik + API + Portal + Mailpit
make dev-docker
# → oqlos.localhost, api.oqlos.localhost, mail.oqlos.localhost

# Production: HTTPS + Let's Encrypt + Postgres + Redis
make prod
# → oqlos.com, api.oqlos.com (TLS)

# Stop stacks
make dev-docker-down
make prod-down
```

### Test Data Services (Docker)

Standalone PostgreSQL + Redis with pre-seeded test data for `test@test.com`:

```bash
# Start test services
cd infra/docker/dev
docker-compose -f docker-compose.test.yml up -d

# Verify test data
psql -h localhost -p 5433 -U test_user -d oqlos_test -c "SELECT * FROM users;"

# Stop & reset
docker-compose -f docker-compose.test.yml down -v
```

| Service | Port | Credentials |
|---------|------|-------------|
| PostgreSQL | 5433 | `test_user` / `test_password` / `oqlos_test` |
| Redis | 6380 | password: `test_redis_password` |

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
│   ├── test-user.spec.js   # test@test.com full journey (34 tests)
│   ├── landing.spec.js     # Landing + login + dashboard page tests
│   └── smoke.spec.js       # Smoke tests for all routes
├── ansible/                # Ansible playbooks
│   ├── inventory.ini       # Host inventory
│   ├── playbook-test.yml   # Test playbook
│   ├── playbook-deploy.yml # Deploy playbook
│   └── templates/          # Jinja2 templates
├── infra/                  # Infrastructure configs
│   └── docker/             # Docker compose files
│       ├── dev/            # Dev + test service configs
│       └── prod/           # Production config
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
| `make docker-build` | Build Docker image |
| `make test` | Full test suite |
| `make test-e2e` | Playwright E2E |
| `make test-e2e-ci` | CI E2E (chromium) |
| `make ansible-test` | Ansible tests |
| `make ansible-deploy` | Deploy |
| `make clean` | Clean build artifacts |
| `make clean-all` | Clean + node_modules |
| `make ci` | Full CI pipeline |
| `make docker-build` | Build Docker image (portal only) |
| `make docker-run` | Run portal container (standalone) |
| `make dev-docker` | Start dev Docker Compose stack (requires API) |
| `make dev-docker-down` | Stop dev stack |
| `make prod` | Start prod Docker Compose stack |
| `make prod-down` | Stop prod stack |

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
