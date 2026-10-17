# Cómo publicar un artículo nuevo

No hay panel de administración: publicar un artículo significa agregar 3 cosas al
código y subirlas (git push). Estos son los pasos, en orden.

## 1. Escribir el contenido

Crear un archivo nuevo en `articulos/content/`, con un nombre corto en minúsculas y
guiones (el "slug"), por ejemplo:

```
articulos/content/como-hablar-de-altas-capacidades-con-la-escuela.html
```

Adentro va solo el cuerpo del artículo, con tags simples: `<p>`, `<h2>`, `<strong>`,
`<a href="...">`. Mirá `articulos/content/que-son-las-altas-capacidades.html` como
ejemplo. No hace falta `<html>`, `<head>` ni `<body>` — eso ya lo pone la plantilla.

### Recuadros y componentes visuales disponibles

Además de los tags simples, hay clases CSS ya armadas (con los colores de la marca)
para darle más variedad visual a un artículo. Mirá
`articulos/content/que-es-la-dislexia.html` como ejemplo real de uso. Las principales:

- `<p class="lead">...</p>` — párrafo de entrada, más grande, con borde amarillo.
- `<div class="statement"><p>...</p></div>` — frase destacada en recuadro oscuro
  (usar `<em>` adentro para resaltar una palabra en amarillo).
- `<ul class="pill-list"><li>...</li></ul>` — lista de "píldoras" rosa con ✕, para
  listar cosas que algo NO es.
- `<div class="card-grid"><div class="card">...</div><div class="card alt">...</div></div>`
  — dos tarjetas lado a lado (la segunda con `alt` queda en amarillo en vez de
  celeste), cada una con un `<h3>` y una `<ul>` con viñetas redondas.
- `<div class="box"><h3>...</h3><p>...</p></div>` — recuadro lavanda suave, para
  una aclaración o nota aparte.
- `<div class="callout-question"><strong>...</strong></div>` — recuadro con borde,
  para una respuesta corta y directa ("No.", "Sí.", etc.). Agregar la clase
  `negative` para la variante en rosa/rojo (ej. para marcar una frase incorrecta).
- `<div class="warning"><strong>Importante:</strong> ...</div>` — aviso en rosa con
  borde rojo, para aclaraciones importantes.
- `<div class="pull-quote">...<span>no</span>...</div>` — cita grande centrada con
  líneas arriba y abajo (usar `<span>` para resaltar una palabra en rojo).

### Documentos descargables (PDF, checklists, etc.) con suscripción

Si el artículo tiene un documento para descargar, no se linkea directo: se pide el
mail primero (se suscribe a la lista) y recién ahí aparece el botón de descarga.
Esto es automático, ya está armado en `script.js` — solo hay que usar este HTML:

```html
<div class="resources">
  <h3>Recursos gratuitos</h3>
  <div class="resource-grid">
    <div class="resource-card" data-download="/recursos/nombre-del-archivo.pdf" data-download-label="Descargar nombre del archivo">
      <span class="resource-tag">Para familias</span>
      <h4>Título del recurso</h4>
      <p>Descripción corta.</p>
      <form class="resource-gate">
        <input type="email" placeholder="tu@email.com" required />
        <button type="submit">Suscribirme y descargar</button>
      </form>
    </div>
  </div>
</div>
```

- El PDF va subido en la carpeta `recursos/` del repo (crearla si no existe), con
  nombre descriptivo en minúsculas y guiones (sin espacios).
- `data-download` es la ruta al PDF (con `/` adelante). `data-download-label` es el
  texto que va a tener el botón una vez que aparece.
