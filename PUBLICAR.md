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
  <link>https://TU-DOMINIO.example/articulo.html?slug=como-hablar-de-altas-capacidades-con-la-escuela</link>
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

# Configuración de Buttondown (una sola vez)

1. Crear cuenta gratuita en https://buttondown.com.
2. Elegir un nombre de usuario (ej. `imagina-marianacarignani`) y reemplazarlo en:
   - `articulos.html` (formulario de suscripción)
   - `articulo.html` (formulario de suscripción)
3. En el panel de Buttondown, ir a la configuración de **RSS-to-email** y pegar la
   URL pública de `rss.xml` una vez el sitio esté publicado
   (ej. `https://tu-usuario.github.io/imagina-web/rss.xml`).
4. Reemplazar `https://TU-DOMINIO.example` por esa misma URL real en todo `rss.xml`.

# Publicar el sitio en GitHub Pages

1. Crear un repositorio en GitHub y subir esta carpeta.
2. En **Settings → Pages**, elegir la rama `main` (o `master`) como fuente.
3. GitHub va a dar una URL tipo `https://tu-usuario.github.io/nombre-del-repo/`. Esa
   es la URL a usar en el paso 3 de Buttondown y en `rss.xml`.
