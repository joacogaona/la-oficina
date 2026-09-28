// Build-time rendering of the single page (see scripts/prerender.mjs). Never shipped to the browser.
import { renderToString } from "react-dom/server";
import App from "./App";

export { site } from "./content/site";

export function render() {
  return renderToString(<App />);
}
