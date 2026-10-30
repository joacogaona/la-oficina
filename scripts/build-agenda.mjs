// Builds src/content/agenda.ts from the agenda research in ../agenda/data (the LODLUC workspace, outside this repo).
// Only rows with decision "sí" reach the site, and only their public fields: no notes, no organisers' contacts beyond the public link,
// no amounts (entry is "Gratis", "Pago", "A la gorra"...) and no street address for classes given at home. Only what is open now reaches the site:
// a row whose enrollment is closed is "cerrado" in the data and stays out until it reopens. Run it by hand after curating:
//   node scripts/build-agenda.mjs
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const dataDir = resolve(process.argv[2] || "../agenda/data");
const out = resolve("src/content/agenda.ts");

/** RFC 4180 CSV: quoted fields, doubled quotes, newlines inside quotes. */
function parseCsv(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = ""; if (row.some(Boolean)) rows.push(row); row = [];
    } else field += c;
  }
  if (field || row.length) { row.push(field); if (row.some(Boolean)) rows.push(row); }
  const [header, ...body] = rows;
  return body.map(values => Object.fromEntries(header.map((name, index) => [name, (values[index] ?? "").trim()])));
}
const read = name => existsSync(resolve(dataDir, name)) ? parseCsv(readFileSync(resolve(dataDir, name), "utf8")) : [];

/** Same key as the map: no accents, lower case, and "Gral." spelled out (the city writes "Villa Gral. Mitre"). */
const plain = text => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\bgral\.?\s*/g, "general ").trim();
const barrios = [...readFileSync(resolve("src/content/caba.ts"), "utf8").matchAll(/nombre: "([^"]+)"/g)].map(match => plain(match[1]));
const slug = text => plain(text).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const capital = text => text ? text[0].toUpperCase() + text.slice(1) : text;

const ciclo = {
  "ciclo de lectura": "Ciclo de lectura", "ciclo de poesía": "Ciclo de poesía", "club de lectura": "Club de lectura", "open mic": "Micrófono abierto",
  "presentaciones": "Presentaciones", "slam": "Slam de poesía", "conversaciones": "Conversaciones", "varieté": "Varieté",
  "lectura abierta": "Lectura abierta", "escritura en vivo": "Taller abierto",
};
/** One short label per kind of class, from the research columns; a row's tipo_publico (for instance "Club de lectura") wins. */
const tallerDisciplina = { "lectura": "Taller de lectura", "poesía": "Taller de poesía", "narrativa": "Taller de narrativa", "escritura creativa": "Taller de escritura", "crónica y no ficción": "Taller de no ficción" };
const tallerTipo = (tipo, disciplina) => {
  const base = plain(tipo || "taller");
  if (base === "clinica") return "Clínica de obra";
  if (base === "seminario") return "Seminario";
  if (base === "curso") return "Curso";
  return tallerDisciplina[disciplina] || "Taller";
};
/** The public link: the first website in the field, otherwise the first Instagram account ("@cuenta" or "cuenta"). */
const link = value => {
  if (!value) return undefined;
  const url = value.match(/https:\/\/[^\s,;()]+/)?.[0]?.replace(/[.)]+$/, "");
  if (url) return url;
  const handle = value.match(/@?([A-Za-z0-9._]+)/)?.[1]?.replace(/\.$/, "");
  if (handle && !value.includes("://")) return `https://www.instagram.com/${handle}/`;
  throw new Error(`Enlace inválido: ${value}`);
};
const fechas = (value, nombre) => (value || "").split(";").map(part => part.trim()).filter(Boolean).map(part => {
  const match = part.match(/^(\d{4}-\d{2}-\d{2})(?:\s+(\d{2}:\d{2}))?$/);
  if (!match) throw new Error(`Fecha inválida en ${nombre}: ${part}`);
  return match[2] ? { dia: match[1], hora: match[2] } : { dia: match[1] };
});

const actividades = [];
const revisados = [];
function add(row, clase, tipo, extra = {}) {
  if (row.decision !== "sí") return;
  const barrio = row.barrio.replace(/\s*\(.*\)$/, "").trim();
  if (!barrios.includes(plain(barrio))) throw new Error(`Barrio fuera del mapa en ${row.nombre}: "${row.barrio}"`);
  if (!row.cuando) throw new Error(`Falta "cuando" en ${row.nombre}`);
  const item = {
    id: slug(`${row.nombre_publico || row.nombre} ${row.lugar || row.barrio}`), clase, nombre: row.nombre_publico || row.nombre, tipo: row.tipo_publico || tipo, cuando: row.cuando,
    ...(row.entrada ? { entrada: row.entrada } : {}),
    ...(row.lugar ? { lugar: row.lugar } : {}),
    ...(row.direccion ? { direccion: row.direccion } : {}),
    barrio,
    ...extra,
    fechas: fechas(row.fechas, row.nombre),
  };
  if (actividades.some(other => other.id === item.id)) throw new Error(`Nombre repetido: ${row.nombre}`);
  actividades.push(item);
  const verificado = (row.verificado || row.ultima_senal || "").slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(verificado)) revisados.push(verificado);
}

for (const row of read("ciclos.csv")) {
  const tipo = ciclo[row.tipo];
  if (row.decision === "sí" && !tipo) throw new Error(`Tipo sin etiqueta pública: ${row.tipo}`);
  add(row, row.tipo === "escritura en vivo" ? "taller" : "ciclo", tipo, { enlace: link(row.enlace || row.fuente) });
}
for (const row of read("talleres.csv")) {
  add(row, "taller", tallerTipo(row.tipo, row.disciplina), {
    ...(row.quien_da ? { quien: row.quien_da } : {}),
    enlace: link(row.enlace || row.contacto_publico || row.fuente),
  });
}
actividades.sort((a, b) => plain(a.barrio).localeCompare(plain(b.barrio)) || a.clase.localeCompare(b.clase) || plain(a.nombre).localeCompare(plain(b.nombre)));
const revisado = revisados.sort().at(-1);
if (!revisado) throw new Error("No hay fecha de revisión en los datos.");

writeFileSync(out, `/** Generated by scripts/build-agenda.mjs from the agenda research (../agenda/data): only rows Joaquín approved (decision "sí"), only public fields. Do not edit by hand. */
export type Fecha = { dia: string; hora?: string };
export type Actividad = {
  id: string;
  /** "ciclo": readings, poetry, open mics, talks; "taller": classes and workshops. */
  clase: "ciclo" | "taller";
  nombre: string;
  tipo: string;
  /** When it happens, as a sentence. */
  cuando: string;
  /** Free, paid, by the hat... never an amount. */
  entrada?: string;
  lugar?: string;
  /** Street address of a public venue only; empty for classes given at home. */
  direccion?: string;
  /** Spelled as in the city's barrios so the map can shade it. */
  barrio: string;
  /** Who gives a class, when they publish it. */
  quien?: string;
  /** Public page or account, opened only when the reader asks. */
  enlace?: string;
  /** Confirmed upcoming dates (Buenos Aires time). */
  fechas: Fecha[];
};

export const agenda = {
  /** Last day the sources were checked. */
  revisado: ${JSON.stringify(revisado)},
  actividades: ${JSON.stringify(actividades, null, 2).replace(/\n/g, "\n  ")} as Actividad[],
};
`);
console.log(`agenda.ts: ${actividades.length} actividades (${actividades.filter(a => a.clase === "taller").length} talleres), ${new Set(actividades.map(a => plain(a.barrio))).size} barrios, revisado ${revisado}.`);
