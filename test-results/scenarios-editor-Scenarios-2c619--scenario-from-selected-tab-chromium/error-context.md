# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: scenarios-editor.spec.js >> Scenarios Editor - Advanced Tests >> Run uses active scenario from selected tab
- Location: e2e/scenarios-editor.spec.js:14:3

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation to "**/dashboard" until "load"
============================================================
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
    - textbox "you@company.com" [ref=e10]: test@test.com
    - button "Send Login Link" [ref=e11] [cursor=pointer]
  - generic [ref=e12]: Connection error
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | 
  3   | test.describe("Scenarios Editor - Advanced Tests", () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     // Login and navigate to scenarios
  6   |     await page.goto("/login");
  7   |     await page.fill('input[type="email"]', "test@test.com");
  8   |     await page.click('button[type="submit"]');
> 9   |     await page.waitForURL("**/dashboard");
      |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  10  |     await page.goto("/scenarios");
  11  |     await page.waitForLoadState("networkidle");
  12  |   });
  13  | 
  14  |   test("Run uses active scenario from selected tab", async ({ page }) => {
  15  |     // Switch to TestQL/API tab (non-default)
  16  |     await page.locator('button.example-tab:has-text("Test API")').click();
  17  |     await page.waitForTimeout(300);
  18  | 
  19  |     // Get the title before run
  20  |     const titleBeforeRun = await page.locator(".file-title").textContent();
  21  |     const badgeBeforeRun = await page.locator(".file-badge").textContent();
  22  | 
  23  |     // Verify we're on IQL scenario
  24  |     expect(badgeBeforeRun).toContain(".testql");
  25  |     expect(titleBeforeRun).toMatch(/Test API/);
  26  | 
  27  |     // Click Run
  28  |     await page.getByRole("button", { name: "▶ Run" }).click();
  29  | 
  30  |     // Wait for terminal output
  31  |     await page.locator(".terminal-body").getByText("Result: PASS").waitFor({ timeout: 10000 });
  32  | 
  33  |     // Get terminal text
  34  |     const terminalText = await page.locator(".terminal-body").innerText();
  35  | 
  36  |     // Verify terminal shows the correct scenario type
  37  |     expect(terminalText).toContain("TestQL");
  38  |     // Should NOT show the default pump scenario
  39  |     expect(terminalText).not.toMatch(/Pump Flow Test/);
  40  |   });
  41  | 
  42  |   test("Edited code survives tab switch", async ({ page }) => {
  43  |     // Switch to Diagnostics tab
  44  |     await page.locator('button.example-tab:has-text("Diagnostyka")').click();
  45  |     await page.waitForTimeout(300);
  46  | 
  47  |     // Add custom comment to editor
  48  |     const textarea = page.locator("textarea.editor-textarea");
  49  |     await textarea.press("End");
  50  |     await textarea.type("\n# CUSTOM_TEST_MARKER_12345");
  51  | 
  52  |     // Verify comment was added
  53  |     const editedValue = await textarea.inputValue();
  54  |     expect(editedValue).toContain("# CUSTOM_TEST_MARKER_12345");
  55  | 
  56  |     // Switch to another tab (Pump Test)
  57  |     await page.locator('button.example-tab:has-text("Test Pompy")').click();
  58  |     await page.waitForTimeout(300);
  59  | 
  60  |     // Switch back to Diagnostics
  61  |     await page.locator('button.example-tab:has-text("Diagnostyka")').click();
  62  |     await page.waitForTimeout(300);
  63  | 
  64  |     // Verify the custom comment is still there
  65  |     const afterSwitchBack = await textarea.inputValue();
  66  |     expect(afterSwitchBack).toContain("# CUSTOM_TEST_MARKER_12345");
  67  |   });
  68  | 
  69  |   test("Run uses edited code content", async ({ page }) => {
  70  |     // Switch to Pump Test (default)
  71  |     await page.locator('button.example-tab:has-text("Test Pompy")').click();
  72  |     await page.waitForTimeout(300);
  73  | 
  74  |     // Modify the code
  75  |     const textarea = page.locator("textarea.editor-textarea");
  76  |     await textarea.fill(`SCENARIO: "Modified Test"
  77  | DEVICE_MODEL: "Test Device"
  78  | GOAL: Custom goal
  79  |   SET 'test' 'value'
  80  |   WAIT 1000ms`);
  81  | 
  82  |     // Click Run
  83  |     await page.getByRole("button", { name: "▶ Run" }).click();
  84  | 
  85  |     // Wait for terminal
  86  |     await page.locator(".terminal-body").getByText("Result: PASS").waitFor({ timeout: 10000 });
  87  | 
  88  |     // Get terminal text
  89  |     const terminalText = await page.locator(".terminal-body").innerText();
  90  | 
  91  |     // Verify terminal reflects the edited content
  92  |     expect(terminalText).toContain("Modified Test");
  93  |     expect(terminalText).toContain("Test Device");
  94  |   });
  95  | 
  96  |   test("Switching tabs preserves each scenario's code", async ({ page }) => {
  97  |     const textarea = page.locator("textarea.editor-textarea");
  98  | 
  99  |     // Edit Pump Test
  100 |     await page.locator('button.example-tab:has-text("Test Pompy")').click();
  101 |     await page.waitForTimeout(200);
  102 |     await textarea.press("End");
  103 |     await textarea.type("\n# PUMP_EDIT");
  104 | 
  105 |     // Edit Diagnostics
  106 |     await page.locator('button.example-tab:has-text("Diagnostyka")').click();
  107 |     await page.waitForTimeout(200);
  108 |     await textarea.press("End");
  109 |     await textarea.type("\n# DIAG_EDIT");
```