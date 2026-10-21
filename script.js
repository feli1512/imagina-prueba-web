document.getElementById("year").textContent = new Date().getFullYear();

const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
  });
});

// Globo aerostático que recorre la pantalla según el progreso de scroll
(function () {
  const balloon = document.getElementById("scrollBalloon");
  if (!balloon) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const topMargin = 90;
  const bottomMargin = 60;
  let ticking = false;

  function updateBalloon() {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
    const trackHeight = Math.max(window.innerHeight - topMargin - bottomMargin, 0);
    const top = topMargin + progress * trackHeight;

    balloon.style.top = `${top}px`;

    if (reduceMotion) {
      balloon.style.transform = "none";
    } else {
      const drift = Math.sin(progress * Math.PI * 6) * 14;
      const sway = Math.sin(progress * Math.PI * 6 + Math.PI / 2) * 5;
      balloon.style.transform = `translateX(${drift}px) rotate(${sway}deg)`;
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateBalloon);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  updateBalloon();
})();

// Suscripción sin abrir pestaña/ventana: el form apunta a un iframe oculto
// (Google Forms), y acá mostramos un mensaje de agradecimiento propio.
document.querySelectorAll(".subscribe-form").forEach((form) => {
  form.addEventListener("submit", () => {
    const thanks = document.getElementById(form.dataset.thanks);
    form.hidden = true;
    if (thanks) thanks.hidden = false;
  });
});

// Descargas de documentos (PDFs, checklists, etc.): gate "blando" de
// suscripción. Antes de descargar, pide el email, lo suscribe (mismo
// mecanismo que los formularios de arriba) y recuerda en este navegador que
// ya desbloqueó descargas, para no volver a pedirlo la próxima vez.
(function () {
  const GOOGLE_FORM_ACTION =
    "https://docs.google.com/forms/d/e/1FAIpQLSf7ktdU_nt_bHJPE6Hssg2Pkve2H6ifufruMVYyKSNsf1OWjg/formResponse";
  const GOOGLE_FORM_EMAIL_FIELD = "entry.1020811058";
  const STORAGE_KEY = "imaginaDescargasDesbloqueadas";

  function desbloqueado() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "1";
    } catch (err) {
      return false;
    }
  }

  function marcarDesbloqueado() {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch (err) {
      // Si el navegador bloquea localStorage (modo privado, etc.), no pasa
      // nada grave: simplemente va a volver a pedir el mail la próxima vez.
    }
  }

  function mostrarDescarga(card) {
    const gate = card.querySelector(".resource-gate");
    if (gate) gate.hidden = true;

    // Si la tarjeta ya trae uno o más links de descarga escritos a mano
    // (por ejemplo, Word + PDF), simplemente se muestran.
    const existentes = card.querySelectorAll(".resource-download-link");
    if (existentes.length) {
      existentes.forEach((link) => {
        link.hidden = false;
      });
      return;
    }

    // Si no, se arma uno solo a partir de data-download (caso simple).
    const link = document.createElement("a");
    link.className = "btn-download resource-download-link";
    link.href = card.dataset.download;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = card.dataset.downloadLabel || "Descargar";
    card.appendChild(link);
    link.hidden = false;
  }

  function suscribirSilencioso(email) {
    const iframe = document.createElement("iframe");
    iframe.name = "bd-hidden-res-" + Date.now();
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    const form = document.createElement("form");
    form.action = GOOGLE_FORM_ACTION;
    form.method = "post";
    form.target = iframe.name;
    form.style.display = "none";

    const input = document.createElement("input");
    input.type = "email";
    input.name = GOOGLE_FORM_EMAIL_FIELD;
    input.value = email;
    form.appendChild(input);

    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      form.remove();
      iframe.remove();
    }, 5000);
  }

  function initResourceGates(root) {
    (root || document).querySelectorAll(".resource-card").forEach((card) => {
      if (card.dataset.gateInit) return;
      card.dataset.gateInit = "1";

      if (desbloqueado()) {
        mostrarDescarga(card);
        return;
      }

      const gate = card.querySelector(".resource-gate");
      if (!gate) return;

      gate.addEventListener("submit", (ev) => {
        ev.preventDefault();
        const input = gate.querySelector('input[type="email"]');
        const email = input ? input.value.trim() : "";
        if (!email) return;

        suscribirSilencioso(email);
        marcarDesbloqueado();
        // Desbloquea esta tarjeta y también cualquier otra que ya esté en
        // la página (por ejemplo, otro documento más abajo), sin esperar a
        // que se recargue la página.
        document.querySelectorAll(".resource-card").forEach(mostrarDescarga);
      });
    });
  }

  // El contenido de los artículos se inserta después, vía fetch (ver
  // articles.js), así que además de correr acá quedamos escuchando por si
  // aparecen tarjetas nuevas en el DOM más tarde.
  initResourceGates();
  window.initResourceGates = initResourceGates;

  const articleBody = document.getElementById("articleBody");
  if (articleBody && "MutationObserver" in window) {
    new MutationObserver(() => initResourceGates(articleBody)).observe(articleBody, {
      childList: true,
    });
  }
})();
