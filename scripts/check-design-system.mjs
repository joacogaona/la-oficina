import { readFileSync } from 'node:fs';

// Guard semantic contrast when tokens change. Does not certify a whole page.
const css = readFileSync(new URL('../src/design-system/tokens.css', import.meta.url), 'utf8');
const palette = Object.fromEntries([...css.matchAll(/--office-color-([\w-]+):\s*(#[\da-f]{6});/gi)].map(([, name, hex]) => [name, hex]));
function luminance(hex) {
  const [r, g, b] = hex.slice(1).match(/../g).map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const pairs = [];
for (const background of ['paper', 'paper-raised']) {
  for (const foreground of ['ink', 'muted', 'wax', 'wax-hover', 'success', 'error']) pairs.push([foreground, background, 4.5]);
  pairs.push(['control', background, 3]);
}
for (const background of ['night', 'night-raised']) {
  for (const foreground of ['paper', 'night-muted', 'night-action', 'night-success', 'night-error']) pairs.push([foreground, background, 4.5]);
  pairs.push(['night-control', background, 3], ['blue', background, 3]);
}
for (const background of ['red', 'olive', 'blue', 'clay', 'night-action', 'night-action-hover']) pairs.push(['ink', background, 4.5]);
for (const background of ['wax', 'wax-hover']) pairs.push(['paper-raised', background, 4.5]);
// Web subset: ink action on paper, paper text on ink, ink on the red cover.
for (const background of ['ink', 'night']) pairs.push(['paper', background, 4.5]);
pairs.push(['ink', 'red', 4.5], ['ink', 'red', 3]);
let failures = 0;
for (const [foreground, background, threshold] of pairs) {
  if (!palette[foreground] || !palette[background]) throw new Error('Missing contrast token: ' + foreground + '/' + background);
  const a = luminance(palette[foreground]); const b = luminance(palette[background]);
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  if (ratio < threshold) {
    failures++;
    console.error('FAIL ' + foreground + '/' + background + ': ' + ratio.toFixed(2) + ':1, needs ' + threshold + ':1');
  }
}
if (failures) process.exitCode = 1;
else console.log(pairs.length + ' contrast pairs pass: text >= 4.5:1; control borders and focus >= 3:1.');
