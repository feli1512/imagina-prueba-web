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

## 2. Agregar la entrada en data/articles.json

Sumar un objeto nuevo al principio o al final del array, con el mismo `slug` que el
nombre de archivo (sin `.html`):

```json
{
  "slug": "como-hablar-de-altas-capacidades-con-la-escuela",
  "title": "Cómo hablar de altas capacidades con la escuela",
  "date": "2026-09-15",
  "excerpt": "Un resumen corto (1-2 líneas) que aparece en las tarjetas y en el mail.",
  "cover": "images/como-hablar-articulo.jpg",
  "contentFile": "articulos/content/como-hablar-de-altas-capacidades-con-la-escuela.html"
}
```

La fecha va en formato `AAAA-MM-DD`. El listado se ordena solo, del más nuevo al más
viejo — no importa el orden en el archivo.

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
  <link>https://imagina.uy/articulo.html?slug=como-hablar-de-altas-capacidades-con-la-escuela</link>
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
2. En la función `enviarAviso`, editar `ASUNTO` y `CUERPO` con el título, un
   resumen corto y el link directo (`https://imagina.uy/articulo.html?slug=tu-slug`,
   o la URL de GitHub Pages si el dominio todavía no está conectado).
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
  (`index.html`, `articulos.html`, `articulo.html`) envían un POST oculto (vía
  un `<iframe>` invisible, sin abrir pestaña ni ventana) a
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

# Estado actual del sitio

- **Publicado en GitHub Pages**, repo `feli1512/imagina-prueba-web`, rama `main`.
  URL actual real: `https://feli1512.github.io/imagina-prueba-web/`.
- **Dominio definitivo decidido**: `imagina.uy` (a registrar en Antel/NIC.COM.UY).
  Los links dentro de `rss.xml` ya usan `https://imagina.uy` porque es la URL con
  la que van a convivir a largo plazo — pero ese dominio **todavía no apunta a
  este sitio**. Hasta que se registre y se conecte (ver más abajo), el sitio solo
  es alcanzable en la URL de GitHub Pages de arriba.
- **Suscripción**: Google Form + Sheet + Apps Script (ver sección de arriba). Ya
  no se usa Buttondown.

# Conectar el dominio imagina.uy (cuando esté registrado)

1. En Antel/NIC.COM.UY, configurar el dominio para que delegue a GitHub (o
   apuntar el DNS con un registro CNAME hacia `feli1512.github.io`, según lo que
   permita el panel de Antel).
2. En este repo, agregar un archivo `CNAME` (sin extensión) en la raíz, con una
   sola línea: `imagina.uy`.
3. En GitHub → **Settings → Pages**, cargar `imagina.uy` como dominio personalizado.
4. Una vez que resuelva (puede tardar unas horas), listo — no hace falta tocar
   nada más del código: como los links de `rss.xml` y de los formularios ya usan
   URLs absolutas (`https://imagina.uy/...`), en cuanto el dominio esté conectado
   todo queda apuntando bien solo.
