// Optional visual tooling: run with Playwright installed, or provide its module path.
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.OFFICE_PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, executablePath: process.env.OFFICE_CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  const url = process.env.OFFICE_PREVIEW_URL || 'http://127.0.0.1:5174';
  await page.route('**/*', route => new URL(route.request().url()).origin === new URL(url).origin ? route.continue() : route.abort());
  await page.goto(url);
  await page.evaluate(() => document.fonts.ready);
  // The card is the cover itself: red paper, the signature, the one-line description.
  await page.addStyleTag({ content: `
    .site > *:not(.cover) { display: none } .cover-top a { display: none }
    .cover { box-sizing: border-box; height: 630px; padding: 56px 0 } .cover > .office-container { display: flex; flex-direction: column; justify-content: space-between; height: 100%; padding-inline: 72px }
    .cover-top { margin: 0; min-height: 0; font-size: 20px } .cover-title .office-signature { font-size: 100px } .cover-line { margin: 0; max-width: none; font-size: 32px }
  ` });
  await mkdir('public', { recursive: true });
  await page.screenshot({ path: 'public/og.png' });
  // The icons are the Oficina's seal: the "L." of the signature, ink on the red of the cover, set in the page's own font.
  for (const [size, name] of [[64, 'favicon.png'], [180, 'apple-touch-icon.png']]) {
    await page.setViewportSize({ width: size, height: size });
    await page.evaluate(size => {
      document.body.innerHTML = ''; document.body.style.minWidth = '0';
      const icon = document.createElement('div'); icon.textContent = 'L.';
      Object.assign(icon.style, { width: size + 'px', height: size + 'px', boxSizing: 'border-box', display: 'grid', placeItems: 'center', color: '#1c1c18', background: '#d2645b', font: `500 ${size * 0.62}px Inconsolata`, letterSpacing: '-0.05em', paddingBottom: size * 0.04 + 'px' });
      document.body.append(icon);
    }, size);
    await page.screenshot({ path: 'public/' + name });
  }
  console.log('Tarjeta 1200×630 generada desde la portada; favicon e ícono con la “L.” de la firma.');
} finally { await browser.close(); }
