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

1. Entrar a https://buttondown.com y loguearse.
2. Crear un email nuevo ("New email" / "Compose").
3. Escribir un texto corto: título del artículo, 1-2 líneas de resumen, y el link
   directo (`https://imagina.uy/articulo.html?slug=tu-slug`, o la URL de GitHub
   Pages si el dominio todavía no está conectado).
4. Enviarlo a todos los suscriptores.

Toma literalmente 2 minutos por artículo.

---

# Por qué el envío es manual y no automático

Buttondown tiene una función de "RSS-to-email" que hace esto solo (detecta un
artículo nuevo en `rss.xml` y manda el mail sin que nadie toque nada). El
problema: **esa función es un complemento pago** (+$9/mes), y no está incluida en
el plan gratuito. Mailchimp y MailerLite tienen la misma limitación en sus planes
gratuitos. Se evaluó y se decidió no pagarlo por ahora — el envío manual (paso 5)
cumple lo mismo con creces de trabajo, gratis.

Si en el futuro se quiere automatizar esto, las opciones son: pagar el
complemento de Buttondown, o migrar a un servicio 100% gratuito como Blogtrottr
(tiene publicidad en los emails salvo que se pague para sacarla, y la gente se
suscribe desde blogtrottr.com en vez del formulario propio del sitio).

# Estado actual del sitio

- **Publicado en GitHub Pages**, repo `feli1512/imagina-prueba-web`, rama `main`.
  URL actual real: `https://feli1512.github.io/imagina-prueba-web/`.
- **Dominio definitivo decidido**: `imagina.uy` (a registrar en Antel/NIC.COM.UY).
  Los links dentro de `rss.xml` ya usan `https://imagina.uy` porque es la URL con
  la que van a convivir a largo plazo — pero ese dominio **todavía no apunta a
  este sitio**. Hasta que se registre y se conecte (ver más abajo), el sitio solo
  es alcanzable en la URL de GitHub Pages de arriba.
- **Buttondown**: cuenta creada, usuario `imagina.uy`, ya cargado en los 3
  formularios de suscripción (`index.html`, `articulos.html`, `articulo.html`).
  El envío del aviso por email se hace a mano (ver paso 5 arriba).

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
