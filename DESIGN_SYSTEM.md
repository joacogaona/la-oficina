# La Oficina de los Últimos Cuentos

## Sistema de diseño digital · versión 1.1

13 de septiembre de 2026, actualizado el 26 de septiembre de 2026. Base para desarrollar la web a partir de la identidad física que compartió Joaquín: tres sobres, tres moodboards, firma, grabados y maqueta del objeto. La versión 1.1 responde a su pedido de una web mucho más simple, profesional y con identidad fuerte: la web usa un subconjunto del sistema (tres colores, dos familias) y algunos tokens cambian; ver el registro al final. La definición operativa está en [decisiones](../negocio/decisiones.md).

**La pantalla abre la puerta. La experiencia sucede afuera.**

El sistema tiene cuatro partes: este manual, los [tokens](src/design-system/tokens.css), los [componentes React](src/design-system/index.tsx) y el [muestrario](design-system/main.tsx). Los tokens y componentes son la fuente ejecutable; el manual explica cómo elegirlos. Cambiar uno exige actualizar los ejemplos afectados, no crear una segunda versión.

Para ver el muestrario: ejecutar `pnpm dev` en `web/` y abrir `/design-system/` en la URL que indique Vite. Es una entrada de desarrollo, excluida del build público. Sus formularios no envían ni persisten información. Incluye vista de papel, noche, validación y diálogo operable por teclado.

La revisión y las vistas guardadas están en [VALIDATION.md](design-system/VALIDATION.md).

## 1. Identidad y función de la web

La Oficina es una red de resistencia al ruido digital. Escribe cuentos, los hace circular físicamente y protege la identidad de sus integrantes. Se manifiesta mediante cartas, mensajeros y focos en la ciudad. Su misterio nace de encontrar algo que alguien preparó con cuidado.

La web es presencia (27-sep-2026): la única puerta digital de una red física. Quien tiene un sobre en la mano o le hablaron de la Oficina tiene que entender qué es y adónde escribir. Todo contacto empieza por carta: no hay formulario, mail ni redes. No vende, no suscribe, no anuncia fechas ni focos, y no muestra los sobres ni los cuentos como producto. Una página, unas 80 palabras: portada roja con la firma, el manifiesto de la Oficina, la invitación a escribir y la dirección postal. Regla para lo que venga: lo digital sirve para encontrar a la Oficina; todo lo demás pasa en papel. Un encuentro futuro se anuncia con una línea, como un afiche, sin inscripción.

Principios:

1. **Presencia discreta.** Pocas acciones, ritmo editorial, espacios amplios y contenidos que justifican su lugar.
2. **Misterio hospitalario.** La invitación despierta curiosidad. El formulario orienta y confirma. No se simulan rechazos, permisos secretos ni demoras arbitrarias.
3. **Huella material.** Papel, tinta, grabado, sello, sobre y numeración. Los integrantes no son el contenido de la marca.
4. **Una colección coherente.** Los expedientes pueden cambiar de color y frase; conservan firma, proporciones y jerarquía.
5. **Poco ruido.** Sin animaciones continuas, sonidos, cursor personalizado, notificaciones insistentes, cuenta regresiva ni carrusel automático.

## 2. Qué se toma de las referencias

| Referencia | Rasgo que se traslada | Qué queda como referencia |
|---|---|---|
| Sobres celeste, negro y oliva | Color por expediente, cita central, pequeña imagen, numeración | Troqueles, márgenes de imprenta y líneas de plegado |
| Firma sobre rojo | Letra estrecha de archivo, dos niveles desplazados, “de los” pequeño | El dibujo exacto del logotipo |
| Búho, pluma y velas | Grabado de una tinta, símbolo discreto, contraste material | Las ilustraciones hasta disponer de originales aptos para web |
| Sobre físico con lacre | Papel cálido, acento rojo, detalle y proporción horizontal | Efectos fotográficos o texturas a tamaño de pantalla |
| Moodboards | Cormorant Garamond, EB Garamond, archivo, correspondencia | Marcas de terceros, retratos de inspiración y fuentes comerciales sin archivo/licencia web |

