import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button, Notice, TextAreaField, TextField } from "../../design-system";
import { site } from "../../content/site";

type FieldName = "nombre" | "mail" | "telefono" | "direccion" | "barrio" | "codigoPostal" | "nota" | "website";
type Fields = Record<FieldName, string>;
type Errors = Partial<Record<FieldName, string>>;
type Status = "idle" | "pending" | "success" | "error";

const emptyFields = (): Fields => ({ nombre: "", mail: "", telefono: "", direccion: "", barrio: "", codigoPostal: "", nota: "", website: "" });
const required: Array<[FieldName, string]> = [
  ["nombre", "Escribí tu nombre."],
  ["mail", "Escribí un mail para responderte."],
  ["direccion", "Escribí la dirección de entrega."],
  ["barrio", "Escribí el barrio."],
  ["codigoPostal", "Escribí el código postal."],
];
/** Postal codes of the Ciudad de Buenos Aires: 1000 to 1499, with or without the CPA letters (C1431ACJ). Deliveries stay within the city for now. */
const CABA_POSTAL_CODE = /^C?\s*1[0-4]\d{2}(\s*[A-Z]{3})?$/i;
const fieldId = (name: FieldName) => `suscripcion-${name}`;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  for (const [name, message] of required) if (!fields[name].trim()) errors[name] = message;
  if (fields.mail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.mail.trim())) errors.mail = "Revisá el mail: le falta algo.";
  if (fields.codigoPostal.trim() && !CABA_POSTAL_CODE.test(fields.codigoPostal.trim())) errors.codigoPostal = "Por ahora mandamos solo dentro de la Ciudad de Buenos Aires.";
  return errors;
}

/** Fields named for Formspree: `email` becomes the reply-to, `_subject` the mail subject and `_gotcha` the honeypot. Any endpoint that accepts JSON works. */
function payload(fields: Fields) {
  return {
    pedido: "suscripcion-mensual",
    _subject: `Suscripción mensual: ${fields.nombre.trim()}`,
    nombre: fields.nombre.trim(),
    email: fields.mail.trim(),
    telefono: fields.telefono.trim(),
    direccion: fields.direccion.trim(),
    barrio: fields.barrio.trim(),
    codigoPostal: fields.codigoPostal.trim(),
    nota: fields.nota.trim(),
    _gotcha: fields.website,
    enviado: new Date().toISOString(),
  };
}

/** Request form for the monthly subscription: the address comes here, the payment by the Mercado Pago link shown after. Without JavaScript it posts as a plain HTML form to the same endpoint. */
export function SubscriptionForm() {
  const [fields, setFields] = useState<Fields>(emptyFields);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  // Native validation stays on until React takes over the form, so the page degrades to a plain POST.
  const [enhanced, setEnhanced] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const focusField = useRef<FieldName | null>(null);
  const inFlight = useRef(false);
  useEffect(() => setEnhanced(true), []);
  useEffect(() => { if (status === "success" || status === "error") resultRef.current?.focus(); }, [status]);
  // After an invalid attempt, focus the first field with an error once its message is on the page.
  useEffect(() => {
    if (!focusField.current) return;
    document.getElementById(fieldId(focusField.current))?.focus();
    focusField.current = null;
  }, [errors]);

  const change = (name: FieldName) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setFields(current => ({ ...current, [name]: value }));
    if (errors[name]) setErrors(current => { const next = { ...current }; delete next[name]; return next; });
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const found = validate(fields);
    if (Object.keys(found).length) {
      focusField.current = required.find(([name]) => found[name])?.[0] ?? "mail";
      setErrors(found);
      return;
    }
    inFlight.current = true;
    setStatus("pending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(site.formEndpoint, {
        method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify(payload(fields)), signal: controller.signal,
      });
      if (!response.ok) throw new Error(`El servicio respondió ${response.status}.`);
      setStatus("success");
      setFields(emptyFields());
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
      inFlight.current = false;
    }
  }

  if (status === "success") return <div ref={resultRef} tabIndex={-1} className="subscription-result office-stack">
    <Notice tone="success" title="Recibimos tus datos">
      {site.suscripcion.url
        ? <p>Para activar la suscripción, pagá el primer mes en Mercado Pago. Se renueva cada mes y la cancelás cuando quieras.</p>
        : <p>Te escribimos al mail para coordinar el pago y el primer envío.</p>}
    </Notice>
    <div className="subscription-actions">
      {site.suscripcion.url && <a className="office-button office-button--primary" href={site.suscripcion.url}>Pagar en Mercado Pago</a>}
      <Button variant={site.suscripcion.url ? "quiet" : "secondary"} onClick={() => setStatus("idle")}>Hacer otro pedido</Button>
    </div>
  </div>;

  const pending = status === "pending";
  return <form className="subscription-form" action={site.formEndpoint} method="post" noValidate={enhanced} onSubmit={submit} aria-busy={pending}>
    <fieldset disabled={pending} className="subscription-fields">
      <legend className="office-sr-only">Datos para la suscripción</legend>
      <TextField label="Nombre" id={fieldId("nombre")} name="nombre" autoComplete="name" required value={fields.nombre} error={errors.nombre} onChange={change("nombre")} />
      <TextField label="Mail" id={fieldId("mail")} name="email" type="email" autoComplete="email" inputMode="email" required hint="Para confirmarte cada envío." value={fields.mail} error={errors.mail} onChange={change("mail")} />
      <TextField label="Teléfono" id={fieldId("telefono")} name="telefono" type="tel" autoComplete="tel" inputMode="tel" hint="Por si hace falta coordinar la entrega." value={fields.telefono} error={errors.telefono} onChange={change("telefono")} />
      <TextField label="Dirección" id={fieldId("direccion")} name="direccion" autoComplete="street-address" required hint="Calle y número, piso y departamento." value={fields.direccion} error={errors.direccion} onChange={change("direccion")} />
      <div className="subscription-row">
        <TextField label="Barrio" id={fieldId("barrio")} name="barrio" autoComplete="address-level2" required value={fields.barrio} error={errors.barrio} onChange={change("barrio")} />
        <TextField label="Código postal" id={fieldId("codigoPostal")} name="codigoPostal" autoComplete="postal-code" required value={fields.codigoPostal} error={errors.codigoPostal} onChange={change("codigoPostal")} />
      </div>
      <TextAreaField label="Nota" id={fieldId("nota")} name="nota" rows={3} hint="Horarios, portero, o si es un regalo para alguien." value={fields.nota} onChange={change("nota")} />
      <div className="subscription-honeypot" aria-hidden="true">
        <label htmlFor={fieldId("website")}>Dejá este campo vacío</label>
        <input id={fieldId("website")} name="_gotcha" tabIndex={-1} autoComplete="off" value={fields.website} onChange={change("website")} />
      </div>
    </fieldset>
    {status === "error" && <div ref={resultRef} tabIndex={-1} className="subscription-result">
      <Notice tone="error" title="No pudimos confirmar el envío">
        <p>Tus datos siguen en el formulario: podés reintentar. Si vuelve a fallar, mandanos una carta con los mismos datos a la dirección de abajo.</p>
      </Notice>
    </div>}
    <div><Button type="submit" pending={pending} pendingLabel="Enviando…">Enviar mis datos</Button></div>
  </form>;
}
