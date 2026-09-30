# Revisión editorial y SEO — Kite Cartagena

## Estado

Publicado el 15/09/2026 en https://kite-agency.vercel.app. Despliegue Vercel: `dpl_3KsxHKBQvHbSzna5FMvjwxda5zQB`. Fuentes en `C:/Users/Dell/PROYECTOS WEB/kite-agency`.

## Problema y solución

El generador publicaba 61 artículos por idioma con introducciones basadas en el título, cuerpo repetido por categoría, preguntas frecuentes genéricas y una lista de reserva añadida a cada artículo. Cambiar el título no cambiaba sustancialmente la respuesta.

Se sustituyó ese sistema por **80 artículos en español y 15 guías en cada uno de los otros nueve idiomas: 215 versiones editoriales**. Las 15 guías principales enlazan a 65 respuestas específicas en español: 15 sobre decisiones de compra, 15 sobre aprendizaje, 15 sobre equipo, 10 sobre logística y 10 sobre disciplinas y experiencias. Cada guía tiene descripción, secciones y objetivos propios. Las guías principales en español desarrollan seis secciones y los artículos especializados cuatro; las adaptaciones internacionales condensan cada tema en cuatro secciones específicas. No hay una plantilla de párrafos genéricos de respaldo: la construcción falla si falta el contenido de una guía.

### Distribución de intenciones

| URL del blog | Intención principal | Temas integrados |
|---|---|---|
| `complete-guide` | Organizar un viaje | 3/5/7 días, alojamiento, aeropuerto, parejas, origen internacional y seguro |
| `best-time` | Elegir fechas | Meses y transición entre temporadas |
| `first-lesson` | Preparar la primera clase | Natación, miedo, edad, preparación y ropa |
| `how-long` | Entender el progreso | Control, body drag, water start, ceñida e independencia |
| `safety-checklist` | Revisar una sesión | Entorno, comunicación, convivencia, retorno y autocuidado |
| `la-boquilla-guide` | Elegir un lugar de práctica | La Boquilla, Manzanillo, Las Velas y salida a Salinas |
| `packing-list` | Preparar el equipaje | Vuelo, embalaje, documentación y repuestos |
| `kite-size` | Preparar la selección de equipo | Peso, tabla, modelo, viento y compatibilidad |
| `book-whatsapp` | Entender una reserva | Datos, confirmación, pago, cancelación y cambios |
| `choose-course` | Comparar formatos de enseñanza | Introducción, progresión, refuerzo y clases compartidas |
| `rental-requirements` | Evaluar un alquiler | Autonomía, soporte, entrega y equipo propio |
| `wind-sources` | Interpretar el pronóstico de una sesión | Hora, unidades, rachas, dirección y alternativas |
| `kite-vs-wing` | Comparar disciplinas | Tracción, tabla, espacio y aprendizaje |
| `kite-repair` | Entender un diagnóstico | Pérdidas de aire, tejido, líneas y sustitución |
| `saltwater-gear-care` | Mantener el material | Arena, secado, almacenamiento e inspección |

El mapa completo de procedencia está en `scripts/editorial/index.mjs`, en `clusters`. Los artículos enlazan al catálogo o servicio para la intención comercial y a tres guías complementarias.

## URLs y SEO técnico

