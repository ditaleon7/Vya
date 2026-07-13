// =============================================================
// Portofolio Nurani Shilvya Akbar — Beach / Pantai theme scripts
// =============================================================

document.addEventListener("DOMContentLoaded", () => {
  initRevealOnScroll();
  initAmbientBubbles();
  initGulls();
  initBackToBeranda();
  initSmoothAnchors();
  initNavbar();
  initCursorBubbles();
});

/* -------------------------------------------------------------
 * 1) Reveal elements as they enter the viewport
 * ----------------------------------------------------------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || items.length === 0) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  items.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------
 * 2) Gelembung / bubble ambient di setiap section
 *    (dibuat lewat JS, bukan hard-coded, biar jumlah & posisi acak)
 * ----------------------------------------------------------- */
function initAmbientBubbles() {
  const zones = document.querySelectorAll("[data-bubble-zone]");

  zones.forEach((zone) => {
    const density = parseInt(zone.dataset.bubbleZone, 10) || 8;

    for (let i = 0; i < density; i++) {
      const bubble = document.createElement("span");
      bubble.className = "bubble";

      const size = randomBetween(6, 22);
      const left = randomBetween(2, 96);
      const duration = randomBetween(10, 22);
      const delay = randomBetween(0, 16);
      const driftX = randomBetween(-40, 40);

      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      bubble.style.left = `${left}%`;
      bubble.style.bottom = `-40px`;
      bubble.style.animationDuration = `${duration}s`;
      bubble.style.animationDelay = `${delay}s`;
      bubble.style.setProperty("--drift-x", `${driftX}px`);

      zone.appendChild(bubble);
    }
  });
}

/* -------------------------------------------------------------
 * 3) Burung camar melintas sesekali di hero
 * ----------------------------------------------------------- */
function initGulls() {
  const sky = document.querySelector("[data-gull-zone]");
  if (!sky) return;

  const gullSVG = () => {
    const wrap = document.createElement("div");
    wrap.className = "gull absolute";
    wrap.style.top = `${randomBetween(8, 40)}%`;
    wrap.style.animationDelay = `${randomBetween(0, 10)}s`;
    wrap.innerHTML = `
      <svg width="34" height="16" viewBox="0 0 34 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 10C6 2 11 2 17 8C23 2 28 2 33 10" stroke="#163A52" stroke-width="1.6" stroke-linecap="round" opacity="0.55"/>
      </svg>`;
    return wrap;
  };

  for (let i = 0; i < 3; i++) {
    sky.appendChild(gullSVG());
  }
}

/* -------------------------------------------------------------
 * 4) Tombol mengambang: kembali ke Beranda
 * ----------------------------------------------------------- */
function initBackToBeranda() {
  const btn = document.getElementById("back-to-beranda");
  const hero = document.getElementById("beranda");
  if (!btn || !hero) return;

  const toggleButton = () => {
    const heroBottom = hero.offsetTop + hero.offsetHeight * 0.6;
    if (window.scrollY > heroBottom) {
      btn.classList.remove("opacity-0", "pointer-events-none", "translate-y-3");
    } else {
      btn.classList.add("opacity-0", "pointer-events-none", "translate-y-3");
    }
  };

  window.addEventListener("scroll", toggleButton, { passive: true });
  toggleButton();

  btn.addEventListener("click", () => {
    hero.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/* -------------------------------------------------------------
 * 5) Scroll halus untuk semua tautan berjangkar (#id)
 * ----------------------------------------------------------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

/* -------------------------------------------------------------
 * 6) Navbar — toggle menu mobile & tandai tautan yang aktif
 * ----------------------------------------------------------- */
function initNavbar() {
  const toggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("nav-mobile-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (toggle && mobileMenu) {
    toggle.addEventListener("click", () => {
      const isOpen = !mobileMenu.classList.contains("hidden");
      mobileMenu.classList.toggle("hidden", isOpen);
      toggle.setAttribute("aria-expanded", String(!isOpen));
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (!("IntersectionObserver" in window) || sections.length === 0) return;

  const setActive = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => spy.observe(section));
}

/* -------------------------------------------------------------
 * 7) Gelembung mengikuti kursor saat digeser
 * ----------------------------------------------------------- */
function initCursorBubbles() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  if (prefersReducedMotion || isCoarsePointer) return;

  let lastSpawn = 0;
  const minInterval = 70; // ms, biar tidak terlalu padat

  const spawnBubble = (x, y) => {
    const bubble = document.createElement("span");
    bubble.className = "cursor-bubble";

    const size = randomBetween(6, 14);
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x - size / 2}px`;
    bubble.style.top = `${y - size / 2}px`;

    document.body.appendChild(bubble);
    bubble.addEventListener("animationend", () => bubble.remove());
  };

  window.addEventListener(
    "pointermove",
    (e) => {
      const now = performance.now();
      if (now - lastSpawn < minInterval) return;
      lastSpawn = now;
      spawnBubble(e.clientX, e.clientY);
    },
    { passive: true }
  );
}

/* -------------------------------------------------------------
 * Utils
 * ----------------------------------------------------------- */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}