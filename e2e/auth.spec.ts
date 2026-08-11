import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('should allow user to login with valid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Fill credentials
    await page.getByLabel(/Email/i).fill('admin@test.com');
    await page.getByLabel('Password', { exact: true }).fill('Password123!');
    
    // Submit
    await page.waitForTimeout(1000);
    await page.locator('button[type="submit"]').click();
    
    // Verify successful login by checking URL or dashboard element
    await expect(page).toHaveURL(/\/dashboard|^\/$/);
    
    // Take a screenshot of the logged in state
    await page.screenshot({ path: 'e2e/screenshots/login-success.png' });
  });

  test('should show error with invalid credentials', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Fill bad credentials
    await page.getByLabel(/Email/i).fill('invalid@test.com');
    await page.getByLabel('Password', { exact: true }).fill('WrongPassword');
    
    // Submit
    await page.waitForTimeout(1000);
    await page.locator('button[type="submit"]').click();
    
    // Verify error message is displayed
    const errorMessage = page.locator('text=Invalid login credentials').or(page.locator('text=Invalid Email or Password'));
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });
});
