# Validación de la web

27-oct-2026. Web de presencia (27-sep) más las secciones Dónde encontrarlos y Un cuento por mes: portada, manifiesto, locales, formulario de suscripción, invitación y dirección postal. Reemplaza las validaciones del 13-sep, del 26-sep y del 27-sep. El alcance y las conexiones pendientes están en el [README](../README.md).

## Comprobaciones

- TypeScript y build de producción de una sola entrada.
- 40 pares de contraste del sistema de diseño, incluidos tinta sobre el rojo de la portada y papel sobre tinta.
- Navegador a 320, 375, 768 y 1440 px, texto ampliado al 200 %, movimiento reducido.
- Dirección postal mostrada cuando está configurada o aviso de dirección pendiente cuando no; los locales de `site.locales` listados sin precio; ningún enlace de mail, cuento ni sobre en la página; canonical y tarjeta para compartir presentes; ninguna petición externa salvo el POST del formulario, simulado en la prueba.
- Mapa dibujado desde los datos de la ciudad: un barrio pintado, un punto por local y una lechuza por local (los locales a menos del ancho de la lechuza comparten una, parada entre sus puntos), la lechuza chica cargada en la lista y el enlace “Cómo llegar” a Google Maps en otra pestaña; sin peticiones externas al visitar.
- Menú de la portada: tres anclas, cada una a una sección que existe.
- Formulario de suscripción plegado detrás de “Suscribirme” (cerrado al cargar): un envío vacío marca los campos, enfoca el primero y no manda nada; un código postal fuera de la Ciudad se rechaza sin mandar nada; con el servicio respondiendo 500 muestra el error y conserva los datos; con 200 muestra la confirmación con el botón de Mercado Pago (si el link está configurado) y permite otro pedido; sin JavaScript queda como POST común con validación nativa.
- Página completa sin JavaScript (pre-render) y JSON-LD Organization con la URL canónica; sin errores de consola al hidratar.

El [script de navegador](../tests/browser.mjs) bloquea todas las peticiones externas. El [informe](report.json) conserva resultados, sin datos de personas. Estas pruebas no equivalen a una auditoría completa de accesibilidad ni a una revisión con lector de pantalla.

La revisión externa (Astra, cuatro rondas del 26 al 28-sep) y su adjudicación están en [astra-26sep2026.md](astra-26sep2026.md).

## Vistas

- [Escritorio](previews/escritorio.png)
- [Página completa](previews/pagina-completa.png) (27-oct-2026, con las dos secciones nuevas)
- [Celular](previews/celular.png) y [celular completa](previews/celular-completa.png)
- [Con dirección de ejemplo](previews/con-direccion/): página completa y celular con la casilla ficticia 123, para ver la sección roja con la dirección.
- [Imagen para compartir](../public/og.png)
- [Favicon](../public/favicon.png) e [ícono](../public/apple-touch-icon.png): la “L.” de la firma en tinta sobre rojo, a 64 y 180 px.
- [Comparación de portadas](previews/comparacion/): roja y noche a 1280 y 390 px, con una dirección de ejemplo (Casilla de Correo 123, dato ficticio). Joaquín eligió la roja el 27-sep.

Las capturas y los nueve originales de referencia quedan fuera de `public/` y del build. Solo la tarjeta para compartir y los iconos se incluyen como imágenes públicas.
