# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: billing-payment.spec.js >> Billing Payment Flow >> enterprise contact button works
- Location: e2e/billing-payment.spec.js:34:3

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
  3  | test.describe('Billing Payment Flow', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     // Login as test user
  6  |     await page.goto('http://oqlos.localhost/login?plan=pro');
  7  |     // ?plan=pro redirects to billing, not dashboard
> 8  |     await page.waitForURL('http://oqlos.localhost/billing');
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  9  |   });
  10 | 
  11 |   test('subscribe button redirects to checkout URL', async ({ page }) => {
  12 |     await page.goto('http://oqlos.localhost/billing');
  13 |     
  14 |     // Click "Rozpocznij trial" button on Pro card
  15 |     const subscribeButton = page.locator('.price-card.featured .btn-primary', { hasText: 'Rozpocznij trial' });
  16 |     await expect(subscribeButton).toBeVisible();
  17 |     
  18 |     // Click the button
  19 |     await subscribeButton.click();
  20 |     
  21 |     // Wait for navigation to checkout or back to billing with session
  22 |     await page.waitForTimeout(500);
  23 |     
  24 |     // Check if we're on billing page with session parameter (mock checkout)
  25 |     const url = page.url();
  26 |     expect(url).toContain('session=');
  27 |     expect(url).toContain('billing');
  28 |     
  29 |     // Check for success message
  30 |     await expect(page.locator('.auth-msg.success')).toBeVisible();
  31 |     await expect(page.locator('.auth-msg.success')).toContainText('Payment successful');
  32 |   });
  33 | 
  34 |   test('enterprise contact button works', async ({ page }) => {
  35 |     await page.goto('http://oqlos.localhost/billing');
  36 |     
  37 |     // Click "Kontakt" button on Enterprise card
  38 |     const contactButton = page.locator('.price-card').filter({ hasText: 'Enterprise' }).locator('.btn-outline', { hasText: 'Kontakt' });
  39 |     await expect(contactButton).toBeVisible();
  40 |     
  41 |     // Click the button (should trigger onSubscribe with enterprise plan)
  42 |     await contactButton.click();
  43 |     
  44 |     // For enterprise, it should navigate to login if not authenticated, or show contact form
  45 |     // In mock mode, it will redirect to billing with session
  46 |     await page.waitForTimeout(500);
  47 |     const url = page.url();
  48 |     expect(url).toContain('session=');
  49 |   });
  50 | 
  51 |   test('free plan download button works', async ({ page }) => {
  52 |     await page.goto('http://oqlos.localhost/billing');
  53 |     
  54 |     // Click "Pobierz z GitHub" button on Free card
  55 |     const downloadButton = page.locator('.price-card').filter({ hasText: 'Free' }).locator('.btn-outline', { hasText: 'Pobierz z GitHub' });
  56 |     await expect(downloadButton).toBeVisible();
  57 |     
  58 |     // This button doesn't have onSubscribe handler, so it should not redirect
  59 |     await downloadButton.click();
  60 |     
  61 |     // URL should not change (button has no handler)
  62 |     await page.waitForTimeout(500);
  63 |     const url = page.url();
  64 |     expect(url).toBe('http://oqlos.localhost/billing');
  65 |   });
  66 | });
  67 | 
```