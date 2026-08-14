# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-user.spec.js >> Protected routes — unauthenticated >> scenarios redirects to login when not authenticated
- Location: e2e/test-user.spec.js:602:3

# Error details

```
TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/login" until "load"
============================================================
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Something went wrong" [level=2] [ref=e4]
  - generic [ref=e5]: "Failed to execute 'replaceState' on 'History': A history state object with URL 'http://cql.localhost/' cannot be created in a document with origin 'http://localhost:3000' and URL 'http://localhost:3000/scenarios'."
  - button "Back to Home" [ref=e6] [cursor=pointer]
```

# Test source

```ts
  504 |     await expect(page.locator('.auth-msg.success')).toContainText('Payment successful');
  505 |   });
  506 | });
  507 | 
  508 | // ── 7. Navigation & SharedNav ────────────────────────────────────────────────
  509 | 
  510 | test.describe('Navigation', () => {
  511 |   test.beforeEach(async ({ page }) => {
  512 |     await injectTestSession(page);
  513 |   });
  514 | 
  515 |   test('SharedNav is visible on all protected pages', async ({ page }) => {
  516 |     const protectedPages = ['/dashboard', '/scenarios', '/nlp', '/billing'];
  517 | 
  518 |     for (const path of protectedPages) {
  519 |       await page.goto(path);
  520 |       await page.waitForLoadState('networkidle');
  521 |       await expect(page.locator('nav').or(page.locator('.nav-logo')).first()).toBeVisible();
  522 |     }
  523 |   });
  524 | 
  525 |   test('can navigate full user journey: login → dashboard → scenarios → nlp → billing', async ({ page }) => {
  526 |     // Start logged out
  527 |     await page.evaluate(() => localStorage.clear());
  528 | 
  529 |     // 1. Login
  530 |     await loginAsTestUser(page);
  531 |     await expect(page).toHaveURL(/\/dashboard/);
  532 | 
  533 |     // 2. Dashboard → Scenarios
  534 |     await page.locator('.feature-card', { hasText: 'OQL Scenario' }).click();
  535 |     await page.waitForURL('**/scenarios');
  536 |     await expect(page.locator('.editor-wrapper')).toBeVisible();
  537 | 
  538 |     // 3. Run terminal simulation
  539 |     await page.locator('.run-btn').click();
  540 |     await expect(page.locator('.terminal-body div', { hasText: 'PASS' })).toBeVisible({ timeout: 10000 });
  541 | 
  542 |     // 4. Navigate to NLP
  543 |     await page.goto('/nlp');
  544 |     await page.waitForLoadState('networkidle');
  545 |     const input = page.locator('.nlp-input-row input');
  546 |     await input.fill('Test pump at 5 l/min');
  547 |     await page.locator('.nlp-input-row button[type="submit"]').click();
  548 |     await expect(page.locator('.nlp-output')).not.toContainText('Generated code will appear here', { timeout: 5000 });
  549 | 
  550 |     // 5. Navigate to Billing
  551 |     await page.goto('/billing');
  552 |     await page.waitForLoadState('networkidle');
  553 |     await expect(page.locator('.pricing-grid')).toBeVisible();
  554 |   });
  555 | });
  556 | 
  557 | // ── 8. Logout ────────────────────────────────────────────────────────────────
  558 | 
  559 | test.describe('Logout', () => {
  560 |   test('logout clears session and redirects', async ({ page }) => {
  561 |     await injectTestSession(page);
  562 |     await page.goto('/dashboard');
  563 |     await page.waitForLoadState('networkidle');
  564 | 
  565 |     // Find and click logout (look for any logout-like element in nav)
  566 |     const logoutBtn = page.locator('button', { hasText: /logout|wyloguj|sign out/i })
  567 |       .or(page.locator('[data-action="logout"]'))
  568 |       .or(page.locator('.logout-btn'));
  569 | 
  570 |     if (await logoutBtn.count() > 0) {
  571 |       await logoutBtn.first().click();
  572 |       await page.waitForLoadState('networkidle');
  573 | 
  574 |       const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
  575 |       expect(jwt).toBeNull();
  576 |     } else {
  577 |       // Manual logout via localStorage
  578 |       await page.evaluate(() => {
  579 |         localStorage.removeItem('jwt');
  580 |         localStorage.removeItem('user');
  581 |       });
  582 |       await page.goto('/dashboard');
  583 |       // Should redirect to login since JWT is gone
  584 |       await page.waitForURL('**/login', { timeout: 5000 });
  585 |     }
  586 |   });
  587 | });
  588 | 
  589 | // ── 9. Protected routes without auth ─────────────────────────────────────────
  590 | 
  591 | test.describe('Protected routes — unauthenticated', () => {
  592 |   test.beforeEach(async ({ page }) => {
  593 |     await page.goto('/');
  594 |     await page.evaluate(() => localStorage.clear());
  595 |   });
  596 | 
  597 |   test('dashboard redirects to login when not authenticated', async ({ page }) => {
  598 |     await page.goto('/dashboard');
  599 |     await page.waitForURL('**/login', { timeout: 5000 });
  600 |   });
  601 | 
  602 |   test('scenarios redirects to login when not authenticated', async ({ page }) => {
  603 |     await page.goto('/scenarios');
> 604 |     await page.waitForURL('**/login', { timeout: 5000 });
      |                ^ TimeoutError: page.waitForURL: Timeout 5000ms exceeded.
  605 |   });
  606 | 
  607 |   test('NLP console redirects to login when not authenticated', async ({ page }) => {
  608 |     await page.goto('/nlp');
  609 |     await page.waitForURL('**/login', { timeout: 5000 });
  610 |   });
  611 | });
  612 | 
```