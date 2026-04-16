#!/bin/bash
#
# TLS Certificate Diagnostic Script for OqlOS Infrastructure
# Usage: ./check-tls.sh <domain> [server_ip]
#
# Examples:
#   ./check-tls.sh docs.oqlos.com
#   ./check-tls.sh oqlos.com 1.2.3.4
#   ./check-tls.sh api.oqlos.com prod-server.oqlos.com
#

set -e

DOMAIN="${1:-docs.oqlos.com}"
SERVER="${2:-}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=========================================="
echo "TLS Certificate Diagnostics for: $DOMAIN"
echo "=========================================="
echo ""

# Helper functions
print_ok() { echo -e "${GREEN}✓${NC} $1"; }
print_warn() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

# 1. DNS Resolution
echo "[1/6] DNS Resolution..."
IP=$(dig +short "$DOMAIN" | head -1 || echo "")
if [ -z "$IP" ]; then
  print_error "DNS nie rozwiązuje $DOMAIN"
  echo "  Sprawdź rekord A w panelu DNS"
  exit 1
else
  print_ok "Domena wskazuje na: $IP"
fi
echo ""

# 2. Port 443 Connectivity
echo "[2/6] Port 443 Connectivity..."
if timeout 5 bash -c "</dev/tcp/$DOMAIN/443" 2>/dev/null; then
  print_ok "Port 443 otwarty"
else
  print_error "Port 443 zamknięty lub timeout"
  echo "  Sprawdź firewall i czy Traefik nasłuchuje"
  exit 1
fi
echo ""

# 3. SSL Certificate Check
echo "[3/6] SSL Certificate Check..."
CERT_INFO=$(echo | openssl s_client -connect "$DOMAIN:443" -servername "$DOMAIN" 2>/dev/null | openssl x509 -noout -text 2>/dev/null || echo "")
if [ -z "$CERT_INFO" ]; then
  print_error "Nie można pobrać certyfikatu - TLS handshake failed"
  echo ""
  echo "Możliwe przyczyny:"
  echo "  - Traefik nie ma routera dla tej domeny"
  echo "  - Certyfikat się nie wygenerował (sprawdź acme.json)"
  echo "  - Traefik ma problem z Let's Encrypt"
  exit 1
else
  SUBJECT=$(echo "$CERT_INFO" | grep "Subject:" | grep -o "CN = [^,]*" | sed 's/CN = //')
  ISSUER=$(echo "$CERT_INFO" | grep "Issuer:" | grep -o "O = [^,]*" | sed 's/O = //')
  NOT_AFTER=$(echo "$CERT_INFO" | grep "Not After" | sed 's/[^:]*: //')
  
  if [[ "$SUBJECT" == *"$DOMAIN"* ]]; then
    print_ok "Certyfikat dla: $SUBJECT"
  else
    print_warn "Certyfikat dla: $SUBJECT (oczekiwano: *.$DOMAIN)"
  fi
  
  print_ok "Wydany przez: $ISSUER"
  print_ok "Ważny do: $NOT_AFTER"
fi
echo ""

# 4. HTTPS Response
echo "[4/6] HTTPS Response..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "000" ]; then
  print_error "Brak odpowiedzi HTTPS"
elif [ "$HTTP_CODE" = "200" ]; then
  print_ok "HTTP 200 OK"
elif [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
  print_warn "HTTP $HTTP_CODE (redirect)"
else
  print_warn "HTTP $HTTP_CODE"
fi
echo ""

# 5. Server-side checks (jeśli podano serwer)
if [ -n "$SERVER" ]; then
  echo "[5/6] Server-side checks on $SERVER..."
  
  # Sprawdź czy można połączyć się przez SSH
  if ssh -o ConnectTimeout=5 -o StrictHostKeyChecking=no "$SERVER" "echo 'OK'" 2>/dev/null | grep -q "OK"; then
    print_ok "SSH connection works"
    
    # Sprawdź Traefik container
    TRAEFIK_STATUS=$(ssh "$SERVER" "docker ps --filter name=traefik --format '{{.Status}}'" 2>/dev/null || echo "")
    if [ -n "$TRAEFIK_STATUS" ]; then
      print_ok "Traefik running: $TRAEFIK_STATUS"
    else
      print_error "Traefik not running"
    fi
    
    # Sprawdź acme.json
    CERT_COUNT=$(ssh "$SERVER" "docker exec traefik cat /data/acme.json 2>/dev/null | jq '.[].Certificates | length'" 2>/dev/null || echo "0")
    if [ "$CERT_COUNT" -gt 0 ]; then
      print_ok "Certyfikatów w acme.json: $CERT_COUNT"
    else
      print_error "Brak certyfikatów w acme.json"
    fi
    
    # Sprawdź router w Traefik API
    ROUTER=$(ssh "$SERVER" "curl -s http://localhost:8080/api/http/routers 2>/dev/null | jq -r '.[].rule' | grep -i \"$DOMAIN\" || echo ''" 2>/dev/null)
    if [ -n "$ROUTER" ]; then
      print_ok "Router w Traefik: $ROUTER"
    else
      print_error "Brak routera dla $DOMAIN w Traefik"
      echo "  Sprawdź labels w docker-compose.yml"
    fi
    
    # Logi Traefik
    echo ""
    echo "Recent Traefik errors (if any):"
    ssh "$SERVER" "docker logs traefik --tail 20 2>&1 | grep -i 'error\|certificate\|acme' || echo 'No errors found'"
    
  else
    print_error "SSH connection failed to $SERVER"
  fi
else
  echo "[5/6] Server-side checks skipped (provide server as 2nd argument)"
fi
echo ""

# 6. Recommendations
echo "[6/6] Summary & Recommendations"
echo ""

if [ "$HTTP_CODE" = "200" ] && [ -n "$CERT_INFO" ]; then
  echo -e "${GREEN}Wszystko działa poprawnie!${NC}"
  exit 0
else
  echo -e "${YELLOW}Wykryto problemy. Sugerowane kroki:${NC}"
  echo ""
  
  if [ -z "$CERT_INFO" ]; then
    echo "1. Zaloguj się na serwer:"
    echo "   ssh $SERVER"
    echo ""
    echo "2. Sprawdź czy Traefik widzi domenę:"
    echo "   docker logs traefik --tail 50"
    echo ""
    echo "3. Zrestartuj Traefik:"
    echo "   docker restart traefik"
    echo ""
    echo "4. Sprawdź czy router istnieje:"
    echo "   curl -s http://localhost:8080/api/http/routers | jq '.[].rule'"
    echo ""
  fi
  
  if [ "$HTTP_CODE" != "200" ] && [ -n "$CERT_INFO" ]; then
    echo "1. Certyfikat jest OK, ale strona nie odpowiada"
    echo "   Sprawdź czy backend service działa:"
    echo "   docker ps | grep -i docs"
    echo ""
  fi
  
  exit 1
fi
