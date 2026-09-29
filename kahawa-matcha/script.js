/* ============================================================
   KAHAWA & MATCHA — interactions
   Hero drink carousel with palette shift, GSAP scroll reveals
   ============================================================ */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Hero carousel ---------------- */

  const hero = document.getElementById("hero");
  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const drinks = Array.from(document.querySelectorAll(".hero-drink"));
  const kicker = document.getElementById("heroKicker");
  const indexEl = document.getElementById("heroIndex");
  const dotsWrap = document.getElementById("heroDots");
  const prevBtn = document.getElementById("heroPrev");
  const nextBtn = document.getElementById("heroNext");

  let current = 0;
  let autoTimer = null;
  const AUTO_MS = 6000;

  // build dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.className = "hero-dot" + (i === 0 ? " active" : "");
    b.setAttribute("aria-label", "Show drink " + (i + 1));
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
    return b;
  });

  function pad(n) { return String(n).padStart(2, "0"); }

  function goTo(i, user) {
    i = (i + slides.length) % slides.length;
    if (i === current) return;

    slides[current].classList.remove("active");
    drinks[current].classList.remove("active");
    dots[current].classList.remove("active");

    current = i;

    slides[current].classList.add("active");
    drinks[current].classList.add("active");
    dots[current].classList.add("active");

    hero.setAttribute("data-theme", slides[current].dataset.theme);
    kicker.textContent = slides[current].dataset.kicker;
    indexEl.textContent = pad(current + 1);

    if (window.gsap && !prefersReduced) {
      gsap.fromTo(
        drinks[current].querySelector("img"),
        { scale: 1.14, rotate: -2 },
        { scale: 1, rotate: 0, duration: 1.1, ease: "power3.out" }
      );
    }

    if (user) restartAuto();
  }

  function next() { goTo(current + 1, false); }
  function prev() { goTo(current - 1, false); }

  nextBtn.addEventListener("click", () => { next(); restartAuto(); });
  prevBtn.addEventListener("click", () => { prev(); restartAuto(); });

  function restartAuto() {
    clearInterval(autoTimer);
    if (!prefersReduced) autoTimer = setInterval(next, AUTO_MS);
  }
  restartAuto();

  // pause auto-play while the hero is off screen
  new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) restartAuto();
        else clearInterval(autoTimer);
      });
    },
    { threshold: 0.25 }
  ).observe(hero);

  // swipe support on the hero card
  let touchX = null;
  hero.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
  hero.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 48) { dx < 0 ? next() : prev(); restartAuto(); }
    touchX = null;
  }, { passive: true });

  // mouse drag swipe for desktop
  let dragX = null;
  hero.addEventListener("mousedown", (e) => { dragX = e.clientX; });
  window.addEventListener("mouseup", (e) => {
    if (dragX === null) return;
    const dx = e.clientX - dragX;
    if (Math.abs(dx) > 60) { dx < 0 ? next() : prev(); restartAuto(); }
    dragX = null;
  });

  // keyboard arrows
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { next(); restartAuto(); }
    if (e.key === "ArrowLeft") { prev(); restartAuto(); }
  });

  /* ---------------- Mobile drawer ---------------- */

  const burger = document.getElementById("navBurger");
  const drawer = document.getElementById("navDrawer");

  burger.addEventListener("click", () => {
    const open = drawer.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    drawer.setAttribute("aria-hidden", String(!open));
  });

  /* ---------------- Smooth scrolling ---------------- */

  document.querySelectorAll("[data-scroll]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || !id.startsWith("#")) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      drawer.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
      drawer.setAttribute("aria-hidden", "true");

      if (window.gsap) {
        gsap.to(window, {
          scrollTo: { y: target, offsetY: 0 },
          duration: prefersReduced ? 0 : 1.1,
          ease: "power3.inOut",
        });
      } else {
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      }
    });
  });

  /* ---------------- Nav state on scroll ---------------- */

  const nav = document.getElementById("siteNav");
  const progress = document.getElementById("navProgressBar");

  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 24);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? window.scrollY / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------------- GSAP animations ---------------- */

  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  if (prefersReduced) return;

  // hero entrance
  gsap.from(".hero-kicker", { y: 24, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.15 });
  gsap.from(".hero-slide.active .line-inner", { yPercent: 110, duration: 1.1, ease: "power4.out", delay: 0.3, stagger: 0.1 });
  gsap.from(".hero-slide.active .hero-price, .hero-slide.active .hero-lede, .hero-slide.active .hero-actions", {
    y: 26, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.55, stagger: 0.09,
  });
  gsap.from(".hero-drink.active", { y: 60, opacity: 0, scale: 0.92, duration: 1.2, ease: "power3.out", delay: 0.4 });
  gsap.from(".site-nav .nav-inner > *", { y: -18, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.2 });

  // panel titles + ledes
  document.querySelectorAll(".panel, .final").forEach((section) => {
    const kickerEl = section.querySelector(".panel-kicker");
    if (kickerEl) {
      gsap.from(kickerEl, {
        scrollTrigger: { trigger: section, start: "top 70%" },
        y: 20, opacity: 0, duration: 0.7, ease: "power3.out",
      });
    }
    section.querySelectorAll(".panel-title .line-inner, .final-title .line-inner").forEach((line) => {
      gsap.from(line, {
        scrollTrigger: { trigger: section, start: "top 65%" },
        yPercent: 110, duration: 1, ease: "power4.out", stagger: 0.1,
      });
    });
    const lede = section.querySelector(".panel-lede, .final-lede");
    if (lede) {
      gsap.from(lede, {
        scrollTrigger: { trigger: section, start: "top 60%" },
        y: 26, opacity: 0, duration: 0.9, ease: "power3.out",
      });
    }
  });

  // product cards
  document.querySelectorAll(".product-card").forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: "top 85%" },
      y: 60, opacity: 0, duration: 0.9, ease: "power3.out", delay: (i % 3) * 0.12,
    });
  });

  // CTA rows
  document.querySelectorAll(".panel-cta, .final-actions").forEach((cta) => {
    gsap.from(cta, {
      scrollTrigger: { trigger: cta, start: "top 90%" },
      y: 24, opacity: 0, duration: 0.8, ease: "power3.out",
    });
  });

  // gentle parallax on the hero orb as the hero leaves
  gsap.to(".hero-orb", {
    scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
    y: 90, ease: "none",
  });
  gsap.to(".final-inner", {
    scrollTrigger: { trigger: ".final", start: "top bottom", end: "top 30%", scrub: true },
    y: 40, ease: "none",
  });
})();
