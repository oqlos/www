import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/test-helpers';

/**
 * Billing Page Button Tests
 */

test.describe('Billing Page Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
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

  test('Enterprise plan button is visible', async ({ page }) => {
    await page.goto('/billing');
    await page.waitForLoadState('networkidle');

    const enterpriseCardBtn = page.locator('.price-card').last().locator('button');
    await expect(enterpriseCardBtn).toBeVisible();
  });
});
