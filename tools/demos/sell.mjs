// Chapter 6 (Sell: shop & sales forms) demos.
// Grammar + authoring rules: see ../theater.mjs and ../demos.mjs.
// Builder grammar (form-builder) recycled from the owner-approved website
// storefront prototype: dashed drop-hint canvas, blocks palette, staggered
// product cards, Publish → link chip with a "Copied" moment.

import {
  chip, light, tgl, btn, kpis, tbl, trow, rowCells, card, win, ask, life,
  task, prod, phone, shopHead, shopCard, bubble, success, kanban, ART,
} from "../theater.mjs";

// ---- local helpers ----
// mini product line-card for the form-builder canvas (thumb + name + price)
const pcard = (art, name, price, t) =>
  `<span class="t-in"${t ? ` data-t="${t}"` : ""} style="display:flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:6px;padding:4px 6px;background:var(--card);min-width:0">` +
  `<span class="t-scard" style="display:block;width:26px;border:0;border-radius:4px;flex:none"><span class="si" style="display:block;height:19px">${ART[art]}</span></span>` +
  `<span style="min-width:0"><span style="display:block;font-size:8.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${name}</span>` +
  `<span style="display:block;font-size:8px;color:var(--muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${price}</span></span></span>`;

// form-builder block title + skeleton field row
const blkTitle = (label) =>
  `<div style="display:flex;align-items:center;gap:6px;font-size:10px;font-weight:800"><i style="width:6px;height:6px;border-radius:2px;background:var(--primary);display:inline-block"></i>${label}</div>`;
const fieldRow = (label) =>
  `<div style="display:flex;align-items:center;gap:8px;margin-top:5px"><span style="font-size:9px;color:var(--muted);font-weight:600;width:44px;flex:none">${label}</span><span style="flex:1;height:13px;border:1px solid var(--border);border-radius:4px;display:block"></span></div>`;

// shop-branding: the little live preview strip inside the Shop look window
const lookPrev = (color) =>
  `<div style="display:flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:7px;padding:5px 7px;background:var(--card)"><span style="width:16px;height:16px;border-radius:5px;background:${color};color:#fff;font-size:7px;font-weight:800;display:grid;place-items:center;flex:none">MC</span><span style="font-size:9px;font-weight:700">Maya's Closet</span><span style="margin-left:auto;font-size:7.5px;color:var(--muted)">shop preview</span></div>`;

// test-shop: seed rows used both in the initial table AND the post-delete
// tbody rewrite, so the swap never drifts from the seeded screen.
const TS_SEEDS =
  trow(["Anika", "Silk Scarf ×1", "$19", chip("Delivered", "acc")], "llr") +
  trow(["Priya S.", "Gift Bundle ×1", "$69", chip("Booked", "acc")], "llr") +
  trow(["Omar K.", "Rose Dress ×1", "$59", chip("Done", "ok")], "llr");

