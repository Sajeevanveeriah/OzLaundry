import { test, expect } from '@playwright/test';

test.describe('OzLaundry Smoke Tests', () => {
  test('should load home page and navigate to learn more', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Check that home page loads
    await expect(page.locator('h1')).toContainText('Premium Laundry Service');

    // Click learn more button
    await page.getByRole('button', { name: /learn more/i }).click();

    // Verify we're on the learn more page
    await expect(page).toHaveURL(/\/learn-more/);
    await expect(page.locator('h1')).toContainText('Everything You Need to Know');
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Click pricing link in navigation
    await page.getByRole('link', { name: /pricing/i }).click();

    // Verify we're on the pricing page
    await expect(page).toHaveURL(/\/pricing/);
    await expect(page.locator('h1')).toContainText('Simple, Transparent Pricing');
  });

  test('should navigate to get started (login)', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Click get started button
    await page.getByRole('button', { name: /get started/i }).click();

    // Verify we're on the login page
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should register a new user and create an order', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    // Fill in registration form
    const timestamp = Date.now();
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email/i).fill(`test${timestamp}@demo.local`);
    await page.getByLabel(/password/i).fill('TestPass123!');

    // Submit form
    await page.getByRole('button', { name: /create account/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome');

    // Create a new order
    await page.getByRole('button', { name: /schedule new pickup/i }).click();

    // Fill in order form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    await page.getByLabel(/pickup date/i).fill(dateStr);
    await page.getByLabel(/pickup time/i).fill('10:00');
    await page.getByPlaceholder(/delicate items/i).fill('Handle with care');

    // Submit order
    await page.getByRole('button', { name: /create order/i }).click();

    // Verify order appears in list
    await expect(page.locator('text=Order #')).toBeVisible();
    await expect(page.locator('text=Scheduled')).toBeVisible();
  });

  test('should login as customer and view orders', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    // Fill in login form with demo credentials
    await page.getByLabel(/email/i).fill('user@ozlaundry.local');
    await page.getByLabel(/password/i).fill('Customer123!');

    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('should login as admin and update order stage', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    // Login as admin
    await page.getByLabel(/email/i).fill('admin@ozlaundry.local');
    await page.getByLabel(/password/i).fill('Admin123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Navigate to admin orders
    await page.getByRole('link', { name: /admin orders/i }).click();
    await expect(page).toHaveURL(/\/admin\/orders/);

    // Find the first order and update its stage
    const stageSelect = page.locator('select').first();
    await stageSelect.selectOption('Washing');

    // Wait for update (demo mode shows alert)
    // In real mode, the order would be updated via API
    await page.waitForTimeout(500);
  });

  test('should login as admin and toggle feature flag', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    // Login as admin
    await page.getByLabel(/email/i).fill('admin@ozlaundry.local');
    await page.getByLabel(/password/i).fill('Admin123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Navigate to admin features
    await page.getByRole('link', { name: /features/i }).click();
    await expect(page).toHaveURL(/\/admin\/features/);

    // Toggle a feature flag
    const firstToggle = page.locator('input[type="checkbox"]').first();
    const initialState = await firstToggle.isChecked();
    await firstToggle.click();

    // Verify toggle changed
    await expect(firstToggle).toHaveAttribute('checked', initialState ? null : '');
  });

  test('should view order detail with QR code', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    // Login as customer
    await page.getByLabel(/email/i).fill('user@ozlaundry.local');
    await page.getByLabel(/password/i).fill('Customer123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Click on the first order
    await page.locator('text=Order #').first().click();

    // Verify order detail page shows
    await expect(page).toHaveURL(/\/orders\//);
    await expect(page.locator('h1')).toContainText('Order #');

    // Verify QR code is visible
    await expect(page.locator('img[alt*="QR"]')).toBeVisible();

    // Verify status timeline is visible
    await expect(page.locator('text=Order Status Timeline')).toBeVisible();
  });

  test('should handle navigation correctly (SPA routing)', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Navigate through several pages
    await page.getByRole('link', { name: /learn more/i }).click();
    await expect(page).toHaveURL(/\/learn-more/);

    await page.getByRole('link', { name: /pricing/i }).click();
    await expect(page).toHaveURL(/\/pricing/);

    await page.getByRole('link', { name: /home/i }).click();
    await expect(page).toHaveURL('http://localhost:5173/');

    // Test browser back button
    await page.goBack();
    await expect(page).toHaveURL(/\/pricing/);

    await page.goBack();
    await expect(page).toHaveURL(/\/learn-more/);
  });

  test('should show demo mode banner', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    // Verify demo mode banner is visible
    await expect(page.locator('text=Demo Mode')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('http://localhost:5173/login');

    // Login first
    await page.getByLabel(/email/i).fill('user@ozlaundry.local');
    await page.getByLabel(/password/i).fill('Customer123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Verify logged in
    await expect(page.locator('text=user@ozlaundry.local')).toBeVisible();

    // Logout
    await page.getByRole('button', { name: /logout/i }).click();

    // Verify redirected to home
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});
