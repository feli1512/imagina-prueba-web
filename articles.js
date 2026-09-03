const ARTICLES_INDEX = "data/articles.json";

function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("es-UY", { day: "numeric", month: "long", year: "numeric" });
}

async function fetchArticles() {
  const res = await fetch(ARTICLES_INDEX);
  const articles = await res.json();
  return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildArticleCard(article) {
  const card = document.createElement("a");
  card.href = `articulo.html?slug=${encodeURIComponent(article.slug)}`;
  card.className = "article-card";
  const coverHTML = article.cover
    ? `<img src="${article.cover}" alt="" class="article-card-cover" loading="lazy" />`
    : "";
  card.innerHTML = `
    ${coverHTML}
    <div class="article-card-body">
      <span class="article-date">${formatDate(article.date)}</span>
      <h3>${article.title}</h3>
      <p>${article.excerpt}</p>
      <span class="article-read-more">Leer artículo &rarr;</span>
    </div>
  `;
  return card;
}

async function renderArticlesList() {
  const grid = document.getElementById("articlesGrid");
  const emptyMsg = document.getElementById("articlesEmpty");

  try {
    const articles = await fetchArticles();

    if (articles.length === 0) {
      emptyMsg.hidden = false;
      return;
    }

    articles.forEach((article) => grid.appendChild(buildArticleCard(article)));
  } catch (err) {
    emptyMsg.textContent = "No se pudieron cargar los artículos en este momento.";
    emptyMsg.hidden = false;
    console.error(err);
  }
}

async function renderArticlesPreview(limit = 3) {
  const grid = document.getElementById("homeArticlesGrid");
  const section = document.getElementById("articulos");
  if (!grid) return;

  try {
    const articles = await fetchArticles();

    if (articles.length === 0) {
      if (section) section.hidden = true;
      return;
    }

    articles.slice(0, limit).forEach((article) => grid.appendChild(buildArticleCard(article)));
  } catch (err) {
    if (section) section.hidden = true;
    console.error(err);
  }
}

async function renderArticle() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const titleEl = document.getElementById("articleTitle");
  const dateEl = document.getElementById("articleDate");
  const bodyEl = document.getElementById("articleBody");
  const coverEl = document.getElementById("articleCover");

  if (!slug) {
    titleEl.textContent = "Artículo no encontrado";
    bodyEl.innerHTML = "<p>Volvé al <a href=\"articulos.html\">listado de artículos</a>.</p>";
    return;
  }

  try {
    const articles = await fetchArticles();
    const article = articles.find((a) => a.slug === slug);

    if (!article) {
      titleEl.textContent = "Artículo no encontrado";
      bodyEl.innerHTML = "<p>Volvé al <a href=\"articulos.html\">listado de artículos</a>.</p>";
      return;
    }

    document.title = `${article.title} | Imagina - Mariana Carignani`;
    document.getElementById("pageDescription").setAttribute("content", article.excerpt);
    titleEl.textContent = article.title;
    dateEl.textContent = formatDate(article.date);

    if (article.cover && coverEl) {
      coverEl.src = article.cover;
      coverEl.hidden = false;
    }

    const contentRes = await fetch(article.contentFile);
    bodyEl.innerHTML = await contentRes.text();
  } catch (err) {
    titleEl.textContent = "No se pudo cargar el artículo";
    console.error(err);
  }
}
