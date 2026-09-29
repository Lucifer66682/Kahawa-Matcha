const fs = require("fs");
const p = __dirname + "/index.html";
let html = fs.readFileSync(p, "utf8");

// capture the three embedded hero images (document order: matcha, espresso, latte)
const uris = [...html.matchAll(/data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g)].map((m) => m[0]);
if (uris.length < 3) throw new Error("expected 3 embedded images, found " + uris.length);
const [CAN1, CAN2, CAN3] = uris;

/* ---------------- 1. HERO HTML ---------------- */

const heroStart = html.indexOf("<!-- ============ HERO");
const heroEnd = html.indexOf("<!-- ============ MARQUEE");
if (heroStart < 0 || heroEnd < 0) throw new Error("hero html markers not found");

const newHero = `<!-- ============ HERO (scroll-driven can journey) ============ -->
    <section class="section hero" id="hero">
      <div class="hero-pin" id="heroPin">
        <div class="hero-bigwords" aria-hidden="true">
          <span class="bigword" data-step="0">MATCHA</span>
          <span class="bigword" data-step="1">ESPRESSO</span>
          <span class="bigword" data-step="2">VELVET</span>
        </div>

        <div class="hero-ring" aria-hidden="true"></div>

        <div class="hero-cans">
          <figure class="hero-can" data-step="0"><img src="${CAN1}" alt="Iced matcha latte" /></figure>
          <figure class="hero-can" data-step="1"><img src="${CAN2}" alt="Espresso over ice" /></figure>
          <figure class="hero-can" data-step="2"><img src="${CAN3}" alt="Creamy latte" /></figure>
        </div>

        <div class="hero-particles" aria-hidden="true">
          <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
        </div>

        <div class="hero-infos">
          <div class="hero-info" data-step="0">
            <p class="hero-kicker">Matcha &middot; Ceremonial Grade</p>
            <p class="hero-price">$6.50</p>
            <p class="hero-lede">First-flush matcha from Uji, whisked to a silk froth over cold oat cream. Calm, green, complete.</p>
            <div class="hero-actions">
              <button class="btn btn-primary" type="button"><span class="btn-label">Add to Cart</span><span class="btn-arrow" aria-hidden="true">&rarr;</span></button>
              <a class="hero-ghostlink" href="#matcha" data-scroll>View the collection</a>
            </div>
          </div>
          <div class="hero-info" data-step="1">
            <p class="hero-kicker">Espresso &middot; Single Origin</p>
            <p class="hero-price">$4.80</p>
            <p class="hero-lede">A slow-roasted single origin, pulled as a double over hand-cut ice. Dark syrup, bright finish.</p>
            <div class="hero-actions">
              <button class="btn btn-primary" type="button"><span class="btn-label">Add to Cart</span><span class="btn-arrow" aria-hidden="true">&rarr;</span></button>
              <a class="hero-ghostlink" href="#coffee" data-scroll>View the collection</a>
            </div>
          </div>
          <div class="hero-info" data-step="2">
            <p class="hero-kicker">Latte &middot; Velvet Pour</p>
            <p class="hero-price">$5.50</p>
            <p class="hero-lede">Espresso folded into steamed cream and finished with a dusting of caramel. Soft as the name.</p>
            <div class="hero-actions">
              <button class="btn btn-primary" type="button"><span class="btn-label">Add to Cart</span><span class="btn-arrow" aria-hidden="true">&rarr;</span></button>
              <a class="hero-ghostlink" href="#collection" data-scroll>View the collection</a>
            </div>
          </div>
        </div>

        <div class="hero-dots-v" role="tablist" aria-label="Drinks">
          <button class="hero-dotv active" aria-label="Show drink 1"></button>
          <button class="hero-dotv" aria-label="Show drink 2"></button>
          <button class="hero-dotv" aria-label="Show drink 3"></button>
        </div>

        <div class="hero-hint" aria-hidden="true">
          <span>Scroll</span><span class="scroll-line"></span><span>the ritual changes</span>
        </div>
      </div>
    </section>

    `;

html = html.slice(0, heroStart) + newHero + html.slice(heroEnd);

