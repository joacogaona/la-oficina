import { StrictMode, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrandSignature, Button, CheckboxField, Dialog, EditorialQuote, Eyebrow,
  Notice, PaperCard, SelectField, TextAreaField, TextField,
} from "../src/design-system";
import type { OfficeTheme } from "../src/design-system";
import "../src/design-system/styles.css";
import "./specimen.css";

const sections = [
  ["identidad", "01", "Identidad"], ["tipografia", "02", "Tipografía"],
  ["color", "03", "Color"], ["componentes", "04", "Componentes"],
  ["voz", "05", "Voz"], ["referencias", "06", "Referencias"],
];
const swatches = [
  ["Papel", "paper", "#F3F0E7", "La superficie de lectura."],
  ["Tinta", "ink", "#1C1C18", "Texto, firma y estructura."],
  ["Lacre", "wax", "#71312F", "Acción principal sobre papel."],
  ["Rojo", "red", "#D2645B", "Acento de identidad."],
  ["Oliva", "olive", "#818B59", "Piezas y expedientes."],
  ["Celeste", "blue", "#B0C8CC", "Piezas y expedientes."],
];
function Section({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
  return <section id={id} className="spec-section">
    <div className="spec-section__title"><Eyebrow>{number} /</Eyebrow><h2 className="office-heading">{title}</h2></div>
    {children}
  </section>;
}
function DemoForm() {
  const [email, setEmail] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [complete, setComplete] = useState(false);
  const error = attempted && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "Revisá el mail. Necesitamos una dirección como nombre@correo.com." : undefined;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAttempted(true);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      event.currentTarget.querySelector<HTMLInputElement>("input[type=email]")?.focus();
      return;
    }
    setComplete(true);
  }
  return <form className="office-stack" onSubmit={submit} noValidate>
    <TextField label="Nombre" name="demo-name" autoComplete="off" hint="Podés probar con un nombre inventado." />
    <TextField label="Mail" name="demo-email" type="email" autoComplete="off" required value={email}
      onChange={event => { setEmail(event.target.value); setComplete(false); }} error={error}
      hint="Este ejemplo funciona solo en tu navegador." />
    <SelectField label="Quiero acercarme para" name="demo-purpose" defaultValue="recibir">
      <option value="recibir">Recibir un cuento</option><option value="regalar">Regalar un cuento</option>
      <option value="foco">Sumar un espacio</option><option value="mensajero">Postularme como mensajero</option>
    </SelectField>
    <CheckboxField label="Quiero recibir avisos de encuentros y novedades de La Oficina." name="demo-optin"
      hint="Opcional. La casilla empieza desmarcada." />
    <Button type="submit">Probar formulario</Button>
    {complete && <Notice tone="success" title="Prueba completada">El formulario se ve así cuando sale bien. No se envió ni se guardó ningún dato.</Notice>}
  </form>;
}

