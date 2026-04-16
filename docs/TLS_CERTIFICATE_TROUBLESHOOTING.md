# TLS Certificate Troubleshooting Guide

## Problem: `remote error: tls: internal error`

Symptomy:
- Przeglądarka nie może załadować strony HTTPS
- Błąd `ERR_SSL_PROTOCOL_ERROR` lub `SSL_ERROR_INTERNAL_ERROR_ALERT`
- `curl` zwraca `tls: internal error`
- Traefik loguje błędy certyfikatów

---

## Quick Diagnosis (30 sekund)

```bash
./scripts/check-tls.sh docs.oqlos.com
```

---

## Ręczna diagnostyka

### 1. Sprawdź czy domena się rozwiązuje

```bash
dig docs.oqlos.com +short
host docs.oqlos.com
```

Oczekiwany wynik: IP serwera prod (np. `1.2.3.4`)

### 2. Sprawdź port 443

```bash
nc -zv docs.oqlos.com 443
telnet docs.oqlos.com 443
```

Oczekiwany wynik: `Connected to docs.oqlos.com`

### 3. Sprawdź certyfikat z zewnątrz

```bash
openssl s_client -connect docs.oqlos.com:443 -servername docs.oqlos.com </dev/null 2>/dev/null | openssl x509 -noout -text
```

Oczekiwany wynik: Certyfikat dla `CN = docs.oqlos.com` z ważnymi datami

---

## Diagnostyka na serwerze prod

### 1. Sprawdź czy Traefik działa

```bash
docker ps | grep traefik
docker logs traefik --tail 50
```

### 2. Sprawdź status certyfikatów w acme.json

```bash
docker exec traefik cat /data/acme.json | jq '.[].Certificates | length'
docker exec traefik cat /data/acme.json | jq '.[].Certificates[].domain.main'
```

### 3. Sprawdź czy domena ma router w Traefik

```bash
# Lista wszystkich routerów
curl -s http://localhost:8080/api/http/routers | jq '.[].rule'

# Szukaj konkretnej domeny
curl -s http://localhost:8080/api/http/routers | jq '.[] | select(.rule | contains("docs"))'
```

### 4. Sprawdź logi Let's Encrypt

```bash
docker logs traefik --tail 200 | grep -i "certificate\|acme\|letsencrypt"
```

Typowe błędy Let's Encrypt:
- `urn:ietf:params:acme:error:rateLimited` - za dużo prób, odczekaj 1h
- `urn:ietf:params:acme:error:dns` - błąd DNS, sprawdź A record
- `urn:ietf:params:acme:error:connection` - Traefik nie widzi domeny

---

## Szybkie naprawy

### Opcja 1: Zrestartuj Traefik (najprostsza)

```bash
docker restart traefik
sleep 5
docker logs traefik --tail 30
```

### Opcja 2: Wyczyść cache certyfikatów i zrestartuj

**UWAGA:** Używaj tylko jeśli certyfikat się nie odnowił i jest nieprawidłowy.

```bash
# Backup
cp /var/lib/docker/volumes/traefik-data/_data/acme.json /tmp/acme-$(date +%Y%m%d).json.bak

# Usuń certyfikat dla domeny (ostrożnie!)
docker exec traefik cat /data/acme.json | jq 'del(.[].Certificates[] | select(.domain.main | contains("docs.oqlos.com")))' > /tmp/acme-cleaned.json
docker cp /tmp/acme-cleaned.json traefik:/data/acme.json

# Zrestartuj
docker restart traefik
```

### Opcja 3: Użyj staging Let's Encrypt (dla testów)

W `infra/docker/prod/docker-compose.prod.yml` zmień Traefik:

```yaml
command:
  - --certificatesresolvers.letsencrypt.acme.caserver=https://acme-staging-v02.api.letsencrypt.org/directory
```

Po udanym teście przywróć produkcyjny serwer:

```yaml
command:
  - --certificatesresolvers.letsencrypt.acme.caserver=https://acme-v02.api.letsencrypt.org/directory
```

---

## Weryfikacja naprawy

```bash
# Test curl (powinno zwrócić HTML)
curl -sI https://docs.oqlos.com

# Test SSL Labs (opcjonalnie)
# Wejdź na: https://www.ssllabs.com/ssltest/analyze.html?d=docs.oqlos.com
```

---

## Zapobieganie

Dodaj do crona monitoring certyfikatów:

```bash
# /etc/cron.daily/check-certs
#!/bin/bash
EXPIRY=$(echo | openssl s_client -servername docs.oqlos.com -connect docs.oqlos.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s)
NOW_EPOCH=$(date +%s)
DAYS_UNTIL_EXPIRY=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

if [ $DAYS_UNTIL_EXPIRY -lt 7 ]; then
  echo "ALERT: Certyfikat docs.oqlos.com wygasa za $DAYS_UNTIL_EXPIRY dni" | mail -s "SSL Alert" admin@oqlos.com
fi
```

---

## Checklist

- [ ] Domena poprawnie wskazuje na serwer (A record)
- [ ] Port 443 jest otwarty w firewallu
- [ ] Traefik działa (`docker ps`)
- [ ] Router dla domeny istnieje w Traefik API
- [ ] `acme.json` zawiera certyfikat dla domeny
- [ ] Logi Traefik nie pokazują błędów Let's Encrypt
- [ ] Test `curl https://domena` działa