/* ---------------- 2. HERO CSS ---------------- */

const cssStart = html.indexOf("/* ============ HERO ============ */");
const cssEnd = html.indexOf("/* ============ MARQUEE ============ */");
if (cssStart < 0 || cssEnd < 0) throw new Error("hero css markers not found");

const newHeroCSS = `/* ============ HERO (scroll-driven can journey) ============ */

.hero {
  --h-bg: #1d2a16;
  --h-accent: #7ba05b;
  --h-word: #eef3e4;
  --h-soft: rgba(238, 243, 228, 0.68);
  position: relative;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  background: var(--h-bg);
  color: var(--h-word);
}

.hero-pin { position: relative; height: 100%; }

.hero-bigwords {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  z-index: 1;
}

.bigword {
  grid-area: 1 / 1;
  font-family: "Fraunces", serif;
  font-weight: 600;
  font-size: clamp(4rem, 20vw, 18rem);
  line-height: 1;
  letter-spacing: -0.03em;
  white-space: nowrap;
  color: var(--h-word);
  opacity: 0;
}

/* pre-JS fallback: show the first frame */
.bigword[data-step="0"],
.hero-can[data-step="0"],
.hero-info[data-step="0"] { opacity: 1; }
.hero-can[data-step="0"] { transform: rotate(-10deg); }

.hero-ring {
  position: absolute;
  top: calc(50% - min(29vh, 260px));
  left: calc(50% - min(29vh, 260px));
  width: min(58vh, 520px);
  aspect-ratio: 1;
  border: 1.5px solid var(--h-accent);
  border-radius: 50%;
  opacity: 0.45;
  z-index: 1;
  pointer-events: none;
}

.hero-ring::after {
  content: "";
  position: absolute;
  top: -5px;
  left: 50%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--h-accent);
}

.hero-cans {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  z-index: 2;
}

.hero-can {
  grid-area: 1 / 1;
  width: min(42vw, 360px);
  aspect-ratio: 3 / 4.3;
  margin: 0;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 50px 90px -30px rgba(0, 0, 0, 0.65);
  opacity: 0;
}

.hero-can img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.hero-particles i {
  position: absolute;
  width: 26px;
  height: 8px;
  border-radius: 6px;
  background: var(--h-word);
  opacity: 0.4;
}

.hero-particles i:nth-child(1)  { top: 16%; left: 12%; transform: rotate(24deg); }
.hero-particles i:nth-child(2)  { top: 24%; left: 78%; transform: rotate(-18deg); }
.hero-particles i:nth-child(3)  { top: 34%; left: 6%;  transform: rotate(60deg); }
.hero-particles i:nth-child(4)  { top: 12%; left: 44%; transform: rotate(-30deg); }
.hero-particles i:nth-child(5)  { top: 64%; left: 88%; transform: rotate(18deg); }
.hero-particles i:nth-child(6)  { top: 72%; left: 16%; transform: rotate(-42deg); }
.hero-particles i:nth-child(7)  { top: 48%; left: 92%; transform: rotate(70deg); }
.hero-particles i:nth-child(8)  { top: 84%; left: 62%; transform: rotate(12deg); }
.hero-particles i:nth-child(9)  { top: 40%; left: 30%; transform: rotate(-8deg); }
.hero-particles i:nth-child(10) { top: 8%;  left: 64%; transform: rotate(40deg); }
.hero-particles i:nth-child(11) { top: 58%; left: 40%; transform: rotate(-60deg); }
.hero-particles i:nth-child(12) { top: 90%; left: 34%; transform: rotate(28deg); }

.hero-infos {
  position: absolute;
  left: clamp(20px, 6vw, 84px);
  bottom: clamp(24px, 9vh, 76px);
  z-index: 3;
  width: min(420px, 84vw);
  display: grid;
}

.hero-info {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(26px);
}

.hero-kicker {
  font-size: 0.74rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--h-accent);
}

.hero-price {
  margin-top: 10px;
  font-family: "Space Mono", monospace;
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--h-word);
}

.hero-lede {
  margin-top: 12px;
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--h-soft);
  max-width: 40ch;
}

.hero-actions {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.hero .btn-primary { background: var(--h-word); color: #181209; }
.hero .btn-primary::before { background: var(--h-accent); }
.hero .btn-primary:hover { color: #fff; }

.hero-ghostlink {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--h-word);
  border-bottom: 1.5px solid var(--h-accent);
  padding-bottom: 3px;
  transition: opacity 0.3s;
}

.hero-ghostlink:hover { opacity: 0.6; }

.hero-dots-v {
  position: absolute;
  right: clamp(14px, 3vw, 40px);
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 14px;
  z-index: 3;
}

.hero-dotv {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 0;
  padding: 0;
  background: rgba(255, 255, 255, 0.25);
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;
}

.hero-dotv.active {
  background: var(--h-word);
  transform: scale(1.3);
}

.hero-hint {
  position: absolute;
  bottom: clamp(18px, 4vh, 36px);
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--h-soft);
  z-index: 3;
  white-space: nowrap;
}

.scroll-line {
  width: 54px;
  height: 1px;
  background: var(--h-word);
  display: inline-block;
  animation: scrollPulse 2.2s infinite;
}

@keyframes scrollPulse {
  0% { transform: scaleX(0); transform-origin: left; }
  45% { transform: scaleX(1); transform-origin: left; }
  55% { transform: scaleX(1); transform-origin: right; }
  100% { transform: scaleX(0); transform-origin: right; }
}

/* ============ MARQUEE ============ */`;

