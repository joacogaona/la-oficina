// Integration QA of the home page and the agenda. All external requests are blocked; the only one the page makes is the subscription form's POST, mocked here.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.OFFICE_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.OFFICE_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const url = process.env.OFFICE_PREVIEW_URL || 'http://localhost:5174';
const endpoint = process.env.VITE_FORM_ENDPOINT ?? 'https://formspree.io/f/mredjdzd';
const errors = [], unexpected = [], layouts = [], posted = [], vercel = [];
// Vercel's analytics scripts live under /_vercel/ on the same origin and only exist once enabled in the project: the test serves them empty and records the requests.
const vercelStub = route => { const { pathname } = new URL(route.request().url()); if (!pathname.startsWith('/_vercel/')) return false; vercel.push(pathname); route.fulfill({ status: 200, contentType: 'application/javascript', body: '' }); return true; };
let endpointStatus = 500;
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error' && message.location().url !== endpoint) errors.push(message.text()); });
  await page.route('**/*', route => {
    const request = route.request();
    if (vercelStub(route)) return;
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
  // The menu: four words in the cover, three anchors to sections that exist and the agenda's own page.
  for (const link of await page.locator('nav.cover-nav a').all()) { const href = await link.getAttribute('href'); if (href === '/agenda/') continue; assert.ok(href.startsWith('#')); assert.equal(await page.locator(href).count(), 1); }
  assert.deepEqual(await page.locator('nav.cover-nav a').allTextContents(), ['Cafés', 'Suscripción', 'Cartas', 'Agenda']);
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
  // The agenda (30-oct-2026): its own pre-rendered page from src/content/agenda.ts. Confirmed dates by day from today in Buenos Aires, everything by barrio;
  // the map's red barrios are links to their group, without owls (the owl marks the shops). No amounts, public links in another tab, its own canonical and Events.
  const agendaUrl = new URL('/agenda/', url).href;
  const agendaPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  agendaPage.on('pageerror', error => errors.push(error.message)); agendaPage.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await agendaPage.route('**/*', route => { if (vercelStub(route)) return; if (new URL(route.request().url()).origin === new URL(url).origin) return route.continue(); unexpected.push(route.request().url()); return route.abort(); });
  await agendaPage.goto(agendaUrl); await agendaPage.evaluate(() => document.fonts.ready);
  await agendaPage.getByRole('heading', { level: 1, name: 'Agenda' }).waitFor(); assert.equal(await agendaPage.locator('a.cover-home').getAttribute('href'), '/');
  // The open mics first (30-oct-2026, night): the menu's first word leads there and each one is listed with its name; the other anchors exist.
  assert.deepEqual(await agendaPage.locator('nav.cover-nav a').allTextContents(), ['Micrófonos', 'Fechas', 'Barrios', 'Cartas']);
  for (const link of await agendaPage.locator('nav.cover-nav a').all()) { const href = await link.getAttribute('href'); if (href.startsWith('#')) assert.equal(await agendaPage.locator(href).count(), 1); }
  assert.ok(await agendaPage.locator('#microfonos .agenda-item .agenda-nombre').count() >= 1);
  const groups = agendaPage.locator('section.agenda-barrio'); const groupCount = await groups.count(); assert.ok(groupCount > 0);
  const barrioLinks = agendaPage.locator('.agenda-mapa a'); assert.equal(await barrioLinks.count(), groupCount); assert.equal(await agendaPage.locator('.agenda-mapa .mapa-barrio--local').count(), groupCount);
  for (const link of await barrioLinks.all()) { const href = await link.getAttribute('href'); assert.ok(href.startsWith('#barrio-')); assert.equal(await agendaPage.locator(href).count(), 1); }
  assert.equal(await agendaPage.locator('.agenda-mapa image').count(), 0);
  // Under the map, the index: one link per barrio with activities, to the same groups (the way in from a phone).
  const indexLinks = agendaPage.locator('.agenda-indice a'); assert.equal(await indexLinks.count(), groupCount);
  for (const link of await indexLinks.all()) { const href = await link.getAttribute('href'); assert.ok(href.startsWith('#barrio-')); assert.equal(await agendaPage.locator(href).count(), 1); }
  // Every activity: a name (the public link when there is one) and, at most, one more line. No "Más información" rows.
  for (const item of await agendaPage.locator('.agenda-item').all()) { assert.equal(await item.locator('.agenda-nombre').count(), 1); assert.ok((await item.locator('p').count()) <= 2); }
  assert.equal(await agendaPage.getByText('Más información').count(), 0);
  // Both pages ask for Vercel's Web Analytics and Speed Insights scripts (30-oct-2026), nothing else from outside.
  for (const script of ['/_vercel/insights/script.js', '/_vercel/speed-insights/script.js']) assert.ok(vercel.filter(path => path === script).length >= 2, script);
  await barrioLinks.first().focus(); await agendaPage.keyboard.press('Enter'); await agendaPage.waitForFunction(() => location.hash.startsWith('#barrio-'));
  for (const link of await agendaPage.locator('a.agenda-link').all()) { assert.equal(await link.getAttribute('target'), '_blank'); assert.equal(await link.getAttribute('rel'), 'noreferrer'); assert.ok((await link.getAttribute('href')).startsWith('https://')); }
  assert.equal(await agendaPage.locator('main').getByText(/\$\s?\d/).count(), 0);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  for (const id of await agendaPage.locator('section.agenda-dia h3').evaluateAll(headings => headings.map(heading => heading.id))) assert.ok(id.slice(4) >= today, id);
  assert.equal(await agendaPage.locator('link[rel="canonical"]').getAttribute('href'), new URL('/agenda/', await page.locator('link[rel="canonical"]').getAttribute('href')).href);
  const agendaData = JSON.parse(await agendaPage.locator('script[type="application/ld+json"]').textContent());
  assert.equal(agendaData['@graph'][0]['@type'], 'WebPage'); assert.ok(agendaData['@graph'].slice(1).every(item => item['@type'] === 'Event' && item.location && item.startDate));
  // The build pre-renders the page: without JavaScript the whole page is still there.
  const noScript = await browser.newContext({ javaScriptEnabled: false }); const still = await noScript.newPage();
  await still.route('**/*', route => { if (vercelStub(route)) return; return new URL(route.request().url()).origin === new URL(url).origin ? route.continue() : route.abort(); });
  await still.goto(url); await still.getByRole('heading', { level: 1, name: 'La Oficina de los Últimos Cuentos' }).waitFor(); await still.getByText('Leemos todo lo que llega.').waitFor(); await still.locator('.local', { hasText: 'Towandas Café' }).waitFor(); await still.locator('svg.mapa image').first().waitFor({ state: 'attached' }); assert.equal(await still.locator('form.subscription-form[method="post"]').getAttribute('novalidate'), null);
  await still.goto(agendaUrl); await still.getByRole('heading', { level: 1, name: 'Agenda' }).waitFor(); assert.equal(await still.locator('section.agenda-barrio').count(), groupCount); await still.locator('.agenda-mapa a').first().waitFor({ state: 'attached' }); assert.ok(await still.locator('#microfonos .agenda-item').count() >= 1); await noScript.close();
  await mkdir('validation/previews', { recursive: true });
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const layout = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
    layouts.push(layout); assert.ok(layout.scroll <= width, JSON.stringify(layout));
    await agendaPage.setViewportSize({ width, height: 900 });
    const agendaLayout = await agendaPage.evaluate(() => ({ page: 'agenda', width: innerWidth, scroll: document.documentElement.scrollWidth }));
    layouts.push(agendaLayout); assert.ok(agendaLayout.scroll <= width, JSON.stringify(agendaLayout));
  }
  await agendaPage.evaluate(() => { location.hash = ''; scrollTo({ top: 0, behavior: 'instant' }); });
  await agendaPage.setViewportSize({ width: 1440, height: 1000 }); await agendaPage.screenshot({ path: 'validation/previews/agenda-escritorio.png' }); await agendaPage.screenshot({ path: 'validation/previews/agenda-completa.png', fullPage: true });
  await agendaPage.setViewportSize({ width: 375, height: 900 }); await agendaPage.evaluate(() => scrollTo({ top: 0, behavior: 'instant' })); await agendaPage.screenshot({ path: 'validation/previews/agenda-celular.png' });
  await agendaPage.setViewportSize({ width: 1440, height: 1000 }); await agendaPage.addStyleTag({ content: 'html {font-size:200% !important}' });
  assert.ok(await agendaPage.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
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
  const report = { layouts, runtimeErrors: errors, unexpectedRequests: unexpected, checks: ['postal address or explicit pending state', 'shops listed without prices', 'map from city data with the owl on each shop and a directions link', 'menu anchors to existing sections and the agenda link', 'agenda: map links to barrio groups, no owls, keyboard, dates from today, no amounts, public links in a new tab, canonical and Events, without JavaScript, no overflow, 200% reflow', 'subscription form folded under its button: validation, city-only postal code, endpoint error kept, success with the Mercado Pago link, plain POST without JavaScript', 'no mail link or products', 'canonical and share card metadata', 'Organization JSON-LD', 'pre-rendered page without JavaScript', 'no console errors (hydration)', 'no horizontal overflow at 320 to 1440', 'reduced motion', '200% text reflow'] };
  await writeFile('validation/report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
