# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: demo-user.spec.js >> Dashboard — demo user authenticated >> demo user can navigate to scenarios
- Location: e2e/demo-user.spec.js:192:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.editor-wrapper')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.editor-wrapper')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading "Something went wrong" [level=2] [ref=e4]
  - generic [ref=e5]: The operation is insecure.
  - button "Back to Home" [ref=e6] [cursor=pointer]
```

# Test source

```ts
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
  196 |     await page.locator('.feature-card', { hasText: 'OQL Scenario' }).click();
  197 |     await page.waitForURL('**/scenarios');
> 198 |     await expect(page.locator('.editor-wrapper')).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
  199 |   });
  200 | });
  201 | 
```