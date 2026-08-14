# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buttons/nlp-buttons.spec.js >> NLP Console Buttons >> NLP submit button works with input
- Location: e2e/buttons/nlp-buttons.spec.js:31:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.nlp-input-row input')

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { setupAuth } from '../helpers/test-helpers';
  3  | 
  4  | /**
  5  |  * NLP Console Button Tests
  6  |  */
  7  | 
  8  | test.describe('NLP Console Buttons', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await setupAuth(page);
  11 |   });
  12 | 
  13 |   test('NLP tabs are clickable', async ({ page }) => {
  14 |     await page.goto('/nlp');
  15 |     await page.waitForLoadState('networkidle');
  16 | 
  17 |     const tabs = page.locator('.install-tab');
  18 |     await expect(tabs).toHaveCount(3);
  19 | 
  20 |     // Test tab switching
  21 |     await tabs.nth(0).click();
  22 |     await expect(tabs.nth(0)).toHaveClass(/active/);
  23 | 
  24 |     await tabs.nth(1).click();
  25 |     await expect(tabs.nth(1)).toHaveClass(/active/);
  26 | 
  27 |     await tabs.nth(2).click();
  28 |     await expect(tabs.nth(2)).toHaveClass(/active/);
  29 |   });
  30 | 
  31 |   test('NLP submit button works with input', async ({ page }) => {
  32 |     await page.goto('/nlp');
  33 |     await page.waitForLoadState('networkidle');
  34 | 
  35 |     const input = page.locator('.nlp-input-row input');
> 36 |     await input.fill('Test pump at 2 l/min');
     |                 ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  37 | 
  38 |     const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
  39 |     await expect(submitBtn).toBeVisible();
  40 |     await expect(submitBtn).toBeEnabled();
  41 | 
  42 |     await submitBtn.click();
  43 |     
  44 |     const output = page.locator('.nlp-output');
  45 |     await expect(output).not.toContainText('Generated code will appear here', { timeout: 5000 });
  46 |   });
  47 | 
  48 |   test('NLP submit button handles request with input', async ({ page }) => {
  49 |     await page.goto('/nlp');
  50 |     await page.waitForLoadState('networkidle');
  51 | 
  52 |     const input = page.locator('.nlp-input-row input');
  53 |     await input.fill('Test scenario');
  54 | 
  55 |     const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
  56 |     await submitBtn.click();
  57 |     
  58 |     // Should process the request
  59 |     await page.waitForTimeout(500);
  60 |     await expect(submitBtn).toBeVisible();
  61 |   });
  62 | 
  63 |   test('NLP submit button does nothing with empty input', async ({ page }) => {
  64 |     await page.goto('/nlp');
  65 |     await page.waitForLoadState('networkidle');
  66 | 
  67 |     const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
  68 |     await submitBtn.click();
  69 |     await page.waitForTimeout(500);
  70 | 
  71 |     // Output should not change
  72 |     const output = page.locator('.nlp-output');
  73 |     await expect(output).toContainText('Generated code will appear here');
  74 |   });
  75 | 
  76 |   test('NLP submit button is clickable', async ({ page }) => {
  77 |     await page.goto('/nlp');
  78 |     await page.waitForLoadState('networkidle');
  79 | 
  80 |     const input = page.locator('.nlp-input-row input');
  81 |     await input.fill('Test pump at 5 l/min');
  82 | 
  83 |     const submitBtn = page.locator('.nlp-input-row button[type="submit"]');
  84 |     await expect(submitBtn).toBeVisible();
  85 |     await submitBtn.click();
  86 | 
  87 |     // Just verify button is clickable, don't check loading state
  88 |     await expect(submitBtn).toBeVisible();
  89 |   });
  90 | });
  91 | 
```