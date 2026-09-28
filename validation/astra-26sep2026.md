# Revisión con Astra · web de presencia y contacto · 26-sep-2026

Corrida `20260926-lodluc-web-simple` del harness de Certuma (`~/Desktop/certuma/.harness/runs/`). Reviewer: Astra (gpt-6-astra, xhigh), sandbox de solo lectura sobre una copia del commit base `6aa6f70`, con las capturas de la web anterior y tres referencias de marca. Fable adjudica contra el código y aplica. Sin commit.

## Ronda 1 · plan (10 objeciones: 7 aceptadas, 3 parciales, 0 rechazadas)

| Nº | Objeción | Veredicto | Qué se hizo |
|---|---|---|---|
| C01 | La firma a 2,5 rem con sangría de 2,1 em parte «ÚLTIMOS CUENTOS.» en 390 px | Aceptada | `--office-text-signature` pasa a `clamp(1.9rem, 0.25rem + 8.4vw, 6.75rem)` y en pantallas de hasta 680 px la sangría del segundo nivel baja a 1,4 em: los dos niveles caben en 320 y 390 px. Con zoom al 200 % la frase quiebra entre palabras sin desborde (lo verifica `tests/browser.mjs`). Variante mostrada en el muestrario |
| C02 | La invitación de contacto no reconoce consultas de lectores ni medios, y no anticipa la respuesta por mail; la frase negativa sobre integrantes desaprovecha el bloque | Parcial | Texto de Astra adoptado: «Para consultas sobre los cuentos o propuestas de cafés, librerías, marcas y medios: escribinos. Te respondemos al mail que nos dejes». Botón «Enviar mensaje». Se cambia «La Oficina firma. Sus integrantes, no.» por «La firma es colectiva: La Oficina.» (la afirmación se mantiene porque protege la identidad de los integrantes, regla del proyecto) |
| C03 | Cambiar solo acción y foco deja el hover en lacre y el éxito en oliva | Parcial | Hover y texto del botón ya estaban en noche y papel; el éxito pasa a tinta en papel. El error conserva el rojo oscuro: una única señal fuera de la paleta pública, documentada en el manual. Superficies elevadas siguen en papel realzado (un tinte, no un color) |
| C04 | El aviso de privacidad omite contenidos del art. 6 de la Ley 25.326: responsable y domicilio, obligatoriedad de los campos y consecuencias | Aceptada | Se agrega que los tres campos son obligatorios y que sin ellos no hay respuesta; el pedido de acceso, corrección o eliminación enlaza a `/#contacto` sin depender del mail; queda la leyenda de derechos y AAIP. Responsable y domicilio legal quedan como pendiente explícito en el README, sin inventar datos ni publicar domicilios de integrantes |
| C05 | Poner toda la frase en cursiva borra la alternancia recta/cursiva de los sobres | Aceptada | `archivo` guarda la frase y el fragmento en cursiva; se compone con `EditorialQuote` en Cormorant recta con `em` en itálica |
| C06 | El cambio global de `--office-font-body` deja mal el muestrario | Aceptada | Muestrario actualizado: muestra de EB Garamond con `--office-font-reading`, escala y roles nuevos, formulario de demostración con motivo único, firma grande sobre rojo. `--office-leading-body` en 1,6 |
| C07 | Reducir `check:design` a tres pares desprotege controles y ambientes | Parcial | No se redujo: siguen los 36 pares y se agregan 4 (papel sobre tinta y noche, tinta sobre rojo en texto y borde). No se agregan comprobaciones de estilos computados en navegador |
| C08 | Eliminar `/condiciones/` sin definir qué pasa con la URL | Aceptada | `vercel.json` con redirección permanente de `/condiciones` y `/condiciones/` a `/#contacto`; sitemap con `/` y `/privacidad/`. No se prueba localmente (es del hosting); documentado en el README |
| C09 | W02 no desaparece: verificar que los mensajes llegan sigue siendo la condición central | Aceptada | README y `negocio/plan.md` lo mantienen como pendiente antes de publicar, con el payload nuevo y la revisión de reglas de Formspree que dependían de campos anteriores; los mocks no se presentan como prueba de recepción |
| C10 | `og:image:alt` describe la portada eliminada | Aceptada | Nuevo texto: «La firma de La Oficina de los Últimos Cuentos en tinta sobre papel rojo. Cuentos en papel, en sobre cerrado.» |

Verificado por Astra sin objeción: contraste tinta/rojo 4,65:1, gris/papel 5,42:1 y borde/papel 3,59:1; gris sobre rojo 1,68:1 (por eso la portada usa solo tinta); el payload conserva lo necesario para recibir y responder; retirar el consentimiento de avisos es coherente si dejan de ofrecerse altas; EB Garamond declarada sin usar no se descarga.

## Ronda 2 · diseño (3 objeciones: 3 aceptadas, 0 parciales, 0 rechazadas; 12 puntos verificados sin objeción)

Sobre una copia del working tree con la web nueva, capturas a 1280 y 390 px, confirmación, privacidad, tarjeta social y las tres referencias. Resumen de Astra: «El diseño ya tiene una identidad editorial sólida. No veo bloqueantes ni motivos para recomponer los bloques».

