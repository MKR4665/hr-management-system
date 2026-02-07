import { test, expect } from '@playwright/test';

test('login page has sign in heading', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
});
