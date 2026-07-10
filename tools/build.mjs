// TaroGrid docs builder — R1 preview edition.
// content/**/*.md (frontmatter + extended markdown) →
//   site/index.html    self-contained reader (double-clickable, hosts anywhere)
//   site/artifact.html same page without the document wrapper (for hosted preview)
//   site/articles.json the raw bundle (the future in-app help drawer feed)
//
// Owner rules enforced at build time (the build FAILS on violation):
//   1. Global-first: no Bangla script, no ৳ — anywhere.
//   2. No tables and no ASCII diagrams in rendered output — demonstrations are
//      animated scenes (tools/demos.mjs) or designed figures (tools/figures.mjs).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { marked } from "marked";
import { DEMOS } from "./demos.mjs";
import { FIGURES } from "./figures.mjs";
const yaml = createRequire(import.meta.url)("js-yaml");

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const chapters = JSON.parse(read("meta/chapters.json")).sort((a, b) => a.order - b.order);
const synonyms = JSON.parse(read("meta/synonyms.json"));

// Titles for articles referenced before they're written (later waves).
const FUTURE_TITLES = {
  "B-01": "Create and shape a board",
  "B-03": "Views — same data, different glasses",
  "B-11": "Undo, Trash & restore",
  "T-04": "The Access Center",
  "Q-07": "“I edited a cell and it changed back”",
  "S-15": "The life of an order",
  "S-16": "Confirm & dispatch",
  "S-17": "Connect a courier",
  "S-19": "Courier Cash — where your COD money is",
  "S-22": "Handling risky orders in real life",
  "M-04": "Publish & share an invoice",
  "M-08": "Get paid online: connect your payment gateway",
  "AU-05": "The Recipe Gallery",
  "AU-01": "Automations — hire a robot for the boring parts",
  "Q-02": "“My order didn’t appear”",
  "F-12": "Connect Boards — link rows across boards",
};

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CALLOUTS = {
  note: { icon: "\u{1F4AC}", label: "Note" },
  tip: { icon: "\u{1F4A1}", label: "Tip" },
  warning: { icon: "⚠️", label: "Warning" },
  why: { icon: "\u{1F9E0}", label: "Why" },
  example: { icon: "\u{1F6CD}️", label: "Example" },
  shortcut: { icon: "⌨️", label: "Shortcut" },
};

function renderBody(md, articleId) {
  const lines = md.split("\n");
  let html = "";
  let plain = [];
  let block = null;
  const flushPlain = () => {
    if (plain.length) {
      html += marked.parse(plain.join("\n"));
      plain = [];
    }
  };
  for (const line of lines) {
    const open = line.match(/^:::(\w+)(?:\s+(.*))?\s*$/);
    if (!block && open && open[1]) {
      flushPlain();
      block = { type: open[1], title: (open[2] || "").trim(), buf: [] };
    } else if (block && line.trim() === ":::") {
      html += renderBlock(block, articleId);
      block = null;
    } else if (block) {
      block.buf.push(line);
    } else {
      plain.push(line);
    }
  }
  flushPlain();
  return html;
}

function renderBlock(block, articleId) {
  if (block.type === "demo") {
    const [id, title, duration] = block.title.split(" · ").map((s) => s.trim().replace(/^"|"$/g, ""));
    const scenes = DEMOS[id];
    if (!scenes) throw new Error(`${articleId}: demo "${id}" has no entry in tools/demos.mjs`);
    const sceneHtml = scenes
      .map((s, i) => `<div class="scene${i === 0 ? " on" : ""}"><div class="scene-art">${s.art}</div><p class="cap">${esc(s.cap)}</p></div>`)
      .join("");
    const dots = scenes.map((_, i) => `<button class="demo-dot${i === 0 ? " on" : ""}" data-i="${i}" aria-label="Scene ${i + 1}"></button>`).join("");
    return `<figure class="demo">
      <figcaption><span class="demo-play">▶</span> <strong>${esc(title || "See it")}</strong>${duration ? ` <span class="demo-dur">${esc(duration)}</span>` : ""}</figcaption>
      <div class="demo-stage" data-demo="${esc(id)}">${sceneHtml}<div class="demo-dots">${dots}</div></div>
    </figure>`;
  }
  if (block.type === "figure") {
    const fig = FIGURES[block.title];
    if (!fig) throw new Error(`${articleId}: figure "${block.title}" has no entry in tools/figures.mjs`);
    return `<div class="fig">${fig}</div>`;
  }
  const inner = marked.parse(block.buf.join("\n"));
  if (block.type === "cards") {
    return `<div class="cards-grid">${inner
      .replace(/<ul>|<\/ul>/g, "")
      .replace(/<li>/g, '<div class="cardlet">')
      .replace(/<\/li>/g, "</div>")}</div>`;
  }
  const c = CALLOUTS[block.type] || CALLOUTS.note;
  return `<aside class="callout callout-${esc(block.type)}">
    <div class="callout-head">${c.icon} <strong>${block.title ? esc(block.title) : c.label}</strong></div>
    <div class="callout-body">${inner}</div>
  </aside>`;
}

