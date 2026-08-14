# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-user.spec.js >> Logout >> logout clears session and redirects
- Location: e2e/test-user.spec.js:560:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button').filter({ hasText: /logout|wyloguj|sign out/i }).or(locator('[data-action="logout"]')).or(locator('.logout-btn')).first()
    - locator resolved to <button class="btn btn-outline btn-sm">Logout</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <a href="/demo">Demo</a> intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <a href="/demo">Demo</a> intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="nav-links">…</div> intercepts pointer events
  12 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <a href="/demo">Demo</a> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <a href="/demo">Demo</a> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="nav-links">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="nav-links">…</div> intercepts pointer events
  2 × retrying click action
      - waiting 500ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <a href="/demo">Demo</a> intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="nav-links">…</div> intercepts pointer events
  - retrying click action
    - waiting 500ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - navigation [ref=e4]:
    - link "OqlOS" [ref=e5] [cursor=pointer]:
      - /url: /
      - emphasis [ref=e6]: OqlOS
    - generic [ref=e7]:
      - link "Dashboard" [ref=e8] [cursor=pointer]:
        - /url: /dashboard
      - link "Scenarios ↗" [ref=e9] [cursor=pointer]:
        - /url: http://cql.localhost
      - link "NLP Console" [ref=e10] [cursor=pointer]:
        - /url: /nlp
      - link "Billing" [ref=e11] [cursor=pointer]:
        - /url: /billing
      - link "Demo" [ref=e12] [cursor=pointer]:
        - /url: /demo
      - link "ROI" [ref=e13] [cursor=pointer]:
        - /url: /roi
      - link "Case Studies" [ref=e14] [cursor=pointer]:
        - /url: /case-studies
      - link "Account" [ref=e15] [cursor=pointer]:
        - /url: /account
      - link "Status" [ref=e16] [cursor=pointer]:
        - /url: /status
      - link "Academy" [ref=e17] [cursor=pointer]:
        - /url: /academy
      - generic [ref=e18]: test@test.com
      - combobox "Language" [ref=e19] [cursor=pointer]:
        - option "🇬🇧 EN" [selected]
        - option "🇵🇱 PL"
        - option "🇩🇪 DE"
      - button "Toggle theme" [ref=e20] [cursor=pointer]: ☀️
      - button "Logout" [ref=e21] [cursor=pointer]
  - generic [ref=e22]:
    - heading "Dashboard" [level=2] [ref=e23]
    - paragraph [ref=e24]: Overview of your OqlOS environment.
    - generic [ref=e25]:
      - generic [ref=e26]:
        - heading "Scenarios" [level=4] [ref=e27]
        - generic [ref=e28]: "3"
      - generic [ref=e29]:
        - heading "Devices" [level=4] [ref=e30]
        - generic [ref=e31]: "2"
      - generic [ref=e32]:
        - heading "Tests Run" [level=4] [ref=e33]
        - generic [ref=e34]: "47"
      - generic [ref=e35]:
        - heading "Pass Rate" [level=4] [ref=e36]
        - generic [ref=e37]: 98%
    - generic [ref=e38]:
      - generic [ref=e39]: Quick Actions
      - heading "What would you like to do?" [level=2] [ref=e40]
      - generic [ref=e41]:
        - generic [ref=e42] [cursor=pointer]:
          - generic [ref=e43]: ⚙
          - heading "Write OQL Scenario" [level=3] [ref=e44]
          - paragraph [ref=e45]: Create or edit hardware test scenarios with syntax highlighting and live preview.
        - generic [ref=e46] [cursor=pointer]:
          - generic [ref=e47]: 💬
          - heading "NLP → OQL/IQL" [level=3] [ref=e48]
          - paragraph [ref=e49]: Describe what you want in natural language and get a ready-made scenario.
        - generic [ref=e50] [cursor=pointer]:
          - generic [ref=e51]: 💳
          - heading "Manage Plan" [level=3] [ref=e52]
          - paragraph [ref=e53]: Upgrade to Pro for fleet management, reports, and compliance features.
```

# Test source

```ts
  471 |   test.beforeEach(async ({ page }) => {
  472 |     await injectTestSession(page);
  473 |     await page.goto('/billing');
  474 |     await page.waitForLoadState('networkidle');
  475 |   });
  476 | 
  477 |   test('billing page shows pricing cards', async ({ page }) => {
  478 |     await expect(page.locator('.pricing-grid')).toBeVisible();
  479 | 
  480 |     const cards = page.locator('.price-card');
  481 |     await expect(cards).toHaveCount(3);
  482 |   });
  483 | 
  484 |   test('pricing cards show Free, Pro, Enterprise', async ({ page }) => {
  485 |     await expect(page.locator('.price-card', { hasText: 'OqlOS Free' }).first()).toBeVisible();
  486 |     await expect(page.locator('.price-card.featured', { hasText: 'OqlOS Pro' })).toBeVisible();
  487 |     await expect(page.locator('.price-card', { hasText: 'Enterprise' })).toBeVisible();
  488 |   });
  489 | 
  490 |   test('Pro card has correct price and features', async ({ page }) => {
  491 |     const proCard = page.locator('.price-card.featured');
  492 |     await expect(proCard).toBeVisible();
  493 |     await expect(proCard).toContainText('€49');
  494 |     await expect(proCard).toContainText('Multi-device');
  495 |     await expect(proCard).toContainText('OqlIDE');
  496 |     await expect(proCard).toContainText('Raporty PDF');
  497 |   });
  498 | 
  499 |   test('billing success state shows confirmation', async ({ page }) => {
  500 |     await page.goto('/billing?session=test-session-123');
  501 |     await page.waitForLoadState('networkidle');
  502 | 
  503 |     await expect(page.locator('.auth-msg.success')).toBeVisible();
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
> 571 |       await logoutBtn.first().click();
      |                               ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  604 |     await page.waitForURL('**/login', { timeout: 5000 });
  605 |   });
  606 | 
  607 |   test('NLP console redirects to login when not authenticated', async ({ page }) => {
  608 |     await page.goto('/nlp');
  609 |     await page.waitForURL('**/login', { timeout: 5000 });
  610 |   });
  611 | });
  612 | 
```