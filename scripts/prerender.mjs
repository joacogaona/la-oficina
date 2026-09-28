// Runs after `vite build`: renders the page into dist/index.html and adds the Organization JSON-LD,
// so search engines, previews and browsers without JavaScript get the whole page. Reads only the build output.
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const distHtml = resolve("dist/index.html");
const ssrDir = resolve("node_modules/.office-prerender");
await build({ configFile: resolve("vite.config.ts"), logLevel: "warn", build: { ssr: "src/entry-server.tsx", outDir: ssrDir, emptyOutDir: true, copyPublicDir: false } });
const entry = (await readdir(ssrDir)).find(name => /^entry-server\.m?js$/.test(name));
if (!entry) throw new Error("No se generó el módulo de pre-render.");
const { render, site } = await import(pathToFileURL(resolve(ssrDir, entry)).href);

let html = await readFile(distHtml, "utf8");
const mount = '<div id="root"></div>';
if (html.split(mount).length !== 2) throw new Error('dist/index.html no tiene un único <div id="root"></div>.');
const canonical = html.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
const description = html.match(/name="description"\s+content="([^"]*)"/)?.[1];
if (!canonical || !description) throw new Error("Faltan canonical o description en dist/index.html.");

// Only what the page already says: name, description, images and the postal address (or the city). No coverage or claims the page does not make.
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: canonical,
  description,
  logo: new URL("/apple-touch-icon.png", canonical).href,
  image: new URL("/og.png", canonical).href,
  // Free-form text: the mailbox lines are a post-office box, branch and city, not a street; without a mailbox, the city.
  address: site.postal.length ? site.postal.join(", ") : site.city,
};
const jsonLd = JSON.stringify(organization).replace(/</g, "\\u003c");

html = html
  .replace(mount, () => `<div id="root">${render()}</div>`)
  .replace("</head>", () => `  <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
await writeFile(distHtml, html);
await rm(ssrDir, { recursive: true, force: true });
console.log("Pre-render listo: dist/index.html trae la página completa y los datos estructurados.");
