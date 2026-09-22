(function () {
  const map = document.getElementById("servicesMap");
  const balloon = document.getElementById("mapBalloon");
  if (!map || !balloon) return;

  const stops = Array.from(map.querySelectorAll(".map-stop"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  map.classList.add("js-ready");

  if (reduceMotion) {
    stops.forEach((stop) => stop.classList.add("revealed"));
    return;
  }

  let ticking = false;

  function update() {
    const rect = map.getBoundingClientRect();
    const viewportH = window.innerHeight;

    // 0 when the map starts entering view, 1 once it has fully scrolled past.
    const total = rect.height + viewportH * 0.6;
    const traveled = viewportH * 0.85 - rect.top;
    const progress = Math.min(Math.max(traveled / total, 0), 1);

    const isMobile = window.innerWidth <= 860;
    const base = isMobile ? "translateX(0)" : "translateX(-50%)";
    const amplitude = isMobile ? 10 : 60;

    balloon.style.top = `${progress * rect.height}px`;
    const drift = Math.sin(progress * Math.PI * 4) * amplitude;
    balloon.style.transform = `${base} translateX(${drift}px)`;

    stops.forEach((stop, i) => {
      const threshold = (i + 0.2) / stops.length;
      if (progress >= threshold) {
        stop.classList.add("revealed");
      }
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
