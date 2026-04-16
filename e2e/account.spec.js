import { test, expect } from '@playwright/test';

test.describe('Account Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('http://oqlos.localhost/login?plan=pro');
    await page.waitForURL('http://oqlos.localhost/billing');
  });

  test('account page loads and displays user information', async ({ page }) => {
    await page.goto('http://oqlos.localhost/account');
    
    // Check page title
    await expect(page.locator('h2')).toContainText('Account Settings');
    
    // Check profile section
    await expect(page.locator('.account-section h3').first()).toContainText('Profile Information');
    
    // Check form fields (by placeholder/text)
    await expect(page.locator('.account-form input').first()).toBeVisible();
  });

  test('subscription section displays current plan', async ({ page }) => {
    await page.goto('http://oqlos.localhost/account');
    
    // Check subscription section
    await expect(page.locator('.account-section h3').nth(1)).toContainText('Subscription');
    
    // Check plan badge
    await expect(page.locator('.plan-badge')).toBeVisible();
  });

  test('payment history section is visible', async ({ page }) => {
    await page.goto('http://oqlos.localhost/account');
    
    // Check payment history section
    await expect(page.locator('.account-section h3').nth(2)).toContainText('Payment History');
    
    // Check payment table
    await expect(page.locator('.payment-table')).toBeVisible();
  });

  test('can navigate to account from nav', async ({ page }) => {
    await page.goto('http://oqlos.localhost/dashboard');
    
    // Click account link in nav
    await page.click('a[href="/account"]');
    
    // Should be on account page
    await expect(page).toHaveURL('http://oqlos.localhost/account');
    await expect(page.locator('h2')).toContainText('Account Settings');
  });

  test('profile update button works', async ({ page }) => {
    await page.goto('http://oqlos.localhost/account');
    
    // Fill in form (use first input)
    await page.fill('.account-form input:first-of-type', 'Test User Updated');
    
    // Click save button
    await page.click('.account-form button[type="submit"]');
    
    // Should show success message
    await expect(page.locator('.auth-msg.success')).toBeVisible();
  });

  test('danger zone section is visible', async ({ page }) => {
    await page.goto('http://oqlos.localhost/account');
    
    // Check danger zone section
    await expect(page.locator('.danger-zone')).toBeVisible();
    await expect(page.locator('.danger-zone h3')).toContainText('Danger Zone');
    
    // Check logout button
    await expect(page.locator('.btn-danger')).toBeVisible();
  });
});