html = html.slice(0, cssStart) + newHeroCSS + html.slice(cssEnd);

/* ---------------- 3. HERO JS (carousel -> scroll journey) ---------------- */

const jsStart = html.indexOf("  /* ---------------- Hero carousel ---------------- */");
const jsEnd = html.indexOf("  /* ---------------- Mobile drawer ---------------- */");
if (jsStart < 0 || jsEnd < 0) throw new Error("hero js markers not found");

const newHeroJS = `  /* ---------------- Hero: scroll-driven can journey ---------------- */

  const hero = document.getElementById("hero");
  const heroCans = Array.from(document.querySelectorAll(".hero-can"));
  const heroWords = Array.from(document.querySelectorAll(".bigword"));
  const heroInfos = Array.from(document.querySelectorAll(".hero-info"));
  const heroDotsV = Array.from(document.querySelectorAll(".hero-dotv"));

  const HERO_THEMES = [
    { bg: "#1d2a16", accent: "#7ba05b", word: "#eef3e4", soft: "rgba(238,243,228,0.68)" },
    { bg: "#241608", accent: "#c08a52", word: "#f6eee0", soft: "rgba(246,238,224,0.66)" },
    { bg: "#2e2113", accent: "#c9a86a", word: "#f5eee1", soft: "rgba(245,238,225,0.66)" },
  ];

  let heroST = null;

  function setHeroActive(i) {
    heroDotsV.forEach((d, j) => d.classList.toggle("active", i === j));
  }

  heroDotsV.forEach((d, i) =>
    d.addEventListener("click", () => {
      if (!heroST || !window.gsap) return;
      const y = heroST.start + (heroST.end - heroST.start) * (i === 0 ? 0.001 : i === 1 ? 0.5 : 0.999);
      gsap.to(window, { scrollTo: y, duration: 1, ease: "power2.inOut" });
    })
  );

  function initHeroJourney() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (prefersReduced) return; // CSS fallback shows the first frame

    gsap.set(heroWords, { opacity: 0, xPercent: 10 });
    gsap.set(heroCans, { opacity: 0, yPercent: 0, rotation: 0 });
    gsap.set(heroInfos, { opacity: 0, y: 26 });
    gsap.set(heroWords[0], { opacity: 1, xPercent: 0 });
    gsap.set(heroCans[0], { opacity: 1, rotation: -10 });
    gsap.set(heroInfos[0], { opacity: 1, y: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "+=3200",
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => setHeroActive(self.progress < 0.34 ? 0 : self.progress < 0.67 ? 1 : 2),
      },
    });
    heroST = tl.scrollTrigger;

    const swapTo = (i, at) => {
      const prev = i - 1;
      tl.to(hero, {
        "--h-bg": HERO_THEMES[i].bg,
        "--h-accent": HERO_THEMES[i].accent,
        "--h-word": HERO_THEMES[i].word,
        "--h-soft": HERO_THEMES[i].soft,
        duration: 0.9,
      }, at)
        .to(heroCans[prev], { yPercent: -130, rotation: -40, opacity: 0, duration: 0.9 }, at)
        .fromTo(heroCans[i], { yPercent: 130, rotation: 40, opacity: 0 },
          { yPercent: 0, rotation: i === 1 ? 8 : -7, opacity: 1, duration: 0.9 }, at)
        .to(heroWords[prev], { xPercent: -12, opacity: 0, duration: 0.6 }, at + 0.05)
        .fromTo(heroWords[i], { xPercent: 12, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.6 }, at + 0.05)
        .to(heroInfos[prev], { y: -26, opacity: 0, duration: 0.45 }, at + 0.05)
        .fromTo(heroInfos[i], { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45 }, at + 0.25);
    };

    tl.to({}, { duration: 0.9 });        // hold drink 1
    swapTo(1, 0.9);                       // transition 1 -> 2
    tl.to({}, { duration: 0.8 }, ">");   // hold drink 2
    swapTo(2, 2.6);                       // transition 2 -> 3
    tl.to({}, { duration: 0.9 }, ">");   // hold drink 3

    // idle life: cans float, ring turns, particles drift
    heroCans.forEach((c, i) => {
      gsap.to(c.querySelector("img"), { y: -10, yoyo: true, repeat: -1, duration: 2.4 + i * 0.3, ease: "sine.inOut" });
    });
    gsap.to(".hero-ring", { rotation: 360, duration: 46, repeat: -1, ease: "none" });
    gsap.utils.toArray(".hero-particles i").forEach((pt) => {
      gsap.to(pt, {
        y: "random(-46,46)", x: "random(-24,24)", rotation: "random(-40,40)",
        duration: "random(3,6.5)", repeat: -1, yoyo: true, ease: "sine.inOut", delay: "random(0,2)",
      });
    });
  }
  initHeroJourney();

`;

