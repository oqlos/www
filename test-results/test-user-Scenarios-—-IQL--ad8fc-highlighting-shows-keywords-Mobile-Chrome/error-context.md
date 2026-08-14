# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: test-user.spec.js >> Scenarios — IQL >> IQL syntax highlighting shows keywords
- Location: e2e/test-user.spec.js:365:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.example-tab').filter({ hasText: /API|TestQL/ })

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
  356 | 
  357 |     // Tab shows IQL session recording commands
  358 |     expect(code).toContain('RECORD_START');
  359 |     expect(code).toContain('SELECT_DEVICE');
  360 |     expect(code).toContain('START_TEST');
  361 |     expect(code).toContain('STEP_COMPLETE');
  362 |     expect(code).toContain('RECORD_STOP');
  363 |   });
  364 | 
  365 |   test('IQL syntax highlighting shows keywords', async ({ page }) => {
> 366 |     await page.locator('.example-tab', { hasText: /API|TestQL/ }).click();
      |                                                                   ^ Error: locator.click: Test timeout of 30000ms exceeded.
  367 |     const html = await page.locator('.editor-highlight').innerHTML();
  368 | 
  369 |     expect(html).toContain('syn-keyword');
  370 |     expect(html).toContain('syn-string');
  371 |   });
  372 | 
  373 |   test('IQL editor supports custom test code', async ({ page }) => {
  374 |     await page.locator('.example-tab', { hasText: /API|TestQL/ }).click();
  375 |     const textarea = page.locator('.editor-textarea');
  376 | 
  377 |     const customIql = 'SET api_url "http://localhost:8101"\nAPI GET "${api_url}/api/health"\nASSERT_STATUS 200\nASSERT_JSON "status" "ok"';
  378 |     await textarea.fill(customIql);
  379 | 
  380 |     const value = await textarea.inputValue();
  381 |     expect(value).toContain('ASSERT_STATUS 200');
  382 |     expect(value).toContain('ASSERT_JSON');
  383 |   });
  384 | });
  385 | 
  386 | // ── 5. NLP Console — OQL + IQL generation ────────────────────────────────────
  387 | 
  388 | test.describe('NLP Console', () => {
  389 |   test.beforeEach(async ({ page }) => {
  390 |     await injectTestSession(page);
  391 |     await page.goto('/nlp');
  392 |     await page.waitForLoadState('networkidle');
  393 |   });
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
```