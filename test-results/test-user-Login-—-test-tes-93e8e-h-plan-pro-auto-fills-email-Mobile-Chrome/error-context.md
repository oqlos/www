# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-user.spec.js >> Login — test@test.com >> login with plan=pro auto-fills email
- Location: e2e/test-user.spec.js:174:3

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  locator('input[type="email"]')
Expected: "test@test.com"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" with timeout 5000ms
  - waiting for locator('input[type="email"]')
    9 × locator resolved to <input value="" required="" type="email" class="auth-input" placeholder="you@company.com"/>
      - unexpected value ""

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
  80  |       status: 200,
  81  |       contentType: 'application/json',
  82  |       body: JSON.stringify({
  83  |         commands: ['docker restart oqlos-staging'],
  84  |       }),
  85  |     });
  86  |   });
  87  | 
  88  |   await page.route('**/billing/subscribe/**', async (route) => {
  89  |     await route.fulfill({
  90  |       status: 200,
  91  |       contentType: 'application/json',
  92  |       body: JSON.stringify({ checkout_url: null, message: 'Mock billing — no payment required' }),
  93  |     });
  94  |   });
  95  | 
  96  |   await page.route('**/billing/subscription', async (route) => {
  97  |     await route.fulfill({
  98  |       status: 200,
  99  |       contentType: 'application/json',
  100 |       body: JSON.stringify({ plan: 'pro', status: 'active', cancel_at_period_end: false }),
  101 |     });
  102 |   });
  103 | 
  104 |   await page.route('**/api/scenarios', async (route) => {
  105 |     await route.fulfill({
  106 |       status: 200,
  107 |       contentType: 'application/json',
  108 |       body: JSON.stringify({ scenarios: [
  109 |         { id: 1, name: 'Test Scenario 1', description: 'Pump control', oql_code: 'SET "pompa 1" "2 l/min"' },
  110 |         { id: 2, name: 'Test Scenario 2', description: 'Temp monitoring', oql_code: 'GET "temp_sensor_1"' },
  111 |       ] }),
  112 |     });
  113 |   });
  114 | 
  115 |   await page.route('**/api/health', async (route) => {
  116 |     await route.fulfill({
  117 |       status: 200,
  118 |       contentType: 'application/json',
  119 |       body: JSON.stringify({ status: 'ok' }),
  120 |     });
  121 |   });
  122 | }
  123 | 
  124 | /** Log in as test@test.com via the login form and wait for redirect. */
  125 | async function loginAsTestUser(page) {
  126 |   await mockBackendRoutes(page);
  127 |   await page.goto('/login');
  128 |   await page.waitForLoadState('networkidle');
  129 | 
  130 |   const emailInput = page.locator('input[type="email"]');
  131 |   await emailInput.fill(TEST_EMAIL);
  132 |   await page.locator('button[type="submit"]').click();
  133 | 
  134 |   // Should show success and redirect to /dashboard
  135 |   await expect(page.locator('.auth-msg.success')).toBeVisible({ timeout: 5000 });
  136 |   await page.waitForURL('**/dashboard', { timeout: 8000 });
  137 | }
  138 | 
  139 | /** Inject JWT + user into localStorage so protected routes work without form flow. */
  140 | async function injectTestSession(page) {
  141 |   await mockBackendRoutes(page);
  142 |   await page.goto('/');
  143 |   await page.evaluate((user) => {
  144 |     localStorage.setItem('jwt', 'test-jwt-token');
  145 |     localStorage.setItem('user', JSON.stringify(user));
  146 |   }, TEST_USER);
  147 | }
  148 | 
  149 | // ── 1. Login ─────────────────────────────────────────────────────────────────
  150 | 
  151 | test.describe('Login — test@test.com', () => {
  152 |   test.beforeEach(async ({ page }) => {
  153 |     await mockBackendRoutes(page);
  154 |     // Clear any previous session
  155 |     await page.goto('/');
  156 |     await page.evaluate(() => localStorage.clear());
  157 |   });
  158 | 
  159 |   test('login page renders correctly', async ({ page }) => {
  160 |     await page.goto('/login');
  161 |     await expect(page.locator('h2')).toBeVisible();
  162 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  163 |     await expect(page.locator('button[type="submit"]')).toBeVisible();
  164 |   });
  165 | 
  166 |   test('can log in with test@test.com and reach dashboard', async ({ page }) => {
  167 |     await loginAsTestUser(page);
  168 | 
  169 |     // Verify we are on the dashboard
  170 |     await expect(page).toHaveURL(/\/dashboard/);
  171 |     await expect(page.locator('.dashboard')).toBeVisible();
  172 |   });
  173 | 
  174 |   test('login with plan=pro auto-fills email', async ({ page }) => {
  175 |     await page.goto('/login?plan=pro');
  176 |     await page.waitForLoadState('networkidle');
  177 | 
  178 |     const emailInput = page.locator('input[type="email"]');
  179 |     await expect(emailInput).toBeVisible({ timeout: 3000 });
> 180 |     await expect(emailInput).toHaveValue(TEST_EMAIL, { timeout: 5000 });
      |                              ^ Error: expect(locator).toHaveValue(expected) failed
  181 |   });
  182 | 
  183 |   test('JWT is stored in localStorage after login', async ({ page }) => {
  184 |     await loginAsTestUser(page);
  185 | 
  186 |     const jwt = await page.evaluate(() => localStorage.getItem('jwt'));
  187 |     const user = await page.evaluate(() => JSON.parse(localStorage.getItem('user') || '{}'));
  188 | 
  189 |     expect(jwt).toBeTruthy();
  190 |     expect(user.email).toBe(TEST_EMAIL);
  191 |     expect(user.role).toBe('admin');
  192 |     expect(user.plan).toBe('pro');
  193 |   });
  194 | });
  195 | 
  196 | // ── 2. Dashboard ─────────────────────────────────────────────────────────────
  197 | 
  198 | test.describe('Dashboard — authenticated', () => {
  199 |   test.beforeEach(async ({ page }) => {
  200 |     await injectTestSession(page);
  201 |   });
  202 | 
  203 |   test('dashboard loads with stats and quick actions', async ({ page }) => {
  204 |     await page.goto('/dashboard');
  205 |     await page.waitForLoadState('networkidle');
  206 | 
  207 |     // Stats grid
  208 |     await expect(page.locator('.dash-grid')).toBeVisible();
  209 |     const stats = page.locator('.dash-stat');
  210 |     await expect(stats).toHaveCount(4);
  211 | 
  212 |     // Quick-action cards
  213 |     const cards = page.locator('.feature-card');
  214 |     await expect(cards).toHaveCount(3);
  215 |   });
  216 | 
  217 |   test('navigate to Scenarios from dashboard', async ({ page }) => {
  218 |     await page.goto('/dashboard');
  219 |     await page.waitForLoadState('networkidle');
  220 | 
  221 |     await page.locator('.feature-card', { hasText: 'OQL Scenario' }).click();
  222 |     await page.waitForURL('**/scenarios');
  223 |     await expect(page.locator('.dashboard')).toBeVisible();
  224 |   });
  225 | 
  226 |   test('navigate to NLP Console from dashboard', async ({ page }) => {
  227 |     await page.goto('/dashboard');
  228 |     await page.waitForLoadState('networkidle');
  229 | 
  230 |     await page.locator('.feature-card', { hasText: 'NLP' }).click();
  231 |     await page.waitForURL('**/nlp');
  232 |     await expect(page.locator('.nlp-console')).toBeVisible();
  233 |   });
  234 | 
  235 |   test('navigate to Billing from dashboard', async ({ page }) => {
  236 |     await page.goto('/dashboard');
  237 |     await page.waitForLoadState('networkidle');
  238 | 
  239 |     await page.locator('.feature-card', { hasText: 'Manage Plan' }).click();
  240 |     await page.waitForURL('**/billing');
  241 |     await expect(page.locator('.pricing-grid')).toBeVisible();
  242 |   });
  243 | });
  244 | 
  245 | // ── 3. Scenarios — OQL editor & terminal ─────────────────────────────────────
  246 | 
  247 | test.describe('Scenarios — OQL', () => {
  248 |   test.beforeEach(async ({ page }) => {
  249 |     await injectTestSession(page);
  250 |     await page.goto('/scenarios');
  251 |     await page.waitForLoadState('networkidle');
  252 |   });
  253 | 
  254 |   test('scenarios page loads with editor and terminal', async ({ page }) => {
  255 |     await expect(page.locator('.editor-wrapper')).toBeVisible();
  256 |     await expect(page.locator('.terminal-wrapper')).toBeVisible();
  257 |   });
  258 | 
  259 |   test('scenario tabs are visible and switchable', async ({ page }) => {
  260 |     const tabs = page.locator('.example-tab');
  261 |     const count = await tabs.count();
  262 |     expect(count).toBeGreaterThanOrEqual(3);
  263 | 
  264 |     // Click each tab and verify editor updates
  265 |     for (let i = 0; i < count; i++) {
  266 |       await tabs.nth(i).click();
  267 |       await expect(tabs.nth(i)).toHaveClass(/active/);
  268 |       // Editor should have code
  269 |       const textarea = page.locator('.editor-textarea');
  270 |       const value = await textarea.inputValue();
  271 |       expect(value.length).toBeGreaterThan(10);
  272 |     }
  273 |   });
  274 | 
  275 |   test('OQL pump test scenario has correct keywords', async ({ page }) => {
  276 |     // First tab is "pump-test"
  277 |     await page.locator('.example-tab').first().click();
  278 |     const code = await page.locator('.editor-textarea').inputValue();
  279 | 
  280 |     expect(code).toContain('SCENARIO:');
```