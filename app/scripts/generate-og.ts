// Renders the 1200×630 Open Graph cards into assets/og/ with headless Chrome (macOS: uses sips for JPEG).
// Run after changing titles, stats or articles: `npm run og`
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { mediaItems } from "../content/media.js";
import { VISITED_COUNTRIES } from "../content/travel.js";
import { journey } from "../content/journey.js";
import { spokenLanguages } from "../content/spokenLanguages.js";
import { placeRecommendations } from "../content/recommendations.js";
import { archiveProjects } from "../content/archive.js";
import { generatePhotoGroups } from "../utils/photography.js";
import { CEFR_STEPS, cefrStepsReached } from "../utils/cefr.js";

const ROOT = resolve(import.meta.dirname, "..");
const OUT = join(ROOT, "assets/og");
const CHROME = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
// A still frame of the profile video; pass PORTRAIT=/path.jpg to override
const PORTRAIT = process.env.PORTRAIT ?? join(ROOT, "assets/ashton_profile_still.jpg");

const C = { paper: "#f2f0ea", ink: "#121212", coral: "#e9573f", sun: "#f5c542", sage: "#7d8b74", sky: "#6f9fd8" };
const SWATCH: Record<string, string> = { English: C.ink, Spanish: C.coral, Italian: C.sage, French: C.sun, German: C.sky };

const file = (p: string) => pathToFileURL(p).href;
const photo = (src: string) => file(join(ROOT, "public", src));
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const albums = generatePhotoGroups();
const album = (id: string) => albums.find((a) => a.id === id)?.thumbnail ?? albums[0].thumbnail;

