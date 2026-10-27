import { caba, projectCaba } from "../../content/caba";
import type { Local } from "../../content/site";
import lechuza from "../../assets/lechuza.webp";

/** The owl on the map, in viewBox units (the map is 1000 wide): about 72 px tall at the reading width, 38 px on a phone. */
const OWL = { width: 90, height: 120 };
const plain = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

/** The city drawn in one ink from its own data (no tiles, no requests), the barrio of each local in the red of the cover, and the owl standing on each local. The list next to it is the accessible source; the map names the locals in its title. */
export function Mapa({ locales }: { locales: Local[] }) {
  const shaded = new Set(locales.map(local => plain(local.barrio)));
  return <figure className="mapa-figure">
    <svg className="mapa" viewBox={`0 0 ${caba.width} ${caba.height}`} role="img" aria-labelledby="mapa-title" focusable="false">
      <title id="mapa-title">{`Mapa de la Ciudad de Buenos Aires con una lechuza en cada local: ${locales.map(local => `${local.nombre}, ${local.barrio}`).join("; ")}.`}</title>
      {/* The barrios come from the city's open data (CC BY 4.0): the attribution its licence asks for, inside the map rather than under it. */}
      <desc>Trazado con los barrios de Buenos Aires Data (CC BY 4.0).</desc>
      <g>{caba.barrios.map(barrio => <path key={barrio.nombre} d={barrio.d} className={shaded.has(plain(barrio.nombre)) ? "mapa-barrio mapa-barrio--local" : "mapa-barrio"} />)}</g>
      <path d={caba.outline} className="mapa-contorno" />
      {locales.map(local => {
        const { x, y } = projectCaba(local.lat, local.lon);
        return <g key={local.nombre} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
          <circle r="5" className="mapa-punto" />
          <image href={lechuza} width={OWL.width} height={OWL.height} x={-OWL.width * 0.42} y={-OWL.height + 4} />
        </g>;
      })}
    </svg>
  </figure>;
}
