/** Only public, verified information belongs here. Never add reader data, author names, prices or dates. */
export type Local = {
  /** Public name of the café or shop. */
  nombre: string;
  /** Neighbourhood, spelled as in the city's barrios so the map can shade it. */
  barrio: string;
  ciudad: string;
  /** Street and number, only once confirmed with the shop. Empty hides the line. */
  direccion?: string;
  /** Where the owl stands on the map. */
  lat: number;
  lon: number;
  /** Link for directions (Google Maps place), opened only when the reader asks. */
  mapa?: string;
};

export const site = {
  name: "La Oficina de los Últimos Cuentos",
  city: "Buenos Aires, Argentina",
  /** The Oficina's own words (Joaquín, 28-sep-2026), one string per paragraph. The breaks are typographic; the wording is his. No mechanics (prices, focos, events). */
  manifiesto: [
    "Hay un mundo que no sabíamos que teníamos hasta que lo empezamos a perder. Un mundo invisible a la mirada distraída. Un mundo donde las palabras se piensan por días y solo pueden ser pronunciadas en un encuentro. Un mundo que no se puede explicar, solo se puede sentir. Un mundo donde lo que se lee se toca. Un mundo que parece olvidado y que, sin embargo, seguimos buscando.",
    "Si esto llegó a tus manos, seguramente sos un buscador. No sabés exactamente lo que buscás, pero lo hacés.",
    "Solo vinimos a decirte que ese mundo todavía existe. Las oficinas que lo mantienen con vida también.",
  ],
  /** Shops that sell the cuentos, in the order they joined. Only shops with the agreement in place (decisiones, fila Canales); an empty list hides the section. */
  locales: [
    { nombre: "Towandas Café", barrio: "Villa Urquiza", ciudad: "Buenos Aires", direccion: "Quesada 4982", lat: -34.5675666, lon: -58.4883118, mapa: "https://maps.google.com/?cid=9051435198881607600" },
    { nombre: "Cero Café de Origen", barrio: "Villa Urquiza", ciudad: "Buenos Aires", direccion: "Av. Congreso 5080", lat: -34.5697631, lon: -58.4899585, mapa: "https://maps.google.com/?cid=7839819865668560653" },
  ] as Local[],
  /** The monthly subscription: price as shown (decisiones, fila Suscripción) and the Mercado Pago subscription link Joaquín generates; empty link: the page says payment is arranged by mail. */
  suscripcion: {
    precioMensual: "$20.000",
    url: (import.meta.env.VITE_SUBSCRIPTION_URL ?? "").trim(),
  },
  /** Where the monthly subscription form posts JSON: Formspree (the Oficina's form) or any endpoint that answers JSON. Empty: the section offers the subscription by letter instead of the form. */
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT ?? "https://formspree.io/f/mredjdzd").trim(),
  /** Postal address for letters, one line per `|` segment (mailbox, branch, city). Empty until the mailbox exists: the page says so instead of inventing one. Never a member's home address. */
  postal: (import.meta.env.VITE_POSTAL_ADDRESS ?? "").split("|").map((line: string) => line.trim()).filter(Boolean) as string[],
};
