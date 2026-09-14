import { useState } from "react";
import type { ReactNode } from "react";
import { BrandSignature, Button, EditorialQuote, Eyebrow, PaperCard } from "./design-system";
import { site, focos, buzon, encuentros } from "./content/site";
import { RequestDialog } from "./features/requests/RequestDialog";
import type { RequestKind } from "./features/requests/model";
import { LegalPage } from "./pages/LegalPage";

type ContactAction = (kind: RequestKind) => void;

function ContactLink({ kind, children, onContact, variant = "primary" }: {
  kind: RequestKind; children: ReactNode; onContact: ContactAction;
  variant?: "primary" | "secondary" | "quiet";
}) {
  const externalUrl = kind !== "preferencias" && site.googleFormUrl;
  if (externalUrl) return <a className={`office-button office-button--${variant}`} href={externalUrl}>
    {children}<span className="office-sr-only"> (abre Google Forms)</span><span aria-hidden="true">↗</span>
  </a>;
  return <Button variant={variant} onClick={() => onContact(kind)}>{children}</Button>;
}

function Header({ home = false }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  return <header className="site-header office-container">
    <a href="/" className="site-brand" aria-label="La Oficina de los Últimos Cuentos, inicio"><BrandSignature /></a>
    <nav aria-label="Navegación principal">
      <a href={`${prefix}#correspondencia`}>Las cartas</a><a href={`${prefix}#red`}>La red</a><a href={`${prefix}#encuentros`}>Encuentros</a>
    </nav>
  </header>;
}

function Footer({ onContact }: { onContact: ContactAction }) {
  return <footer className="site-footer office-surface" data-office-theme="night"><div className="office-container">
    <div className="footer-main">
      <div><Eyebrow>La correspondencia sigue abierta</Eyebrow><h2 className="office-heading">Del otro lado,<br /><em>hay alguien.</em></h2></div>
      <div className="footer-contact"><p>Para consultas, marcas y propuestas que tengan algo que ver con este pequeño mundo.</p>
        {site.email ? <a className="office-button office-button--secondary" href={`mailto:${site.email}`}>{site.email}</a>
          : <ContactLink kind="contacto" onContact={onContact} variant="secondary">Escribir a la Oficina <span aria-hidden="true">↗</span></ContactLink>}
      </div>
    </div>
    <div className="footer-bottom"><p>Buenos Aires, Argentina.<br />Una interrupción analógica en medio del ruido digital.</p>
      <div className="footer-links"><a href="/privacidad/">Privacidad</a><a href="/condiciones/">Sobre las consultas</a><button type="button" onClick={() => onContact("preferencias")}>Gestionar avisos y datos</button></div>
    </div>
  </div></footer>;
}

