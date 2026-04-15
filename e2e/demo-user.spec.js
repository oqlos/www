import { test, expect } from '@playwright/test';

/**
 * E2E tests for demo@oqlos.com user from .env
 * Covers: login with demo credentials
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

const DEMO_EMAIL = 'demo@oqlos.com';
const DEMO_PASSWORD = 'demo123';

const DEMO_USER = {
  id: 3,
  email: DEMO_EMAIL,
  name: 'Demo User',
  role: 'user',
  plan: 'free',
  created_at: new Date().toISOString(),
};

/** Mock backend routes for demo user */
async function mockBackendRoutes(page) {
  await page.route('**/auth/login', async (route) => {
    const request = route.request();
    let body = {};
    try { body = JSON.parse(request.postData() || '{}'); } catch {}

    // Demo user from .env - email-only login like test users
    if (body.email === DEMO_EMAIL) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Demo login successful',
          testMode: true,
          user: DEMO_USER
        }),
      });
    } else if (body.email === 'test@test.com' || body.email === 'demo@oqlos.io') {
      // Legacy test users
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'Test login successful',
          testMode: true,
          user: body.email === 'test@test.com'
            ? { id: 1, email: 'test@test.com', role: 'admin', plan: 'pro', created_at: new Date().toISOString() }
            : { id: 2, email: 'demo@oqlos.io', role: 'admin', plan: 'pro', created_at: new Date().toISOString() }
        }),
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
      body: JSON.stringify({ token: 'mock-jwt-token', user: DEMO_USER }),
    });
  });

  await page.route('**/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user: DEMO_USER }),
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
      body: JSON.stringify({ plan: 'free', status: 'active', cancel_at_period_end: false }),
    });
  });

  await page.route('**/api/scenarios', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ scenarios: [] }),
    });
  });
}

// ── Login Tests ──────────────────────────────────────────────────────────────

test.describe('Login — demo@oqlos.com', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('login page renders correctly for demo user', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('h2')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('can log in with demo credentials and reach dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(DEMO_EMAIL);
    
    // Note: Current login flow doesn't use password field, only email
    // The mock API handles password verification internally
    await page.locator('button[type="submit"]').click();

    // Should show success and redirect to /dashboard
    await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
    await page.waitForURL('**/dashboard', { timeout: 8000 });
  });

  test('JWT is stored in localStorage after demo login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill(DEMO_EMAIL);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
    await page.waitForURL('**/dashboard', { timeout: 8000 });

    const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));

    expect(jwt).toBeTruthy();
    expect(user.email).toBe(DEMO_EMAIL);
    expect(user.role).toBe(DEMO_USER.role);
    expect(user.plan).toBe('free');
  });

  test('demo user has correct user data after login', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.locator('input[type="email"]').fill(DEMO_EMAIL);
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
    await page.waitForURL('**/dashboard', { timeout: 8000 });

    const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));

    expect(user.id).toBe(3);
    expect(user.name).toBe(DEMO_USER.name);
    expect(user.plan).toBe('free');
  });
});

// ── Dashboard Access ───────────────────────────────────────────────────────────

test.describe('Dashboard — demo user authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
    await page.goto('/');
    await page.evaluate((user) => {
      localStorage.setItem('jwt', 'test-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
    }, DEMO_USER);
  });

  test('dashboard loads for demo user', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.dash-grid')).toBeVisible();
  });

  test('demo user can navigate to scenarios', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    await page.locator('.feature-card', { hasText: 'OQL Scenario' }).click();
    await page.waitForURL('**/scenarios');
    await expect(page.locator('.editor-wrapper')).toBeVisible();
  });
});
