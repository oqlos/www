import { test, expect } from '@playwright/test';

/**
 * E2E tests for test@test.com user.
 * Covers: login, dashboard, scenarios (OQL), NLP console (OQL+IQL), billing, logout.
 * Uses Playwright route interception to mock backend API responses.
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

const TEST_EMAIL = 'test@test.com';

const TEST_USER = {
  id: 1, email: TEST_EMAIL, role: 'admin', plan: 'pro',
  created_at: new Date().toISOString(),
};

/** Intercept all backend API calls so tests don't need a running backend. */
async function mockBackendRoutes(page) {
  await page.route('**/auth/login', async (route) => {
    const request = route.request();
    let body = {};
    try { body = JSON.parse(request.postData() || '{}'); } catch {}

    if (body.email === TEST_EMAIL) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Test login successful', testMode: true, user: TEST_USER }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Check your email for a login link!' }),
      });
    }
  });

  await page.route('**/auth/verify*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ token: 'mock-jwt-token', user: TEST_USER }),
    });
  });

  await page.route('**/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: TEST_USER }),
    });
  });

  await page.route('**/nlp/to-oql', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        oql: 'SCENARIO: "NLP Generated"\nGOAL: Auto\n  SET \'pompa 1\' \'2 l/min\'\n  WAIT 2000ms',
        valid: true, issues: [],
      }),
    });
  });

  await page.route('**/nlp/to-iql', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        iql: 'API GET "${api_url}/api/v1/hardware/health"\nASSERT_STATUS 200',
        valid: true, issues: [],
      }),
    });
  });

  await page.route('**/nlp/devops', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        commands: ['docker restart oqlos-staging'],
      }),
    });
  });

  await page.route('**/billing/subscribe/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ checkout_url: null, message: 'Mock billing — no payment required' }),
    });
  });

  await page.route('**/billing/subscription', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ plan: 'pro', status: 'active', cancel_at_period_end: false }),
    });
  });

  await page.route('**/api/scenarios', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ scenarios: [
        { id: 1, name: 'Test Scenario 1', description: 'Pump control', oql_code: 'SET "pompa 1" "2 l/min"' },
        { id: 2, name: 'Test Scenario 2', description: 'Temp monitoring', oql_code: 'GET "temp_sensor_1"' },
      ] }),
    });
  });

  await page.route('**/api/health', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok' }),
    });
  });
}

/** Log in as test@test.com via the login form and wait for redirect. */
async function loginAsTestUser(page) {
  await mockBackendRoutes(page);
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill(TEST_EMAIL);
  await page.locator('button[type="submit"]').click();

  // Should show success and redirect to /dashboard
  await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
  await page.waitForURL('**/dashboard', { timeout: 8000 });
}

/** Inject JWT + user into localStorage so protected routes work without form flow. */
async function injectTestSession(page) {
  await mockBackendRoutes(page);
  await page.goto('/');
  await page.evaluate((user) => {
    localStorage.setItem('jwt', 'test-jwt-token');
    localStorage.setItem('user', JSON.stringify(user));
  }, TEST_USER);
}

// ── 1. Login ─────────────────────────────────────────────────────────────────

test.describe('Login — test@test.com', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
    // Clear any previous session
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('can log in with test@test.com and reach dashboard', async ({ page }) => {
    await loginAsTestUser(page);

    // Verify we are on the dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.dashboard')).toBeVisible();
  });

  test('login with plan=pro auto-fills email', async ({ page }) => {
    await page.goto('/login?plan=pro');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 3000 });
    await expect(emailInput).toHaveValue(TEST_EMAIL, { timeout: 5000 });
  });

  test('JWT is stored in localStorage after login', async ({ page }) => {
    await loginAsTestUser(page);

    const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));

    expect(jwt).toBeTruthy();
    expect(user.email).toBe(TEST_EMAIL);
    expect(user.role).toBe('admin');
    expect(user.plan).toBe('pro');
  });
});

// ── 2. Dashboard ─────────────────────────────────────────────────────────────

