import { chromium } from "playwright";

const url = process.env.ZENITH_URL || "http://127.0.0.1:4174";
const clip = process.argv[2];

if (!clip) {
  console.error("Usage: node tests/zenith-smoke.mjs /absolute/path/to/clip.mp4");
  process.exit(2);
}

const executablePath =
  process.env.CHROME_PATH ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const browser = await chromium.launch({ headless: true, executablePath });
const page = await browser.newPage({
  viewport: { width: 390, height: 844, isMobile: true },
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const logs = [];
page.on("console", (msg) => logs.push({ type: msg.type(), text: msg.text() }));
page.on("pageerror", (err) => logs.push({ type: "pageerror", text: err.message }));

await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });
await page.setInputFiles("#fileIn", clip);
await page.waitForFunction(
  () => window.ZenithSmoke && window.ZenithSmoke.snapshot().source === "file",
  null,
  { timeout: 15_000 },
);
await page.waitForFunction(
  () => ["ready", "error"].includes(window.ZenithSmoke.snapshot().modelState),
  null,
  { timeout: 60_000 },
);

const ready = await page.evaluate(() => window.ZenithSmoke.snapshot());
if (ready.modelState === "ready") {
  await page.click("#bAnalyze");
  await page
    .waitForFunction(() => !window.ZenithSmoke.snapshot().analyzing, null, {
      timeout: 120_000,
    })
    .catch(() => {});
}

const snapshot = await page.evaluate(() => window.ZenithSmoke.snapshot());
await browser.close();

console.log(JSON.stringify({ snapshot, logs }, null, 2));
