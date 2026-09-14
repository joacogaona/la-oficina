// Integration QA. All external requests are intercepted; no real submissions.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const { chromium } = await import(process.env.OFFICE_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.OFFICE_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
const url = process.env.OFFICE_PREVIEW_URL || 'http://127.0.0.1:5174';
const errors = [], sent = [], unexpected = [], layouts = [];
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', error => errors.push(error.message));
  let responseMode = 'success', release;
  await page.route('**/*', async route => {
    if (new URL(route.request().url()).origin === new URL(url).origin) return route.continue();
    if (route.request().url().startsWith('https://formspree.io/f/') && route.request().method() === 'POST') {
      sent.push(route.request().postDataJSON());
      if (responseMode === 'network') return route.abort('failed');
      if (responseMode === 'delay') await new Promise(resolve => { release = resolve; });
      return route.fulfill({ status: responseMode === 'server' ? 500 : 200, contentType: 'application/json', body: JSON.stringify(responseMode === 'server' ? { error: 'test failure' } : responseMode === 'malformed' ? {} : { next: '/thanks' }) });
    }
    unexpected.push(route.request().url()); return route.abort();
  });
  await page.goto(url); await page.evaluate(() => document.fonts.ready);
  await page.getByRole('heading', { level: 1 }).waitFor();
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
  const opener = page.getByRole('button', { name: 'Recibir un cuento', exact: true });
  await opener.click(); const dialog = page.getByRole('dialog'); await dialog.waitFor();
  assert.equal(await page.evaluate(() => document.activeElement.tagName), 'H2');
  await dialog.getByRole('button', { name: 'Enviar consulta', exact: true }).click();
  assert.equal(sent.length, 0); await page.locator('#consulta-nombre[aria-invalid="true"]').waitFor();
  await page.waitForFunction(() => document.activeElement.id === 'consulta-nombre');
  await page.locator('#consulta-nombre').fill('Prueba de interfaz'); await page.locator('#consulta-email').fill('lector@example.com');
  await page.locator('#consulta-ciudad').fill('Buenos Aires'); await page.locator('#consulta-provincia').fill('CABA'); await page.locator('#consulta-codigo_postal').fill('1425');
  assert.equal(await dialog.getByRole('checkbox').isChecked(), false);
  responseMode = 'server'; await dialog.getByRole('button', { name: 'Enviar consulta', exact: true }).click(); await dialog.getByRole('alert').waitFor();
  assert.equal(await page.locator('#consulta-email').inputValue(), 'lector@example.com');
  responseMode = 'malformed'; await dialog.getByRole('button', { name: 'Enviar consulta', exact: true }).click(); await dialog.getByRole('alert').waitFor();
  assert.equal(await dialog.getByText('Tu consulta llegó a la Oficina').count(), 0);
  responseMode = 'network'; await dialog.getByRole('button', { name: 'Enviar consulta', exact: true }).click(); await dialog.getByRole('alert').waitFor();
  responseMode = 'delay'; await dialog.getByRole('button', { name: 'Enviar consulta', exact: true }).click();
  await dialog.getByRole('button', { name: 'Enviando…', exact: true }).waitFor();
  await page.waitForFunction(() => document.querySelector('.request-form')?.getAttribute('aria-busy') === 'true');
  // A second submit event while the first request is pending must not send again.
  await page.locator('.request-form').dispatchEvent('submit');
  assert.equal(sent.length, 4); assert.equal(await dialog.getByRole('button', { name: 'Enviando…', exact: true }).isDisabled(), true);
  assert.equal(new Set(sent.map(body => body.solicitud_id)).size, 1);
  release(); await dialog.getByText('Tu consulta llegó a la Oficina').waitFor();
  await page.screenshot({ path: 'validation/previews/confirmacion.png' });
  for (let i = 0; i < 10; i++) { await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.querySelector('dialog').contains(document.activeElement)), true); }
  await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
  assert.equal(await opener.evaluate(element => element === document.activeElement), true);
  responseMode = 'success';
  const cases = [
    ['regalar', 'Regalar un cuento', { nombre: 'Comprador', email: 'regalo@example.com', ciudad: 'Rosario', provincia: 'Santa Fe', codigo_postal: '2000' }],
    ['foco', 'Sumar un espacio', { nombre: 'Contacto', email: 'foco@example.com', espacio: 'Espacio de prueba', ciudad: 'Buenos Aires', direccion_local: 'Dirección de prueba' }],
    ['mensajero', 'Consultar cómo participar', { nombre: 'Mensajero', email: 'mensajero@example.com', ciudad: 'Córdoba' }],
    ['encuentros', 'Recibir avisos de encuentros', { email: 'avisos@example.com' }],
    ['contacto', 'Escribir a la Oficina', { nombre: 'Consulta', email: 'consulta@example.com', mensaje: 'Mensaje de prueba local.' }],
    ['preferencias', 'Gestionar avisos y datos', { email: 'baja@example.com' }],
  ];
  for (const [kind, label, fields] of cases) {
    await page.getByRole('button', { name: new RegExp('^' + label) }).first().click(); await dialog.waitFor();
    assert.equal(await page.locator('#consulta-motivo').inputValue(), kind);
    for (const [name, value] of Object.entries(fields)) await page.locator('#consulta-' + name).fill(value);
    if (kind === 'foco') await page.locator('#consulta-tipo_espacio').selectOption('Café');
    if (kind === 'regalar') assert.equal(await dialog.locator('input[name*="destinatario"]').count(), 0);
    if (kind === 'encuentros') {
      const previous = sent.length;
      await dialog.getByRole('button', { name: 'Quiero que me avisen', exact: true }).click();
      await page.locator('#consulta-avisos_encuentros[aria-invalid="true"]').waitFor(); assert.equal(sent.length, previous);
      await dialog.getByRole('checkbox').check();
    }
    await dialog.locator('button[type="submit"]').click(); await dialog.getByRole('status').waitFor();
    const body = sent.at(-1); assert.equal(body.motivo, kind);
    if (kind === 'encuentros') { assert.equal(body.avisos_encuentros, true); assert.ok(body.consentimiento_fecha); }
    if (kind === 'preferencias') assert.equal('avisos_encuentros' in body, false);
    await page.keyboard.press('Escape'); await dialog.waitFor({ state: 'hidden' });
  }
  for (const path of ['/privacidad/', '/condiciones/']) {
    const response = await page.goto(url + path); assert.equal(response.status(), 200);
    await page.getByRole('heading', { level: 1 }).waitFor(); assert.ok(await page.title());
    assert.ok((await page.locator('link[rel="canonical"]').getAttribute('href')).endsWith(path));
    assert.ok(await page.locator('meta[property="og:image"]').getAttribute('content'));
  }
  await page.goto(url); await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto');
  // Reflow at 200% text zoom: equivalent CSS font scaling, separate from viewport QA.
  await page.addStyleTag({ content: 'html {font-size:200% !important}' });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  assert.deepEqual(errors, []); assert.deepEqual(unexpected, []);
  const report = { layouts, runtimeErrors: errors, unexpectedRequests: unexpected, interceptedSubmissions: sent.length, flows: ['recibir', ...cases.map(c => c[0])], checks: ['empty validation', 'gift buyer separation', 'opt-in required for event request', 'server failure', 'network failure', 'malformed response', 'duplicate submit', 'stable retry ID', 'persistent success', 'focus trap and Escape restoration', 'legal routes and metadata', 'reduced motion', '200% text reflow'], realSubmissions: 0 };
  await writeFile('validation/report.json', JSON.stringify(report, null, 2)); console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