Las nueve imágenes se conservan sin modificación en [references](design-system/references/manifest.json). Son material interno; no se publican como assets del producto. Los valores de color son una interpretación digital de capturas, no especificaciones CMYK/Pantone ni coincidencias certificadas.

## 3. Firma y símbolos

Nombre público: **La Oficina de los Últimos Cuentos**. Forma breve en el cuerpo del texto: **La Oficina**. Mantener los acentos aunque el dominio no los tenga. El dominio no cambia automáticamente el nombre público.

`BrandSignature` implementa una firma tipográfica web con Inconsolata, dos líneas desplazadas y “de los” pequeño. Es una aproximación de interfaz identificada como tal, no una reconstrucción del logotipo original. Al recibir el vector oficial, sustituir el interior del componente y conservar su nombre accesible.

- Usar una sola tinta, con espacio libre de al menos la altura de “LA”.
- Firma de portada: `className="office-signature--display"` escala con `--office-text-signature` (30 a 108 px, fluido con el ancho) y en pantallas angostas reduce la sangría del segundo nivel a 1,4 em para que “ÚLTIMOS CUENTOS.” siga en una línea a 320 y 390 px. En la web es el `h1` de la portada roja; su nombre accesible sigue siendo el nombre completo.
- No comprimir, estirar ni aplicar sombras al logotipo. No usarlo como fondo detrás de texto.
- Firma compacta: aproximadamente 190–280 px de ancho, según el contenedor. En móvil puede reducirse si las palabras conservan legibilidad.
- Búho, pluma, vela, colectivo o milanesa pertenecen a ilustraciones de identidad o de expediente. No crear una mascota ni una colección de iconos genéricos a partir de ellos.
- Para cerrar un diálogo alcanza un signo × con etiqueta accesible. Las acciones importantes llevan palabras.
- No usar fotografías que revelen caras, nombres, credenciales, domicilios particulares ni otros rasgos identificables de los integrantes. Las imágenes del moodboard no autorizan a presentar a sus personas como miembros.

## 4. Color: papel, noche y colección

Los tokens primitivos empiezan con `--office-color-`. Las interfaces consumen roles semánticos como `--office-text` o `--office-surface`, que cambian con el ambiente.

| Color | Valor | Uso |
|---|---|---|
| Papel | `#F3F0E7` | Fondo principal, lectura y formularios |
| Papel elevado | `#FBF9F2` | Campo, diálogo y mensaje |
| Tinta | `#1C1C18` | Texto sobre papel y colores de colección |
| Noche | `#11120F` | Portadas y secciones oscuras |
| Lacre | `#71312F` | Reservado para piezas impresas; desde v1.1 no es la acción web |
| Rojo | `#D2645B` | Ambiente de portada y tarjeta para compartir; texto solo tinta |
| Oliva | `#818B59` | Fondo de expediente |
| Celeste | `#B0C8CC` | Fondo de expediente |
| Arcilla | `#B57B64` | Acento secundario de objeto, no nuevo ambiente |

**Papel** es el ambiente predeterminado de lectura, formularios y páginas de información; su mensaje de éxito va en tinta y el de error conserva el rojo oscuro, la única señal de color fuera de la paleta pública. **Rojo** es el ambiente de la portada de la web: el papel de la firma, con texto solo en tinta (4,7:1) y sin gris. **Noche** queda como alternativa para piezas e invitaciones; la web no lo usa desde v1.1. No hace falta ofrecer un selector de tema al público; el selector del muestrario sirve para evaluar componentes.

La web usa solo papel, tinta, rojo y el gris cálido para texto secundario. Oliva, celeste, arcilla, lacre y noche siguen definidos para el muestrario y para futuras fichas por expediente; no volver a traerlos a la web sin decisión.

