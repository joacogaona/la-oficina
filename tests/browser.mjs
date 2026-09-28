// Integration QA of the single page. All external requests are blocked; the page makes none.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.OFFICE_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.OFFICE_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const url = process.env.OFFICE_PREVIEW_URL || 'http://localhost:5174';
const errors = [], unexpected = [], layouts = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.route('**/*', route => { if (new URL(route.request().url()).origin === new URL(url).origin) return route.continue(); unexpected.push(route.request().url()); return route.abort(); });
  await page.goto(url); await page.evaluate(() => document.fonts.ready);
  await page.getByRole('heading', { level: 1, name: 'La Oficina de los Últimos Cuentos' }).waitFor();
  // Letters are the only channel: the address is configured or explicitly pending; no form, no products, no mail link.
  const postal = (process.env.VITE_POSTAL_ADDRESS || '').split('|').map(line => line.trim()).filter(Boolean);
  if (postal.length) { for (const line of postal) await page.locator('address.postal', { hasText: line }).waitFor(); }
  else await page.locator('.postal-pending', { hasText: 'Todavía no tenemos casilla de correo' }).waitFor();
  assert.equal(await page.locator('form, input, textarea, button, a[href^="mailto:"]').count(), 0);
  assert.equal(await page.getByText(/Cuento Nº|Archivo/).count(), 0);
  assert.ok(await page.locator('link[rel="canonical"]').getAttribute('href')); assert.ok(await page.locator('meta[property="og:image"]').getAttribute('content'));
  // Structured data says only what the page says, with the canonical URL.
  const organization = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert.equal(organization['@type'], 'Organization'); assert.equal(organization.name, 'La Oficina de los Últimos Cuentos'); assert.equal(organization.url, await page.locator('link[rel="canonical"]').getAttribute('href'));
  // The build pre-renders the page: without JavaScript the whole page is still there.
  const noScript = await browser.newContext({ javaScriptEnabled: false }); const still = await noScript.newPage();
  await still.route('**/*', route => new URL(route.request().url()).origin === new URL(url).origin ? route.continue() : route.abort());
  await still.goto(url); await still.getByRole('heading', { level: 1, name: 'La Oficina de los Últimos Cuentos' }).waitFor(); await still.getByText('Leemos todo lo que llega.').waitFor(); await noScript.close();
  await mkdir('validation/previews', { recursive: true });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
    layouts.push(layout); assert.ok(layout.scroll <= width, JSON.stringify(layout));
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'validation/previews/escritorio.png' });
  await page.screenshot({ path: 'validation/previews/pagina-completa.png', fullPage: true });
  await page.setViewportSize({ width: 375, height: 900 }); await page.screenshot({ path: 'validation/previews/celular.png' });
  await page.screenshot({ path: 'validation/previews/celular-completa.png', fullPage: true });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  // Reflow at 200% text zoom: equivalent CSS font scaling, separate from viewport QA.
  await page.setViewportSize({ width: 1440, height: 1000 }); await page.addStyleTag({ content: 'html {font-size:200% !important}' });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []); assert.deepEqual(unexpected, []);
  const report = { layouts, runtimeErrors: errors, unexpectedRequests: unexpected, checks: ['postal address or explicit pending state', 'no form, mail link or products', 'canonical and share card metadata', 'Organization JSON-LD', 'pre-rendered page without JavaScript', 'no console errors (hydration)', 'no horizontal overflow at 320 to 1440', 'reduced motion', '200% text reflow'] };
  await writeFile('validation/report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
