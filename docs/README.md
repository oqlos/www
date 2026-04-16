<!-- code2docs:start --># www

![version](https://img.shields.io/badge/version-0.1.0-blue) ![python](https://img.shields.io/badge/python-%3E%3D3.9-blue) ![coverage](https://img.shields.io/badge/coverage-unknown-lightgrey) ![functions](https://img.shields.io/badge/functions-199-green)
> **199** functions | **1** classes | **58** files | CC̄ = 2.7

> Auto-generated project documentation from source code analysis.

**Author:** Tom Softreck <tom@sapletta.com>  
**License:** Not specified  
**Repository:** [https://github.com/oqlos/www](https://github.com/oqlos/www)

## Installation

### From PyPI

```bash
pip install www
```

### From Source

```bash
git clone https://github.com/oqlos/www
cd www
pip install -e .
```


## Quick Start

### CLI Usage

```bash
# Generate full documentation for your project
www ./my-project

# Only regenerate README
www ./my-project --readme-only

# Preview what would be generated (no file writes)
www ./my-project --dry-run

# Check documentation health
www check ./my-project

# Sync — regenerate only changed modules
www sync ./my-project
```

### Python API

```python
from www import generate_readme, generate_docs, Code2DocsConfig

# Quick: generate README
generate_readme("./my-project")

# Full: generate all documentation
config = Code2DocsConfig(project_name="mylib", verbose=True)
docs = generate_docs("./my-project", config=config)
```

## Generated Output

When you run `www`, the following files are produced:

```
<project>/
├── README.md                 # Main project README (auto-generated sections)
├── docs/
│   ├── api.md               # Consolidated API reference
│   ├── modules.md           # Module documentation with metrics
│   ├── architecture.md      # Architecture overview with diagrams
│   ├── dependency-graph.md  # Module dependency graphs
│   ├── coverage.md          # Docstring coverage report
│   ├── getting-started.md   # Getting started guide
│   ├── configuration.md    # Configuration reference
│   └── api-changelog.md    # API change tracking
├── examples/
│   ├── quickstart.py       # Basic usage examples
│   └── advanced_usage.py   # Advanced usage examples
├── CONTRIBUTING.md         # Contribution guidelines
└── mkdocs.yml             # MkDocs site configuration
```

## Configuration

Create `www.yaml` in your project root (or run `www init`):

```yaml
project:
  name: my-project
  source: ./
  output: ./docs/

readme:
  sections:
    - overview
    - install
    - quickstart
    - api
    - structure
  badges:
    - version
    - python
    - coverage
  sync_markers: true

docs:
  api_reference: true
  module_docs: true
  architecture: true
  changelog: true

examples:
  auto_generate: true
  from_entry_points: true

sync:
  strategy: markers    # markers | full | git-diff
  watch: false
  ignore:
    - "tests/"
    - "__pycache__"
```

## Sync Markers

www can update only specific sections of an existing README using HTML comment markers:

```markdown
<!-- www:start -->
# Project Title
... auto-generated content ...
<!-- www:end -->
```

Content outside the markers is preserved when regenerating. Enable this with `sync_markers: true` in your configuration.

## Architecture

```
www/
├── docker-entrypoint├── project├── tree    ├── config    ├── sw    ├── main    ├── App    ├── config    ├── config        ├── useAuth        ├── ProtectedRoute        ├── LangSwitch        ├── oql-examples        ├── LoadingSpinner        ├── SharedNav        ├── CodeEditor        ├── ArchDiagram        ├── ErrorBoundary        ├── ThemeToggle        ├── PricingCards        ├── TerminalSim        ├── NlpConsole        ├── Login        ├── RoiCalculator        ├── CaseStudies        ├── Billing        ├── Landing        ├── Scenarios        ├── Account        ├── Dashboard            ├── SubscriptionSection            ├── DangerZoneSection        ├── Academy        ├── Status        ├── Demo            ├── PaymentHistorySection            ├── ProfileSection        ├── I18nProvider            ├── spec        ├── logger        ├── install-commands        ├── spec        ├── spec        ├── api        ├── spec        ├── spec        ├── spec        ├── spec        ├── spec        ├── spec        ├── spec            ├── spec            ├── spec            ├── spec            ├── spec            ├── spec            ├── spec            ├── spec```

## API Overview

### Classes

- **`ErrorBoundary`** — —

### Functions

- `env()` — —
- `useAuth()` — —
- `navigate()` — —
- `jwt()` — —
- `isAuthenticated()` — —
- `logout()` — —
- `requireAuth()` — —
- `jwt()` — —
- `highlightOQL()` — —
- `html()` — —
- `highlightIQL()` — —
- `textareaRef()` — —
- `preRef()` — —
- `code()` — —
- `fn()` — —
- `handleScroll()` — —
- `handleChange()` — —
- `newCode()` — —
- `parseScenarioCode()` — —
- `lines()` — —
- `scenarioName()` — —
- `trimmed()` — —
- `scenarioMatch()` — —
- `deviceMatch()` — —
- `generateTermLines()` — —
- `fileName()` — —
- `lang()` — —
- `isLast()` — —
- `prefix()` — —
- `shortStep()` — —
- `previewLines()` — —
- `cleanLine()` — —
- `termRef()` — —
- `runSim()` — —
- `effectiveCode()` — —
- `termLines()` — —
- `idx()` — —
- `iv()` — —
- `BACKEND_URL()` — —
- `getEndpoint()` — —
- `getPlaceholder()` — —
- `handleSubmit()` — —
- `endpoint()` — —
- `url()` — —
- `res()` — —
- `data()` — —
- `navigate()` — —
- `token()` — —
- `plan()` — —
- `verifyTokenRef()` — —
- `autoSubmitRef()` — —
- `res()` — —
- `data()` — —
- `form()` — —
- `handleSubmit()` — —
- `calculateROI()` — —
- `currentMonthlyCost()` — —
- `oqlMonthlyCost()` — —
- `monthlySavings()` — —
- `annualSavings()` — —
- `roiPercentage()` — —
- `roi()` — —
- `IndustryBadge()` — —
- `style()` — —
- `title()` — —
- `subtitle()` — —
- `handleSubscribe()` — —
- `res()` — —
- `data()` — —
- `exampleKeys()` — —
- `getVariant()` — —
- `params()` — —
- `paramVariant()` — —
- `heroSubtitle()` — —
- `handleExampleChange()` — —
- `handleTabChange()` — —
- `handleCopy()` — —
- `exampleKeys()` — —
- `currentScenario()` — —
- `currentCode()` — —
- `handleCodeChange()` — —
- `handleTabChange()` — —
- `handleProfileUpdate()` — —
- `res()` — —
- `handleCancelSubscription()` — —
- `handleReactivateSubscription()` — —
- `handleExportData()` — —
- `blob()` — —
- `url()` — —
- `link()` — —
- `MOCK_ENABLED()` — —
- `BACKEND_URL()` — —
- `MockStatus()` — —
- `activeModuleData()` — —
- `status()` — —
- `getStatusColor()` — —
- `getStatusBg()` — —
- `getStatusBorder()` — —
- `copyAsYaml()` — —
- `IS_MOCK()` — —
- `MockCalendar()` — —
- `handleBook()` — —
- `handleSubmit()` — —
- `SUPPORTED_LANGS()` — —
- `I18nContext()` — —
- `getInitialLang()` — —
- `saved()` — —
- `browser()` — —
- `I18nProvider()` — —
- `setLang()` — —
- `dict()` — —
- `t()` — —
- `keys()` — —
- `val()` — —
- `useI18n()` — —
- `ctx()` — —
- `exported()` — —
- `logs()` — —
- `last()` — —
- `warns()` — —
- `LOG_LEVEL()` — —
- `MAX_BUFFER()` — —
- `filtered()` — —
- `INSTALL_DOCKER()` — —
- `INSTALL_RPI()` — —
- `downloadPromise()` — —
- `download()` — —
- `fileContent()` — —
- `data()` — —
- `heading()` — —
- `nav()` — —
- `errorMessages()` — —
- `response()` — —
- `FORCE_MOCK_ALL()` — —
- `MOCK_ENABLED()` — —
- `parseMockRequestBody()` — —
- `createMockLoginData()` — —
- `email()` — —
- `user()` — —
- `plan()` — —
- `mockFetch()` — —
- `match()` — —
- `fakeResponse()` — —
- `titleBeforeRun()` — —
- `badgeBeforeRun()` — —
- `terminalText()` — —
- `textarea()` — —
- `editedValue()` — —
- `afterSwitchBack()` — —
- `content()` — —
- `mockBackendRoutes()` — —
- `request()` — —
- `emailInput()` — —
- `jwt()` — —
- `user()` — —
- `response()` — —
- `subscribeButton()` — —
- `url()` — —
- `contactButton()` — —
- `downloadButton()` — —
- `hasMockCalendar()` — —
- `hasIframe()` — —
- `emailLink()` — —
- `href()` — —
- `demoLink()` — —
- `roiLink()` — —
- `featureCards()` — —
- `runBtn()` — —
- `nlpBtn()` — —
- `buttons()` — —
- `freeCardBtn()` — —
- `proCardBtn()` — —
- `enterpriseCardBtn()` — —
- `tabs()` — —
- `input()` — —
- `submitBtn()` — —
- `output()` — —
- `submitBtn()` — —
- `emailInput()` — —
- `backBtn()` — —
- `getStartedBtn()` — —
- `useCasesSection()` — —
- `outlineBtns()` — —
- `count()` — —
- `copyBtns()` — —
- `useCasesTabs()` — —
- `logoutBtn()` — —
- `jwt()` — —
- `scenariosLink()` — —
- `logo()` — —
- `tabs()` — —
- `count()` — —
- `runBtn()` — —
- `stepBtn()` — —


## Project Structure

📄 `docker-entrypoint`
📄 `e2e.account-export.spec` (4 functions)
📄 `e2e.account.spec`
📄 `e2e.billing-payment.spec` (6 functions)
📄 `e2e.buttons.billing-buttons.spec` (5 functions)
📄 `e2e.buttons.dashboard-buttons.spec` (3 functions)
📄 `e2e.buttons.landing-buttons.spec` (8 functions)
📄 `e2e.buttons.login-buttons.spec` (3 functions)
📄 `e2e.buttons.navigation-buttons.spec` (4 functions)
📄 `e2e.buttons.nlp-buttons.spec` (10 functions)
📄 `e2e.buttons.scenarios-buttons.spec` (6 functions)
📄 `e2e.case-studies.spec` (2 functions)
📄 `e2e.demo-page.spec` (4 functions)
📄 `e2e.demo-user.spec` (6 functions)
📄 `e2e.landing.spec` (5 functions)
📄 `e2e.scenarios-editor.spec` (10 functions)
📄 `e2e.smoke.spec` (1 functions)
📄 `playwright.config`
📄 `project`
📄 `public.sw`
📄 `src.App`
📄 `src.components.ArchDiagram`
📄 `src.components.CodeEditor` (11 functions)
📄 `src.components.ErrorBoundary` (4 functions, 1 classes)
📄 `src.components.LangSwitch`
📄 `src.components.LoadingSpinner`
📄 `src.components.PricingCards`
📄 `src.components.ProtectedRoute` (1 functions)
📄 `src.components.SharedNav`
📄 `src.components.TerminalSim` (22 functions)
📄 `src.components.ThemeToggle`
📄 `src.components.oql-examples`
📄 `src.config` (1 functions)
📄 `src.data.install-commands` (2 functions)
📄 `src.hooks.useAuth` (6 functions)
📄 `src.i18n.I18nProvider` (13 functions)
📄 `src.main`
📄 `src.mocks.api` (10 functions)
📄 `src.pages.Academy` (1 functions)
📄 `src.pages.Account` (10 functions)
📄 `src.pages.Billing` (3 functions)
📄 `src.pages.CaseStudies` (4 functions)
📄 `src.pages.Dashboard` (3 functions)
📄 `src.pages.Demo` (3 functions)
📄 `src.pages.Landing` (8 functions)
📄 `src.pages.Login` (11 functions)
📄 `src.pages.NlpConsole` (8 functions)
📄 `src.pages.RoiCalculator` (7 functions)
📄 `src.pages.Scenarios` (5 functions)
📄 `src.pages.Status` (5 functions)
📄 `src.pages.account.DangerZoneSection`
📄 `src.pages.account.PaymentHistorySection`
📄 `src.pages.account.ProfileSection` (1 functions)
📄 `src.pages.account.SubscriptionSection`
📄 `src.utils.logger` (4 functions)
📄 `src.utils.logger.spec` (4 functions)
📄 `tree`
📄 `vite.config`

## Requirements

- loglevel ^1.9.2- react ^18.3.1- react-dom ^18.3.1- react-router-dom ^6.28.0

## Contributing

**Contributors:**
- Tom Softreck <tom@sapletta.com>
- Tom Sapletta <tom-sapletta-com@users.noreply.github.com>

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/oqlos/www
cd www

# Install in development mode
pip install -e ".[dev]"

# Run tests
pytest
```

## Documentation

- 📖 [Full Documentation](https://github.com/oqlos/www/tree/main/docs) — API reference, module docs, architecture
- 🚀 [Getting Started](https://github.com/oqlos/www/blob/main/docs/getting-started.md) — Quick start guide
- 📚 [API Reference](https://github.com/oqlos/www/blob/main/docs/api.md) — Complete API documentation
- 🔧 [Configuration](https://github.com/oqlos/www/blob/main/docs/configuration.md) — Configuration options
- 💡 [Examples](./examples) — Usage examples and code samples

### Generated Files

| Output | Description | Link |
|--------|-------------|------|
| `README.md` | Project overview (this file) | — |
| `docs/api.md` | Consolidated API reference | [View](./docs/api.md) |
| `docs/modules.md` | Module reference with metrics | [View](./docs/modules.md) |
| `docs/architecture.md` | Architecture with diagrams | [View](./docs/architecture.md) |
| `docs/dependency-graph.md` | Dependency graphs | [View](./docs/dependency-graph.md) |
| `docs/coverage.md` | Docstring coverage report | [View](./docs/coverage.md) |
| `docs/getting-started.md` | Getting started guide | [View](./docs/getting-started.md) |
| `docs/configuration.md` | Configuration reference | [View](./docs/configuration.md) |
| `docs/api-changelog.md` | API change tracking | [View](./docs/api-changelog.md) |
| `CONTRIBUTING.md` | Contribution guidelines | [View](./CONTRIBUTING.md) |
| `examples/` | Usage examples | [Browse](./examples) |
| `mkdocs.yml` | MkDocs configuration | — |

<!-- code2docs:end -->

## Additional Features

### Logger Utility (`src/utils/logger.js`)

Advanced logging system with SQLite persistence and file output support.

**Configuration (Environment Variables):**

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_LOG_LEVEL` | `info` | Minimum log level |
| `VITE_LOG_TO_FILE` | `false` | Enable file logging to localStorage |
| `VITE_LOG_TO_DB` | `false` | Enable SQLite database logging |
| `VITE_SQLITE_DB_PATH` | `./logs/oqlos-portal.db` | Database identifier in localStorage |

**Usage:**

```javascript
import logger from './utils/logger';

// Basic logging
logger.info('Application started');
logger.error('Failed to load data', 'Dashboard', { userId: 123 });

// Query logs
const logs = logger.getLogs('error', 10);

// Export all logs
const allLogs = logger.exportLogs();

// Clear logs
logger.clearLogs();
```

### Testing Configuration

**Test User:**

| Email | Role | Plan | Auto-login URL |
|-------|------|------|----------------|
| `test@test.com` | admin | pro | `http://localhost:3000/login?plan=pro` |

**E2E Test Suites (`e2e/`):**

| File | Tests | Description |
|------|-------|-------------|
| `test-user.spec.js` | 34 | Full `test@test.com` journey: login, dashboard, OQL, IQL, NLP, billing, logout |
| `landing.spec.js` | 5 | Landing page, login page, dashboard page load |
| `smoke.spec.js` | 7 | All routes + API health check |

All test-user tests use Playwright route interception (`page.route()`) to mock backend responses — **no running backend required**.

```bash
# Run test-user suite
VITE_TEST_URL=http://localhost:3000 npx playwright test e2e/test-user.spec.js --project=chromium

# Run all E2E tests via Ansible (generates report)
npm run ansible:test
```

**Playwright Environment Variables:**
- `VITE_TEST_URL` - Base URL for E2E tests (default: `http://localhost:3000`)
- `VITE_DEV_PORT` - Dev server port (default: `3000`)

**Ansible Environment Variables:**
- `DEPLOY_DIR` - Deployment directory (default: `/opt/oqlos/www`)
- `APP_PORT` - Application port (default: `3000`)
- `SERVICE_NAME` - Systemd service name (default: `oqlos-portal`)
- `TEST_TIMEOUT` - Test timeout in seconds (default: `120`)

**Test Data Services (Docker):**

```bash
cd infra/docker/dev
docker-compose -f docker-compose.test.yml up -d
```

| Service | Port | Credentials |
|---------|------|-------------|
| PostgreSQL | 5433 | `test_user` / `test_password` / `oqlos_test` |
| Redis | 6380 | password: `test_redis_password` |