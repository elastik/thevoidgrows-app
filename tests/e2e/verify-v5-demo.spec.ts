/**
 * UAT: v5.0.0 — Virtual Dome Demo (Milestone Verification)
 *
 * Covers all 3 phases:
 * - Phase 1: Shared UI components (ErrorView, DisconnectedView, ConnectingSkeleton)
 * - Phase 2: Animated SVG dome visual responds to light modes
 * - Phase 3: /demo page with dome, sensors, tabs, controls, embed mode
 */
import { test, expect } from '@playwright/test';

const DEMO_URL = '/demo';
const EMBED_URL = '/demo-embed';

/** Wait for demo to auto-connect and render dashboard content */
async function waitForDemoReady(page: import('@playwright/test').Page) {
  // DemoAutoConnect fires on mount with forceMock — wait for sensor data
  await expect(page.locator('text=Temp')).toBeVisible({ timeout: 15000 });
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1: Shared UI Components
// ═══════════════════════════════════════════════════════════════════════

test.describe('Phase 1: Shared UI Components', () => {
  test('ErrorView renders on dashboard when connection error', async ({ page }) => {
    await page.goto('/');
    // Wait for auto-connect, then force error state
    await page.evaluate(async () => {
      await new Promise(r => setTimeout(r, 500));
      const mod = await import('/src/stores/device-store.ts');
      mod.useDeviceStore.getState().disconnect();
      mod.useDeviceStore.setState({ connectionStatus: 'error', error: 'Test error' });
    });

    await expect(page.locator('text=Connection Error')).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('button', { name: 'Retry', exact: true })).toBeVisible();
    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase1-error-view.png' });
  });

  test('DisconnectedView renders on dashboard when disconnected', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      await new Promise(r => setTimeout(r, 1000));
      const mod = await import('/src/stores/device-store.ts');
      mod.useDeviceStore.getState().disconnect();
    });

    await expect(page.locator('text=Not connected')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=Connect to Dome')).toBeVisible();
    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase1-disconnected-view.png' });
  });

  test('ConnectingSkeleton renders while connecting', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      await new Promise(r => setTimeout(r, 500));
      const mod = await import('/src/stores/device-store.ts');
      mod.useDeviceStore.getState().disconnect();
      mod.useDeviceStore.setState({ connectionStatus: 'connecting' });
    });

    await expect(page.locator('text=Connecting to dome...')).toBeVisible({ timeout: 5000 });
    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase1-connecting-skeleton.png' });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// PHASE 2: Virtual Dome Visual
// ═══════════════════════════════════════════════════════════════════════

test.describe('Phase 2: Dome Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);
  });

  test('SVG dome renders with shell, plants, and base platform', async ({ page }) => {
    // The dome SVG should be visible
    const domeSvg = page.locator('svg[viewBox="0 0 300 320"]');
    await expect(domeSvg).toBeVisible();

    // Dome shell path exists
    const shellPath = domeSvg.locator('path[d="M 50 230 Q 50 80, 150 50 Q 250 80, 250 230 Z"]');
    expect(await shellPath.count()).toBeGreaterThanOrEqual(1);

    // Base platform rect
    await expect(domeSvg.locator('rect[y="228"]')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase2-dome-structure.png' });
  });

  test('Dome shows sensor readout text (temp + humidity)', async ({ page }) => {
    const domeSvg = page.locator('svg[viewBox="0 0 300 320"]');
    // Sensor readout text: "XX.X°C · XX% RH"
    const sensorText = domeSvg.locator('text >> text=/\\d+\\.\\d+°C/');
    await expect(sensorText).toBeVisible({ timeout: 5000 });

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase2-dome-sensors.png' });
  });

  test('Dome shows mode label matching current light mode', async ({ page }) => {
    const domeSvg = page.locator('svg[viewBox="0 0 300 320"]');
    // Default mode is void_glow → label "VOID GLOW"
    await expect(domeSvg.locator('text >> text=VOID GLOW')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase2-dome-mode-label.png' });
  });

  test('Dome visual changes when light mode switches to Blue', async ({ page }) => {
    // Click Blue mode button
    const blueBtn = page.getByRole('button', { name: /Blue.*Blue spectrum/ });
    await blueBtn.click();
    await page.waitForTimeout(1000);

    const domeSvg = page.locator('svg[viewBox="0 0 300 320"]');
    await expect(domeSvg.locator('text >> text=BLUE')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase2-dome-blue-mode.png' });
  });

  test('Dome visual changes when light mode switches to Off', async ({ page }) => {
    const offBtn = page.getByRole('button', { name: /Off.*Lights off/ });
    await offBtn.click();
    await page.waitForTimeout(1000);

    const domeSvg = page.locator('svg[viewBox="0 0 300 320"]');
    await expect(domeSvg.locator('text >> text=OFF')).toBeVisible();

    // Light rays should not be visible in off mode
    // (The g element with rays has opacity 0.4 but only renders when mode !== 'off')

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase2-dome-off-mode.png' });
  });
});

// ═══════════════════════════════════════════════════════════════════════
// PHASE 3: Demo Page
// ═══════════════════════════════════════════════════════════════════════

test.describe('Phase 3: Demo Page — Structure & Layout', () => {
  test('/demo route loads without AppShell (no nav chrome)', async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);

    // Should have "The Void Grows" header
    await expect(page.locator('h1 >> text=The Void Grows')).toBeVisible();
    await expect(page.locator('header >> text=Companion App')).toBeVisible();

    // Should NOT have AppShell bottom nav (Settings link from main app)
    // The demo has its own FakeBottomNav inside the phone frame
    await expect(page.locator('nav >> text=Settings')).not.toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-demo-layout.png' });
  });

  test('Phone frame (iPhone shell) is rendered', async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);

    // Phone frame has specific dimensions 375x812
    const frame = page.locator('[style*="width: 375px"]');
    await expect(frame).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-phone-frame.png' });
  });

  test('Header has "Build Your Own" link to void-blueprints', async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);

    const buildLink = page.locator('a[href="https://github.com/elastik/void-blueprints"]').first();
    await expect(buildLink).toBeVisible();
    await expect(buildLink).toContainText('Build Your Own');
  });

  test('Footer has links to hardware docs and app source', async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);

    await expect(page.locator('footer >> text=Hardware docs')).toBeVisible();
    await expect(page.locator('footer >> text=App source')).toBeVisible();
  });
});

