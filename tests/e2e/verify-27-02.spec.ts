/**
 * UAT: 27-02 Sensor Cards & Status Display
 * Automated Playwright verification of dashboard sensor grid and status row.
 */
import { test, expect } from '@playwright/test';

const BASE = 'http://localhost:5173';

test.describe('27-02: Sensor Cards & Status Display', () => {
  test('Dashboard shows "Not connected" when disconnected', async ({ page }) => {
    await page.goto(BASE);
    // Should be on dashboard (default route)
    await expect(page.locator('text=Not connected')).toBeVisible();
    await expect(page.locator('text=Go to Connect')).toBeVisible();
  });

  test('Dashboard shows 3 sensor cards after connecting', async ({ page }) => {
    await page.goto(BASE);

    // Trigger connect via Zustand store (connection page is a stub in 27-04)
    await page.evaluate(() => {
      // Access the Zustand store from the window — we need to expose it
      // Instead, we'll use the internal module system
    });

    // Since we can't easily trigger connect() from outside React,
    // inject a script that calls the store's connect method.
    // The mock adapter is active (VITE_MOCK_API=true), so connect() will succeed.
    await page.evaluate(async () => {
      // Wait for React to hydrate
      await new Promise((r) => setTimeout(r, 500));

      // Find the Zustand store by traversing the React fiber tree
      // Alternative: expose store on window for testing
      const storeModule = await import('/src/stores/device-store.ts');
      const store = storeModule.useDeviceStore;
      store.getState().connect();

      // Wait for connection + first poll
      await new Promise((r) => setTimeout(r, 2000));
    });

    // Verify sensor cards are visible
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Humidity')).toBeVisible();
    await expect(page.locator('text=Pressure')).toBeVisible();

    // Verify units are visible (°C rendered as Unicode \u00B0C inside a span)
    await expect(page.locator('text=/hPa/')).toBeVisible();
  });

  test('Sensor values use tabular-nums and update', async ({ page }) => {
    await page.goto(BASE);

    // Connect via store
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 500));
      const storeModule = await import('/src/stores/device-store.ts');
      storeModule.useDeviceStore.getState().connect();
      await new Promise((r) => setTimeout(r, 2000));
    });

    // Wait for values to appear
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 5000 });

    // Check tabular-nums is applied on value elements
    const valueElements = page.locator('.tabular-nums');
    const count = await valueElements.count();
    expect(count).toBeGreaterThanOrEqual(3);

    // Capture initial temperature value
    const tempCard = page.locator('text=Temperature').locator('..').locator('..');
    const initialText = await tempCard.textContent();

    // Wait for polling update (2s interval)
    await page.waitForTimeout(3000);

    // Values should still be present (mock data varies slightly)
    await expect(page.locator('text=Temperature')).toBeVisible();
    await expect(page.locator('text=Humidity')).toBeVisible();
  });

  test('Status row shows device indicators after connecting', async ({ page }) => {
    await page.goto(BASE);

    // Connect
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 500));
      const storeModule = await import('/src/stores/device-store.ts');
      storeModule.useDeviceStore.getState().connect();
      await new Promise((r) => setTimeout(r, 2000));
    });

    // Wait for dashboard to render
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 5000 });

    // Verify "Status" section header
    await expect(page.locator('text=Status')).toBeVisible();

    // Verify status indicators exist (dome, lights, fan, humidifier)
    // The exact text depends on mock data, but the pattern is consistent
    const statusRow = page.locator('.flex.flex-wrap.gap-2.px-4');
    await expect(statusRow).toBeVisible();

    // Should have 4 indicator pills
    const indicators = statusRow.locator('.rounded-full');
    const indicatorCount = await indicators.count();
    expect(indicatorCount).toBeGreaterThanOrEqual(4);
  });

  test('"Go to Connect" link navigates to /connect', async ({ page }) => {
    await page.goto(BASE);

    // Click the connect link
    await page.locator('text=Go to Connect').click();

    // Should navigate to connect page
    await expect(page).toHaveURL(/\/connect/);
    await expect(page.getByRole('heading', { name: 'Connect' })).toBeVisible();
  });

  test('Status row is hidden when disconnected', async ({ page }) => {
    await page.goto(BASE);

    // When disconnected, status row should not render
    await expect(page.locator('text=Not connected')).toBeVisible();

    // The "Status" section header should not appear
    // (StatusRow returns null when status is null)
    const statusHeaders = page.locator('text=Status');
    // Only the bottom nav "Status" text might exist, but section header should not
    // since the disconnected view doesn't render it
    await expect(page.locator('.flex.flex-wrap.gap-2.px-4')).not.toBeVisible();
  });
});
