# La Oficina de los Últimos Cuentos · web

React + TypeScript + Vite + Tailwind. Dos páginas: la principal (la firma, el manifiesto de la Oficina, los locales donde se venden los cuentos, el formulario de suscripción mensual y la dirección postal) y, desde el 30-oct-2026, la Agenda de lecturas y micrófonos abiertos de la Ciudad (`/agenda/`). Sin mail público ni redes. Node 22.18 o superior, pnpm 8.9.2.

Versión del 27-oct-2026: suma las secciones Dónde encontrarlos y Un cuento por mes (pedido de Joaquín) a la web de presencia del 27-sep-2026, que reemplazó la web de consultas del 13-sep (siete recorridos, focos, buzón, encuentros, avisos por mail y Formspree) y las dos versiones intermedias del 26-sep (archivo de cuentos, bloques Cartas y Mensajes con formulario). El alcance está en el [plan de la web](../negocio/plan.md#web).

## Qué hay

- Portada roja con la ciudad y un menú de cuatro palabras (Cafés, Suscripción y Cartas, anclas a las secciones, y Agenda, a su página; sin barra fija), la firma y la frase "Cuentos por carta."; el manifiesto en papel (texto de Joaquín del 28-sep-2026, en tres párrafos); dos bloques en papel con rótulo a la izquierda: "Dónde encontrarlos" (un mapa de la ciudad dibujado por la propia página desde [src/content/caba.ts](src/content/caba.ts), con los barrios en línea fina, el barrio de cada local en el rojo de la portada y la lechuza de la Oficina parada sobre el punto, sin teselas ni peticiones externas; al lado, la lista de `site.locales` con la lechuza chica, nombre, dirección, barrio y ciudad y el enlace "Cómo llegar" a Google Maps, que se abre solo al tocarlo; sin precio) y "Un cuento por mes" (la suscripción a domicilio: dos líneas con el precio, $20.000 por mes con envío incluido, y el alcance, solo Ciudad de Buenos Aires; el botón "Suscribirme" que despliega (un `details` nativo, funciona sin JavaScript) el formulario de [SubscriptionForm.tsx](src/features/suscripcion/SubscriptionForm.tsx) con nombre, mail, teléfono opcional, dirección, barrio, código postal y nota, honeypot, validación en el navegador que rechaza códigos postales fuera de la Ciudad, error del servicio sin simular éxito y confirmación persistente con el botón "Pagar en Mercado Pago"; sin JavaScript hace un POST común al mismo endpoint); una segunda sección roja con la invitación "Si querés mandar un cuento, vender nuestros cuentos en tu local o hacernos una propuesta, mandanos una carta a:", la dirección postal escrita en el frente de un sobre de papel (líneas del remitente y estampilla con la “L.” de la firma) y la nota "Leemos todo lo que llega. Si dejás un mail o un teléfono en la carta, te contactamos."; pie con el nombre, la ciudad y "La Oficina existe."
- Agenda (`/agenda/`, 30-oct-2026, pedido de Joaquín): página propia con la portada roja (enlace a la principal, menú Micrófonos, Fechas, Barrios y Cartas, título "Agenda"), una línea de presentación y tres bloques: "Para leer lo tuyo", los micrófonos abiertos (donde cualquiera se anota y lee lo suyo), cada uno con su próxima fecha confirmada; "Próximas fechas", las fechas confirmadas de las próximas dos semanas agrupadas por día (en el navegador arranca desde hoy en Buenos Aires; pre-renderizada, desde el día de la revisión), y "Por barrio", el mismo mapa de la ciudad sin lechuzas, con los barrios que tienen actividades en rojo y como enlaces a su grupo de la lista (funciona con teclado y sin JavaScript), debajo del mapa un índice de barrios con la cantidad de actividades (la entrada desde el celular), y al lado todas las actividades de cada barrio en dos líneas: el nombre, que es el enlace al sitio o la cuenta pública (en otra pestaña), con el tipo como etiqueta, y cuándo, dónde, cómo se entra (sin montos) y quién la da. Solo entra lo que está abierto hoy y, desde la noche del 30-oct-2026, solo ciclos (lectura, poesía, presentaciones, clubes de lectura, micrófonos abiertos): los talleres quedan curados en los datos, fuera de la web, y vuelven con `AGENDA_TALLERES=1`. Cierra con la invitación a sumar una actividad por carta. Los datos están en [src/content/agenda.ts](src/content/agenda.ts), generado por `scripts/build-agenda.mjs` desde `../agenda/data/` (solo las filas con `decision` = sí): no se edita a mano.
- Sin mail público ni página de privacidad; el único dato que entra es el pedido de suscripción, que va al servicio de formularios y no se guarda en la web. Sin sobres ni cuentos a la vista; el único precio es el de la suscripción. Una sola familia en pantalla (Inconsolata).
- Metadatos, tarjeta para compartir, favicon, robots y sitemap. Las páginas se pre-renderizan en el build: `dist/index.html` trae el texto completo y datos estructurados de tipo Organization (nombre, ciudad, descripción, imágenes y la dirección postal cuando existe); `dist/agenda/index.html`, el texto completo y un Event por fecha confirmada. React solo hidrata. El sitemap lista las dos. `vercel.json` redirige las rutas retiradas `/condiciones/` y `/privacidad/` a `/`.
- Medición (30-oct-2026, pedido de Joaquín): Web Analytics y Speed Insights de Vercel, inyectados desde [src/vercel.ts](src/vercel.ts) en las dos páginas, sin cookies ni datos personales. Los scripts salen de `/_vercel/` en el mismo origen y existen cuando cada producto está habilitado en el proyecto de Vercel (pestañas Analytics y Speed Insights del panel). El test del navegador los sirve vacíos y comprueba que las dos páginas los piden.

## Contenido y conexiones

Editar [src/content/site.ts](src/content/site.ts): nombre, ciudad, el manifiesto (un string por párrafo) y `locales` (un objeto por local confirmado: nombre, barrio escrito como en los barrios de la ciudad para que el mapa lo pinte, ciudad, dirección de calle cuando esté confirmada, `lat` y `lon` del local y, si existe, el enlace `mapa` de Google Maps; la lista vacía oculta la sección). No agregar cuentos, títulos, nombres de autores, precios, fechas ni encuentros. Regla para lo que venga: lo digital sirve para encontrar a la Oficina, para pedir la suscripción y, desde el 30-oct-2026, para encontrar dónde se escribe y se lee en persona en la ciudad (la Agenda); todo lo demás pasa en papel. La Agenda se actualiza curando `../agenda/data/` y corriendo `node scripts/build-agenda.mjs`; después, `pnpm build` y el test. Un encuentro futuro se anuncia con una línea (fecha y lugar), como un afiche, sin inscripción.

Copiar `.env.example` a `.env.local` para la configuración local. Los valores `VITE_` son públicos y se incorporan al compilar.

| Variable | Uso y comportamiento actual |
|---|---|
| `VITE_POSTAL_ADDRESS` | Vacía: la página dice "Dirección pendiente: todavía no tenemos casilla de correo". Con líneas separadas por `\|` (casilla, sucursal, ciudad) muestra la dirección en la tarjeta roja. Nunca un domicilio particular |
| `VITE_FORM_ENDPOINT` | Adónde manda el formulario de suscripción (POST JSON con `Accept: application/json`, y POST común sin JavaScript). Sin definir: el Formspree de la Oficina (`https://formspree.io/f/mredjdzd`, el formulario que ya existía en mayo). Vacío: la sección ofrece la suscripción por carta en vez del formulario. Cualquier servicio que acepte JSON sirve |
| `VITE_SUBSCRIPTION_URL` | Link del plan de suscripción mensual creado en Mercado Pago ($20.000). Aparece como botón "Pagar en Mercado Pago" después de enviar el formulario. Vacío: la confirmación dice que el pago se coordina por mail |
| `VITE_PUBLIC_SITE_URL` | Dominio público: `https://laoficinaexiste.com` (comprado el 27-sep-2026, DNS en Vercel). Genera canonical, URLs sociales, robots y sitemap. Debe coincidir con el dominio principal configurado en Vercel |

Configurar también estas variables en el hosting al desplegar.

Antes de publicar:

- Crear en Mercado Pago el plan de suscripción mensual de $20.000 y cargar su link en Vercel como `VITE_SUBSCRIPTION_URL`; hasta entonces la web coordina el pago por mail.
- Mandar un pedido de prueba desde la web desplegada y confirmar que llega al Formspree (y al mail asociado); si el formulario de Formspree está inactivo, la web muestra el error y ofrece la carta, nunca un éxito falso. Cargar cada pedido real en el sheet.
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

El mapa sale de [scripts/build-map.mjs](scripts/build-map.mjs): lee el GeoJSON de barrios de Buenos Aires Data (CC BY 4.0, atribuido en el `desc` del SVG y acá), simplifica los polígonos y escribe `src/content/caba.ts` (15 KB); se corre a mano, solo si cambia la fuente. La lechuza es el dibujo de Joaquín ([design-system/references/10-lechuza.jpg](design-system/references/10-lechuza.jpg)) recortado sin fondo, en tinta, a 400 px de alto ([src/assets/lechuza.webp](src/assets/lechuza.webp)). Cada local tiene su punto en el mapa; los locales a menos del ancho de la lechuza (90 unidades del viewBox, unas 18 cuadras) comparten una lechuza parada entre sus puntos, porque dos lechuzas a tres cuadras se dibujan una sobre la otra.

`pnpm build` compila, pre-renderiza la página con [scripts/prerender.mjs](scripts/prerender.mjs) (entrada [src/entry-server.tsx](src/entry-server.tsx)) y agrega el JSON-LD. El servidor de desarrollo sirve la página sin pre-render; para ver el HTML final, `pnpm preview` después del build.

La validación y las vistas de esta entrega están en [validation/README.md](validation/README.md). La revisión de navegador está en [tests/browser.mjs](tests/browser.mjs): requiere Playwright como herramienta opcional y Chrome local; se puede indicar el módulo mediante `OFFICE_PLAYWRIGHT_MODULE`, el ejecutable mediante `OFFICE_CHROME_PATH` y la URL mediante `OFFICE_PREVIEW_URL` (la vista previa de Vite escucha en `http://localhost:5174`).

La tarjeta se genera con [scripts/render-share-card.mjs](scripts/render-share-card.mjs) desde la propia portada; el favicon y el ícono, con la “L.” de la firma en tinta sobre rojo, compuesta con la tipografía de la página. Sus PNG finales están en `public/`; las referencias originales y las capturas de QA permanecen fuera del build.
