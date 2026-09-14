# La Oficina de los Últimos Cuentos

## Sistema de diseño digital · versión 1.0

13 de septiembre de 2026. Base para desarrollar la web a partir de la identidad física que compartió Joaquín: tres sobres, tres moodboards, firma, grabados y maqueta del objeto. La definición operativa más reciente fue confirmada en esta conversación y se registra en [decisiones](../negocio/decisiones.md).

**La pantalla abre la puerta. La experiencia sucede afuera.**

El sistema tiene cuatro partes: este manual, los [tokens](src/design-system/tokens.css), los [componentes React](src/design-system/index.tsx) y el [muestrario](design-system/main.tsx). Los tokens y componentes son la fuente ejecutable; el manual explica cómo elegirlos. Cambiar uno exige actualizar los ejemplos afectados, no crear una segunda versión.

Para ver el muestrario: ejecutar `pnpm dev` en `web/` y abrir `/design-system/` en la URL que indique Vite. Es una entrada de desarrollo, excluida del build público. Sus formularios no envían ni persisten información. Incluye vista de papel, noche, validación y diálogo operable por teclado.

La revisión y las vistas guardadas están en [VALIDATION.md](design-system/VALIDATION.md).

## 1. Identidad y función de la web

La Oficina es una red de resistencia al ruido digital. Escribe cuentos, los hace circular físicamente y protege la identidad de sus integrantes. Se manifiesta mediante cartas, mensajeros y focos en la ciudad. Su misterio nace de encontrar algo que alguien preparó con cuidado.

La web debe permitir encontrar un cuento, conocer una forma de participar y entender el siguiente paso. El visitante no tiene que descifrar cómo pedir, cuánto paga ni qué sucede con su dirección. La identidad puede ser reservada; las condiciones de la relación deben estar a la vista.

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
| Lacre | `#71312F` | Acción principal sobre papel |
| Rojo | `#D2645B` | Pieza de identidad, fondo puntual |
| Oliva | `#818B59` | Fondo de expediente |
| Celeste | `#B0C8CC` | Fondo de expediente |
| Arcilla | `#B57B64` | Acento secundario de objeto, no nuevo ambiente |

**Papel** es el ambiente predeterminado de los próximos formularios y páginas de información. **Noche** es una alternativa intencional para la portada, una invitación o una pausa. No hace falta ofrecer un selector de tema al público; el selector del muestrario sirve para evaluar componentes.

Los tonos rojo, oliva y celeste se usan como soportes editoriales con texto tinta. No usar texto blanco pequeño sobre rojo u oliva: esa combinación de las piezas impresas no se traslada a controles web. Las tarjetas de colección muestran contenido; ubicar formularios y acciones en una superficie papel/noche adyacente.

| Rol | Papel | Noche |
|---|---|---|
| `--office-surface` | Papel | Noche |
| `--office-text` | Tinta | Papel |
| `--office-text-muted` | Gris cálido oscuro | Gris cálido claro |
| `--office-action` | Lacre | Arcilla clara `#EDB4A2` |
| `--office-on-action` | Papel elevado | Tinta |
| `--office-focus` | Lacre | Celeste |
| `--office-success` | Oliva oscuro | Oliva claro |
| `--office-error` | Rojo oscuro | Rojo claro |

La diferencia entre `--office-rule` y `--office-control-border` es funcional: la primera separa contenido y puede ser tenue; la segunda identifica un control y debe conservar contraste. No usar opacidad para inventar un nuevo color de ayuda o error.

`pnpm check:design` verifica los pares de texto (al menos 4,5:1), bordes de control y foco (al menos 3:1). El resultado no certifica accesibilidad de una página completa. Referencias: [contraste de texto W3C](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) y [contraste no textual W3C](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html).

## 5. Tipografía

| Rol | Familia | Aplicación |
|---|---|---|
| Editorial | Cormorant Garamond | Títulos, citas, portadas; peso 400, 500 o 600, cursiva puntual |
| Lectura | EB Garamond | Párrafos, ayudas, campos; 400 normal y cursiva, 500 para énfasis |
| Archivo | Inconsolata | Firma web, botones, etiquetas, fechas y números; 400 y 500 |

Las dos Garamond están presentes en los moodboards y en la base anterior. Inconsolata es la sustitución web libre propuesta para la función de archivo. No afirmamos que sea la fuente exacta de la firma. Jimmy Pro Serif, Maui, Secret Relic y Paloma se conservan como referencias, no se incorporan sin sus archivos y licencia correspondiente.

Fuentes locales WOFF2, subconjunto latino con ñ y acentos españoles, `font-display: swap`, licencias OFL archivadas. No se hacen peticiones a Google Fonts en tiempo de visita. Se declaran Georgia y Courier New como respaldo. Añadir otros alfabetos requiere incorporar sus subconjuntos.

