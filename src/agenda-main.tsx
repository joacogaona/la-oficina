import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { AgendaPage } from "./features/agenda/AgendaPage";
import "./styles.css";

const root = document.getElementById("root")!;
const page = <StrictMode><AgendaPage /></StrictMode>;
// The build pre-renders the agenda into #root (scripts/prerender.mjs); the dev server serves it empty.
if (root.hasChildNodes()) hydrateRoot(root, page);
else createRoot(root).render(page);