- 46 artículos retirados por idioma se redirigen a su guía temática: **460 redirecciones nuevas de artículos**.
- Las páginas informativas de viento por meses, primera clase y equipaje también se consolidan en los artículos correspondientes: **30 redirecciones**.
- Se conservan 11 redirecciones existentes y se añaden dos variantes limpias de `about` y `experiences`: **503 reglas en total**, sin cadenas.
- Las páginas retiradas reciben una respuesta permanente en la configuración de Vercel y un HTML de respaldo sin contenido antiguo, con `noindex`, canonical de destino y navegación inmediata para alojamiento estático.
- **445 URLs vigentes en el sitemap**. Ninguna redirección está en el sitemap ni recibe enlaces internos desde las páginas vigentes.
- Canonical propio y alternates únicamente a versiones existentes: diez idiomas y `x-default` para las guías principales; español y `x-default` para los 65 artículos nuevos. Los títulos compartidos por nombres de productos entre idiomas son versiones equivalentes, no páginas duplicadas dentro de un idioma.
- `BlogPosting` coincide con el contenido visible; añadido `BreadcrumbList`. Eliminado `FAQPage` genérico de los artículos.
- El mapa de spots mantiene una función distinta: mapa satelital y acceso. Ya no usa el mismo título comparativo que el artículo.
- Eliminada la escala mensual numérica de viento sin una metodología verificable.

