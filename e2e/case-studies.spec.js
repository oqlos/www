import { test, expect } from "@playwright/test";
import { setupAuth } from "./helpers/test-helpers";

test.describe("Case Studies Page", () => {
  test.beforeEach(async ({ page }) => {
    await setupAuth(page);
  });

  test("case studies page loads with content", async ({ page }) => {
    await page.goto("/case-studies");
    await page.waitForLoadState("networkidle");

    // Check title
    await expect(page.locator("h2")).toBeVisible();

    // Check case study cards are visible
    await expect(page.locator("text=MediTest").first()).toBeVisible();
    await expect(page.locator("text=PumpControl").first()).toBeVisible();
    await expect(page.locator("text=QA Digital").first()).toBeVisible();

    // Check results section exists
    await expect(page.locator("text=-60%").first()).toBeVisible();
    await expect(page.locator("text=70%").first()).toBeVisible();
  });

  test("case studies has working CTAs", async ({ page }) => {
    await page.goto("/case-studies");
    await page.waitForLoadState("networkidle");

    // Check demo CTA link
    const demoLink = page.locator('a[href="/demo"]');
    await expect(demoLink).toBeVisible();

    // Check ROI link
    const roiLink = page.locator('a[href="/roi"]');
    await expect(roiLink).toBeVisible();
  });
});