html = html.slice(0, jsStart) + newHeroJS + html.slice(jsEnd);

/* ---------------- 4. load intro tweens (old carousel selectors gone) ---------------- */

const introStart = html.indexOf("  // hero entrance");
const introEnd = html.indexOf("  // panel titles + ledes");
if (introStart < 0 || introEnd < 0) throw new Error("intro markers not found");

const newIntro = `  // load intro
  gsap.from(".hero-can[data-step='0']", { y: 70, duration: 1.1, ease: "power3.out", delay: 0.25 });
  gsap.from(".bigword[data-step='0']", { scale: 0.92, duration: 1.2, ease: "power3.out", delay: 0.15 });
  gsap.from(".hero-info[data-step='0'] > *", { y: 24, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.5 });
  gsap.from(".site-nav .nav-inner > *", { y: -18, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.08, delay: 0.2 });

`;

html = html.slice(0, introStart) + newIntro + html.slice(introEnd);

/* ---------------- 5. prune dead hero rules from media queries ---------------- */

const deadRules = [
  "  .hero-card { grid-template-columns: 1fr; gap: 28px; }\n",
  "  .hero-visual { min-height: 380px; order: -1; }\n",
  "\n  .hero { padding-inline: 12px; }\n",
  "\n  .hero-card { padding: 22px; border-radius: 22px; }\n",
  "\n  .hero-title { font-size: clamp(2.6rem, 12vw, 3.6rem); }\n",
  "\n  .hero-visual { min-height: 320px; }\n",
  "\n  .hero-drink { width: min(78%, 300px); }\n",
  "\n  .hero-footer { flex-direction: column; gap: 10px; text-align: center; }\n",
  "\n  .hero-controls { margin-top: 26px; }\n",
];
for (const r of deadRules) html = html.split(r).join("\n");

/* clean possible doubled blank lines in media queries */
html = html.replace(/\n{3,}/g, "\n\n");

fs.writeFileSync(p, html);
console.log("hero rebuilt. size:", (html.length / 1024 / 1024).toFixed(2), "MB");
