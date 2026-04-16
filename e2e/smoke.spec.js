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
});
