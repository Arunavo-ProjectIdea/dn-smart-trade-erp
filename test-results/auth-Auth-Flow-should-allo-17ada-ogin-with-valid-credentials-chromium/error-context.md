# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Auth Flow >> should allow user to login with valid credentials
- Location: e2e\auth.spec.ts:4:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /\/dashboard|^\/$/
Received string:  "http://localhost:3000/login"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × locator resolved to <html lang="en" class="light">…</html>
       - unexpected value "http://localhost:3000/login"

```

```yaml
- img "DN Smart Trade ERP Logo"
- heading "DN Smart Trade" [level=1]
- paragraph: Sign in to DN Smart Trade Enterprise ERP
- text: An unexpected error occurred
- textbox "Email or Username":
  - /placeholder: " "
  - text: admin@test.com
- text: Email or Username
- textbox "Password":
  - /placeholder: " "
  - text: Password123!
- text: Password
- button "Show password"
- checkbox "Remember me"
- text: Remember me
- link "Forgot password?":
  - /url: /forgot-password
- button "Sign In"
- img "Global Logistics Container Terminal"
- text: System Operational
- heading "Powering Global Trade" [level=3]
- paragraph: Streamline your import-export operations with our AI-driven enterprise logistics platform.
- region "Notifications alt+T"
- alert
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
> 18 |     await expect(page).toHaveURL(/\/dashboard|^\/$/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  19 |     
  20 |     // Take a screenshot of the logged in state
  21 |     await page.screenshot({ path: 'e2e/screenshots/login-success.png' });
  22 |   });
  23 | 
  24 |   test('should show error with invalid credentials', async ({ page }) => {
  25 |     // Navigate to login page
  26 |     await page.goto('/login');
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