import { test, expect } from "@playwright/test";

test.describe("Scenarios Editor - Advanced Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to scenarios
    await page.goto("/login");
    await page.fill('input[type="email"]', "test@test.com");
    await page.click('button[type="submit"]');
    await page.waitForURL("**/dashboard");
    await page.goto("/scenarios");
    await page.waitForLoadState("networkidle");
  });

  test("Run uses active scenario from selected tab", async ({ page }) => {
    // Switch to TestQL/API tab (non-default)
    await page.getByRole("button", { name: /Test API|TestQL/ }).click();
    await page.waitForTimeout(200);

    // Get the title before run
    const titleBeforeRun = await page.locator(".file-title").textContent();
    const badgeBeforeRun = await page.locator(".file-badge").textContent();

    // Verify we're on IQL scenario
    expect(badgeBeforeRun).toContain(".iql");
    expect(titleBeforeRun).toContain("Test API");

    // Click Run
    await page.getByRole("button", { name: "▶ Run" }).click();

    // Wait for terminal output
    await page.locator(".terminal-body").getByText("Result: PASS").waitFor({ timeout: 10000 });

    // Get terminal text
    const terminalText = await page.locator(".terminal-body").innerText();

    // Verify terminal shows the correct scenario type
    expect(terminalText).toContain("TestQL");
    // Should NOT show the default pump scenario
    expect(terminalText).not.toContain("Pump Flow Test");
  });

  test("Edited code survives tab switch", async ({ page }) => {
    // Switch to Diagnostics tab
    await page.getByRole("button", { name: /Diagnostyka|Diagnostics/ }).click();
    await page.waitForTimeout(200);

    // Add custom comment to editor
    const textarea = page.locator("textarea.editor-textarea");
    await textarea.press("End");
    await textarea.type("\n# CUSTOM_TEST_MARKER_12345");

    // Verify comment was added
    const editedValue = await textarea.inputValue();
    expect(editedValue).toContain("# CUSTOM_TEST_MARKER_12345");

    // Switch to another tab (Pump Test)
    await page.getByRole("button", { name: /Test Pompy|Pump Test/ }).click();
    await page.waitForTimeout(200);

    // Switch back to Diagnostics
    await page.getByRole("button", { name: /Diagnostyka|Diagnostics/ }).click();
    await page.waitForTimeout(200);

    // Verify the custom comment is still there
    const afterSwitchBack = await textarea.inputValue();
    expect(afterSwitchBack).toContain("# CUSTOM_TEST_MARKER_12345");
  });

  test("Run uses edited code content", async ({ page }) => {
    // Switch to Pump Test (default)
    await page.getByRole("button", { name: /Test Pompy|Pump Test/ }).click();
    await page.waitForTimeout(200);

    // Modify the code
    const textarea = page.locator("textarea.editor-textarea");
    await textarea.fill(`SCENARIO: "Modified Test"
DEVICE_MODEL: "Test Device"
GOAL: Custom goal
  SET 'test' 'value'
  WAIT 1000ms`);

    // Click Run
    await page.getByRole("button", { name: "▶ Run" }).click();

    // Wait for terminal
    await page.locator(".terminal-body").getByText("Result: PASS").waitFor({ timeout: 10000 });

    // Get terminal text
    const terminalText = await page.locator(".terminal-body").innerText();

    // Verify terminal reflects the edited content
    expect(terminalText).toContain("Modified Test");
    expect(terminalText).toContain("Test Device");
  });

  test("Switching tabs preserves each scenario's code", async ({ page }) => {
    const textarea = page.locator("textarea.editor-textarea");

    // Edit Pump Test
    await page.getByRole("button", { name: /Test Pompy|Pump Test/ }).click();
    await page.waitForTimeout(100);
    await textarea.press("End");
    await textarea.type("\n# PUMP_EDIT");

    // Edit Diagnostics
    await page.getByRole("button", { name: /Diagnostyka|Diagnostics/ }).click();
    await page.waitForTimeout(100);
    await textarea.press("End");
    await textarea.type("\n# DIAG_EDIT");

    // Edit API Test
    await page.getByRole("button", { name: /Test API|TestQL/ }).click();
    await page.waitForTimeout(100);
    await textarea.press("End");
    await textarea.type("\n# API_EDIT");

    // Verify each scenario preserves its edit
    await page.getByRole("button", { name: /Test Pompy|Pump Test/ }).click();
    await page.waitForTimeout(100);
    let content = await textarea.inputValue();
    expect(content).toContain("# PUMP_EDIT");
    expect(content).not.toContain("# DIAG_EDIT");

    await page.getByRole("button", { name: /Diagnostyka|Diagnostics/ }).click();
    await page.waitForTimeout(100);
    content = await textarea.inputValue();
    expect(content).toContain("# DIAG_EDIT");
    expect(content).not.toContain("# PUMP_EDIT");

    await page.getByRole("button", { name: /Test API|TestQL/ }).click();
    await page.waitForTimeout(100);
    content = await textarea.inputValue();
    expect(content).toContain("# API_EDIT");
  });
});
