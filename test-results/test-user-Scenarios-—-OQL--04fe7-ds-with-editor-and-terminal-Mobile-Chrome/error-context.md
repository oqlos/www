# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-user.spec.js >> Scenarios — OQL >> scenarios page loads with editor and terminal
- Location: e2e/test-user.spec.js:254:3

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
  - generic [ref=e5]: "Failed to execute 'replaceState' on 'History': A history state object with URL 'http://cql.localhost/' cannot be created in a document with origin 'http://localhost:3000' and URL 'http://localhost:3000/scenarios'."
  - button "Back to Home" [ref=e6] [cursor=pointer]
```

# Test source

```ts
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
  180 |     await expect(emailInput).toHaveValue(TEST_EMAIL, { timeout: 5000 });
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
> 255 |     await expect(page.locator('.editor-wrapper')).toBeVisible();
      |                                                   ^ Error: expect(locator).toBeVisible() failed
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
  281 |     expect(code).toContain('GOAL:');
  282 |     expect(code).toContain('SET');
  283 |     expect(code).toContain('WAIT');
  284 |     expect(code).toContain('pompa');
  285 |   });
  286 | 
  287 |   test('OQL leak test scenario loads correctly', async ({ page }) => {
  288 |     await page.locator('.example-tab', { hasText: /Leak|Szczelno/ }).click();
  289 |     const code = await page.locator('.editor-textarea').inputValue();
  290 | 
  291 |     expect(code).toContain('SCENARIO:');
  292 |     expect(code).toContain('MIN');
  293 |     expect(code).toContain('MAX');
  294 |     expect(code).toContain('SAVE');
  295 |     expect(code).toContain('mbar');
  296 |   });
  297 | 
  298 |   test('OQL editor supports typing custom code', async ({ page }) => {
  299 |     const textarea = page.locator('.editor-textarea');
  300 |     await textarea.fill('SCENARIO: "Custom E2E Test"\nGOAL: Verify pump\n  SET \'pompa 1\' \'5 l/min\'\n  WAIT 1000ms');
  301 | 
  302 |     const value = await textarea.inputValue();
  303 |     expect(value).toContain('Custom E2E Test');
  304 |     expect(value).toContain('5 l/min');
  305 |   });
  306 | 
  307 |   test('OQL syntax highlighting renders keywords', async ({ page }) => {
  308 |     await page.locator('.example-tab').first().click();
  309 |     const highlighted = page.locator('.editor-highlight');
  310 |     await expect(highlighted).toBeVisible();
  311 | 
  312 |     const html = await highlighted.innerHTML();
  313 |     expect(html).toContain('syn-keyword');
  314 |     expect(html).toContain('syn-string');
  315 |   });
  316 | 
  317 |   test('terminal simulator runs OQL dry-run', async ({ page }) => {
  318 |     const runBtn = page.locator('.run-btn');
  319 |     await expect(runBtn).toBeVisible();
  320 |     await expect(runBtn).toBeEnabled();
  321 | 
  322 |     await runBtn.click();
  323 | 
  324 |     // Wait for the simulation to complete (lines appear one by one)
  325 |     const summary = page.locator('.terminal-body div').filter({ hasText: /Result:\s*PASS/ });
  326 |     await expect(summary).toBeVisible({ timeout: 10000 });
  327 |     await expect(summary).toContainText(/Steps:\s*5(?:\/5)?/);
  328 |     await expect(summary).toContainText('0 errors');
  329 |   });
  330 | });
  331 | 
  332 | // ── 4. Scenarios — IQL (TestQL / API Tests) ──────────────────────────────────
  333 | 
  334 | test.describe('Scenarios — IQL', () => {
  335 |   test.beforeEach(async ({ page }) => {
  336 |     await injectTestSession(page);
  337 |     await page.goto('/scenarios');
  338 |     await page.waitForLoadState('networkidle');
  339 |   });
  340 | 
  341 |   test('IQL api-test tab loads with correct syntax', async ({ page }) => {
  342 |     await page.locator('.example-tab', { hasText: /API|TestQL/ }).click();
  343 |     await page.waitForTimeout(100);
  344 |     const code = await page.locator('.editor-textarea').inputValue();
  345 | 
  346 |     expect(code).toContain('API');
  347 |     expect(code).toContain('ASSERT_STATUS');
  348 |     expect(code).toContain('ASSERT_CONTAINS');
  349 |     expect(code).toContain('NAVIGATE');
  350 |   });
  351 | 
  352 |   test('IQL session recording tab loads', async ({ page }) => {
  353 |     await page.locator('.example-tab', { hasText: /Record|Nagrywanie/ }).click();
  354 |     await page.waitForTimeout(100);
  355 |     const code = await page.locator('.editor-textarea').inputValue();
```