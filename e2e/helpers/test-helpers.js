/**
 * Shared test helpers for E2E tests
 */

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

async function setupAuth(page, user = TEST_USER) {
  await mockBackendRoutes(page);
  await page.goto('/');
  await page.evaluate((u) => {
    localStorage.setItem('jwt', 'test-jwt-token');
    localStorage.setItem('user', JSON.stringify(u));
  }, user);
}

export {
  TEST_EMAIL,
  TEST_USER,
  mockBackendRoutes,
  loginAsTestUser,
  setupAuth,
};