function page(body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0}
html,body{width:1200px;height:630px;overflow:hidden}
body{background:${C.paper};font-family:"Space Grotesk",sans-serif;color:${C.ink};padding:28px;display:grid;gap:14px}
.t{border-radius:34px;padding:34px;position:relative;overflow:hidden}
.ink{background:${C.ink};color:${C.paper}}.coral{background:${C.coral};color:#fff}.sun{background:${C.sun}}.sage{background:${C.sage};color:#fff}.white{background:#fff}
.lbl{font-size:15px;letter-spacing:.16em;text-transform:uppercase;opacity:.65;font-weight:500}
.big{font-weight:500;letter-spacing:-.035em;line-height:.9}
.img{background-size:cover;background-position:center;padding:0}
.brand{position:absolute;display:flex;align-items:center;gap:12px;font-size:20px;font-weight:500}
.mark{width:42px;height:42px;border-radius:50%;display:grid;place-items:center;font-size:16px;background:${C.ink};color:${C.paper}}
.ink .mark{background:${C.paper};color:${C.ink}}
.pill{display:inline-block;border-radius:99px;padding:8px 16px;font-size:18px;margin:0 8px 8px 0}
</style></head><body>${body}</body></html>`;
}

const brand = (pos = "left:34px;bottom:30px") =>
  `<div class="brand" style="${pos}"><div class="mark">AS</div>ashtonspina.com</div>`;

const cards: Record<string, string> = {
  home: page(`
<div style="display:grid;grid-template-columns:1.55fr 1fr 0.8fr;grid-template-rows:1fr 1fr;gap:14px;height:574px">
  <div class="t ink" style="grid-row:span 2;display:flex;flex-direction:column;justify-content:center">
    <div class="lbl">Engineering leader · Builder · Traveller</div>
    <div class="big" style="font-size:138px;margin-top:22px">Ashton<br>Spina</div>
    <div style="font-size:24px;opacity:.75;margin-top:24px;max-width:520px">Building marketplaces and products from Helsinki.</div>
    ${brand()}
  </div>
  <div class="t img" style="grid-row:span 2;background-image:url('${file(PORTRAIT)}')"></div>
  <div class="t coral" style="display:flex;flex-direction:column;justify-content:space-between"><div class="lbl">Countries</div><div class="big" style="font-size:96px">${VISITED_COUNTRIES.length}</div></div>
  <div class="t sun" style="display:flex;flex-direction:column;justify-content:space-between"><div class="lbl">Languages</div><div class="big" style="font-size:72px">${spokenLanguages.length}</div></div>
</div>`),

  work: page(`
<div style="display:grid;grid-template-columns:1.5fr 0.85fr 0.9fr;grid-template-rows:1.15fr 1fr;gap:14px;height:574px">
  <div class="t ink" style="grid-row:span 2;display:flex;flex-direction:column;justify-content:space-between">
    <div class="lbl">Marketplace engineering consulting</div>
    <div class="big" style="font-size:66px;line-height:.98">Scale the team.<br>Merge the platform.<br><span style="color:${C.coral}">Grow B2B revenue.</span></div>
    <div style="display:flex;align-items:center;gap:12px;font-size:20px;font-weight:500"><div class="mark">AS</div><span>Ashton Spina <span style="opacity:.6">· Fractional Head of Engineering</span></span></div>
  </div>
  <div class="t img" style="background-image:url('${file(PORTRAIT)}')"></div>
  <div class="t sun" style="display:flex;flex-direction:column;justify-content:space-between"><div class="lbl">SMG Real Estate B2B</div><div><div class="big" style="font-size:88px">~40%</div><div style="font-size:17px;margin-top:8px">of group revenue, from the line I led engineering for</div></div></div>
  <div class="t sage" style="grid-column:span 2;display:flex;flex-direction:column;justify-content:space-between"><div class="lbl">Merger and acquisition</div><div class="big" style="font-size:38px;line-height:1.08">homegate.ch + immoscout24.ch<br>→ SMG Real Estate + flatfox</div></div>
</div>`),

  travel: page(`
<div style="display:grid;grid-template-columns:1.6fr 1fr;grid-template-rows:1fr 1fr;gap:14px;height:574px">
  <div class="t img" style="grid-row:span 2;background-image:linear-gradient(to top,rgba(0,0,0,.72),rgba(0,0,0,.05) 60%),url('${photo(album("vietnam"))}');color:#fff;display:flex;flex-direction:column;justify-content:flex-end;padding:40px">
    <div class="lbl">Travel and photography</div>
    <div class="big" style="font-size:104px;margin-top:12px;white-space:nowrap">${VISITED_COUNTRIES.length} countries</div>
    <div style="font-size:24px;opacity:.85;margin-top:14px">${albums.length} photo albums · ${journey.length} places called home</div>
  </div>
  <div class="t img" style="background-image:url('${photo(album("greece"))}')"></div>
  <div class="t img" style="background-image:url('${photo(album("croatia"))}')">${brand("left:24px;bottom:22px;color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.6)")}</div>
</div>`),

  languages: page(`
<div style="display:grid;grid-template-columns:1fr 1.15fr;gap:14px;height:574px">
  <div class="t ink" style="display:flex;flex-direction:column;justify-content:center">
    <div class="lbl">Languages</div>
    <div class="big" style="font-size:80px;margin-top:20px">${spokenLanguages.length} languages,<br><span style="color:${C.coral}">one at a time.</span></div>
    ${brand()}
  </div>
  <div class="t white" style="display:flex;flex-direction:column;justify-content:center;gap:22px">
    ${spokenLanguages
      .map((l) => {
        const reached = cefrStepsReached(l.level);
        const bars = CEFR_STEPS.map((_, i) => `<span style="height:10px;border-radius:9px;background:${i < reached ? SWATCH[l.name] : "rgba(0,0,0,.08)"}"></span>`).join("");
        return `<div><div style="display:flex;justify-content:space-between;align-items:baseline"><span style="font-size:34px;font-weight:500">${esc(l.native)}</span><span style="font-size:18px;opacity:.6">${l.level}</span></div><div style="display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-top:10px">${bars}</div></div>`;
      })
      .join("")}
  </div>
</div>`),

  writing: page(`
<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;height:574px">
  <div class="t ink" style="display:flex;flex-direction:column;justify-content:center"><div class="lbl">Writing</div><div class="big" style="font-size:92px;margin-top:20px">Notes on<br>cities and<br>building.</div>${brand()}</div>
  <div class="t sun" style="display:flex;flex-direction:column;justify-content:flex-end">
    <div class="lbl">Latest</div>
    <div class="big" style="font-size:64px;margin-top:16px;line-height:1">${esc(mediaItems[0].title)}</div>
    <div style="font-size:21px;margin-top:18px;opacity:.75">${esc(mediaItems[0].excerpt)}</div>
  </div>
</div>`),

  archive: page(`
<div style="display:grid;grid-template-columns:1fr 1.1fr;gap:14px;height:574px">
  <div class="t ink" style="display:flex;flex-direction:column;justify-content:center"><div class="lbl">Archive</div><div class="big" style="font-size:108px;margin-top:20px">Built and<br>led since<br>2017.</div>${brand()}</div>
  <div class="t white" style="display:flex;flex-direction:column;justify-content:center;gap:4px">
    ${archiveProjects
      .slice(0, 8)
      .map((p) => `<div style="display:flex;justify-content:space-between;gap:16px;border-top:1px solid rgba(0,0,0,.08);padding:11px 0"><span style="font-size:22px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.name)}</span><span style="font-size:17px;opacity:.55">${p.year}</span></div>`)
      .join("")}
  </div>
</div>`),

  places: page(`
<div style="display:grid;grid-template-columns:0.9fr ${placeRecommendations.map(() => "1fr").join(" ")};gap:14px;height:574px">
  <div class="t ink" style="display:flex;flex-direction:column;justify-content:center">
    <div class="lbl">Places</div>
    <div class="big" style="font-size:92px;margin-top:20px">Worth<br>the trip.</div>
    <div style="font-size:22px;opacity:.75;margin-top:22px">${placeRecommendations.map((p) => esc(p.title)).join(" · ")}</div>
    ${brand()}
  </div>
  ${placeRecommendations
    .map(
      // Album covers show the country, not necessarily the exact place, so caption them by country
      (p) => `<div class="t img" style="background-image:linear-gradient(to top,rgba(0,0,0,.7),transparent 55%),url('${photo(album(p.country.toLowerCase()))}');color:#fff;display:flex;flex-direction:column;justify-content:flex-end;padding:30px"><div class="lbl">From my album</div><div class="big" style="font-size:56px;margin-top:8px">${esc(p.country)}</div></div>`,
    )
    .join("")}
</div>`),
};

for (const article of mediaItems.filter((m) => m.category === "article")) {
  cards[`article-${article.id}`] = page(`
<div class="t ink" style="height:574px;display:flex;flex-direction:column;justify-content:center;padding:56px">
  <div class="lbl">Writing · ${esc(article.readTime)}</div>
  <div class="big" style="font-size:104px;margin-top:24px;max-width:1000px">${esc(article.title)}</div>
  <div style="font-size:26px;opacity:.72;margin-top:28px;max-width:860px;line-height:1.35">${esc(article.excerpt)}</div>
  ${brand("left:56px;bottom:44px")}
  <div style="position:absolute;right:-60px;top:-60px;width:300px;height:300px;border-radius:80px;background:${C.coral};transform:rotate(18deg)"></div>
</div>`);
}

if (!existsSync(PORTRAIT)) throw new Error(`Portrait still not found at ${PORTRAIT}`);
mkdirSync(OUT, { recursive: true });
const work = mkdtempSync(join(tmpdir(), "og-"));

for (const [name, html] of Object.entries(cards)) {
  const htmlPath = join(work, `${name}.html`);
  writeFileSync(htmlPath, html);
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--allow-file-access-from-files",
    "--window-size=1200,630",
    "--virtual-time-budget=6000",
    `--screenshot=${join(work, `${name}.png`)}`,
    file(htmlPath),
  ], { stdio: "ignore" });
  // JPEG keeps photo-heavy cards well under social platforms' size limits
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "86", join(work, `${name}.png`), "--out", join(OUT, `${name}.jpg`)], { stdio: "ignore" });
  console.log(`✓ assets/og/${name}.jpg`);
}

rmSync(work, { recursive: true, force: true });
