# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: account.spec.js >> Account Page >> subscription section displays current plan
- Location: e2e/account.spec.js:23:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "http://oqlos.localhost/billing" until "load"
  navigated to "http://oqlos.localhost/login?plan=pro"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e4]:
  - link "OqlOS" [ref=e5] [cursor=pointer]:
    - /url: /
    - emphasis [ref=e6]: OqlOS
  - heading "Sign In to OqlOS" [level=2] [ref=e7]
  - paragraph [ref=e8]: Enter your email — we'll send a magic login link.
  - generic [ref=e9]:
    - textbox "you@company.com" [active] [ref=e10]
    - button "Send Login Link" [ref=e11] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Account Page', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login as test user
  6  |     await page.goto('http://oqlos.localhost/login?plan=pro');
> 7  |     await page.waitForURL('http://oqlos.localhost/billing');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  8  |   });
  9  | 
  10 |   test('account page loads and displays user information', async ({ page }) => {
  11 |     await page.goto('http://oqlos.localhost/account');
  12 |     
  13 |     // Check page title
  14 |     await expect(page.locator('h2')).toContainText('Account Settings');
  15 |     
  16 |     // Check profile section
  17 |     await expect(page.locator('.account-section h3').first()).toContainText('Profile Information');
  18 |     
  19 |     // Check form fields (by placeholder/text)
  20 |     await expect(page.locator('.account-form input').first()).toBeVisible();
  21 |   });
  22 | 
  23 |   test('subscription section displays current plan', async ({ page }) => {
  24 |     await page.goto('http://oqlos.localhost/account');
  25 |     
  26 |     // Check subscription section
  27 |     await expect(page.locator('.account-section h3').nth(1)).toContainText('Subscription');
  28 |     
  29 |     // Check plan badge
  30 |     await expect(page.locator('.plan-badge')).toBeVisible();
  31 |   });
  32 | 
  33 |   test('payment history section is visible', async ({ page }) => {
  34 |     await page.goto('http://oqlos.localhost/account');
  35 |     
  36 |     // Check payment history section
  37 |     await expect(page.locator('.account-section h3').nth(2)).toContainText('Payment History');
  38 |     
  39 |     // Check payment table
  40 |     await expect(page.locator('.payment-table')).toBeVisible();
  41 |   });
  42 | 
  43 |   test('can navigate to account from nav', async ({ page }) => {
  44 |     await page.goto('http://oqlos.localhost/dashboard');
  45 |     
  46 |     // Click account link in nav
  47 |     await page.click('a[href="/account"]');
  48 |     
  49 |     // Should be on account page
  50 |     await expect(page).toHaveURL('http://oqlos.localhost/account');
  51 |     await expect(page.locator('h2')).toContainText('Account Settings');
  52 |   });
  53 | 
  54 |   test('profile update button works', async ({ page }) => {
  55 |     await page.goto('http://oqlos.localhost/account');
  56 |     
  57 |     // Fill in form (use first input)
  58 |     await page.fill('.account-form input:first-of-type', 'Test User Updated');
  59 |     
  60 |     // Click save button
  61 |     await page.click('.account-form button[type="submit"]');
  62 |     
  63 |     // Should show success message
  64 |     await expect(page.locator('.auth-msg.success')).toBeVisible();
  65 |   });
  66 | 
  67 |   test('danger zone section is visible', async ({ page }) => {
  68 |     await page.goto('http://oqlos.localhost/account');
  69 |     
  70 |     // Check danger zone section
  71 |     await expect(page.locator('.danger-zone')).toBeVisible();
  72 |     await expect(page.locator('.danger-zone h3')).toContainText('Danger Zone');
  73 |     
  74 |     // Check logout button
  75 |     await expect(page.locator('.btn-danger')).toBeVisible();
  76 |   });
  77 | });
  78 | 
```