export const DEMOS_SELL = {
  "golden-path": {
    crumb: "Work · Orders", cat: 2, h: 345, center: false,
    html:
      `<div class="t-view" data-t="v1" style="background:var(--card)">` +
      `<div style="display:flex;flex-direction:column;gap:9px;align-items:center">` +
      win("Product Catalog",
        prod({ art: "dress", name: "Rose Dress", price: "$59" }) +
        prod({ art: "scarf", name: "Silk Scarf", price: "$19" }) +
        prod({ art: "bundle", name: "Gift Bundle", price: "$69" }),
        "cw") +
      `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${chip("Rose Dress · stock 12")}${chip("Silk Scarf · stock 30")}${chip("Gift Bundle · draws both")}</div>` +
      `</div></div>` +
      `<div class="t-view off" data-t="v2" style="background:var(--card)">` +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid">${shopCard({ art: "dress", name: "Rose Dress", price: "$59" })}${shopCard({ art: "scarf", name: "Silk Scarf", price: "$19" })}</div>` +
        `<div class="t-totrow" style="margin-top:6px"><span>Rose Dress ×1</span><span>$59</span></div>` +
        `<div class="t-totrow grand"><span>Total</span><span>$59</span></div>` +
        `<div class="t-place" data-t="place" style="margin-top:5px">Order — cash on delivery</div>` +
        success("psucc", "Order placed", "#MC-1042 · Rose Dress ×1 · pay $59 on delivery"),
        "ph") +
      `<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">` +
      chip(`<span class="t-mono">yourshop.link/maya</span>`, "", "lnk") +
      chip("no app · no account · just a page") +
      `</div></div>` +
      `<div class="t-view off" data-t="v3" style="align-items:flex-start;background:var(--card)">` +
      `<div style="width:min(430px,94%);margin-top:2px">` +
      kpis([["Orders today", "6", "kOrd"], ["Pending COD", "$88", "kCod"], ["In risk review", "0", "kRisk"]]) +
      `<div style="display:flex;gap:6px;align-items:center;margin:2px 0 7px;flex-wrap:wrap">${chip(`Rose Dress · stock <b class="t-num" data-t="stk">12</b>`, "", "stkc")}${chip("Silk Scarf · stock 30")}</div>` +
      tbl({
        t: "ob", head: ["Buyer", "Items", "Total", "Status"], aligns: "llr",
        rows: [
          { c: ["Priya S.", "Gift Bundle ×1", "$69", chip("Booked", "acc")] },
          { c: ["Omar K.", "Silk Scarf ×1", "$19", chip("Confirmed", "acc")] },
          { c: ["Anika", "Silk Scarf ×1", "$19", chip("Done", "ok")] },
          { c: ["Lena M.", "Rose Dress ×1", "$59", chip("Done", "ok")] },
        ],
      }) +
      `<div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap"><span class="t-in" data-t="f3">${chip("🚚 courier ready — address complete", "acc")}</span></div>` +
      `</div></div>`,
    beats: [
      { cap: "Stop one — the Catalog: every product with photo, price, stock. One shelf.", d: 4000, cues: [
        [1500, "cam", "cw", 1.25],
      ]},
      { cap: "Stop two — your shop link shows that shelf to the world. No app, no account.", d: 4400, cues: [
        [0, "wide"], [150, "cls", "v1", "off", 1], [350, "cls", "v2", "off", 0],
        [1600, "cam", "ph", 1.35],
      ]},
      { cap: "Tomas orders the Rose Dress — cash on delivery.", d: 3600, cues: [
        [600, "cls", "place", "pressed", 1], [750, "cls", "place", "pressed", 0],
        [950, "show", "psucc"],
      ]},
      { cap: "Stop three — it lands on your Orders Board as a row. You typed nothing.", d: 4600, cues: [
        [0, "wide"], [150, "cls", "v2", "off", 1], [350, "cls", "v3", "off", 0],
        [900, "row", "ob", rowCells(["Tomas", "Rose Dress ×1", "$59", chip("New", "acc", "st") + " " + chip("…", "", "risk")], "llr")],
        [1600, "cam", "ob", 1.15],
        [2500, "count", "kOrd", 6, 7], [2550, "pulse", "kOrd"],
      ]},
      { cap: "And the path keeps walking: fraud checked, stock counted, courier ready.", d: 4600, cues: [
        [300, "chip", "risk", "", "Checking…"],
        [1400, "chip", "risk", "ok", "🟢 Looks safe"],
        [2400, "count", "stk", 12, 11], [2450, "pulse", "stkc"],
        [3200, "show", "f3"],
      ]},
      { cap: "Catalog → link → row → checked, counted, courier-ready. That's the golden path.", d: 3800, cues: [
        [300, "wide"], [900, "settle", "st"],
      ]},
    ],
  },

  "catalog-shelf": {
    crumb: "Work · Catalog", cat: 2, h: 310,
    html:
      `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;width:100%">` +
      `<span class="t-lift" data-t="wl" style="z-index:2">` +
      win("Product Catalog",
        prod({ art: "dress", name: "Rose Dress", price: "$59" }) +
        prod({ art: "scarf", name: "Silk Scarf", price: "$19" }) +
        `<span class="t-in" data-t="np">${prod({ art: "bundle", name: "Gift Bundle", price: "$69" })}</span>` +
        btn("＋ Add", "add", "o"),
        "cw") +
      `</span>` +
      `<div style="width:min(340px,94%);margin-top:-14px">` +
      tbl({ t: "pb", head: ["Product", "Price", "Stock"], aligns: "lrr", rows: [
        ["Rose Dress", "$59", "12"],
        ["Silk Scarf", "$19", "30"],
      ]}) +
      `<div class="t-in" data-t="live" style="margin-top:9px;text-align:center">${chip("live on your shop ✓", "ok")}</div>` +
      `</div></div>`,
    beats: [
      { cap: "The Catalog window — every product in one place.", d: 3600, cues: [
        [1500, "cam", "cw", 1.2],
      ]},
      { cap: "Add a product: photo, price, and stock if you track it.", d: 4200, cues: [
        [200, "cur", "add"], [1100, "click", "add"],
        [1350, "show", "np"], [1600, "pulse", "np"],
        [2200, "curx"],
      ]},
      { cap: "Underneath the window: a real board — one row per product.", d: 4600, cues: [
        [0, "wide"], [500, "cls", "wl", "up", 1],
        [1100, "row", "pb", rowCells(["Gift Bundle", "$69", "—"], "lrr")],
        [3400, "cls", "wl", "up", 0],
      ]},
      { cap: "New product, live shelf — your shop shows it without a re-publish.", d: 3600, cues: [
        [400, "show", "live"], [700, "settle", "live"],
      ]},
    ],
  },

  "variants-sale": {
    crumb: "Work · Catalog", cat: 2, h: 280,
    html:
      `<div data-t="grp" style="display:flex;gap:16px;align-items:flex-start">` +
      prod({ art: "dress", name: "Rose Dress", price: "$59", t: "p1" }) +
      `<div style="display:flex;flex-direction:column;gap:7px;align-items:flex-start;min-width:0">` +
      `<div style="display:flex;gap:5px">${chip("S", "", "szS")}${chip("M", "", "szM")}${chip("L", "", "szL")}</div>` +
      `<div style="width:200px">` +
      tbl({ t: "vt", head: ["Option", "Stock", ""], aligns: "lr", rows: [
        { c: ["S — Small", `<b class="t-num">4</b>`, ""], t: "rS" },
        { c: ["M — Medium", `<b class="t-num" data-t="ms">8</b>`, ""], t: "rM" },
        { c: ["L — Large", `<b class="t-num" data-t="ls">3</b>`, chip("low", "warn")], t: "rL" },
      ]}) + `</div>` +
      `<div class="t-in" data-t="livec">${chip("sale price wins — everywhere", "acc")}</div>` +
      `</div></div>`,
    beats: [
      { cap: "Options like size or color live on one product — not three copies.", d: 3800, cues: [
        [1500, "cam", "grp", 1.3],
        [2100, "pulse", "szS"], [2350, "pulse", "szM"], [2600, "pulse", "szL"],
      ]},
      { cap: "Set a sale price — it wins automatically, everywhere the dress appears.", d: 4400, cues: [
        [200, "cur", "p1-pr"], [1100, "click", "p1-pr"],
        [1250, "text", "p1-pr", "<s>$59</s>$49"], [1350, "pulse", "p1-pr"],
        [1900, "curx"], [2400, "show", "livec"],
      ]},
      { cap: "Stock counts down on every sale — per option: size M sells, only M moves.", d: 4200, cues: [
        [200, "toast", "New order · Rose Dress · size <b>M</b> · $49"],
        [1200, "flash", "rM"], [1300, "count", "ms", 8, 7], [1400, "pulse", "ms"],
        [3200, "toastx"],
      ]},
      { cap: "And again, by itself — a size L goes; L's counter alone ticks down.", d: 4200, cues: [
        [400, "toast", "New order · Rose Dress · size <b>L</b> · $49"],
        [1400, "flash", "rL"], [1500, "count", "ls", 3, 2], [1600, "pulse", "ls"],
        [3300, "toastx"],
      ]},
      { cap: "One product, three honest counters.", d: 3400, cues: [
        [300, "wide"], [900, "settle", "rM"],
      ]},
    ],
  },

  "combo-bundle": {
    crumb: "Work · Catalog", cat: 2, h: 265,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center">` +
      `<div data-t="grp" style="display:flex;gap:8px;align-items:center">` +
      prod({ art: "dress", name: "Rose Dress", price: "$59" }) +
      `<b style="font-size:13px">+</b>` +
      prod({ art: "scarf", name: "Silk Scarf", price: "$19" }) +
      `<span class="k-arrow"></span>` +
      `<span class="t-in" data-t="bt">${prod({ art: "bundle", name: "Gift Bundle", price: "$69", t: "bp" })}</span>` +
      `</div>` +
      `<div class="t-in" data-t="math">${chip(`$59 + $19 = <s>$78</s> apart · <b>$69</b> together`, "acc")}</div>` +
      `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">` +
      chip(`Rose Dress · stock <b class="t-num" data-t="ds">12</b>`, "", "dsc") +
      chip(`Silk Scarf · stock <b class="t-num" data-t="ss">30</b>`, "", "ssc") +
      `</div></div>`,
    beats: [
      { cap: "Two products become one bundle, with its own price.", d: 4200, cues: [
        [1500, "cam", "grp", 1.25],
        [2200, "show", "bt"], [2500, "pulse", "bp"],
      ]},
      { cap: "The math stays visible: $59 + $19 is $78 apart — $69 together.", d: 3800, cues: [
        [300, "cam", "math", 1.35], [800, "show", "math"], [1000, "pulse", "math"],
      ]},
      { cap: "A bundle sale draws down BOTH stocks…", d: 4600, cues: [
        [200, "toast", "New order · Gift Bundle ×1 · <b>$69</b>"],
        [400, "wide"],
        [1300, "count", "ds", 12, 11], [1400, "pulse", "dsc"],
        [2100, "count", "ss", 30, 29], [2200, "pulse", "ssc"],
        [3400, "toastx"],
      ]},
      { cap: "…and again on its own — every bundle, the same double draw. No mental math.", d: 4200, cues: [
        [400, "toast", "New order · Gift Bundle ×1 · <b>$69</b>"],
        [1400, "count", "ds", 11, 10], [1500, "pulse", "dsc"],
        [2100, "count", "ss", 29, 28], [2200, "pulse", "ssc"],
        [3300, "toastx"],
      ]},
      { cap: "…honestly.", d: 3000, cues: [
        [400, "settle", "dsc"], [600, "settle", "ssc"],
      ]},
    ],
  },

  "form-builder": {
    crumb: "Work · Sales Form", cat: 2, h: 310, center: false,
    html:
      `<div style="display:flex;gap:12px;align-items:flex-start;max-width:480px">` +
      `<div style="flex:1;min-width:0">` +
      `<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px">` +
      `<span style="font-size:11px;font-weight:800;white-space:nowrap">New Sales Form</span>${btn("Publish", "pub")}</div>` +
      `<div data-t="cv" style="position:relative;border:1px solid var(--border);border-radius:10px;background:var(--card);padding:10px;min-height:200px;display:flex;flex-direction:column;gap:8px">` +
      `<div class="t-in in" data-t="hint" style="position:absolute;inset:10px;border:1.5px dashed var(--border);border-radius:8px;display:grid;place-items:center;color:var(--muted);font-size:11px;font-weight:600">Add blocks to build the shop</div>` +
      `<div class="t-in" data-t="b1"><div class="t-card" style="padding:7px 9px">${blkTitle("Delivery details")}${fieldRow("Name")}${fieldRow("Phone")}${fieldRow("Address")}</div></div>` +
      `<div class="t-in" data-t="b2"><div class="t-card" style="padding:7px 9px">${blkTitle("Products · from your Catalog")}<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:6px">${pcard("dress", "Rose Dress", "$59 · stock 12", "pc1")}${pcard("scarf", "Silk Scarf", "$19 · stock 30", "pc2")}${pcard("bundle", "Gift Bundle", "$69 · combo", "pc3")}</div></div></div>` +
      `<div class="t-in" data-t="b3"><div class="t-card" style="padding:7px 9px">${blkTitle("Payment")}<div style="display:flex;gap:6px;margin-top:6px;flex-wrap:wrap">${chip("Cash on delivery", "acc")}${chip("Pay online")}</div></div></div>` +
      `</div>` +
      `<div class="t-in" data-t="lnk" style="margin-top:9px;text-align:center">${chip(`<span class="t-mono">yourshop.link/maya</span> <b class="t-in" data-t="cpy" style="color:var(--t-ok)">Copied ✓</b>`, "acc")}</div>` +
      `</div>` +
      `<div class="t-win" style="min-width:140px;flex:none"><div class="wh">Blocks</div><div class="wb" style="flex-direction:column;align-items:stretch">` +
      chip("🛍 Products", "", "palP") + chip("🚚 Delivery details", "", "palD") + chip("💳 Payment", "", "palY") +
      `</div></div>` +
      `</div>`,
    beats: [
      { cap: "A blank shop: a dashed canvas waiting, and a palette of blocks beside it.", d: 3600, cues: [
        [1500, "cam", "cv", 1.15],
      ]},
      { cap: "Fields first — name, phone, address: exactly what delivery needs.", d: 4000, cues: [
        [200, "cur", "palD"], [1000, "click", "palD"],
        [1150, "cls", "palD", "t-dim", 1],
        [1250, "hide", "hint"], [1350, "show", "b1"], [1600, "pulse", "b1"],
      ]},
      { cap: "Then the heart of the form: Products — your Catalog steps in, card by card.", d: 4600, cues: [
        [200, "cur", "palP"], [900, "click", "palP"],
        [1000, "cls", "palP", "t-dim", 1],
        [1150, "show", "b2"], [1500, "cam", "b2", 1.35],
        [1900, "show", "pc1"], [2150, "show", "pc2"], [2400, "show", "pc3"],
      ]},
      { cap: "Payment: cash on delivery, online, or both.", d: 3600, cues: [
        [0, "wide"], [400, "cur", "palY"], [1200, "click", "palY"],
        [1300, "cls", "palY", "t-dim", 1],
        [1450, "show", "b3"], [1700, "pulse", "b3"],
      ]},
      { cap: "Publish — your shop becomes one link, already on your clipboard.", d: 4400, cues: [
        [200, "cur", "pub"], [1100, "click", "pub"],
        [1300, "show", "lnk"], [1500, "pulse", "lnk"],
        [2000, "show", "cpy"], [2600, "curx"],
      ]},
      { cap: "Three blocks, one link — a storefront built in a coffee break.", d: 3600, cues: [
        [300, "wide"], [900, "settle", "lnk"],
      ]},
    ],
  },

  "shop-link": {
    crumb: "Work · Sales Form", cat: 2, h: 300, center: false,
    html:
      `<div style="max-width:320px">` +
      `<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap">` +
      btn("Publish", "pub") +
      `<span class="t-in" data-t="lnk">${chip(`<span class="t-mono">yourshop.link/maya</span> · copied ✓`, "acc")}</span></div>` +
      win("Catalog",
        prod({ art: "dress", name: "Rose Dress", price: "$59", t: "cp" }) +
        prod({ art: "scarf", name: "Silk Scarf", price: "$19" }) +
        prod({ art: "bundle", name: "Gift Bundle", price: "$69" }),
        "cw") +
      `</div>` +
      phone(
        `<div style="font-size:8px;font-weight:700;color:var(--muted);text-align:center;padding-bottom:4px;border-bottom:1px solid var(--border);margin-bottom:6px">Chat · Anika</div>` +
        `<div class="t-in" data-t="bub"><div class="t-bub" style="max-width:none">my shop 👇<span class="lc"><span class="t-mono">yourshop.link/maya</span></span></div></div>` +
        `<div class="t-in" data-t="unf" style="display:block;margin-top:6px">` +
        `<div style="border:1px solid var(--border);border-radius:8px;padding:6px 7px;background:var(--card)">` +
        `<div style="display:flex;gap:5px;align-items:center"><span style="width:16px;height:16px;border-radius:5px;background:var(--primary);color:#fff;font-size:7px;font-weight:800;display:grid;place-items:center;flex:none">MC</span><b style="font-size:8px">Maya's Closet</b></div>` +
        `<div style="font-size:7.5px;color:var(--muted);margin-top:3px;line-height:1.5">Rose Dress <b data-t="unfp">$59</b> · Silk Scarf $19<br>Gift Bundle $69</div>` +
        `</div></div>` +
        `<div class="t-in" data-t="shopv" style="position:absolute;inset:0;background:var(--card);z-index:2;padding:6px 9px">` +
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid"><div class="t-scard" data-t="pg"><div class="si">${ART.dress}</div><div class="sb2"><div class="snm">Rose Dress</div><div class="spr" data-t="pgpr">$59</div></div></div>${shopCard({ art: "scarf", name: "Silk Scarf", price: "$19" })}</div>` +
        `<div class="t-in" data-t="cart">` +
        `<div class="t-totrow" style="margin-top:6px"><span>Rose Dress ×1</span><span class="t-num" data-t="sht1">$59</span></div>` +
        `<div class="t-totrow grand"><span>Total</span><span class="t-num" data-t="sht2">$59</span></div>` +
        `</div></div>`,
        "ph"
      ).replace('class="t-phone"', 'class="t-phone" style="position:absolute;right:8px;bottom:8px;z-index:6"'),
    beats: [
      { cap: "Publishing gives you a short link, made for chat.", d: 4000, cues: [
        [400, "cur", "pub"], [1300, "click", "pub"],
        [1500, "show", "lnk"], [1700, "pulse", "lnk"], [2300, "curx"],
      ]},
      { cap: "Pasted in a chat, it unfurls: your shop's name, real products, live prices.", d: 4200, cues: [
        [300, "cam", "ph", 1.45],
        [900, "show", "bub"], [2000, "show", "unf"],
      ]},
      { cap: "Anika taps it — your shop opens in the chat, and the dress goes straight in.", d: 4600, cues: [
        [500, "cls", "unf", "pressed", 1], [650, "cls", "unf", "pressed", 0],
        [900, "show", "shopv"],
        [1700, "cls", "pg", "pressed", 1], [1850, "cls", "pg", "pressed", 0],
        [2100, "show", "cart"], [2400, "pulse", "sht2"],
      ]},
      { cap: "Back home you drop the price — one edit, in the Catalog.", d: 4400, cues: [
        [0, "wide"], [500, "cur", "cp-pr"], [1400, "click", "cp-pr"],
        [1550, "text", "cp-pr", "<s>$59</s>$54"], [1650, "pulse", "cp-pr"],
        [2200, "curx"],
      ]},
      { cap: "Her page follows on refresh — card, cart, total. Live means live.", d: 4400, cues: [
        [300, "cam", "ph", 1.45],
        [1000, "flash", "pg"], [1100, "text", "pgpr", `<s style="opacity:.65">$59</s> $54`],
        [1400, "text", "sht1", "$54"], [1600, "text", "sht2", "$54"], [1700, "pulse", "sht2"],
      ]},
      { cap: "One link, pasted once, current forever — that's the handshake.", d: 3400, cues: [
        [300, "wide"], [900, "settle", "lnk"],
      ]},
    ],
  },

  "shop-branding": {
    crumb: "Work · Sales Form", cat: 2, h: 275,
    html:
      win("Shop look",
        `<div style="display:block;width:100%;min-width:172px">` +
        `<div style="display:flex;gap:5px">` +
        chip(`<span style="color:#4f8f8b">●</span> Teal`, "", "swT") +
        chip(`<span style="color:#c2607e">●</span> Rose`, "", "swR") +
        chip(`<span style="color:#c9973a">●</span> Sand`, "", "swS") + `</div>` +
        `<div data-t="pv" style="margin-top:7px">${lookPrev("#4f8f8b")}</div>` +
        `<div style="margin-top:6px;font-size:9.5px;color:var(--muted)">logo · colors · cover</div></div>`,
        "look") +
      win("Form A — Sales", `<span class="t-in" data-t="iA">${chip("look: inherits ✓", "acc")}</span>`, "fA") +
      win("Form B — Preorders",
        `<span class="t-in" data-t="iB">${chip("look: inherits ✓", "acc")}</span>` +
        chip("background: inherited", "", "ovB"),
        "fB"),
    beats: [
      { cap: "Your shop's look lives in one place — logo, colors, cover.", d: 3400, cues: [
        [1500, "cam", "look", 1.25],
      ]},
      { cap: "Set it once…", d: 4200, cues: [
        [200, "cur", "swR"], [1100, "click", "swR"],
        [1250, "chip", "swR", "acc", `<span style="color:#c2607e">●</span> Rose ✓`],
        [1500, "text", "pv", lookPrev("#c2607e")], [1650, "flash", "pv"],
        [2200, "curx"],
      ]},
      { cap: "…every form inherits it — Sales, Preorders, all of them.", d: 4000, cues: [
        [200, "wide"],
        [800, "flash", "fA"], [900, "show", "iA"],
        [1500, "flash", "fB"], [1600, "show", "iB"],
      ]},
      { cap: "Any form can override one piece — “this form only.”", d: 4600, cues: [
        [300, "cam", "fB", 1.3],
        [900, "cur", "ovB"], [1700, "click", "ovB"],
        [1850, "chip", "ovB", "warn", "background: its own — this form only"],
        [2400, "curx"],
      ]},
      { cap: "One look, set once — every door wears it until you say otherwise.", d: 3400, cues: [
        [300, "wide"], [900, "settle", "look"],
      ]},
    ],
  },

  "form-to-board": {
    crumb: "Work · Orders", cat: 2, h: 330, center: false,
    html:
      `<div style="max-width:450px">` +
      `<div style="display:flex;gap:6px;align-items:center;margin-bottom:7px;flex-wrap:wrap">${chip(`Rose Dress · stock <b class="t-num" data-t="stk">12</b>`, "", "stkc")}${chip("Silk Scarf · stock 30")}</div>` +
      tbl({ t: "ob", head: ["Name", "Phone", "Item", "Total"], aligns: "lllr", rows: [
        ["Priya S.", "…8830", "Silk Scarf ×1", "$19"],
        ["Omar K.", "…2214", "Gift Bundle ×1", "$69"],
        ["Lena M.", "…6402", "Rose Dress ×1", "$59"],
      ]}) +
      `<div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">` +
      `<span class="t-in" data-t="m1">${chip("🕒 arrived 9:12 pm")}</span>` +
      `<span class="t-in" data-t="m2">${chip("🟢 fraud checked", "ok")}</span>` +
      `<span class="t-in" data-t="m3">${chip("Status: Pending")}</span>` +
      `<span class="t-in" data-t="m4">${chip("Matched: Anika ✓ — no duplicate", "acc")}</span>` +
      `</div></div>` +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid">` +
        `<div class="t-scard added"><div class="si">${ART.dress}</div><div class="sb2"><div class="snm">Rose Dress</div><div class="spr">$59</div><div class="add">Added ✓</div></div></div>` +
        shopCard({ art: "scarf", name: "Silk Scarf", price: "$19" }) +
        `</div>` +
        `<div style="font-size:8px;padding:4px 1px 3px;border-bottom:1px solid var(--border);margin-top:5px">Name — <b>Anika</b></div>` +
        `<div style="font-size:8px;padding:3px 1px;border-bottom:1px solid var(--border)">Phone — <b>…4521</b></div>` +
        `<div class="t-totrow" style="margin-top:4px"><span>Rose Dress ×1</span><span>$59</span></div>` +
        `<div class="t-totrow grand"><span>Total · cash on delivery</span><span>$59</span></div>` +
        `<div class="t-place" data-t="place" style="margin-top:5px">Place order</div>` +
        success("psucc", "Order placed", "Rose Dress ×1 · pay $59 on delivery"),
        "ph"
      ).replace('class="t-phone"', 'class="t-phone" style="position:absolute;right:8px;bottom:8px;z-index:6"'),
    beats: [
      { cap: "Anika has filled your form — dress picked, name and phone in, COD chosen.", d: 3600, cues: [
        [1600, "cam", "ph", 1.4],
      ]},
      { cap: "She taps Place order…", d: 3200, cues: [
        [600, "cls", "place", "pressed", 1], [750, "cls", "place", "pressed", 0],
        [950, "show", "psucc"],
      ]},
      { cap: "…and every answer flies to its own column on the Orders Board.", d: 4800, cues: [
        [0, "cls", "ph", "gone", 1], [200, "cam", "ob", 1.25],
        [700, "row", "ob", `<td><span data-t="c1"></span></td><td><span data-t="c2"></span></td><td><span data-t="c3"></span></td><td class="r t-num"><span data-t="c4"></span></td>`],
        [1300, "text", "c1", "Anika"], [1350, "pulse", "c1"],
        [1800, "text", "c2", "…4521"], [1850, "pulse", "c2"],
        [2300, "text", "c3", "Rose Dress ×1"], [2350, "pulse", "c3"],
        [2800, "text", "c4", "$59"], [2850, "pulse", "c4"],
      ]},
      { cap: "Then TaroGrid adds what you'd forget: arrival time, fraud check, status.", d: 4200, cues: [
        [300, "wide"],
        [700, "show", "m1"], [1400, "show", "m2"], [2100, "show", "m3"],
      ]},
      { cap: "Stock counts itself down — and Anika matches by phone. No duplicate Anikas.", d: 4200, cues: [
        [300, "count", "stk", 12, 11], [400, "pulse", "stkc"],
        [1500, "show", "m4"], [1700, "pulse", "m4"],
      ]},
      { cap: "One tap on her side — a complete, checked row on yours.", d: 3400, cues: [
        [300, "wide"], [900, "settle", "m4"],
      ]},
    ],
  },

  "test-shop": {
    crumb: "Work · Orders", cat: 2, h: 330, center: false,
    html:
      `<div style="max-width:450px">` +
      kpis([["Orders today", "5", "kOrd"], ["Pending COD", "$88", "kCod"], ["In risk review", "0", "kRisk"]]) +
      `<table class="t-tbl"><thead><tr><th>Buyer</th><th>Item</th><th style="text-align:right">Total</th><th>Check</th></tr></thead><tbody data-t="ob">${TS_SEEDS}</tbody></table>` +
      `<div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">` +
      `<span class="t-in" data-t="m2">${chip("stock 12 → 11")}</span>` +
      `<span class="t-in" data-t="m3">${chip("🚚 courier ready", "acc")}</span>` +
      `<span class="t-in" data-t="trash">${chip("🗑 moved to Trash — restorable", "warn")}</span>` +
      `</div></div>` +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid">${shopCard({ art: "dress", name: "Rose Dress", price: "$59" })}${shopCard({ art: "scarf", name: "Silk Scarf", price: "$19" })}</div>` +
        `<div class="t-totrow" style="margin-top:6px"><span>Rose Dress ×1</span><span>$59</span></div>` +
        `<div class="t-totrow grand"><span>Total</span><span>$59</span></div>` +
        `<div class="t-place" data-t="place" style="margin-top:5px">Order — cash on delivery</div>` +
        success("psucc", "Order placed", "Rose Dress ×1 · pay $59 on delivery"),
        "ph"
      ).replace('class="t-phone"', 'class="t-phone" style="position:absolute;right:8px;bottom:8px;z-index:6"'),
    beats: [
      { cap: "Before you share the link: order from yourself, like a customer would.", d: 3600, cues: [
        [1600, "cam", "ph", 1.35],
      ]},
      { cap: "Tap Order — a real test order, cash on delivery.", d: 3200, cues: [
        [600, "cls", "place", "pressed", 1], [750, "cls", "place", "pressed", 0],
        [950, "show", "psucc"],
      ]},
      { cap: "There you are — a new row on your own Orders Board.", d: 4000, cues: [
        [0, "cls", "ph", "gone", 1], [200, "cam", "ob", 1.2],
        [700, "row", "ob", `<td>You</td><td>Rose Dress ×1</td><td class="r t-num">$59</td><td>${chip("…", "", "hop")} <span data-t="del" style="font-size:10px;opacity:.75">🗑</span></td>`],
        [1700, "count", "kOrd", 5, 6], [1750, "pulse", "kOrd"],
      ]},
      { cap: "Check every hop worked: fraud ran, stock moved, the courier's ready.", d: 4600, cues: [
        [300, "chip", "hop", "", "Checking…"],
        [1400, "chip", "hop", "ok", "🟢 fraud ✓"],
        [2400, "show", "m2"], [3200, "show", "m3"],
      ]},
      { cap: "Then delete it — Trash keeps it recoverable, like everything in TaroGrid.", d: 4400, cues: [
        [300, "cur", "del"], [1300, "click", "del"],
        [1550, "text", "ob", `<tr class="dim"><td>You</td><td>Rose Dress ×1</td><td class="r t-num">$59</td><td>${chip("🗑 In Trash", "warn")}</td></tr>` + TS_SEEDS],
        [1800, "show", "trash"], [2600, "curx"],
      ]},
      { cap: "Rehearsal done. Now share the link for real.", d: 3200, cues: [
        [300, "wide"], [900, "settle", "trash"],
      ]},
    ],
  },

  "edit-after-launch": {
    crumb: "Work · Catalog", cat: 2, h: 280,
    html:
      win("Catalog",
        prod({ art: "dress", name: "Rose Dress", price: "$59", t: "cp" }) +
        prod({ art: "scarf", name: "Silk Scarf", price: "$19" }),
        "cw") +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid"><div class="t-scard" data-t="pg"><div class="si">${ART.dress}</div><div class="sb2"><div class="snm">Rose Dress</div><div class="spr" data-t="pgpr">$59</div></div></div>${shopCard({ art: "scarf", name: "Silk Scarf", price: "$19" })}</div>`,
        "ph") +
      win("Yesterday's order", `Anika · Rose Dress ×1 · <b data-t="oldpr">$59</b> ${chip("Delivered", "acc")}`, "ow"),
    beats: [
      { cap: "Edit price, photo, or stock in the Catalog — the one true place.", d: 4600, cues: [
        [1500, "cam", "cw", 1.25],
        [2100, "cur", "cp-pr"], [2900, "click", "cp-pr"],
        [3100, "text", "cp-pr", "<s>$59</s>$54"], [3200, "pulse", "cp-pr"],
        [3800, "curx"],
      ]},
      { cap: "Your live shop follows.", d: 3800, cues: [
        [300, "cam", "ph", 1.4],
        [1000, "flash", "pg"],
        [1100, "text", "pgpr", `<s style="opacity:.65">$59</s> $54`], [1200, "pulse", "pg"],
      ]},
      { cap: "Old orders keep their original prices — history never rewrites itself.", d: 4000, cues: [
        [300, "cam", "ow", 1.3],
        [900, "flash", "ow"], [1100, "pulse", "oldpr"],
      ]},
      { cap: "Edit boldly — the shop updates, the books stay put.", d: 3200, cues: [
        [300, "wide"], [900, "settle", "ow"],
      ]},
    ],
  },

  "two-doors": {
    bare: true, h: 310,
    html:
      `<div style="display:flex;flex-direction:column;gap:8px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap">` +
      `<div class="k-frame sm" data-t="f1"><span class="k-flabel">MAYA'S CLOSET</span>` +
      `<div style="display:flex;flex-direction:column;gap:2px;align-items:center">` +
      win("Sales form", "Products · Payment · Delivery") +
      `<span class="k-arrow" style="transform:rotate(90deg);margin:7px 0;width:24px"></span>` +
      `<div style="width:172px"><div style="font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--muted);margin-bottom:2px">ORDERS BOARD</div>` +
      tbl({ t: "ob", head: ["Buyer", "Total"], aligns: "lr", rows: [["Anika", "$59"], ["Priya S.", "$69"]] }) +
      `</div></div></div>` +
      `<div class="k-frame sm" data-t="f2"><span class="k-flabel">ATLAS STUDIO</span>` +
      `<div style="display:flex;flex-direction:column;gap:2px;align-items:center">` +
      win("Client request", "Name · Brief · Deadline") +
      `<span class="k-arrow" style="transform:rotate(90deg);margin:7px 0;width:24px"></span>` +
      `<div style="width:172px"><div style="font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--muted);margin-bottom:2px">REQUESTS BOARD</div>` +
      tbl({ t: "rb", head: ["Client", "Ask"], rows: [["Omar K.", "Brand kit"], ["Chen W.", "Menu design"]] }) +
      `</div></div></div></div>` +
      `<div class="t-in" data-t="pay">${chip("form → row · always", "ok")}</div>` +
      `</div>`,
    beats: [
      { cap: "Two businesses, two forms: Maya sells; her cousin's studio takes briefs.", d: 3200, cues: [
        [1200, "flash", "f1"], [1800, "flash", "f2"],
      ]},
      { cap: "The Sales Form: a door for customers — products, payment, delivery.", d: 4200, cues: [
        [300, "cam", "f1", 1.2],
        [1400, "row", "ob", rowCells(["Tomas", "$59"], "lr")],
      ]},
      { cap: "An intake form: a door for requests — straight onto a Work board.", d: 4200, cues: [
        [0, "wide"], [500, "cam", "f2", 1.2],
        [1500, "row", "rb", rowCells(["Lena M.", "Logo refresh"])],
      ]},
      { cap: "Same trick, different doors: forms write rows.", d: 3800, cues: [
        [300, "wide"], [900, "show", "pay"], [1100, "settle", "pay"],
      ]},
    ],
  },

  "own-domain": {
    bare: true, h: 225,
    html:
      `<div style="display:flex;flex-direction:column;gap:14px;align-items:center">` +
      chip("coming soon", "warn", "soon") +
      `<div data-t="grp" style="display:flex;gap:10px;align-items:center">` +
      chip(`<span class="t-mono">shop.yourbrand.com</span>`, "", "urlc") +
      `<span class="k-arrow"></span>` +
      `<span class="t-in" data-t="conn">${chip("connected ✓", "ok")}</span>` +
      `</div></div>`,
    beats: [
      { cap: "Coming: your shop on your own web address.", d: 3800, cues: [
        [400, "cam", "grp", 1.4], [1000, "pulse", "urlc"],
      ]},
      { cap: "One small setting where you bought your domain — TaroGrid will guide you.", d: 4200, cues: [
        [500, "show", "conn"], [700, "settle", "conn"], [2400, "wide"],
      ]},
    ],
  },

  // ═══════════════ Chapter 8 · Money ═══════════════,

};
