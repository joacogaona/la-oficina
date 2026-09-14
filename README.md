# La Oficina de los Últimos Cuentos · web

React + TypeScript + Vite + Tailwind. La web aplica el sistema de diseño y recibe consultas mediante el Formspree existente. Node 22.18 o superior, pnpm 8.9.2.

El [plan de mejora de la web](../negocio/plan.md#web) define las etapas y sus condiciones de salida. El [estado de implementación](../negocio/plan.md#web-implementacion) distingue código terminado, conexiones pendientes y operación comercial. Ambos están en el repositorio de documentos, hermano de esta carpeta.

## Funciones disponibles

- Portada, cómo funciona, recibir/regalar, focos, mensajeros, encuentros y contacto para propuestas/marcas.
- Siete recorridos: recibir, regalar, foco, mensajero, avisos de encuentros, contacto y gestión de avisos/datos. Solo se envían los campos del motivo seleccionado.
- Errores por campo, estado de envío, bloqueo del doble clic, reintento con la misma referencia y confirmación persistente. Los datos se limpian solo cuando el servicio confirma recepción.
- Permiso de avisos desmarcado por defecto, con fecha, texto y versión; el destinatario de un regalo no se agrega a la lista.
- `/privacidad/` y `/condiciones/`, con entradas HTML propias; metadatos por página, tarjeta para compartir, favicon, robots y sitemap.

Los formularios son consultas. No cobran, activan suscripciones, confirman selección de mensajeros ni hacen reservas. La captura de una baja genera un pedido para gestión manual; no hay campañas ni lista automatizada. Formspree conserva su ID anterior; sus respuestas todavía no se sincronizan con el sheet. La configuración de la cuenta y la recepción final necesitan verificarse antes de publicar. Los tests simulan las respuestas del proveedor, no envían mails reales.

## Contenido y conexiones

Editar [src/content/site.ts](src/content/site.ts) para cargar focos, buzón y encuentros confirmados. No agregar datos de lectores ni direcciones de integrantes. Un foco requiere `publicado: true`; el buzón necesita dirección e instrucciones acordadas. Los encuentros incluyen inicio/fin con zona horaria, modalidad de acceso y estado; tras su fecha de fin dejan de anunciarse como próximos.

Copiar `.env.example` a `.env.local` para completar la configuración local cuando esté disponible. Los valores `VITE_` son públicos y se incorporan al compilar; nunca poner claves privadas allí.

| Variable | Uso y comportamiento actual |
|---|---|
| `VITE_CONTACT_EMAIL` | Vacía: se ofrece el formulario de contacto. Al completarla aparece el mail público y el contacto alternativo ante error |
| `VITE_GOOGLE_FORM_URL` | Vacía: formularios propios hacia Formspree. Al completarla, los accesos de consulta llevan a ese Google Form; debe tener sus recorridos y destino verificados antes. La gestión de datos sigue en Formspree |
| `VITE_FORMSPREE_ID` | Conserva `mredjdzd`; revisar reglas, límites, bandeja y configuración antispam en la cuenta |
| `VITE_PUBLIC_SITE_URL` | URL de producción existente en Vercel; cambiar al conectar un dominio propio. Genera canonical, URLs sociales y sitemap |

La configuración valida los formatos de mail, dominio HTTPS y enlaces de Google Forms. Configurar también estas variables en el hosting al desplegar. El dominio, mail público y Google Form no estaban disponibles al implementar esta versión, según confirmó Joaquín. No se modificó la planilla ni se hizo un despliegue.

Antes de publicar: verificar recepción real de cada motivo, responsable/contacto del aviso de datos, límites y protección antispam del formulario, y plan comercial adecuado en Vercel. Antes de habilitar contratación: resolver precio, cobertura, ciclo, cobro/renovación/cancelación y registro mensual, según N1–N3/W04–W05. Las condiciones actuales explican consultas; no son términos de venta de una suscripción ya disponible.

## Sistema de diseño

La referencia para todo próximo desarrollo es [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

- [Tokens](src/design-system/tokens.css): color, tipografía, espacios y ambientes.
- [Componentes](src/design-system/index.tsx): firma, acciones, formularios, mensajes, fichas y diálogo.
- [Estilos](src/design-system/styles.css): implementación visual compartida.
- [Muestrario](design-system/main.tsx): ejemplos interactivos y las nueve referencias originales.

Desde esta carpeta:

```sh
pnpm dev
```

Abrir la URL local indicada por Vite. `/` es la nueva web; `/design-system/` sigue siendo el muestrario interno. Este último no se incluye en el build público y sus formularios de demostración no hacen peticiones ni guardan datos.

```sh
pnpm check:design
pnpm test
pnpm build
```

El build compila también el TypeScript del muestrario. La validación y las vistas de esta entrega están en [validation/README.md](validation/README.md). Las pruebas de reglas de formularios usan el runner nativo de Node. La revisión de navegador está en [tests/browser.mjs](tests/browser.mjs): requiere Playwright como herramienta opcional y Chrome local; se puede indicar el módulo mediante `OFFICE_PLAYWRIGHT_MODULE`, el ejecutable mediante `OFFICE_CHROME_PATH` y la URL mediante `OFFICE_PREVIEW_URL`.

La tarjeta e iconos se generan con [scripts/render-share-card.mjs](scripts/render-share-card.mjs), desde la propia composición HTML/CSS y las fuentes locales. Usa las mismas variables de herramienta. Sus PNG finales están en `public/`; las referencias originales y las capturas de QA permanecen fuera del build.
