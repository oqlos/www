# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: buttons/navigation-buttons.spec.js >> Navigation Buttons >> logout button is visible and clickable
- Location: e2e/buttons/navigation-buttons.spec.js:13:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button').filter({ hasText: /logout|wyloguj/i })
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
  13 × retrying click action
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
  - retrying click action
    - waiting 500ms

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
  1  | import { test, expect } from '@playwright/test';
  2  | import { setupAuth } from '../helpers/test-helpers';
  3  | 
  4  | /**
  5  |  * Navigation Button Tests
  6  |  */
  7  | 
  8  | test.describe('Navigation Buttons', () => {
  9  |   test.beforeEach(async ({ page }) => {
  10 |     await setupAuth(page);
  11 |   });
  12 | 
  13 |   test('logout button is visible and clickable', async ({ page }) => {
  14 |     await page.goto('/dashboard');
  15 |     await page.waitForLoadState('networkidle');
  16 | 
  17 |     const logoutBtn = page.locator('button', { hasText: /logout|wyloguj/i });
  18 |     if (await logoutBtn.count() > 0) {
  19 |       await expect(logoutBtn).toBeVisible();
> 20 |       await logoutBtn.click();
     |                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  21 |       await page.waitForLoadState('networkidle');
  22 | 
  23 |       const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
  24 |       expect(jwt).toBeNull();
  25 |     }
  26 |   });
  27 | 
  28 |   test('nav links work like buttons', async ({ page }) => {
  29 |     await page.goto('/dashboard');
  30 |     await page.waitForLoadState('networkidle');
  31 | 
  32 |     // Test nav link to scenarios
  33 |     const scenariosLink = page.locator('a[href="/scenarios"]');
  34 |     if (await scenariosLink.count() > 0) {
  35 |       await scenariosLink.click();
  36 |       await page.waitForURL('**/scenarios');
  37 |       await expect(page.locator('.editor-wrapper')).toBeVisible();
  38 |     }
  39 |   });
  40 | 
  41 |   test('logo link navigates to landing', async ({ page }) => {
  42 |     await page.goto('/dashboard');
  43 |     await page.waitForLoadState('networkidle');
  44 | 
  45 |     const logo = page.locator('.nav-logo');
  46 |     await logo.click();
  47 |     await page.waitForURL('/');
  48 |     await expect(page).toHaveURL('/');
  49 |   });
  50 | });
  51 | 
```