Los tonos rojo, oliva y celeste se usan como soportes editoriales con texto tinta. No usar texto blanco pequeño sobre rojo u oliva: esa combinación de las piezas impresas no se traslada a controles web. Las tarjetas de colección muestran contenido; ubicar formularios y acciones en una superficie papel/noche adyacente.

| Rol | Papel | Rojo | Noche |
|---|---|---|---|
| `--office-surface` | Papel | Rojo | Noche |
| `--office-text` | Tinta | Tinta | Papel |
| `--office-text-muted` | Gris cálido oscuro | Tinta | Gris cálido claro |
| `--office-action` | Tinta | Tinta | Arcilla clara `#EDB4A2` |
| `--office-on-action` | Papel | Rojo | Tinta |
| `--office-focus` | Tinta | Tinta | Celeste |
| `--office-success` | Tinta | Tinta | Oliva claro |
| `--office-error` | Rojo oscuro | Tinta | Rojo claro |

La diferencia entre `--office-rule` y `--office-control-border` es funcional: la primera separa contenido y puede ser tenue; la segunda identifica un control y debe conservar contraste. No usar opacidad para inventar un nuevo color de ayuda o error.

`pnpm check:design` verifica los pares de texto (al menos 4,5:1), bordes de control y foco (al menos 3:1). El resultado no certifica accesibilidad de una página completa. Referencias: [contraste de texto W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [contraste no textual W3C](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## 5. Tipografía

Dos voces. El mono es la voz de la Oficina (la máquina de escribir de la firma); la serif es la voz de los cuentos y aparece solo cuando habla un cuento. En la página pública no habla ningún cuento: se ve una sola familia. La serif sigue en el sistema para piezas, muestrario y cualquier cita futura.

| Rol | Familia | Aplicación |
|---|---|---|
| La Oficina (`--office-font-body`, `--office-font-label`) | Inconsolata | Firma, texto corriente, rótulos, botones, campos, números y pie; 400 y 500 |
| Los cuentos (`--office-font-display`) | Cormorant Garamond | Frases de sobre y citas: recta 400 con un fragmento en cursiva; nunca instrucciones ni controles |
| Lectura larga (`--office-font-reading`) | EB Garamond | Reservada para publicar un cuento en pantalla; declarada en `fonts.css`, la web no la carga |

Las dos Garamond están presentes en los moodboards y en la base anterior. Inconsolata es la sustitución web libre propuesta para la función de archivo. No afirmamos que sea la fuente exacta de la firma. Jimmy Pro Serif, Maui, Secret Relic y Paloma se conservan como referencias, no se incorporan sin sus archivos y licencia correspondiente.

Fuentes locales WOFF2, subconjunto latino con ñ y acentos españoles, `font-display: swap`, licencias OFL archivadas. No se hacen peticiones a Google Fonts en tiempo de visita. Se declaran Georgia y Courier New como respaldo. Añadir otros alfabetos requiere incorporar sus subconjuntos.

| Token de tamaño | Escala | Interlineado |
|---|---|---|
| `caption` | 12 px | 1,5 |
| `label` | 13 px | 1,4 |
| `small` | 15 px | 1,4 |
| `body` | 17 px | 1,6 |
| `lead` | 20–24 px | 1,4 |
| `heading` | 36–64 px | 1,1 |
| `display` | 48–108 px | 1,04 |
| `signature` | 30–108 px | 1,06 |

Las frases de sobre (muestrario y piezas) usan la serif entre 28 y 44 px. El mono rinde más grande que la serif a igual tamaño; por eso `body` bajó de 20 a 17 px en v1.1.

Los valores se expresan en rem y clamp, relativos a una base de navegador de 16 px. No bloquear el zoom. Mayúsculas solo en rótulos y firma; conservar mayúsculas normales en frases y explicaciones. Cursiva para un fragmento significativo, no para instrucciones completas. Evitar pesos de fantasía y tipografías manuscritas pequeñas en botones.

## 6. Composición, espacio y movimiento

- Contenedor general máximo 76 rem (1.216 px), incluida su separación lateral.
- Ancho de lectura hasta 40 rem (640 px) y párrafos hasta 62 caracteres en mono. Formulario hasta 32 rem (512 px).
- La página pública se compone en bloques de dos columnas: rótulo en mono a la izquierda (11 rem) y cuerpo a la derecha, separados por una línea fina. En móvil, una columna.
- La portada roja no usa `100vh`: su alto sale del espacio entre la fila superior (ciudad y enlace a contacto), la firma y la frase. En escritorio deja ver el papel debajo.
- Márgenes laterales fluidos de 20–64 px. Secciones de 56–112 px de separación vertical.
- Escala de espacios: 4, 8, 12, 16, 24, 32, 48, 64, 96 y 128 px. Usar las variables `--office-space-*`.
- Interfaz de una columna en móvil; dos columnas para texto y apoyo en escritorio; tres solo para una colección breve.
- Los ejemplos usan cortes en 680 y 960 px. Ajustarlos por necesidad real del contenido, no por modelo de teléfono.
- Esquinas rectas y líneas finas. No usar píldoras, tarjetas flotantes repetidas, brillos ni vidrio translúcido.
- Una portada puede usar una pieza de papel enmarcada. La sombra de registro es una licencia del muestrario, no el estilo de cada control.
- Textura solo como detalle de una fotografía o asset preparado. El fondo plano es la implementación base; nunca poner grano que reduzca legibilidad.
- Transiciones de color y borde de 160 ms. Respetar `prefers-reduced-motion`. Sin desplazamientos de contenido al pasar el mouse.
- Evitar `height: 100vh` y `overflow: hidden` en páginas de contenido. Permitir que textos, zoom y teclado móvil aumenten el alto.

## 7. Componentes disponibles

Importar desde `src/design-system` y cargar `src/design-system/styles.css` una sola vez.

| Componente | Opciones principales | Regla |
|---|---|---|
| `BrandSignature` | `className` y atributos HTML | Firma con un solo nombre accesible |
| `Eyebrow` | Hijos y atributos de párrafo | Contexto de archivo, nunca sustituye un encabezado |
| `Button` | `variant`, `pending`, `pendingLabel`, atributos nativos | Acción local; para navegar usar un enlace real |
| `TextField` | `label`, `hint`, `error`, atributos de input | Etiqueta visible, ayuda y error asociados por ID; los campos no obligatorios muestran “(opcional)” |
| `TextAreaField` | Igual, atributos de textarea | Nota libre opcional, redimensionable |
| `SelectField` | Igual, `option` como hijos | Selector nativo y accesible |
| `CheckboxField` | `label`, `hint`, `error`, atributos nativos | La casilla de novedades empieza desmarcada |
| `Notice` | `tone`: info/success/error, `title` | Mensaje persistente, con texto y región viva |
| `Dialog` | `open`, `onClose`, `title`, `description`, `theme` | Diálogo nativo; fondo inerte, Escape y retorno de foco |
| `EditorialQuote` | Hijos, `source` opcional | Cita serif, cursiva mediante `em` |
| `PaperCard` | `tone`: paper/red/olive/blue/night | Ficha editorial, no toda la tarjeta como botón |
| `Envelope` | hijos: un `address` o `p` con la dirección | Frente de sobre de papel sobre cualquier ambiente: líneas del remitente, estampilla con la “L.” de la firma y la dirección abajo a la derecha. Solo direcciones confirmadas o el estado pendiente |

Los componentes aceptan atributos nativos y no incluyen lógica de precios, pagos, coberturas ni servicios de correo. El contenedor propietario maneja datos y peticiones.

### Acciones y estados

Principal: un botón tinta en papel o claro en noche. Secundario: contorno. Discreto: texto subrayado. Mantener como mínimo 48 px de alto; no reducir el área táctil al texto.

Estados: reposo, hover, foco de teclado, presionado nativo, deshabilitado y envío. `pending` deshabilita el doble envío, cambia el texto y aplica `aria-busy`. No deshabilitar preventivamente un formulario vacío sin explicar qué falta.

Un enlace de navegación puede usar `className="office-button office-button--secondary"`, conservando `href`. No usar botones con `window.location` para navegación habitual.

### Formularios

1. Explicar qué se solicita y qué ocurre después.
2. Pedir únicamente los campos necesarios. Distinguir contacto del solicitante y destinatario de un regalo.
3. Usar `required` para campos obligatorios; se marcan los opcionales, no los obligatorios. Ayudas visibles, sin depender de placeholders.
4. Después de un intento inválido, asociar el error al campo, enfocar el primero y conservar los valores.
5. Durante envío, mostrar “Enviando solicitud…”. Nunca simular éxito si el servicio devuelve error.
6. Ante error de red, conservar datos y permitir reintentar. Mantener un contacto alternativo real cuando exista.
7. Confirmar con texto persistente o dejar la confirmación en una vista alcanzable. No depender exclusivamente de un toast que desaparece.
8. Si alguna vez hay novedades por mail, requieren una opción separada y voluntaria. La web actual no tiene lista de avisos.

### Diálogos

Un diálogo por vez. `Dialog` enfoca su título al abrir, contiene la navegación por teclado y devuelve el foco al disparador al cerrar. Escape y el botón de cerrar deben funcionar. El formulario cabe en la pantalla con scroll propio. Clic fuera no descarta una solicitud escrita. No usar el diálogo para mostrar condiciones largas: esas deben tener una página o sección legible.

## 8. Voz y contenido

Primera persona plural, español rioplatense, voseo. Frases breves y precisas. Firma colectiva. Sin nombres de integrantes, emojis decorativos ni urgencia comercial.

| Momento | Texto de referencia |
|---|---|
| Identidad | “Cuentos por carta.” |
| Qué es | “La Oficina escribe cuentos y los hace llegar en papel: una carta con un cuento, un objeto y un sobre cerrado.” |
| Firma colectiva | “La firma es colectiva: La Oficina.” |
| Contacto | “Para consultas sobre los cuentos o propuestas de cafés, librerías, marcas y medios: escribinos. Te respondemos al mail que nos dejes.” |
| Acción | “Enviar mensaje”, “Escribir otro mensaje” |
| Éxito | “Tu mensaje llegó a la Oficina. Te respondemos al mail que dejaste.” |
| Error | “No pudimos confirmar el envío. Tu mensaje sigue en el formulario: podés reintentar.” |

Evitar confirmaciones como “responderemos cuando lo consideremos oportuno”: no orientan a quien acaba de confiar sus datos. Se puede conservar misterio sin insinuar arbitrariedad. No prometer un plazo de respuesta hasta acordarlo.

### Lo que la web no dice

La actualización del 13-sep establece suscripción mensual, una carta con un cuento por mes, avisos de los encuentros mensuales y focos físicos de compra. Empieza en CABA, con alcance de envíos a Argentina y expansión mediante mensajeros en otras ciudades. Los mensajeros se postulan con un cuento propio enviado por carta; la Oficina selecciona para publicación y coordina su participación.

Desde el 26-sep la web no muestra precio, cobertura, focos, buzón ni encuentros: todo eso se conversa por carta hasta existir. No inventar esos valores en componentes ni en ejemplos. Si alguna de esas cosas se vuelve real, se agrega una sección o una página con datos verificados.

Los precios, proyecciones y cronogramas anteriores del plan son antecedentes fechados. La fuente de decisiones es `../negocio/decisiones.md`, no este manual. Las pantallas de ejemplo usan datos ficticios identificados como tales.

## 9. Patrones de la página pública

**Portada (rojo):** la ciudad en rótulo, la firma como `h1` y la frase “Cuentos por carta.” en mono. Sin enlaces, ilustraciones, nav ni botones. La tarjeta para compartir es esta misma portada. Se comparó con una portada noche (firma en rojo sobre noche) y Joaquín eligió la roja: es el papel del sobre y de la firma, lo que la gente reconoce del objeto.

**Manifiesto (papel):** los párrafos de `site.manifiesto` en tamaño `lead`, medida de 34 caracteres. Es el único lugar donde la Oficina habla; corto y sin mecánica (precios, focos, suscripción, encuentros). El texto vigente es el de Joaquín del 28-sep-2026, en tres párrafos: evocación, interpelación y cierre.

**Cartas (rojo):** segunda sección con el mismo ambiente de la portada (`section.letters`, `data-office-theme="red"`): “Si querés mandar un cuento, vender nuestros cuentos en tu local o hacernos una propuesta, mandanos una carta a:” en tamaño `lead`, seguido del frente de un sobre de papel chico, un detalle de 18 rem como máximo (`Envelope`: líneas del remitente arriba a la izquierda, estampilla con la “L.” de la firma arriba a la derecha) que lleva `address.postal` abajo a la derecha con el nombre y las líneas de `site.postal`, en tamaño de etiqueta; si no hay dirección, el sobre lleva un párrafo `postal-pending` que dice que todavía no hay casilla y que la dirección se publica cuando esté confirmada. Cierra en cuerpo con “Leemos todo lo que llega. Si dejás un mail o un teléfono en la carta, te contactamos.” Nunca un domicilio de integrantes, nunca una promesa de publicación.

**Pie (papel):** nombre completo y ciudad, y la frase “La Oficina existe.” (la del dominio). La web no recolecta datos; no hay página de privacidad.

Cuando exista algo nuevo (un encuentro con fecha, un foco confirmado), se agrega una línea o un bloque con el mismo patrón, nunca un formulario. Las fechas y direcciones solo se muestran confirmadas.

## 10. Implementación y mantenimiento

```tsx
import { Button, TextField } from "./design-system";
import "./design-system/styles.css";

export function Contacto() {
  return (
    <section className="office-surface office-stack" data-office-theme="paper">
      <h2 className="site-label">Contacto</h2>
      <TextField label="Mail" type="email" name="email" autoComplete="email" required />
      <Button type="submit">Enviar</Button>
    </section>
  );
}
```

Los colores `office-*` están disponibles en Tailwind, aunque la página pública no usa utilidades: sus estilos viven en `src/styles.css` sobre los tokens. Para estilos nuevos preferir tokens semánticos y componentes. No combinar modificadores de opacidad Tailwind con colores semánticos: definir un rol contrastado en tokens.

La página pública aplica tokens, fuentes locales y la firma a portada, manifiesto, invitación y dirección; no hay formulario ni recepción digital. Sus datos públicos viven en `src/content/site.ts`. `Button`, `TextField`, `TextAreaField`, `SelectField`, `CheckboxField`, `Notice`, `Dialog`, `PaperCard`, `EditorialQuote` y `Eyebrow` siguen en el sistema y en el muestrario sin uso en la web. Los alias heredados `--office-legacy-*` se eliminaron en v1.1. La firma sigue siendo una aproximación tipográfica. Estado y límites de la implementación en [README](README.md).

Para cambiar el sistema:

1. Consultar este manual y la decisión operativa relevante.
2. Reutilizar antes de extender; si falta una variante, agregarla al componente compartido.
3. Mostrar el caso en el muestrario, incluidos error y estados de interacción.
4. Ejecutar `pnpm check:design` y `pnpm build`.
5. Revisar móvil, teclado, foco y zoom cuando corresponda. Los ejemplos internos y las referencias nunca se añaden a `public/`.
6. Actualizar esta versión y su motivo cuando cambie una regla, no por cada ajuste de texto.

### Registro

**v1.2, 27-sep-2026:** la web pasa a ser solo presencia y solo cartas (pedido de Joaquín: menos texto, espíritu de misterio, primer contacto en papel). Se retiran el formulario, Formspree, el mail público y la página de privacidad; la página queda en portada, manifiesto, invitación y dirección postal. Regla nueva: lo digital sirve para encontrar a la Oficina y todo lo demás pasa en papel. Descartados el cursor con vela y la portada noche; el búho quedó como sello futuro (ver 28-sep).

**28-sep-2026:** entra el manifiesto de Joaquín en tres párrafos, sin cambios de tokens ni componentes. El build pre-renderiza la página y agrega datos estructurados Organization; el dominio público es laoficinaexiste.com. Cuarta ronda de Astra: tres objeciones técnicas aceptadas (sin `noscript`, sin `areaServed`, dirección como texto), sin bloqueantes visuales. Ajustes posteriores del mismo día, por pedido de Joaquín: la línea de portada pasa a “Cuentos por carta.”; la invitación y la dirección forman una segunda sección roja con “mandanos una carta a:” y la nota sobre mail o teléfono en la carta; se retiran “Lo que se publica lleva la firma de la Oficina.” y “Los remitentes se usan solo para responder.”; el pie cierra con “La Oficina existe.” La firma colectiva y el uso de los remitentes siguen como reglas internas, no como texto de la web. Como el bloque rojo quedaba en puro texto, la dirección pasa al frente de un sobre de papel: componente `Envelope`, nuevo en el sistema y en el muestrario, con las líneas del remitente y la estampilla. Búho: a pedido de Joaquín se dibujaron dos búhos originales para el sello (una silueta de cuerpo entero y, después, un grabado a pluma generado por script); ninguno lo convenció y el mismo día pidió volver a la “L.” de la firma. Queda así: la “L.” en tinta sobre el rojo de la portada es el favicon y el ícono de iPhone (PNG generados por el script con la tipografía de la página) y también la estampilla del sobre, en la fuente de etiquetas con el peso y el tracking de la firma. No hay ilustraciones en la web. Último ajuste del día: el sobre pasa a ser un detalle (18 rem de ancho como máximo, dirección en tamaño de etiqueta, estampilla y líneas del remitente proporcionales), porque a Joaquín le resultaba demasiado grande: lo pidió más chico dos veces. La sección roja lleva el texto a todo el ancho, a diferencia del manifiesto.

**v1.1, 26-sep-2026:** la web pasa a ser una página de presencia y contacto (pedido de Joaquín: menos colores, tipografías y secciones; identidad fuerte). Nuevo ambiente rojo para la portada; la acción y el foco en papel pasan de lacre a tinta; `--office-font-body` pasa a Inconsolata y EB Garamond queda como `--office-font-reading` reservada; escala de texto 12/13/15/17; token `--office-text-signature` y modificador `office-signature--display`; los campos marcan “(opcional)” en vez de “(obligatorio)”; se eliminan los alias heredados; `vercel.json` redirige `/condiciones/`. Plan y diseño revisados con Astra (adjudicación en `validation/astra-26sep2026.md`). Misma fecha, tercera ronda: se retira el archivo de cuentos (la web no muestra productos), la serif deja de aparecer en la página pública, se agrega el bloque Cartas con `address.postal` sobre rojo y `VITE_POSTAL_ADDRESS`, y el contacto por formulario pasa a ser el bloque Mensajes. Tercera ronda de Astra sobre ese estado: tres ajustes menores aplicados (`text-wrap: balance` en la línea de portada, copy del estado sin dirección, confirmación sin mención a cobros).

**v1.0, 13-sep-2026:** identidad derivada de las nueve referencias; papel y noche; color de colección; fuentes locales libres; componentes React; muestrario interno; control de contraste y guía de futuros desarrollos. La firma exacta y los grabados finales siguen requiriendo archivos de origen aptos para web.
