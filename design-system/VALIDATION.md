# Verificación del sistema de diseño v1.0

13-sep-2026. El muestrario se verificó con Chrome aislado, sin usar sesiones personales. La integración del navegador interno no pudo inicializarse; la revisión visual e interactiva se hizo con un navegador local de prueba.

- `pnpm run build`: correcto, TypeScript de la landing y del muestrario incluido.
- `pnpm run check:design`: 36 combinaciones de contraste aprobadas.
- Anchos 320, 375, 768 y 1.440 px: sin desbordamiento horizontal.
- Diálogo papel/noche: apertura, cierre visible, Escape, recorrido Tab/Shift+Tab y retorno al disparador comprobados.
- Formulario de muestra: validación inválida/válida, foco en el mail incorrecto, casilla de novedades inicialmente desmarcada y confirmación comprobados.
- Cambio de ambiente y preferencia de movimiento reducido comprobados.
- Cero errores de ejecución y cero peticiones a servicios externos durante la prueba del muestrario. Los ejemplos no enviaron datos.
- Las nueve referencias se sirven correctamente; las tres imágenes del muestrario cargan y se decodifican.
- La landing anterior sigue abriendo y cerrando su formulario. No se probó un envío real a Formspree.
- El build público excluye el muestrario, sus referencias y estas capturas.

El control de contraste y la prueba de teclado no constituyen una auditoría completa de accesibilidad ni una prueba con lector de pantalla. Cada flujo futuro requiere verificar su integración, servicios y contenido.

## Vistas guardadas

- [Escritorio](previews/escritorio.png)
- [Celular](previews/celular.png)
- [Formulario noche en celular](previews/formulario-noche.png)
- [Muestrario completo](previews/muestrario-completo.png)
- [Resultado de las comprobaciones](previews/report.json)