| Token de tamaño | Escala | Interlineado |
|---|---|---|
| `caption` | 13 px | 1,5 |
| `label` | 14 px | 1,4 |
| `small` | 17 px | 1,4 |
| `body` | 20 px | 1,5 |
| `lead` | 22–28 px | 1,4 |
| `heading` | 36–64 px | 1,1 |
| `display` | 48–108 px | 1,04 |

Los valores se expresan en rem y clamp, relativos a una base de navegador de 16 px. No bloquear el zoom. Mayúsculas solo en rótulos y firma; conservar mayúsculas normales en frases y explicaciones. Cursiva para un fragmento significativo, no para instrucciones completas. Evitar pesos de fantasía y tipografías manuscritas pequeñas en botones.

## 6. Composición, espacio y movimiento

- Contenedor general máximo 76 rem (1.216 px), incluida su separación lateral.
- Ancho de lectura hasta 38 rem (608 px), aproximadamente 45–65 caracteres según la tipografía. Formulario hasta 32 rem (512 px).
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
| `TextField` | `label`, `hint`, `error`, atributos de input | Etiqueta visible, ayuda y error asociados por ID |
| `TextAreaField` | Igual, atributos de textarea | Nota libre opcional, redimensionable |
| `SelectField` | Igual, `option` como hijos | Selector nativo y accesible |
| `CheckboxField` | `label`, `hint`, `error`, atributos nativos | La casilla de novedades empieza desmarcada |
| `Notice` | `tone`: info/success/error, `title` | Mensaje persistente, con texto y región viva |
| `Dialog` | `open`, `onClose`, `title`, `description`, `theme` | Diálogo nativo; fondo inerte, Escape y retorno de foco |
| `EditorialQuote` | Hijos, `source` opcional | Cita serif, cursiva mediante `em` |
| `PaperCard` | `tone`: paper/red/olive/blue/night | Ficha editorial, no toda la tarjeta como botón |

Los componentes aceptan atributos nativos y no incluyen lógica de precios, pagos, coberturas ni servicios de correo. El contenedor propietario maneja datos y peticiones.

### Acciones y estados

Principal: un botón lacre en papel o claro en noche. Secundario: contorno. Discreto: texto subrayado. Mantener como mínimo 48 px de alto; no reducir el área táctil al texto.

Estados: reposo, hover, foco de teclado, presionado nativo, deshabilitado y envío. `pending` deshabilita el doble envío, cambia el texto y aplica `aria-busy`. No deshabilitar preventivamente un formulario vacío sin explicar qué falta.

Un enlace de navegación puede usar `className="office-button office-button--secondary"`, conservando `href`. No usar botones con `window.location` para navegación habitual.

### Formularios

1. Explicar qué se solicita y qué ocurre después.
2. Pedir únicamente los campos necesarios. Distinguir contacto del solicitante y destinatario de un regalo.
3. Usar `required` para campos obligatorios y ayudas visibles. No depender de placeholders.
4. Después de un intento inválido, asociar el error al campo, enfocar el primero y conservar los valores.
5. Durante envío, mostrar “Enviando solicitud…”. Nunca simular éxito si el servicio devuelve error.
6. Ante error de red, conservar datos y permitir reintentar. Mantener un contacto alternativo real cuando exista.
7. Confirmar con texto persistente o dejar la confirmación en una vista alcanzable. No depender exclusivamente de un toast que desaparece.
8. Las novedades requieren una opción separada y voluntaria; la dirección necesaria para entrega no suscribe a otra persona.

### Diálogos

Un diálogo por vez. `Dialog` enfoca su título al abrir, contiene la navegación por teclado y devuelve el foco al disparador al cerrar. Escape y el botón de cerrar deben funcionar. El formulario cabe en la pantalla con scroll propio. Clic fuera no descarta una solicitud escrita. No usar el diálogo para mostrar condiciones largas: esas deben tener una página o sección legible.

## 8. Voz y contenido

Primera persona plural, español rioplatense, voseo. Frases breves y precisas. Firma colectiva. Sin nombres de integrantes, emojis decorativos ni urgencia comercial.

| Momento | Texto de referencia |
|---|---|
| Invitación | “Hay un cuento esperando del otro lado de tu puerta.” |
| Producto | “Con la suscripción recibís una carta con un cuento cada mes.” |
| Acción | “Recibir un cuento”, “Regalar un cuento”, “Sumar un espacio” |
| Contacto | “Dejanos tu mail para responder tu consulta.” |
| Novedades | “Quiero recibir avisos de encuentros y novedades de La Oficina.” |
| Éxito | “Recibimos tu solicitud. Te responderemos al mail que nos dejaste.” |
| Error | “No pudimos enviar tu solicitud. Tus datos siguen en el formulario.” |
| Mensajeros | “Para postularte como mensajero, enviá a la Oficina una carta con un cuento propio.” |

