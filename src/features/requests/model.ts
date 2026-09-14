export const requests = {
  recibir: { label: "Recibir un cuento", title: "Una carta para vos", description: "Dejanos tus datos de contacto para consultar por la suscripción mensual. Te confirmamos disponibilidad, precio y envío antes de coordinar un pago." },
  regalar: { label: "Regalar un cuento", title: "Una carta para alguien", description: "Contanos a qué ciudad querés hacer llegar el regalo. Hablaremos con vos para coordinarlo y conservar la sorpresa." },
  foco: { label: "Sumar un espacio", title: "Un nuevo foco", description: "Cafés, librerías, bares y espacios culturales: contanos sobre tu lugar y cómo imaginás que los cuentos podrían circular por ahí." },
  mensajero: { label: "Consultar por mensajeros", title: "Ser parte de la Oficina", description: "Dejanos tu contacto y tu ciudad. La postulación será por carta, con un cuento propio, cuando publiquemos el buzón y sus condiciones." },
  encuentros: { label: "Recibir avisos de encuentros", title: "Nos vemos afuera", description: "Podemos escribirte cuando haya un encuentro confirmado. Pedir un aviso no reserva un lugar ni implica una entrada gratuita." },
  contacto: { label: "Consultas y propuestas", title: "Escribir a la Oficina", description: "Para una consulta, una marca o una idea que quieras acercarnos. Te responderemos al mail que nos dejes." },
  preferencias: { label: "Gestionar avisos y datos", title: "Tu correspondencia", description: "Podés pedir la baja de avisos o consultar por tus datos. La baja de mails no cancela una entrega de cartas que ya hayas acordado." },
} as const;
export type RequestKind = keyof typeof requests;
export type Fields = { nombre: string; email: string; ciudad: string; provincia: string; codigo_postal: string; espacio: string; tipo_espacio: string; direccion_local: string; organizacion: string; mensaje: string; gestion: string; avisos_encuentros: boolean; website: string };
export type FieldErrors = Partial<Record<keyof Fields, string>>;
export const consentVersion = "encuentros-2026-09-13-v1";
export const consentText = "Quiero recibir por mail avisos de encuentros de La Oficina. Puedo pedir la baja cuando quiera.";
export function isConfirmedSubmission(responseOk: boolean, data: unknown): boolean {
  if (!responseOk || !data || typeof data !== "object") return false;
  const body = data as Record<string, unknown>;
  // Same success contract as @formspree/core: a next URL, never navigated here.
  return typeof body.next === "string" && !body.errors && !body.error;
}
export function emptyFields(): Fields { return { nombre: "", email: "", ciudad: "", provincia: "", codigo_postal: "", espacio: "", tipo_espacio: "", direccion_local: "", organizacion: "", mensaje: "", gestion: "baja_encuentros", avisos_encuentros: false, website: "" }; }
export function requiredFields(kind: RequestKind): Array<keyof Fields> {
  if (kind === "encuentros") return ["email", "avisos_encuentros"];
  if (kind === "preferencias") return ["email", "gestion"];
  const base: Array<keyof Fields> = ["nombre", "email"];
  if (kind === "recibir" || kind === "regalar") return [...base, "ciudad", "provincia", "codigo_postal"];
  if (kind === "foco") return [...base, "espacio", "tipo_espacio", "ciudad", "direccion_local"];
  if (kind === "mensajero") return [...base, "ciudad"];
  return [...base, "mensaje"];
}
export function validate(kind: RequestKind, fields: Fields): FieldErrors {
  const errors: FieldErrors = {};
  for (const name of requiredFields(kind)) { const value = fields[name]; if (typeof value === "string" ? !value.trim() : !value) errors[name] = name === "avisos_encuentros" ? "Marcá la casilla si querés que te avisemos." : "Completá este campo."; }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) errors.email = "Revisá el mail, por ejemplo: nombre@correo.com.";
  if ((kind === "recibir" || kind === "regalar") && fields.codigo_postal && !/^(?:\d{4}|[a-z]\d{4}[a-z]{3})$/i.test(fields.codigo_postal.trim())) errors.codigo_postal = "Usá 4 números o el CPA completo, por ejemplo C1425ABC.";
  for (const [name, value] of Object.entries(fields)) if (typeof value === "string" && value.length > (name === "mensaje" ? 3000 : 250)) errors[name as keyof Fields] = "El texto es demasiado largo.";
  return errors;
}
/** Whitelist by purpose: never submit hidden draft fields from another flow. */
export function payloadFor(kind: RequestKind, fields: Fields, id: string, date: string) {
  const allowed = new Set<keyof Fields>(requiredFields(kind));
  if (kind === "encuentros") allowed.add("ciudad"); else if (kind === "contacto") allowed.add("organizacion");
  if (kind !== "encuentros") allowed.add("mensaje");
  const data: Record<string, string | boolean> = { motivo: kind, solicitud_id: id, schema_version: "consulta-v1", fecha: date, _subject: `La Oficina · ${requests[kind].label}`, _gotcha: fields.website };
  for (const field of allowed) { const value = fields[field]; data[field] = typeof value === "string" ? value.trim() : value; }
  if (kind !== "preferencias") { data.avisos_encuentros = fields.avisos_encuentros; if (fields.avisos_encuentros) { data.consentimiento_fecha = date; data.consentimiento_version = consentVersion; data.consentimiento_texto = consentText; } }
  return data;
}
