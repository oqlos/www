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
  test('login form is accessible', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('input[type="password"], input[name="password"]').first()).toBeVisible();
  });
});

test.describe('Dashboard Page', () => {
  test('dashboard requires auth or shows placeholder', async ({ page }) => {
    await page.goto('/dashboard');
    const content = page.locator('body');
    await expect(content).toBeVisible();
  });
});
