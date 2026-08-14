# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buttons/dashboard-buttons.spec.js >> Dashboard Buttons >> feature cards are clickable and navigate
- Location: e2e/buttons/dashboard-buttons.spec.js:13:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.editor-wrapper')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.editor-wrapper')

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
  2  | import { setupAuth, TEST_USER } from '../helpers/test-helpers';
  3  | 
  4  | /**
  5  |  * Dashboard Button Tests
  6  |  */
  7  | 
  8  | test.describe('Dashboard Buttons', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await setupAuth(page);
  11 |   });
  12 | 
  13 |   test('feature cards are clickable and navigate', async ({ page }) => {
  14 |     await page.goto('/dashboard');
  15 |     await page.waitForLoadState('networkidle');
  16 | 
  17 |     const featureCards = page.locator('.feature-card');
  18 |     await expect(featureCards).toHaveCount(3);
  19 | 
  20 |     // Test Scenarios card
  21 |     await featureCards.nth(0).click();
  22 |     await page.waitForURL('**/scenarios');
> 23 |     await expect(page.locator('.editor-wrapper')).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
  24 | 
  25 |     // Go back to dashboard
  26 |     await page.goto('/dashboard');
  27 |     await page.waitForLoadState('networkidle');
  28 | 
  29 |     // Test NLP Console card
  30 |     await featureCards.nth(1).click();
  31 |     await page.waitForURL('**/nlp');
  32 |     await expect(page.locator('.nlp-console')).toBeVisible();
  33 |   });
  34 | 
  35 |   test('run scenarios button is visible', async ({ page }) => {
  36 |     await page.goto('/dashboard');
  37 |     await page.waitForLoadState('networkidle');
  38 | 
  39 |     const runBtn = page.locator('button', { hasText: /run scenarios|uruchom/i });
  40 |     if (await runBtn.count() > 0) {
  41 |       await expect(runBtn).toBeVisible();
  42 |     }
  43 |   });
  44 | 
  45 |   test('NLP Console button navigates correctly', async ({ page }) => {
  46 |     await page.goto('/dashboard');
  47 |     await page.waitForLoadState('networkidle');
  48 | 
  49 |     const nlpBtn = page.locator('button', { hasText: /nlp/i });
  50 |     if (await nlpBtn.count() > 0) {
  51 |       await nlpBtn.click();
  52 |       await page.waitForURL('**/nlp');
  53 |       await expect(page.locator('.nlp-console')).toBeVisible();
  54 |     }
  55 |   });
  56 | });
  57 | 
```