Referencia técnica: [canonical y consolidación de Google](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [versiones por idioma](https://developers.google.com/search/docs/specialty/international/localized-versions).

## Logo y presentación

- Favicon PNG de 48 px, ICO con varios tamaños, Apple Touch Icon y versiones de instalación de 192/512 px derivados del mismo `images/kite-cartagena-profile.png`.
- Sustituido también el SVG anterior para evitar que una referencia antigua muestre otra marca.
- Referencias de iconos unificadas en todos los HTML, incluidos aliases.
- Índice con enlaces de sección, ancho de lectura contenido y enlaces relacionados.
- Cabecera opaca; sin botones flotantes sobre el texto de los artículos en móvil.
- Paginación respeta movimiento reducido y mantiene los resultados por debajo de la cabecera.
- Las páginas se pueden leer y los artículos descubrir sin JavaScript.

## Verificación realizada

| Verificación | Resultado |
|---|---|
| Generación de páginas y compilación CSS | Correctas |
| Auditoría estática, 950 HTML | 0 errores, 0 advertencias |
| 215 artículos, cobertura diferenciada en diez idiomas | Correcta |
| Párrafos idénticos entre guías del mismo idioma | 0 |
| Comparaciones léxicas entre guías | 4.105; máxima similitud Jaccard 0,192 |
| Reglas de redirección y sitemap | 503 destinos vigentes; 501 directos y 2 con normalización de extensión en Vercel |
| Navegador, escenarios generales | 13, sin fallos |
| Artículos en móvil 390×844 | 215, sin fallos |
| Artículos en escritorio 1366×768 | 80, sin fallos |
| Artículos en pantalla ancha 1920×900 | 3, sin fallos |
| Redirecciones HTTP del blog español | 46 respuestas 308 correctas |
| Búsqueda, resultado vacío, filtro, paginación, idioma y anclas | Sin fallos |
| Lectura móvil y paginación tras último ajuste visual | Sin fallos |

Evidencia local: `.qa/editorial-audit.json`, `.qa/browser-editorial.json`, `.qa/final-view.json` y capturas `editorial-final-*.png`.

La similitud léxica es una comprobación de repetición de texto, no una medición de canibalización en Google. La arquitectura e intenciones se han corregido; su efecto sobre consultas, impresiones y posiciones debe medirse tras publicar e indexar con datos de Search Console. La verificación pública se registra en `.qa/production-release.json`. Publicar no demuestra indexación: falta revisar consultas y cobertura en Search Console.

La compilación CSS solo mostró el aviso de que la base local de Browserslist está antigua; no impidió compilar. No se cambiaron dependencias para esta revisión editorial.

### Comprobación en producción

Las 445 páginas indexables coinciden con los HTML locales, incluidos los 215 artículos. Siete recursos (favicon, icono Apple, calculadora, CSS editorial, sitemap y robots) se compararon con sus archivos locales. La calculadora y los 13 escenarios generales de navegador pasaron también sobre el dominio público.

Vercel normaliza `/about.html` a `/about/` y `/experiences.html` a `/experiences/` antes del destino final. Son dos saltos permanentes para esas dos variantes heredadas; las páginas vigentes no enlazan a ellas. Las otras 501 reglas llegan directamente a su destino. La afirmación de ausencia de cadenas en la configuración no debe interpretarse como ausencia de esta normalización de plataforma.

## Mantener la corrección

1. Editar textos en `scripts/editorial/{idioma}.mjs` y la agrupación en `scripts/editorial/index.mjs`.
2. Ejecutar `pnpm run build` y `pnpm run audit:site`.
3. Ejecutar `pnpm run audit:editorial` y, con el servidor local activo, `pnpm run audit:browser:editorial`.
4. Si cambia el logo, ejecutar `scripts/generate-icons.py` con Python y Pillow.

Los archivos de investigación existentes no se han modificado. `.vercelignore` excluye investigación, capturas de QA y documentos Markdown de una subida con la CLI.

## Ampliación y recomendaciones

- Calculadora de presupuesto en `/blog/lesson-budget/`, con tarifas tomadas del catálogo y gastos editables del grupo. Prueba: dos personas en iniciación más 100.000 COP de gastos = 1.400.000 COP.
- Se retiró la afirmación universal de acreditación IKO y el marcado de credencial sin ficha verificable; se invita a consultar la formación del instructor asignado. Las referencias IKO se mantienen como fuentes educativas.
- Los 65 artículos nuevos utilizan imágenes temáticas existentes, no 65 fotografías propias nuevas.
- Competidor revisado: https://cartagenasurf420.com/blog/. El índice tiene más contenido que las diez tarjetas destacadas; no se usa ese número como inventario total ni se afirma superarlo en tráfico.
- Prioridad 1: dominio propio y Search Console; sitemap enviado y cobertura revisada una vez exista acceso. No se ha comprado dominio ni configurado una propiedad nueva.
- Prioridad 2: completar perfiles y credenciales verificables de instructores, fotografías locales originales, instalaciones, inclusiones y políticas concretas. Los artículos no inventan esos datos.
- Prioridad 3: medir clics a WhatsApp y consultas cualificadas; revisar Core Web Vitals con datos reales y rendimiento móvil.
- Prioridad 4: ampliar primero las traducciones al inglés de los artículos con mayor interés comercial. Los nuevos artículos no simulan versiones traducidas.
- Prioridad 5: actualizar contenido con preguntas reales y resultados de Search Console; consolidar si dos URLs compiten por la misma intención. La ausencia de párrafos repetidos no prueba ausencia absoluta de canibalización.

## Inventario de los 80 artículos en español

| Artículo | Guía principal | URL |
|---|---|---|
| Viaje de kitesurf a Cartagena: itinerario y alojamiento | Guía principal | [Leer](https://kite-agency.vercel.app/blog/complete-guide/) |
| Mejor época para kitesurf en Cartagena: guía por meses | Guía principal | [Leer](https://kite-agency.vercel.app/blog/best-time/) |
| Primera clase de kitesurf: preparación y qué esperar | Guía principal | [Leer](https://kite-agency.vercel.app/blog/first-lesson/) |
| Cuánto se tarda en aprender kitesurf: etapas reales | Guía principal | [Leer](https://kite-agency.vercel.app/blog/how-long/) |
| Seguridad en kitesurf: revisión antes de entrar al agua | Guía principal | [Leer](https://kite-agency.vercel.app/blog/safety-checklist/) |
| La Boquilla y otros spots de Cartagena: cómo elegir | Guía principal | [Leer](https://kite-agency.vercel.app/blog/la-boquilla-guide/) |
| Equipaje de kitesurf: qué llevar y cómo preparar el vuelo | Guía principal | [Leer](https://kite-agency.vercel.app/blog/packing-list/) |
| Tamaño de kite: qué revisar antes de elegir una cometa | Guía principal | [Leer](https://kite-agency.vercel.app/blog/kite-size/) |
| Reservar kitesurf: datos, pago y cambios por clima | Guía principal | [Leer](https://kite-agency.vercel.app/blog/book-whatsapp/) |
| Qué curso de kitesurf elegir según tus habilidades | Guía principal | [Leer](https://kite-agency.vercel.app/blog/choose-course/) |
| Alquilar equipo de kitesurf: autonomía y condiciones | Guía principal | [Leer](https://kite-agency.vercel.app/blog/rental-requirements/) |
| Cómo leer el pronóstico de viento para una sesión de kite | Guía principal | [Leer](https://kite-agency.vercel.app/blog/wind-sources/) |
| Kitesurf o wing foil: equipo, aprendizaje y diferencias | Guía principal | [Leer](https://kite-agency.vercel.app/blog/kite-vs-wing/) |
| Cometa dañada: diagnóstico, reparación o sustitución | Guía principal | [Leer](https://kite-agency.vercel.app/blog/kite-repair/) |
| Cuidado del equipo de kite: secado, almacenaje y desgaste | Guía principal | [Leer](https://kite-agency.vercel.app/blog/saltwater-gear-care/) |
| Cuánto presupuestar para aprender kitesurf en Cartagena | choose-course | [Leer](https://kite-agency.vercel.app/blog/lesson-budget/) |
| Qué equipo incluye una clase y qué debes llevar tú | choose-course | [Leer](https://kite-agency.vercel.app/blog/included-equipment/) |
| Cómo comparar escuelas de kitesurf antes de reservar | choose-course | [Leer](https://kite-agency.vercel.app/blog/school-evaluation/) |
| Certificación de instructor: qué comprobar y qué significa | choose-course | [Leer](https://kite-agency.vercel.app/blog/instructor-credentials/) |
| Hora reservada y tiempo de práctica: cómo compararlos | choose-course | [Leer](https://kite-agency.vercel.app/blog/private-practice-time/) |
| Aprender kite en pareja cuando tienen niveles distintos | choose-course | [Leer](https://kite-agency.vercel.app/blog/couples-different-levels/) |
| Viajar solo para hacer kitesurf: organización y apoyo | complete-guide | [Leer](https://kite-agency.vercel.app/blog/solo-kite-travel/) |
| Kitesurf con hijos: preguntas para organizar la participación | first-lesson | [Leer](https://kite-agency.vercel.app/blog/children-family-planning/) |
| Empezar kitesurf de adulto sin experiencia en deportes de tabla | first-lesson | [Leer](https://kite-agency.vercel.app/blog/adults-first-sport/) |
| Volver al kitesurf después de meses o años sin practicar | how-long | [Leer](https://kite-agency.vercel.app/blog/returning-after-break/) |
| Cómo continuar un curso en otra escuela de kitesurf | how-long | [Leer](https://kite-agency.vercel.app/blog/switching-kite-schools/) |
| Idioma de la clase y señales: qué acordar antes de empezar | first-lesson | [Leer](https://kite-agency.vercel.app/blog/lesson-language-signals/) |
| Regalar una clase de kitesurf: cómo elegir sin equivocarte | book-whatsapp | [Leer](https://kite-agency.vercel.app/blog/gift-kitesurf-lesson/) |
| Organizar kitesurf para un grupo: cupos, turnos y objetivos | choose-course | [Leer](https://kite-agency.vercel.app/blog/group-kite-session/) |
| Kitesurf en una visita corta o escala de crucero | complete-guide | [Leer](https://kite-agency.vercel.app/blog/short-stay-cruise/) |
| Vocabulario de kitesurf para entender tu primera clase | first-lesson | [Leer](https://kite-agency.vercel.app/blog/kite-glossary/) |
| Qué es la ventana de viento en kitesurf | first-lesson | [Leer](https://kite-agency.vercel.app/blog/wind-window-explained/) |
| Para qué sirve el body drag antes de subir a la tabla | how-long | [Leer](https://kite-agency.vercel.app/blog/body-drag-purpose/) |
| Relanzamiento de la cometa: qué debes aprender en clase | how-long | [Leer](https://kite-agency.vercel.app/blog/water-relaunch-learning/) |
| Por qué aprender a detenerte importa tanto como navegar | how-long | [Leer](https://kite-agency.vercel.app/blog/controlled-stop/) |
| Cuándo empezar a trabajar transiciones en kitesurf | how-long | [Leer](https://kite-agency.vercel.app/blog/transitions-learning/) |
| Antes del primer salto: cómo plantear una clase de progresión | safety-checklist | [Leer](https://kite-agency.vercel.app/blog/first-jump-readiness/) |
| Cómo aprovechar el análisis de vídeo en una clase de kitesurf | how-long | [Leer](https://kite-agency.vercel.app/blog/video-coaching/) |
| Qué anotar después de cada clase de kitesurf | how-long | [Leer](https://kite-agency.vercel.app/blog/progress-log/) |
| Regular o goofy: qué cambia al aprender kitesurf | first-lesson | [Leer](https://kite-agency.vercel.app/blog/regular-goofy/) |
| Si ya haces surf o skate, qué cambia al aprender kitesurf | first-lesson | [Leer](https://kite-agency.vercel.app/blog/surfing-skating-transfer/) |
| Qué hacer si sientes que no avanzas en kitesurf | how-long | [Leer](https://kite-agency.vercel.app/blog/lesson-plateau/) |
| Cómo repartir clases y descansos durante tu viaje de kite | complete-guide | [Leer](https://kite-agency.vercel.app/blog/fatigue-session-duration/) |
| Asistencia en playa: qué servicio estás contratando | rental-requirements | [Leer](https://kite-agency.vercel.app/blog/beach-assistance-scope/) |
| Supervisión o clase de refuerzo: cómo elegir | rental-requirements | [Leer](https://kite-agency.vercel.app/blog/supervision-vs-instruction/) |
| Primer equipo de kitesurf: qué decidir antes de comprar | kite-size | [Leer](https://kite-agency.vercel.app/blog/first-kite-purchase/) |
| Comprar un kite usado: documentación e inspección previa | kite-repair | [Leer](https://kite-agency.vercel.app/blog/used-kite-inspection/) |
| Twin-tip, tabla direccional y foil: diferencias para elegir clase | kite-vs-wing | [Leer](https://kite-agency.vercel.app/blog/twin-tip-directional-foil/) |
| Cometa inflable y cometa foil: qué diferencia sus estructuras | kite-size | [Leer](https://kite-agency.vercel.app/blog/inflatable-vs-foil-kite/) |
| Cómo comunicar si un arnés de kitesurf no te ajusta bien | first-lesson | [Leer](https://kite-agency.vercel.app/blog/harness-fit/) |
| ¿Sirve cualquier barra para cualquier cometa? | kite-repair | [Leer](https://kite-agency.vercel.app/blog/bar-compatibility/) |
| Casco y chaleco en kitesurf: qué preguntar sobre protección | safety-checklist | [Leer](https://kite-agency.vercel.app/blog/helmet-vest-choice/) |
| Clases de kitesurf con radio: utilidad y límites | first-lesson | [Leer](https://kite-agency.vercel.app/blog/radio-lesson/) |
| Presión de inflado del kite: dónde encontrar el dato correcto | saltwater-gear-care | [Leer](https://kite-agency.vercel.app/blog/pump-pressure/) |
| Quillas y footstraps: qué revisar antes de usar una tabla | rental-requirements | [Leer](https://kite-agency.vercel.app/blog/fins-footstraps/) |
| Ficha de tu equipo: modelos, números de serie y reparaciones | saltwater-gear-care | [Leer](https://kite-agency.vercel.app/blog/equipment-record/) |
| Cómo pedir el repuesto correcto para una cometa | kite-repair | [Leer](https://kite-agency.vercel.app/blog/spare-parts-identification/) |
| Equipo mojado antes del vuelo: cómo organizar el último día | packing-list | [Leer](https://kite-agency.vercel.app/blog/wet-gear-flight/) |
| Dónde dejar el equipo entre sesiones en la playa | saltwater-gear-care | [Leer](https://kite-agency.vercel.app/blog/sand-beach-storage/) |
| Si pierdes de vista la tabla: qué acordar antes de navegar | safety-checklist | [Leer](https://kite-agency.vercel.app/blog/lost-board-plan/) |
| Traslado desde el aeropuerto con bolsa de kitesurf | complete-guide | [Leer](https://kite-agency.vercel.app/blog/airport-transfer-kitebag/) |
| Viaje de kitesurf a Cartagena sin alquilar carro | complete-guide | [Leer](https://kite-agency.vercel.app/blog/no-car-kite-trip/) |
| Teletrabajo y kitesurf: cómo organizar una semana en Cartagena | complete-guide | [Leer](https://kite-agency.vercel.app/blog/remote-work-sessions/) |
| Qué hacer si acompañas a alguien a su clase de kitesurf | complete-guide | [Leer](https://kite-agency.vercel.app/blog/companion-beach-day/) |
| Baños, duchas y guardarropa: qué confirmar antes de ir a clase | packing-list | [Leer](https://kite-agency.vercel.app/blog/shower-changing-storage/) |
| Necesidades de accesibilidad: cómo consultar una actividad de playa | first-lesson | [Leer](https://kite-agency.vercel.app/blog/accessible-lesson-planning/) |
| Cómo confirmar el punto de encuentro de tu clase | book-whatsapp | [Leer](https://kite-agency.vercel.app/blog/meeting-point-confirmation/) |
| Si se aplaza tu sesión: cómo reorganizar el día de viaje | wind-sources | [Leer](https://kite-agency.vercel.app/blog/weather-change-trip-plan/) |
| Qué debe quedar en la confirmación de tu reserva | book-whatsapp | [Leer](https://kite-agency.vercel.app/blog/booking-receipt/) |
| Viaje de kite entre amigos: cómo repartir los gastos | choose-course | [Leer](https://kite-agency.vercel.app/blog/share-trip-costs/) |
| Primer downwind: qué experiencia debes comunicar | rental-requirements | [Leer](https://kite-agency.vercel.app/blog/downwind-first-trip/) |
| Logística de downwind: salida, llegada y transporte del equipo | complete-guide | [Leer](https://kite-agency.vercel.app/blog/downwind-return-logistics/) |
| Kitefoil: qué contar antes de reservar tu primera clase | kite-vs-wing | [Leer](https://kite-agency.vercel.app/blog/kitefoil-prerequisites/) |
| Profundidad y espacio en foil: qué debe evaluar la sesión | kite-vs-wing | [Leer](https://kite-agency.vercel.app/blog/foil-depth-planning/) |
| Tu primera sesión de wing: qué la diferencia de una clase de kite | kite-vs-wing | [Leer](https://kite-agency.vercel.app/blog/wing-first-session/) |
| Primera salida de SUP: qué preguntar y cómo prepararte | kite-vs-wing | [Leer](https://kite-agency.vercel.app/blog/sup-first-outing/) |
| Viento y recorrido en SUP: preguntas antes de salir | wind-sources | [Leer](https://kite-agency.vercel.app/blog/sup-route-wind/) |
| SUP al atardecer: horario, luz y regreso | complete-guide | [Leer](https://kite-agency.vercel.app/blog/sunset-sup-planning/) |
| SUP o kitesurf para una primera experiencia en Cartagena | kite-vs-wing | [Leer](https://kite-agency.vercel.app/blog/sup-vs-kite/) |
| Fotografía de kitesurf: qué acordar antes de contratar una sesión | book-whatsapp | [Leer](https://kite-agency.vercel.app/blog/sports-photography-session/) |
