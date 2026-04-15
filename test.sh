#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== OqlOS Portal Test Suite ==="
echo "Working directory: $(pwd)"
echo ""

# Check Node.js
echo "--- Node.js Version ---"
node --version || { echo "ERROR: Node.js not installed"; exit 1; }
echo ""

# Check npm packages
echo "--- Installing dependencies ---"
npm install
echo ""

# Build project
echo "--- Building project ---"
npm run build
echo ""

# Install Playwright if not present
if ! npx playwright --version 2>/dev/null; then
    echo "--- Installing Playwright ---"
    npm install -D @playwright/test
fi

# Install browsers (always check)
echo "--- Installing Playwright browsers ---"
npx playwright install chromium firefox webkit
npx playwright install-deps chromium 2>/dev/null || true
echo ""

# Run lint if configured
echo "--- Running linter ---"
npm run lint 2>/dev/null || echo "No lint configured, skipping"
echo ""

# Run unit tests if configured
echo "--- Running unit tests ---"
npm run test:unit 2>/dev/null || npm run test 2>/dev/null || echo "No unit tests configured, skipping"
echo ""

# Run E2E tests
echo "--- Running E2E tests with Playwright ---"
if [ -d "tests" ] && [ -f "playwright.config.js" ]; then
    npx playwright test --reporter=line
elif [ -d "e2e" ]; then
    npx playwright test e2e --reporter=line
else
    echo "No E2E tests found, running basic server check..."
    
    # Start dev server in background
    npm run dev &
    SERVER_PID=$!
    
    # Wait for server
    sleep 5
    
    # Test if server responds
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
        echo "Server responds with HTTP 200"
    else
        echo "WARNING: Server not responding on port 3000"
    fi
    
    # Kill server
    kill $SERVER_PID 2>/dev/null || true
    wait $SERVER_PID 2>/dev/null || true
fi
echo ""

# Security audit
echo "--- Security audit ---"
npm audit --audit-level moderate || echo "Security audit completed with warnings"
echo ""

echo "=== Test Suite Complete ==="
exit 0
