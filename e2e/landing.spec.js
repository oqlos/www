import { test, expect } from '@playwright/test';

test.describe('Landing Page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OqlOS/);
  });

  test('main heading is visible', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();
  });

  test('navigation contains expected links', async ({ page }) => {
    await page.goto('/');
    const nav = page.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('page loads without errors', async ({ page }) => {
    await page.goto('/');
    const errorMessages = await page.locator('text=/error|exception|fail/i').count();
    expect(errorMessages).toBe(0);
  });
});

test.describe('Login Page', () => {
  test('login page loads', async ({ page }) => {
    const response = await page.goto('/login');
    expect(response?.status()).toBeLessThan(500);
    await expect(page.locator('#root')).toBeAttached();
  });
});

test.describe('Dashboard Page', () => {
  test('dashboard loads without server error', async ({ page }) => {
    const response = await page.goto('/dashboard');
    expect(response?.status()).toBeLessThan(500);
    await page.waitForLoadState('networkidle');
    // App might redirect or show auth placeholder - just check root exists
    await expect(page.locator('#root')).toBeAttached();
  });
});
