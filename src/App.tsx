import { BrandSignature, Envelope } from "./design-system";
import { site } from "./content/site";

function Cover() {
  return <header className="cover office-surface" data-office-theme="red"><div className="office-container">
    <p className="cover-top">{site.city}</p>
    <h1 className="cover-title"><BrandSignature className="office-signature--display" /></h1>
    <p className="cover-line">Cuentos por carta.</p>
  </div></header>;
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
      <section className="letters office-surface" data-office-theme="red"><div className="office-container letters-inner">
        <p className="letters-lead">Si querés mandar un cuento, vender nuestros cuentos en tu local o hacernos una propuesta, mandanos una carta a:</p>
        <Envelope><PostalAddress /></Envelope>
        <p className="letters-note">Leemos todo lo que llega. Si dejás un mail o un teléfono en la carta, te contactamos.</p>
      </div></section>
    </main>
    <footer className="site-footer office-container"><span>{site.name} · {site.city}</span><span>La Oficina existe.</span></footer>
  </div>;
}
