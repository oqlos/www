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
      await expect(page.locator('body')).toBeVisible();
    });
  }

  test('API proxy responds or returns expected error', async ({ page }) => {
    const response = await page.goto('/api/health').catch(() => null);
    if (response) {
      expect(response.status()).toBeOneOf([200, 401, 404, 502]);
    }
  });
});
