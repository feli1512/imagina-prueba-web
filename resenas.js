async function renderResenas() {
  const grid = document.getElementById("resenasGrid");
  const section = document.getElementById("resenas");
  if (!grid) return;

  try {
    const res = await fetch("/data/resenas.json");
    const resenas = await res.json();

    if (!resenas.length) {
      if (section) section.hidden = true;
      return;
    }

    resenas.forEach((resena) => {
      const card = document.createElement("div");
      card.className = "review-card";
      card.innerHTML = `
        <span class="review-quote-mark" aria-hidden="true">&ldquo;</span>
        <p class="review-text">${resena.comentario}</p>
        <div class="review-author">
          <span class="review-name">${resena.nombre}</span>
          <span class="review-role">${resena.rol}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    if (section) section.hidden = true;
    console.error(err);
  }
}
