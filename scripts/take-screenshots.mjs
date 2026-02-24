import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const OUT = 'public/screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});

const page = await context.newPage();

// Load the demo page from the live site
await page.goto('https://thevoidgrows-app.vercel.app/demo');

// Wait for the app to connect and render
await page.waitForTimeout(3000);

// Locate the phone frame (375x812 bezel)
const phoneFrame = page.locator('div[style*="width: 375px"]');
await phoneFrame.waitFor({ state: 'visible' });

// Screenshot Dashboard tab (default)
console.log('Taking dashboard screenshot...');
await phoneFrame.screenshot({ path: `${OUT}/demo-dashboard.png` });

// Click Climate tab
console.log('Taking climate screenshot...');
await page.click('button:has-text("Climate")');
await page.waitForTimeout(500);
await phoneFrame.screenshot({ path: `${OUT}/demo-climate.png` });

// Click Grow Log tab
console.log('Taking grow log screenshot...');
await page.click('button:has-text("Grow Log")');
await page.waitForTimeout(500);
await phoneFrame.screenshot({ path: `${OUT}/demo-growlog.png` });

await browser.close();
console.log('Done! Screenshots saved to', OUT);
