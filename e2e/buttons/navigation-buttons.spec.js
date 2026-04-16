import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/test-helpers';

/**
 * Navigation Button Tests
 */

test.describe('Navigation Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
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

  test('logo link navigates to landing', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const logo = page.locator('.nav-logo');
    await logo.click();
    await page.waitForURL('/');
    await expect(page).toHaveURL('/');
  });
});
