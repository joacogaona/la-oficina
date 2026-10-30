import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";

/** Vercel Web Analytics and Speed Insights (Joaquín, 30-oct-2026): visits per page and Core Web Vitals, without cookies or personal data.
 * Browser only. Both scripts come from /_vercel/ on the same origin and exist once each product is enabled in the Vercel project;
 * in development they only log to the console. */
export function medir() {
  inject();
  injectSpeedInsights();
}
