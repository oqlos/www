# OqlOS Portal

Industrial Test Automation DSL - Web Portal

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Testing

### Local Testing (Shell)
```bash
npm run test           # Run full test suite
bash test.sh           # Alternative: direct shell script
```

### E2E Testing with Playwright
```bash
npm run test:e2e       # Run E2E tests headless
npm run test:e2e:ui    # Run with UI debugger
```

### Ansible E2E Tests
```bash
npm run ansible:test   # Run ansible playbook for testing
```

## Pipeline (pyqual.yaml)

Quality pipeline stages:
1. **install** - npm ci
2. **lint** - ESLint check
3. **build** - Vite build
4. **test-unit** - Unit tests (placeholder)
5. **e2e-playwright** - E2E tests
6. **security-scan** - npm audit

## Deployment

```bash
npm run ansible:deploy  # Deploy with Ansible
```

## Project Structure

- `src/` - React application source
- `e2e/` - Playwright E2E tests
- `ansible/` - Ansible playbooks for testing & deployment
- `test.sh` - Shell-based test runner
- `pyqual.yaml` - Quality pipeline config

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run test` | Full test suite |
| `npm run test:e2e` | E2E tests only |
| `npm run ansible:test` | Ansible E2E tests |
| `npm run ansible:deploy` | Deploy with Ansible |

## License

Licensed under Apache-2.0.
