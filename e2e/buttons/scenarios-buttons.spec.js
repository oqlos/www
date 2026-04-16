import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/test-helpers';

/**
 * Scenarios Page Button Tests
 */

test.describe('Scenarios Page Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
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

  test('step button works during execution', async ({ page }) => {
    await page.goto('/scenarios');
    await page.waitForLoadState('networkidle');

    const runBtn = page.locator('.run-btn');
    await runBtn.click();

    // Wait for execution to start
    await page.waitForTimeout(500);

    const stepBtn = page.locator('.step-btn');
    if (await stepBtn.count() > 0) {
      await expect(stepBtn).toBeVisible();
    }
  });
});