Evitar confirmaciones como “responderemos cuando lo consideremos oportuno”: no orientan a quien acaba de confiar sus datos. Se puede conservar misterio sin insinuar arbitrariedad. No prometer un plazo de respuesta hasta acordarlo.

### Modelo confirmado y contenidos por completar

La actualización del 13-sep establece suscripción mensual, una carta con un cuento por mes, avisos de los encuentros mensuales y focos físicos de compra. Empieza en CABA, con alcance de envíos a Argentina y expansión mediante mensajeros en otras ciudades. Los mensajeros se postulan con un cuento propio enviado por carta; la Oficina selecciona para publicación y coordina su participación.

Antes de publicar los flujos comerciales faltan precio mensual, forma de cobro/renovación/cancelación, condiciones y cobertura efectiva de envío. Para la convocatoria faltan dirección del buzón, condiciones de selección/publicación y acuerdo del rol de distribución. No inventar esos valores en componentes. La suscripción da acceso a enterarse de eventos; no equivale a entrada gratuita o cupo garantizado.

Los precios, proyecciones y cronogramas anteriores del plan son antecedentes fechados. La fuente de decisiones es `../negocio/decisiones.md`, no este manual. Las pantallas de ejemplo usan datos ficticios identificados como tales.

## 9. Patrones para próximos desarrollos

**Portada:** firma, una frase de identidad, una explicación concreta y la acción “Recibir o regalar un cuento”. Se puede usar noche. No esconder la explicación en un hover ni exigir animaciones de entrada.

**Recibir/regalar:** superficie papel. Diferenciar compra puntual y suscripción cuando estén definidas ambas ofertas. Mostrar precio, frecuencia, alcance y qué sigue antes de pedir dirección o cobrar.

**Focos:** lista editorial por barrio/ciudad, tipo de espacio, dirección pública, horarios y acción para llegar. Solo locales confirmados. Para sumar un espacio, nombre del local, ubicación y contacto.

**Mensajeros:** explicar la postulación por carta y cuento propio, qué se selecciona y cómo se coordina la distribución. Ningún formulario promete selección automática. No publicar direcciones de integrantes.

**Encuentros:** título, fecha, lugar, modalidad de acceso y estado. Las fechas solo se muestran confirmadas. El diseño debe admitir “Todavía no anunciamos el próximo encuentro”.

**Contacto:** mail público del proyecto, breve explicación y confirmación clara. No usar una cuenta o un dominio de ejemplo como si ya existieran.

## 10. Implementación y mantenimiento

```tsx
import { Button, TextField } from "./design-system";
import "./design-system/styles.css";

export function Consulta() {
  return (
    <section className="office-surface office-stack" data-office-theme="paper">
      <h2 className="office-heading">Escribir a la Oficina</h2>
      <TextField label="Mail" type="email" name="email" autoComplete="email" />
      <Button onClick={() => { /* abrir el flujo de consulta */ }}>
        Continuar
      </Button>
    </section>
  );
}
```

Los colores `office-*` están disponibles en Tailwind. Para estilos nuevos preferir tokens semánticos y componentes. No combinar modificadores de opacidad Tailwind con colores semánticos hexadecimales: definir un rol contrastado en tokens. Los colores heredados sí conservan canales RGB y sus modificadores de opacidad.

La landing ya aplica los componentes, tokens y fuentes locales a portada, consultas, red física y encuentros. Permite scroll, usa `Dialog` para los recorridos y mantiene la recepción existente de Formspree mientras se prepara el Google Form. Sus datos públicos se mantienen en `src/content/site.ts`; no confundir las secciones preparadas con acuerdos, cobros o conexiones ya habilitados. Los alias `--office-legacy-*` y `font-fell` quedan por compatibilidad, sin ser la base de nuevos estilos. La firma sigue siendo una aproximación tipográfica. Estado y límites de la implementación en [README](README.md).

Para cambiar el sistema:

1. Consultar este manual y la decisión operativa relevante.
2. Reutilizar antes de extender; si falta una variante, agregarla al componente compartido.
3. Mostrar el caso en el muestrario, incluidos error y estados de interacción.
4. Ejecutar `pnpm check:design` y `pnpm build`.
5. Revisar móvil, teclado, foco y zoom cuando corresponda. Los ejemplos internos y las referencias nunca se añaden a `public/`.
6. Actualizar esta versión y su motivo cuando cambie una regla, no por cada ajuste de texto.

### Registro

**v1.0, 13-sep-2026:** identidad derivada de las nueve referencias; papel y noche; color de colección; fuentes locales libres; componentes React; muestrario interno; control de contraste y guía de futuros desarrollos. La firma exacta y los grabados finales siguen requiriendo archivos de origen aptos para web.
