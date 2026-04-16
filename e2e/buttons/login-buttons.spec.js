import { test, expect } from '@playwright/test';
import { mockBackendRoutes, TEST_EMAIL } from '../helpers/test-helpers';

/**
 * Login Page Button Tests
 */

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

  test('back to home button works', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    const backBtn = page.locator('a', { hasText: /back|powrót/i });
    if (await backBtn.count() > 0) {
      await backBtn.click();
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    }
  });
});
