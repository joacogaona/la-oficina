import { useEffect, useState } from "react";
import { agenda, type Actividad } from "../../content/agenda";
import { site } from "../../content/site";
import { AgendaMapa, barrioId, plain } from "./AgendaMapa";

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
/** How far ahead the dates reach, in days: two weeks always show something, a weekend often does not. */
const VENTANA = 14;

/** Dates are plain days in Buenos Aires ("2026-11-03"); noon UTC keeps the weekday right on any server or browser. */
const comoFecha = (dia: string) => new Date(`${dia}T12:00:00Z`);
const sumarDias = (dia: string, dias: number) => { const fecha = comoFecha(dia); fecha.setUTCDate(fecha.getUTCDate() + dias); return fecha.toISOString().slice(0, 10); };
const conDia = (dia: string) => { const fecha = comoFecha(dia); return `${DIAS[fecha.getUTCDay()]} ${fecha.getUTCDate()} de ${MESES[fecha.getUTCMonth()]}`; };
const conAnio = (dia: string) => { const fecha = comoFecha(dia); return `${fecha.getUTCDate()} de ${MESES[fecha.getUTCMonth()]} de ${fecha.getUTCFullYear()}`; };
const hoyEnBuenosAires = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Argentina/Buenos_Aires", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());

type Cita = { dia: string; hora?: string; actividad: Actividad };
const citas: Cita[] = agenda.actividades
  .flatMap(actividad => actividad.fechas.map(fecha => ({ ...fecha, actividad })))
  .sort((a, b) => `${a.dia} ${a.hora ?? "99"}`.localeCompare(`${b.dia} ${b.hora ?? "99"}`));

const grupos = [...agenda.actividades.reduce((porBarrio, actividad) => {
  const clave = plain(actividad.barrio);
  porBarrio.set(clave, [...(porBarrio.get(clave) ?? []), actividad]);
  return porBarrio;
}, new Map<string, Actividad[]>()).values()].map(actividades => ({ nombre: actividades[0].barrio, actividades }));

/** The kind is a tag after the name, unless the name already says it ("Club de lectura Por Qué Leer"). */
const tipoVisible = (actividad: Actividad) => plain(actividad.nombre).includes(plain(actividad.tipo)) ? undefined : actividad.tipo;
const lugarConDireccion = (actividad: Actividad) => [actividad.lugar, actividad.direccion].filter(Boolean).join(", ");
const separar = (partes: (string | undefined)[]) => partes.filter(Boolean).join(" · ");

/** The name is the public link, opened in another tab; without a link, plain text. */
function Nombre({ actividad }: { actividad: Actividad }) {
  if (!actividad.enlace) return <span className="agenda-nombre">{actividad.nombre}</span>;
  return <a className="agenda-link agenda-nombre" href={actividad.enlace} target="_blank" rel="noreferrer">{actividad.nombre}<span className="office-sr-only"> (abre en otra pestaña)</span></a>;
}

/** Two lines per activity: the name with its kind, then one muted line with the rest. */
function Cuerpo({ actividad, meta }: { actividad: Actividad; meta: string }) {
  const tipo = tipoVisible(actividad);
  return <div className="agenda-body">
    <p className="agenda-linea"><Nombre actividad={actividad} />{tipo && <span className="agenda-tipo">{tipo}</span>}</p>
    {meta && <p className="agenda-meta">{meta}</p>}
  </div>;
}

/** One confirmed date: the hour in its column; where, how to get in and who gives it. */
function CitaItem({ cita }: { cita: Cita }) {
  const { actividad } = cita;
  const donde = [lugarConDireccion(actividad), actividad.barrio].filter(Boolean).join(", ");
  const meta = separar([cita.hora ? undefined : "Hora a confirmar", donde, actividad.entrada, actividad.quien && `con ${actividad.quien}`]);
  return <li className="agenda-item agenda-item--cita">
    <span className="agenda-hora">{cita.hora ?? ""}</span>
    <Cuerpo actividad={actividad} meta={meta} />
  </li>;
}

/** A cycle or a class in its barrio: when, where, how to get in and who gives it. */
function ActividadItem({ actividad }: { actividad: Actividad }) {
  const meta = separar([actividad.cuando, lugarConDireccion(actividad), actividad.entrada, actividad.quien && `con ${actividad.quien}`]);
  return <li className="agenda-item"><Cuerpo actividad={actividad} meta={meta} /></li>;
}

