# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shipments.spec.ts >> Shipments Tracking >> should allow user to navigate to Shipments and view tracking
- Location: e2e\shipments.spec.ts:4:7

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
  3  | test.describe('Shipments Tracking', () => {
  4  |   test('should allow user to navigate to Shipments and view tracking', async ({ page }) => {
  5  |     // Navigate and login first
> 6  |     await page.goto('/login');
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  7  |     await page.waitForLoadState('networkidle');
  8  |     await page.getByLabel(/Email/i).fill('admin@test.com');
  9  |     await page.getByLabel('Password', { exact: true }).fill('Password123!');
  10 |     await page.locator('button[type="submit"]').click();
  11 |     
  12 |     // Ensure dashboard loads
  13 |     await expect(page).toHaveURL(/\/dashboard|^\/$/);
  14 | 
  15 |     // Navigate to Shipments
  16 |     const shipmentsLink = page.getByRole('link', { name: /Shipments/i });
  17 |     if (await shipmentsLink.isVisible()) {
  18 |       await shipmentsLink.click();
  19 |       await expect(page).toHaveURL(/shipments/);
  20 |     }
  21 |     
  22 |     await page.screenshot({ path: 'e2e/screenshots/shipments.png' });
  23 |   });
  24 | });
  25 | 
```