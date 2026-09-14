# Desarrollo de la web de La Oficina

- Antes de cambiar la interfaz, leer `DESIGN_SYSTEM.md`. Reutilizar los componentes de `src/design-system/index.tsx` y los tokens de `src/design-system/tokens.css`.
- El muestrario se abre en `/design-system/` con el servidor de desarrollo. Sus formularios son demostraciones locales, no envían datos. No incorporarlo al despliegue público por defecto.
- Mantener React, TypeScript, Vite, Tailwind y pnpm. No cambiar de plataforma de hosting para implementar diseño.
- Usar los ambientes `paper` y `night`. No inventar una nueva paleta, familia tipográfica, escala de espaciado ni componente equivalente a uno existente sin actualizar el sistema.
- La firma tipográfica web es una aproximación documentada. No redibujar el logotipo ni extraer grabados del moodboard para presentarlos como originales finales.
- La Oficina protege la identidad de sus integrantes. La claridad de formularios, precios, cobertura y estados no se oculta con lenguaje misterioso.
- La operativa vigente está en `../negocio/decisiones.md`. La actualización del 13-sep-2026 establece suscripción mensual y postulación de mensajeros mediante cuento propio. No tomar el viejo abono de cuatro expedientes como precio mensual ni usar proyecciones de septiembre como resultados.
- El plan de implementación está en `../negocio/plan.md#web`, dentro del repositorio de documentos. Consultar las entregas W01–W10 y sus dependencias; no presentar una recomendación de proveedor ni una función pendiente como implementada o contratada.
- Cada cambio de componentes debe mostrarse en el muestrario. Ejecutar `pnpm check:design` y `pnpm build`; revisar teclado y móvil cuando cambie interacción o composición.
- Las referencias internas viven en `design-system/references/`; nunca en `public/`. Las fuentes y licencias libres están en `src/design-system/fonts/`.
