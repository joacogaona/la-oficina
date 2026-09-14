/** Only public, verified information belongs here. Never add reader data. */
export const site = {
  name: "La Oficina de los Últimos Cuentos",
  email: import.meta.env.VITE_CONTACT_EMAIL?.trim() || "",
  googleFormUrl: import.meta.env.VITE_GOOGLE_FORM_URL?.trim() || "",
  // Existing reception channel; keep until its replacement has been verified.
  formspreeId: import.meta.env.VITE_FORMSPREE_ID?.trim() || "mredjdzd",
};
export type Foco = { id: string; nombre: string; barrio: string; ciudad: string; direccion: string; horarios: string; modalidad: string; urlMapa: string; publicado: boolean };
export const focos: Foco[] = [];
export type Buzon = { destinatario: string; direccion: string; codigoPostal: string; ciudad: string; instrucciones: string; condicionesUrl: string };
// Enable only once the address and publication conditions are agreed.
export const buzon: Buzon | null = null;
export type Encuentro = { id: string; titulo: string; inicio: string; fin: string; lugar: string; descripcion: string; acceso: string; estado: "disponible" | "agotado" | "cancelado"; reservaUrl?: string; publicado: boolean };
// Include an explicit timezone offset in inicio/fin, e.g. -03:00.
export const encuentros: Encuentro[] = [];
