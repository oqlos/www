# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buttons/scenarios-buttons.spec.js >> Scenarios Page Buttons >> step button works during execution
- Location: e2e/buttons/scenarios-buttons.spec.js:53:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.run-btn')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Something went wrong" [level=2] [ref=e4]
  - generic [ref=e5]: The operation is insecure.
  - button "Back to Home" [ref=e6] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { setupAuth } from '../helpers/test-helpers';
  3  | 
  4  | /**
  5  |  * Scenarios Page Button Tests
  6  |  */
  7  | 
  8  | test.describe('Scenarios Page Buttons', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await setupAuth(page);
  11 |   });
  12 | 
  13 |   test('scenario tabs are clickable and switch content', async ({ page }) => {
  14 |     await page.goto('/scenarios');
  15 |     await page.waitForLoadState('networkidle');
  16 | 
  17 |     const tabs = page.locator('.example-tab');
  18 |     const count = await tabs.count();
  19 |     expect(count).toBeGreaterThanOrEqual(3);
  20 | 
  21 |     // Click each tab
  22 |     for (let i = 0; i < count; i++) {
  23 |       await tabs.nth(i).click();
  24 |       await expect(tabs.nth(i)).toHaveClass(/active/);
  25 |       await page.waitForTimeout(200);
  26 |     }
  27 |   });
  28 | 
  29 |   test('terminal run button works', async ({ page }) => {
  30 |     await page.goto('/scenarios');
  31 |     await page.waitForLoadState('networkidle');
  32 | 
  33 |     const runBtn = page.locator('.run-btn');
  34 |     await expect(runBtn).toBeVisible();
  35 |     await expect(runBtn).toBeEnabled();
  36 | 
  37 |     await runBtn.click();
  38 |     await expect(page.locator('.terminal-body div', { hasText: 'PASS' })).toBeVisible({ timeout: 10000 });
  39 |   });
  40 | 
  41 |   test('run button is disabled while running', async ({ page }) => {
  42 |     await page.goto('/scenarios');
  43 |     await page.waitForLoadState('networkidle');
  44 | 
  45 |     const runBtn = page.locator('.run-btn');
  46 |     await runBtn.click();
  47 | 
  48 |     // Should be disabled during execution
  49 |     await page.waitForTimeout(100);
  50 |     await expect(runBtn).toBeDisabled();
  51 |   });
  52 | 
  53 |   test('step button works during execution', async ({ page }) => {
  54 |     await page.goto('/scenarios');
  55 |     await page.waitForLoadState('networkidle');
  56 | 
  57 |     const runBtn = page.locator('.run-btn');
> 58 |     await runBtn.click();
     |                  ^ Error: locator.click: Test timeout of 30000ms exceeded.
  59 | 
  60 |     // Wait for execution to start
  61 |     await page.waitForTimeout(500);
  62 | 
  63 |     const stepBtn = page.locator('.step-btn');
  64 |     if (await stepBtn.count() > 0) {
  65 |       await expect(stepBtn).toBeVisible();
  66 |     }
  67 |   });
  68 | });
  69 | 
```