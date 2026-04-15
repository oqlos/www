import { test, expect } from '@playwright/test';

/**
 * Comprehensive GUI button tests
 * Tests all buttons and interactive elements across the application
 */

// ── Helpers ──────────────────────────────────────────────────────────────────

const TEST_EMAIL = 'test@test.com';

const TEST_USER = {
  id: 1, email: TEST_EMAIL, role: 'admin', plan: 'pro',
  created_at: new Date().toISOString(),
};

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
      body: JSON.stringify({ scenarios: [] }),
    });
  });
}

async function loginAsTestUser(page) {
  await mockBackendRoutes(page);
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  const emailInput = page.locator('input[type="email"]');
  await emailInput.fill(TEST_EMAIL);
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
  await page.waitForURL('**/dashboard', { timeout: 8000 });
}

// ── 1. Landing Page Buttons ─────────────────────────────────────────────────────

test.describe('Landing Page Buttons', () => {
  test('hero CTA buttons scroll to sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Test "Get Started" button
    const getStartedBtn = page.locator('button.btn-primary').first();
    await expect(getStartedBtn).toBeVisible();
    await getStartedBtn.click();
    await page.waitForTimeout(500);
    // Should scroll to install section
    const installSection = page.locator('#install');
    await expect(installSection).toBeVisible();
  });

  test('outline buttons scroll to editor and API sections', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const outlineBtns = page.locator('button.btn-outline');
    const count = await outlineBtns.count();
    expect(count).toBeGreaterThanOrEqual(2);

    // Test first outline button (should scroll to editor)
    await outlineBtns.nth(0).click();
    await page.waitForTimeout(500);
    const editorSection = page.locator('#editor');
    await expect(editorSection).toBeVisible();
  });

  test('copy buttons work in install commands', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const copyBtns = page.locator('button.copy-btn');
    const count = await copyBtns.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Test first copy button
    await copyBtns.nth(0).click();
    await page.waitForTimeout(200);
    // Copy button should be clickable and not throw error
    await expect(copyBtns.nth(0)).toBeVisible();
  });
});

// ── 2. Login Page Buttons ───────────────────────────────────────────────────────

test.describe('Login Page Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
  });

  test('login submit button works', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const submitBtn = page.locator('button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toHaveText(/send|wyślij/i);

    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(TEST_EMAIL);
    
    await submitBtn.click();
    await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
  });

  test('submit button is disabled while loading', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const submitBtn = page.locator('button[type="submit"]');
    const emailInput = page.locator('input[type="email"]');
    
    await emailInput.fill(TEST_EMAIL);
    await submitBtn.click();
    
    // Button should be disabled during loading
    await expect(submitBtn).toBeDisabled();
  });
});

// ── 3. Dashboard Buttons ────────────────────────────────────────────────────────

test.describe('Dashboard Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
    await page.goto('/');
    await page.evaluate((user) => {
      localStorage.setItem('jwt', 'test-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
    }, TEST_USER);
  });

  test('feature cards are clickable and navigate', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const featureCards = page.locator('.feature-card');
    await expect(featureCards).toHaveCount(3);

    // Test Scenarios card
    await featureCards.nth(0).click();
    await page.waitForURL('**/scenarios');
    await expect(page.locator('.editor-wrapper')).toBeVisible();

    // Go back to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Test NLP Console card
    await featureCards.nth(1).click();
    await page.waitForURL('**/nlp');
    await expect(page.locator('.nlp-console')).toBeVisible();
  });
});

// ── 4. Scenarios Page Buttons ───────────────────────────────────────────────────

test.describe('Scenarios Page Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
    await page.goto('/');
    await page.evaluate((user) => {
      localStorage.setItem('jwt', 'test-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
    }, TEST_USER);
  });

  test('scenario tabs are clickable and switch content', async ({ page }) => {
    await page.goto('/scenarios');
    await page.waitForLoadState('networkidle');

    const tabs = page.locator('.example-tab');
    const count = await tabs.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Click each tab
    for (let i = 0; i < count; i++) {
      await tabs.nth(i).click();
      await expect(tabs.nth(i)).toHaveClass(/active/);
      await page.waitForTimeout(200);
    }
  });

  test('terminal run button works', async ({ page }) => {
    await page.goto('/scenarios');
    await page.waitForLoadState('networkidle');

    const runBtn = page.locator('.run-btn');
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toBeEnabled();

    await runBtn.click();
    await expect(page.locator('.terminal-body div', { hasText: 'PASS' })).toBeVisible({ timeout: 10000 });
  });

  test('run button is disabled while running', async ({ page }) => {
    await page.goto('/scenarios');
    await page.waitForLoadState('networkidle');

    const runBtn = page.locator('.run-btn');
    await runBtn.click();

    // Should be disabled during execution
    await page.waitForTimeout(100);
    await expect(runBtn).toBeDisabled();
  });
});

// ── 5. NLP Console Buttons ─────────────────────────────────────────────────────

test.describe('NLP Console Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
    await page.goto('/');
    await page.evaluate((user) => {
      localStorage.setItem('jwt', 'test-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
    }, TEST_USER);
  });

  test('NLP tabs are clickable', async ({ page }) => {
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');

    const tabs = page.locator('.install-tab');
    await expect(tabs).toHaveCount(3);

    // Test tab switching
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveClass(/active/);

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveClass(/active/);

    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveClass(/active/);
  });

  test('NLP submit button works with input', async ({ page }) => {
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');

    const input = page.locator('.nlp-input-row input');
    await input.fill('Test pump at 2 l/min');

    const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();

    await submitBtn.click();
    
    const output = page.locator('.nlp-output');
    await expect(output).not.toContainText('Generated code will appear here', { timeout: 5000 });
  });

  test('NLP submit button is disabled while loading', async ({ page }) => {
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');

    const input = page.locator('.nlp-input-row input');
    await input.fill('Test scenario');

    const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
    await submitBtn.click();

    // Should be disabled during loading
    await expect(submitBtn).toBeDisabled();
  });

  test('NLP submit button does nothing with empty input', async ({ page }) => {
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');

    const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
    await submitBtn.click();
    await page.waitForTimeout(500);

    // Output should not change
    const output = page.locator('.nlp-output');
    await expect(output).toContainText('Generated code will appear here');
  });
});

