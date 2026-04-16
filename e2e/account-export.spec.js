import { test, expect } from '@playwright/test';

test.describe('Account Data Export', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('http://oqlos.localhost/login?plan=pro');
    await page.waitForURL('http://oqlos.localhost/billing');
  });

  test('export data button is visible on account page', async ({ page }) => {
    await page.goto('http://oqlos.localhost/account');
    
    // Check for export button
    await expect(page.locator('.account-form button').filter({ hasText: 'Export Data' })).toBeVisible();
  });

  test('export button downloads JSON file', async ({ page, context }) => {
    await page.goto('http://oqlos.localhost/account');
    
    // Handle download
    const downloadPromise = page.waitForEvent('download');
    
    // Click export button
    await page.locator('.account-form button').filter({ hasText: 'Export Data' }).click();
    
    // Wait for download
    const download = await downloadPromise;
    
    // Verify file name
    expect(download.suggestedFilename()).toMatch(/oqlos-account-data-.*\.json$/);
    
    // Read file content
    const fileContent = await download.createReadStream();
    let content = '';
    for await (const chunk of fileContent) {
      content += chunk.toString();
    }
    
    // Verify JSON structure
    const data = JSON.parse(content);
    expect(data).toHaveProperty('profile');
    expect(data).toHaveProperty('subscription');
    expect(data).toHaveProperty('payments');
    expect(data).toHaveProperty('exported_at');
    expect(data).toHaveProperty('export_version');
    
    // Verify profile data
    expect(data.profile).toHaveProperty('email');
    expect(data.profile).toHaveProperty('id');
    
    // Verify subscription data
    expect(data.subscription).toHaveProperty('plan');
    expect(data.subscription).toHaveProperty('status');
  });

  test('export shows success message', async ({ page }) => {
    await page.goto('http://oqlos.localhost/account');
    
    // Click export button
    await page.locator('.account-form button').filter({ hasText: 'Export Data' }).click();
    
    // Wait for success message
    await expect(page.locator('.auth-msg.success')).toBeVisible();
    await expect(page.locator('.auth-msg.success')).toContainText('exported');
  });
});
