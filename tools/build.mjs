// TaroGrid docs builder — R1 preview edition.
// content/**/*.md (frontmatter + extended markdown) →
//   site/index.html    self-contained reader (double-clickable, hosts anywhere)
//   site/artifact.html same page without the document wrapper (for hosted preview)
//   site/articles.json the raw bundle (the future in-app help drawer feed)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { marked } from "marked";
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
};

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

marked.use({
  renderer: {
    code(tokenOrText, maybeLang) {
      const text = typeof tokenOrText === "object" ? tokenOrText.text : tokenOrText;
      const lang = typeof tokenOrText === "object" ? tokenOrText.lang : maybeLang;
      if (lang === "diagram") return `<pre class="diagram">${esc(text)}</pre>`;
      return `<pre class="code">${esc(text)}</pre>`;
    },
  },
});

const CALLOUTS = {
  note: { icon: "\u{1F4AC}", label: "Note" },
  tip: { icon: "\u{1F4A1}", label: "Tip" },
  warning: { icon: "⚠️", label: "Warning" },
  why: { icon: "\u{1F9E0}", label: "Why" },
  example: { icon: "\u{1F6CD}️", label: "Example" },
  shortcut: { icon: "⌨️", label: "Shortcut" },
};

function renderBody(md) {
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
      html += renderBlock(block);
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

function renderBlock(block) {
  const inner = marked.parse(block.buf.join("\n"));
  if (block.type === "demo") {
    const [id, title, duration] = block.title.split(" · ").map((s) => s.trim().replace(/^"|"$/g, ""));
    return `<figure class="demo">
      <figcaption><span class="demo-play">▶</span> <strong>See it</strong> — ${esc(title || id)}${duration ? ` <span class="demo-dur">${esc(duration)}</span>` : ""}</figcaption>
      <div class="demo-scenes">${inner}</div>
      <p class="demo-note">This storyboard becomes an interactive in-app tour when the tour player ships — same script, animated.</p>
    </figure>`;
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
    articles.push({ ...meta, chapterSlug: ch.slug, html: renderBody(body), text: body.replace(/[#*>`\[\]|:-]/g, " ").replace(/\s+/g, " ") });
  }
}
const byId = Object.fromEntries(articles.map((a) => [a.id, a]));

// Frontmatter sanity: related targets must be written or known-future.
for (const a of articles) {
  for (const [k, v] of Object.entries(a.related || {})) {
    if (!byId[v] && !FUTURE_TITLES[v]) throw new Error(`${a.id} related.${k} → unknown id ${v}`);
  }
}

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
body{font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Noto Sans Bengali",sans-serif;
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
@media(prefers-reduced-motion:reduce){*{transition:none!important}}
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
article table{border-collapse:collapse;width:100%;margin:16px 0;font-size:14.5px;display:block;overflow-x:auto}
article th,article td{border:1px solid var(--border);padding:8px 12px;text-align:left;vertical-align:top}
article th{background:var(--soft);font-size:13px}
.diagram{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;overflow-x:auto;font:12.5px/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;margin:16px 0;color:var(--ink)}
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
.demo{border:1.5px solid var(--primary);border-radius:16px;margin:22px 0;overflow:hidden;background:var(--card)}
.demo figcaption{background:var(--soft);padding:10px 16px;font-size:14px}
.demo-play{display:inline-flex;width:22px;height:22px;border-radius:99px;background:var(--primary);color:#fff;align-items:center;justify-content:center;font-size:10px;margin-right:6px;vertical-align:-5px}
.demo-dur{color:var(--muted);font-size:12px;margin-left:6px}
.demo-scenes{padding:6px 18px}.demo-scenes ol{margin:10px 0}.demo-scenes li{margin:8px 0;font-size:14.5px}
.demo-note{padding:0 16px 12px;font-size:12px;color:var(--muted);margin:0}
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
@media(max-width:860px){
.side{position:fixed;left:0;top:0;bottom:0;z-index:20;transform:translateX(-105%);transition:transform .2s;box-shadow:var(--shadow)}
.side.open{transform:none}
.menu-btn{display:block;border:1px solid var(--border);background:var(--card);color:var(--ink);border-radius:10px;padding:8px 12px;cursor:pointer}
.page{padding:26px 18px 70px}h1{font-size:26px}.home-hero h1{font-size:29px}}
`;

const APP_JS = `
const DATA = __DATA__;
const $ = (s) => document.querySelector(s);
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
   '<footer class="pagefoot">R1 preview — the first two chapters of ~132 planned articles. বাংলা edition arrives with the translation wave.</footer>';
  document.title = "TaroGrid Help Center — R1 Preview";
}

function renderArticle(id){
  const a = DATA.articles[id];
  if(!a) return renderHome();
  const ch = DATA.chapters.find(c => c.slug === a.chapter);
  $("#page").innerHTML = '<div class="crumb"><a href="#">Help Center</a> › '+ch.title+'</div>'+
    '<h1>'+a.title+'</h1><p class="promise">'+a.promise+'</p>'+chipRow(a)+
    '<article>'+a.html+'</article>'+
    '<footer class="pagefoot">Every screenshot and tour for this article runs on the Meem’s Closet demo data — arriving in a later round. Spot something that doesn’t match the app? Tell the owner: that’s a docs bug.</footer>';
  document.title = a.title + " · TaroGrid Help";
  window.scrollTo(0,0);
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

// --- search with synonym expansion ---
const SYN = {};
for (const [k, vals] of Object.entries(DATA.synonyms)) {
  const all = [k, ...vals.map(v=>v.toLowerCase())];
  for (const t of all) SYN[t] = all;
}
function expand(q){
  const terms = q.toLowerCase().split(/\\s+/).filter(Boolean);
  const out = new Set(terms);
  for (const t of terms) { for (const [key, group] of Object.entries(SYN)) { if (key.includes(t) || t.includes(key)) group.forEach(g => out.add(g)); } }
  return [...out];
}
function search(q){
  if(!q.trim()) return [];
  const terms = expand(q);
  return Object.values(DATA.articles).map(a => {
    let score = 0;
    for (const t of terms){
      if (a.title.toLowerCase().includes(t)) score += 12;
      if (a.keywords.some(k => String(k).toLowerCase().includes(t))) score += 8;
      if (a.promise.toLowerCase().includes(t)) score += 4;
      if (a.text.includes(t)) score += 2;
    }
    return {a, score};
  }).filter(r => r.score > 0).sort((x,y) => y.score - x.score).slice(0,7);
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
    <span class="preview-chip">R1 PREVIEW · 14 of ~132 articles</span>
    <div id="nav"></div>
  </nav>
  <div class="main">
    <div class="top">
      <button class="menu-btn" id="menu">☰</button>
      <div class="search"><input id="q" type="search" placeholder="Search — try “courier”, “locked”, বা “অর্ডার”…" autocomplete="off">
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
console.log(`Built ${articles.length} articles → site/ (index.html ${(standalone.length / 1024).toFixed(0)} KB)`);
