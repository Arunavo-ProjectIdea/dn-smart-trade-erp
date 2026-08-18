# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth Flow >> should show error with invalid credentials
- Location: e2e\auth.spec.ts:24:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Auth Flow', () => {
  4  |   test('should allow user to login with valid credentials', async ({ page }) => {
  5  |     // Navigate to login page
  6  |     await page.goto('/login');
  7  |     await page.waitForLoadState('networkidle');
  8  |     
  9  |     // Fill credentials
  10 |     await page.getByLabel(/Email/i).fill('admin@test.com');
  11 |     await page.getByLabel('Password', { exact: true }).fill('Password123!');
  12 |     
  13 |     // Submit
  14 |     await page.waitForTimeout(1000);
  15 |     await page.locator('button[type="submit"]').click();
  16 |     
  17 |     // Verify successful login by checking URL or dashboard element
  18 |     await expect(page).toHaveURL(/\/dashboard|^\/$/);
  19 |     
  20 |     // Take a screenshot of the logged in state
  21 |     await page.screenshot({ path: 'e2e/screenshots/login-success.png' });
  22 |   });
  23 | 
  24 |   test('should show error with invalid credentials', async ({ page }) => {
  25 |     // Navigate to login page
> 26 |     await page.goto('/login');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  27 |     await page.waitForLoadState('networkidle');
  28 |     
  29 |     // Fill bad credentials
  30 |     await page.getByLabel(/Email/i).fill('invalid@test.com');
  31 |     await page.getByLabel('Password', { exact: true }).fill('WrongPassword');
  32 |     
  33 |     // Submit
  34 |     await page.waitForTimeout(1000);
  35 |     await page.locator('button[type="submit"]').click();
  36 |     
  37 |     // Verify error message is displayed
  38 |     const errorMessage = page.locator('text=Invalid login credentials').or(page.locator('text=Invalid Email or Password'));
  39 |     await expect(errorMessage).toBeVisible({ timeout: 10000 });
  40 |   });
  41 | });
  42 | 
```