function Fechas({ desde, hoy }: { desde: string; hoy: string | null }) {
  const hasta = sumarDias(desde, VENTANA);
  const proximas = citas.filter(cita => cita.dia >= desde && cita.dia < hasta);
  const dias = [...new Set(proximas.map(cita => cita.dia))];
  const titulo = (dia: string) => {
    const nombre = conDia(dia);
    if (hoy === dia) return `Hoy, ${nombre}`;
    if (hoy && sumarDias(hoy, 1) === dia) return `Mañana, ${nombre}`;
    return nombre[0].toUpperCase() + nombre.slice(1);
  };
  if (dias.length === 0) return <p className="block-text">No tenemos fechas confirmadas para las próximas dos semanas. Abajo están todos los ciclos y talleres, por barrio.</p>;
  return <div className="agenda-dias">
    {dias.map(dia => <section key={dia} className="agenda-dia" aria-labelledby={`dia-${dia}`}>
      <h3 id={`dia-${dia}`} className="agenda-titulo office-signature">{titulo(dia)}</h3>
      <ul className="agenda-lista">{proximas.filter(cita => cita.dia === dia).map(cita => <CitaItem key={`${cita.actividad.id} ${cita.dia} ${cita.hora ?? ""}`} cita={cita} />)}</ul>
    </section>)}
  </div>;
}

/** The agenda page: confirmed dates for the next two weeks, then everything by barrio with the map. Pre-rendered at build time from the date the sources were checked;
 * in the browser the dates move to today in Buenos Aires, so a page built days ago does not show past dates. */
export function AgendaPage() {
  const [hoy, setHoy] = useState<string | null>(null);
  useEffect(() => setHoy(hoyEnBuenosAires()), []);
  const desde = hoy ?? agenda.revisado;
  return <div className="site office-surface" data-office-theme="paper">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <header className="cover cover--agenda office-surface" data-office-theme="red"><div className="office-container">
      <div className="cover-top">
        <a className="cover-home" href="/">{site.name}</a>
        <nav aria-label="Secciones" className="cover-nav">
          <a href="#fechas">Fechas</a>
          <a href="#barrios">Barrios</a>
          <a href="/#cartas">Cartas</a>
        </nav>
      </div>
      <h1 className="agenda-title">Agenda</h1>
      <p className="cover-line">Talleres, clases, ciclos y lecturas de escritura en la Ciudad de Buenos Aires. En persona.</p>
    </div></header>
    <main id="contenido" tabIndex={-1}>
      <div className="office-container"><div className="page">
        <p className="manifiesto">Hay una ciudad que todavía escribe en papel y lee en voz alta. Esta es su agenda.</p>
        <p className="block-text">Entra lo que está abierto hoy: ciclos a los que se puede ir y talleres en los que se puede anotar. La armamos con lo que publica cada uno y la revisamos a mano; antes de ir, confirmá con quien organiza. Revisada el {conAnio(agenda.revisado)}.</p>
      </div></div>
      <section id="fechas" className="block office-container" aria-labelledby="fechas-title">
        <h2 id="fechas-title" className="site-label block-label">Próximas fechas</h2>
        <div className="block-body">
          <Fechas desde={desde} hoy={hoy} />
        </div>
      </section>
      <section id="barrios" className="block office-container" aria-labelledby="barrios-title">
        <h2 id="barrios-title" className="site-label block-label">Por barrio</h2>
        <div className="block-body block-body--wide">
          <div className="locales-layout agenda-barrios">
            <div className="agenda-lado">
              <AgendaMapa barrios={grupos.map(grupo => ({ nombre: grupo.nombre, cantidad: grupo.actividades.length }))} />
              <nav className="agenda-indice" aria-label="Barrios con actividades">
                <ul>{grupos.map(grupo => <li key={grupo.nombre}><a href={`#${barrioId(grupo.nombre)}`}>{grupo.nombre}<span className="agenda-indice-n"> {grupo.actividades.length}</span></a></li>)}</ul>
              </nav>
            </div>
            <div className="agenda-grupos">
              {grupos.map(grupo => <section key={grupo.nombre} id={barrioId(grupo.nombre)} className="agenda-barrio" aria-labelledby={`${barrioId(grupo.nombre)}-title`}>
                <h3 id={`${barrioId(grupo.nombre)}-title`} className="agenda-titulo office-signature">{grupo.nombre}</h3>
                <ul className="agenda-lista">{grupo.actividades.map(actividad => <ActividadItem key={actividad.id} actividad={actividad} />)}</ul>
              </section>)}
            </div>
          </div>
        </div>
      </section>
      <section id="sumar" className="block office-container" aria-labelledby="sumar-title">
        <h2 id="sumar-title" className="site-label block-label">Sumar una actividad</h2>
        <div className="block-body">
          <p className="block-text">Si das un taller u organizás un ciclo en la Ciudad y querés que esté en esta agenda, mandanos una carta. <a href="/#cartas">La dirección está en la página principal.</a></p>
        </div>
      </section>
    </main>
    <footer className="site-footer office-container"><span>{site.name} · {site.city}</span><span>La Oficina existe.</span></footer>
  </div>;
}
