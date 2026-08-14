# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-user.spec.js >> Billing >> Pro card has correct price and features
- Location: e2e/test-user.spec.js:490:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.price-card.featured')
Expected substring: "Multi-device"
Received string:    "RecommendedPro€49/monthper org · cancel anytimeEverything from Free +Web IDE (OqlIDE)Scenario libraryBasic PDF reportsEmail support (48h)Advanced compliance reportsDocker prod with TLSPriority email support (24h)Team collaborationStart trial"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.price-card.featured')
    8 × locator resolved to <div class="price-card featured ">…</div>
      - unexpected value "RecommendedPro€49/monthper org · cancel anytimeEverything from Free +Web IDE (OqlIDE)Scenario libraryBasic PDF reportsEmail support (48h)Advanced compliance reportsDocker prod with TLSPriority email support (24h)Team collaborationStart trial"

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
    - generic [ref=e23]: Manage Your Plan
    - heading "Manage Your Plan" [level=2] [ref=e24]
    - generic [ref=e26]:
      - generic [ref=e27]:
        - generic [ref=e28]: Current Plan
        - generic [ref=e29]: Pro
        - generic [ref=e30]: test@test.com
      - button "Cancel Subscription" [ref=e32] [cursor=pointer]
    - generic [ref=e33]:
      - generic [ref=e34]:
        - generic [ref=e35]: Open Source
        - heading "OqlOS Free" [level=3] [ref=e36]
        - generic [ref=e37]: €0
        - generic [ref=e38]: Apache 2.0 — forever
        - list [ref=e39]:
          - listitem [ref=e40]:
            - text: ✓
            - generic [ref=e41]: oql-core parser + interpreter
          - listitem [ref=e42]:
            - text: ✓
            - generic [ref=e43]: oql-cli (oqlctl)
          - listitem [ref=e44]:
            - text: ✓
            - generic [ref=e45]: TestQL runner
          - listitem [ref=e46]:
            - text: ✓
            - generic [ref=e47]: Unlimited devices
          - listitem [ref=e48]:
            - text: ✓
            - generic [ref=e49]: Fleet management
          - listitem [ref=e50]:
            - text: ✓
            - generic [ref=e51]: Docker compose (dev)
          - listitem [ref=e52]:
            - text: ✓
            - generic [ref=e53]: Community support
        - button "Download from GitHub" [ref=e54] [cursor=pointer]
      - generic [ref=e55]:
        - generic [ref=e56]: Recommended
        - heading "Pro" [level=3] [ref=e57]
        - generic [ref=e58]: €49/month
        - generic [ref=e59]: per org · cancel anytime
        - list [ref=e60]:
          - listitem [ref=e61]:
            - text: ✓
            - generic [ref=e62]: Everything from Free +
          - listitem [ref=e63]:
            - text: ✓
            - generic [ref=e64]: Web IDE (OqlIDE)
          - listitem [ref=e65]:
            - text: ✓
            - generic [ref=e66]: Scenario library
          - listitem [ref=e67]:
            - text: ✓
            - generic [ref=e68]: Basic PDF reports
          - listitem [ref=e69]:
            - text: ✓
            - generic [ref=e70]: Email support (48h)
          - listitem [ref=e71]:
            - text: ✓
            - generic [ref=e72]: Advanced compliance reports
          - listitem [ref=e73]:
            - text: ✓
            - generic [ref=e74]: Docker prod with TLS
          - listitem [ref=e75]:
            - text: ✓
            - generic [ref=e76]: Priority email support (24h)
          - listitem [ref=e77]:
            - text: ✓
            - generic [ref=e78]: Team collaboration
        - button "Start trial" [ref=e79] [cursor=pointer]
      - generic [ref=e80]:
        - generic [ref=e81]: For enterprises
        - heading "Enterprise" [level=3] [ref=e82]
        - generic [ref=e83]: Custom
        - generic [ref=e84]: contact for pricing
        - list [ref=e85]:
          - listitem [ref=e86]:
            - text: ✓
            - generic [ref=e87]: Everything from Business +
          - listitem [ref=e88]:
            - text: ✓
            - generic [ref=e89]: Unlimited team members
          - listitem [ref=e90]:
            - text: ✓
            - generic [ref=e91]: On-premise deployment
          - listitem [ref=e92]:
            - text: ✓
            - generic [ref=e93]: White-label branding
          - listitem [ref=e94]:
            - text: ✓
            - generic [ref=e95]: Custom hardware drivers
          - listitem [ref=e96]:
            - text: ✓
            - generic [ref=e97]: ERP / LIMS integration
          - listitem [ref=e98]:
            - text: ✓
            - generic [ref=e99]: "SLA: 99.99% uptime"
          - listitem [ref=e100]:
            - text: ✓
            - generic [ref=e101]: Dedicated support engineer
          - listitem [ref=e102]:
            - text: ✓
            - generic [ref=e103]: On-site training
        - button "Contact sales" [ref=e104] [cursor=pointer]
    - generic [ref=e105]:
      - paragraph [ref=e106]: 🔒 Payments processed by Stripe. Your data is secure.
      - paragraph [ref=e107]: You can cancel anytime. Refunds according to Stripe policy.
