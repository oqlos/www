# OqlOS Portal — Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables

Create `.env.prod` file:

```bash
# Database
DB_USER=oqlos_prod
DB_PASS=<generate-strong-password>

# Redis
REDIS_PASS=<generate-strong-password>

# Security
SECRET_KEY=<openssl-rand-base64-32>
ACME_EMAIL=admin@oqlos.com

# Payments (production keys!)
STRIPE_SK=sk_live_...
P24_MID=...
P24_CRC=...

# SMTP
SMTP_HOST=smtp.oqlos.com
SMTP_PORT=587
SMTP_USER=noreply@oqlos.com
SMTP_PASS=...

# Version
VERSION=v1.0.0
```

### 2. Infrastructure Prerequisites

- [ ] Server with Docker & Docker Compose
- [ ] Ports 80, 443 open
- [ ] DNS configured: oqlos.com, www.oqlos.com, api.oqlos.com
- [ ] GitHub Container Registry access
- [ ] SSH keys for deployment

### 3. SSL Certificates

Traefik handles Let's Encrypt automatically. First deploy may take 1-2 minutes for cert generation.

### 4. Stripe Configuration

1. Create products in Stripe Dashboard:
   - Starter: €19/month
   - Pro: €49/month  
   - Business: €149/month

2. Copy price IDs to backend config

3. Configure webhook endpoint:
   ```
   https://api.oqlos.com/billing/webhook
   ```

4. Add webhook signing secret to `.env.prod`

### 5. Deployment Steps

```bash
# 1. Clone repo on server
git clone https://github.com/oqlos/oqlos-portal.git /opt/oqlos
cd /opt/oqlos

# 2. Create environment
cp docs/.env.example .env.prod
nano .env.prod  # Fill in values

# 3. Initial deployment
docker-compose -f infra/docker/prod/docker-compose.prod.yml up -d

# 4. Verify
curl https://oqlos.com/api/health
curl https://api.oqlos.com/docs

# 5. Database migrations (if needed)
docker exec oqlos-oqlapi python manage.py migrate
```

### 6. Post-Deployment Verification

- [ ] Landing page loads (oqlos.com)
- [ ] API docs accessible (api.oqlos.com/docs)
- [ ] Login works
- [ ] Stripe test payment succeeds
- [ ] Email delivery works
- [ ] SSL certificates valid

### 7. Monitoring Setup

```bash
# View logs
docker-compose -f infra/docker/prod/docker-compose.prod.yml logs -f

# Check resource usage
docker stats

# Database backup (cron job)
0 2 * * * /opt/oqlos/scripts/backup.sh
```

### 8. Rollback Procedure

```bash
# Rollback to previous version
cd /opt/oqlos
export VERSION=previous-tag
docker-compose -f infra/docker/prod/docker-compose.prod.yml up -d portal

# Database restore (if needed)
docker exec -i oqlos-postgres psql -U ${DB_USER} oqlos < backup/pre-deploy-XXXX.sql
```

## GitHub Actions Secrets

Required repository secrets:

| Secret | Description |
|--------|-------------|
| `STRIPE_PUBLISHABLE_KEY` | pk_live_... for frontend |
| `STAGING_HOST` | Staging server IP |
| `STAGING_USER` | SSH username |
| `STAGING_SSH_KEY` | Private key |
| `PROD_HOST` | Production server IP |
| `PROD_USER` | SSH username |
| `PROD_SSH_KEY` | Private key |

Required repository variables:

| Variable | Example |
|----------|---------|
| `BACKEND_URL` | https://api.oqlos.com |
| `API_URL` | https://api.oqlos.com |
