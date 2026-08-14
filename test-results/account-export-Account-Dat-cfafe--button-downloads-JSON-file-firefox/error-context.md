# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: account-export.spec.js >> Account Data Export >> export button downloads JSON file
- Location: e2e/account-export.spec.js:17:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "http://oqlos.localhost/billing" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - heading "404 Not Found" [level=1] [ref=e3]
  - separator [ref=e4]
  - generic [ref=e5]: nginx
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Account Data Export', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login as test user
  6  |     await page.goto('http://oqlos.localhost/login?plan=pro');
> 7  |     await page.waitForURL('http://oqlos.localhost/billing');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  8  |   });
  9  | 
  10 |   test('export data button is visible on account page', async ({ page }) => {
  11 |     await page.goto('http://oqlos.localhost/account');
  12 |     
  13 |     // Check for export button
  14 |     await expect(page.locator('.account-form button').filter({ hasText: 'Export Data' })).toBeVisible();
  15 |   });
  16 | 
  17 |   test('export button downloads JSON file', async ({ page, context }) => {
  18 |     await page.goto('http://oqlos.localhost/account');
  19 |     
  20 |     // Handle download
  21 |     const downloadPromise = page.waitForEvent('download');
  22 |     
  23 |     // Click export button
  24 |     await page.locator('.account-form button').filter({ hasText: 'Export Data' }).click();
  25 |     
  26 |     // Wait for download
  27 |     const download = await downloadPromise;
  28 |     
  29 |     // Verify file name
  30 |     expect(download.suggestedFilename()).toMatch(/oqlos-account-data-.*\.json$/);
  31 |     
  32 |     // Read file content
  33 |     const fileContent = await download.createReadStream();
  34 |     let content = '';
  35 |     for await (const chunk of fileContent) {
  36 |       content += chunk.toString();
  37 |     }
  38 |     
  39 |     // Verify JSON structure
  40 |     const data = JSON.parse(content);
  41 |     expect(data).toHaveProperty('profile');
  42 |     expect(data).toHaveProperty('subscription');
  43 |     expect(data).toHaveProperty('payments');
  44 |     expect(data).toHaveProperty('exported_at');
  45 |     expect(data).toHaveProperty('export_version');
  46 |     
  47 |     // Verify profile data
  48 |     expect(data.profile).toHaveProperty('email');
  49 |     expect(data.profile).toHaveProperty('id');
  50 |     
  51 |     // Verify subscription data
  52 |     expect(data.subscription).toHaveProperty('plan');
  53 |     expect(data.subscription).toHaveProperty('status');
  54 |   });
  55 | 
  56 |   test('export shows success message', async ({ page }) => {
  57 |     await page.goto('http://oqlos.localhost/account');
  58 |     
  59 |     // Click export button
  60 |     await page.locator('.account-form button').filter({ hasText: 'Export Data' }).click();
  61 |     
  62 |     // Wait for success message
  63 |     await expect(page.locator('.auth-msg.success')).toBeVisible();
  64 |     await expect(page.locator('.auth-msg.success')).toContainText('exported');
  65 |   });
  66 | });
  67 | 
```