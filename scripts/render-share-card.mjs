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
  await page.addStyleTag({ content: `
    .site-header {min-height:100px;padding-inline:64px}.site-header nav,.hero-actions,.hero-bottom,.letter-composition figcaption{display:none}
    .hero-grid {height:530px;padding:24px 64px 40px;gap:72px;grid-template-columns:1.4fr 1fr}
    .hero-copy h1 {font-size:80px}.hero-copy>.office-eyebrow{margin-bottom:24px}.hero-description{font-size:22px;max-width:450px}
    .letter-composition {max-width:325px;padding:0 16px 0}.letter-sheet{min-height:310px;padding:24px}
    .letter-top{padding-bottom:16px;font-size:12px}.letter-mark{width:32px;height:38px;font-size:22px}
    .letter-greeting{margin-top:16px!important;font-size:16px}.letter-message{font-size:33px;margin-block:16px 24px!important}
    .letter-bottom{font-size:10px}.letter-envelope{min-height:140px;padding:24px;margin-top:-12px;gap:16px}
    .letter-envelope .office-signature{font-size:16px}.envelope-note{font-size:11px}
  ` });
  await mkdir('public', { recursive: true });
  await page.screenshot({ path: 'public/og.png' });
  for (const [size, name] of [[64, 'favicon.png'], [180, 'apple-touch-icon.png']]) {
    await page.setViewportSize({ width: size, height: size });
    await page.evaluate(size => {
      document.body.innerHTML = '';
      const icon = document.createElement('div');
      icon.textContent = 'L.';
      Object.assign(icon.style, { width: size + 'px', height: size + 'px', boxSizing: 'border-box', display: 'grid', placeItems: 'center', color: '#f3f0e7', background: '#71312f', font: `${size * 0.62}px Inconsolata`, paddingBottom: size * 0.04 + 'px' });
      document.body.style.minWidth = '0'; document.body.append(icon);
    }, size);
    await page.screenshot({ path: 'public/' + name });
  }
  console.log('Tarjeta 1200×630 e iconos generados desde la tipografía y composición de la web.');
} finally { await browser.close(); }
