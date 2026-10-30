// Integration QA of the single page. All external requests are blocked; the only one the page makes is the subscription form's POST, mocked here.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.OFFICE_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.OFFICE_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const url = process.env.OFFICE_PREVIEW_URL || 'http://localhost:5174';
const endpoint = process.env.VITE_FORM_ENDPOINT ?? 'https://formspree.io/f/mredjdzd';
const errors = [], unexpected = [], layouts = [], posted = [];
let endpointStatus = 500;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error' && message.location().url !== endpoint) errors.push(message.text()); });
  await page.route('**/*', route => {
    const request = route.request();
    if (new URL(request.url()).origin === new URL(url).origin) return route.continue();
    if (endpoint && request.url() === endpoint && request.method() === 'POST') { posted.push(request.postDataJSON()); return route.fulfill({ status: endpointStatus, contentType: 'application/json', body: endpointStatus === 200 ? '{"ok":true}' : '{"error":"mock"}' }); }
    unexpected.push(request.url()); return route.abort();
  });
  await page.goto(url); await page.evaluate(() => document.fonts.ready);
  await page.getByRole('heading', { level: 1, name: 'La Oficina de los Últimos Cuentos' }).waitFor();
  // Letters are the only channel: the address is configured or explicitly pending; no form, no products, no mail link.
  const postal = (process.env.VITE_POSTAL_ADDRESS || '').split('|').map(line => line.trim()).filter(Boolean);
  if (postal.length) { for (const line of postal) await page.locator('address.postal', { hasText: line }).waitFor(); }
  else await page.locator('.postal-pending', { hasText: 'Todavía no tenemos casilla de correo' }).waitFor();
  assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
  assert.equal(await page.getByText(/Cuento Nº|Archivo/).count(), 0); await page.getByText('$20.000 por mes, envío incluido.').waitFor();
  // The shops that sell the cuentos, as listed in site.locales; a name and a neighbourhood each, no prices.
  await page.locator('.local', { hasText: 'Towandas Café' }).waitFor(); await page.locator('.local', { hasText: 'Quesada 4982' }).waitFor();
  await page.locator('.local', { hasText: 'Cero Café de Origen' }).waitFor(); await page.locator('.local', { hasText: 'Av. Congreso 5080' }).waitFor();
  // The map is drawn from the city's own data: one shaded barrio and one owl per local, the directions link opens Google Maps only on request.
  const map = page.locator('svg.mapa'); await map.waitFor();
  // A dot per local; the two locals are three blocks apart in the same barrio, so they share one owl and one shaded barrio.
  assert.equal(await map.locator('.mapa-punto').count(), await page.locator('.local').count()); assert.equal(await map.locator('image').count(), 1); assert.equal(await map.locator('.mapa-barrio--local').count(), 1);
  assert.ok(await page.locator('img.local-lechuza').first().evaluate(img => img.complete && img.naturalWidth > 0));
  const directions = page.locator('a.local-link').first(); assert.equal(await directions.getAttribute('target'), '_blank'); assert.ok((await directions.getAttribute('href')).startsWith('https://maps.google.com/'));
  // The menu: three words in the cover, each an anchor to a section that exists.
  for (const link of await page.locator('nav.cover-nav a').all()) { const href = await link.getAttribute('href'); assert.ok(href.startsWith('#')); assert.equal(await page.locator(href).count(), 1); }
  assert.deepEqual(await page.locator('nav.cover-nav a').allTextContents(), ['Cafés', 'Suscripción', 'Cartas']);
  // The subscription form unfolds under its button; client validation keeps values and focuses the first missing field; the endpoint's errors are shown, never a fake success.
  const details = page.locator('details.subscription'); await details.waitFor(); assert.equal(await details.getAttribute('open'), null);
  await details.locator('> summary', { hasText: 'Suscribirme' }).click(); await page.locator('details.subscription[open]').waitFor();
  const form = page.locator('form.subscription-form'); await form.waitFor(); await page.waitForLoadState('networkidle');
  assert.equal(await form.getAttribute('action'), endpoint); assert.equal(await form.getAttribute('novalidate'), '');
  await page.getByRole('button', { name: 'Enviar mis datos' }).click();
  await page.locator('#suscripcion-nombre-error', { hasText: 'Escribí tu nombre.' }).waitFor();
  await page.waitForFunction(() => document.activeElement?.id === 'suscripcion-nombre'); assert.equal(posted.length, 0);
  const sample = { nombre: 'Prueba QA', mail: 'qa@example.com', direccion: 'Calle Falsa 123, 2º B', barrio: 'Villa Urquiza', codigoPostal: '1900' };
  for (const [name, value] of Object.entries(sample)) await page.locator('#suscripcion-' + name).fill(value);
  // Deliveries stay within the city: a postal code from outside is refused before anything is sent.
  await page.getByRole('button', { name: 'Enviar mis datos' }).click();
  await page.locator('#suscripcion-codigoPostal-error', { hasText: 'solo dentro de la Ciudad de Buenos Aires' }).waitFor(); assert.equal(posted.length, 0);
  await page.locator('#suscripcion-codigoPostal').fill('C1431ACJ');
  await page.getByRole('button', { name: 'Enviar mis datos' }).click();
  await page.getByRole('alert').filter({ hasText: 'No pudimos confirmar el envío' }).waitFor();
  assert.equal(await page.locator('#suscripcion-direccion').inputValue(), sample.direccion); assert.equal(posted.length, 1);
  assert.equal(posted[0].email, sample.mail); assert.equal(posted[0].pedido, 'suscripcion-mensual'); assert.equal(posted[0].barrio, sample.barrio); assert.equal(posted[0]._gotcha, '');
  endpointStatus = 200; await page.getByRole('button', { name: 'Enviar mis datos' }).click();
  await page.getByRole('status').filter({ hasText: 'Recibimos tus datos' }).waitFor(); assert.equal(posted.length, 2);
  // The payment goes through the Mercado Pago subscription link, shown only after the address arrived.
  const subscriptionUrl = (process.env.VITE_SUBSCRIPTION_URL || '').trim();
  if (subscriptionUrl) { const pay = page.getByRole('link', { name: 'Pagar en Mercado Pago' }); await pay.waitFor(); assert.equal(await pay.getAttribute('href'), subscriptionUrl); }
  else { assert.equal(await page.getByRole('link', { name: 'Pagar en Mercado Pago' }).count(), 0); await page.getByText('coordinar el pago').waitFor(); }
  await page.getByRole('button', { name: 'Hacer otro pedido' }).click(); assert.equal(await page.locator('#suscripcion-nombre').inputValue(), '');
  assert.ok(await page.locator('link[rel="canonical"]').getAttribute('href')); assert.ok(await page.locator('meta[property="og:image"]').getAttribute('content'));
  // Structured data says only what the page says, with the canonical URL.
  const organization = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  assert.equal(organization['@type'], 'Organization'); assert.equal(organization.name, 'La Oficina de los Últimos Cuentos'); assert.equal(organization.url, await page.locator('link[rel="canonical"]').getAttribute('href'));
  // The build pre-renders the page: without JavaScript the whole page is still there.
  const noScript = await browser.newContext({ javaScriptEnabled: false }); const still = await noScript.newPage();
  await still.route('**/*', route => new URL(route.request().url()).origin === new URL(url).origin ? route.continue() : route.abort());
  await still.goto(url); await still.getByRole('heading', { level: 1, name: 'La Oficina de los Últimos Cuentos' }).waitFor(); await still.getByText('Leemos todo lo que llega.').waitFor(); await still.locator('.local', { hasText: 'Towandas Café' }).waitFor(); await still.locator('svg.mapa image').first().waitFor({ state: 'attached' }); assert.equal(await still.locator('form.subscription-form[method="post"]').getAttribute('novalidate'), null); await noScript.close();
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
  const report = { layouts, runtimeErrors: errors, unexpectedRequests: unexpected, checks: ['postal address or explicit pending state', 'shops listed without prices', 'map from city data with the owl on each shop and a directions link', 'menu anchors to existing sections', 'subscription form folded under its button: validation, city-only postal code, endpoint error kept, success with the Mercado Pago link, plain POST without JavaScript', 'no mail link or products', 'canonical and share card metadata', 'Organization JSON-LD', 'pre-rendered page without JavaScript', 'no console errors (hydration)', 'no horizontal overflow at 320 to 1440', 'reduced motion', '200% text reflow'] };
  await writeFile('validation/report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
