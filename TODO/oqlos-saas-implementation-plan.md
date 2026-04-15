# OqlOS SaaS Platform — Kompletny Plan Implementacji

**Data:** 2026-04-15  
**Cel:** Uruchomienie oqlos.io jako SaaS z auth, płatnościami i pełnym DSL ecosystem  
**Wykonawca:** LLM agent (Claude Code / Codex) z nadzorem developera

---

## 1. Architektura Języków DSL — 4 Warstwy (nie 2!)

### Korekta nazewnictwa

| Warstwa | Język | Typ | Pliki | Runtime | Cel |
|---------|-------|-----|-------|---------|-----|
| **L1** | **OQL** | Imperatywny | `.oql` | OqlOS | Sterowanie hardware: SET, WAIT, PUMP, IF/ELSE, SAVE. Kontrola zaworów, pomp, sensorów. |
| **L2** | **IQL/TestQL** | Deklaratywny | `.iql`, `.tql` | TestQL runner | Testowanie API (GET/POST/ASSERT) i GUI (NAVIGATE/CLICK/ASSERT_VISIBLE). Zero kodu. |
| **L3** | **NLP→DSL** | Natural Language | tekst/voice | [nlp2dsl](https://github.com/wronai/nlp2dsl) | Konwersja języka naturalnego na OQL/IQL ze schematem walidacji. |
| **L4** | **NLP→CMD** | Natural Language | tekst/voice | [nlp2cmd](https://github.com/wronai/nlp2cmd) | Konwersja NLP na komendy DevOps: docker, git, kubectl, systemctl. |

### Relacje między warstwami

```
Użytkownik (tekst/głos)
    │
    ├─► NLP2DSL (L3) ──► schema validation ──► OQL (L1) ──► OqlOS ──► Hardware
    │                                    └──► IQL (L2) ──► TestQL ──► API/GUI
    │
    └─► NLP2CMD (L4) ──► DevOps commands ──► docker/kubectl/git
```

**CQL NIE jest osobnym językiem** — to legacy alias dla OQL w kontekście systemu inspekcji c2004. CQL = ograniczony OQL. Wszystkie referencje CQL→OQL są już bridge'owane.

---

## 2. Aktualny Stan Kodu (z toon analysis 2026-04-15)

### Metryki zdrowia

| Projekt | Pliki | Linie | CC̄ | Critical | Dups | Cycles | Testy |
|---------|-------|-------|-----|----------|------|--------|-------|
| **oqlos** | 76 | ~9600 | 3.9 | 3 🟡 | 14 | 0 ✅ | 255 ✅ |
| **oql** | 18 | ~1050 | 2.4 | 0 ✅ | 0 ✅ | 0 ✅ | — |
| **weboql** | 6 | ~390 | 4.2 | 1 🟡 | 0 | 0 ✅ | — |
| **testql** | — | ~543 | — | 0 ✅ | 0 | 0 ✅ | — |

### Krytyczne do naprawy PRZED SaaS launch

```
HEALTH[3] do rozwiązania:
  🟡 interactive_shell      CC=24 → split na 3 handlery
  🟡 main (cql_cli)         CC=25 → extract: _parse_args, _setup_env, _run
  🟡 get_system_status      CC=18 → extract: _collect_hw_status, _collect_sw_status

DUPLICATION[14] → 5 po event_store bridge (plan w refactor-final-sprint.md):
  #1  health_check lung/motor   40L → extract_function
  #2  disconnect lung/motor/piadc 7L → extract_function  
  #3  index_page api/weboql      6L → extract_function
  #4-14 tokenizer patterns       → internal refactor
```

---

## 3. Docelowa Architektura SaaS

### Struktura monorepo

```
oqlos/
├── packages/
│   ├── oql-core/           # Parser + interpreter (Python) ← ISTNIEJE
│   ├── oql-api/            # REST API (FastAPI) ← ISTNIEJE
│   ├── oql-cli/            # CLI (oqlctl) ← ISTNIEJE
│   ├── oql-sdk/            # Python SDK ← ISTNIEJE
│   ├── oql-ide/            # Web IDE (React) ← ISTNIEJE (weboql)
│   └── testql/             # IQL/TQL runner ← ISTNIEJE
│
├── platform/               # ← NOWE: SaaS platform layer
│   ├── auth/               # Email auth + magic link
│   ├── billing/            # Stripe + Przelewy24
│   ├── tenants/            # Multi-tenant isolation
│   ├── smtp/               # Local SMTP + spam filter
│   └── portal/             # Landing page + dashboard
│
├── integrations/           # ← NOWE: zewnętrzne integracje
│   ├── nlp2dsl/            # git submodule → wronai/nlp2dsl
│   └── nlp2cmd/            # git submodule → wronai/nlp2cmd
│
├── services/
│   ├── oqlapi/             # Deployable API ← ISTNIEJE
│   └── oqlagent/           # RPi edge agent ← ISTNIEJE
│
├── infra/
│   ├── docker/
│   │   ├── dev/            # docker-compose.dev.yml ← ISTNIEJE
│   │   ├── prod/           # docker-compose.prod.yml ← ISTNIEJE
│   │   └── saas/           # docker-compose.saas.yml ← NOWE
│   └── podman/
│
└── scenarios/              # Public .oql/.iql library ← ISTNIEJE
```

### docker-compose.saas.yml

```yaml
version: "3.9"
services:
  traefik:
    image: traefik:v3
    command:
      - "--providers.docker=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.le.acme.tlschallenge=true"
      - "--certificatesresolvers.le.acme.email=${ACME_EMAIL}"
    ports:
      - "443:443"
      - "80:80"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./letsencrypt:/letsencrypt

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: oqlos
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASS}

  mailpit:
    image: axllent/mailpit:latest
    # Dev: web UI na :8025, SMTP na :1025
    # Prod: zamień na Postfix/DKIM lub zewnętrzny SMTP
    ports:
      - "8025:8025"
    environment:
      MP_SMTP_AUTH_ACCEPT_ANY: 0
      MP_SMTP_AUTH_ALLOW_INSECURE: 0

  oqlapi:
    build: ../../packages/oql-api
    labels:
      - "traefik.http.routers.api.rule=Host(`api.oqlos.io`)"
      - "traefik.http.routers.api.tls.certresolver=le"
    environment:
      - DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@postgres/oqlos
      - REDIS_URL=redis://:${REDIS_PASS}@redis:6379
      - SMTP_HOST=mailpit
      - SMTP_PORT=1025
      - STRIPE_SECRET_KEY=${STRIPE_SK}
      - PRZELEWY24_MERCHANT_ID=${P24_MID}
      - PRZELEWY24_CRC=${P24_CRC}
      - SECRET_KEY=${SECRET_KEY}
      - OQLOS_ENV=saas
    depends_on: [postgres, redis, mailpit]

  portal:
    build: ../../platform/portal
    labels:
      - "traefik.http.routers.portal.rule=Host(`oqlos.io`)"
      - "traefik.http.routers.portal.tls.certresolver=le"

  ide:
    build: ../../packages/oql-ide
    labels:
      - "traefik.http.routers.ide.rule=Host(`ide.oqlos.io`)"
      - "traefik.http.routers.ide.tls.certresolver=le"

volumes:
  pgdata:
```

---

## 4. Plan Implementacji — 8 Sprintów

### SPRINT 0: Dokończenie refaktoryzacji (1 dzień)

**Źródło:** `refactor-final-sprint.md` + `duplication.toon.yaml`

```
ZADANIA:
  0.1  event_store bridge oql→oqlos               15 min
  0.2  _resolve_compare → _compare.py             30 min
  0.3  pause/resume/stop aliasy w execution.py     30 min
  0.4  _handle_pause factory w state.py            30 min
  0.5  split interactive_shell CC=24 → 3 handlery  1h
  0.6  split main CC=25 → _parse/_setup/_run       1h
  0.7  pytest oqlos (255 pass, 0 regresji)         10 min

CEL: CC̄ 3.9→≤3.5, dups 14→0, critical 3→0
```

### SPRINT 1: Baza danych + modele tenant (2 dni)

```python
# platform/auth/models.py
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import uuid

class Tenant(Base):
    """Firma/organizacja korzystająca z SaaS."""
    __tablename__ = "tenants"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)           # Nazwa firmy
    slug = Column(String(100), unique=True, nullable=False)
    plan = Column(String(20), default="free")            # free|pro|enterprise
    stripe_customer_id = Column(String(255), nullable=True)
    p24_merchant_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default="now()")
    users = relationship("User", back_populates="tenant")

class User(Base):
    """Użytkownik w ramach tenanta."""
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    email_verified = Column(Boolean, default=False)
    role = Column(String(20), default="operator")        # admin|engineer|operator
    tenant_id = Column(String, ForeignKey("tenants.id"), nullable=False)
    tenant = relationship("Tenant", back_populates="users")
    created_at = Column(DateTime, server_default="now()")

class MagicLink(Base):
    """Jednorazowy link do logowania przez email."""
    __tablename__ = "magic_links"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), nullable=False, index=True)
    token = Column(String(64), unique=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    ip_address = Column(String(45))          # do spam detection
    created_at = Column(DateTime, server_default="now()")
```

```bash
# Migracja
pip install alembic sqlalchemy asyncpg
alembic init platform/auth/migrations
alembic revision --autogenerate -m "initial: tenant, user, magic_link"
alembic upgrade head
```

### SPRINT 2: Auth — Email Magic Link + SMTP (2 dni)

**Architektura:** Passwordless auth — użytkownik podaje email, dostaje link, klika i jest zalogowany. Żadnych haseł.

```python
# platform/auth/router.py
from fastapi import APIRouter, BackgroundTasks, Request, HTTPException
from datetime import datetime, timedelta
import secrets, hashlib

router = APIRouter(prefix="/auth", tags=["auth"])

# ── Rate limit + spam filter ──
RATE_LIMIT = {
    "max_per_email_per_hour": 3,
    "max_per_ip_per_hour": 10,
    "disposable_domains_block": True,    # block mailinator, guerrilla, etc.
    "allowed_tlds": None,               # None = all, or ["pl","com","de","eu"]
}

DISPOSABLE_DOMAINS_URL = (
    "https://raw.githubusercontent.com/disposable-email-domains/"
    "disposable-email-domains/master/disposable_email_blocklist.conf"
)

async def _is_spam(email: str, ip: str, db) -> tuple[bool, str]:
    """Multi-layer spam filtering."""
    domain = email.split("@")[1].lower()
    
    # 1. Disposable email check (cache in Redis, refresh daily)
    if await redis.sismember("disposable_domains", domain):
        return True, "Disposable email addresses are not allowed"
    
    # 2. Rate limit per email
    key_email = f"magic_link:{email}:{datetime.utcnow().strftime('%Y%m%d%H')}"
    count = await redis.incr(key_email)
    await redis.expire(key_email, 3600)
    if count > RATE_LIMIT["max_per_email_per_hour"]:
        return True, "Too many requests for this email"
    
    # 3. Rate limit per IP
    key_ip = f"magic_link_ip:{ip}:{datetime.utcnow().strftime('%Y%m%d%H')}"
    count_ip = await redis.incr(key_ip)
    await redis.expire(key_ip, 3600)
    if count_ip > RATE_LIMIT["max_per_ip_per_hour"]:
        return True, "Too many requests from this IP"
    
    return False, ""

@router.post("/login")
async def request_magic_link(
    email: str,
    request: Request,
    background_tasks: BackgroundTasks,
    db = Depends(get_db),
):
    """Krok 1: Użytkownik podaje email → dostaje magic link."""
    ip = request.client.host
    
    is_spam, reason = await _is_spam(email, ip, db)
    if is_spam:
        raise HTTPException(429, reason)
    
    token = secrets.token_urlsafe(48)
    expires = datetime.utcnow() + timedelta(minutes=15)
    
    link = MagicLink(
        email=email.lower().strip(),
        token=hashlib.sha256(token.encode()).hexdigest(),
        expires_at=expires,
        ip_address=ip,
    )
    db.add(link)
    await db.commit()
    
    # Send email (w tle, nie blokuj response)
    background_tasks.add_task(
        send_magic_link_email,
        to=email,
        link=f"https://oqlos.io/auth/verify?token={token}",
        expires_minutes=15,
    )
    
    return {"message": "Check your email for login link"}

@router.get("/verify")
async def verify_magic_link(token: str, db = Depends(get_db)):
    """Krok 2: Użytkownik klika link → dostaje JWT."""
    hashed = hashlib.sha256(token.encode()).hexdigest()
    
    link = await db.query(MagicLink).filter(
        MagicLink.token == hashed,
        MagicLink.used == False,
        MagicLink.expires_at > datetime.utcnow(),
    ).first()
    
    if not link:
        raise HTTPException(400, "Invalid or expired link")
    
    link.used = True
    
    # Auto-create user + tenant jeśli nie istnieje
    user = await db.query(User).filter(User.email == link.email).first()
    if not user:
        domain = link.email.split("@")[1]
        tenant = await _find_or_create_tenant(domain, db)
        user = User(
            email=link.email,
            email_verified=True,
            tenant_id=tenant.id,
            role="admin" if tenant.users == [] else "operator",
        )
        db.add(user)
    else:
        user.email_verified = True
    
    await db.commit()
    
    jwt_token = create_jwt(user_id=user.id, tenant_id=user.tenant_id)
    return {"token": jwt_token, "user": {"email": user.email, "role": user.role}}
```

```python
# platform/smtp/sender.py
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_CONFIG = {
    "host": os.getenv("SMTP_HOST", "localhost"),
    "port": int(os.getenv("SMTP_PORT", "1025")),
    "use_tls": os.getenv("SMTP_TLS", "false").lower() == "true",
    "username": os.getenv("SMTP_USER", ""),
    "password": os.getenv("SMTP_PASS", ""),
    "from_email": os.getenv("SMTP_FROM", "noreply@oqlos.io"),
    "from_name": os.getenv("SMTP_FROM_NAME", "OqlOS Platform"),
}

async def send_magic_link_email(to: str, link: str, expires_minutes: int):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Login to OqlOS"
    msg["From"] = f"{SMTP_CONFIG['from_name']} <{SMTP_CONFIG['from_email']}>"
    msg["To"] = to

    html = f"""
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
      <h2 style="color:#1e293b">Log in to OqlOS</h2>
      <p>Click the button below to log in. This link expires in {expires_minutes} minutes.</p>
      <a href="{link}" 
         style="display:inline-block;padding:14px 28px;background:#3b82f6;
                color:white;text-decoration:none;border-radius:8px;font-weight:600">
        Log In to OqlOS
      </a>
      <p style="color:#94a3b8;font-size:13px;margin-top:24px">
        If you didn't request this, ignore this email.
      </p>
    </div>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP(SMTP_CONFIG["host"], SMTP_CONFIG["port"]) as server:
        if SMTP_CONFIG["use_tls"]:
            server.starttls()
        if SMTP_CONFIG["username"]:
            server.login(SMTP_CONFIG["username"], SMTP_CONFIG["password"])
        server.sendmail(SMTP_CONFIG["from_email"], to, msg.as_string())
```

**Konfiguracja SMTP per środowisko:**

| Env | SMTP_HOST | SMTP_PORT | Opis |
|-----|-----------|-----------|------|
| dev | `mailpit` | `1025` | Mailpit — UI na :8025, łapie wszystkie maile |
| staging | `localhost` | `587` | Postfix + DKIM na serwerze |
| prod | `smtp.sendgrid.net` | `587` | SendGrid / Mailgun / SES |
| self-hosted | `postfix` | `25` | Docker Postfix z DKIM + SPF |

### SPRINT 3: Płatności — Stripe + Przelewy24 (3 dni)

**Architektura:** Abstrakcja payment provider, B2B (firma = tenant), plan przypisany do tenanta.

```python
# platform/billing/providers.py
from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class PaymentResult:
    success: bool
    provider: str           # "stripe" | "przelewy24"
    transaction_id: str
    checkout_url: str | None = None   # redirect URL for P24
    error: str | None = None

class PaymentProvider(ABC):
    @abstractmethod
    async def create_subscription(self, tenant_id: str, plan: str, email: str) -> PaymentResult: ...
    
    @abstractmethod
    async def cancel_subscription(self, tenant_id: str) -> PaymentResult: ...
    
    @abstractmethod
    async def handle_webhook(self, payload: bytes, signature: str) -> dict: ...


class StripeProvider(PaymentProvider):
    """Stripe — karty kredytowe, SEPA, międzynarodowe."""
    
    def __init__(self):
        import stripe
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
        self.stripe = stripe
    
    async def create_subscription(self, tenant_id, plan, email):
        PRICE_IDS = {
            "pro":        os.getenv("STRIPE_PRICE_PRO"),        # €49/mies
            "enterprise": os.getenv("STRIPE_PRICE_ENTERPRISE"),  # custom
        }
        
        customer = self.stripe.Customer.create(
            email=email,
            metadata={"tenant_id": tenant_id},
        )
        
        session = self.stripe.checkout.Session.create(
            customer=customer.id,
            payment_method_types=["card"],
            line_items=[{"price": PRICE_IDS[plan], "quantity": 1}],
            mode="subscription",
            success_url="https://oqlos.io/billing/success?session={CHECKOUT_SESSION_ID}",
            cancel_url="https://oqlos.io/billing/cancel",
            metadata={"tenant_id": tenant_id},
        )
        
        return PaymentResult(
            success=True,
            provider="stripe",
            transaction_id=session.id,
            checkout_url=session.url,
        )
    
    async def handle_webhook(self, payload, signature):
        event = self.stripe.Webhook.construct_event(
            payload, signature, os.getenv("STRIPE_WEBHOOK_SECRET")
        )
        
        if event.type == "checkout.session.completed":
            tenant_id = event.data.object.metadata["tenant_id"]
            await _activate_plan(tenant_id, "pro")
        
        elif event.type == "customer.subscription.deleted":
            tenant_id = event.data.object.metadata["tenant_id"]
            await _downgrade_to_free(tenant_id)
        
        return {"status": "ok"}


class Przelewy24Provider(PaymentProvider):
    """Przelewy24 — polskie przelewy bankowe, BLIK."""
    
    def __init__(self):
        self.merchant_id = os.getenv("PRZELEWY24_MERCHANT_ID")
        self.crc = os.getenv("PRZELEWY24_CRC")
        self.api_url = os.getenv(
            "PRZELEWY24_API_URL",
            "https://secure.przelewy24.pl"  # sandbox: sandbox.przelewy24.pl
        )
    
    async def create_subscription(self, tenant_id, plan, email):
        """P24 nie ma natywnych subskrypcji — używamy recurring payments."""
        import hashlib, httpx
        
        amount_gr = {"pro": 4900, "enterprise": 0}[plan]  # grosze (49 PLN ≈ €49)
        session_id = f"oqlos-{tenant_id}-{int(time.time())}"
        
        # CRC sign
        sign_str = f"{session_id}|{self.merchant_id}|{amount_gr}|PLN|{self.crc}"
        sign = hashlib.sha384(sign_str.encode()).hexdigest()
        
        async with httpx.AsyncClient() as client:
            resp = await client.post(f"{self.api_url}/api/v1/transaction/register", json={
                "merchantId": int(self.merchant_id),
                "posId": int(self.merchant_id),
                "sessionId": session_id,
                "amount": amount_gr,
                "currency": "PLN",
                "description": f"OqlOS {plan.title()} Plan",
                "email": email,
                "urlReturn": "https://oqlos.io/billing/success",
                "urlStatus": "https://api.oqlos.io/billing/webhook/p24",
                "sign": sign,
            }, auth=(str(self.merchant_id), os.getenv("PRZELEWY24_API_KEY")))
        
        data = resp.json()
        token = data.get("data", {}).get("token")
        
        return PaymentResult(
            success=True,
            provider="przelewy24",
            transaction_id=session_id,
            checkout_url=f"{self.api_url}/trnRequest/{token}",
        )


# ── Payment Router ──
PROVIDERS = {
    "stripe": StripeProvider,
    "przelewy24": Przelewy24Provider,
}

def get_provider(name: str) -> PaymentProvider:
    return PROVIDERS[name]()
```

```python
# platform/billing/router.py
from fastapi import APIRouter, Request, Depends

router = APIRouter(prefix="/billing", tags=["billing"])

@router.post("/subscribe/{plan}")
async def subscribe(
    plan: str,
    provider: str = "stripe",  # lub "przelewy24"
    user = Depends(get_current_user),
    db = Depends(get_db),
):
    """Rozpocznij subskrypcję — redirect do Stripe/P24 checkout."""
    if plan not in ("pro", "enterprise"):
        raise HTTPException(400, "Invalid plan")
    
    p = get_provider(provider)
    result = await p.create_subscription(
        tenant_id=user.tenant_id,
        plan=plan,
        email=user.email,
    )
    
    return {"checkout_url": result.checkout_url}

@router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")
    return await StripeProvider().handle_webhook(payload, sig)

@router.post("/webhook/p24")
async def p24_webhook(request: Request):
    payload = await request.body()
    sig = request.headers.get("x-p24-signature", "")
    return await Przelewy24Provider().handle_webhook(payload, sig)
```

### SPRINT 4: Integracja NLP2DSL + NLP2CMD (2 dni)

```bash
# Dodaj jako git submodules
cd oqlos/
git submodule add https://github.com/wronai/nlp2dsl integrations/nlp2dsl
git submodule add https://github.com/wronai/nlp2cmd integrations/nlp2cmd
```

```python
# platform/nlp/router.py
from fastapi import APIRouter

router = APIRouter(prefix="/nlp", tags=["nlp"])

@router.post("/to-oql")
async def nlp_to_oql(prompt: str, user = Depends(get_current_user)):
    """Konwertuj tekst naturalny na scenariusz OQL."""
    from integrations.nlp2dsl import convert
    
    oql_code = await convert(
        prompt=prompt,
        target_lang="oql",
        schema_path="docs/oql-spec.md",
        context={
            "available_hardware": await get_tenant_hardware(user.tenant_id),
            "existing_scenarios": await get_tenant_scenarios(user.tenant_id),
        },
    )
    
    # Walidacja wygenerowanego OQL
    from oqlos.core.cql_parser import parse_cql, validate_cql
    doc = parse_cql(oql_code, "nlp-generated.oql")
    issues = validate_cql(doc)
    
    return {
        "oql": oql_code,
        "valid": len(issues) == 0,
        "issues": [str(i) for i in issues],
    }

@router.post("/to-iql")
async def nlp_to_iql(prompt: str, user = Depends(get_current_user)):
    """Konwertuj tekst naturalny na scenariusz TestQL."""
    from integrations.nlp2dsl import convert
    
    iql_code = await convert(
        prompt=prompt,
        target_lang="iql",
        schema_path="docs/iql-spec.md",
    )
    
    return {"iql": iql_code}

@router.post("/devops")
async def nlp_to_cmd(prompt: str, user = Depends(get_current_user)):
    """Konwertuj NLP na komendy DevOps (docker, git, kubectl)."""
    from integrations.nlp2cmd import convert
    
    commands = await convert(
        prompt=prompt,
        allowed_commands=["docker", "docker-compose", "git", "oqlctl", "testql"],
        dry_run=True,  # nie wykonuj, tylko generuj
    )
    
    return {"commands": commands, "dry_run": True}
```

### SPRINT 5: Portal WWW + Landing Page (2 dni)

**Wykorzystaj istniejący artefakt** `oqlos-landing.jsx` stworzony w poprzednim kroku i rozszerz o:

```
platform/portal/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx        ← bazuj na oqlos-landing.jsx
│   │   ├── Login.jsx          ← formularz email → magic link
│   │   ├── Dashboard.jsx      ← po zalogowaniu: scenariusze, hardware, raporty
│   │   ├── Billing.jsx        ← wybór planu, historia płatności
│   │   ├── Scenarios.jsx      ← edytor OQL/IQL z kolorowaniem
│   │   └── NlpConsole.jsx     ← NLP→OQL/IQL generator
│   ├── components/
│   │   ├── CodeEditor.jsx     ← live editor z syntax highlighting
│   │   ├── TerminalSim.jsx    ← symulacja dry-run
│   │   └── PricingCards.jsx   ← z przyciskami Stripe/P24
│   └── App.jsx
├── Dockerfile
└── package.json
```

### SPRINT 6: Multi-tenant API isolation (2 dni)

```python
# platform/tenants/middleware.py
from fastapi import Request

async def tenant_middleware(request: Request, call_next):
    """Izolacja danych per tenant — każdy request ma tenant_id z JWT."""
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    
    if token and request.url.path.startswith("/api/"):
        payload = decode_jwt(token)
        request.state.tenant_id = payload["tenant_id"]
        request.state.user_id = payload["user_id"]
    
    response = await call_next(request)
    return response

# W każdym CRUD endpoint:
async def list_scenarios(request: Request, db = Depends(get_db)):
    tenant_id = request.state.tenant_id
    return await db.query(Scenario).filter(
        Scenario.tenant_id == tenant_id
    ).all()
```

### SPRINT 7: Deploy + CI/CD (1 dzień)

```yaml
# .github/workflows/deploy.yml
name: Deploy OqlOS SaaS
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: recursive
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -e ./packages/oql-core[dev]
      - run: pytest packages/oql-core/tests/ -q   # 255 tests
      - run: pytest packages/testql/tests/ -q

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - run: docker compose -f infra/docker/saas/docker-compose.saas.yml build
      - run: docker compose -f infra/docker/saas/docker-compose.saas.yml push

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: ssh deploy@oqlos.io "cd /opt/oqlos && docker compose pull && docker compose up -d"
```

---

## 5. Konfiguracja Zewnętrznych API

### 5.1 Stripe

```bash
# .env.saas
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...          # Produkt: OqlOS Pro, €49/mies
STRIPE_PRICE_ENTERPRISE=price_...    # Produkt: OqlOS Enterprise, custom

# Setup w Stripe Dashboard:
# 1. Products → New → "OqlOS Pro" → €49/month recurring
# 2. Products → New → "OqlOS Enterprise" → custom pricing
# 3. Developers → Webhooks → Add endpoint:
#    URL: https://api.oqlos.io/billing/webhook/stripe
#    Events: checkout.session.completed, customer.subscription.deleted,
#            invoice.payment_failed
```

### 5.2 Przelewy24

```bash
# .env.saas
PRZELEWY24_MERCHANT_ID=12345
PRZELEWY24_POS_ID=12345
PRZELEWY24_CRC=abcdef...
PRZELEWY24_API_KEY=...
PRZELEWY24_API_URL=https://secure.przelewy24.pl  # sandbox: sandbox.przelewy24.pl

# Setup w panelu P24:
# 1. Konto firmowe → Dane techniczne
# 2. URL powiadomień: https://api.oqlos.io/billing/webhook/p24
# 3. Klucz CRC do podpisu transakcji
```

### 5.3 SMTP (lokalna konfiguracja)

```bash
# Dev (Mailpit — łapie wszystkie maile, UI na :8025)
SMTP_HOST=mailpit
SMTP_PORT=1025
SMTP_TLS=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@oqlos.io

# Prod (Postfix z DKIM)
SMTP_HOST=postfix
SMTP_PORT=587
SMTP_TLS=true
SMTP_USER=oqlos
SMTP_PASS=${SMTP_PASSWORD}
SMTP_FROM=noreply@oqlos.io

# Alternatywa: SendGrid / Mailgun / Amazon SES
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=${SENDGRID_API_KEY}
```

---

## 6. Grupy Docelowe Klientów (B2B)

| Segment | Problem | Rozwiązanie OqlOS | Plan |
|---------|---------|-------------------|------|
| **Firmy BHP/SCBA** | Dräger Quaestor $8-30K, proprietary | OQL scenariusze testowe na RPi, 10-50× taniej | Pro |
| **Firmy IT/QA** | Cypress/Playwright wymaga developerów | TestQL/IQL — zero kodu, operatorzy piszą testy | Pro |
| **Integrations SaaS** | Brak testów regresyjnych dla API | IQL: API GET, ASSERT_STATUS, ASSERT_JSON | Free→Pro |
| **DevOps teams** | Skryptowanie powtarzalnych zadań | NLP2CMD: "zrestartuj staging" → docker compose restart | Pro |
| **Pharma/GxP** | Walidacja sprzętu wymaga dokumentacji | OQL + automatyczne raporty PDF + audit trail | Enterprise |
| **Firmy produkcyjne** | Kalibracja sensorów ręcznie | OQL: calibration scenarios + compliance export | Enterprise |

---

## 7. Harmonogram

```
Tydzień 1:  Sprint 0 (refactor) + Sprint 1 (DB + models)
Tydzień 2:  Sprint 2 (auth) + Sprint 3 start (billing)
Tydzień 3:  Sprint 3 finish + Sprint 4 (NLP integration)
Tydzień 4:  Sprint 5 (portal) + Sprint 6 (multi-tenant)
Tydzień 5:  Sprint 7 (deploy) + QA + soft launch
Tydzień 6:  Public launch oqlos.io
```

---

## 8. Checklist dla LLM Agenta

Każdy sprint powinien zakończyć się:

- [ ] Wszystkie nowe pliki mają docstring i type hints
- [ ] Testy: pytest przechodzi (0 regresji do istniejących 255)
- [ ] Nowe testy: ≥80% coverage dla nowego kodu
- [ ] CC̄ nowych modułów ≤ 10
- [ ] Brak circular imports (sprawdź: `code2llm ./ -f toon | grep CYCLES`)
- [ ] Docker build przechodzi
- [ ] `.env.example` zaktualizowany o nowe zmienne
- [ ] Dokumentacja API (FastAPI auto-generates OpenAPI)
- [ ] Git commit z conventional commits: `feat(auth):`, `fix(billing):`, etc.

---

## 9. Istniejące Zasoby do Wykorzystania

| Zasób | Lokalizacja | Status | Użycie |
|-------|-------------|--------|--------|
| OqlOS runtime | `packages/oql-core/` | ✅ 255 tests | Core engine — nie ruszaj |
| OQL CLI | `packages/oql-cli/` | ✅ stable | `oqlctl` komendy |
| TestQL runner | `packages/testql/` | ✅ stable | IQL/TQL execution |
| Web IDE | `packages/oql-ide/` (weboql) | ✅ works | Bazuj na tym dla portal IDE |
| REST API | `packages/oql-api/` | ✅ 12 endpoints | Rozszerz o auth + billing routes |
| Docker dev | `infra/docker/dev/` | ✅ works | Bazuj na tym dla saas compose |
| Docker prod | `infra/docker/prod/` | ✅ works | TLS + Traefik config |
| Landing JSX | `oqlos-landing.jsx` | ✅ done | Portal landing page |
| OQL scenarios | `scenarios/` | ✅ 3 scenarios | Demo library |
| NLP2DSL | github.com/wronai/nlp2dsl | ✅ public | Git submodule |
| NLP2CMD | github.com/wronai/nlp2cmd | ✅ public | Git submodule |
| Refactor plan | `refactor-final-sprint.md` | ✅ detailed | Sprint 0 source |
| Code analysis | `*.toon.yaml` | ✅ fresh | Metryki bazowe |
