import { caba } from "../../content/caba";

/** Key to match a barrio with the map: no accents, lower case, "Gral." spelled out (the city writes "Villa Gral. Mitre"). */
export const plain = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\bgral\.?\s*/g, "general ").trim();
/** Anchor of a barrio's group in the list under the map. */
export const barrioId = (barrio: string) => "barrio-" + plain(barrio).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** The same city as the shops' map, drawn from its own data, without owls (the owl marks where the cuentos are sold).
 * Barrios with something in the agenda are red and are links to their group in the list, so the map works by keyboard and without JavaScript. */
export function AgendaMapa({ barrios }: { barrios: { nombre: string; cantidad: number }[] }) {
  const conActividad = new Map(barrios.map(barrio => [plain(barrio.nombre), barrio]));
  return <figure className="mapa-figure agenda-mapa">
    <svg className="mapa" viewBox={`0 0 ${caba.width} ${caba.height}`} role="group" aria-labelledby="agenda-mapa-title">
      <title id="agenda-mapa-title">{`Mapa de la Ciudad de Buenos Aires. Barrios con actividades: ${barrios.map(barrio => barrio.nombre).join(", ")}.`}</title>
      {/* The barrios come from the city's open data (CC BY 4.0): the attribution its licence asks for, inside the map rather than under it. */}
      <desc>Trazado con los barrios de Buenos Aires Data (CC BY 4.0).</desc>
      <g>{caba.barrios.map(barrio => {
        const match = conActividad.get(plain(barrio.nombre));
        if (!match) return <path key={barrio.nombre} d={barrio.d} className="mapa-barrio" />;
        return <a key={barrio.nombre} href={`#${barrioId(match.nombre)}`} aria-label={`${match.nombre}: ${match.cantidad === 1 ? "una actividad" : `${match.cantidad} actividades`}`}>
          <path d={barrio.d} className="mapa-barrio mapa-barrio--local" />
        </a>;
      })}</g>
      <path d={caba.outline} className="mapa-contorno" />
    </svg>
  </figure>;
}
