import { caba, projectCaba } from "../../content/caba";
import type { Local } from "../../content/site";
import lechuza from "../../assets/lechuza.webp";

/** The owl on the map, in viewBox units (the map is 1000 wide): about 72 px tall at the reading width, 38 px on a phone. */
const OWL = { width: 90, height: 120 };
const plain = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

type Point = { x: number; y: number };
/** Locals closer than an owl's width share one owl, standing between their dots: Towandas and Cero Café are three blocks apart and two owls there draw one over the other. Each local keeps its own dot. */
function perches(points: Point[]): Point[] {
  const groups: Point[][] = [];
  for (const point of points) {
    const group = groups.find(members => {
      const centre = centroid(members);
      return Math.hypot(centre.x - point.x, centre.y - point.y) < OWL.width;
    });
    if (group) group.push(point); else groups.push([point]);
  }
  return groups.map(centroid);
}
const centroid = (points: Point[]): Point => ({ x: points.reduce((sum, p) => sum + p.x, 0) / points.length, y: points.reduce((sum, p) => sum + p.y, 0) / points.length });

/** The city drawn in one ink from its own data (no tiles, no requests), the barrio of each local in the red of the cover, and the owl standing on each local. The list next to it is the accessible source; the map names the locals in its title. */
export function Mapa({ locales }: { locales: Local[] }) {
  const shaded = new Set(locales.map(local => plain(local.barrio)));
  const points = locales.map(local => projectCaba(local.lat, local.lon));
  return <figure className="mapa-figure">
    <svg className="mapa" viewBox={`0 0 ${caba.width} ${caba.height}`} role="img" aria-labelledby="mapa-title" focusable="false">
      <title id="mapa-title">{`Mapa de la Ciudad de Buenos Aires con una lechuza en cada local: ${locales.map(local => `${local.nombre}, ${local.barrio}`).join("; ")}.`}</title>
      {/* The barrios come from the city's open data (CC BY 4.0): the attribution its licence asks for, inside the map rather than under it. */}
      <desc>Trazado con los barrios de Buenos Aires Data (CC BY 4.0).</desc>
      <g>{caba.barrios.map(barrio => <path key={barrio.nombre} d={barrio.d} className={shaded.has(plain(barrio.nombre)) ? "mapa-barrio mapa-barrio--local" : "mapa-barrio"} />)}</g>
      <path d={caba.outline} className="mapa-contorno" />
      {points.map((point, index) => <circle key={locales[index].nombre} cx={point.x.toFixed(1)} cy={point.y.toFixed(1)} r="5" className="mapa-punto" />)}
      {perches(points).map(({ x, y }) => <image key={`${x.toFixed(1)} ${y.toFixed(1)}`} href={lechuza} width={OWL.width} height={OWL.height} x={(x - OWL.width * 0.42).toFixed(1)} y={(y - OWL.height + 4).toFixed(1)} />)}
    </svg>
  </figure>;
}
