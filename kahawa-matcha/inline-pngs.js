const fs = require("fs");
let html = fs.readFileSync(__dirname + "/index.html", "utf8");

const alts = {
  "drink-matcha": "Iced matcha latte in a tall glass",
  "drink-espresso": "Iced espresso with milk swirls",
  "drink-citrus": "Iced citrus spritz in a tall glass",
};

for (const [file, alt] of Object.entries(alts)) {
  const newUri = "data:image/png;base64," + fs.readFileSync(__dirname + "/assets/" + file + ".png").toString("base64");
  // find the <img> whose alt matches exactly, replace only its src
  const re = new RegExp('(<img src=")data:image/png;base64,[A-Za-z0-9+/=]+(" alt="' + alt + '")');
  if (!re.test(html)) {
    console.log("NOT FOUND for", file);
    process.exit(1);
  }
  html = html.replace(re, "$1" + newUri + "$2");
  console.log(file, "swapped");
}

fs.writeFileSync(__dirname + "/index.html", html);
console.log("done. size:", (html.length / 1024 / 1024).toFixed(2), "MB");
