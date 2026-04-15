# Test Data Service

This directory contains configurations for running OqlOS with test data and services.

## Services

### Test Database (PostgreSQL)
- **Port**: 5433
- **Database**: oqlos_test
- **User**: test_user
- **Password**: test_password

### Test Redis
- **Port**: 6380
- **Password**: test_redis_password

## Test Users

The following test users are available:

| Email | Role | Plan | Purpose |
|-------|------|------|---------|
| test@test.com | admin | pro | Primary testing account |
| demo@oqlos.io | admin | pro | Demo account |
| user@oqlos.io | user | free | Basic user testing |

## Quick Start

### Start test services
```bash
cd infra/docker/dev
docker-compose -f docker-compose.test.yml up -d
```

### Stop test services
```bash
docker-compose -f docker-compose.test.yml down
```

### Connect to test database
```bash
psql -h localhost -p 5433 -U test_user -d oqlos_test
```

## Test Login

### Using the frontend test mode
Access the login page with the test parameter:
```
http://localhost:3002/login?plan=pro
```

This will:
- Auto-fill test@test.com
- Auto-submit the form
- Log in with test user data (admin, pro plan)

### Manual testing
1. Navigate to login page
2. Enter test@test.com
3. Submit the form
4. You'll be logged in with admin privileges and pro plan

## Test Data

### Test Scenarios
The test@test.com account includes pre-configured scenarios:
- Test Scenario 1: Basic pump control
- Test Scenario 2: Temperature monitoring

### Database Schema
- `users`: Test user accounts
- `scenarios`: Test scenarios for users

## Mock API

When running in development mode without a backend, the mock API provides:
- Authentication for test@test.com and demo@oqlos.io
- User data endpoints
- Scenario data
- Billing/subscription mocks
- NLP conversion mocks

## Reset Test Data

To reset the test database:
```bash
docker-compose -f docker-compose.test.yml down -v
docker-compose -f docker-compose.test.yml up -d
```

This will recreate the database with fresh test data.