function Landing({ onContact }: { onContact: ContactAction }) {
  const nextEvent = encuentros.filter(event => event.publicado && new Date(event.fin).getTime() >= Date.now()).sort((a, b) => new Date(a.inicio).getTime() - new Date(b.inicio).getTime())[0];
  const activeFocos = focos.filter(foco => foco.publicado);
  return <>
    <div className="hero office-surface" data-office-theme="night">
      <div className="hero-grid office-container">
        <div className="hero-copy"><Eyebrow>Correspondencia desde Buenos Aires</Eyebrow><h1 className="office-display">Todavía hay<br />cosas que llegan<br /><em>en un sobre.</em></h1>
          <p className="hero-description">Escribimos cuentos y los hacemos llegar en papel. Una carta, un pequeño misterio y algo que pasa del otro lado de la pantalla.</p>
          <div className="hero-actions"><ContactLink kind="recibir" onContact={onContact}>Recibir un cuento</ContactLink><ContactLink kind="regalar" onContact={onContact} variant="quiet">Regalar un cuento <span aria-hidden="true">↗</span></ContactLink></div>
        </div>
        <figure className="letter-composition" aria-label="Una carta y un sobre de La Oficina, representados con papel y tipografía">
          <div className="letter-sheet" data-office-theme="paper"><div className="letter-top"><span>Correspondencia<br />de La Oficina</span><span className="letter-mark" aria-hidden="true">L.</span></div>
            <p className="letter-greeting">Para quien encuentre esto:</p><p className="letter-message">Siempre que me tomo un colectivo vacío <em>pido un deseo.</em></p><div className="letter-bottom"><span>Cuento Nº 001</span><span>Buenos Aires</span></div>
          </div>
          <div className="letter-envelope" aria-hidden="true"><BrandSignature /><span className="envelope-note">Abrir cuando el mundo<br />haga demasiado ruido.</span></div>
          <figcaption>Papel. Tinta. Un camino hasta vos.</figcaption>
        </figure>
      </div>
      <div className="hero-bottom office-container"><span className="office-label">La magia todavía viaja en sobre cerrado.</span><a href="#correspondencia">Seguí el hilo <span aria-hidden="true">↓</span></a></div>
    </div>
    <div className="office-surface" data-office-theme="paper">
      <section id="correspondencia" className="section office-container" aria-labelledby="correspondencia-title">
        <div className="section-heading"><Eyebrow>01 / Las cartas</Eyebrow><div><h2 id="correspondencia-title" className="office-heading">Una pequeña resistencia.<br /><em>De mano en mano.</em></h2><p>La Oficina es una red de personas que escribe, guarda su identidad y hace circular cuentos por la ciudad. Nos encontrás en nuestras cartas y en quienes las llevan.</p></div></div>
        <div className="how-grid"><article><span className="step-number">I.</span><h3>Alguien escribe.</h3><p>Un cuento toma forma. Lo imprimimos, lo guardamos en un sobre y lo cerramos para que encuentre a su lector.</p></article><article><span className="step-number">II.</span><h3>La carta viaja.</h3><p>Hasta una puerta, un café o una librería. La red empieza en CABA y busca llevar sus cartas a toda la Argentina.</p></article><article><span className="step-number">III.</span><h3>Algo se abre.</h3><p>Un rato para leer. Una historia que podés guardar, prestar o hacer llegar a alguien más.</p></article></div>
      </section>
      <section id="recibir" className="receive-section" aria-labelledby="recibir-title"><div className="office-container">
        <div className="section-heading"><Eyebrow>02 / De este lado del buzón</Eyebrow><h2 id="recibir-title" className="office-heading">Hay dos formas<br />de empezar esta historia.</h2></div>
        <div className="receive-grid">
          <PaperCard className="receive-card" tone="paper"><Eyebrow>Una carta para vos</Eyebrow><h3>Volver a esperar<br /><em>al cartero.</em></h3><p>La propuesta es simple: una suscripción mensual para recibir una carta con un cuento cada mes y enterarte de nuestros encuentros.</p><ContactLink kind="recibir" onContact={onContact}>Consultar por la suscripción <span aria-hidden="true">↗</span></ContactLink></PaperCard>
          <PaperCard className="receive-card" tone="paper"><Eyebrow>Una carta para alguien</Eyebrow><h3>Hay regalos<br /><em>que se leen.</em></h3><p>Pensá en alguien a quien le vendría bien encontrar una historia en su puerta. Podemos conversar cómo hacerle llegar un cuento.</p><ContactLink kind="regalar" onContact={onContact} variant="secondary">Consultar por un regalo <span aria-hidden="true">↗</span></ContactLink></PaperCard>
        </div><p className="section-note">Por ahora recibimos consultas. Te confirmamos disponibilidad, precio y envío antes de pedir una dirección o coordinar un pago.</p>
      </div></section>
      <section id="red" className="section office-container" aria-labelledby="red-title">
        <div className="section-heading"><Eyebrow>03 / La red subterránea</Eyebrow><div><h2 id="red-title" className="office-heading">La Oficina también<br /><em>vive en la ciudad.</em></h2><p>Cafés, librerías, bares y espacios culturales. Lugares donde un cuento puede pasar de una mano a otra.</p></div></div>
        {activeFocos.length ? <div className="focos-list">{activeFocos.map(foco => <article className="foco" key={foco.id}><Eyebrow>{foco.barrio} · {foco.ciudad}</Eyebrow><h3>{foco.nombre}</h3><p>{foco.direccion}<br />{foco.horarios}</p><p>{foco.modalidad}</p><a href={foco.urlMapa} target="_blank" rel="noreferrer">Cómo llegar <span aria-hidden="true">↗</span><span className="office-sr-only"> (abre otra pestaña)</span></a></article>)}</div> : <div className="network-empty"><span className="office-label">Buenos Aires / Primeras coordenadas</span><p>Estamos tejiendo la red.<br />Acá vas a encontrar nuestros puntos de distribución cuando estén confirmados.</p></div>}
        <div className="join-space"><div><h3>¿Tu espacio podría ser un foco?</h3><p>Si tenés un lugar donde nuestros cuentos puedan quedarse un rato, nos gustaría conocerlo.</p></div><ContactLink kind="foco" onContact={onContact} variant="secondary">Sumar un espacio <span aria-hidden="true">↗</span></ContactLink></div>
      </section>
      <section id="mensajeros" className="messenger-section" aria-labelledby="mensajeros-title"><div className="office-container messenger-grid">
        <PaperCard tone="olive" className="messenger-card"><Eyebrow>Correspondencia abierta</Eyebrow><EditorialQuote>Una red existe<br />porque alguien<br /><em>lleva algo<br />a otro lugar.</em></EditorialQuote><BrandSignature /></PaperCard>
        <div className="messenger-copy"><Eyebrow>04 / Los mensajeros</Eyebrow><h2 id="mensajeros-title" className="office-heading">Quizás también<br />seas parte<br /><em>de la Oficina.</em></h2><p>Los mensajeros se acercan con una carta y un cuento propio. La Oficina lee, selecciona historias para publicar y acuerda cómo hacerlas circular.</p><p>Si vivís en otra ciudad, también podés ayudarnos a llevar la correspondencia hasta allí.</p>
          {buzon ? <div className="postal-address"><Eyebrow>Enviá tu carta a</Eyebrow><address>{buzon.destinatario}<br />{buzon.direccion}<br />{buzon.codigoPostal} · {buzon.ciudad}</address><p>{buzon.instrucciones}</p><a href={buzon.condicionesUrl}>Leer condiciones de la convocatoria</a></div> : <p className="office-muted">Estamos preparando el buzón. Publicaremos la dirección y las condiciones de la convocatoria cuando esté listo.</p>}
          <ContactLink kind="mensajero" onContact={onContact} variant="secondary">Consultar cómo participar <span aria-hidden="true">↗</span></ContactLink>
        </div>
      </div></section>
      <section id="encuentros" className="section office-container" aria-labelledby="encuentros-title">
        <div className="section-heading"><Eyebrow>05 / Fuera del sobre</Eyebrow><div><h2 id="encuentros-title" className="office-heading">A veces, la historia<br /><em>nos encuentra juntos.</em></h2><p>También nos reunimos para escuchar, leer y encontrarnos. La correspondencia tiene sus noches en la ciudad.</p></div></div>
        <div className="event-panel"><div><Eyebrow>{nextEvent ? "Próximo encuentro" : "La próxima cita"}</Eyebrow><h3>{nextEvent?.titulo || "Todavía no anunciamos el próximo encuentro."}</h3>
          {nextEvent ? <><p><time dateTime={nextEvent.inicio}>{new Intl.DateTimeFormat("es-AR", { dateStyle: "full", timeStyle: "short", timeZone: "America/Argentina/Buenos_Aires" }).format(new Date(nextEvent.inicio))}</time></p><p>{nextEvent.lugar}<br />{nextEvent.acceso}</p><p>{nextEvent.descripcion}</p><p className="office-label">{nextEvent.estado === "agotado" ? "Cupo completo" : nextEvent.estado === "cancelado" ? "Encuentro cancelado" : "Encuentro confirmado"}</p>{nextEvent.reservaUrl && nextEvent.estado === "disponible" && <a className="office-button office-button--secondary" href={nextEvent.reservaUrl}>Consultar reserva <span aria-hidden="true">↗</span></a>}</> : <p>Cuando haya fecha, vas a encontrarla acá. Si querés, también podemos avisarte por mail.</p>}
        </div><div className="event-action"><ContactLink kind="encuentros" onContact={onContact}>Recibir avisos de encuentros</ContactLink><p>Solo si vos querés.<br />Podés pedir la baja en cualquier momento.</p></div></div>
      </section>
      <div className="closing-line office-container"><p>Esta página termina acá.<br /><em>La historia sigue afuera.</em></p><a href="#contenido" aria-label="Volver al comienzo">↑</a></div>
    </div>
  </>;
}

export default function App() {
  const [request, setRequest] = useState<RequestKind>("recibir");
  const [open, setOpen] = useState(false);
  const contact: ContactAction = kind => { setRequest(kind); setOpen(true); };
  const path = window.location.pathname.replace(/\/+$/, "");
  const legal = path === "/privacidad" ? "privacidad" : path === "/condiciones" ? "condiciones" : null;
  return <div className="site office-surface" data-office-theme="paper"><a className="skip-link" href="#contenido">Saltar al contenido</a>
    <div className="office-surface" data-office-theme="night"><Header home={!legal} /></div>
    {legal ? <LegalPage kind={legal} onContact={contact} /> : <main id="contenido" tabIndex={-1}><Landing onContact={contact} /></main>}
    <Footer onContact={contact} /><RequestDialog open={open} kind={request} onKindChange={setRequest} onClose={() => setOpen(false)} />
  </div>;
}