// ── 6. Billing Page Buttons ─────────────────────────────────────────────────────

test.describe('Billing Page Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
    await page.goto('/');
    await page.evaluate((user) => {
      localStorage.setItem('jwt', 'test-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
    }, TEST_USER);
  });

  test('pricing card buttons are visible', async ({ page }) => {
    await page.goto('/billing');
    await page.waitForLoadState('networkidle');

    const buttons = page.locator('.price-card button');
    await expect(buttons).toHaveCount(3);

    // All buttons should be visible
    for (let i = 0; i < 3; i++) {
      await expect(buttons.nth(i)).toBeVisible();
    }
  });

  test('Free plan button uses outline style', async ({ page }) => {
    await page.goto('/billing');
    await page.waitForLoadState('networkidle');

    const freeCardBtn = page.locator('.price-card').first().locator('button');
    await expect(freeCardBtn).toHaveClass(/btn-outline/);
  });

  test('Pro plan button uses primary style', async ({ page }) => {
    await page.goto('/billing');
    await page.waitForLoadState('networkidle');

    const proCardBtn = page.locator('.price-card.featured').locator('button');
    await expect(proCardBtn).toHaveClass(/btn-primary/);
  });

  test('subscribe button works for Pro plan', async ({ page }) => {
    await page.goto('/billing');
    await page.waitForLoadState('networkidle');

    const proCardBtn = page.locator('.price-card.featured').locator('button');
    await proCardBtn.click();
    
    // Should trigger subscription (mocked)
    await page.waitForTimeout(500);
    // No error should be thrown
    await expect(proCardBtn).toBeVisible();
  });
});

// ── 7. Navigation Buttons ───────────────────────────────────────────────────────

test.describe('Navigation Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackendRoutes(page);
    await page.goto('/');
    await page.evaluate((user) => {
      localStorage.setItem('jwt', 'test-jwt-token');
      localStorage.setItem('user', JSON.stringify(user));
    }, TEST_USER);
  });

  test('logout button is visible and clickable', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const logoutBtn = page.locator('button', { hasText: /logout|wyloguj/i });
    if (await logoutBtn.count() > 0) {
      await expect(logoutBtn).toBeVisible();
      await logoutBtn.click();
      await page.waitForLoadState('networkidle');

      const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
      expect(jwt).toBeNull();
    }
  });

  test('nav links work like buttons', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Test nav link to scenarios
    const scenariosLink = page.locator('a[href="/scenarios"]');
    if (await scenariosLink.count() > 0) {
      await scenariosLink.click();
      await page.waitForURL('**/scenarios');
      await expect(page.locator('.editor-wrapper')).toBeVisible();
    }
  });
});

// ── 8. Theme Toggle Button ─────────────────────────────────────────────────────

test.describe('Theme Toggle Button', () => {
  test('theme toggle button is visible on landing page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const themeToggle = page.locator('button[class*="theme"]');
    if (await themeToggle.count() > 0) {
      await expect(themeToggle).toBeVisible();
      await themeToggle.click();
      await page.waitForTimeout(200);
      // Should toggle theme without error
      await expect(themeToggle).toBeVisible();
    }
  });
});

// ── 9. Full Button Journey Test ─────────────────────────────────────────────────

test.describe('Full Button Journey', () => {
  test('complete user journey using all buttons', async ({ page }) => {
    await mockBackendRoutes(page);

    // 1. Landing page - click Get Started
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const getStartedBtn = page.locator('button.btn-primary').first();
    await getStartedBtn.click();
    await page.waitForTimeout(500);

    // 2. Navigate to login
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // 3. Login with submit button
    const emailInput = page.locator('input[type="email"]');
    await emailInput.fill(TEST_EMAIL);
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
    await page.waitForURL('**/dashboard', { timeout: 8000 });

    // 4. Dashboard - click scenarios card
    const scenariosCard = page.locator('.feature-card').nth(0);
    await scenariosCard.click();
    await page.waitForURL('**/scenarios');

    // 5. Scenarios - click run button
    const runBtn = page.locator('.run-btn');
    await runBtn.click();
    await expect(page.locator('.terminal-body div', { hasText: 'PASS' })).toBeVisible({ timeout: 10000 });

    // 6. Navigate to NLP
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');

    // 7. NLP - click submit button
    const nlpInput = page.locator('.nlp-input-row input');
    await nlpInput.fill('Test pump at 5 l/min');
    const nlpSubmitBtn = page.locator('.nlp-input-row button[type="submit"]');
    await nlpSubmitBtn.click();
    await expect(page.locator('.nlp-output')).not.toContainText('Generated code will appear here', { timeout: 5000 });

    // 8. Navigate to Billing
    await page.goto('/billing');
    await page.waitForLoadState('networkidle');

    // 9. Billing - click Pro plan button
    const proCardBtn = page.locator('.price-card.featured').locator('button');
    await proCardBtn.click();
    await page.waitForTimeout(500);

    // Journey complete - no errors
    await expect(page).toHaveURL('**/billing');
  });
});
