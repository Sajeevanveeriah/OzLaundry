import { test, expect } from '@playwright/test';

test('smoke flow', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn more' }).click();
  await expect(page).toHaveURL(/learn-more/);
  await page.goto('/');
  await page.getByRole('button', { name: 'Get started' }).click();
  await expect(page).toHaveURL(/login/);
  await page.getByRole('link', { name: 'Register' }).click();
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL(/dashboard/);
  await page.getByRole('button', { name: 'Create Order' }).click();
});
