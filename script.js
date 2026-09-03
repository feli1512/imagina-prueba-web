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
