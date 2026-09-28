/** Only public, verified information belongs here. Never add reader data, author names, prices or dates. */
export const site = {
  name: "La Oficina de los Últimos Cuentos",
  city: "Buenos Aires, Argentina",
  /** The Oficina's own words (Joaquín, 28-sep-2026), one string per paragraph. The breaks are typographic; the wording is his. No mechanics (prices, focos, events). */
  manifiesto: [
    "Hay un mundo que no sabíamos que teníamos hasta que lo empezamos a perder. Un mundo invisible a la mirada distraída. Un mundo donde las palabras se piensan por días y solo pueden ser pronunciadas en un encuentro. Un mundo que no se puede explicar, solo se puede sentir. Un mundo donde lo que se lee se toca. Un mundo que parece olvidado y que, sin embargo, seguimos buscando.",
    "Si esto llegó a tus manos, seguramente sos un buscador. No sabés exactamente lo que buscás, pero lo hacés.",
    "Solo vinimos a decirte que ese mundo todavía existe. Las oficinas que lo mantienen con vida también.",
  ],
  /** Postal address for letters, one line per `|` segment (mailbox, branch, city). Empty until the mailbox exists: the page says so instead of inventing one. Never a member's home address. */
  postal: (import.meta.env.VITE_POSTAL_ADDRESS ?? "").split("|").map((line: string) => line.trim()).filter(Boolean) as string[],
};
