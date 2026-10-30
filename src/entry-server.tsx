// Build-time rendering of the pages (see scripts/prerender.mjs). Never shipped to the browser.
import { renderToString } from "react-dom/server";
import App from "./App";
import { AgendaPage } from "./features/agenda/AgendaPage";

export { site } from "./content/site";
export { agenda } from "./content/agenda";

export function render() {
  return renderToString(<App />);
}

export function renderAgenda() {
  return renderToString(<AgendaPage />);
}
