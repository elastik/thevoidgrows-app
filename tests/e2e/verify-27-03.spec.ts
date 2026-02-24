/**
 * UAT: 27-03 Light Mode Controls
 * Automated Playwright verification of light mode selector, optimistic UI,
 * auto-connect, and connection state rendering.
 */
import { test, expect } from '@playwright/test';

test.describe('27-03: Light Mode Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ── AutoConnect ──────────────────────────────────────────────────────

  test('AutoConnect fires on app load and dashboard renders', async ({ page }) => {
    // AutoConnect calls connect() on mount — with mock adapter it should succeed
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Humidity')).toBeVisible();
    await expect(page.locator('text=Pressure')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-autoconnect.png' });
  });

  // ── Light Mode Selector rendering ────────────────────────────────────

  test('Light Mode section shows 4 buttons with labels and descriptions', async ({ page }) => {
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });

    // "Light Mode" section header
    await expect(page.locator('text=Light Mode')).toBeVisible();

    // 4 mode buttons — use getByRole to target buttons specifically
    await expect(page.getByRole('button', { name: /Void Glow/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /UV Only/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Blue.*Blue spectrum/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Off.*Lights off/ })).toBeVisible();

    // Descriptions inside buttons
    await expect(page.locator('button >> text=UV + Blue cycle')).toBeVisible();
    await expect(page.locator('button >> text=Ultraviolet light')).toBeVisible();
    await expect(page.locator('button >> text=Blue spectrum')).toBeVisible();
    await expect(page.locator('button >> text=Lights off')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-light-modes.png' });
  });

  test('Default mode is Void Glow (active state)', async ({ page }) => {
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });

    // MockAdapter default lightMode is 'void_glow'
    // Active button should have ring-1 class (ring indicator)
    const voidGlowBtn = page.getByRole('button', { name: /Void Glow/ });
    await expect(voidGlowBtn).toBeVisible();
    const classes = await voidGlowBtn.getAttribute('class');
    expect(classes).toContain('ring-1');

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-default-mode.png' });
  });

  // ── Optimistic mode switching ────────────────────────────────────────

  test('Clicking UV Only switches active state', async ({ page }) => {
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });

    const uvOnlyBtn = page.getByRole('button', { name: /UV Only/ });
    await uvOnlyBtn.click();

    // Wait for optimistic update
    await page.waitForTimeout(500);

    // UV Only should now be active (has ring-1)
    const uvClasses = await uvOnlyBtn.getAttribute('class');
    expect(uvClasses).toContain('ring-1');

    // Void Glow should no longer be active
    const voidGlowBtn = page.getByRole('button', { name: /Void Glow/ });
    const vgClasses = await voidGlowBtn.getAttribute('class');
    expect(vgClasses).not.toContain('ring-1');

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-uv-only-active.png' });
  });

  test('Clicking Blue switches active state', async ({ page }) => {
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });

    // Use exact role matching — "Blue Blue spectrum" is the accessible name
    const blueBtn = page.getByRole('button', { name: /Blue.*Blue spectrum/ });
    await blueBtn.click();
    await page.waitForTimeout(500);

    const classes = await blueBtn.getAttribute('class');
    expect(classes).toContain('ring-1');

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-blue-active.png' });
  });

  test('Clicking Off switches active state', async ({ page }) => {
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });

    const offBtn = page.getByRole('button', { name: /Off.*Lights off/ });
    await offBtn.click();
    await page.waitForTimeout(500);

    const classes = await offBtn.getAttribute('class');
    expect(classes).toContain('ring-1');

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-off-active.png' });
  });

  test('Clicking already-active mode does nothing', async ({ page }) => {
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });

    // Void Glow is already active — clicking should not trigger pending
    const voidGlowBtn = page.getByRole('button', { name: /Void Glow/ });
    await voidGlowBtn.click();
    await page.waitForTimeout(200);

    // Should still be active, no animate-pulse (pending)
    const classes = await voidGlowBtn.getAttribute('class');
    expect(classes).toContain('ring-1');
    expect(classes).not.toContain('animate-pulse');
  });

  // ── Connection state UI ──────────────────────────────────────────────

  test('Connecting state shows skeleton with "Connecting to dome..."', async ({ page }) => {
    // Disconnect first, then set connecting state
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 500));
      const storeModule = await import('/src/stores/device-store.ts');
      const store = storeModule.useDeviceStore;
      store.getState().disconnect();
      store.setState({ connectionStatus: 'connecting' });
    });

    await expect(page.locator('text=Connecting to dome...')).toBeVisible({ timeout: 3000 });

    // Should show skeleton pulses
    const skeletons = page.locator('main .animate-pulse');
    const count = await skeletons.count();
    expect(count).toBeGreaterThanOrEqual(3);

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-connecting.png' });
  });

  test('Disconnected state shows "Not connected" with connect link', async ({ page }) => {
    // Disconnect to see disconnected UI
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 1000));
      const storeModule = await import('/src/stores/device-store.ts');
      storeModule.useDeviceStore.getState().disconnect();
    });

    await expect(page.locator('text=Not connected')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=Connect to your device to view sensor data.')).toBeVisible();
    await expect(page.locator('text=Go to Connect')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-disconnected.png' });
  });

  test('Error state shows error message with retry and connection settings', async ({ page }) => {
    // Set error state
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 500));
      const storeModule = await import('/src/stores/device-store.ts');
      const store = storeModule.useDeviceStore;
      store.getState().disconnect();
      store.setState({
        connectionStatus: 'error',
        error: 'Connection timed out',
      });
    });

    await expect(page.locator('text=Connection Error')).toBeVisible({ timeout: 3000 });
    // Scope to <main> to avoid matching the status bar
    await expect(page.locator('main >> text=Connection timed out')).toBeVisible();
    await expect(page.locator('text=Retry')).toBeVisible();
    await expect(page.locator('text=Connection Settings')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-error.png' });
  });

  test('Error state retry button triggers reconnection', async ({ page }) => {
    // Set error state
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 500));
      const storeModule = await import('/src/stores/device-store.ts');
      const store = storeModule.useDeviceStore;
      store.getState().disconnect();
      store.setState({
        connectionStatus: 'error',
        error: 'Connection timed out',
      });
    });

    await expect(page.locator('text=Connection Error')).toBeVisible({ timeout: 3000 });

    // Click retry
    await page.locator('text=Retry').click();

    // Should reconnect via mock adapter and show dashboard
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-retry-success.png' });
  });

  test('Connection Settings link navigates to /connect', async ({ page }) => {
    // Set error state
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 500));
      const storeModule = await import('/src/stores/device-store.ts');
      const store = storeModule.useDeviceStore;
      store.getState().disconnect();
      store.setState({
        connectionStatus: 'error',
        error: 'Connection timed out',
      });
    });

    await expect(page.locator('text=Connection Settings')).toBeVisible({ timeout: 3000 });
    await page.locator('text=Connection Settings').click();

    await expect(page).toHaveURL(/\/connect/);
  });

  // ── Light mode buttons hidden when disconnected ──────────────────────

  test('Light mode section is hidden when disconnected', async ({ page }) => {
    // Disconnect
    await page.evaluate(async () => {
      await new Promise((r) => setTimeout(r, 1000));
      const storeModule = await import('/src/stores/device-store.ts');
      storeModule.useDeviceStore.getState().disconnect();
    });

    // Disconnected view replaces the full dashboard — no light mode section
    await expect(page.locator('text=Not connected')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('text=Light Mode')).not.toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-no-lights-disconnected.png' });
  });

  // ── Mode switching persists across polling ───────────────────────────

  test('Mode change persists after polling cycle', async ({ page }) => {
    await expect(page.locator('text=Temperature')).toBeVisible({ timeout: 10000 });

    // Switch to Blue
    const blueBtn = page.getByRole('button', { name: /Blue.*Blue spectrum/ });
    await blueBtn.click();
    await page.waitForTimeout(500);

    // Verify Blue is active
    let classes = await blueBtn.getAttribute('class');
    expect(classes).toContain('ring-1');

    // Wait for a polling cycle (2s)
    await page.waitForTimeout(3000);

    // Blue should still be active after polling
    classes = await blueBtn.getAttribute('class');
    expect(classes).toContain('ring-1');

    await page.screenshot({ path: 'tests/e2e/results/screenshots/27-03-persist-mode.png' });
  });
});
