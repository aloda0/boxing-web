import { chromium } from "playwright";

const url = process.env.URL ?? "http://localhost:3004/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(300);
await page.screenshot({ path: "docs/__pear_layer_home__.png", fullPage: false });

await page.mouse.wheel(0, 1200);
await page.waitForTimeout(300);
await page.screenshot({ path: "docs/__pear_layer_scrolled__.png", fullPage: false });

await browser.close();

