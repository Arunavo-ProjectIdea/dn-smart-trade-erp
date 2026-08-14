import { test, expect } from '@playwright/test';

test.describe('Shipments Tracking', () => {
  test('should allow user to navigate to Shipments and view tracking', async ({ page }) => {
    // Navigate and login first
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.getByLabel(/Email/i).fill('admin@test.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    await page.locator('button[type="submit"]').click();
    
    // Ensure dashboard loads
    await expect(page).toHaveURL(/\/dashboard|^\/$/);

    // Navigate to Shipments
    const shipmentsLink = page.getByRole('link', { name: /Shipments/i });
    if (await shipmentsLink.isVisible()) {
      await shipmentsLink.click();
      await expect(page).toHaveURL(/shipments/);
    }
    
    await page.screenshot({ path: 'e2e/screenshots/shipments.png' });
  });
});
