import { test, expect } from "@playwright/test";
import { setupAuth } from "./helpers/test-helpers";

test.describe("Demo Booking Page", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test("demo page loads with calendar UI", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    // Check title and content
    await expect(page.locator("h2")).toBeVisible();
    await expect(page.locator(".section-desc")).toBeVisible();

    // In mock mode: check for MockCalendar (day buttons or MOCK MODE banner)
    // In prod mode: iframe would be visible
    const hasMockCalendar = await page.locator('text=MOCK MODE, button:has-text("Pon"), button:has-text("Wt")').first().isVisible().catch(() => false);
    const hasIframe = await page.locator('iframe').first().isVisible().catch(() => false);
    
    expect(hasMockCalendar || hasIframe).toBe(true);

    // Check info cards exist
    await expect(page.locator('h4').first()).toBeVisible();
  });

  test("demo page has working contact link", async ({ page }) => {
    await page.goto("/demo");
    await page.waitForLoadState("networkidle");

    // Email link should be visible
    const emailLink = page.locator('a[href^="mailto:"]');
    await expect(emailLink).toBeVisible();
    
    // Check href contains email (may vary slightly based on i18n)
    const href = await emailLink.getAttribute("href");
    expect(href).toMatch(/mailto:.*@/);
  });
});
