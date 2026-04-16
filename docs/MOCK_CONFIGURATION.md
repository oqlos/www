# Mock API Configuration

## Overview

OqlOS Portal supports selective mocking of API endpoints for development purposes. This allows you to:

- Work on the frontend without a running backend
- Test specific features with real APIs while mocking others
- Simulate different backend states (errors, slow responses, etc.)

## Quick Start

1. Check current mock status at: `http://oqlos.localhost/status` (requires login)
2. Edit `.env` file to configure which endpoints to mock
3. Restart the dev server: `make dev-docker`

## Configuration Options

### Global Mock Switch (Legacy Mode)

```env
# When true, mocks ALL endpoints (unless individually disabled)
VITE_FORCE_MOCK_API=true
```

**Note:** This is the legacy mode. When enabled, all endpoints are mocked unless explicitly set to `false` in individual settings.

### Selective Mock Configuration

Configure individual endpoint groups:

```env
# Authentication (login, token verification)
VITE_MOCK_AUTH=true

# User API (profile, settings)
VITE_MOCK_USER_API=true

# Scenarios API (list, create, update)
VITE_MOCK_SCENARIOS=true

# Billing & Subscription
VITE_MOCK_BILLING=true

# NLP/LLM API — REQUIRES REAL BACKEND
# Set to false when backend is available
VITE_MOCK_NLP=false
```

## Priority Logic

The system evaluates mock settings in this order:

1. **Individual setting** (`VITE_MOCK_*`) takes priority if explicitly set
2. **Global force** (`VITE_FORCE_MOCK_API=true`) enables mocking for all unset endpoints
3. **Default behavior**: Use real backend if backend URL is configured

### Examples

#### Scenario 1: Mock everything (frontend-only development)
```env
VITE_FORCE_MOCK_API=true
# All endpoints will be mocked
```

#### Scenario 2: Use real backend for NLP only
```env
VITE_FORCE_MOCK_API=true
VITE_MOCK_NLP=false
# Auth, User, Scenarios, Billing = mocked
# NLP = real backend (requires VITE_BACKEND_URL)
```

#### Scenario 3: Use real backend for everything except billing
```env
VITE_FORCE_MOCK_API=false
VITE_BACKEND_URL=http://localhost:8101
VITE_MOCK_BILLING=true
# Auth, User, Scenarios, NLP = real backend
# Billing = mocked
```

## Mock Data

Mock responses return consistent test data:

- **Auth**: Demo user (`demo@oqlos.com`) or test users
- **Scenarios**: 2 sample scenarios (Pump Test, Temperature Monitor)
- **Billing**: Pro plan, active status, mock checkout URLs
- **User**: Test user profile with admin role

## Status Page

Access the status page at `/status` (requires login) to view:

- Current mock configuration
- Which endpoints are mocked vs real
- Backend URL configuration
- Environment variable values

## Backend URL Configuration

For real backend connections, set:

```env
VITE_BACKEND_URL=http://localhost:8101
# OR
VITE_API_URL=http://localhost:8101
```

When no backend URL is configured, the system defaults to mock mode for safety.

## Console Logging

Mock responses are logged to browser console:
```
[MOCK] /auth/login → mocked response
```

## Production Build

In production builds (`npm run build`):
- Mock API is **automatically disabled**
- All requests go to the configured backend
- This ensures no accidental mock usage in production

## Troubleshooting

### Endpoint not mocked when it should be
1. Check `.env` file is in project root
2. Restart dev server after `.env` changes
3. Verify variable names (case-sensitive)
4. Check status page for actual configuration

### NLP not working with real backend
1. Set `VITE_MOCK_NLP=false`
2. Ensure `VITE_BACKEND_URL` points to running backend
3. Backend must expose `/nlp/to-oql` and `/nlp/to-iql` endpoints

### Changes not reflecting
1. Docker: `make dev-docker` (rebuilds image)
2. npm: Restart dev server
3. Clear browser cache