function Specimen() {
  const [theme, setTheme] = useState<OfficeTheme>("paper");
  const [dialog, setDialog] = useState(false);
  return <div className="office-surface" data-office-theme="paper">
    <a className="spec-skip" href="#contenido">Ir al contenido</a>
    <header className="spec-header office-container">
      <a href="#" className="spec-home" aria-label="Inicio del archivo de diseño"><BrandSignature /></a>
      <div className="spec-edition"><span>Archivo de diseño digital</span><span>Edición 01 · Septiembre 2026</span></div>
    </header>
    <main id="contenido" className="office-container">
      <section className="spec-hero" aria-labelledby="spec-title">
        <div>
          <Eyebrow className="spec-hero__label">Una puerta al mundo físico</Eyebrow>
          <h1 id="spec-title" className="office-display">La magia<br />también necesita<br /><em>un lenguaje.</em></h1>
          <p className="office-lead spec-hero__intro">Un sistema para que cada pantalla se sienta parte de la misma Oficina. Papel, tinta, correspondencia y una señal en la ciudad.</p>
          <p className="office-eyebrow office-muted spec-hero__meta">Identidad · Reglas · Componentes · Uso</p>
        </div>
        <div className="spec-hero__object">
          <div className="spec-file"><Eyebrow>Documento de circulación interna</Eyebrow><BrandSignature />
            <div className="spec-file__rule" />
            <EditorialQuote>Para quienes sospechan<br />que la magia<br /><em>todavía existe.</em></EditorialQuote>
            <div className="spec-file__footer"><span>Nº 001</span><span>En papel. En la ciudad.</span></div>
          </div>
          <p className="spec-caption">La pantalla abre la puerta.<br />La experiencia sucede afuera.</p>
        </div>
      </section>
      <nav className="spec-nav" aria-label="Secciones del sistema de diseño">
        {sections.map(([id, number, label]) => <a key={id} href={"#" + id}><span>{number}</span>{label}</a>)}
      </nav>
      <Section id="identidad" number="01" title="Una institución imaginaria.">
        <div className="spec-two-col spec-principles">
          <p className="office-lead">La Oficina es una red de resistencia al ruido digital. Sus integrantes conservan su identidad; las cartas y los mensajeros son quienes se dejan ver.</p>
          <div className="office-stack"><p>La web ayuda a encontrar un cuento, un foco de distribución o una forma de participar. Su presencia es discreta, pero sus indicaciones son claras.</p>
            <p className="office-muted">Tomamos de los diseños la composición editorial, el sello institucional, los colores de los sobres y el contraste entre una frase delicada y un número de expediente.</p></div>
        </div>
        <div className="spec-principle-grid">
          {[ ["Presencia discreta", "Una acción principal por sección. Aire, pausas y pocos elementos."],
            ["Misterio hospitalario", "La voz invita. Pedir, pagar y saber qué sigue siempre es sencillo."],
            ["Huella material", "Tinta, papel, grabados y numeración. Los rostros no representan a la Oficina."]
          ].map(([title, body], index) => <div key={title}><Eyebrow>Principio 0{index + 1}</Eyebrow><h3>{title}</h3><p>{body}</p></div>)}
        </div>
        <div className="spec-signature-panel"><BrandSignature /><div><Eyebrow>Firma tipográfica para web</Eyebrow><p>Una interpretación funcional de la composición original. El logotipo de imprenta se conserva como referencia.</p></div></div>
      </Section>
      <Section id="tipografia" number="02" title="Tres voces, una correspondencia.">
        <div className="spec-type-row"><div><Eyebrow>01 · Titulares y citas</Eyebrow><p>Cormorant Garamond<br /><span className="office-muted">Regular 400 · Medium 500 · Italic</span></p></div><div className="spec-type-display">El mundo todavía<br /><em>guarda secretos.</em></div></div>
        <div className="spec-type-row"><div><Eyebrow>02 · Lectura</Eyebrow><p>EB Garamond<br /><span className="office-muted">Regular 400 · Medium 500 · Italic</span></p></div><p className="office-lead">Hay un cuento esperando en algún lugar de la ciudad. Puede estar en un café, entre los libros o del otro lado de tu puerta.</p></div>
        <div className="spec-type-row"><div><Eyebrow>03 · Archivo e interfaz</Eyebrow><p>Inconsolata<br /><span className="office-muted">Regular 400 · Medium 500</span></p></div><div className="spec-type-mono">EXPEDIENTE Nº 003<br />LA OFICINA · BUENOS AIRES<br /><span>Nombre / Dirección / Correspondencia</span></div></div>
        <div className="spec-notes"><p><strong>La cursiva es un acento.</strong> Una frase o unas pocas palabras. Las instrucciones van en letra de lectura.</p><p><strong>La letra de archivo organiza.</strong> Rótulos, botones, números y datos. Los párrafos largos conservan la serif.</p></div>
        <div className="spec-scale">{[["13", "Notas"], ["14", "Rótulos"], ["17", "Ayudas"], ["20", "Lectura"], ["22–28", "Bajadas"], ["36–64", "Secciones"], ["48–108", "Portada"]].map(([value, label]) => <div key={label}><span>{value}</span><small>{label} · px</small></div>)}</div>
      </Section>
      <Section id="color" number="03" title="Color que pertenece al papel.">
        <p className="office-reading office-lead spec-intro">La base es papel y tinta. Rojo, oliva y celeste aparecen como piezas de una colección. La noche queda para umbrales y momentos de mayor intimidad.</p>
        <div className="spec-swatches">{swatches.map(([name, token, hex, role]) => <div key={token}><div className={"spec-swatch spec-swatch--" + token}><span>{name}</span><code>{hex}</code></div><p>{role}</p></div>)}</div>
        <p className="spec-caption">Valores digitales propuestos a partir de tus referencias. No son muestras certificadas de imprenta.</p>
        <div className="spec-two-col spec-themes">
          <div data-office-theme="paper" className="spec-theme office-surface"><Eyebrow>Ambiente / Papel</Eyebrow><h3>Una carta abierta.</h3><p>Lectura, formularios, puntos de distribución y detalles de un encuentro.</p><Button onClick={() => { setTheme("paper"); setDialog(true); }}>Ver formulario en papel</Button></div>
          <div data-office-theme="night" className="spec-theme office-surface"><Eyebrow>Ambiente / Noche</Eyebrow><h3>Una luz encendida.</h3><p>Portadas, invitaciones y pausas. Los controles conservan su contraste.</p><Button onClick={() => { setTheme("night"); setDialog(true); }}>Ver formulario en noche</Button></div>
        </div>
      </Section>
      <Section id="componentes" number="04" title="Las piezas de la Oficina.">
        <div className="spec-component-heading"><p className="office-reading">Estos ejemplos usan los mismos componentes que pueden incorporarse a la web. Podés cambiar el ambiente, abrir un formulario y probar la validación.</p><Button variant="secondary" aria-pressed={theme === "night"} onClick={() => setTheme(theme === "paper" ? "night" : "paper")}>{theme === "paper" ? "Probar ambiente noche" : "Volver a papel"}</Button></div>
        <div className="spec-component-lab office-surface" data-office-theme={theme}>
          <Eyebrow>Acciones / estados</Eyebrow>
          <div className="spec-buttons"><Button onClick={() => setDialog(true)}>Recibir un cuento</Button><Button variant="secondary" onClick={() => setDialog(true)}>Sumar un espacio</Button><Button variant="quiet" onClick={() => setDialog(true)}>Escribir a la Oficina</Button></div>
          <div className="spec-buttons"><Button pending pendingLabel="Enviando solicitud…">Enviar solicitud</Button><Button disabled>No disponible</Button></div>
          <div className="spec-two-col spec-form-grid"><div><Eyebrow>Formulario / demostración local</Eyebrow><DemoForm /></div><div className="office-stack"><Eyebrow>Mensajes / feedback</Eyebrow>
            <Notice title="Antes de empezar">Te vamos a pedir solo los datos necesarios para responder tu solicitud.</Notice>
            <Notice tone="success" title="Solicitud recibida">La Oficina recibió tu mensaje. Te responderemos al mail que nos dejaste.</Notice>
            <Notice tone="error" title="No pudimos enviar tu solicitud">Tus datos siguen en el formulario. Podés volver a intentarlo.</Notice>
            <TextField label="Ejemplo de campo con error" defaultValue="nombre@" error="Revisá la dirección de mail antes de continuar." />
            <TextField label="Ejemplo de campo deshabilitado" value="Disponible cuando se confirme la zona" disabled readOnly />
            <TextAreaField label="Una nota para la Oficina" hint="Opcional. Este campo no envía información." />
          </div></div>
        </div>
        <div className="spec-component-heading"><div><Eyebrow>Expedientes / colección</Eyebrow><p>Color por pieza, número visible y una frase que invita a abrir.</p></div></div>
        <div className="spec-story-grid">
          <PaperCard tone="blue"><Eyebrow>Cuento Nº 001</Eyebrow><EditorialQuote>“Siempre que me tomo un colectivo vacío <em>pido un deseo.</em>”</EditorialQuote><BrandSignature /></PaperCard>
          <PaperCard tone="olive"><Eyebrow>Cuento Nº 002</Eyebrow><EditorialQuote>“Los sándwiches de milanesa más grandes y cargados <em>del barrio.</em>”</EditorialQuote><BrandSignature /></PaperCard>
          <PaperCard tone="night"><Eyebrow>Cuento Nº 003</Eyebrow><EditorialQuote>“El silencio caía como un manto <em>por encima de todo.</em>”</EditorialQuote><BrandSignature /></PaperCard>
        </div>
        <p className="spec-caption">Frases tomadas de los sobres de referencia. Las fichas son muestras gráficas y no anuncian disponibilidad.</p>
        <div className="spec-layout-rule"><Eyebrow>Composición</Eyebrow><p>Contenedor de 1.216 px · Lectura hasta 608 px · Formulario hasta 512 px · Controles de 48 px</p><p>Espaciado: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128</p></div>
      </Section>
      <Section id="voz" number="05" title="El misterio invita. La interfaz orienta.">
        <div className="spec-two-col"><div><p className="office-lead">La Oficina habla en primera persona plural, con voseo, calidez y pocas palabras. Su identidad se protege sin poner a prueba a quien llega.</p><p className="spec-intro">En la nueva definición: una carta con un cuento cada mes, avisos de encuentros mensuales y una red de focos y mensajeros. Precio, fechas y cobertura efectiva se completan antes de ofrecerlos.</p></div>
          <div className="spec-copy-examples"><div><Eyebrow>Invitar</Eyebrow><p>Hay un cuento esperando del otro lado de tu puerta.</p></div><div><Eyebrow>Explicar</Eyebrow><p>Con la suscripción recibís una carta con un cuento cada mes.</p></div><div><Eyebrow>Orientar</Eyebrow><p>Dejanos tu mail para responder tu consulta.</p></div><div><Eyebrow>Confirmar</Eyebrow><p>Recibimos tu solicitud. Te responderemos al mail que nos dejaste.</p></div></div></div>
        <div className="spec-notes"><p><strong>Mostrar.</strong> Sobres, papel, manos sin rasgos identificables, mostradores, sellos y recorridos.</p><p><strong>Evitar.</strong> Rostros del equipo, lenguaje de urgencia comercial, cifras inventadas, efectos de máquina de escribir y formularios que esconden condiciones.</p></div>
      </Section>
      <Section id="referencias" number="06" title="De dónde viene este lenguaje.">
        <p className="office-reading spec-intro">Las nueve referencias originales quedan archivadas junto al sistema. El logotipo, los grabados y las fuentes comerciales que aparecen en ellas conservan su condición de referencia, hasta contar con los originales aptos para web.</p>
        <div className="spec-reference-grid">
          <a href="./references/07-firma.png" target="_blank" rel="noreferrer"><img src="./references/07-firma.png" alt="Firma original de La Oficina sobre fondo rojo" loading="lazy" /><span>Firma y composición</span></a>
          <a href="./references/08-grabados.png" target="_blank" rel="noreferrer"><img src="./references/08-grabados.png" alt="Búho, pluma y velas en grabados sobre rojo, oliva y celeste" loading="lazy" /><span>Color y grabado</span></a>
          <a href="./references/09-sobre-fisico.png" target="_blank" rel="noreferrer"><img src="./references/09-sobre-fisico.png" alt="Maqueta de un sobre físico con lacre, estampilla y frase del cuento" loading="lazy" /><span>El objeto físico</span></a>
        </div>
        <div className="spec-reference-links"><a href="./references/04-moodboard.png" target="_blank" rel="noreferrer">Moodboard gráfico</a><a href="./references/05-identidad.png" target="_blank" rel="noreferrer">Referencias de identidad</a><a href="./references/06-colores-y-fuentes.png" target="_blank" rel="noreferrer">Colores y fuentes</a><a href="./references/01-sobre-celeste.png" target="_blank" rel="noreferrer">Sobre 001</a><a href="./references/03-sobre-oliva.png" target="_blank" rel="noreferrer">Sobre 002</a><a href="./references/02-sobre-noche.png" target="_blank" rel="noreferrer">Sobre 003</a></div>
      </Section>
    </main>
    <footer className="spec-footer office-container"><BrandSignature /><div><Eyebrow>Sistema de diseño · v1.0</Eyebrow><p>La pantalla es el comienzo de otra cosa.</p><a href="/DESIGN_SYSTEM.md">Leer la guía de implementación</a></div></footer>
    <Dialog open={dialog} onClose={() => setDialog(false)} title="Escribir a la Oficina" theme={theme}
      description="Muestra del sistema de diseño. Podés probar los campos con datos inventados; no se envía información."><DemoForm /></Dialog>
  </div>;
}
createRoot(document.getElementById("root")!).render(<StrictMode><Specimen /></StrictMode>);
