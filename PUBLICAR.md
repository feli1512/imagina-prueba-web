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

Esto es lo que dispara el email automático a los suscriptores. Copiar el bloque
`<item>` existente y pegarlo debajo (o arriba, no importa el orden), cambiando los
datos:

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
- Si el `guid` no cambia, Buttondown no vuelve a mandar el mail — así que ojo si
  editás un artículo viejo: no toques su `guid` a menos que quieras que se reenvíe.

## 4. Subir los cambios

```
git add articulos/content/tu-articulo.html data/articles.json rss.xml
git commit -m "Publicar: Cómo hablar de altas capacidades con la escuela"
git push
```

Apenas se actualiza `rss.xml` en el sitio publicado, Buttondown lo detecta (revisa el
feed periódicamente) y manda el mail a los suscriptores solo.

---

# Estado actual del sitio

- **Publicado en GitHub Pages**, repo `feli1512/imagina-prueba-web`, rama `main`.
  URL actual real: `https://feli1512.github.io/imagina-prueba-web/`.
- **Dominio definitivo decidido**: `imagina.uy` (a registrar en Antel/NIC.COM.UY).
  Los links dentro de `rss.xml` ya usan `https://imagina.uy` porque es la URL con
  la que van a convivir a largo plazo — pero ese dominio **todavía no apunta a
  este sitio**. Hasta que se registre y se conecte (ver más abajo), el sitio solo
  es alcanzable en la URL de GitHub Pages de arriba.
- **Falta únicamente**: conectar el RSS-to-email dentro del panel de Buttondown
  (paso 3 de abajo). Sin eso, publicar un artículo actualiza la web pero no
  manda ningún email todavía.

# Configuración de Buttondown (una sola vez)

1. ✅ Cuenta creada en https://buttondown.com.
2. ✅ Usuario elegido: `imagina.uy` — ya está cargado en los 3 formularios de
   suscripción (`index.html`, `articulos.html`, `articulo.html`).
3. **Pendiente**: en el panel de Buttondown, ir a la configuración de
   **RSS-to-email** y pegar ahí la URL donde el feed sea alcanzable **hoy**:
   `https://feli1512.github.io/imagina-prueba-web/rss.xml`
   (⚠️ no pegar `https://imagina.uy/rss.xml` todavía — ese dominio no resuelve a
   nada mientras no esté registrado y conectado).
4. El día que `imagina.uy` esté registrado y apuntando a este sitio (ver abajo),
   volver a esta configuración de Buttondown y cambiar la URL del feed a
   `https://imagina.uy/rss.xml`.

# Conectar el dominio imagina.uy (cuando esté registrado)

1. En Antel/NIC.COM.UY, configurar el dominio para que delegue a GitHub (o
   apuntar el DNS con un registro CNAME hacia `feli1512.github.io`, según lo que
   permita el panel de Antel).
2. En este repo, agregar un archivo `CNAME` (sin extensión) en la raíz, con una
   sola línea: `imagina.uy`.
3. En GitHub → **Settings → Pages**, cargar `imagina.uy` como dominio personalizado.
4. Una vez que resuelva (puede tardar unas horas), actualizar en Buttondown la
   URL del feed RSS-to-email a `https://imagina.uy/rss.xml` (paso 4 de arriba).

No hace falta tocar nada más del código: como los links de `rss.xml` y de los
formularios ya usan URLs absolutas, en cuanto el dominio esté conectado todo
queda apuntando bien solo.
