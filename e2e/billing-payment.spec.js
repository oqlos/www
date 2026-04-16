import { test, expect } from '@playwright/test';

test.describe('Billing Payment Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('http://oqlos.localhost/login?plan=pro');
    // ?plan=pro redirects to billing, not dashboard
    await page.waitForURL('http://oqlos.localhost/billing');
  });

  test('subscribe button redirects to checkout URL', async ({ page }) => {
    await page.goto('http://oqlos.localhost/billing');
    
    // Click "Rozpocznij trial" button on Pro card
    const subscribeButton = page.locator('.price-card.featured .btn-primary', { hasText: 'Rozpocznij trial' });
    await expect(subscribeButton).toBeVisible();
    
    // Click the button
    await subscribeButton.click();
    
    // Wait for navigation to checkout or back to billing with session
    await page.waitForTimeout(500);
    
    // Check if we're on billing page with session parameter (mock checkout)
    const url = page.url();
    expect(url).toContain('session=');
    expect(url).toContain('billing');
    
    // Check for success message
    await expect(page.locator('.auth-msg.success')).toBeVisible();
    await expect(page.locator('.auth-msg.success')).toContainText('Payment successful');
  });

  test('enterprise contact button works', async ({ page }) => {
    await page.goto('http://oqlos.localhost/billing');
    
    // Click "Kontakt" button on Enterprise card
    const contactButton = page.locator('.price-card').filter({ hasText: 'Enterprise' }).locator('.btn-outline', { hasText: 'Kontakt' });
    await expect(contactButton).toBeVisible();
    
    // Click the button (should trigger onSubscribe with enterprise plan)
    await contactButton.click();
    
    // For enterprise, it should navigate to login if not authenticated, or show contact form
    // In mock mode, it will redirect to billing with session
    await page.waitForTimeout(500);
    const url = page.url();
    expect(url).toContain('session=');
  });

  test('free plan download button works', async ({ page }) => {
    await page.goto('http://oqlos.localhost/billing');
    
    // Click "Pobierz z GitHub" button on Free card
    const downloadButton = page.locator('.price-card').filter({ hasText: 'Free' }).locator('.btn-outline', { hasText: 'Pobierz z GitHub' });
    await expect(downloadButton).toBeVisible();
    
    // This button doesn't have onSubscribe handler, so it should not redirect
    await downloadButton.click();
    
    // URL should not change (button has no handler)
    await page.waitForTimeout(500);
    const url = page.url();
    expect(url).toBe('http://oqlos.localhost/billing');
  });
});
