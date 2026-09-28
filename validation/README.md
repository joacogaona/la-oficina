# Validación de la web

27-sep-2026. Web de presencia: portada, manifiesto, invitación y dirección postal, solo cartas. Reemplaza las validaciones del 13-sep y del 26-sep. El alcance y las conexiones pendientes están en el [README](../README.md).

## Comprobaciones

- TypeScript y build de producción de una sola entrada.
- 40 pares de contraste del sistema de diseño, incluidos tinta sobre el rojo de la portada y papel sobre tinta.
- Navegador a 320, 375, 768 y 1440 px, texto ampliado al 200 %, movimiento reducido.
- Dirección postal mostrada cuando está configurada o aviso de dirección pendiente cuando no; ningún formulario, enlace de mail, cuento ni sobre en la página; canonical y tarjeta para compartir presentes; ninguna petición externa.
- Página completa sin JavaScript (pre-render) y JSON-LD Organization con la URL canónica; sin errores de consola al hidratar.

El [script de navegador](../tests/browser.mjs) bloquea todas las peticiones externas. El [informe](report.json) conserva resultados, sin datos de personas. Estas pruebas no equivalen a una auditoría completa de accesibilidad ni a una revisión con lector de pantalla.

La revisión externa (Astra, cuatro rondas del 26 al 28-sep) y su adjudicación están en [astra-26sep2026.md](astra-26sep2026.md).

## Vistas

- [Escritorio](previews/escritorio.png)
- [Página completa](previews/pagina-completa.png)
- [Celular](previews/celular.png) y [celular completa](previews/celular-completa.png)
- [Con dirección de ejemplo](previews/con-direccion/): página completa y celular con la casilla ficticia 123, para ver la sección roja con la dirección.
- [Imagen para compartir](../public/og.png)
- [Favicon](../public/favicon.png) e [ícono](../public/apple-touch-icon.png): la “L.” de la firma en tinta sobre rojo, a 64 y 180 px.
- [Comparación de portadas](previews/comparacion/): roja y noche a 1280 y 390 px, con una dirección de ejemplo (Casilla de Correo 123, dato ficticio). Joaquín eligió la roja el 27-sep.

Las capturas y los nueve originales de referencia quedan fuera de `public/` y del build. Solo la tarjeta para compartir y los iconos se incluyen como imágenes públicas.
