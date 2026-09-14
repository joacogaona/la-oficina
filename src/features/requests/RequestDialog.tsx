import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button, CheckboxField, Dialog, Notice, SelectField, TextAreaField, TextField } from "../../design-system";
import { site } from "../../content/site";
import { consentText, emptyFields, isConfirmedSubmission, payloadFor, requests, requiredFields, validate } from "./model";
import type { Fields, FieldErrors, RequestKind } from "./model";

export function RequestDialog({ open, kind, onKindChange, onClose }: { open: boolean; kind: RequestKind; onKindChange: (kind: RequestKind) => void; onClose: () => void }) {
  return <Dialog open={open} onClose={onClose} title={requests[kind].title} description={requests[kind].description}><RequestForm key={kind} kind={kind} onKindChange={onKindChange} onClose={onClose} /></Dialog>;
}
function RequestForm({ kind, onKindChange, onClose }: { kind: RequestKind; onKindChange: (kind: RequestKind) => void; onClose: () => void }) {
  const [fields, setFields] = useState(emptyFields);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const requestId = useRef(crypto.randomUUID());
  const inFlight = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const required = requiredFields(kind);
  const isDelivery = kind === "recibir" || kind === "regalar";
  useEffect(() => () => abort.current?.abort(), []);
  useEffect(() => { if (status === "success" || status === "error") resultRef.current?.focus(); }, [status]);
  const change = (name: keyof Fields, value: string | boolean) => { setFields(current => ({ ...current, [name]: value })); setErrors(current => ({ ...current, [name]: undefined })); };
  function textField(name: Exclude<keyof Fields, "avisos_encuentros">, label: string, options: { hint?: string; autoComplete?: string; type?: string } = {}) {
    return <TextField {...options} key={name} id={`consulta-${name}`} name={name} label={label} value={fields[name]} required={required.includes(name)} error={errors[name]} maxLength={250} onChange={event => change(name, event.target.value)} />;
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (inFlight.current) return;
    const nextErrors = validate(kind, fields); setErrors(nextErrors);
    if (Object.keys(nextErrors).length) { requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()); return; }
    inFlight.current = true; setStatus("pending"); abort.current = new AbortController();
    const controller = abort.current; let timedOut = false;
    const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 20000);
    try {
      const response = await fetch(`https://formspree.io/f/${site.formspreeId}`, { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify(payloadFor(kind, fields, requestId.current, new Date().toISOString())), signal: controller.signal });
      const data = await response.json().catch(() => null);
      if (!isConfirmedSubmission(response.ok, data)) throw new Error("unconfirmed");
      if (!controller.signal.aborted) { setStatus("success"); setFields(emptyFields()); }
    } catch { if (!controller.signal.aborted || timedOut) setStatus("error"); }
    finally { window.clearTimeout(timeout); inFlight.current = false; }
  }
  if (status === "success") return <div className="office-stack request-result" ref={resultRef} tabIndex={-1}>
    <Notice tone="success" title={kind === "encuentros" ? "Recibimos tu pedido de avisos" : kind === "preferencias" ? "Recibimos tu pedido" : "Tu consulta llegó a la Oficina"}>
      {kind === "encuentros" ? <p>Registramos tu solicitud para enterarte de los encuentros. Podés pedir la baja desde «Gestionar avisos y datos», al pie de la web.</p> : kind === "preferencias" ? <p>Vamos a gestionar tu pedido y responderte al mail que nos dejaste.</p> : <p>Te responderemos al mail que nos dejaste para conversar el siguiente paso. Esta consulta no genera un cobro ni una reserva.</p>}
    </Notice><Button onClick={onClose}>Volver a la web</Button><Button variant="quiet" onClick={() => { requestId.current = crypto.randomUUID(); setStatus("idle"); }}>Hacer otra consulta</Button>
  </div>;
  return <form ref={formRef} onSubmit={submit} noValidate className="request-form office-stack" aria-busy={status === "pending"}>
    <SelectField label="Quiero…" id="consulta-motivo" value={kind} disabled={status === "pending"} onChange={event => { onKindChange(event.target.value as RequestKind); requestAnimationFrame(() => document.getElementById("consulta-motivo")?.focus()); }}>{Object.entries(requests).map(([value, item]) => <option key={value} value={value}>{item.label}</option>)}</SelectField>
    <fieldset disabled={status === "pending"} className="request-fields office-stack">
      {kind !== "encuentros" && kind !== "preferencias" && textField("nombre", kind === "regalar" ? "Tu nombre (quien regala)" : "Tu nombre", { autoComplete: "name" })}
      {textField("email", kind === "regalar" ? "Tu mail (quien regala)" : "Tu mail", { type: "email", autoComplete: "email", hint: kind === "regalar" ? "Vamos a escribirte a vos, para conservar la sorpresa." : undefined })}
      {kind === "foco" && <>{textField("espacio", "Nombre del espacio", { autoComplete: "organization" })}<SelectField id="consulta-tipo_espacio" label="Tipo de espacio" name="tipo_espacio" value={fields.tipo_espacio} required error={errors.tipo_espacio} onChange={event => change("tipo_espacio", event.target.value)}><option value="">Elegí una opción</option>{["Café", "Librería", "Bar", "Espacio cultural", "Otro espacio"].map(value => <option key={value}>{value}</option>)}</SelectField></>}
      {(isDelivery || kind === "foco" || kind === "mensajero" || kind === "encuentros") && textField("ciudad", kind === "regalar" ? "Ciudad de quien recibe" : "Ciudad", { autoComplete: kind === "recibir" ? "address-level2" : undefined, hint: kind === "encuentros" ? "Opcional. Nos ayuda a saber dónde te gustaría encontrarnos." : undefined })}
      {isDelivery && <div className="request-address-grid">{textField("provincia", kind === "regalar" ? "Provincia de destino" : "Provincia")}{textField("codigo_postal", "Código postal", { autoComplete: kind === "recibir" ? "postal-code" : undefined })}</div>}
      {kind === "foco" && textField("direccion_local", "Dirección del espacio", { hint: "La dirección del local, para conocer su ubicación." })}
      {kind === "contacto" && textField("organizacion", "Organización o marca (opcional)")}
      {kind === "preferencias" && <SelectField id="consulta-gestion" name="gestion" label="Qué necesitás" value={fields.gestion} onChange={event => change("gestion", event.target.value)} required><option value="baja_encuentros">Dejar de recibir avisos de encuentros</option><option value="consultar_datos">Consultar por mis datos</option><option value="corregir_datos">Corregir mis datos</option><option value="eliminar_datos">Pedir que eliminen mis datos</option></SelectField>}
      {kind !== "encuentros" && <TextAreaField id="consulta-mensaje" name="mensaje" label={kind === "mensajero" ? "Algo que quieras contarnos (opcional)" : "Mensaje"} hint={kind === "mensajero" ? "El cuento se envía en papel cuando abramos la convocatoria. Este espacio es solo para consultas." : kind === "contacto" ? undefined : "Opcional. Para esta consulta no necesitamos domicilios particulares ni datos de pago."} value={fields.mensaje} maxLength={3000} required={required.includes("mensaje")} error={errors.mensaje} onChange={event => change("mensaje", event.target.value)} />}
      {kind !== "preferencias" && <CheckboxField id="consulta-avisos_encuentros" name="avisos_encuentros" label={consentText} checked={fields.avisos_encuentros} required={kind === "encuentros"} error={errors.avisos_encuentros} onChange={event => change("avisos_encuentros", event.target.checked)} />}
      <div className="request-honeypot" aria-hidden="true"><label htmlFor="consulta-website">Dejá este campo vacío</label><input id="consulta-website" name="_gotcha" value={fields.website} tabIndex={-1} autoComplete="off" onChange={event => change("website", event.target.value)} /></div>
    </fieldset>
    <p className="request-privacy">La Oficina usa estos datos para responder tu consulta y, si lo elegís, avisarte de encuentros. <a href="/privacidad/" target="_blank" rel="noreferrer">Cómo cuidamos tus datos<span className="office-sr-only"> (abre otra pestaña)</span></a>.</p>
    {status === "error" && <div ref={resultRef} tabIndex={-1} className="request-result"><Notice tone="error" title="El envío necesita otro intento"><p>No pudimos confirmar el envío. Tus datos siguen en el formulario: podés reintentar.</p>{site.email && <p>También podés escribirnos a <a href={`mailto:${site.email}`}>{site.email}</a>.</p>}</Notice></div>}
    <Button type="submit" pending={status === "pending"} pendingLabel="Enviando…">{kind === "encuentros" ? "Quiero que me avisen" : kind === "preferencias" ? "Enviar pedido" : "Enviar consulta"}</Button>
    {isDelivery && <p className="request-footnote">Esta consulta no genera un cobro ni una suscripción.</p>}
  </form>;
}
