# Validación de la web de consultas

13-sep-2026. Implementación de W01, interfaz de W02, preparación técnica de W03 y secciones configurables W07–W09. La oferta comercial y las conexiones pendientes están descritas en el [README](../README.md).

## Comprobaciones

- TypeScript y build de producción de tres entradas: inicio, privacidad y condiciones.
- 36 pares de contraste del sistema de diseño.
- Pruebas de reglas: contrato de respuesta de Formspree, datos separados del regalo, consentimiento expreso, baja sin alta accidental, validación de contacto/CP y requisitos por motivo.
- Navegador a 320, 375, 768 y 1440 px, texto ampliado al 200 %, movimiento reducido y navegación por teclado.
- Siete motivos de consulta; errores de campos, del servidor, de red y respuesta inesperada; doble envío bloqueado, referencia conservada al reintentar y confirmación persistente.
- Foco inicial del diálogo, recorrido contenido, Escape y devolución de foco; páginas de privacidad/condiciones accesibles por URL directa.
- La tarjeta para compartir representa la propia web y se revisó visualmente. Las fuentes se sirven localmente.

El [script de navegador](../tests/browser.mjs) bloquea todas las peticiones externas y simula las respuestas de Formspree. No se envían datos reales ni se comprueba la recepción en una bandeja o sheet. El [informe](report.json) conserva resultados, sin datos de personas.

El navegador integrado no pudo conectarse en este entorno; la comprobación se hizo con Chrome aislado y Playwright, sin usar el perfil personal. Estas pruebas no equivalen a una auditoría completa de accesibilidad ni a una revisión con lector de pantalla.

## Vistas

- [Escritorio](previews/escritorio.png)
- [Página completa](previews/pagina-completa.png)
- [Celular](previews/celular.png)
- [Confirmación](previews/confirmacion.png)
- [Imagen para compartir](../public/og.png)

Las capturas y los nueve originales de referencia quedan fuera de `public/` y del build. Solo la tarjeta para compartir y los iconos se incluyen como imágenes públicas.
