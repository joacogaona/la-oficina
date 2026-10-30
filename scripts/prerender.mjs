// Runs after `vite build`: renders each page into its HTML and adds structured data, so search engines, previews and browsers
// without JavaScript get the whole page. The home page carries the Organization; the agenda, its confirmed dates as Events. Reads only the build output.
import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { build } from "vite";

const ssrDir = resolve("node_modules/.office-prerender");
await build({ configFile: resolve("vite.config.ts"), logLevel: "warn", build: { ssr: "src/entry-server.tsx", outDir: ssrDir, emptyOutDir: true, copyPublicDir: false } });
const entry = (await readdir(ssrDir)).find(name => /^entry-server\.m?js$/.test(name));
if (!entry) throw new Error("No se generó el módulo de pre-render.");
const { render, renderAgenda, site, agenda } = await import(pathToFileURL(resolve(ssrDir, entry)).href);

async function prerender(file, html, structuredData) {
  const path = resolve(file);
  let page = await readFile(path, "utf8");
  const mount = '<div id="root"></div>';
  if (page.split(mount).length !== 2) throw new Error(`${file} no tiene un único <div id="root"></div>.`);
  const canonical = page.match(/<link rel="canonical" href="([^"]+)">/)?.[1];
  const description = page.match(/name="description"\s+content="([^"]*)"/)?.[1];
  if (!canonical || !description) throw new Error(`Faltan canonical o description en ${file}.`);
  const jsonLd = JSON.stringify(structuredData({ canonical, description })).replace(/</g, "\\u003c");
  page = page
    .replace(mount, () => `<div id="root">${html}</div>`)
    .replace("</head>", () => `  <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
  await writeFile(path, page);
}

// Only what the page already says: name, description, images and the postal address (or the city). No coverage or claims the page does not make.
await prerender("dist/index.html", render(), ({ canonical, description }) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: canonical,
  description,
  logo: new URL("/apple-touch-icon.png", canonical).href,
  image: new URL("/og.png", canonical).href,
  // Free-form text: the mailbox lines are a post-office box, branch and city, not a street; without a mailbox, the city.
  address: site.postal.length ? site.postal.join(", ") : site.city,
}));

// The agenda's confirmed dates from the day the sources were checked, as the page lists them: name, kind, venue and address, the public link. Classes without a date are not events.
const events = agenda.actividades.flatMap(actividad => actividad.fechas.filter(fecha => fecha.dia >= agenda.revisado).map(fecha => ({
  "@type": "Event",
  name: actividad.nombre,
  description: actividad.tipo,
  startDate: fecha.hora ? `${fecha.dia}T${fecha.hora}:00-03:00` : fecha.dia,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: actividad.lugar || actividad.barrio,
    address: { "@type": "PostalAddress", ...(actividad.direccion ? { streetAddress: actividad.direccion } : {}), addressLocality: `${actividad.barrio}, Ciudad Autónoma de Buenos Aires`, addressCountry: "AR" },
  },
  ...(actividad.enlace ? { url: actividad.enlace } : {}),
  ...(actividad.entrada && /^gratis|^entrada libre/i.test(actividad.entrada) ? { isAccessibleForFree: true } : {}),
})));
await prerender("dist/agenda/index.html", renderAgenda(), ({ canonical }) => ({ "@context": "https://schema.org", "@graph": [{ "@type": "WebPage", url: canonical, name: "Agenda de lecturas y micrófonos abiertos en Buenos Aires", isPartOf: { "@type": "WebSite", name: site.name, url: new URL("/", canonical).href } }, ...events] }));

await rm(ssrDir, { recursive: true, force: true });
console.log(`Pre-render listo: dist/index.html y dist/agenda/index.html traen la página completa y los datos estructurados (${events.length} fechas en la agenda).`);
