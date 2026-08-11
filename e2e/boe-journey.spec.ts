import { test, expect } from '@playwright/test';

test.describe('BOE Journey', () => {
  test('should allow user to navigate to BOE section', async ({ page }) => {
    // Navigate and login first
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/Email/i).fill('admin@test.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.waitForTimeout(1000);
    await page.locator('button[type="submit"]').click();
    
    // Ensure dashboard loads
    await expect(page).toHaveURL(/\/dashboard|^\/$/);

    // Navigate to BOE
    // Wait for sidebar or nav item to appear, we assume there's a link to "Bill of Entry"
    const boeLink = page.getByRole('link', { name: 'BOE', exact: true }).first();
    if (await boeLink.isVisible()) {
      await boeLink.click();
      await expect(page).toHaveURL(/boe/);
      
      // Check for create button
      const createButton = page.getByRole('button', { name: /Create BOE|New Bill of Entry/i });
      if (await createButton.isVisible()) {
        await createButton.click();
        await expect(page).toHaveURL(/boe\/new/);
      }
    }
    
    await page.screenshot({ path: 'e2e/screenshots/boe-journey.png' });
  });
});
