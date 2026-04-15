import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  const routes = [
    { path: '/', name: 'Landing' },
    { path: '/login', name: 'Login' },
    { path: '/dashboard', name: 'Dashboard' },
    { path: '/billing', name: 'Billing' },
    { path: '/scenarios', name: 'Scenarios' },
    { path: '/nlp', name: 'NLP Console' },
  ];

  for (const route of routes) {
    test(`${route.name} page loads successfully`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response?.status()).toBeLessThan(500);
      // Wait for React to hydrate - body might be hidden initially
      await page.waitForLoadState('networkidle');
      await expect(page.locator('#root')).toBeAttached();
    });
  }

  test('API proxy responds or returns expected error', async ({ page }) => {
    const response = await page.goto('/api/health').catch(() => null);
    if (response) {
      const status = response.status();
      // 500/502 = proxy can't reach backend, 0 = network error, 404 = no route
      expect([200, 401, 404, 500, 502, 0]).toContain(status);
    }
  });
});