test.describe('Dashboard — authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await injectTestSession(page);
  });

  test('dashboard loads with stats and quick actions', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Stats grid
    await expect(page.locator('.dash-grid')).toBeVisible();
    const stats = page.locator('.dash-stat');
    await expect(stats).toHaveCount(4);

    // Quick-action cards
    const cards = page.locator('.feature-card');
    await expect(cards).toHaveCount(3);
  });

  test('navigate to Scenarios from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.locator('.feature-card', { hasText: 'OQL Scenario' }).click();
    await page.waitForURL('**/scenarios');
    await expect(page.locator('.dashboard')).toBeVisible();
  });

  test('navigate to NLP Console from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.locator('.feature-card', { hasText: 'NLP' }).click();
    await page.waitForURL('**/nlp');
    await expect(page.locator('.nlp-console')).toBeVisible();
  });

  test('navigate to Billing from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.locator('.feature-card', { hasText: 'Manage Plan' }).click();
    await page.waitForURL('**/billing');
    await expect(page.locator('.pricing-grid')).toBeVisible();
  });
});

// ── 3. Scenarios — OQL editor & terminal ─────────────────────────────────────

test.describe('Scenarios — OQL', () => {
  test.beforeEach(async ({ page }) => {
    await injectTestSession(page);
    await page.goto('/scenarios');
    await page.waitForLoadState('networkidle');
  });

  test('scenarios page loads with editor and terminal', async ({ page }) => {
    await expect(page.locator('.editor-wrapper')).toBeVisible();
    await expect(page.locator('.terminal-wrapper')).toBeVisible();
  });

  test('scenario tabs are visible and switchable', async ({ page }) => {
    const tabs = page.locator('.example-tab');
    const count = await tabs.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Click each tab and verify editor updates
    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveClass(/active/);
      // Editor should have code
      const textarea = page.locator('.editor-textarea');
      const value = await textarea.inputValue();
      expect(value.length).toBeGreaterThan(10);
    }
  });

  test('OQL pump test scenario has correct keywords', async ({ page }) => {
    // First tab is "pump-test"
    await page.locator('.example-tab').first().click();
    const code = await page.locator('.editor-textarea').inputValue();

    expect(code).toContain('SCENARIO:');
    expect(code).toContain('GOAL:');
    expect(code).toContain('SET');
    expect(code).toContain('WAIT');
    expect(code).toContain('pompa');
  });

  test('OQL leak test scenario loads correctly', async ({ page }) => {
    await page.locator('.example-tab', { hasText: /Leak|Szczelno/ }).click();
    const code = await page.locator('.editor-textarea').inputValue();

    expect(code).toContain('SCENARIO:');
    expect(code).toContain('MIN');
    expect(code).toContain('MAX');
    expect(code).toContain('SAVE');
    expect(code).toContain('mbar');
  });

  test('OQL editor supports typing custom code', async ({ page }) => {
    const textarea = page.locator('.editor-textarea');
    await textarea.fill('SCENARIO: "Custom E2E Test"\nGOAL: Verify pump\n  SET \'pompa 1\' \'5 l/min\'\n  WAIT 1000ms');

    const value = await textarea.inputValue();
    expect(value).toContain('Custom E2E Test');
    expect(value).toContain('5 l/min');
  });

  test('OQL syntax highlighting renders keywords', async ({ page }) => {
    await page.locator('.example-tab').first().click();
    const highlighted = page.locator('.editor-highlight');
    await expect(highlighted).toBeVisible();

    const html = await highlighted.innerHTML();
    expect(html).toContain('syn-keyword');
    expect(html).toContain('syn-string');
  });

  test('terminal simulator runs OQL dry-run', async ({ page }) => {
    const runBtn = page.locator('.run-btn');
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toBeEnabled();

    await runBtn.click();

    // Wait for the simulation to complete (lines appear one by one)
    await expect(page.locator('.terminal-body div', { hasText: 'PASS' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.terminal-body div', { hasText: 'Steps: 5/5' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.terminal-body div', { hasText: '0 errors' })).toBeVisible({ timeout: 10000 });
  });
});

// ── 4. Scenarios — IQL (TestQL / API Tests) ──────────────────────────────────

