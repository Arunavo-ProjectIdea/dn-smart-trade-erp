# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: boe-journey.spec.ts >> BOE Journey >> should allow user to navigate to BOE section
- Location: e2e\boe-journey.spec.ts:4:7

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
  3  | test.describe('BOE Journey', () => {
  4  |   test('should allow user to navigate to BOE section', async ({ page }) => {
  5  |     // Navigate and login first
> 6  |     await page.goto('/login');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  7  |     await page.waitForLoadState('networkidle');
  8  |     await page.getByLabel(/Email/i).fill('admin@test.com');
  9  |     await page.getByLabel('Password', { exact: true }).fill('Password123!');
  10 |     await page.waitForTimeout(1000);
  11 |     await page.locator('button[type="submit"]').click();
  12 |     
  13 |     // Ensure dashboard loads
  14 |     await expect(page).toHaveURL(/\/dashboard|^\/$/);
  15 | 
  16 |     // Navigate to BOE
  17 |     // Wait for sidebar or nav item to appear, we assume there's a link to "Bill of Entry"
  18 |     const boeLink = page.getByRole('link', { name: 'BOE', exact: true }).first();
  19 |     if (await boeLink.isVisible()) {
  20 |       await boeLink.click();
  21 |       await expect(page).toHaveURL(/boe/);
  22 |       
  23 |       // Check for create button
  24 |       const createButton = page.getByRole('button', { name: /Create BOE|New Bill of Entry/i });
  25 |       if (await createButton.isVisible()) {
  26 |         await createButton.click();
  27 |         await expect(page).toHaveURL(/boe\/new/);
  28 |       }
  29 |     }
  30 |     
  31 |     await page.screenshot({ path: 'e2e/screenshots/boe-journey.png' });
  32 |   });
  33 | });
  34 | 
```