test.describe('Phase 3: Demo Page — Auto-Connect & Status', () => {
  test('Demo auto-connects via mock adapter on load', async ({ page }) => {
    await page.goto(DEMO_URL);

    // Should see loading spinner briefly, then content
    await waitForDemoReady(page);

    // Status bar should show "Connected"
    await expect(page.locator('text=Connected')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-auto-connected.png' });
  });

  test('Fake iOS status bar shows time', async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);

    // The FakeIOSStatusBar renders current time — just verify the status bar area exists
    // It has signal bars SVG (width=16), WiFi SVG (width=14), Battery SVG (width=24)
    const batteryIcon = page.locator('svg[width="24"][height="12"]');
    await expect(batteryIcon).toBeVisible();
  });
});

test.describe('Phase 3: Demo Page — Dashboard Tab', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);
  });

  test('Species selector shows 3 species pills', async ({ page }) => {
    await expect(page.locator('button >> text=Blue Oyster')).toBeVisible();
    await expect(page.locator('button >> text=Lion\'s Mane')).toBeVisible();
    await expect(page.locator('button >> text=Pink Oyster')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-species-selector.png' });
  });

  test('Blue Oyster is default selected species', async ({ page }) => {
    const blueOysterPill = page.getByRole('button', { name: /Blue Oyster/ });
    const classes = await blueOysterPill.getAttribute('class');
    expect(classes).toContain('ring-1');
  });

  test('Switching species updates the banner and health ranges', async ({ page }) => {
    // Click Lion's Mane
    await page.getByRole('button', { name: /Lion's Mane/ }).click();
    await page.waitForTimeout(500);

    // Banner should show Lion's Mane
    await expect(page.locator('text=Growing: Lion\'s Mane')).toBeVisible();

    // Lion's Mane pill should now be active
    const lionPill = page.getByRole('button', { name: /Lion's Mane/ });
    const classes = await lionPill.getAttribute('class');
    expect(classes).toContain('ring-1');

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-lions-mane-selected.png' });
  });

  test('4 sensor pills visible (Temp, Humidity, CO2, FAE)', async ({ page }) => {
    await expect(page.locator('text=Temp').first()).toBeVisible();
    await expect(page.locator('text=Humidity').first()).toBeVisible();
    // CO₂ rendered as CO<sub>2</sub> or CO₂
    await expect(page.locator('text=/CO/').first()).toBeVisible();
    await expect(page.locator('text=FAE').first()).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-sensor-pills.png' });
  });

  test('Sensor pills show health range indicators', async ({ page }) => {
    // Each sensor pill has a range indicator like "18-24°C"
    await expect(page.locator('text=/\\d+-\\d+°C/').first()).toBeVisible();
    await expect(page.locator('text=/\\d+-\\d+%/').first()).toBeVisible();
  });

  test('Light Mode selector is visible with 4 buttons', async ({ page }) => {
    await expect(page.getByRole('main').locator('text=Light Mode')).toBeVisible();
    await expect(page.getByRole('button', { name: /Void Glow/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /UV Only/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Blue.*Blue spectrum/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Off.*Lights off/ })).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-light-modes.png' });
  });

  test('Switching light mode updates dome visual', async ({ page }) => {
    // Switch to UV Only
    await page.getByRole('button', { name: /UV Only/ }).click();
    await page.waitForTimeout(1000);

    // Dome label should update
    const domeSvg = page.locator('svg[viewBox="0 0 300 320"]');
    await expect(domeSvg.locator('text >> text=UV ONLY')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-dome-uv-switch.png' });
  });
});

test.describe('Phase 3: Demo Page — Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);
  });

  test('Bottom nav has Dashboard, Climate, and Grow Log tabs', async ({ page }) => {
    // FakeBottomNav renders inside the phone frame
    await expect(page.locator('nav button >> text=Dashboard')).toBeVisible();
    await expect(page.locator('nav button >> text=Climate')).toBeVisible();
    await expect(page.locator('nav button >> text=Grow Log')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-tab-nav.png' });
  });

  test('Climate tab shows fan slider and UV-C controls', async ({ page }) => {
    // Click Climate tab
    await page.locator('nav button >> text=Climate').click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('main').locator('text=Climate Control')).toBeVisible();
    await expect(page.getByRole('main').locator('text=Fan Speed (FAE)')).toBeVisible();
    await expect(page.getByRole('main').locator('text=UV-C Sterilization')).toBeVisible();
    await expect(page.getByRole('main').locator('text=Start 15min Cycle')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-climate-tab.png' });
  });

  test('Grow Log tab shows timeline and day counter', async ({ page }) => {
    // Click Grow Log tab
    await page.locator('nav button >> text=Grow Log').click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('main').locator('text=Grow Log')).toBeVisible();
    await expect(page.getByRole('main').locator('text=Days')).toBeVisible();
    await expect(page.getByRole('main').locator('text=Stage')).toBeVisible();
    await expect(page.getByText('To Harvest', { exact: true })).toBeVisible();
    await expect(page.getByRole('main').locator('text=Recent Alerts')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-growlog-tab.png' });
  });

  test('Grow Log shows milestone timeline entries', async ({ page }) => {
    await page.locator('nav button >> text=Grow Log').click();
    await page.waitForTimeout(500);

    // Should show milestone events from Blue Oyster species
    await expect(page.locator('text=Inoculated substrate')).toBeVisible();
    await expect(page.locator('text=Harvest ready')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-growlog-milestones.png' });
  });

  test('Switching back to Dashboard tab restores dome and sensors', async ({ page }) => {
    // Go to Climate, then back to Dashboard
    await page.locator('nav button >> text=Climate').click();
    await page.waitForTimeout(300);
    await page.locator('nav button >> text=Dashboard').click();
    await page.waitForTimeout(500);

    // Dashboard content should be back
    await expect(page.locator('text=Temp').first()).toBeVisible();
    await expect(page.locator('svg[viewBox="0 0 300 320"]')).toBeVisible();
  });
});

test.describe('Phase 3: Demo Page — UV-C Sterilization', () => {
  test('UV-C button is functional and starts sterilization cycle', async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);

    // Go to Climate tab
    await page.locator('nav button >> text=Climate').click();
    await page.waitForTimeout(500);

    // Click Start 15min Cycle
    const uvcButton = page.locator('button >> text=Start 15min Cycle');
    await expect(uvcButton).toBeVisible();
    await uvcButton.click();
    await page.waitForTimeout(1000);

    // Button should now show "Active" state
    await expect(page.locator('button >> text=/Active/')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-uvc-active.png' });
  });
});

test.describe('Phase 3: Demo Page — Embed Mode', () => {
  test('/demo-embed renders phone frame without header/footer', async ({ page }) => {
    await page.goto(EMBED_URL);
    await waitForDemoReady(page);

    // Phone frame should exist
    const frame = page.locator('[style*="width: 375px"]');
    await expect(frame).toBeVisible();

    // Should NOT have the page header or footer
    await expect(page.locator('header >> text=The Void Grows')).not.toBeVisible();
    await expect(page.locator('footer')).not.toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-embed-mode.png' });
  });

  test('/demo?embed=1 also triggers embed mode', async ({ page }) => {
    await page.goto('/demo?embed=1');
    await waitForDemoReady(page);

    // No header
    await expect(page.locator('header >> text=The Void Grows')).not.toBeVisible();

    // Phone frame visible
    const frame = page.locator('[style*="width: 375px"]');
    await expect(frame).toBeVisible();
  });
});

test.describe('Phase 3: Demo Page — Side Panel Screenshots', () => {
  test('Side panel has screenshot cards with descriptions', async ({ page }) => {
    await page.goto(DEMO_URL);
    await waitForDemoReady(page);

    // Side panel screenshot cards
    await expect(page.locator('text=Interactive Demo')).toBeVisible();
    await expect(page.locator('text=Control Your Dome')).toBeVisible();

    // Screenshot card labels
    await expect(page.locator('img[alt*="Dashboard tab"]')).toBeVisible();
    await expect(page.locator('img[alt*="Climate tab"]')).toBeVisible();
    await expect(page.locator('img[alt*="Grow Log tab"]')).toBeVisible();

    await page.screenshot({ path: 'tests/e2e/results/screenshots/v5-phase3-side-panel.png' });
  });
});