```

# Test source

```ts
  394 | 
  395 |   test('NLP console loads with tabs and input', async ({ page }) => {
  396 |     await expect(page.locator('.nlp-console')).toBeVisible();
  397 | 
  398 |     // Three tabs: OQL, IQL, DevOps
  399 |     const tabs = page.locator('.install-tab');
  400 |     await expect(tabs).toHaveCount(3);
  401 |     await expect(tabs.nth(0)).toContainText('OQL');
  402 |     await expect(tabs.nth(1)).toContainText('IQL');
  403 |     await expect(tabs.nth(2)).toContainText('DevOps');
  404 |   });
  405 | 
  406 |   test('NLP → OQL: generate scenario from natural language', async ({ page }) => {
  407 |     // OQL tab should be active by default
  408 |     const input = page.locator('.nlp-input-row input');
  409 |     await input.fill('Test pump at 2 l/min for 2 seconds then stop');
  410 |     await page.locator('.nlp-input-row button[type="submit"]').click();
  411 | 
  412 |     // Wait for output
  413 |     const output = page.locator('.nlp-output');
  414 |     await expect(output).not.toContainText('Generated code will appear here', { timeout: 5000 });
  415 | 
  416 |     const text = await output.textContent();
  417 |     expect(text).toContain('SCENARIO');
  418 |     expect(text).toContain('SET');
  419 |     expect(text).toContain('WAIT');
  420 |   });
  421 | 
  422 |   test('NLP → IQL: generate API test from natural language', async ({ page }) => {
  423 |     // Switch to IQL tab
  424 |     await page.locator('.install-tab', { hasText: 'IQL' }).click();
  425 | 
  426 |     const input = page.locator('.nlp-input-row input');
  427 |     await input.fill('Test that GET /api/v1/hardware/health returns 200');
  428 |     await page.locator('.nlp-input-row button[type="submit"]').click();
  429 | 
  430 |     const output = page.locator('.nlp-output');
  431 |     await expect(output).not.toContainText('Generated code will appear here', { timeout: 5000 });
  432 | 
  433 |     const text = await output.textContent();
  434 |     expect(text).toContain('API');
  435 |     expect(text).toContain('ASSERT_STATUS');
  436 |   });
  437 | 
  438 |   test('NLP tab switching changes placeholder text', async ({ page }) => {
  439 |     const input = page.locator('.nlp-input-row input');
  440 | 
  441 |     // OQL tab
  442 |     const oqlPlaceholder = await input.getAttribute('placeholder');
  443 |     expect(oqlPlaceholder).toContain('pump');
  444 | 
  445 |     // IQL tab
  446 |     await page.locator('.install-tab', { hasText: 'IQL' }).click();
  447 |     const iqlPlaceholder = await input.getAttribute('placeholder');
  448 |     expect(iqlPlaceholder).toContain('GET');
  449 | 
  450 |     // DevOps tab
  451 |     await page.locator('.install-tab', { hasText: 'DevOps' }).click();
  452 |     const devopsPlaceholder = await input.getAttribute('placeholder');
  453 |     expect(devopsPlaceholder).toContain('docker');
  454 |   });
  455 | 
  456 |   test('NLP empty prompt does not submit', async ({ page }) => {
  457 |     const output = page.locator('.nlp-output');
  458 |     const initialText = await output.textContent();
  459 | 
  460 |     await page.locator('.nlp-input-row button[type="submit"]').click();
  461 |     await page.waitForTimeout(500);
  462 | 
  463 |     const afterText = await output.textContent();
  464 |     expect(afterText).toBe(initialText);
  465 |   });
  466 | });
  467 | 
  468 | // ── 6. Billing ───────────────────────────────────────────────────────────────
  469 | 
  470 | test.describe('Billing', () => {
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
> 494 |     await expect(proCard).toContainText('Multi-device');
      |                           ^ Error: expect(locator).toContainText(expected) failed
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
```