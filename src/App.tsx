import { BrandSignature, Envelope } from "./design-system";
import { site } from "./content/site";
import { Mapa } from "./features/locales/Mapa";
import { SubscriptionForm } from "./features/suscripcion/SubscriptionForm";
import lechuza from "./assets/lechuza.webp";

function Cover() {
  return <header className="cover office-surface" data-office-theme="red"><div className="office-container">
    <div className="cover-top">
      <p>{site.city}</p>
      <nav aria-label="Secciones" className="cover-nav">
        {site.locales.length > 0 && <a href="#cafes">Cafés</a>}
        <a href="#suscripcion">Suscripción</a>
        <a href="#cartas">Cartas</a>
        <a href="/agenda/">Agenda</a>
      </nav>
    </div>
    <h1 className="cover-title"><BrandSignature className="office-signature--display" /></h1>
    <p className="cover-line">Cuentos por carta.</p>
  </div></header>;
}

/** Where the cuentos are sold. Only shops listed in `site.locales`: confirmed, with the agreement in place. */
function Locales() {
  if (site.locales.length === 0) return null;
  return <section id="cafes" className="block office-container" aria-labelledby="locales-title">
    <h2 id="locales-title" className="site-label block-label">Dónde encontrarlos</h2>
    <div className="block-body block-body--wide">
      <div className="locales-layout">
        <Mapa locales={site.locales} />
        <ul className="locales">
          {site.locales.map(local => <li key={local.nombre} className="local">
            <img className="local-lechuza" src={lechuza} alt="" width="48" height="64" decoding="async" />
            <div className="local-body">
              <span className="local-name">{local.nombre}</span>
              {local.direccion && <span className="local-address">{local.direccion}</span>}
              <span className="local-place">{local.barrio}, {local.ciudad}</span>
              {local.mapa && <a className="local-link" href={local.mapa} target="_blank" rel="noreferrer">Cómo llegar<span className="office-sr-only"> (abre Google Maps en otra pestaña)</span></a>}
            </div>
          </li>)}
        </ul>
      </div>
    </div>
  </section>;
}

/** Monthly subscription: one cuento a month to the reader's address, within the city for now. Two lines and a button; the form unfolds under it (a native details, so it works without JavaScript). The address comes by the form; the payment, by the Mercado Pago link after it. */
function Subscription() {
  return <section id="suscripcion" className="block office-container" aria-labelledby="suscripcion-title">
    <h2 id="suscripcion-title" className="site-label block-label">Un cuento por mes</h2>
    <div className="block-body">
      <p className="block-lead">Un cuento por mes en tu casa: {site.suscripcion.precioMensual} por mes, envío incluido.</p>
      <p className="block-text">Por ahora, solo en la Ciudad de Buenos Aires.</p>
      {site.formEndpoint
        ? <details className="subscription">
          <summary className="subscription-toggle office-button office-button--primary">Suscribirme</summary>
          <div className="subscription-panel"><SubscriptionForm /></div>
        </details>
        : <p className="block-text">Por ahora se pide por carta: nombre, dirección y un mail, a la dirección de abajo.</p>}
    </div>
  </section>;
}

function PostalAddress() {
  if (site.postal.length === 0) return <p className="postal-pending"><span className="site-label">Dirección pendiente</span>Todavía no tenemos casilla de correo. La dirección se publica acá cuando esté confirmada.</p>;
  return <address className="postal">{[site.name, ...site.postal].map(line => <span key={line}>{line}</span>)}</address>;
}

export default function App() {
  return <div className="site office-surface" data-office-theme="paper">
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    <Cover />
    <main id="contenido" tabIndex={-1}>
      <div className="office-container"><div className="page">
        {site.manifiesto.map(paragraph => <p key={paragraph} className="manifiesto">{paragraph}</p>)}
      </div></div>
      <Locales />
      <Subscription />
      <section id="cartas" className="letters office-surface" data-office-theme="red"><div className="office-container letters-inner">
        <p className="letters-lead">Si querés mandar un cuento, vender nuestros cuentos en tu local o hacernos una propuesta, mandanos una carta a:</p>
        <Envelope><PostalAddress /></Envelope>
        <p className="letters-note">Leemos todo lo que llega. Si dejás un mail o un teléfono en la carta, te contactamos.</p>
      </div></section>
    </main>
    <footer className="site-footer office-container"><span>{site.name} · {site.city}</span><span>La Oficina existe.</span></footer>
  </div>;
}