- Para que la tarjeta quede en amarillo en vez de celeste (como la de "Para
  docentes" en el ejemplo de dislexia), agregar la clase `doc`:
  `<div class="resource-card doc" ...>`.
- Esto es un filtro "blando": junta el mail de quien quiere el documento (y lo
  suscribe), pero no es una traba de seguridad real — alguien que busque el link
  del PDF directamente en el código igual podría acceder. Para el uso que le
  estamos dando (captar suscriptores a cambio de material gratuito) alcanza.

## 2. Agregar la entrada en data/articles.json

Sumar un objeto nuevo al principio o al final del array, con el mismo `slug` que el
nombre de archivo (sin `.html`):

```json
{
  "slug": "como-hablar-de-altas-capacidades-con-la-escuela",
  "title": "Cómo hablar de altas capacidades con la escuela",
  "date": "2026-09-15",
  "excerpt": "Un resumen corto (1-2 líneas) que aparece en las tarjetas y en el mail.",
  "cover": "/images/como-hablar-articulo.jpg",
  "contentFile": "/articulos/content/como-hablar-de-altas-capacidades-con-la-escuela.html"
}
```

La fecha va en formato `AAAA-MM-DD`. El listado se ordena solo, del más nuevo al más
viejo — no importa el orden en el archivo. Tanto `"cover"` como `"contentFile"` van
con `/` adelante (ruta absoluta desde la raíz del sitio) — así funcionan igual desde
cualquier página, sin importar en qué carpeta esté.

El campo `"cover"` es opcional: si el artículo no tiene imagen de portada, se puede
omitir directamente y la tarjeta/página se muestran solo con texto. Si se agrega una
imagen, ponerla en `images/` (subida con nombre descriptivo) y comprimirla antes de
subirla — una foto de celular sin comprimir puede pesar varios MB, y para la web
alcanza con ~1000-1600px de ancho y buena compresión JPEG.

## 3. Agregar el `<item>` en rss.xml

Este archivo ya no dispara ningún envío automático (ver nota más abajo sobre por
qué), pero conviene mantenerlo igual: es el feed que cualquiera puede seguir desde
un lector de RSS, y es el que aparece linkeado en el `<head>` de cada página.
Copiar el bloque `<item>` existente y pegarlo debajo (o arriba, no importa el
orden), cambiando los datos:

```xml
<item>
  <title>Cómo hablar de altas capacidades con la escuela</title>
  <link>https://imagina.uy/articulo/?slug=como-hablar-de-altas-capacidades-con-la-escuela</link>
  <guid isPermaLink="false">imagina-como-hablar-de-altas-capacidades-con-la-escuela</guid>
  <pubDate>Tue, 15 Sep 2026 12:00:00 -0300</pubDate>
  <description>Un resumen corto (1-2 líneas) que aparece en las tarjetas y en el mail.</description>
</item>
```

- `guid` tiene que ser único para cada artículo (usar el slug alcanza).
- `pubDate` en formato RFC 822 (día de semana, día, mes, año, hora, huso horario).

## 4. Subir los cambios

```
git add articulos/content/tu-articulo.html data/articles.json rss.xml
git commit -m "Publicar: Cómo hablar de altas capacidades con la escuela"
git push
```

## 5. Avisar por email a los suscriptores (a mano)

Esto **no es automático** — ver la nota de abajo sobre por qué. Una vez que el
artículo ya está publicado en la web:

1. Abrir la Google Sheet de respuestas del formulario de suscripción → menú
   **Extensiones → Apps Script**.
2. En la función `enviarAviso`, editar `TITULO`, `RESUMEN` y `SLUG` con los datos
   del artículo — el link se arma solo (`https://imagina.uy/articulo/?slug=tu-slug`).
3. Arriba del editor, elegir `enviarAviso` en el desplegable de funciones →
   botón **Ejecutar (▶)**. Manda el mail a todos los emails de la hoja.

Toma literalmente 2 minutos por artículo.

---

# Por qué el envío es manual y no automático

Se evaluaron Buttondown, Mailchimp y MailerLite para tener suscripción +
notificación automática por email, pero los tres cobran (+$9/mes o similar) por
la función de "avisar solo al publicar algo nuevo" en sus planes gratuitos. Se
decidió no pagar por eso y armar el equivalente gratis con herramientas de
Google: un Google Form (captura el email), una Google Sheet (guarda la lista) y
un script de Google Apps Script (manda el mail de confirmación al suscribirse, y
el aviso de artículo nuevo a mano cuando se publica algo). El costo de esto es
que el aviso de "hay artículo nuevo" no sale solo — alguien tiene que apretar
"Ejecutar" — pero toma 2 minutos y no depende de ningún servicio pago.

# Sistema de suscripción (Google Form + Apps Script)

- **Formulario**: `https://docs.google.com/forms/d/e/1FAIpQLSf7ktdU_nt_bHJPE6Hssg2Pkve2H6ifufruMVYyKSNsf1OWjg/viewform`
  Una sola pregunta ("Email", validada como correo), respuestas volcadas a una
  Google Sheet.
- **Cómo se conecta el sitio**: los 3 formularios de suscripción
  (`index.html`, `articulos/index.html`, `articulo/index.html`) envían un POST
  oculto (vía un `<iframe>` invisible, sin abrir pestaña ni ventana) a
  `https://docs.google.com/forms/d/e/1FAIpQLSf7ktdU_nt_bHJPE6Hssg2Pkve2H6ifufruMVYyKSNsf1OWjg/formResponse`,
  con el campo `entry.1020811058` como email. Si en algún momento se rehace el
  formulario de Google (no solo se edita el existente), estos IDs cambian y hay
  que actualizar los 3 archivos HTML.
- **Confirmación automática**: la Sheet tiene un script de Apps Script (menú
  Extensiones → Apps Script) con dos funciones:
  - `alSuscribirse`: instalada como activador ("Al enviarse el formulario"),
    manda un mail de "¡Gracias por suscribirte!" apenas alguien completa el
    formulario. No es doble opt-in real (no hay que clickear un link para
    confirmar) — es solo un aviso de que la suscripción se registró.
  - `enviarAviso`: se ejecuta a mano para avisar de un artículo nuevo (ver
    paso 5 arriba).
- **Bajas**: no hay botón de "darse de baja" automático. Si alguien pide salir
  de la lista, hay que borrar su fila a mano de la Sheet.

# Reseñas (Inicio → "Lo que dicen de Imagina")

La sección de reseñas del Inicio **no publica nada sola** — es un paso manual y
curado, igual que los artículos, para evitar que se publique algo sin que Mariana
lo revise antes (reseña falsa, comentario de mala fe, un dato personal puesto sin
pensar, etc.).

## Cómo funciona

1. Alguien hace click en el botón **"Dejar una reseña"** del Inicio, que lleva a
   un Google Form (Nombre, Rol, Email — privado, no se publica — y Comentario).
2. Las respuestas caen en una Google Sheet. Mariana las revisa de vez en cuando y
   elige cuáles publicar.
3. Para publicar una reseña elegida, agregar un objeto al array de
   `data/resenas.json`:

```json
{
  "nombre": "Nombre Apellido",
  "rol": "Madre de familia",
  "comentario": "El texto de la reseña, tal cual lo escribió la persona (se puede acortar un poco si es muy largo)."
}
```

4. Subir con `git add data/resenas.json`, `git commit`, `git push` — igual que
   cualquier otro cambio.

El orden en que aparecen en el sitio es el mismo orden del array (no se ordenan
solas por fecha como los artículos) — para poner una nueva primera, agregarla al
principio del array.

Si el array está vacío (`[]`, como arranca el sitio), la sección entera queda
oculta automáticamente — no hace falta tocar nada más para "esconderla" mientras
no haya reseñas todavía.

## Configurar el Google Form de reseñas (una sola vez)

Mismo procedimiento que el formulario de suscripción (ver más abajo), pero con un
Form nuevo y separado, con 4 preguntas:

1. **Nombre** (respuesta corta, obligatoria).
2. **Rol** (respuesta corta, obligatoria) — ej. "Madre", "Docente", "Colega
   psicóloga". Se puede dejar como texto libre o, si se prefiere, convertir en
   "Selección múltiple" con las opciones más comunes y "Agregar otra opción".
3. **Email** (respuesta corta, validación tipo Correo, obligatoria) — no se
   publica, es solo para que Mariana pueda responder o confirmar algo si hace
   falta.
4. **Comentario** (párrafo, obligatoria).

Una vez creado:

1. Pestaña **Respuestas** → ícono de Sheets → crear una hoja de cálculo nueva.
2. Botón **Enviar** → pestaña del link (🔗) → copiar la URL (`.../viewform`).
3. En `index.html`, buscar el botón "Dejar una reseña" (dentro de
   `<section class="reviews" id="resenas">`) y reemplazar el `href="#"` por esa
   URL.

No hace falta conectar Apps Script a esta Sheet — a diferencia de la suscripción,
acá no se manda ningún mail automático: Mariana simplemente revisa la Sheet de
vez en cuando.

# Estado actual del sitio

- **Publicado en GitHub Pages**, repo `feli1512/imagina-prueba-web`, rama `main`.
- **Dominio propio conectado**: `https://imagina.uy` (registrado en Antel/NIC.UY,
  DNS apuntando a GitHub Pages, HTTPS activo). La URL vieja de GitHub Pages
  (`https://feli1512.github.io/imagina-prueba-web/`) redirige sola a `imagina.uy`.
- **Suscripción**: Google Form + Sheet + Apps Script (ver sección de arriba). Ya
  no se usa Buttondown.
- **Reseñas**: sección en el Inicio, publicación manual y curada desde
  `data/resenas.json` (ver sección de arriba). El Google Form de recolección
  todavía no está creado — el botón "Dejar una reseña" tiene un link de
  placeholder (`href="#"`) hasta que se configure.
- **URLs limpias (sin `.html`)**: `articulos.html` y `articulo.html` pasaron a
  ser `articulos/index.html` y `articulo/index.html`, así que en el navegador se
  ven como `imagina.uy/articulos/` y `imagina.uy/articulo/?slug=...`. Por eso
  todos los links internos y los fetch de `articles.js` usan rutas absolutas
  (`/style.css`, `/articulos/`, etc.) en vez de relativas — así funcionan igual
  sin importar desde qué carpeta se sirve la página.
