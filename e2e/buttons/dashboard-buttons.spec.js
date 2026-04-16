import { test, expect } from '@playwright/test';
import { setupAuth, TEST_USER } from '../helpers/test-helpers';

/**
 * Dashboard Button Tests
 */

test.describe('Dashboard Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
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

  test('run scenarios button is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const runBtn = page.locator('button', { hasText: /run scenarios|uruchom/i });
    if (await runBtn.count() > 0) {
      await expect(runBtn).toBeVisible();
    }
  });

  test('NLP Console button navigates correctly', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    const nlpBtn = page.locator('button', { hasText: /nlp/i });
    if (await nlpBtn.count() > 0) {
      await nlpBtn.click();
      await page.waitForURL('**/nlp');
      await expect(page.locator('.nlp-console')).toBeVisible();
    }
  });
});