// ---- load articles ----
const articles = [];
for (const ch of chapters) {
  const dir = path.join(ROOT, "content", ch.dir);
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
    if (!m) throw new Error(`No frontmatter: ${f}`);
    const meta = yaml.load(m[1]);
    const body = raw.slice(m[0].length);
    articles.push({ ...meta, chapterSlug: ch.slug, html: renderBody(body, meta.id), text: body.replace(/[#*>`\[\]|:-]/g, " ").replace(/\s+/g, " ") });
  }
}
const byId = Object.fromEntries(articles.map((a) => [a.id, a]));

// ---- owner-rule lint (build fails on violation) ----
const REGIONAL_WORDS = /\b(taka|meem|shanta|karigor|pathao|steadfast|redx|dhaka|mirpur|chattogram|bkash|khata|banglish|tk\.)\b/i;
for (const a of articles) {
  if (/<table/i.test(a.html)) throw new Error(`${a.id}: rendered table — owner rule: no tables; use :::cards or a figure`);
  if (/[ঀ-৿৳]/.test(a.html) || /[ঀ-৿৳]/.test(JSON.stringify(a))) throw new Error(`${a.id}: Bangla text or ৳ — owner rule: global-first docs`);
  const regional = a.html.match(REGIONAL_WORDS) || JSON.stringify(a.keywords || []).match(REGIONAL_WORDS);
  if (regional) throw new Error(`${a.id}: regional word "${regional[0]}" — owner rule: global-first docs (see CAST.md)`);
  if (/<pre class="diagram"/.test(a.html)) throw new Error(`${a.id}: ASCII diagram — owner rule: designed figures only`);
  for (const [k, v] of Object.entries(a.related || {})) {
    if (!byId[v] && !FUTURE_TITLES[v]) throw new Error(`${a.id} related.${k} → unknown id ${v}`);
  }
}
if (/[ঀ-৿৳]/.test(JSON.stringify(synonyms))) throw new Error("synonyms.json: Bangla — owner rule: global-first (localization postponed)");

const TIER_LABEL = { T1: "Understand", T2: "How-to", T3: "Reference", T4: "Fix" };
const STATUS = { live: "✅ Live", soon: "\u{1F51C} Coming soon", pro: "\u{1F4A0} Paid plan", beta: "\u{1F9EA} Limited" };

const appData = {
  chapters: chapters.map((c) => ({
    slug: c.slug,
    title: c.title,
    blurb: c.blurb,
    articles: articles.filter((a) => a.chapterSlug === c.slug).map((a) => a.id),
  })),
  articles: Object.fromEntries(
    articles.map((a) => [
      a.id,
      {
        id: a.id, title: a.title, promise: a.promise, tier: a.tier, tierLabel: TIER_LABEL[a.tier] || a.tier,
        status: a.status, statusLabel: STATUS[a.status] || a.status, chapter: a.chapterSlug,
        keywords: a.keywords || [], html: a.html, text: a.text.toLowerCase(),
        tourCaptions: (DEMOS[a.tour] || []).map((s) => s.cap),
      },
    ])
  ),
  synonyms,
};

const STYLE = `
:root{--canvas:#faf8ff;--card:#ffffff;--ink:#241b35;--muted:#6f6388;--primary:#6d4fc4;--primary-ink:#54389f;
--soft:#f0eafc;--border:#e5ddf3;--shadow:0 10px 30px rgba(66,42,130,.08);
--why:#f3edff;--why-b:#c9b6f2;--tip:#e8f6ec;--tip-b:#b7dfc3;--warn:#fdf1e4;--warn-b:#f0cf9e;
--note:#eef2f8;--note-b:#c9d6e8;--ex:#fdeef3;--ex-b:#f2c3d4;--sc:#eef0f2;--sc-b:#ccd2d8;}
[data-theme=dark]{--canvas:#151021;--card:#1e1730;--ink:#efeaf8;--muted:#a394c4;--primary:#a98ff2;--primary-ink:#c3b0f7;
--soft:#2a2142;--border:#332a4d;--shadow:0 10px 30px rgba(0,0,0,.35);
--why:#2a2145;--why-b:#4f3f80;--tip:#1c3226;--tip-b:#2e5c40;--warn:#3a2c17;--warn-b:#6e5527;
--note:#1f2735;--note-b:#35455e;--ex:#391f2b;--ex-b:#66364c;--sc:#242830;--sc-b:#3c434d;}
*{box-sizing:border-box;margin:0}
body{font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;
background:var(--canvas);color:var(--ink);-webkit-font-smoothing:antialiased}
a{color:var(--primary-ink);text-decoration:none}a:hover{text-decoration:underline}
.app{display:flex;min-height:100vh}
.side{width:290px;flex-shrink:0;border-right:1px solid var(--border);padding:20px 16px 40px;position:sticky;top:0;height:100vh;overflow-y:auto;background:var(--card)}
.brand{display:flex;align-items:center;gap:10px;padding:6px 8px 18px;cursor:pointer}
.brand-mark{width:34px;height:34px;border-radius:10px;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px}
.brand b{font-size:16px}.brand small{display:block;color:var(--muted);font-size:11.5px;font-weight:500}
.preview-chip{margin:0 8px 16px;display:inline-block;font-size:11px;font-weight:700;letter-spacing:.4px;color:var(--primary-ink);background:var(--soft);border:1px solid var(--border);border-radius:99px;padding:2px 10px}
.ch{margin-bottom:14px}
.ch-t{font-size:11.5px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:var(--muted);padding:8px 8px 4px}
.nav-a{display:block;padding:6px 8px;border-radius:8px;font-size:14px;color:var(--ink)}
.nav-a:hover{background:var(--soft);text-decoration:none}
.nav-a.on{background:var(--soft);color:var(--primary-ink);font-weight:600}
.nav-a .aid{color:var(--muted);font-size:11.5px;font-weight:600;margin-right:6px}
.main{flex:1;min-width:0}
.top{display:flex;gap:10px;align-items:center;padding:14px 22px;border-bottom:1px solid var(--border);position:sticky;top:0;background:var(--canvas);z-index:5}
.menu-btn{display:none}
.search{flex:1;max-width:520px;position:relative}
.search input{width:100%;padding:9px 14px;border-radius:10px;border:1px solid var(--border);background:var(--card);color:var(--ink);font-size:14px;outline:none}
.search input:focus{border-color:var(--primary)}
.hits{position:absolute;top:44px;left:0;right:0;background:var(--card);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow);overflow:hidden;max-height:60vh;overflow-y:auto}
.hit{display:block;padding:10px 14px;border-bottom:1px solid var(--border)}
.hit:last-child{border-bottom:0}.hit:hover{background:var(--soft);text-decoration:none}
.hit b{display:block;font-size:14px;color:var(--ink)}.hit span{font-size:12px;color:var(--muted)}
.theme-btn{border:1px solid var(--border);background:var(--card);color:var(--ink);border-radius:10px;padding:8px 12px;cursor:pointer;font-size:14px}
.page{max-width:720px;margin:0 auto;padding:36px 26px 90px}
h1,h2,h3{text-wrap:balance}
a:focus-visible,button:focus-visible,input:focus-visible{outline:2px solid var(--primary);outline-offset:2px;border-radius:6px}
.crumb{font-size:12.5px;font-weight:700;letter-spacing:.6px;text-transform:uppercase;color:var(--muted);margin-bottom:10px}
.chips{display:flex;gap:8px;margin:14px 0 6px;flex-wrap:wrap}
.chip{font-size:11.5px;font-weight:700;border-radius:99px;padding:3px 11px;background:var(--soft);color:var(--primary-ink);border:1px solid var(--border)}
h1{font-size:31px;line-height:1.25;letter-spacing:-.4px}
.promise{color:var(--muted);font-size:17px;margin-top:10px;font-style:italic}
article{margin-top:26px}
article h2{font-size:21px;margin:34px 0 12px;letter-spacing:-.2px}
article h3{font-size:16.5px;margin:24px 0 8px}
article p{margin:12px 0}article li{margin:6px 0}
article ul,article ol{padding-left:24px;margin:12px 0}
.code{background:var(--soft);border-radius:10px;padding:12px;overflow-x:auto;font:13px/1.5 ui-monospace,Menlo,monospace}
.callout{border:1px solid;border-radius:14px;padding:14px 16px;margin:18px 0}
.callout-head{font-size:14px;margin-bottom:4px}
.callout-body p{margin:6px 0}.callout-body{font-size:14.5px}
.callout-why{background:var(--why);border-color:var(--why-b)}
.callout-tip{background:var(--tip);border-color:var(--tip-b)}
.callout-warning{background:var(--warn);border-color:var(--warn-b)}
.callout-note{background:var(--note);border-color:var(--note-b)}
.callout-example{background:var(--ex);border-color:var(--ex-b)}
.callout-shortcut{background:var(--sc);border-color:var(--sc-b)}
/* ---- demo player ---- */
.demo{border:1.5px solid var(--primary);border-radius:16px;margin:22px 0;overflow:hidden;background:var(--card)}
.demo figcaption{background:var(--soft);padding:10px 16px;font-size:14px}
.demo-play{display:inline-flex;width:22px;height:22px;border-radius:99px;background:var(--primary);color:#fff;align-items:center;justify-content:center;font-size:10px;margin-right:6px;vertical-align:-5px}
.demo-dur{color:var(--muted);font-size:12px;margin-left:6px}
.demo-stage{position:relative;height:240px;background:linear-gradient(160deg,var(--soft),var(--card))}
.scene{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;opacity:0;transition:opacity .55s;padding:16px 14px 48px}
.scene.on{opacity:1}
.scene-art{display:flex;align-items:center;justify-content:center;width:100%}
.scene .cap{position:absolute;bottom:12px;left:0;right:0;text-align:center;font-size:13px;color:var(--muted);padding:0 16px}
.demo-dots{position:absolute;top:12px;right:14px;display:flex;gap:6px;z-index:2}
.demo-dot{width:8px;height:8px;border-radius:99px;background:var(--border);border:0;cursor:pointer;padding:0}
.demo-dot.on{background:var(--primary)}
.demo-stage.static{height:auto;background:none}
.static .scene{position:static;opacity:1;padding:14px;border-bottom:1px solid var(--border)}
.static .scene .cap{position:static;margin-top:10px}
.static .demo-dots{display:none}
/* ---- kit primitives ---- */
.k-split{display:flex;gap:14px;align-items:center;justify-content:center;flex-wrap:wrap}
.k-stack{position:relative;display:flex;align-items:center;justify-content:center;padding-top:26px}
.k-stack .over{position:absolute;z-index:2;top:34px}
.k-board{background:var(--card);border:1px solid var(--border);border-radius:10px;min-width:170px;box-shadow:var(--shadow)}
.k-bhead{border-bottom:1px solid var(--border);display:flex;align-items:center;padding:5px 9px;font-size:8.5px;font-weight:800;letter-spacing:.6px;color:var(--muted)}
.k-r{display:flex;gap:6px;align-items:center;padding:6px 9px;border-bottom:1px solid var(--border)}
.k-r:last-child{border-bottom:0}
.k-r.hl-row{background:var(--soft)}
.k-cell{height:8px;border-radius:4px;background:var(--border);flex:1;min-width:24px}
.k-cellv{font-size:10.5px;font-weight:700;color:var(--primary-ink);white-space:nowrap}
.k-hist{font-size:6px;color:var(--primary);letter-spacing:2px}
.k-gband{padding:3px 9px;font-size:8px;font-weight:800;letter-spacing:.6px;color:var(--primary-ink);background:var(--why);border-bottom:1px solid var(--border)}
.k-gband.g2{background:var(--tip)}
.k-gband.hl{outline:2px solid var(--primary);outline-offset:-2px}
.k-phone{width:112px;background:var(--card);border:2px solid var(--border);border-radius:16px;padding:12px 10px;box-shadow:var(--shadow)}
.k-line{height:9px;border-radius:4px;background:var(--soft);border:1px solid var(--border);margin:6px 0}
.k-btn{border-radius:8px;background:var(--primary);color:#fff;font-size:8.5px;display:flex;align-items:center;justify-content:center;font-weight:700;margin-top:9px;padding:5px 4px;text-align:center}
.k-win{background:var(--card);border:1px solid var(--border);border-radius:12px;box-shadow:var(--shadow);min-width:170px}
.k-whead{padding:7px 11px;border-bottom:1px solid var(--border);font-size:9.5px;font-weight:800;letter-spacing:.5px}
.k-wbody{padding:9px 11px;font-size:11px;display:flex;gap:6px;align-items:center;flex-wrap:wrap}
.k-chip{display:inline-flex;align-items:center;gap:4px;background:var(--card);border:1px solid var(--border);border-radius:99px;padding:4px 10px;font-size:11px;font-weight:600;box-shadow:var(--shadow)}
.k-chip.good{border-color:#69b789}
.k-chip.sm{padding:1px 6px;font-size:9px;box-shadow:none}
.k-chip.round{width:24px;height:24px;justify-content:center;padding:0;border-radius:99px}
.k-arrow{width:30px;height:2px;background:var(--primary);position:relative;opacity:.65;flex-shrink:0}
.k-arrow:after{content:"";position:absolute;right:-1px;top:-4px;border:5px solid transparent;border-left-color:var(--primary)}
.k-arrow2{font-size:18px;color:var(--primary);font-weight:700}
.k-updown{font-size:9.5px;font-weight:700;color:var(--primary-ink);text-align:center;line-height:1.7}
.k-zone{border:1.5px solid;border-radius:12px;padding:9px 12px;font-size:10px;min-width:78px;text-align:center;font-weight:800;letter-spacing:.4px}
.k-zone.money{border-color:var(--why-b);background:var(--why)}
.k-zone.people{border-color:var(--ex-b);background:var(--ex)}
.k-zone.work{border-color:var(--tip-b);background:var(--tip)}
.k-zone.outreach{border-color:var(--note-b);background:var(--note)}
.k-zone.big{padding:14px 18px;font-size:12px}
.k-zone.col{display:flex;flex-direction:column;gap:4px;flex:1;min-width:120px}
.k-mini{font-size:9px;font-weight:500;color:var(--muted);letter-spacing:0}
.k-frame{border:1.5px dashed var(--primary);border-radius:14px;padding:16px 14px 12px;position:relative}
.k-frame.sm{padding:14px 10px 8px}
.k-frame.dim{opacity:.45;border-color:var(--border)}
.k-flabel{position:absolute;top:-8px;left:12px;background:var(--canvas);padding:0 7px;font-size:8.5px;font-weight:800;letter-spacing:.6px;color:var(--primary-ink);white-space:nowrap}
.demo .k-flabel{background:var(--card)}
.k-base{margin-top:12px;text-align:center;font-size:10px;color:var(--muted);border-top:1px solid var(--border);padding-top:8px}
.k-wall{width:5px;align-self:stretch;border-radius:99px;background:var(--border)}
.k-task{display:flex;gap:8px;align-items:center;font-size:11px;padding:4px 0}
.k-box{width:15px;height:15px;border-radius:5px;border:1.5px solid var(--border);display:inline-flex;align-items:center;justify-content:center;font-size:9px;color:#fff;flex-shrink:0}
.k-box.done{background:var(--primary);border-color:var(--primary)}
.k-side{width:46px;background:var(--soft);border:1px solid var(--border);border-radius:10px;padding:8px 6px;display:flex;flex-direction:column;gap:6px;position:relative}
.k-side.tall{min-height:120px}
.k-si{height:8px;border-radius:4px;background:var(--border)}
.k-si.gone{opacity:0;outline:1px dashed var(--border);outline-offset:-1px}
.k-nb{width:20px;height:20px;border-radius:99px;background:var(--primary);color:#fff;font-size:11px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0}
.k-ask{background:var(--card);border:1px solid var(--border);border-radius:10px;padding:7px 14px;font-size:11px;font-weight:600;color:var(--muted);box-shadow:var(--shadow)}
.k-prod{width:88px;background:var(--card);border:1px solid var(--border);border-radius:12px;padding:8px 6px;text-align:center;box-shadow:var(--shadow)}
.k-prod .ph{font-size:22px;line-height:1.2}
.k-prod .nm{font-size:8.5px;font-weight:700;margin-top:2px}
.k-prod .pr{font-size:10px;color:var(--primary-ink);font-weight:800}
.k-strike{text-decoration:line-through;opacity:.5;margin-right:4px;font-weight:600}
.k-maprow{display:flex;align-items:center;gap:10px;margin:8px 0;font-size:12px;justify-content:center;flex-wrap:wrap}
.k-maplab{min-width:132px;text-align:right;font-weight:600}
.k-mapcol{background:var(--soft);border:1px solid var(--border);border-radius:8px;padding:3px 10px;font-size:10.5px;font-weight:700;color:var(--primary-ink);white-space:nowrap}
.k-light{width:13px;height:13px;border-radius:99px;display:inline-block;flex-shrink:0}
.k-light.g{background:#41a874}.k-light.y{background:#daa832}.k-light.r{background:#d95a58}
.k-count{display:inline-grid;font-weight:800;color:var(--primary-ink)}
.k-count span{grid-area:1/1}
.k-count .b{opacity:0}
.on .k-count .a{animation:kfade .4s 1s both}
.on .k-count .b{animation:kshow .4s 1s both}
@keyframes kfade{to{opacity:0}}
@keyframes kshow{to{opacity:1}}
.k-ledger{width:150px;background:var(--card);border:1px solid var(--border);border-radius:4px 12px 12px 4px;border-left:6px solid var(--primary);padding:14px 12px;box-shadow:var(--shadow)}
.k-lline{height:8px;border-radius:4px;background:var(--soft);border:1px solid var(--border);margin:8px 0}
.k-legend{font-size:11.5px;display:flex;flex-direction:column;gap:7px;min-width:180px}
.k-dot{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:7px;vertical-align:-1px}
.k-dot.b1{background:var(--primary)}.k-dot.b2{background:var(--why-b)}.k-dot.b3{background:var(--ex-b)}.k-dot.b4{background:var(--tip-b)}
.k-appmock{display:flex;gap:12px;align-items:stretch}
.k-appmain{flex:1;display:flex;flex-direction:column;gap:10px;position:relative}
.k-appmain .k-nb{position:absolute}
.k-appmain .pin2{top:8px;right:8px}.k-appmain .pin3{top:74px;right:34px}
.k-side .pin{position:absolute;bottom:-8px;left:13px}
.k-win.over.sm{position:relative;margin:-18px 20px 0 40px;z-index:2}
.k-askrow{display:flex;gap:8px;align-items:center;margin-top:6px}
.k-map{display:flex;flex-direction:column;gap:14px}
.k-mapnotes{text-align:center}
.k-tag{font-size:9px;font-weight:800;letter-spacing:.6px;color:var(--muted);margin-bottom:6px;text-align:center}
.k-col{display:flex;flex-direction:column;align-items:center}
.k-col.mid{padding:0 4px}
.k-minirows{margin-top:4px}
.fig-gap{gap:20px}
/* scene entrance animations */
.on .pop{animation:popIn .7s .45s both}
.on .d2{animation-delay:1.1s}
.on .d3{animation-delay:1.7s}
@keyframes popIn{0%{transform:scale(.55);opacity:0}60%{transform:scale(1.07)}100%{transform:scale(1);opacity:1}}
.on .shake{animation:kshake .5s .6s}
@keyframes kshake{25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
.on .lift{animation:klift 1.4s .5s both}
@keyframes klift{to{transform:translateY(-30px) rotate(-2deg)}}
/* figures & cards */
.fig{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px 16px;margin:20px 0;overflow-x:auto}
.fig .k-board,.fig .k-win,.fig .k-chip{box-shadow:none}
.fig .k-flabel{background:var(--card)}
.figcap{font-size:12.5px;color:var(--muted);text-align:center;margin:12px 0 0}
.cards-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(215px,1fr));gap:12px;margin:16px 0}
.cardlet{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:13px 15px;font-size:14px;line-height:1.55}
.cardlet>strong:first-child{display:block;margin-bottom:4px;color:var(--primary-ink)}
/* home */
.home-hero{padding:14px 0 8px}
.home-hero h1{font-size:36px}
.mission{font-size:17px;color:var(--muted);margin:14px 0 8px;max-width:640px}
.cards{display:grid;grid-template-columns:1fr;gap:16px;margin-top:26px}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:20px;box-shadow:var(--shadow)}
.card h2{font-size:19px;margin:0 0 2px}
.card .blurb{color:var(--muted);font-size:14px;margin-bottom:12px}
.card a.item{display:flex;gap:10px;align-items:baseline;padding:7px 8px;border-radius:8px;font-size:14.5px}
.card a.item:hover{background:var(--soft);text-decoration:none}
.card .aid{color:var(--muted);font-size:12px;font-weight:700;min-width:38px}
.card .tier{margin-left:auto;font-size:11px;color:var(--muted);white-space:nowrap}
footer.pagefoot{margin-top:56px;padding-top:18px;border-top:1px solid var(--border);color:var(--muted);font-size:13px}
@media(prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
@media(max-width:860px){
.side{position:fixed;left:0;top:0;bottom:0;z-index:20;transform:translateX(-105%);transition:transform .2s;box-shadow:var(--shadow)}
.side.open{transform:none}
.menu-btn{display:block;border:1px solid var(--border);background:var(--card);color:var(--ink);border-radius:10px;padding:8px 12px;cursor:pointer}
.page{padding:26px 18px 70px}h1{font-size:26px}.home-hero h1{font-size:29px}
.demo-stage{height:260px}}
`;

const APP_JS = `
const DATA = __DATA__;
const $ = (s) => document.querySelector(s);
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const savedTheme = localStorage.getItem("tg-docs-theme");
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
else if (matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.dataset.theme = "dark";

function chipRow(a){return '<div class="chips"><span class="chip">'+a.statusLabel+'</span><span class="chip">'+a.tierLabel+'</span><span class="chip">'+a.id+'</span></div>';}

function renderHome(){
  const cards = DATA.chapters.map(ch => {
    const items = ch.articles.map(id => { const a = DATA.articles[id];
      return '<a class="item" href="#/'+id+'"><span class="aid">'+id+'</span><span>'+a.title+'</span><span class="tier">'+a.tierLabel+'</span></a>';
    }).join("");
    return '<div class="card"><h2>'+ch.title+'</h2><div class="blurb">'+ch.blurb+'</div>'+items+'</div>';
  }).join("");
  $("#page").innerHTML = '<div class="home-hero"><h1>TaroGrid Help Center</h1>'+
   '<p class="mission">Learn every feature, understand why it works the way it does, and run your whole business with confidence — even if this is your first business software.</p></div>'+
   '<div class="cards">'+cards+'</div>'+
   '<footer class="pagefoot">Preview — 4 of 19 chapters (~132 planned articles). Chapters 2–4 arrive in the next waves.</footer>';
  document.title = "TaroGrid Help Center — R1 Preview";
}

function renderArticle(id){
  const a = DATA.articles[id];
  if(!a) return renderHome();
  const ch = DATA.chapters.find(c => c.slug === a.chapter);
  $("#page").innerHTML = '<div class="crumb"><a href="#">Help Center</a> › '+ch.title+'</div>'+
    '<h1>'+a.title+'</h1><p class="promise">'+a.promise+'</p>'+chipRow(a)+
    '<article>'+a.html+'</article>'+
    '<footer class="pagefoot">Preview build. In-app interactive tours and real screenshots arrive with their rounds — every animation above is that tour’s script, already moving.</footer>';
  document.title = a.title + " · TaroGrid Help";
  window.scrollTo(0,0);
  initDemos();
}

function initDemos(){
  document.querySelectorAll(".demo-stage").forEach(stage => {
    const scenes = [...stage.querySelectorAll(".scene")];
    const dots = [...stage.querySelectorAll(".demo-dot")];
    if (REDUCED || scenes.length < 2) { stage.classList.add("static"); scenes.forEach(s=>s.classList.add("on")); return; }
    let i = 0, paused = false;
    const show = (n) => { i = n % scenes.length;
      scenes.forEach((s,k)=>s.classList.toggle("on",k===i));
      dots.forEach((d,k)=>d.classList.toggle("on",k===i)); };
    dots.forEach(d => d.addEventListener("click", () => { show(+d.dataset.i); paused = true; setTimeout(()=>paused=false, 8000); }));
    stage.addEventListener("mouseenter", ()=>paused=true);
    stage.addEventListener("mouseleave", ()=>paused=false);
    stage._timer && clearInterval(stage._timer);
    stage._timer = setInterval(()=>{ if(!paused && document.contains(stage)) show(i+1); }, 3600);
  });
}

function renderNav(current){
  $("#nav").innerHTML = DATA.chapters.map(ch =>
    '<div class="ch"><div class="ch-t">'+ch.title+'</div>'+
    ch.articles.map(id => '<a class="nav-a'+(id===current?" on":"")+'" href="#/'+id+'"><span class="aid">'+id+'</span>'+DATA.articles[id].title.split(" — ")[0]+'</a>').join("")+
    '</div>').join("");
}

function route(){
  const h = location.hash.replace(/^#\\/?/, "");
  renderNav(h || null);
  h ? renderArticle(h) : renderHome();
  $("#side").classList.remove("open");
  $("#hits").style.display = "none";
}

const SYN = {};
for (const [k, vals] of Object.entries(DATA.synonyms)) {
  const all = [k, ...vals.map(v=>v.toLowerCase())];
  for (const t of all) SYN[t] = all;
}
function expand(q){
  const terms = q.toLowerCase().split(/\\s+/).filter(Boolean);
  const extra = new Set();
  for (const t of terms) { for (const [key, group] of Object.entries(SYN)) { if (key.includes(t) || t.includes(key)) group.forEach(g => { if (!terms.includes(g)) extra.add(g); }); } }
  return { terms, extra: [...extra] };
}
function search(q){
  const phrase = q.trim().toLowerCase();
  if(!phrase) return [];
  const { terms, extra } = expand(phrase);
  const results = Object.values(DATA.articles).map(a => {
    const title = a.title.toLowerCase(), promise = a.promise.toLowerCase();
    const kws = a.keywords.map(k => String(k).toLowerCase());
    let score = 0;
    // The user's exact phrase is the strongest signal.
    if (title.includes(phrase)) score += 30;
    if (kws.some(k => k.includes(phrase))) score += 22;
    // Their own words beat synonym expansions.
    for (const t of terms){
      if (title.includes(t)) score += 12;
      if (kws.some(k => k.includes(t))) score += 9;
      if (promise.includes(t)) score += 3;
      if (a.text.includes(t)) score += 2;
    }
    for (const t of extra){
      if (title.includes(t)) score += 4;
      if (kws.some(k => k.includes(t))) score += 3;
      if (a.text.includes(t)) score += 1;
    }
    return {a, score};
  }).filter(r => r.score > 0).sort((x,y) => y.score - x.score).slice(0,7);
  if (!results.length) logMiss(phrase);
  return results;
}
// Honest miss log: stored on this device, reviewed when a collection endpoint
// exists — misses teach us what to write next.
function logMiss(q){
  try {
    const log = JSON.parse(localStorage.getItem("tg-docs-miss") || "[]");
    if (log[log.length-1] && q.startsWith(log[log.length-1])) log.pop(); // keep final form of a growing query
    log.push(q); localStorage.setItem("tg-docs-miss", JSON.stringify(log.slice(-200)));
  } catch {}
}
$("#q").addEventListener("input", e => {
  const rs = search(e.target.value);
  const box = $("#hits");
  if(!rs.length){ box.style.display = e.target.value.trim() ? "block" : "none";
    box.innerHTML = e.target.value.trim() ? '<div class="hit"><b>No match yet</b><span>Try another word — or browse the chapters. (On the public site, misses like this teach us what to write next.)</span></div>' : "";
    return; }
  box.innerHTML = rs.map(r => '<a class="hit" href="#/'+r.a.id+'"><b>'+r.a.title+'</b><span>'+r.a.id+' · '+r.a.tierLabel+'</span></a>').join("");
  box.style.display = "block";
});
document.addEventListener("click", e => { if(!e.target.closest(".search")) $("#hits").style.display = "none"; });

$("#theme").addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next; localStorage.setItem("tg-docs-theme", next);
});
$("#menu").addEventListener("click", () => $("#side").classList.toggle("open"));
window.addEventListener("hashchange", route);
route();
`;

const bodyHtml = `
<div class="app">
  <nav class="side" id="side">
    <div class="brand" onclick="location.hash=''">
      <div class="brand-mark">T</div>
      <div><b>TaroGrid Help</b><small>Learn it. Run it. Trust it.</small></div>
    </div>
    <span class="preview-chip">PREVIEW · 71 of ~132 articles</span>
    <div id="nav"></div>
  </nav>
  <div class="main">
    <div class="top">
      <button class="menu-btn" id="menu">☰</button>
      <div class="search"><input id="q" type="search" placeholder="Search — try “courier”, “locked”, or “orders”…" autocomplete="off">
        <div class="hits" id="hits" style="display:none"></div></div>
      <button class="theme-btn" id="theme" title="Light / dark">◐</button>
    </div>
    <div class="page" id="page"></div>
  </div>
</div>
<script>${APP_JS.replace("__DATA__", JSON.stringify(appData).replace(/</g, "\\u003c"))}<\/script>`;

const standalone = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>TaroGrid Help Center — R1 Preview</title><style>${STYLE}</style></head>
<body>${bodyHtml}</body></html>`;

const artifact = `<title>TaroGrid Help Center — R1 Preview</title>
<style>${STYLE}</style>
${bodyHtml}`;

fs.mkdirSync(path.join(ROOT, "site"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "site/index.html"), standalone);
fs.writeFileSync(path.join(ROOT, "site/artifact.html"), artifact);
fs.writeFileSync(path.join(ROOT, "site/articles.json"), JSON.stringify(appData, null, 1));
console.log(`Built ${articles.length} articles → site/ (index.html ${(standalone.length / 1024).toFixed(0)} KB) — owner-rule lints passed`);
