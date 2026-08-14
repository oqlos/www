# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buttons/billing-buttons.spec.js >> Billing Page Buttons >> subscribe button works for Pro plan
- Location: e2e/buttons/billing-buttons.spec.js:42:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.price-card.featured').locator('button')
    - locator resolved to <button class="btn btn-primary">Start trial</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="price-amount">€0</div> from <div class="price-card  ">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <span>Community support</span> from <div class="price-card  ">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="price-amount">€0</div> from <div class="price-card  ">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <a href="/dashboard">Dashboard</a> from <nav class="nav">…</nav> subtree intercepts pointer events
  13 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="price-card featured ">…</div> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <span>Community support</span> from <div class="price-card  ">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <a href="/dashboard">Dashboard</a> from <nav class="nav">…</nav> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <a href="/dashboard">Dashboard</a> from <nav class="nav">…</nav> subtree intercepts pointer events
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
  1  | import { test, expect } from '@playwright/test';
  2  | import { setupAuth } from '../helpers/test-helpers';
  3  | 
  4  | /**
  5  |  * Billing Page Button Tests
  6  |  */
  7  | 
  8  | test.describe('Billing Page Buttons', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await setupAuth(page);
  11 |   });
  12 | 
  13 |   test('pricing card buttons are visible', async ({ page }) => {
  14 |     await page.goto('/billing');
  15 |     await page.waitForLoadState('networkidle');
  16 | 
  17 |     const buttons = page.locator('.price-card button');
  18 |     await expect(buttons).toHaveCount(3);
  19 | 
  20 |     // All buttons should be visible
  21 |     for (let i = 0; i < 3; i++) {
  22 |       await expect(buttons.nth(i)).toBeVisible();
  23 |     }
  24 |   });
  25 | 
  26 |   test('Free plan button uses outline style', async ({ page }) => {
  27 |     await page.goto('/billing');
  28 |     await page.waitForLoadState('networkidle');
  29 | 
  30 |     const freeCardBtn = page.locator('.price-card').first().locator('button');
  31 |     await expect(freeCardBtn).toHaveClass(/btn-outline/);
  32 |   });
  33 | 
  34 |   test('Pro plan button uses primary style', async ({ page }) => {
  35 |     await page.goto('/billing');
  36 |     await page.waitForLoadState('networkidle');
  37 | 
  38 |     const proCardBtn = page.locator('.price-card.featured').locator('button');
  39 |     await expect(proCardBtn).toHaveClass(/btn-primary/);
  40 |   });
  41 | 
  42 |   test('subscribe button works for Pro plan', async ({ page }) => {
  43 |     await page.goto('/billing');
  44 |     await page.waitForLoadState('networkidle');
  45 | 
  46 |     const proCardBtn = page.locator('.price-card.featured').locator('button');
> 47 |     await proCardBtn.click();
     |                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  48 |     
  49 |     // Should trigger subscription (mocked)
  50 |     await page.waitForTimeout(500);
  51 |     // No error should be thrown
  52 |     await expect(proCardBtn).toBeVisible();
  53 |   });
  54 | 
  55 |   test('Enterprise plan button is visible', async ({ page }) => {
  56 |     await page.goto('/billing');
  57 |     await page.waitForLoadState('networkidle');
  58 | 
  59 |     const enterpriseCardBtn = page.locator('.price-card').last().locator('button');
  60 |     await expect(enterpriseCardBtn).toBeVisible();
  61 |   });
  62 | });
  63 | 
```