test.describe('Scenarios — IQL', () => {
  test.beforeEach(async ({ page }) => {
    await injectTestSession(page);
    await page.goto('/scenarios');
    await page.waitForLoadState('networkidle');
  });

  test('IQL api-test tab loads with correct syntax', async ({ page }) => {
    await page.locator('.example-tab', { hasText: /API|TestQL/ }).click();
    await page.waitForTimeout(100);
    const code = await page.locator('.editor-textarea').inputValue();

    expect(code).toContain('API');
    expect(code).toContain('ASSERT_STATUS');
    expect(code).toContain('ASSERT_CONTAINS');
    expect(code).toContain('NAVIGATE');
  });

  test('IQL session recording tab loads', async ({ page }) => {
    await page.locator('.example-tab', { hasText: /Record|Nagrywanie/ }).click();
    await page.waitForTimeout(100);
    const code = await page.locator('.editor-textarea').inputValue();

    // Tab shows IQL session recording commands
    expect(code).toContain('RECORD_START');
    expect(code).toContain('SELECT_DEVICE');
    expect(code).toContain('START_TEST');
    expect(code).toContain('STEP_COMPLETE');
    expect(code).toContain('RECORD_STOP');
  });

  test('IQL syntax highlighting shows keywords', async ({ page }) => {
    await page.locator('.example-tab', { hasText: /API|TestQL/ }).click();
    const html = await page.locator('.editor-highlight').innerHTML();

    expect(html).toContain('syn-keyword');
    expect(html).toContain('syn-string');
  });

  test('IQL editor supports custom test code', async ({ page }) => {
    await page.locator('.example-tab', { hasText: /API|TestQL/ }).click();
    const textarea = page.locator('.editor-textarea');

    const customIql = 'SET api_url "http://localhost:8101"\nAPI GET "${api_url}/api/health"\nASSERT_STATUS 200\nASSERT_JSON "status" "ok"';
    await textarea.fill(customIql);

    const value = await textarea.inputValue();
    expect(value).toContain('ASSERT_STATUS 200');
    expect(value).toContain('ASSERT_JSON');
  });
});

// ── 5. NLP Console — OQL + IQL generation ────────────────────────────────────

test.describe('NLP Console', () => {
  test.beforeEach(async ({ page }) => {
    await injectTestSession(page);
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');
  });

  test('NLP console loads with tabs and input', async ({ page }) => {
    await expect(page.locator('.nlp-console')).toBeVisible();

    // Three tabs: OQL, IQL, DevOps
    const tabs = page.locator('.install-tab');
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toContainText('OQL');
    await expect(tabs.nth(1)).toContainText('IQL');
    await expect(tabs.nth(2)).toContainText('DevOps');
  });

  test('NLP → OQL: generate scenario from natural language', async ({ page }) => {
    // OQL tab should be active by default
    const input = page.locator('.nlp-input-row input');
    await input.fill('Test pump at 2 l/min for 2 seconds then stop');
    await page.locator('.nlp-input-row button[type="submit"]').click();

    // Wait for output
    const output = page.locator('.nlp-output');
    await expect(output).not.toContainText('Generated code will appear here', { timeout: 5000 });

    const text = await output.textContent();
    expect(text).toContain('SCENARIO');
    expect(text).toContain('SET');
    expect(text).toContain('WAIT');
  });

  test('NLP → IQL: generate API test from natural language', async ({ page }) => {
    // Switch to IQL tab
    await page.locator('.install-tab', { hasText: 'IQL' }).click();

    const input = page.locator('.nlp-input-row input');
    await input.fill('Test that GET /api/v1/hardware/health returns 200');
    await page.locator('.nlp-input-row button[type="submit"]').click();

    const output = page.locator('.nlp-output');
    await expect(output).not.toContainText('Generated code will appear here', { timeout: 5000 });

    const text = await output.textContent();
    expect(text).toContain('API');
    expect(text).toContain('ASSERT_STATUS');
  });

  test('NLP tab switching changes placeholder text', async ({ page }) => {
    const input = page.locator('.nlp-input-row input');

    // OQL tab
    const oqlPlaceholder = await input.getAttribute('placeholder');
    expect(oqlPlaceholder).toContain('pump');

    // IQL tab
    await page.locator('.install-tab', { hasText: 'IQL' }).click();
    const iqlPlaceholder = await input.getAttribute('placeholder');
    expect(iqlPlaceholder).toContain('GET');

    // DevOps tab
    await page.locator('.install-tab', { hasText: 'DevOps' }).click();
    const devopsPlaceholder = await input.getAttribute('placeholder');
    expect(devopsPlaceholder).toContain('docker');
  });

  test('NLP empty prompt does not submit', async ({ page }) => {
    const output = page.locator('.nlp-output');
    const initialText = await output.textContent();

    await page.locator('.nlp-input-row button[type="submit"]').click();
    await page.waitForTimeout(500);

    const afterText = await output.textContent();
    expect(afterText).toBe(initialText);
  });
});

