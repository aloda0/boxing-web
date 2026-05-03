import { chromium } from "playwright";

const url = process.env.URL ?? "http://localhost:3004/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(200);

await page.getByRole("button", { name: "Документация" }).hover();
await page.waitForTimeout(250);

await page.screenshot({ path: "docs/__dropdown_docs_hover_debug__.png" });

await browser.close();

