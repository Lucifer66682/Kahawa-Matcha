const fs = require("fs");
const p = __dirname + "/index.html";
let html = fs.readFileSync(p, "utf8");

/* 1. replace the three hero-can images (document order: matcha, espresso, citrus) */
const dataUris = [...html.matchAll(/data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g)].map((m) => m[0]);
if (dataUris.length < 3) throw new Error("expected >=3 embedded hero images, found " + dataUris.length);

// match each uri to its surrounding figure to be safe
const figRe = /<figure class="hero-can" data-step="(\d)"><img src="data:image\/jpeg;base64,[A-Za-z0-9+/=]+" alt="([^"]*)" \/><\/figure>/g;
const replacements = {
  0: { src: "assets/drink-matcha.png", alt: "Iced matcha latte in a tall glass" },
  1: { src: "assets/drink-espresso.png", alt: "Iced espresso with milk swirls" },
  2: { src: "assets/drink-citrus.png", alt: "Iced citrus spritz in a tall glass" },
};
let count = 0;
html = html.replace(figRe, (m, step, alt) => {
  const r = replacements[step];
  if (!r) return m;
  count++;
  return `<figure class="hero-can" data-step="${step}"><img src="${r.src}" alt="${r.alt}" /></figure>`;
});
if (count !== 3) throw new Error("replaced " + count + " figures, expected 3");

/* 2. remove the clip-path svg (no longer needed, PNGs are cutouts) */
html = html.replace(/<svg width="0" height="0" style="position:absolute"[^>]*><defs><clipPath id="glassClip"[^<]*<\/clipPath><\/defs><\/svg>\s*\n?\s*/, "");

/* 3. CSS: glass styling for transparent cutouts */
html = html.replace(
  `.hero-can {
  grid-area: 1 / 1;
  width: min(42vw, 360px);
  aspect-ratio: 3 / 4.3;
  margin: 0;
  clip-path: url(#glassClip);
  filter: drop-shadow(0 44px 44px rgba(0, 0, 0, 0.55));
  opacity: 0;
}`,
  `.hero-can {
  grid-area: 1 / 1;
  width: min(46vw, 400px);
  aspect-ratio: 1 / 1;
  margin: 0;
  filter: drop-shadow(0 40px 34px rgba(0, 0, 0, 0.45));
  opacity: 0;
}`
);

html = html.replace(
  `.hero-can img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}`,
  `.hero-can img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}`
);

/* 4. third drink: citrus copy */
html = html.replace('<span class="bigword" data-step="2">VELVET</span>', '<span class="bigword" data-step="2">CITRUS</span>');

html = html.replace(
  `<p class="hero-kicker">Latte &middot; Velvet Pour</p>
            <p class="hero-price">$5.50</p>
            <p class="hero-lede">Espresso folded into steamed cream and finished with a dusting of caramel. Soft as the name.</p>`,
  `<p class="hero-kicker">Citrus &middot; Cold Pressed</p>
            <p class="hero-price">$5.20</p>
            <p class="hero-lede">Cold-pressed orange over hand-cut ice with a whisper of rosemary. Bright as mid-morning.</p>`
);

/* 5. amber theme for the citrus world */
html = html.replace(
  `{ bg: "#2e2113", accent: "#c9a86a", word: "#f5eee1", soft: "rgba(245,238,225,0.66)" },`,
  `{ bg: "#3a2405", accent: "#f0a13c", word: "#fdf3df", soft: "rgba(253,243,223,0.66)" },`
);

fs.writeFileSync(p, html);
console.log("glasses swapped. size:", (html.length / 1024 / 1024).toFixed(2), "MB");
