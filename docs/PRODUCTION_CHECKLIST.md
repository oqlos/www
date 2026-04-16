# OqlOS Portal — Production Deployment Checklist

**Version:** v1.0.0-phase3  
**Date:** 2026-04-16  
**Status:** ✅ READY FOR PRODUCTION

---

## Pre-Flight Verification

### 1. Build Verification
- [x] `npm run build` — zero errors
- [x] `npm run build` — zero warnings  
- [x] Bundle size: ~260KB gzipped
- [x] All routes resolve correctly

### 2. Test Users (Mock API)

| Email | Role | Plan | Purpose |
|-------|------|------|---------|
| test@test.com | admin | business | Primary testing |
| demo@oqlos.io | admin | business | Demo account |
| demo@oqlos.com | user | free | Basic testing |

### 3. Environment Variables Required

```bash
# Core (required)
VITE_BACKEND_URL=https://api.oqlos.com
VITE_API_URL=https://api.oqlos.com
VITE_FORCE_MOCK_API=false

# Stripe (required for billing)
VITE_STRIPE_PK=pk_live_XXXXXXXXXXXXXXXX

# Optional
VITE_GA_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@yyy.ingest.sentry.io/zzz
```

---

## Deployment Steps

### Step 1: Prepare Server
```bash
# On production server
mkdir -p /opt/oqlos
cd /opt/oqlos

# Create .env.prod
cat > .env.prod << 'EOF'
DB_USER=oqlos_prod
DB_PASS=<generate-32-char-password>
REDIS_PASS=<generate-32-char-password>
SECRET_KEY=<openssl-rand-base64-32>
ACME_EMAIL=admin@oqlos.com
STRIPE_SK=sk_live_XXXXXXXXXXXXXXXXXXXXXXXX
P24_MID=XXXXXX
P24_CRC=XXXXXXXXXXXXXXXX
SMTP_HOST=smtp.oqlos.com
SMTP_PORT=587
SMTP_USER=noreply@oqlos.com
SMTP_PASS=<smtp-password>
VERSION=v1.0.0-phase3
EOF
```

### Step 2: Deploy Application
```bash
# Option A: GitHub Actions (recommended)
git tag v1.0.0-phase3
git push origin v1.0.0-phase3

# Option B: Manual deployment
./scripts/deploy.sh production v1.0.0-phase3
```

### Step 3: Post-Deploy Verification
```bash
# Health check
curl -f https://oqlos.com/api/health
curl -f https://api.oqlos.com/docs

# SSL verification
echo | openssl s_client -servername oqlos.com -connect oqlos.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## Feature Verification Checklist

### Public Pages (No Auth Required)
- [ ] `/` — Landing page loads, A/B hero subtitle works
- [ ] `/demo` — Demo booking page with Cal.com embed
- [ ] `/roi` — ROI Calculator functional
- [ ] `/case-studies` — 3 case studies display
- [ ] `/billing` — 3-tier pricing visible (Free, Business €49, Enterprise)
- [ ] `/login` — Login form works

### Protected Pages (Auth Required)
- [ ] `/dashboard` — Loads after login
- [ ] `/scenarios` — Editor works, tabs preserve state
- [ ] `/nlp` — NLP console functional
- [ ] `/account` — Profile + Slack settings + billing info
- [ ] `/status` — System status visible

### Key Features
- [ ] Login with test@test.com works
- [ ] Language switch (PL/EN/DE) works
- [ ] Dark/light theme toggle works
- [ ] Navigation shows all 9 links
- [ ] Billing page shows current plan
- [ ] Slack webhook can be configured (mock in dev)

---

## Pricing Tiers (Final)

| Tier | Price | Audience | Key Features |
|------|-------|----------|--------------|
| **Free** | €0 | Open source | 1 device, local, community |
| **Business** ⭐ | €49/mo | SMBs | Unlimited, fleet, compliance, support |
| **Enterprise** | Custom | Large orgs | On-premise, white-label, SLA 99.99% |

---

## Rollback Plan

If issues detected within 30 minutes of deploy:

```bash
# On production server
cd /opt/oqlos
export VERSION=previous-stable-tag
docker-compose -f infra/docker/prod/docker-compose.prod.yml up -d portal
```

---

## Post-Deploy Monitoring

Check these within 1 hour of deployment:

1. **Error rates** — No spike in 4xx/5xx errors
2. **Load time** — Landing < 2s, Dashboard < 3s
3. **API health** — `/api/health` returns 200
4. **SSL expiry** — Certificate valid > 30 days
5. **Stripe webhooks** — Receiving and processing events

---

## Sign-Off

- [ ] Build verified
- [ ] Deployed to production
- [ ] Smoke tests passed
- [ ] Monitoring active
- [ ] Team notified

**Deployed by:** _______________  
**Date/Time:** _______________  
**Version:** v1.0.0-phase3
