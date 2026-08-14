# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-user.spec.js >> Dashboard — demo user authenticated >> demo user can navigate to scenarios
- Location: e2e/demo-user.spec.js:192:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.feature-card').filter({ hasText: 'OQL Scenario' })
    - locator resolved to <div class="feature-card">…</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="dash-stat">…</div> from <div class="dash-grid">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div class="dash-stat">…</div> from <div class="dash-grid">…</div> subtree intercepts pointer events
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <h2>Dashboard</h2> intercepts pointer events
  13 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="dash-stat">…</div> from <div class="dash-grid">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="dash-stat">…</div> from <div class="dash-grid">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <h2>Dashboard</h2> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <h2>Dashboard</h2> intercepts pointer events
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
      - generic [ref=e18]: demo@oqlos.com
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
  96  |       status: 200,
  97  |       contentType: 'application/json',
  98  |       body: JSON.stringify({ scenarios: [] }),
  99  |     });
  100 |   });
  101 | }
  102 | 
  103 | // ── Login Tests ──────────────────────────────────────────────────────────────
  104 | 
  105 | test.describe('Login — demo@oqlos.com', () => {
  106 |   test.beforeEach(async ({ page }) => {
  107 |     await mockBackendRoutes(page);
  108 |     await page.goto('/');
  109 |     await page.evaluate(() => localStorage.clear());
  110 |   });
  111 | 
  112 |   test('login page renders correctly for demo user', async ({ page }) => {
  113 |     await page.goto('/login');
  114 |     await expect(page.locator('h2')).toBeVisible();
  115 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  116 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  117 |   });
  118 | 
  119 |   test('can log in with demo credentials and reach dashboard', async ({ page }) => {
  120 |     await page.goto('/login');
  121 |     await page.waitForLoadState('networkidle');
  122 | 
  123 |     const emailInput = page.locator('input[type="email"]');
  124 |     await emailInput.fill(DEMO_EMAIL);
  125 |     
  126 |     // Note: Current login flow doesn't use password field, only email
  127 |     // The mock API handles password verification internally
  128 |     await page.locator('button[type="submit"]').click();
  129 | 
  130 |     // Should show success and redirect to /dashboard
  131 |     await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
  132 |     await page.waitForURL('**/dashboard', { timeout: 8000 });
  133 |   });
  134 | 
  135 |   test('JWT is stored in localStorage after demo login', async ({ page }) => {
  136 |     await page.goto('/login');
  137 |     await page.waitForLoadState('networkidle');
  138 | 
  139 |     await page.locator('input[type="email"]').fill(DEMO_EMAIL);
  140 |     await page.locator('button[type="submit"]').click();
  141 | 
  142 |     await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
  143 |     await page.waitForURL('**/dashboard', { timeout: 8000 });
  144 | 
  145 |     const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
  146 |     const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
  147 | 
  148 |     expect(jwt).toBeTruthy();
  149 |     expect(user.email).toBe(DEMO_EMAIL);
  150 |     expect(user.role).toBe(DEMO_USER.role);
  151 |     expect(user.plan).toBe('free');
  152 |   });
  153 | 
  154 |   test('demo user has correct user data after login', async ({ page }) => {
  155 |     await page.goto('/login');
  156 |     await page.waitForLoadState('networkidle');
  157 | 
  158 |     await page.locator('input[type="email"]').fill(DEMO_EMAIL);
  159 |     await page.locator('button[type="submit"]').click();
  160 | 
  161 |     await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
  162 |     await page.waitForURL('**/dashboard', { timeout: 8000 });
  163 | 
  164 |     const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
  165 | 
  166 |     expect(user.id).toBe(3);
  167 |     expect(user.name).toBe(DEMO_USER.name);
  168 |     expect(user.plan).toBe('free');
  169 |   });
  170 | });
  171 | 
  172 | // ── Dashboard Access ───────────────────────────────────────────────────────────
  173 | 
  174 | test.describe('Dashboard — demo user authenticated', () => {
  175 |   test.beforeEach(async ({ page }) => {
  176 |     await mockBackendRoutes(page);
  177 |     await page.goto('/');
  178 |     await page.evaluate((user) => {
  179 |       localStorage.setItem('jwt', 'test-jwt-token');
  180 |       localStorage.setItem('user', JSON.stringify(user));
  181 |     }, DEMO_USER);
  182 |   });
  183 | 
  184 |   test('dashboard loads for demo user', async ({ page }) => {
  185 |     await page.goto('/dashboard');
  186 |     await page.waitForLoadState('networkidle');
  187 | 
  188 |     await expect(page).toHaveURL(/\/dashboard/);
  189 |     await expect(page.locator('.dash-grid')).toBeVisible();
  190 |   });
  191 | 
  192 |   test('demo user can navigate to scenarios', async ({ page }) => {
  193 |     await page.goto('/dashboard');
  194 |     await page.waitForLoadState('networkidle');
  195 | 
> 196 |     await page.locator('.feature-card', { hasText: 'OQL Scenario' }).click();
      |                                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  197 |     await page.waitForURL('**/scenarios');
  198 |     await expect(page.locator('.editor-wrapper')).toBeVisible();
  199 |   });
  200 | });
  201 | 
```