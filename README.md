# La Oficina de los Últimos Cuentos · web

React + TypeScript + Vite + Tailwind. Una página de presencia: la firma, el manifiesto de la Oficina y la dirección postal. Todo contacto empieza por carta: no hay formulario, mail ni redes. Node 22.18 o superior, pnpm 8.9.2.

Versión del 27-sep-2026. Reemplaza la web de consultas del 13-sep (siete recorridos, focos, buzón, encuentros, avisos por mail y Formspree) y las dos versiones intermedias del 26-sep (archivo de cuentos, bloques Cartas y Mensajes con formulario). El alcance está en el [plan de la web](../negocio/plan.md#web).

## Qué hay

- Portada roja con la firma y la frase "Cuentos por carta."; el manifiesto en papel (texto de Joaquín del 28-sep-2026, en tres párrafos); una segunda sección roja con la invitación "Si querés mandar un cuento, vender nuestros cuentos en tu local o hacernos una propuesta, mandanos una carta a:", la dirección postal escrita en el frente de un sobre de papel (líneas del remitente y estampilla con la “L.” de la firma) y la nota "Leemos todo lo que llega. Si dejás un mail o un teléfono en la carta, te contactamos."; pie con el nombre, la ciudad y "La Oficina existe."
- Sin formulario, sin mail público, sin página de privacidad (la web no recolecta datos), sin sobres ni cuentos a la vista. Una sola familia en pantalla (Inconsolata).
- Metadatos, tarjeta para compartir, favicon, robots y sitemap. La página se pre-renderiza en el build: `dist/index.html` trae el texto completo y datos estructurados de tipo Organization (nombre, ciudad, descripción, imágenes y la dirección postal cuando existe), y React solo hidrata. `vercel.json` redirige las rutas retiradas `/condiciones/` y `/privacidad/` a `/`.

## Contenido y conexiones

Editar [src/content/site.ts](src/content/site.ts): nombre, ciudad y el manifiesto (un string por párrafo). No agregar cuentos, títulos, nombres de autores, precios, fechas, focos ni encuentros. Regla para lo que venga: lo digital sirve para encontrar a la Oficina; todo lo demás pasa en papel. Un encuentro futuro se anuncia con una línea (fecha y lugar), como un afiche, sin inscripción.

Copiar `.env.example` a `.env.local` para la configuración local. Los valores `VITE_` son públicos y se incorporan al compilar.

| Variable | Uso y comportamiento actual |
|---|---|
| `VITE_POSTAL_ADDRESS` | Vacía: la página dice "Dirección pendiente: todavía no tenemos casilla de correo". Con líneas separadas por `\|` (casilla, sucursal, ciudad) muestra la dirección en la tarjeta roja. Nunca un domicilio particular |
| `VITE_PUBLIC_SITE_URL` | Dominio público: `https://laoficinaexiste.com` (comprado el 27-sep-2026, DNS en Vercel). Genera canonical, URLs sociales, robots y sitemap. Debe coincidir con el dominio principal configurado en Vercel |

Configurar también estas variables en el hosting al desplegar.

Antes de publicar:

- Contratar la casilla de correo (o el punto de recepción acordado) y cargar `VITE_POSTAL_ADDRESS`; definir quién retira las cartas y cómo se responde. Sin dirección, la web no se publica.
- En Vercel, `laoficinaexiste.com` ya sirve producción (27-sep) y es el canonical. Falta que `www.laoficinaexiste.com` y `la-oficina-seven.vercel.app` redirijan a él; se configura en el panel de Vercel (Edit en cada dominio, Redirect to Another Domain, destino `laoficinaexiste.com`, 308, Save), no en `vercel.json`, por decisión de Joaquín del 28-sep. Decidir el plan de Vercel y, después de publicar, verificar el dominio en Search Console y enviar el sitemap.

## Sistema de diseño

La referencia para todo próximo desarrollo es [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

- [Tokens](src/design-system/tokens.css): color, tipografía, espacios y ambientes papel, rojo y noche.
- [Componentes](src/design-system/index.tsx): firma, acciones, formularios, mensajes, fichas y diálogo (la web pública usa solo la firma).
- [Estilos](src/design-system/styles.css): implementación visual compartida.
- [Muestrario](design-system/main.tsx): ejemplos interactivos y las nueve referencias originales.

Desde esta carpeta:

```sh
pnpm dev
```

Abrir la URL local indicada por Vite. `/` es la web; `/design-system/` es el muestrario interno, excluido del build público, cuyos formularios de demostración no hacen peticiones ni guardan datos.

```sh
pnpm check:design
pnpm build
```

`pnpm build` compila, pre-renderiza la página con [scripts/prerender.mjs](scripts/prerender.mjs) (entrada [src/entry-server.tsx](src/entry-server.tsx)) y agrega el JSON-LD. El servidor de desarrollo sirve la página sin pre-render; para ver el HTML final, `pnpm preview` después del build.

La validación y las vistas de esta entrega están en [validation/README.md](validation/README.md). La revisión de navegador está en [tests/browser.mjs](tests/browser.mjs): requiere Playwright como herramienta opcional y Chrome local; se puede indicar el módulo mediante `OFFICE_PLAYWRIGHT_MODULE`, el ejecutable mediante `OFFICE_CHROME_PATH` y la URL mediante `OFFICE_PREVIEW_URL` (la vista previa de Vite escucha en `http://localhost:5174`).

La tarjeta se genera con [scripts/render-share-card.mjs](scripts/render-share-card.mjs) desde la propia portada; el favicon y el ícono, con la “L.” de la firma en tinta sobre rojo, compuesta con la tipografía de la página. Sus PNG finales están en `public/`; las referencias originales y las capturas de QA permanecen fuera del build.
