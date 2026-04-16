import { test, expect } from '@playwright/test';
import { setupAuth } from '../helpers/test-helpers';

/**
 * NLP Console Button Tests
 */

test.describe('NLP Console Buttons', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
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

  test('NLP submit button handles request with input', async ({ page }) => {
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');

    const input = page.locator('.nlp-input-row input');
    await input.fill('Test scenario');

    const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
    await submitBtn.click();
    
    // Should process the request
    await page.waitForTimeout(500);
    await expect(submitBtn).toBeVisible();
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

  test('NLP submit button shows loading state', async ({ page }) => {
    await page.goto('/nlp');
    await page.waitForLoadState('networkidle');

    const input = page.locator('.nlp-input-row input');
    await input.fill('Test pump at 5 l/min');

    const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
    await submitBtn.click();

    // Button should show loading state
    await expect(submitBtn).toContainText(/generating|generowanie/i);
  });
});
