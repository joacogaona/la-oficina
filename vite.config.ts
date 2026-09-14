import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const siteUrl = new URL(env.VITE_PUBLIC_SITE_URL || "https://la-oficina-seven.vercel.app");
  if (siteUrl.protocol !== "https:" || siteUrl.username || siteUrl.password || siteUrl.pathname !== "/" || siteUrl.search || siteUrl.hash) throw new Error("VITE_PUBLIC_SITE_URL debe ser el dominio público HTTPS, sin rutas ni parámetros.");
  if (env.VITE_CONTACT_EMAIL && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.VITE_CONTACT_EMAIL)) throw new Error("Revisá VITE_CONTACT_EMAIL.");
  if (env.VITE_FORMSPREE_ID && !/^[a-zA-Z0-9]+$/.test(env.VITE_FORMSPREE_ID)) throw new Error("Revisá VITE_FORMSPREE_ID.");
  if (env.VITE_GOOGLE_FORM_URL) {
    const formUrl = new URL(env.VITE_GOOGLE_FORM_URL);
    if (formUrl.protocol !== "https:" || formUrl.username || formUrl.password || !(formUrl.hostname === "forms.gle" || (formUrl.hostname === "docs.google.com" && formUrl.pathname.startsWith("/forms/")))) throw new Error("VITE_GOOGLE_FORM_URL debe ser un enlace HTTPS de Google Forms.");
  }
  return {
    plugins: [react(), {
      name: "office-public-metadata",
      transformIndexHtml(html, context) {
        if (context.path.startsWith("/design-system/")) return html;
        const pagePath = context.path.includes("privacidad") ? "/privacidad/" : context.path.includes("condiciones") ? "/condiciones/" : "/";
        const title = html.match(/<title>(.*?)<\/title>/)?.[1] || "La Oficina de los Últimos Cuentos";
        const description = html.match(/name="description"\s+content="([^"]*)"/)?.[1] || "Cuentos en papel, en sobre cerrado.";
        const url = new URL(pagePath, siteUrl).href;
        return [{ tag: "link", attrs: { rel: "canonical", href: url } }, ...Object.entries({
          "og:type": "website", "og:locale": "es_AR", "og:site_name": "La Oficina de los Últimos Cuentos", "og:title": title, "og:description": description,
          "og:url": url, "og:image": new URL("/og.png", siteUrl).href, "og:image:width": "1200", "og:image:height": "630", "og:image:alt": "La Oficina de los Últimos Cuentos. Todavía hay cosas que llegan en un sobre.",
        }).map(([property, content]) => ({ tag: "meta", attrs: { property, content } })), { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } }];
      },
      generateBundle() {
        this.emitFile({ type: "asset", fileName: "robots.txt", source: `User-agent: *\nAllow: /\nSitemap: ${new URL("/sitemap.xml", siteUrl).href}\n` });
        this.emitFile({ type: "asset", fileName: "sitemap.xml", source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${["/", "/privacidad/", "/condiciones/"].map(path => `<url><loc>${new URL(path, siteUrl).href}</loc></url>`).join("")}</urlset>` });
      },
    }],
    build: { rollupOptions: { input: { main: "index.html", privacidad: "privacidad/index.html", condiciones: "condiciones/index.html" } } },
  };
});
