async function renderResenas() {
  const grid = document.getElementById("resenasGrid");
  const section = document.getElementById("resenas");
  const navLink = document.querySelector('.nav-links a[href="#resenas"]');
  if (!grid) return;

  function ocultarSeccion() {
    if (section) section.hidden = true;
    if (navLink) navLink.closest("li").hidden = true;
  }

  try {
    const res = await fetch("/data/resenas.json");
    const resenas = await res.json();

    if (!resenas.length) {
      ocultarSeccion();
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
    ocultarSeccion();
    console.error(err);
  }
}