| Nº | Objeción | Veredicto | Qué se hizo |
|---|---|---|---|
| C01 | Los enlaces dentro de párrafos no se distinguen del texto: el preflight de Tailwind anula el subrayado | Aceptada | `.site p a` con subrayado de 1 px (2 px al pasar el mouse); los enlaces de portada y pie se subrayan al pasar el mouse |
| C02 | El enlace de privacidad del formulario se parte en dos líneas en móvil y no ofrece 48 px de área táctil | Aceptada | La frase previa va en un `span` y el enlace lleva el punto final; hasta 680 px el enlace ocupa su propia línea con alto mínimo de 48 px |
| C03 | La primera carga puede recomponer la firma al reemplazar Courier New por Inconsolata | Aceptada | `preload` de `inconsolata-normal.woff2` en las dos entradas HTML; Vite reescribe la ruta al asset con hash en el build |

Verificado por Astra sin objeción: composición de la firma en los dos anchos, retícula y márgenes, medida de lectura, escala de las citas frente al mono, comportamiento con cinco cuentos, proporciones del formulario, confirmación, pie y privacidad, contrastes y foco, controles de 48 px, tarjeta social. Señala que la QA al 200 % solo comprueba desborde horizontal en escritorio y no reemplaza una revisión visual del zoom en ambas páginas.

## Ronda 3 · cartas y sin productos (3 objeciones: 2 aceptadas, 1 parcial, 0 rechazadas; 11 puntos verificados sin objeción)

Misma fecha, segundo pedido de Joaquín: no mostrar los productos físicos y que los cuentos propios (y las propuestas) lleguen por carta física. Sobre una copia del working tree con el archivo retirado, el manifiesto en «Qué es», el bloque «Cartas» con dirección de ejemplo y el formulario como «Mensajes»; capturas a 1280 y 390 px, confirmación, privacidad y dos referencias. Resumen de Astra: «La página transmite una editorial pequeña, seria y con identidad propia. “Cartas, no archivos” funciona como una decisión del proyecto, sin resultar hostil. No veo bloqueantes».

| Nº | Objeción | Veredicto | Qué se hizo |
|---|---|---|---|
| C01 | «digital.» queda huérfana en la línea de portada a 1280 y 390 px | Aceptada | `text-wrap: balance` en `.cover-line`; los párrafos de lectura no lo usan |
| C02 | El estado sin dirección («La casilla de correo está por abrirse») sugiere una apertura inminente que no está confirmada | Parcial | Rótulo «Dirección pendiente» y texto «Todavía no tenemos casilla de correo. La dirección se publica acá cuando esté confirmada.». No se agrega la remisión al formulario que proponía Astra: los cuentos y las propuestas van por carta, y la web no se publica sin dirección (checklist del README) |
| C03 | La confirmación menciona cobros y suscripciones que el recorrido no ofrece | Aceptada | La confirmación queda en «Te respondemos al mail que dejaste.» |

Verificado por Astra sin objeción: firma a dos niveles, ritmo de los tres bloques en ambos anchos con Mensajes claramente secundario, peso de la tarjeta postal roja y su corte en móvil, semántica de `address` y del ambiente rojo, contrastes (tinta sobre rojo 4,65:1, gris sobre papel 5,42:1, bordes 3,59:1), áreas de 48 px, jerarquía h1/h2, longitud de los párrafos, copy sin garantía de publicación y con firma colectiva coherente con Privacidad, pie y enlaces. Señala otra vez que el reflujo al 200 % del script no reemplaza una prueba de zoom real ni una revisión completa de teclado.

## Ronda 4 · versión final con el manifiesto (3 objeciones: 3 aceptadas, 0 parciales, 0 rechazadas; 13 puntos verificados sin objeción)

28-sep-2026. Sobre una copia del working tree con el manifiesto de Joaquín, sin formulario ni privacidad, con pre-render y JSON-LD; capturas a 1280 y 390 px con dirección de ejemplo, 1280 px en estado pendiente, la tarjeta social y la referencia de la firma. Resumen de Astra: «La página se percibe como una editorial pequeña, seria y con identidad propia. El espacio vacío sostiene el misterio y la composición se siente completa. Mantendría la tipografía y los tres párrafos del manifiesto».

| Nº | Objeción | Veredicto | Qué se hizo |
|---|---|---|---|
| C01 | El `noscript` pedía activar JavaScript para leer una página que ya llega completa pre-renderizada; sin JavaScript aparecía después del pie | Aceptada | Se elimina el `noscript` de `index.html` |
| C02 | El JSON-LD declaraba `areaServed: "AR"`, una cobertura que la página no afirma | Aceptada | Se quita `areaServed`; los datos estructurados dicen solo lo que dice la página |
| C03 | La dirección postal iba en `streetAddress`, que describe una calle, cuando son casilla, sucursal y ciudad | Aceptada | `address` pasa a texto: las líneas de la casilla unidas por comas, o la ciudad cuando no hay dirección |

Verificado por Astra sin objeción: portada en los dos anchos; tipografía y medida del manifiesto (24 px en escritorio, 20 px en móvil, 34ch, interlineado 1,45) y el ritmo de los tres párrafos con 40 px antes de la invitación; jerarquía entre manifiesto y cuerpo de 17 px; peso de la tarjeta roja y su crecimiento a 390 px; estado pendiente honesto y condición de no publicar sin dirección; cierre que promete lectura y no publicación; pie; semántica (h1 con la firma como `role="img"`, un solo h1 sin h2 artificiales, `address`); contrastes (tinta sobre rojo 4,65:1, tinta sobre papel 15:1, gris sobre papel 5,42:1); enlace de salto de 48 px; pre-render e hidratación (mismos datos, `hasChildNodes`, `key` estable, sin `window` ni `document`); inserción protegida del JSON-LD; tarjeta social de 1200 × 630 y metadatos con laoficinaexiste.com. Señala que el test del 200 % corre solo a 1440 px y que la revisión no certifica zoom móvil ni lector de pantalla.