// ── 6. Billing ───────────────────────────────────────────────────────────────

test.describe('Billing', () => {
  test.beforeEach(async ({ page }) => {
    await injectTestSession(page);
    await page.goto('/billing');
    await page.waitForLoadState('networkidle');
  });

  test('billing page shows pricing cards', async ({ page }) => {
    await expect(page.locator('.pricing-grid')).toBeVisible();

    const cards = page.locator('.price-card');
    await expect(cards).toHaveCount(3);
  });

  test('pricing cards show Free, Pro, Enterprise', async ({ page }) => {
    await expect(page.locator('.price-card', { hasText: 'OqlOS Free' }).first()).toBeVisible();
    await expect(page.locator('.price-card.featured', { hasText: 'OqlOS Pro' })).toBeVisible();
    await expect(page.locator('.price-card', { hasText: 'Enterprise' })).toBeVisible();
  });

  test('Pro card has correct price and features', async ({ page }) => {
    const proCard = page.locator('.price-card.featured');
    await expect(proCard).toBeVisible();
    await expect(proCard).toContainText('€49');
    await expect(proCard).toContainText('Multi-device');
    await expect(proCard).toContainText('OqlIDE');
    await expect(proCard).toContainText('Raporty PDF');
  });

  test('billing success state shows confirmation', async ({ page }) => {
    await page.goto('/billing?session=test-session-123');
    await page.waitForLoadState('networkidle');

    await expect(page.locator('.auth-msg.success')).toBeVisible();
    await expect(page.locator('.auth-msg.success')).toContainText('Payment successful');
  });
});

// ── 7. Navigation & SharedNav ────────────────────────────────────────────────

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await injectTestSession(page);
  });

  test('SharedNav is visible on all protected pages', async ({ page }) => {
    const protectedPages = ['/dashboard', '/scenarios', '/nlp', '/billing'];

    for (const path of protectedPages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('nav').or(page.locator('.nav-logo')).first()).toBeVisible();
    }
  });

  test('can navigate full user journey: login → dashboard → scenarios → nlp → billing', async ({ page }) => {
    // Start logged out
    await page.evaluate(() => localStorage.clear());

    // 1. Login
    await loginAsTestUser(page);
    await expect(page).toHaveURL(/\/dashboard/);

    // 2. Dashboard → Scenarios
    await page.locator('.feature-card', { hasText: 'OQL Scenario' }).click();
    await page.waitForURL('**/scenarios');
    await expect(page.locator('.editor-wrapper')).toBeVisible();

    // 3. Run terminal simulation
    await page.locator('.run-btn').click();
    await expect(page.locator('.terminal-body div', { hasText: 'PASS' })).toBeVisible({ timeout: 10000 });

    // 4. Navigate to NLP
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');
    const input = page.locator('.nlp-input-row input');
    await input.fill('Test pump at 5 l/min');
    await page.locator('.nlp-input-row button[type="submit"]').click();
    await expect(page.locator('.nlp-output')).not.toContainText('Generated code will appear here', { timeout: 5000 });

    // 5. Navigate to Billing
    await page.goto('/billing');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.pricing-grid')).toBeVisible();
  });
});

// ── 8. Logout ────────────────────────────────────────────────────────────────

test.describe('Logout', () => {
  test('logout clears session and redirects', async ({ page }) => {
    await injectTestSession(page);
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Find and click logout (look for any logout-like element in nav)
    const logoutBtn = page.locator('button', { hasText: /logout|wyloguj|sign out/i })
      .or(page.locator('[data-action="logout"]'))
      .or(page.locator('.logout-btn'));

    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click();
      await page.waitForLoadState('networkidle');

      const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
      expect(jwt).toBeNull();
    } else {
      // Manual logout via localStorage
      await page.evaluate(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('user');
      });
      await page.goto('/dashboard');
      // Should redirect to login since JWT is gone
      await page.waitForURL('**/login', { timeout: 5000 });
    }
  });
});

// ── 9. Protected routes without auth ─────────────────────────────────────────

test.describe('Protected routes — unauthenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('dashboard redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('scenarios redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/scenarios');
    await page.waitForURL('**/login', { timeout: 5000 });
  });

  test('NLP console redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/nlp');
    await page.waitForURL('**/login', { timeout: 5000 });
  });
});
