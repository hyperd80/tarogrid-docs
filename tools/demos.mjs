// Animated demo scenes — one entry per article's demo, played by the demo
// theater (tools/theater.mjs). The theater grammar is recycled from the
// owner-approved website scene prototypes: a realistic mini-app frame, a
// rostrum camera, an OS-pointer cursor that appears ONLY when a human acts,
// timed beats with captions, chip swaps, count-ups, settle sweeps.
//
// Every demo: { ws?, crumb?, cat?, h?, bare?, center?, html, beats }
//   cat: 0 Money · 1 People · 2 Work · 3 Outreach (sidebar highlight)
//   beats: [{ cap, d, cues: [[atMs, op, ...args], ...] }]
// Ops are documented at the top of tools/theater.mjs.
//
// Cast rules (CAST.md): Maya's Closet — Rose Dress $59 · Silk Scarf $19 ·
// Gift Bundle $69; customers Anika (repeat) and Tomas (new); team Maya,
// Sana, Ben. Atlas Studio for Work-category stories. Currency always $.
// The same numbers recur on purpose: recognition is the point.

import {
  chip, light, tgl, btn, kpis, tbl, trow, rowCells, card, win, ask, life,
  task, prod, phone, shopHead, shopCard, bubble, success, kanban, ART,
} from "./theater.mjs";

// -- shared fragments ---------------------------------------------------------
const seedOrderRows = [
  { c: ["Anika", "Rose Dress ×1", "$59", chip("Delivered", "ok"), ""], t: "r0" },
  { c: ["Priya S.", "Silk Scarf ×2", "$38", chip("Booked", "acc"), ""], t: "r1" },
];
const smsIcon = (t) =>
  `<span class="t-in" data-t="${t}" style="color:var(--primary-ink);font-size:10px">✉</span>`;

// -- local helpers for the Money/Boards demos --
const flowStep = (t, inner, first = false) =>
  `<span class="t-in" data-t="${t}" style="display:inline-flex;align-items:center;gap:8px">${
    first ? "" : `<span class="k-arrow"></span>`
  }${inner}</span>`;

const bandRow = (t, label, ok = false) =>
  `<tr class="t-in" data-t="${t}"><td colspan="3" style="height:20px;font-size:8px;font-weight:800;letter-spacing:.05em;color:var(${ok ? "--t-ok" : "--primary-ink"});background:var(${ok ? "--t-ok-bg" : "--soft"})">${label}</td></tr>`;

const vtabs = (on) =>
  `<div style="display:flex;gap:5px;margin-bottom:9px">${["Table", "Kanban", "Calendar"]
    .map((n, i) => chip(n, i === on ? "acc" : "")).join("")}</div>`;

const calChip = (name, s, t) =>
  `<span class="t-chip"${s ? ` data-s="${s}"` : ""}${t ? ` data-t="${t}"` : ""} style="font-size:7px;padding:1px 4px">${name}</span>`;

// table-mastery rows (cols 2+3 swap during the drag beat)
const TM_ROWS = [
  ["Anika", "Rose Dress ×1", "$59"],
  ["Tomas", "Silk Scarf ×2", "$38"],
  ["Priya S.", "Gift Bundle ×1", "$69"],
  ["Omar K.", "Silk Scarf ×1", "$19"],
  ["Lena M.", "Rose Dress ×1", "$59"],
  ["Anika", "Silk Scarf ×1", "$19"],
];
const tmSwapCues = [];
TM_ROWS.forEach((r, i) => {
  tmSwapCues.push([1900 + i * 40, "text", `tmi${i}`, `<span class="t-num">${r[2]}</span>`]);
  tmSwapCues.push([1900 + i * 40, "text", `tmt${i}`, r[1]]);
});


export const DEMOS = {
  // ═══════════════ Chapter 0 · Start here ═══════════════
  "order-ripple": {
    crumb: "Work · Orders", cat: 2, h: 250, center: false,
    html:
      `<div style="max-width:440px">` +
      `<div style="display:flex;gap:6px;align-items:center;margin-bottom:7px">${chip(`Rose Dress · stock <b class="t-num" data-t="stk">12</b>`, "", "stkc")}</div>` +
      tbl({
        t: "ob", head: ["Buyer", "Items", "Total", "Status"], aligns: "llr",
        rows: [
          { c: ["Anika", "Silk Scarf ×1", "$19", chip("Done", "ok")], t: "seed1" },
        ],
      }) +
      `<div class="t-in" data-t="money" style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">` +
      win("Invoices", `Draft — Tomas · $59 ${chip("new", "ok")}`) +
      win("Courier Cash", `To collect <b>$59</b>`) +
      `</div></div>` +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid">${shopCard({ art: "dress", name: "Rose Dress", price: "$59" })}</div>` +
        `<div class="t-place" data-t="place" style="margin-top:7px">Order — cash on delivery</div>` +
        success("psucc", "Order placed", "Rose Dress ×1 · pay $59 on delivery"),
        "ph"
      ).replace('class="t-phone"', 'class="t-phone" style="position:absolute;right:8px;bottom:8px;z-index:6"'),
    beats: [
      { cap: "A customer orders from your shop link — no app, no account.", d: 3400, cues: [
        [0, "cam", "ph", 1.45],
        [1300, "cls", "place", "pressed", 1], [1450, "cls", "place", "pressed", 0],
        [1650, "show", "psucc"],
      ]},
      { cap: "The order lands on your Orders Board as a new row. You typed nothing.", d: 3400, cues: [
        [0, "cls", "ph", "gone", 1], [150, "cam", "ob", 1.25],
        [500, "row", "ob", rowCells(["Tomas", "Rose Dress ×1", "$59", chip("New", "acc", "st") + " " + chip("…", "", "risk")], "llr")],
      ]},
      { cap: "The fraud check runs, and stock counts itself down.", d: 3400, cues: [
        [200, "chip", "risk", "", "Checking…"],
        [1300, "chip", "risk", "ok", "🟢 Looks safe"],
        [2000, "count", "stk", 12, 11], [2050, "pulse", "stkc"],
      ]},
      { cap: "You confirm — your one human decision per order.", d: 3400, cues: [
        [200, "cur", "st"], [1100, "click", "st"],
        [1300, "chip", "st", "acc", "Confirmed"],
        [1900, "curx"],
      ]},
      { cap: "…and the courier is booked for you.", d: 3000, cues: [
        [300, "toast", "Courier booked · <b>#TRK-88412</b>"],
        [900, "chip", "st", "acc", "Booked"],
      ]},
      { cap: "The money side updates itself — invoice drafted, Courier Cash tracking the $59 until it's truly yours.", d: 4200, cues: [
        [0, "toastx"], [200, "show", "money"], [400, "cam", "money", 1.3],
        [2800, "wide"],
      ]},
    ],
  },

  "three-ideas": {
    bare: true, h: 235,
    html:
      `<div class="t-view" data-t="v1"><div class="k-frame"><span class="k-flabel">YOUR COMPANY</span><div class="k-split">` +
      `<div class="t-in" data-t="z1"><div class="k-zone money">MONEY</div></div>` +
      `<div class="t-in" data-t="z2"><div class="k-zone people">PEOPLE</div></div>` +
      `<div class="t-in" data-t="z3"><div class="k-zone work">WORK</div></div>` +
      `<div class="t-in" data-t="z4"><div class="k-zone outreach">OUTREACH</div></div>` +
      `</div></div></div>` +
      `<div class="t-view off" data-t="v2"><div style="width:min(320px,90%)" data-t="b2">` +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        ["Anika", "Rose Dress ×1", "$59"],
        { c: ["Tomas", "Silk Scarf ×2", "$38"], t: "b2row" },
        ["Priya S.", "Gift Bundle ×1", "$69"],
      ]}) + `</div></div>` +
      `<div class="t-view off" data-t="v3" style="flex-direction:column;gap:2px">` +
      `<span class="t-lift" data-t="wlift" style="z-index:2">${win("Invoice Center", `Anika · $59 ${chip("Paid ✓", "ok")}`)}</span>` +
      `<div style="width:min(300px,88%);margin-top:-14px" data-t="b3">` +
      tbl({ head: ["Invoice", "Client", "Total"], aligns: "llr", rows: [
        [`<span class="t-mono">INV-0142</span>`, "Anika", "$59"],
        { c: [`<span class="t-mono">INV-0141</span>`, "Tomas", "$38"], t: "b3row" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "This is your company — the Workspace. Everything lives inside it.", d: 4000, cues: [
        [400, "show", "z1"], [700, "show", "z2"], [1000, "show", "z3"], [1300, "show", "z4"],
      ]},
      { cap: "Your company's information lives on boards — rows and columns.", d: 4200, cues: [
        [0, "cls", "v1", "off", 1], [260, "cls", "v2", "off", 0],
        [700, "flash", "b2row"], [1300, "cam", "b2row", 1.3], [3300, "wide"],
      ]},
      { cap: "Windows are smart screens that work on top of boards.", d: 4200, cues: [
        [0, "cls", "v2", "off", 1], [260, "cls", "v3", "off", 0],
        [700, "cam", "wlift", 1.25],
      ]},
      { cap: "Lift any window — a real board is always underneath. Nothing is hidden.", d: 4600, cues: [
        [300, "wide"], [700, "cls", "wlift", "up", 1], [1200, "flash", "b3row"],
        [3400, "cls", "wlift", "up", 0],
      ]},
    ],
  },

  "first-run-checklist": {
    crumb: "Home", cat: 2, h: 225,
    html:
      win("Set up your company",
        `<div style="display:block;width:100%">` +
        task("Name your company", true) +
        task("Add a product", false, "tk2") +
        task("Publish your shop link", false, "tk3") +
        `</div>`, "cl") +
      `<div class="t-in" data-t="alldone">${chip("✓ All 6 steps complete — your business loop is live", "ok")}</div>`,
    beats: [
      { cap: "A fresh workspace starts with a six-step checklist.", d: 3200, cues: [
        [300, "cam", "cl", 1.3],
      ]},
      { cap: "Each step ticks itself the moment you complete it — no marking things done.", d: 4200, cues: [
        [600, "cls", "tk2", "done", 1], [620, "text", "tk2", "✓"], [640, "pulse", "tk2"],
        [2300, "cls", "tk3", "done", 1], [2320, "text", "tk3", "✓"], [2340, "pulse", "tk3"],
      ]},
      { cap: "All six done — the checklist retires itself.", d: 3400, cues: [
        [300, "wide"], [700, "show", "alldone"], [900, "settle", "alldone"],
      ]},
    ],
  },

  "screen-anatomy": {
    crumb: "Work · Orders", cat: 2, h: 235, center: false,
    html:
      `<div style="max-width:420px">` +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59"], t: "row1" },
        ["Tomas", "Silk Scarf ×2", "$38"],
      ]}) +
      `<div class="t-in" data-t="cc" style="margin-top:10px">${win("Courier Cash", `To collect <b>$118</b>`)}</div>` +
      `<div class="t-in" data-t="askw" style="margin-top:10px;max-width:280px">${ask("askt")}</div>` +
      `</div>`,
    beats: [
      { cap: "The sidebar is your company's map; the board area is your data.", d: 3600, cues: [
        [400, "flash", "row1"], [800, "cam", "row1", 1.2], [2400, "wide"],
      ]},
      { cap: "Module windows float over your boards — smart screens for money, people, outreach.", d: 3600, cues: [
        [300, "show", "cc"], [600, "cam", "cc", 1.3],
      ]},
      { cap: "And the ASK bar (⌘K) finds, answers, and acts — from anywhere.", d: 4200, cues: [
        [0, "wide"], [300, "show", "askw"], [600, "cam", "askw", 1.35],
        [900, "type", "askt", "courier cash"],
        [2600, "wide"],
      ]},
    ],
  },

  "first-three-wins": {
    crumb: "Work · Getting started", cat: 2, h: 245,
    html:
      `<div class="t-view" data-t="v1">${prod({ art: "dress", name: "Rose Dress", price: "$59", t: "p1" })}` +
      `<div class="t-in" data-t="stockc">${chip("12 in stock")}</div></div>` +
      `<div class="t-view off" data-t="v2"><span class="t-lift">${btn("Publish", "pub")}</span>` +
      `<div class="t-in" data-t="lnk">${chip(`<span class="t-mono">yourshop.link/maya</span> · copied ✓`, "acc")}</div></div>` +
      `<div class="t-view off" data-t="v3" style="align-items:flex-start"><div style="width:min(340px,94%);margin-top:10px">` +
      tbl({ t: "ob", head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [] }) +
      `</div></div>`,
    beats: [
      { cap: "Win 1 — one real product: photo, price, stock.", d: 3600, cues: [
        [300, "cam", "p1", 1.5], [900, "show", "stockc"],
      ]},
      { cap: "Win 2 — publish, and your shop link is ready to paste anywhere.", d: 4400, cues: [
        [0, "wide"], [100, "cls", "v1", "off", 1], [300, "cls", "v2", "off", 0],
        [700, "cur", "pub"], [1500, "click", "pub"], [1900, "show", "lnk"], [2300, "curx"],
      ]},
      { cap: "Win 3 — order from yourself, and watch the row appear on its own.", d: 4400, cues: [
        [0, "cls", "v2", "off", 1], [250, "cls", "v3", "off", 0],
        [900, "row", "ob", rowCells(["You", "Rose Dress ×1", "$59", chip("New", "acc")], "llr")],
        [1500, "cam", "ob", 1.3],
      ]},
      { cap: "That's the whole loop — you've seen everything an order does.", d: 2800, cues: [
        [300, "wide"],
      ]},
    ],
  },

  "data-safety": {
    bare: true, h: 225,
    html:
      `<div style="display:flex;flex-direction:column;gap:12px;align-items:center">` +
      `<div style="display:flex;gap:10px;align-items:center">${chip("💻 your device", "", "dev")}<span class="k-arrow"></span>${chip("☁️ cloud", "", "cld")}<span class="k-arrow"></span>${chip("📱 your phone", "", "phn")}</div>` +
      win("Edits waiting", `<span data-t="qn">0</span> changes queued ${chip("saved on device", "ok")}`, "queue") +
      `<div class="t-in" data-t="sync">${chip("✓ all copies in step", "ok")}</div></div>`,
    beats: [
      { cap: "Your device keeps a full copy; the cloud keeps the shared copy.", d: 3600, cues: [
        [400, "pulse", "dev"], [900, "pulse", "cld"], [1400, "pulse", "phn"],
      ]},
      { cap: "Offline? Keep working — changes queue up safely on your device.", d: 4400, cues: [
        [200, "chip", "cld", "warn", "✈️ offline"], [700, "cam", "queue", 1.3],
        [1100, "count", "qn", 0, 3], [1200, "pulse", "queue"],
      ]},
      { cap: "Back online — the queue uploads in order. Every copy matches again.", d: 4400, cues: [
        [200, "chip", "cld", "ok", "📶 reconnected"], [600, "wide"],
        [1000, "count", "qn", 3, 0], [1800, "show", "sync"], [2000, "settle", "sync"],
      ]},
    ],
  },

  "workspace-walls": {
    bare: true, h: 235,
    html:
      `<div class="k-frame sm" data-t="f1"><span class="k-flabel">MAYA'S CLOSET</span><div style="width:170px">` +
      tbl({ t: "wob", head: ["Buyer", "Total"], aligns: "lr", rows: [["Anika", "$59"]] }) + `</div></div>` +
      `<div class="k-frame sm t-dim" data-t="f2"><span class="k-flabel">ATLAS STUDIO</span><div style="width:170px">` +
      tbl({ head: ["Project", "Stage"], rows: [["Logo refresh", chip("Design", "acc")]] }) + `</div></div>`,
    beats: [
      { cap: "Two businesses, two workspaces — side by side, never mixing.", d: 3400, cues: [] },
      { cap: "An order arrives in Maya's Closet. Atlas Studio doesn't even blink.", d: 4200, cues: [
        [400, "cam", "f1", 1.25],
        [900, "row", "wob", rowCells(["Tomas", "$38"], "lr")],
      ]},
      { cap: "Switching workspaces switches everything — boards, money, people.", d: 4200, cues: [
        [200, "wide"],
        [700, "cls", "f1", "t-dim", 1], [700, "cls", "f2", "t-dim", 0],
      ]},
    ],
  },

  // ═══════════════ Chapter 1 · Core ideas ═══════════════
  "board-anatomy": {
    crumb: "Work · Orders", cat: 2, h: 235, center: false,
    html:
      `<div style="max-width:420px">` +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        ["Anika", "Rose Dress ×1", "$59"],
        { c: ["Tomas", "Silk Scarf ×2", "$38"], t: "hrow" },
        { c: ["Priya S.", "Gift Bundle ×1", `<span data-t="hcell">$69</span>`], t: "prow" },
      ]}) + `</div>`,
    beats: [
      { cap: "A shopkeeper's ledger: one line per order, one column per fact.", d: 3200, cues: [] },
      { cap: "A board is that ledger, made intelligent.", d: 3000, cues: [
        [400, "flash", "hrow"],
      ]},
      { cap: "One row = one thing. This row is Tomas's order.", d: 3600, cues: [
        [300, "cam", "hrow", 1.3], [600, "cls", "hrow", "fresh", 1],
      ]},
      { cap: "One cell = one fact — and every cell remembers who changed it, and when.", d: 4000, cues: [
        [0, "cls", "hrow", "fresh", 0],
        [300, "cam", "hcell", 1.55], [700, "pulse", "hcell"],
        [2800, "wide"],
      ]},
    ],
  },

  "window-lifts": {
    crumb: "Money · Invoices", cat: 0, h: 240,
    html:
      `<div style="display:flex;flex-direction:column;align-items:center;gap:2px">` +
      `<span class="t-lift" data-t="wl" style="z-index:2">${win("Invoice Center", `Anika · $59 ${chip("Paid ✓", "ok")}`)}</span>` +
      `<div style="width:min(300px,90%);margin-top:-14px">` +
      tbl({ head: ["Invoice", "Client", "Total"], aligns: "llr", rows: [
        [`<span class="t-mono">INV-0142</span>`, "Anika", "$59"],
        { c: [`<span class="t-mono">INV-0141</span>`, "Tomas", "$38"], t: "urow" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "The Invoice Center — a friendly cockpit.", d: 3200, cues: [
        [300, "cam", "wl", 1.3],
      ]},
      { cap: "Lift it like a sheet of glass — a real board is always underneath.", d: 4200, cues: [
        [200, "wide"], [600, "cls", "wl", "up", 1], [1100, "flash", "urow"],
      ]},
      { cap: "The window reads and writes the board. Cockpit on top, engine room below.", d: 4200, cues: [
        [600, "cls", "wl", "up", 0], [1400, "flash", "urow"],
      ]},
    ],
  },

  "locked-cell": {
    crumb: "Money · Invoice board", cat: 0, h: 235, center: false,
    html:
      `<div style="max-width:420px">` +
      tbl({ head: ["Invoice", "Total", "Status", "Notes"], aligns: "lr", rows: [
        { c: [`<span class="t-mono">INV-0142</span>`, "$59", chip("Paid 🔒", "ok", "lockchip"), `<span data-t="mycol" class="t-in">✎ your column</span>`], t: "lrow" },
      ]}) +
      `<div class="t-in" data-t="expl" style="margin-top:10px">${win("Why locked?", "The Invoice Center writes this column. Hand edits would vanish on refresh.")}</div></div>`,
    beats: [
      { cap: "You try to edit a module-managed cell — a gentle bounce, a small lock.", d: 3800, cues: [
        [200, "cur", "lockchip"], [1000, "click", "lockchip"],
        [1150, "pulse", "lockchip"], [1900, "curx"],
      ]},
      { cap: "Why? The window writes this column. Hand edits would vanish on refresh.", d: 3800, cues: [
        [300, "show", "expl"], [600, "cam", "expl", 1.25],
      ]},
      { cap: "Add your own column instead — notes, tags, anything.", d: 3600, cues: [
        [0, "wide"], [200, "hide", "expl"], [700, "show", "mycol"], [900, "pulse", "mycol"],
      ]},
      { cap: "The module refreshes its columns — and never touches yours.", d: 3400, cues: [
        [400, "flash", "lrow"], [900, "settle", "mycol"],
      ]},
    ],
  },

  "four-zones": {
    bare: true, h: 235,
    html:
      `<div style="display:flex;flex-direction:column;gap:12px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">` +
      `<div class="k-zone money" data-t="zm">MONEY</div><div class="k-zone people" data-t="zp">PEOPLE</div>` +
      `<div class="k-zone work" data-t="zw">WORK</div><div class="k-zone outreach" data-t="zo">OUTREACH</div></div>` +
      `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;min-height:26px">` +
      `<span class="t-in" data-t="c1"></span><span class="t-in" data-t="c2"></span></div></div>`,
    beats: [
      { cap: "Every workspace organizes itself into four worlds.", d: 3200, cues: [] },
      { cap: "Money in and out: invoices, expenses, courier cash, the net.", d: 3600, cues: [
        [200, "cam", "zm", 1.4], [500, "text", "c1", chip("invoice $59")], [520, "show", "c1"],
        [900, "text", "c2", chip("ads $20")], [920, "show", "c2"],
      ]},
      { cap: "People: customers and suppliers you work WITH — and your team working AS you.", d: 3600, cues: [
        [200, "cam", "zp", 1.4], [500, "text", "c1", chip("Anika · customer")],
        [900, "text", "c2", chip("Sana · team")],
      ]},
      { cap: "Work: your blank canvas — your own boards, your own rules.", d: 3400, cues: [
        [200, "cam", "zw", 1.4], [500, "text", "c1", chip("any board you invent")],
        [520, "text", "c2", ""],
      ]},
      { cap: "Outreach: campaigns and follow-ups — and who opened, clicked, replied.", d: 4000, cues: [
        [200, "cam", "zo", 1.4], [500, "text", "c1", chip("3-email campaign")],
        [900, "text", "c2", chip("Anika replied ✓", "ok")],
        [2800, "wide"],
      ]},
    ],
  },

  "board-zoom": {
    crumb: "Work · Orders", cat: 2, h: 240, center: false,
    html:
      `<div style="max-width:420px"><table class="t-tbl">` +
      `<thead><tr><th>Buyer</th><th>Item</th><th style="text-align:right">Total</th></tr></thead>` +
      `<tbody><tr data-t="g1"><td colspan="3" style="height:20px;font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--primary-ink);background:var(--soft)">NEW</td></tr>` +
      `<tr data-t="arow"><td>Anika</td><td>Rose Dress ×1</td><td class="r t-num"><span data-t="acell">$59</span></td></tr>` +
      `<tr><td>Tomas</td><td>Silk Scarf ×2</td><td class="r t-num">$38</td></tr>` +
      `<tr data-t="g2"><td colspan="3" style="height:20px;font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--t-ok);background:var(--t-ok-bg)">SHIPPED</td></tr>` +
      `<tr><td>Priya S.</td><td>Gift Bundle ×1</td><td class="r t-num">$69</td></tr></tbody></table></div>`,
    beats: [
      { cap: "A board — the whole ledger.", d: 3000, cues: [] },
      { cap: "Groups — colored sections you'd say out loud: New, Shipped, Done.", d: 3600, cues: [
        [300, "flash", "g1"], [900, "flash", "g2"], [1400, "cam", "g1", 1.25],
      ]},
      { cap: "Items — one row per real thing. This is Anika's order.", d: 3600, cues: [
        [300, "cam", "arow", 1.35], [600, "cls", "arow", "fresh", 1],
      ]},
      { cap: "Cells — one fact each. And every cell remembers who changed it, and when.", d: 4200, cues: [
        [0, "cls", "arow", "fresh", 0], [300, "cam", "acell", 1.6],
        [700, "pulse", "acell"], [3000, "wide"],
      ]},
    ],
  },

  "role-switch": {
    crumb: "Workspace", cat: 2, h: 235,
    html:
      `<div style="display:flex;gap:14px;align-items:flex-start">` +
      `<div class="k-side tall"><div class="k-si"></div><div class="k-si" data-t="s2"></div><div class="k-si"></div><div class="k-si" data-t="s4"></div><div class="k-si" data-t="s5"></div></div>` +
      `<div style="width:min(280px,60vw)">` +
      tbl({ head: ["Buyer", "Total"], aligns: "lr", rows: [["Anika", "$59"], ["Tomas", "$38"]] }) +
      `<div style="margin-top:8px" data-t="who">${chip("👤 Maya — owner: sees everything", "acc")}</div></div></div>`,
    beats: [
      { cap: "The owner sees everything.", d: 3400, cues: [] },
      { cap: "A member without money access — money isn't locked; it's simply not there.", d: 4200, cues: [
        [300, "text", "who", chip("👤 Ben — member, no money access", "")],
        [800, "cls", "s2", "gone", 1], [1000, "cls", "s4", "gone", 1],
      ]},
      { cap: "A guest sees one shared board. The rest of your company doesn't exist.", d: 4200, cues: [
        [300, "text", "who", chip("👤 Guest — one shared board", "warn")],
        [800, "cls", "s5", "gone", 1],
      ]},
    ],
  },

  "full-map": {
    bare: true, h: 235,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="l1">` +
      chip("🛍️ Catalog") + `<span class="k-arrow"></span>` + chip(`<span class="t-mono">yourshop.link/maya</span>`) + `<span class="k-arrow"></span>` + chip("Orders Board", "acc", "obc") + `</div>` +
      `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="l2">` +
      `<span class="t-in" data-t="m1">${chip("🟢 fraud checked", "ok")}</span>` +
      `<span class="t-in" data-t="m2">${chip(`stock 12 → 11`)}</span>` +
      `<span class="t-in" data-t="m3">${chip("🚚 courier booked", "acc")}</span></div>` +
      `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="l3">` +
      `<span class="t-in" data-t="m4">${win("Courier Cash", `to collect → <b>yours ✓</b>`)}</span>` +
      `<span class="t-in" data-t="m5"><div class="k-zone money">MONEY</div></span></div></div>`,
    beats: [
      { cap: "Products flow from your Catalog to your shop link to your Orders Board.", d: 3800, cues: [
        [400, "cam", "l1", 1.2], [800, "pulse", "obc"],
      ]},
      { cap: "From the order row: fraud checked, stock counted, courier booked.", d: 4200, cues: [
        [0, "wide"], [400, "show", "m1"], [900, "show", "m2"], [1400, "show", "m3"],
      ]},
      { cap: "Delivered cash flows into Courier Cash, then into your money picture.", d: 4200, cues: [
        [400, "show", "m4"], [1100, "show", "m5"], [1500, "cam", "l3", 1.2],
      ]},
      { cap: "People beside everything, Outreach reaching out, Work shaped your way.", d: 3200, cues: [
        [300, "wide"],
      ]},
    ],
  },

  // ═══════════════ Chapter 6 · Sell ═══════════════
  "golden-path": {
    crumb: "Work · Orders", cat: 2, h: 245, center: false,
    html:
      `<div class="t-view" data-t="v1">${prod({ art: "dress", name: "Rose Dress", price: "$59", t: "p1" })}${prod({ art: "scarf", name: "Silk Scarf", price: "$19", t: "p2" })}</div>` +
      `<div class="t-view off" data-t="v2">` +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid">${shopCard({ art: "dress", name: "Rose Dress", price: "$59" })}${shopCard({ art: "scarf", name: "Silk Scarf", price: "$19" })}</div>`,
        "ph") +
      chip(`<span class="t-mono">yourshop.link/maya</span>`, "", "lnk") + `</div>` +
      `<div class="t-view off" data-t="v3" style="align-items:flex-start"><div style="width:min(360px,94%);margin-top:8px">` +
      tbl({ t: "ob", head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", "Silk Scarf ×1", "$19", chip("Done", "ok")], t: "seed" },
      ]}) +
      `<div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">` +
      `<span class="t-in" data-t="f1">${chip("🟢 safe", "ok")}</span>` +
      `<span class="t-in" data-t="f2">${chip("stock 12 → 11")}</span>` +
      `<span class="t-in" data-t="f3">${chip("🚚 ready", "acc")}</span></div></div></div>`,
    beats: [
      { cap: "Your Catalog holds the products — photo, price, stock.", d: 3600, cues: [
        [400, "cam", "p1", 1.4],
      ]},
      { cap: "Your shop link shows them to the world — no app, no account needed.", d: 4200, cues: [
        [0, "wide"], [100, "cls", "v1", "off", 1], [300, "cls", "v2", "off", 0],
        [800, "cam", "ph", 1.25],
      ]},
      { cap: "An order becomes a row on the Orders Board — by itself.", d: 4200, cues: [
        [0, "wide"], [100, "cls", "v2", "off", 1], [300, "cls", "v3", "off", 0],
        [900, "row", "ob", rowCells(["Tomas", "Rose Dress ×1", "$59", chip("New", "acc")], "llr")],
        [1400, "cam", "ob", 1.2],
      ]},
      { cap: "Fraud checked, stock counted, courier ready. The path continues on its own.", d: 4400, cues: [
        [300, "show", "f1"], [800, "show", "f2"], [1300, "show", "f3"],
        [2800, "wide"],
      ]},
    ],
  },

  "customer-checkout": {
    bare: true, h: 260,
    html: phone(
      shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
      `<div class="t-sgrid">` +
      shopCard({ art: "dress", name: "Rose Dress", price: "$59", sizes: "S M L", t: "c1" }) +
      shopCard({ art: "scarf", name: "Silk Scarf", price: "$19", t: "c2" }) +
      `</div>` +
      `<div class="t-payrow" data-t="pay"><span class="t-payopt" data-t="cod">Cash on delivery</span><span class="t-payopt" data-t="onl">Pay online</span></div>` +
      `<div class="t-totrow"><span>Rose Dress · M</span><span data-t="t1">—</span></div>` +
      `<div class="t-totrow grand"><span>Total</span><span data-t="t2">$0</span></div>` +
      `<div class="t-place" data-t="place">Place order</div>` +
      success("succ", "Order placed", "Rose Dress ×1 · pay $59 on delivery"),
      "ph"),
    beats: [
      { cap: "Your customer sees a clean page: your products, your prices, your look.", d: 3400, cues: [
        [400, "cam", "c1", 1.6],
      ]},
      { cap: "They pick a size and add to bag — thumb-speed shopping.", d: 3800, cues: [
        [400, "cls", "c1-sz1", "sel", 1], [500, "pulse", "c1-sz1"],
        [1400, "cls", "c1-add", "pressed", 1], [1550, "cls", "c1-add", "pressed", 0],
        [1600, "cls", "c1", "added", 1], [1650, "text", "c1-add", "Added ✓"],
        [1900, "text", "t1", "$59"], [1950, "text", "t2", "$59"], [2000, "pulse", "t2"],
      ]},
      { cap: "They choose how to pay — for example, cash on delivery.", d: 3400, cues: [
        [200, "cam", "pay", 1.6], [700, "cls", "cod", "sel", 1], [800, "pulse", "cod"],
      ]},
      { cap: "They tap Order — done. No account, no app, no friction.", d: 3800, cues: [
        [200, "cam", "ph", 1.25],
        [700, "cls", "place", "pressed", 1], [850, "cls", "place", "pressed", 0],
        [1050, "show", "succ"],
      ]},
      { cap: "…and on your side, it's already a row on the Orders Board.", d: 3000, cues: [
        [400, "wide"],
      ]},
    ],
  },

  // ═══════════════ Chapter 11 · Automations ═══════════════
  "rule-card": {
    crumb: "Work · Automation Studio", cat: 2, h: 245, center: false,
    html:
      `<div style="max-width:400px">` +
      card({
        t: "rec", name: "Delivery follow-up", stat: "Off · never run", statT: "rstat",
        rule: `When an order becomes <b>Delivered</b>: move it to <b>Done</b>, request a review, and text the customer.`,
        right: tgl("tg"),
      }) +
      `<div style="margin-top:10px">` +
      tbl({ head: ["Buyer", "Item", "Status", ""], rows: [
        { c: ["Anika", "Rose Dress ×1", chip("Out for delivery", "", "st1"), smsIcon("sms1")], t: "row1" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "An automation is a written-down habit: WHEN this happens, DO that.", d: 3600, cues: [
        [300, "cam", "rec", 1.3], [700, "cls", "rec", "fresh", 1],
      ]},
      { cap: "Switch it on. That's the cursor's only job — then it leaves for good.", d: 3400, cues: [
        [200, "cur", "tg"], [1100, "click", "tg"], [1250, "cls", "tg", "on", 1],
        [1300, "text", "rstat", "On"], [1900, "curx"],
      ]},
      { cap: "A real row triggers it — and the robot does exactly what the card says.", d: 3800, cues: [
        [0, "cls", "rec", "fresh", 0], [200, "wide"], [700, "cam", "row1", 1.25],
        [1300, "flash", "row1"], [1500, "chip", "st1", "acc", "Delivered"],
      ]},
      { cap: "Moved to Done, review requested, customer texted. Every time, without being asked twice.", d: 4200, cues: [
        [500, "chip", "st1", "ok", "Done ✓"], [900, "show", "sms1"],
        [1300, "toast", "Rule ran · review requested · SMS sent"],
      ]},
      { cap: "You flipped one switch.", d: 3000, cues: [
        [0, "toastx"], [300, "wide"], [700, "settle", "row1"],
      ]},
    ],
  },

  // ═══════════════ Chapter 8 · Money ═══════════════
  "invoice-life": {
    crumb: "Money · Invoices", cat: 0, h: 245, center: false,
    html:
      `<div style="max-width:420px">` +
      tbl({ head: ["Invoice", "Client", "Total", "Status", ""], aligns: "llr", rows: [
        { c: [`<span class="t-mono">INV-0142</span>`, "Anika", `<span data-t="amt">$59</span>`, chip("Draft", "", "st"), btn("Send", "send")], t: "row" },
      ]}) +
      life([
        { l: "Sent", t: "n1" }, { l: "Delivered", t: "n2" }, { l: "Opened", t: "n3" },
        { l: "Paid", t: "n4", ok: true }, { l: "Receipt", t: "n5", ok: true },
      ]) + `</div>`,
    beats: [
      { cap: "An invoice walks a public, honest life.", d: 3000, cues: [
        [300, "cam", "row", 1.2],
      ]},
      { cap: "You send it — the only click in this story.", d: 3400, cues: [
        [200, "cur", "send"], [1100, "click", "send"],
        [1300, "chip", "st", "acc", "Sent"], [1350, "cls", "n1", "done", 1],
        [1900, "curx"], [2100, "wide"],
      ]},
      { cap: "Delivered… and when your customer opens it, you see it.", d: 4000, cues: [
        [400, "cls", "n2", "wired", 1], [600, "cls", "n2", "done", 1],
        [1800, "cls", "n3", "wired", 1], [2000, "cls", "n3", "done", 1],
        [2100, "toast", "<b>Anika</b> opened your invoice"],
      ]},
      { cap: "Payment verified real — Paid stamps itself. The first green of the story.", d: 4000, cues: [
        [0, "toastx"], [500, "cls", "n4", "wired", 1], [700, "cls", "n4", "done", 1],
        [900, "chip", "st", "ok", "Paid ✓"], [1000, "pulse", "amt"],
      ]},
      { cap: "The receipt makes and sends itself. Zero clicks.", d: 4200, cues: [
        [400, "cls", "n5", "wired", 1], [600, "cls", "n5", "done", 1],
        [800, "toast", "Receipt <b>RCT-090</b> sent to Anika"],
        [1600, "settle", "row"],
      ]},
    ],
  },

  "courier-cash": {
    crumb: "Money · Courier Cash", cat: 0, h: 250, center: false,
    html:
      `<div style="max-width:430px">` +
      kpis([["Expected", "$236", "kExp"], ["Received", "—", "kRec"], ["Needs review", "—", "kVar"]]) +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", `<span class="t-mono">TRK-8841</span>`, "$59", chip("Out for delivery", "", "s0")], t: "p0" },
        { c: ["Tomas", `<span class="t-mono">TRK-8842</span>`, "$89", chip("Out for delivery", "", "s1")], t: "p1" },
        { c: ["Priya S.", `<span class="t-mono">TRK-8843</span>`, "$49", chip("Out for delivery", "", "s2")], t: "p2" },
        { c: ["Omar K.", `<span class="t-mono">TRK-8844</span>`, "$39", chip("Out for delivery", "", "s3")], t: "p3" },
      ]}) + `</div>`,
    beats: [
      { cap: "The question this window answers: where is my cash-on-delivery money?", d: 3400, cues: [
        [400, "cam", "kExp", 1.35], [2200, "wide"],
      ]},
      { cap: "Deliveries confirm themselves — no portal-checking.", d: 4600, cues: [
        [300, "flash", "p0"], [400, "chip", "s0", "acc", "Delivered"],
        [1400, "flash", "p1"], [1500, "chip", "s1", "acc", "Delivered"],
        [2400, "flash", "p2"], [2500, "chip", "s2", "acc", "Delivered"],
        [3300, "flash", "p3"], [3400, "chip", "s3", "acc", "Delivered"],
      ]},
      { cap: "The courier's payout arrives → each line matches to your orders by tracking ID.", d: 4800, cues: [
        [200, "toast", "Payout statement · <b>$197</b> received"],
        [1000, "flash", "p0"], [1100, "chip", "s0", "ok", "Settled ✓"],
        [1900, "flash", "p1"], [2000, "chip", "s1", "ok", "Settled ✓"],
        [2600, "flash", "p2"], [2700, "chip", "s2", "ok", "Settled ✓"],
        [3100, "count", "kRec", 0, 197, "$"],
      ]},
      { cap: "An unmatched line is never silently absorbed — it waits for your eyes.", d: 4400, cues: [
        [0, "toastx"], [400, "flash", "p3"], [500, "chip", "s3", "warn", "Needs review 👀"],
        [900, "cam", "p3", 1.3], [1300, "text", "kVar", "$39"], [1400, "pulse", "kVar"],
      ]},
      { cap: "Every dollar accounted for — even the missing ones.", d: 3200, cues: [
        [300, "wide"], [800, "settle", "kExp"],
      ]},
    ],
  },

  // ═══════════════ Chapter 2 · Boards & views ═══════════════
  "kanban-drag": {
    crumb: "Work · Orders · Kanban", cat: 2, h: 275, center: false,
    html:
      `<div style="max-width:420px">` +
      kanban([
        { name: "Pending", dot: "var(--t-warn)", t: "colP", cards: [{ name: "Anika — $59", sub: "Rose Dress ×1", t: "kc" }, { name: "Omar K. — $39", sub: "Silk Scarf ×2" }] },
        { name: "Confirmed", dot: "var(--primary)", t: "colC", cards: [{ name: "Tomas — $38", sub: "Silk Scarf ×2" }] },
      ]) +
      `<div style="margin-top:10px">` +
      tbl({ head: ["Buyer", "Status"], rows: [
        { c: ["Anika", chip("Pending", "warn", "tstat")], t: "trow" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "Same rows as cards on a Kanban — one board, different glasses.", d: 3000, cues: [
        [300, "cam", "colP", 1.15],
      ]},
      { cap: "Drag Anika's card from Pending to Confirmed…", d: 3600, cues: [
        [100, "cur", "kc"], [900, "click", "kc"],
        [1100, "carry", "kc", "colC"], [1100, "cur", "colC"],
        [2300, "curx"],
      ]},
      { cap: "…and the Table's status cell flips too. One truth, many glasses.", d: 3800, cues: [
        [300, "cam", "trow", 1.35], [900, "flash", "trow"],
        [1100, "chip", "tstat", "acc", "Confirmed"],
      ]},
      { cap: "The drag was an edit — same as typing it.", d: 2800, cues: [
        [300, "wide"], [700, "settle", "trow"],
      ]},
    ],
  },

  // ═══════════════ Chapter 12 · ASK ═══════════════
  "ask-three": {
    crumb: "ASK · ⌘K", cat: 2, h: 235,
    html:
      `<div style="display:flex;flex-direction:column;gap:12px;align-items:center;width:100%">` +
      `<div style="width:min(300px,92%)" data-t="bar">${ask("at")}</div>` +
      `<span class="t-in" data-t="r1">${chip("Courier Cash ↵", "acc")}</span>` +
      `<span class="t-in" data-t="r2">${win("Revenue this month", `<b>$1,240</b> 📊`)}</span>` +
      `<span class="t-in" data-t="r3">${win("New expense?", `Ads — <b>$20</b> · today ${btn("Confirm")}`)}</span></div>`,
    beats: [
      { cap: "FIND: three letters reach any window or board.", d: 3800, cues: [
        [200, "cam", "bar", 1.3], [600, "type", "at", "cour"],
        [1600, "show", "r1"], [1700, "cam", "r1", 1.25],
      ]},
      { cap: "ASK: a question, answered from your own data.", d: 4400, cues: [
        [0, "hide", "r1"], [200, "cam", "bar", 1.3], [400, "type", "at", "revenue this month"],
        [1800, "show", "r2"], [1900, "cam", "r2", 1.25],
      ]},
      { cap: "ACT: a sentence becomes work — after you confirm.", d: 4400, cues: [
        [0, "hide", "r2"], [200, "cam", "bar", 1.3], [400, "type", "at", "spent 20 on boost"],
        [1800, "show", "r3"], [1900, "cam", "r3", 1.25],
      ]},
      { cap: "Find · Ask · Act. One bar, three verbs.", d: 2800, cues: [
        [300, "wide"],
      ]},
    ],
  },

  "ask-order": {
    crumb: "ASK · ⌘K", cat: 2, h: 255,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div style="width:min(330px,94%)">${ask("at")}</div>` +
      `<div class="t-in" data-t="cardw" style="max-width:330px">${win("New order?",
        `<div style="display:block;width:100%">` +
        `<div style="margin-bottom:5px">${chip("Using existing customer: Anika ✓", "acc")} ${chip("Not them — create new", "", "notthem")}</div>` +
        `<div style="margin-bottom:5px">Silk Scarf ×2 — <b data-t="qty">$38</b></div>` +
        `<div>${chip("+ draft invoice", "")} ${btn("Confirm", "cfm")}</div></div>`)}</div>` +
      `<div class="t-in" data-t="done" style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">${chip("4 things created ✓", "ok")}${chip("↩ Undo reverses all — as one step", "")}</div></div>`,
    beats: [
      { cap: "Type it like you'd say it: “create an order for Anika — 2 × Silk Scarf.”", d: 4400, cues: [
        [200, "cam", "at", 1.25], [500, "type", "at", "create an order for Anika — 2 × Silk Scarf"],
      ]},
      { cap: "One card previews the whole cascade — customer, order, draft invoice.", d: 3800, cues: [
        [0, "wide"], [300, "show", "cardw"], [600, "cam", "cardw", 1.2],
      ]},
      { cap: "Everything is editable before confirm — quantities, prices, even “not them.”", d: 3600, cues: [
        [500, "pulse", "qty"], [1500, "pulse", "notthem"],
      ]},
      { cap: "Confirm → it all happens. Undo → it all reverses, as one step.", d: 4600, cues: [
        [200, "cur", "cfm"], [1000, "click", "cfm"], [1300, "curx"],
        [1500, "hide", "cardw"], [1700, "wide"], [1900, "show", "done"], [2100, "settle", "done"],
      ]},
    ],
  },

  // ═══════════════ Chapter 17/18 · Settings & apps ═══════════════
  "access-center": {
    crumb: "Settings · Access Center", cat: 2, h: 250, center: false,
    html:
      `<div style="max-width:400px;display:flex;flex-direction:column;gap:8px">` +
      `<div style="display:flex;gap:8px;flex-wrap:wrap">` +
      win("Invoices", `Who can see this? ${chip("Chosen people ▾", "acc", "m1")}`) +
      win("Campaigns", `${chip("Owners only ▾", "", "m2")}`) + `</div>` +
      `<div data-t="people" style="display:flex;gap:6px;flex-wrap:wrap">` +
      chip("Sana: View", "", "psana") + chip("Ben: No access", "", "pben") + `</div>` +
      `<div data-t="crown">${chip("Total billed: 🔒 Hidden", "warn", "hid")}</div></div>`,
    beats: [
      { cap: "Per module, choose who's in: Everyone · Owners only · Chosen people.", d: 3600, cues: [
        [300, "cam", "m1", 1.35], [700, "pulse", "m1"],
      ]},
      { cap: "Per person: No access · View · Manage.", d: 4200, cues: [
        [0, "wide"], [300, "cam", "people", 1.35],
        [800, "cur", "psana"], [1600, "click", "psana"],
        [1800, "chip", "psana", "acc", "Sana: Manage"], [2400, "curx"],
      ]},
      { cap: "And the crown rule: what's hidden leaks nowhere — derived values show 🔒 Hidden.", d: 4200, cues: [
        [300, "cam", "hid", 1.4], [800, "pulse", "hid"], [2800, "wide"],
      ]},
    ],
  },

  "three-frames": {
    bare: true, h: 225,
    html:
      `<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">` +
      win("💻 Web", `Anika · <b data-t="v1">$59</b>`, "d1") +
      win("🖥️ Desktop", `Anika · <b data-t="v2">$59</b>`, "d2") +
      win("📱 Phone", `Anika · <b data-t="v3">$59</b>`, "d3") + `</div>` +
      `<div class="t-in" data-t="sync" style="margin-top:10px">${chip("every device caught up ✓", "ok")}</div>`,
    beats: [
      { cap: "The same workspace on web, desktop, and phone — three doors, one home.", d: 3400, cues: [
        [400, "pulse", "d1"], [800, "pulse", "d2"], [1200, "pulse", "d3"],
      ]},
      { cap: "An edit on your phone…", d: 3200, cues: [
        [300, "cam", "d3", 1.4], [900, "text", "v3", "$54"], [1000, "pulse", "d3"],
      ]},
      { cap: "…flows to the others — usually before you look up.", d: 4200, cues: [
        [300, "wide"], [900, "text", "v2", "$54"], [1000, "pulse", "d2"],
        [1400, "text", "v1", "$54"], [1500, "pulse", "d1"],
        [2100, "show", "sync"], [2300, "settle", "sync"],
      ]},
    ],
  },

  "sync-conflict": {
    crumb: "Work · Orders", cat: 2, h: 245,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">` +
      win("💻 Laptop · offline", `total → <b>$59</b>`, "d1") +
      win("📱 Phone · offline", `total → <b>$54</b>`, "d2") + `</div>` +
      `<div class="t-in" data-t="dlg" style="max-width:320px">${win("You both edited this cell",
        `<div style="display:block;width:100%">Pick the version to keep:<div style="margin-top:6px">${btn("Keep $59", "k59", "o")} ${btn("Keep $54", "k54")}</div></div>`)}</div>` +
      `<div class="t-in" data-t="hist">${chip("the other version stays in history — nothing is destroyed", "")}</div></div>`,
    beats: [
      { cap: "Two devices, offline, edit the same cell. It happens.", d: 3400, cues: [
        [400, "pulse", "d1"], [900, "pulse", "d2"],
      ]},
      { cap: "TaroGrid never silently picks a winner — it asks you.", d: 3800, cues: [
        [300, "show", "dlg"], [600, "cam", "dlg", 1.25],
      ]},
      { cap: "You pick. That's the whole ceremony.", d: 3600, cues: [
        [200, "cur", "k54"], [1100, "click", "k54"], [1500, "curx"],
        [1700, "hide", "dlg"], [1900, "wide"],
        [2100, "text", "d1", `<div class="wh">💻 Laptop</div><div class="wb">total → <b>$54</b> ✓</div>`],
      ]},
      { cap: "The version you didn't pick stays in history. Nothing is destroyed.", d: 3800, cues: [
        [400, "show", "hist"], [700, "settle", "hist"],
      ]},
    ],
  },

  "advance-shield": {
    crumb: "Work · Orders", cat: 2, h: 250, center: false,
    html:
      `<div style="max-width:420px">` +
      tbl({ head: ["Buyer", "Total", "Fraud", "Status"], aligns: "lr", rows: [
        { c: ["New number", "$59", light("r", "rl"), chip("Pending", "", "st1") + ` <span class="t-in" data-t="adv">${chip("💳 advance link · $5 · 24h", "acc")}</span>`], t: "row1" },
        { c: ["New number", "$34", light("r"), chip("⏰ advance expired", "warn", "st2")], t: "row2" },
      ]}) +
      `<div style="margin-top:9px">${btn("Request advance", "req", "o")}</div></div>`,
    beats: [
      { cap: "A risky order? Ask for a small advance — about the delivery fee.", d: 4200, cues: [
        [300, "cam", "row1", 1.25], [600, "pulse", "rl"],
        [1100, "cur", "req"], [1900, "click", "req"], [2200, "show", "adv"], [2600, "curx"],
      ]},
      { cap: "Paid → the order confirms itself. Real skin in the game.", d: 4200, cues: [
        [400, "toast", "Advance paid · <b>$5</b> ✓"],
        [1100, "chip", "st1", "ok", "Confirmed ✓"], [1300, "settle", "row1"],
      ]},
      { cap: "Not paid in time? Flagged for your review — never auto-cancelled.", d: 4400, cues: [
        [0, "toastx"], [300, "cam", "row2", 1.25],
        [900, "chip", "st2", "warn", "flagged for your review"],
        [2800, "wide"],
      ]},
    ],
  },

  // ═══════════════ Chapter 5 · Selling fields ═══════════════
  "product-field": {
    crumb: "Work · Orders", cat: 2, h: 255, center: false,
    html:
      `<div style="max-width:430px">` +
      tbl({ head: ["Buyer", "Product", "Total"], aligns: "llr", rows: [
        { c: ["Anika", chip("🌹 Rose Dress ×1", "acc", "pchip"), "$59"], t: "prow" },
        ["Tomas", chip("🧣 Silk Scarf ×2", "acc"), "$38"],
      ]}) +
      `<div style="display:flex;gap:10px;align-items:center;margin-top:10px">` +
      `<span class="t-in" data-t="tile">${prod({ art: "dress", name: "Rose Dress", price: "$59 · 12 left", t: "pt" })}</span>` +
      `<span class="t-in" data-t="stks" style="display:flex;gap:6px;flex-wrap:wrap">` +
      chip(`🌹 stock <b class="t-num" data-t="s1">12</b>`, "", "sc1") +
      chip(`🧣 stock <b class="t-num" data-t="s2">30</b>`, "", "sc2") +
      `</span></div></div>`,
    beats: [
      { cap: "Not typed text — a real product lives in the cell.", d: 3400, cues: [
        [400, "cam", "prow", 1.3], [900, "flash", "prow"], [1400, "pulse", "pchip"],
      ]},
      { cap: "Tap the chip: photo, price, stock — live from the Catalog.", d: 3800, cues: [
        [200, "cur", "pchip"], [1000, "click", "pchip"],
        [1200, "show", "tile"], [1450, "cam", "tile", 1.45], [1700, "curx"],
      ]},
      { cap: "Order placed → stock draws down.", d: 3400, cues: [
        [200, "show", "stks"], [450, "cam", "stks", 1.35],
        [1000, "count", "s1", 12, 11], [1050, "pulse", "sc1"],
      ]},
      { cap: "Bundles draw down every member.", d: 3800, cues: [
        [400, "count", "s1", 11, 10], [450, "pulse", "sc1"],
        [800, "count", "s2", 30, 29], [850, "pulse", "sc2"],
        [2500, "wide"],
      ]},
    ],
  },

  "courier-book": {
    crumb: "Work · Orders", cat: 2, h: 250, center: false,
    html:
      `<div style="max-width:430px">` +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", `<span class="t-mono" data-t="trk">—</span>`, "$59", chip("Pending", "warn", "st")], t: "row" },
      ]}) +
      `<div class="t-in" data-t="cc" style="margin-top:10px">${win("Courier Cash", `To collect <b>$59</b> ${chip("new", "acc")}`)}</div>` +
      `</div>`,
    beats: [
      { cap: "Status flips to Confirmed → the courier books itself from the row.", d: 4200, cues: [
        [200, "cam", "row", 1.25],
        [600, "cur", "st"], [1400, "click", "st"], [1550, "chip", "st", "acc", "Confirmed"],
        [2100, "curx"],
        [2900, "chip", "st", "", "Booking…"],
      ]},
      { cap: "The tracking ID types itself in. No copy-paste, no typos.", d: 3800, cues: [
        [300, "cam", "trk", 1.45], [600, "type", "trk", "TRK-8841"],
        [1700, "chip", "st", "acc", "Booked"],
        [2700, "wide"],
      ]},
      { cap: "Delivery status updates on its own: in transit → delivered.", d: 3800, cues: [
        [400, "chip", "st", "acc", "In transit"],
        [2200, "flash", "row"], [2400, "chip", "st", "ok", "Delivered ✓"],
      ]},
      { cap: "Delivered cash-on-delivery money appears in Courier Cash.", d: 4000, cues: [
        [300, "show", "cc"], [600, "cam", "cc", 1.3],
        [1200, "settle", "cc"],
        [2800, "wide"],
      ]},
    ],
  },

  "fraud-light": {
    crumb: "Work · Orders", cat: 2, h: 250, center: false,
    html:
      `<div style="max-width:430px">` +
      tbl({ head: ["Buyer", "Phone", "Total", "Check"], aligns: "llr", rows: [
        { c: ["Anika", `<span class="t-mono">…8802</span>`, "$59", light("g", "l1")], t: "r1" },
        { c: ["Omar K.", `<span class="t-mono">…3319</span>`, "$38", light("y", "l2")], t: "r2" },
        { c: ["Lena M.", `<span class="t-mono">…4521</span>`, "$69", light("r", "l3")], t: "r3" },
      ]}) +
      `<div class="t-in" data-t="hist" style="display:flex;gap:6px;margin-top:10px;flex-wrap:wrap">` +
      chip("📱 …4521") + chip("8 received ✓", "ok") + chip("5 returned ↩", "warn") +
      `</div>` +
      `<div class="t-in" data-t="verdict" style="margin-top:8px">${chip("review before shipping", "bad")}</div>` +
      `</div>`,
    beats: [
      { cap: "Every order gets a light: green, yellow, or red.", d: 3600, cues: [
        [400, "pulse", "l1"], [900, "pulse", "l2"], [1400, "pulse", "l3"],
      ]},
      { cap: "It reads this phone number's delivery history: received vs returned.", d: 4200, cues: [
        [300, "cam", "r3", 1.3], [700, "flash", "r3"],
        [1300, "show", "hist"], [1600, "cam", "hist", 1.3],
      ]},
      { cap: "A signal, not a verdict. Red means: check before you ship.", d: 4200, cues: [
        [300, "show", "verdict"], [600, "pulse", "verdict"],
        [2600, "wide"], [3200, "pulse", "l3"],
      ]},
    ],
  },

  "order-row": {
    crumb: "Work · Orders", cat: 2, h: 240, center: false,
    html:
      `<div style="max-width:460px">` +
      tbl({ head: ["Buyer", "Product", "Total", "Check", "Courier", "Cash"], aligns: "llr", rows: [
        { c: [
          "Anika",
          `<span data-t="c1">${chip("🌹 Rose Dress ×1", "acc")}</span>`,
          `<span data-t="c2">$59</span>`,
          `<span data-t="c3">${light("g")}</span>`,
          `<span data-t="c4">${chip("🚚 Book", "")}</span>`,
          `<span data-t="c5">${chip("💵 COD", "")}</span>`,
        ], t: "row" },
      ]}) + `</div>`,
    beats: [
      { cap: "One order row, five selling superpowers.", d: 3200, cues: [
        [300, "cam", "row", 1.3], [800, "cls", "row", "fresh", 1],
      ]},
      { cap: "Product chip → true total → fraud light…", d: 4200, cues: [
        [0, "cls", "row", "fresh", 0],
        [200, "cam", "c1", 1.6], [500, "pulse", "c1"],
        [1600, "cam", "c2", 1.6], [1900, "pulse", "c2"],
        [3000, "cam", "c3", 1.6], [3300, "pulse", "c3"],
      ]},
      { cap: "…courier → cash on delivery.", d: 4200, cues: [
        [200, "cam", "c4", 1.6], [500, "pulse", "c4"],
        [1600, "cam", "c5", 1.6], [1900, "pulse", "c5"],
        [2900, "wide"], [3300, "settle", "row"],
      ]},
    ],
  },

  // ═══════════════ Chapter 7 · Orders & delivery ═══════════════
  "order-life": {
    crumb: "Work · Orders", cat: 2, h: 250, center: false,
    html:
      `<div style="max-width:440px">` +
      tbl({ t: "ob", head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [] }) +
      life([
        { l: "Pending", t: "n1" }, { l: "Confirmed", t: "n2" }, { l: "Booked", t: "n3" },
        { l: "In transit", t: "n4" }, { l: "Delivered", t: "n5" }, { l: "Reconciled", t: "n6", ok: true },
      ]) + `</div>`,
    beats: [
      { cap: "An order is born Pending — a customer just tapped Order.", d: 3600, cues: [
        [500, "row", "ob", rowCells(["Tomas", "Rose Dress ×1", "$59", chip("Pending", "warn", "st")], "llr")],
        [900, "cls", "n1", "done", 1],
        [1300, "cam", "ob", 1.25],
      ]},
      { cap: "You confirm it — your one human decision per order.", d: 3800, cues: [
        [300, "cur", "st"], [1200, "click", "st"],
        [1400, "chip", "st", "acc", "Confirmed"],
        [1450, "cls", "n2", "wired", 1], [1550, "cls", "n2", "done", 1],
        [2000, "curx"], [2600, "wide"],
      ]},
      { cap: "Booked, in transit, delivered — the row updates itself.", d: 4600, cues: [
        [300, "flash", "ob"], [400, "chip", "st", "acc", "Booked"],
        [450, "cls", "n3", "wired", 1], [550, "cls", "n3", "done", 1],
        [1700, "flash", "ob"], [1800, "chip", "st", "acc", "In transit"],
        [1850, "cls", "n4", "wired", 1], [1950, "cls", "n4", "done", 1],
        [3100, "flash", "ob"], [3200, "chip", "st", "acc", "Delivered"],
        [3250, "cls", "n5", "wired", 1], [3350, "cls", "n5", "done", 1],
      ]},
      { cap: "Reconciled: the courier's payout matched your row. The story ends where it should — in your pocket.", d: 4400, cues: [
        [400, "cls", "n6", "wired", 1], [600, "cls", "n6", "done", 1],
        [700, "chip", "st", "ok", "Reconciled ✓"],
        [1500, "settle", "ob"],
      ]},
    ],
  },

  "confirm-dispatch": {
    crumb: "Work · Orders", cat: 2, h: 260, center: false,
    html:
      `<div style="max-width:440px">` +
      tbl({ t: "tb", head: ["", "Buyer", "Check", "Status"], rows: [
        { c: [`<span class="t-box" data-t="b1"></span>`, "Anika", light("g"), chip("Pending", "", "s1")], t: "r1" },
        { c: [`<span class="t-box" data-t="b2"></span>`, "Tomas", light("g"), chip("Pending", "", "s2")], t: "r2" },
        { c: [`<span class="t-box" data-t="b3"></span>`, "Priya S.", light("g"), chip("Pending", "", "s3")], t: "r3" },
        { c: [`<span class="t-box"></span>`, "Omar K.", light("y"), chip("Pending", "", "s4")], t: "r4" },
      ]}) +
      `<div style="margin-top:10px">${btn("Confirm 3 orders", "call")}</div>` +
      `</div>`,
    beats: [
      { cap: "Scan the lights, select the safe rows…", d: 4400, cues: [
        [200, "cur", "b1"], [800, "click", "b1"], [950, "cls", "b1", "done", 1], [960, "text", "b1", "✓"], [980, "cls", "r1", "fresh", 1],
        [1500, "cur", "b2"], [2000, "click", "b2"], [2150, "cls", "b2", "done", 1], [2160, "text", "b2", "✓"], [2180, "cls", "r2", "fresh", 1],
        [2700, "cur", "b3"], [3200, "click", "b3"], [3350, "cls", "b3", "done", 1], [3360, "text", "b3", "✓"], [3380, "cls", "r3", "fresh", 1],
        [3800, "cls", "r4", "dim", 1],
      ]},
      { cap: "…confirm them together.", d: 3400, cues: [
        [300, "cur", "call"], [1100, "click", "call"],
        [1350, "chip", "s1", "acc", "Confirmed"], [1500, "chip", "s2", "acc", "Confirmed"], [1650, "chip", "s3", "acc", "Confirmed"],
        [2100, "curx"],
      ]},
      { cap: "The dispatch recipe books every courier…", d: 4600, cues: [
        [400, "flash", "r1"], [500, "chip", "s1", "acc", "Booked · TRK-8841"],
        [1400, "flash", "r2"], [1500, "chip", "s2", "acc", "Booked · TRK-8842"],
        [2100, "flash", "r3"], [2200, "chip", "s3", "acc", "Booked · TRK-8843"],
        [2400, "cls", "r1", "fresh", 0], [2500, "cls", "r2", "fresh", 0], [2600, "cls", "r3", "fresh", 0],
      ]},
      { cap: "…while you pack.", d: 3600, cues: [
        [400, "toast", "3 couriers booked · <b>tracking IDs written</b>"],
        [1600, "settle", "tb"],
      ]},
    ],
  },

  "courier-connect": {
    crumb: "Settings · Couriers", cat: 2, h: 255, center: false,
    html:
      `<div style="max-width:430px">` +
      win("Couriers", `account key <span class="t-mono" data-t="key">—</span> ${btn("Save", "save")} <span class="t-in" data-t="conn">${chip("Courier connected ✓", "ok")}</span>`, "sw") +
      `<div class="t-in" data-t="obw" style="margin-top:10px">` +
      tbl({ head: ["Buyer", "Tracking", "Status"], rows: [
        { c: ["Anika", `<span class="t-mono" data-t="trk">—</span>`, chip("Confirmed", "acc", "st")], t: "row" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "Your courier account details go into Settings — once.", d: 4400, cues: [
        [300, "cam", "sw", 1.3],
        [700, "cur", "key"], [1500, "click", "key"], [1700, "text", "key", "••••••••"], [1800, "pulse", "key"],
        [2500, "cur", "save"], [3300, "click", "save"],
      ]},
      { cap: "Connected — every order row can now book with one click.", d: 3800, cues: [
        [200, "show", "conn"], [500, "curx"],
        [1000, "show", "obw"], [1400, "wide"],
      ]},
      { cap: "The courier books itself from the row.", d: 4200, cues: [
        [300, "cam", "row", 1.3],
        [600, "chip", "st", "", "Booking…"],
        [1400, "type", "trk", "TRK-8842"],
        [2400, "chip", "st", "acc", "Booked"],
        [3100, "wide"], [3400, "settle", "row"],
      ]},
    ],
  },

  "track-deliveries": {
    crumb: "Work · Orders", cat: 2, h: 260, center: false,
    html:
      `<div style="max-width:440px">` +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", `<span class="t-mono">TRK-8841</span>`, "$59", chip("In transit", "", "s1")], t: "r1" },
        { c: ["Tomas", `<span class="t-mono">TRK-8842</span>`, "$38", chip("In transit", "", "s2")], t: "r2" },
        { c: ["Priya S.", `<span class="t-mono">TRK-8843</span>`, "$69", chip("In transit", "", "s3")], t: "r3" },
        { c: ["Omar K.", `<span class="t-mono">TRK-8844</span>`, "$19", chip("In transit", "", "s4")], t: "r4" },
      ]}) +
      `<div class="t-in" data-t="offer" style="margin-top:10px">${win("Returned parcel", `Restock <b>+1 Rose Dress</b>? ${chip("stock 11 → 12", "acc")}`)}</div>` +
      `</div>`,
    beats: [
      { cap: "Delivery statuses refresh themselves — no portal-checking.", d: 4600, cues: [
        [500, "flash", "r1"], [600, "chip", "s1", "acc", "Delivered"],
        [1600, "flash", "r2"], [1700, "chip", "s2", "acc", "Delivered"],
        [2400, "flash", "r3"], [2500, "chip", "s3", "acc", "Delivered"],
      ]},
      { cap: "A Returned parcel raises its hand…", d: 3600, cues: [
        [400, "flash", "r4"], [600, "chip", "s4", "warn", "Returned ↩"],
        [1100, "cam", "r4", 1.3],
      ]},
      { cap: "…and offers to restock.", d: 4000, cues: [
        [300, "show", "offer"], [700, "cam", "offer", 1.3],
        [2700, "wide"],
      ]},
    ],
  },

  "fetch-payouts": {
    crumb: "Money · Courier Cash", cat: 0, h: 275, center: false,
    html:
      `<div style="max-width:430px">` +
      `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">${btn("Fetch payouts ⬇", "fetch")}` +
      `<span class="t-in" data-t="sum" style="display:inline-flex;gap:6px;flex:none">${chip("6 reconciled ✓", "ok")}${chip("1 needs review", "warn")}</span></div>` +
      tbl({ head: ["Buyer", "Tracking", "Status"], rows: [
        { c: ["Anika", `<span class="t-mono">TRK-8841</span>`, chip("Delivered", "acc", "s1")], t: "r1" },
        { c: ["Tomas", `<span class="t-mono">TRK-8842</span>`, chip("Delivered", "acc", "s2")], t: "r2" },
        { c: ["Priya S.", `<span class="t-mono">TRK-8843</span>`, chip("Delivered", "acc", "s3")], t: "r3" },
        { c: ["Omar K.", `<span class="t-mono">TRK-8844</span>`, chip("Delivered", "acc", "s4")], t: "r4" },
        { c: ["Lena M.", `<span class="t-mono">TRK-8845</span>`, chip("Delivered", "acc", "s5")], t: "r5" },
        { c: ["Anika", `<span class="t-mono">TRK-8846</span>`, chip("Delivered", "acc", "s6")], t: "r6" },
      ]}) + `</div>`,
    beats: [
      { cap: "Where your courier supports it: fetch the payout statement with one click.", d: 3800, cues: [
        [300, "cam", "fetch", 1.3],
        [900, "cur", "fetch"], [1700, "click", "fetch"], [2000, "curx"],
        [2300, "toast", "Payout statement · <b>7 lines</b>"], [2500, "wide"],
      ]},
      { cap: "“6 orders reconciled · 1 line needs review.”", d: 4600, cues: [
        [0, "toastx"],
        [300, "flash", "r1"], [400, "chip", "s1", "ok", "Reconciled ✓"],
        [1200, "flash", "r2"], [1300, "chip", "s2", "ok", "Reconciled ✓"],
        [2000, "flash", "r3"], [2100, "chip", "s3", "ok", "Reconciled ✓"],
        [2650, "flash", "r4"], [2750, "chip", "s4", "ok", "Reconciled ✓"],
        [3150, "flash", "r5"], [3250, "chip", "s5", "ok", "Reconciled ✓"],
        [3550, "flash", "r6"], [3650, "chip", "s6", "ok", "Reconciled ✓"],
      ]},
      { cap: "Honest math, every time.", d: 4000, cues: [
        [300, "show", "sum"], [600, "cam", "sum", 1.35], [900, "pulse", "sum"],
        [2600, "wide"],
      ]},
    ],
  },

  "manual-remit": {
    crumb: "Money · Courier Cash", cat: 0, h: 275, center: false,
    html:
      `<div style="max-width:430px">` +
      win("Log a remittance", `your courier · Jul 11 · <b>$<span class="t-num" data-t="amt">—</span></b> ${btn("Log it", "log")} <span class="t-in" data-t="mt">${chip("4 orders → Reconciled ✓", "ok", "mtc")}</span>`, "rw") +
      `<div style="margin-top:10px">` +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", `<span class="t-mono">TRK-8841</span>`, "$59", chip("Delivered", "acc", "s1")], t: "r1" },
        { c: ["Tomas", `<span class="t-mono">TRK-8842</span>`, "$89", chip("Delivered", "acc", "s2")], t: "r2" },
        { c: ["Priya S.", `<span class="t-mono">TRK-8843</span>`, "$68", chip("Delivered", "acc", "s3")], t: "r3" },
        { c: ["Omar K.", `<span class="t-mono">TRK-8844</span>`, "$69", chip("Delivered", "acc", "s4")], t: "r4" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "Any courier, any payout…", d: 3200, cues: [
        [400, "cam", "rw", 1.3],
      ]},
      { cap: "…log what they paid you.", d: 4000, cues: [
        [300, "cur", "amt"], [1100, "click", "amt"],
        [1300, "count", "amt", 0, 285], [1450, "pulse", "amt"],
        [2300, "cur", "log"], [3100, "click", "log"], [3500, "curx"],
      ]},
      { cap: "Matched orders flip to Reconciled together.", d: 4600, cues: [
        [200, "wide"],
        [500, "flash", "r1"], [600, "chip", "s1", "ok", "Reconciled ✓"],
        [1000, "flash", "r2"], [1100, "chip", "s2", "ok", "Reconciled ✓"],
        [1400, "flash", "r3"], [1500, "chip", "s3", "ok", "Reconciled ✓"],
        [1750, "flash", "r4"], [1850, "chip", "s4", "ok", "Reconciled ✓"],
        [2500, "show", "mt"], [2700, "pulse", "mtc"],
        [3600, "settle", "rw"],
      ]},
    ],
  },

  "returns-restock": {
    crumb: "Work · Orders", cat: 2, h: 255, center: false,
    html:
      `<div style="max-width:430px">` +
      `<div style="margin-bottom:7px">${chip(`🌹 Rose Dress · stock <b class="t-num" data-t="stk">11</b>`, "", "stkc")}</div>` +
      tbl({ head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Lena M.", "Rose Dress ×1", "$59", chip("Out for delivery", "", "st")], t: "row" },
      ]}) +
      `<div class="t-in" data-t="exp" style="margin-top:10px">${win("Expenses", `Return delivery — <b>$10</b> ${chip("logged", "warn")}`)}</div>` +
      `</div>`,
    beats: [
      { cap: "A parcel comes back.", d: 3200, cues: [
        [400, "cam", "row", 1.25], [1000, "flash", "row"],
        [1200, "chip", "st", "warn", "Returned ↩"],
      ]},
      { cap: "First: put the product back on the shelf.", d: 3800, cues: [
        [300, "cam", "stkc", 1.4],
        [900, "count", "stk", 11, 12], [1000, "pulse", "stkc"],
        [1700, "settle", "stkc"],
      ]},
      { cap: "Then the honest part: a return cost you two delivery fees. Count it.", d: 4600, cues: [
        [300, "show", "exp"], [700, "cam", "exp", 1.3], [1200, "pulse", "exp"],
        [3100, "wide"],
      ]},
    ],
  },

  "phone-orders": {
    bare: true, h: 265,
    html: phone(
      `<div style="font-size:8px;font-weight:800;letter-spacing:.06em;color:var(--muted);margin:2px 0 6px">ORDERS · PENDING</div>` +
      `<div class="t-card" data-t="oc" style="padding:7px 8px;margin-bottom:6px">` +
      `<div class="t-crow" style="gap:6px"><b style="font-size:9.5px">Anika — $59</b>${light("g", "ocl")}</div>` +
      `<div class="cs">Rose Dress ×1 · COD</div>` +
      `<div style="margin-top:5px">${chip("→ swipe to confirm", "", "ocst")}</div></div>` +
      `<div class="t-card" style="padding:7px 8px;margin-bottom:8px">` +
      `<div class="t-crow" style="gap:6px"><b style="font-size:9.5px">Tomas — $38</b>${light("y")}</div>` +
      `<div class="cs">Silk Scarf ×2 · COD</div></div>` +
      `<div style="font-size:8px;font-weight:800;letter-spacing:.06em;color:var(--muted);margin:4px 0 5px">CONFIRMED</div>` +
      `<div data-t="gc" style="min-height:34px"></div>`,
      "ph"),
    beats: [
      { cap: "On your phone, orders become cards — everything important at a glance.", d: 3800, cues: [
        [400, "cam", "ph", 1.2], [1200, "pulse", "ocl"],
      ]},
      { cap: "Swipe to confirm.", d: 3600, cues: [
        [700, "cls", "oc", "pressed", 1], [900, "cls", "oc", "pressed", 0],
        [1100, "carry", "oc", "gc"],
        [1900, "chip", "ocst", "ok", "Confirmed ✓"],
      ]},
      { cap: "Packing with one hand, running the shop with the other.", d: 3800, cues: [
        [500, "settle", "oc"],
        [2400, "wide"],
      ]},
    ],
  },

  "catalog-shelf": {
    crumb: "Work · Catalog", cat: 2, h: 270,
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
      ]}) + `</div></div>`,
    beats: [
      { cap: "The Catalog window — every product in one place.", d: 3400, cues: [
        [300, "cam", "cw", 1.2],
      ]},
      { cap: "Add a product: photo, price, and stock if you track it.", d: 4000, cues: [
        [200, "cur", "add"], [1000, "click", "add"],
        [1250, "show", "np"], [1500, "pulse", "np"],
        [2100, "curx"],
      ]},
      { cap: "Underneath the window: a real board — one row per product.", d: 4600, cues: [
        [0, "wide"], [500, "cls", "wl", "up", 1],
        [1100, "row", "pb", rowCells(["Gift Bundle", "$69", "—"], "lrr")],
        [3400, "cls", "wl", "up", 0],
      ]},
    ],
  },

  "variants-sale": {
    crumb: "Work · Catalog", cat: 2, h: 245,
    html:
      `<div data-t="grp" style="display:flex;gap:16px;align-items:center">` +
      prod({ art: "dress", name: "Rose Dress", price: "$59", t: "p1" }) +
      `<div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start">` +
      `<div style="display:flex;gap:5px">${chip("S", "", "szS")}${chip("M", "acc", "szM")}${chip("L", "", "szL")}</div>` +
      `<div style="display:flex;gap:5px;flex-wrap:wrap">` +
      chip(`S · stock <b class="t-num">4</b>`) +
      chip(`M · stock <b class="t-num" data-t="ms">8</b>`, "", "msc") +
      chip(`L · stock <b class="t-num">3</b>`) + `</div>` +
      `<div class="t-in" data-t="livec">${chip("sale price wins — everywhere", "acc")}</div>` +
      `</div></div>`,
    beats: [
      { cap: "Options like size or color live on one product — not three copies.", d: 3600, cues: [
        [300, "cam", "grp", 1.3],
        [900, "pulse", "szS"], [1150, "pulse", "szM"], [1400, "pulse", "szL"],
      ]},
      { cap: "Set a sale price — it wins automatically, everywhere.", d: 4200, cues: [
        [200, "cur", "p1-pr"], [1000, "click", "p1-pr"],
        [1150, "text", "p1-pr", "<s>$59</s>$49"], [1250, "pulse", "p1-pr"],
        [1800, "curx"], [2300, "show", "livec"],
      ]},
      { cap: "Stock counts down on every sale — per option.", d: 4400, cues: [
        [200, "toast", "New order · Rose Dress · size <b>M</b>"],
        [1100, "count", "ms", 8, 7], [1200, "pulse", "msc"],
        [2600, "toastx"], [2900, "wide"], [3100, "settle", "msc"],
      ]},
    ],
  },

  "combo-bundle": {
    crumb: "Work · Catalog", cat: 2, h: 250,
    html:
      `<div style="display:flex;flex-direction:column;gap:12px;align-items:center">` +
      `<div data-t="grp" style="display:flex;gap:8px;align-items:center">` +
      prod({ art: "dress", name: "Rose Dress", price: "$59" }) +
      `<b style="font-size:13px">+</b>` +
      prod({ art: "scarf", name: "Silk Scarf", price: "$19" }) +
      `<span class="k-arrow"></span>` +
      `<span class="t-in" data-t="bt">${prod({ art: "bundle", name: "Gift Bundle", price: "$69", t: "bp" })}</span>` +
      `</div>` +
      `<div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">` +
      chip(`Rose Dress · stock <b class="t-num" data-t="ds">12</b>`, "", "dsc") +
      chip(`Silk Scarf · stock <b class="t-num" data-t="ss">30</b>`, "", "ssc") +
      `</div></div>`,
    beats: [
      { cap: "Two products become one bundle, with its own price.", d: 4200, cues: [
        [300, "cam", "grp", 1.2],
        [1300, "show", "bt"], [1600, "pulse", "bp"],
      ]},
      { cap: "A bundle sale draws down BOTH stocks…", d: 4600, cues: [
        [200, "toast", "New order · Gift Bundle ×1 · <b>$69</b>"],
        [400, "wide"],
        [1300, "count", "ds", 12, 11], [1400, "pulse", "dsc"],
        [2100, "count", "ss", 30, 29], [2200, "pulse", "ssc"],
        [3400, "toastx"],
      ]},
      { cap: "…honestly.", d: 3000, cues: [
        [400, "settle", "dsc"], [600, "settle", "ssc"],
      ]},
    ],
  },

  "form-builder": {
    crumb: "Work · Sales Form", cat: 2, h: 250, center: false,
    html:
      `<div style="display:flex;gap:14px;align-items:flex-start;max-width:440px">` +
      `<div class="t-win" style="min-width:122px;flex:none"><div class="wh">BLOCKS</div><div class="wb" style="flex-direction:column;align-items:stretch">` +
      chip("🛍 Products", "", "palP") + chip("🚚 Delivery details", "", "palD") + chip("💳 Payment", "", "palY") +
      `</div></div>` +
      `<div style="flex:1;min-width:0">` +
      `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">` +
      `<span style="font-size:10.5px;font-weight:700">New Sales Form</span>${btn("Publish", "pub")}</div>` +
      `<div class="k-frame sm" data-t="cv" style="display:flex;flex-direction:column;gap:7px;padding:14px 10px 10px">` +
      `<span class="k-flabel">YOUR FORM</span>` +
      `<div class="t-in" data-t="b1"><div class="t-card" style="padding:6px 9px;font-size:10px"><b>Delivery details</b><span style="color:var(--muted)"> — Name · Phone · Address</span></div></div>` +
      `<div class="t-in" data-t="b2"><div class="t-card" style="padding:6px 9px;font-size:10px"><b>Products</b><span style="color:var(--muted)"> — Rose Dress $59 · Silk Scarf $19</span></div></div>` +
      `<div class="t-in" data-t="b3"><div class="t-card" style="padding:6px 9px;font-size:10px"><b>Payment</b><span style="color:var(--muted)"> — Cash on delivery · Pay online</span></div></div>` +
      `<div class="t-in" data-t="lnk" style="text-align:center">${chip(`<span class="t-mono">yourshop.link/maya</span> · live ✓`, "ok")}</div>` +
      `</div></div></div>`,
    beats: [
      { cap: "Fields: what you ask the customer — name, phone, address.", d: 4000, cues: [
        [400, "cur", "palD"], [1300, "click", "palD"],
        [1500, "show", "b1"], [1750, "pulse", "b1"],
      ]},
      { cap: "The product picker is the heart of the form.", d: 3800, cues: [
        [200, "cur", "palP"], [1000, "click", "palP"],
        [1200, "show", "b2"], [1600, "cam", "b2", 1.35],
      ]},
      { cap: "Brand it, then Share to web — your shop is live.", d: 4600, cues: [
        [0, "wide"], [400, "cur", "palY"], [1100, "click", "palY"],
        [1250, "show", "b3"],
        [1800, "cur", "pub"], [2600, "click", "pub"],
        [2800, "show", "lnk"], [3200, "curx"], [3600, "settle", "lnk"],
      ]},
    ],
  },

  "shop-link": {
    crumb: "Work · Sales Form", cat: 2, h: 255, center: false,
    html:
      `<div style="max-width:300px">` +
      `<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;flex-wrap:wrap">` +
      btn("Publish", "pub") +
      `<span class="t-in" data-t="lnk">${chip(`<span class="t-mono">yourshop.link/maya</span> · copied ✓`, "acc")}</span></div>` +
      win("Catalog", prod({ art: "dress", name: "Rose Dress", price: "$59", t: "cp" }), "cw") +
      `</div>` +
      phone(
        `<div style="font-size:8px;font-weight:700;color:var(--muted);text-align:center;padding-bottom:4px;border-bottom:1px solid var(--border);margin-bottom:6px">Chat · Anika</div>` +
        `<div class="t-in" data-t="bub"><div class="t-bub" style="max-width:none">my shop 👇<span class="lc"><span class="t-mono">yourshop.link/maya</span></span></div></div>` +
        `<div class="t-in" data-t="unf" style="display:block;margin-top:6px">` +
        `<div style="border:1px solid var(--border);border-radius:8px;padding:6px 7px;background:var(--card)">` +
        `<div style="display:flex;gap:5px;align-items:center"><span style="width:16px;height:16px;border-radius:5px;background:var(--primary);color:#fff;font-size:7px;font-weight:800;display:grid;place-items:center;flex:none">MC</span><b style="font-size:8px">Maya's Closet</b></div>` +
        `<div style="font-size:7.5px;color:var(--muted);margin-top:3px;line-height:1.5">Rose Dress <b data-t="unfp">$59</b><br>Silk Scarf $19 · Gift Bundle $69</div>` +
        `</div></div>`,
        "ph"
      ).replace('class="t-phone"', 'class="t-phone" style="position:absolute;right:8px;bottom:8px;z-index:6"'),
    beats: [
      { cap: "Publishing gives you a short link, made for chat.", d: 3800, cues: [
        [300, "cur", "pub"], [1100, "click", "pub"],
        [1300, "show", "lnk"], [1500, "pulse", "lnk"], [2100, "curx"],
      ]},
      { cap: "Pasted in a chat, it unfurls: your shop's name, real products, live prices.", d: 4200, cues: [
        [200, "cam", "ph", 1.4],
        [700, "show", "bub"], [1800, "show", "unf"],
      ]},
      { cap: "Change a price in the Catalog — the live page updates on refresh.", d: 4600, cues: [
        [0, "wide"], [400, "cur", "cp-pr"], [1200, "click", "cp-pr"],
        [1350, "text", "cp-pr", "<s>$59</s>$54"], [1450, "pulse", "cp-pr"],
        [1950, "curx"],
        [2300, "cam", "ph", 1.4],
        [2800, "flash", "unf"], [2900, "text", "unfp", "$54"], [3000, "pulse", "unf"],
        [3900, "wide"],
      ]},
    ],
  },

  "shop-branding": {
    crumb: "Work · Sales Form", cat: 2, h: 245,
    html:
      win("Shop look",
        `<div style="display:block;width:100%">` +
        `<div style="display:flex;gap:5px">` +
        chip(`<span style="color:#4f8f8b">●</span> Teal`, "", "swT") +
        chip(`<span style="color:#c2607e">●</span> Rose`, "", "swR") +
        chip(`<span style="color:#c9973a">●</span> Sand`, "", "swS") + `</div>` +
        `<div style="margin-top:6px;font-size:9.5px;color:var(--muted)">logo · colors · cover</div></div>`,
        "look") +
      win("Form A — Sales", `<span class="t-in" data-t="iA">${chip("look: inherits ✓", "acc")}</span>`, "fA") +
      win("Form B — Preorders",
        `<span class="t-in" data-t="iB">${chip("look: inherits ✓", "acc")}</span>` +
        chip("background: inherited", "", "ovB"),
        "fB"),
    beats: [
      { cap: "Set your shop's look once…", d: 3600, cues: [
        [300, "cam", "look", 1.35],
        [800, "cur", "swR"], [1600, "click", "swR"],
        [1750, "chip", "swR", "acc", `<span style="color:#c2607e">●</span> Rose ✓`],
        [2200, "curx"],
      ]},
      { cap: "…every form inherits it.", d: 3800, cues: [
        [200, "wide"],
        [700, "flash", "fA"], [800, "show", "iA"],
        [1400, "flash", "fB"], [1500, "show", "iB"],
      ]},
      { cap: "Any form can override one piece — “this form only.”", d: 4400, cues: [
        [300, "cam", "fB", 1.3],
        [800, "cur", "ovB"], [1600, "click", "ovB"],
        [1750, "chip", "ovB", "warn", "background: its own — this form only"],
        [2300, "curx"], [3200, "wide"],
      ]},
    ],
  },

  "form-to-board": {
    crumb: "Work · Orders", cat: 2, h: 255, center: false,
    html:
      `<div style="max-width:440px">` +
      `<div style="margin-bottom:7px">${chip(`Rose Dress · stock <b class="t-num" data-t="stk">12</b>`, "", "stkc")}</div>` +
      tbl({ t: "ob", head: ["Name", "Phone", "Item", "Total"], aligns: "lllr", rows: [
        ["Priya S.", "…8830", "Silk Scarf ×1", "$19"],
      ]}) +
      `<div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">` +
      `<span class="t-in" data-t="m1">${chip("🕒 arrived 9:12 pm")}</span>` +
      `<span class="t-in" data-t="m2">${chip("🟢 fraud checked", "ok")}</span>` +
      `<span class="t-in" data-t="m3">${chip("Status: Pending")}</span>` +
      `<span class="t-in" data-t="m4">${chip("Matched: Anika ✓ — no duplicate", "ok")}</span>` +
      `</div></div>` +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div style="font-size:8px;padding:3px 1px;border-bottom:1px solid var(--border)">Name — <b>Anika</b></div>` +
        `<div style="font-size:8px;padding:3px 1px;border-bottom:1px solid var(--border)">Phone — <b>…4521</b></div>` +
        `<div style="font-size:8px;padding:3px 1px">Rose Dress ×1 — <b>$59</b></div>` +
        `<div class="t-place" data-t="place" style="margin-top:6px">Order — cash on delivery</div>` +
        success("psucc", "Order placed", "Rose Dress ×1 · pay $59 on delivery"),
        "ph"
      ).replace('class="t-phone"', 'class="t-phone" style="position:absolute;right:8px;bottom:8px;z-index:6"'),
    beats: [
      { cap: "A customer fills your form and taps Order…", d: 3400, cues: [
        [0, "cam", "ph", 1.45],
        [1400, "cls", "place", "pressed", 1], [1550, "cls", "place", "pressed", 0],
        [1750, "show", "psucc"],
      ]},
      { cap: "…and every answer flies to its own column on the Orders Board.", d: 4200, cues: [
        [0, "cls", "ph", "gone", 1], [150, "cam", "ob", 1.3],
        [500, "row", "ob", `<td><span data-t="c1">Anika</span></td><td><span data-t="c2">…4521</span></td><td><span data-t="c3">Rose Dress ×1</span></td><td class="r t-num"><span data-t="c4">$59</span></td>`],
        [1200, "pulse", "c1"], [1500, "pulse", "c2"], [1800, "pulse", "c3"], [2100, "pulse", "c4"],
      ]},
      { cap: "TaroGrid adds what you'd forget: arrival time, fraud check, status Pending.", d: 4200, cues: [
        [200, "wide"],
        [600, "show", "m1"], [1200, "show", "m2"], [1800, "show", "m3"],
      ]},
      { cap: "Stock counts down — and the customer matches by phone. No duplicate Anikas.", d: 4600, cues: [
        [300, "count", "stk", 12, 11], [400, "pulse", "stkc"],
        [1400, "show", "m4"], [1600, "settle", "m4"],
      ]},
    ],
  },

  "test-shop": {
    crumb: "Work · Orders", cat: 2, h: 255, center: false,
    html:
      `<div style="max-width:430px">` +
      tbl({ t: "ob", head: ["Buyer", "Item", "Total", "Check"], aligns: "llr", rows: [
        { c: ["Anika", "Silk Scarf ×1", "$19", chip("Delivered", "acc")], t: "seed" },
        { c: ["You", "Rose Dress ×1", "$59", chip("…", "", "hop") + ` <span data-t="del" style="font-size:10px;opacity:.75">🗑</span>`], cls: "new fresh", t: "trow" },
      ]}) +
      `<div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">` +
      `<span class="t-in" data-t="m2">${chip("stock 12 → 11")}</span>` +
      `<span class="t-in" data-t="m3">${chip("🚚 courier ready", "acc")}</span>` +
      `<span class="t-in" data-t="trash">${chip("🗑 moved to Trash — restorable", "warn")}</span>` +
      `</div></div>` +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid">${shopCard({ art: "dress", name: "Rose Dress", price: "$59" })}</div>` +
        `<div class="t-place" data-t="place" style="margin-top:7px">Order — cash on delivery</div>` +
        success("psucc", "Order placed", "Rose Dress ×1 · pay $59 on delivery"),
        "ph"
      ).replace('class="t-phone"', 'class="t-phone" style="position:absolute;right:8px;bottom:8px;z-index:6"'),
    beats: [
      { cap: "Before you share the link: order from yourself.", d: 3600, cues: [
        [0, "cam", "ph", 1.3],
        [1500, "cls", "place", "pressed", 1], [1650, "cls", "place", "pressed", 0],
        [1850, "show", "psucc"],
      ]},
      { cap: "Find your test order, check every hop worked.", d: 4600, cues: [
        [0, "cls", "ph", "gone", 1], [200, "cam", "ob", 1.25],
        [600, "cls", "trow", "landed", 1],
        [1400, "chip", "hop", "", "Checking…"],
        [2200, "chip", "hop", "ok", "🟢 fraud ✓"],
        [2900, "show", "m2"], [3500, "show", "m3"],
      ]},
      { cap: "Then delete it — Trash keeps it recoverable, like everything.", d: 4600, cues: [
        [300, "cur", "del"], [1200, "click", "del"],
        [1450, "cls", "trow", "landed", 0],
        [1900, "show", "trash"], [2100, "settle", "trash"],
        [2400, "curx"], [3400, "wide"],
      ]},
    ],
  },

  "edit-after-launch": {
    crumb: "Work · Catalog", cat: 2, h: 250,
    html:
      win("Catalog", prod({ art: "dress", name: "Rose Dress", price: "$59", t: "cp" }), "cw") +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid"><div class="t-scard" data-t="pg"><div class="si">${ART.dress}</div><div class="sb2"><div class="snm">Rose Dress</div><div class="spr" data-t="pgpr">$59</div></div></div></div>`,
        "ph") +
      win("Yesterday's order", `Anika · Rose Dress ×1 · <b data-t="oldpr">$59</b>`, "ow"),
    beats: [
      { cap: "Edit price, photo, or stock in the Catalog — the one true place.", d: 4200, cues: [
        [300, "cam", "cw", 1.3],
        [900, "cur", "cp-pr"], [1700, "click", "cp-pr"],
        [1900, "text", "cp-pr", "<s>$59</s>$54"], [2000, "pulse", "cp-pr"],
        [2600, "curx"],
      ]},
      { cap: "Your live shop follows.", d: 3600, cues: [
        [200, "cam", "ph", 1.4],
        [900, "flash", "pg"],
        [1000, "text", "pgpr", `<s style="opacity:.65">$59</s> $54`], [1100, "pulse", "pg"],
      ]},
      { cap: "Old orders keep their original prices.", d: 4200, cues: [
        [200, "cam", "ow", 1.35],
        [800, "flash", "ow"], [1000, "pulse", "oldpr"],
        [2600, "wide"], [3000, "settle", "ow"],
      ]},
    ],
  },

  "two-doors": {
    bare: true, h: 265,
    html:
      `<div style="display:flex;flex-direction:column;gap:6px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:18px;justify-content:center;flex-wrap:wrap">` +
      `<div class="k-frame sm" data-t="f1"><span class="k-flabel">MAYA'S CLOSET</span>` +
      `<div style="display:flex;flex-direction:column;gap:2px;align-items:center">` +
      win("Sales form", "Products · Payment · Delivery") +
      `<span class="k-arrow" style="transform:rotate(90deg);margin:7px 0;width:24px"></span>` +
      `<div style="width:168px"><div style="font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--muted);margin-bottom:2px">ORDERS BOARD</div>` +
      tbl({ t: "ob", head: ["Buyer", "Total"], aligns: "lr", rows: [["Anika", "$59"]] }) +
      `</div></div></div>` +
      `<div class="k-frame sm" data-t="f2"><span class="k-flabel">ATLAS STUDIO</span>` +
      `<div style="display:flex;flex-direction:column;gap:2px;align-items:center">` +
      win("Client request", "Name · Brief · Deadline") +
      `<span class="k-arrow" style="transform:rotate(90deg);margin:7px 0;width:24px"></span>` +
      `<div style="width:168px"><div style="font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--muted);margin-bottom:2px">REQUESTS BOARD</div>` +
      tbl({ t: "rb", head: ["Client", "Ask"], rows: [["Omar K.", "Brand kit"]] }) +
      `</div></div></div></div>` +
      `<div class="t-in" data-t="pay">${chip("form → row · always", "ok")}</div>` +
      `</div>`,
    beats: [
      { cap: "The Sales Form: a door for customers — products, payment, delivery.", d: 4200, cues: [
        [300, "cam", "f1", 1.2],
        [1400, "row", "ob", rowCells(["Tomas", "$59"], "lr")],
      ]},
      { cap: "An intake form: a door for requests — straight onto a Work board.", d: 4200, cues: [
        [0, "wide"], [400, "cam", "f2", 1.2],
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

  // ═══════════════ Chapter 8 · Money ═══════════════
  "money-map": {
    bare: true, h: 245,
    html:
      `<div style="display:flex;flex-direction:column;gap:13px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="min">` +
      `<span style="font-size:8px;font-weight:800;letter-spacing:.06em;color:var(--muted)">IN</span>` +
      flowStep("mi1", chip("order"), true) +
      flowStep("mi2", chip("invoice")) +
      flowStep("mi3", chip("payment", "acc")) +
      flowStep("mi4", chip("receipt", "acc")) +
      `</div>` +
      `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="mout">` +
      `<span style="font-size:8px;font-weight:800;letter-spacing:.06em;color:var(--muted)">OUT</span>` +
      `<span class="t-in" data-t="mo1">${chip("📉 ads $20")}</span>` +
      `<span class="t-in" data-t="mo2">${chip("packaging $8")}</span>` +
      `</div>` +
      `<div class="t-in" data-t="net">${win("Net this month",
        `<b class="t-num" data-t="netv" style="font-size:14px">+$0</b><span class="t-in" data-t="nettick" style="color:var(--t-ok);font-weight:800">✓</span>`, "netw")}</div>` +
      `</div>`,
    beats: [
      { cap: "Money in: an order becomes an invoice, a payment, a receipt.", d: 4200, cues: [
        [400, "show", "mi1"], [1100, "show", "mi2"], [1800, "show", "mi3"], [2500, "show", "mi4"],
      ]},
      { cap: "Money out: expenses, logged as they happen.", d: 3800, cues: [
        [300, "show", "mo1"], [1100, "show", "mo2"], [1700, "cam", "mout", 1.35], [3000, "wide"],
      ]},
      { cap: "And the one number that matters: net — did I make money?", d: 4200, cues: [
        [300, "show", "net"], [600, "cam", "netw", 1.4], [900, "count", "netv", 0, 486, "+$"],
        [1700, "show", "nettick"], [2000, "settle", "netw"], [3300, "wide"],
      ]},
    ],
  },

  "first-invoice": {
    crumb: "Money · Invoices", cat: 0, h: 245,
    html:
      `<div style="display:flex;flex-direction:column;gap:10px;align-items:center">` +
      win(`INVOICE <span class="t-mono" style="color:var(--muted);font-weight:600" data-t="num">№ —</span>`,
        `<div style="display:block;width:100%;min-width:210px">` +
        `<div class="t-in" data-t="li1" style="display:flex;justify-content:space-between;gap:14px;padding:2px 0">Rose Dress ×1 <b class="t-num">$59</b></div>` +
        `<div class="t-in" data-t="li2" style="display:flex;justify-content:space-between;gap:14px;padding:2px 0">Silk Scarf ×2 <b class="t-num">$38</b></div>` +
        `<div style="display:flex;justify-content:space-between;gap:14px;border-top:1px solid var(--border);margin-top:6px;padding-top:5px">Total <b class="t-num" data-t="tot">$0</b></div>` +
        `</div>`, "invw") +
      `<div class="t-in" data-t="dch">${chip("DRAFT — no number until published")}</div>` +
      `</div>`,
    beats: [
      { cap: "Line items, right on the invoice: product, quantity, price.", d: 3800, cues: [
        [300, "cam", "invw", 1.35], [900, "show", "li1"],
        [1200, "count", "tot", 0, 59, "$"], [1300, "pulse", "tot"],
      ]},
      { cap: "The total builds itself as you type.", d: 3600, cues: [
        [400, "show", "li2"], [800, "count", "tot", 59, 97, "$"], [900, "pulse", "tot"],
      ]},
      { cap: "It's a draft — no number yet, edit freely.", d: 4000, cues: [
        [300, "show", "dch"], [600, "pulse", "num"], [1200, "pulse", "dch"], [2700, "wide"],
      ]},
    ],
  },

  "publish-invoice": {
    crumb: "Money · Invoices", cat: 0, h: 245, center: false,
    html:
      `<div class="t-view" data-t="v1"><div style="display:flex;flex-direction:column;gap:10px;align-items:center">` +
      win("Invoice — Anika", `Rose Dress ×1 · <b>$59</b> ${chip("DRAFT", "", "numc")} <span class="t-in in" data-t="pubw">${btn("Publish", "pub")}</span>`, "iw") +
      `<div class="t-in" data-t="vw">${chip("👁 Viewed · 2:14 pm", "acc")}</div>` +
      `</div></div>` +
      `<div class="t-view off" data-t="v2">` +
      phone(
        `<div style="font-size:7.5px;font-weight:800;letter-spacing:.06em;color:var(--muted)">MAYA'S CLOSET</div>` +
        `<div class="t-mono" style="font-size:10px;font-weight:800;margin:2px 0 6px">INV-2026-014</div>` +
        `<div class="t-totrow"><span>Rose Dress ×1</span><span>$59</span></div>` +
        `<div class="t-totrow grand"><span>Total due</span><span>$59</span></div>` +
        `<div class="t-place">Download PDF</div>`,
        "ph") +
      `</div>`,
    beats: [
      { cap: "Publish mints a real number — never reused, never edited after.", d: 4200, cues: [
        [300, "cam", "iw", 1.3], [900, "cur", "pub"], [1700, "click", "pub"],
        [1900, "chip", "numc", "acc", "INV-2026-014 ✓"], [2100, "pulse", "numc"],
        [2400, "hide", "pubw"], [2600, "curx"], [3400, "wide"],
      ]},
      { cap: "Your customer gets a public page — no account needed.", d: 4200, cues: [
        [100, "cls", "v1", "off", 1], [300, "cls", "v2", "off", 0], [900, "cam", "ph", 1.35],
      ]},
      { cap: "When they open it, you see it: Viewed.", d: 4200, cues: [
        [0, "wide"], [100, "cls", "v2", "off", 1], [300, "cls", "v1", "off", 0],
        [600, "toast", "<b>Anika</b> opened INV-2026-014"],
        [1100, "show", "vw"], [1400, "cam", "vw", 1.4], [1900, "settle", "vw"],
        [3000, "toastx"], [3300, "wide"],
      ]},
    ],
  },

  "gateway-connect": {
    crumb: "Money · Settings · Payments", cat: 0, h: 255, center: false,
    html:
      `<div class="t-view" data-t="v1">` +
      win("Settings · Payments", `Gateway ${chip("Not connected", "", "gst")} ${btn("Connect", "cbtn")}`, "sw") +
      `</div>` +
      `<div class="t-view off" data-t="v2">` +
      phone(
        `<div style="font-size:7.5px;font-weight:800;letter-spacing:.06em;color:var(--muted)">MAYA'S CLOSET</div>` +
        `<div class="t-mono" style="font-size:10px;font-weight:800;margin:2px 0 6px">INV-2026-014</div>` +
        `<div class="t-totrow"><span>Rose Dress ×1</span><span>$59</span></div>` +
        `<div class="t-totrow grand"><span>Total due</span><span>$59</span></div>` +
        `<div class="t-place" data-t="payb">Pay $59</div>` +
        success("psucc", "Payment received", "$59 · verified real"),
        "ph") +
      `<div style="display:flex;flex-direction:column;gap:8px;align-items:center">` +
      win("Invoice — Anika", `$59 ${chip("Sent", "acc", "pst")}`, "iw2") +
      `<div class="t-in" data-t="rc">${chip("receipt minted → RCT-091", "ok")}</div>` +
      `</div></div>`,
    beats: [
      { cap: "Connect your payment gateway once, in Settings.", d: 4200, cues: [
        [300, "cam", "sw", 1.35], [900, "cur", "cbtn"], [1700, "click", "cbtn"],
        [1900, "chip", "gst", "acc", "Connected ✓"], [2400, "curx"], [3200, "wide"],
      ]},
      { cap: "Every public invoice grows a Pay button.", d: 3600, cues: [
        [100, "cls", "v1", "off", 1], [300, "cls", "v2", "off", 0],
        [900, "cam", "ph", 1.3], [1400, "pulse", "payb"],
      ]},
      { cap: "Real money verified → Paid stamps itself. No screenshots accepted.", d: 4600, cues: [
        [200, "cls", "payb", "pressed", 1], [350, "cls", "payb", "pressed", 0],
        [700, "show", "psucc"], [1300, "wide"],
        [1700, "chip", "pst", "ok", "PAID ✓"], [2100, "show", "rc"], [2500, "settle", "iw2"],
      ]},
    ],
  },

  "expense-ask": {
    crumb: "Money · Expenses", cat: 0, h: 245,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div style="width:min(280px,90%)" data-t="askw">${ask("askt")}</div>` +
      `<div class="t-in" data-t="cc">${win("New expense?", `Ads — <b>$20</b> · today ${btn("Confirm", "cf")}`, "ccw")}</div>` +
      `<div style="display:flex;gap:8px" data-t="res">` +
      `<span class="t-in" data-t="r1">${chip("logged ✓", "ok")}</span>` +
      `<span class="t-in" data-t="r2">${chip("net updated")}</span>` +
      `</div></div>`,
    beats: [
      { cap: "The fastest expense entry is a sentence.", d: 3800, cues: [
        [300, "cam", "askw", 1.4], [900, "type", "askt", "spent 20 on boost"],
      ]},
      { cap: "ASK shows a confirm card — nothing happens until you agree.", d: 3800, cues: [
        [300, "show", "cc"], [700, "cam", "cc", 1.35],
      ]},
      { cap: "Confirmed — and your net already knows.", d: 4200, cues: [
        [200, "cur", "cf"], [1000, "click", "cf"],
        [1200, "show", "r1"], [1600, "show", "r2"], [1800, "curx"],
        [2200, "wide"], [2600, "settle", "res"],
      ]},
    ],
  },

  // ═══════════════ Chapter 2 · Boards & views ═══════════════
  "build-board": {
    crumb: "Work · Deliveries", cat: 2, h: 240, center: false,
    html:
      `<div style="max-width:380px">` +
      `<div style="font-size:12.5px;font-weight:800;margin-bottom:7px" data-t="bname"><span data-t="bnt"></span><span style="color:var(--muted);font-weight:500;font-size:10px"> · new board</span></div>` +
      `<table class="t-tbl"><thead><tr data-t="hd">` +
      `<th><span class="t-in" data-t="c1">Buyer</span></th>` +
      `<th><span class="t-in" data-t="c2">Item</span></th>` +
      `<th style="text-align:right"><span class="t-in" data-t="c3">Cash due</span></th>` +
      `</tr></thead>` +
      `<tbody>${bandRow("g1", "NEW")}</tbody>` +
      `<tbody data-t="nb"></tbody>` +
      `<tbody>${bandRow("g2", "DONE", true)}</tbody>` +
      `</table></div>`,
    beats: [
      { cap: "A blank board. Name it for what a row will be: “Deliveries.”", d: 3400, cues: [
        [400, "cam", "bname", 1.5], [1100, "type", "bnt", "Deliveries"],
      ]},
      { cap: "Groups appear — stages you'd say out loud.", d: 3600, cues: [
        [200, "wide"], [700, "show", "g1"], [1500, "show", "g2"],
      ]},
      { cap: "Columns: one fact each.", d: 3400, cues: [
        [200, "cam", "hd", 1.3], [500, "show", "c1"], [1000, "show", "c2"], [1500, "show", "c3"],
      ]},
      { cap: "Rows will do the rest.", d: 3600, cues: [
        [300, "wide"], [800, "row", "nb", rowCells(["Anika", "Rose Dress ×1", "$59"], "llr")],
        [1700, "settle", "nb"],
      ]},
    ],
  },

  "item-panel": {
    crumb: "Work · Orders", cat: 2, h: 250, center: false,
    html:
      `<div style="max-width:440px;display:flex;gap:12px;align-items:flex-start">` +
      `<div style="flex:1;min-width:0">` +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59"], t: "arow" },
        ["Tomas", "Silk Scarf ×2", "$38"],
        ["Priya S.", "Gift Bundle ×1", "$69"],
      ]}) + `</div>` +
      `<div class="t-in" data-t="panel" style="width:172px;flex:none">` +
      win("Anika — Rose Dress ×1",
        `<div style="display:block;width:100%">` +
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0">Status ${chip("Booked", "acc")}</div>` +
        `<div style="display:flex;justify-content:space-between;padding:2px 0">Total <b class="t-num">$59</b></div>` +
        `<div data-t="meta" style="padding:3px 0;color:var(--muted)">💬 2 comments · 📎 1 file</div>` +
        `<div data-t="hist" style="padding:2px 0;color:var(--muted)"><span style="letter-spacing:2px">●●●</span> every change kept</div>` +
        `</div>`, "pwin") +
      `</div></div>`,
    beats: [
      { cap: "Click a row — the Item panel slides in.", d: 3800, cues: [
        [300, "cur", "arow"], [1100, "click", "arow"], [1250, "cls", "arow", "fresh", 1],
        [1450, "show", "panel"], [1700, "cam", "panel", 1.25], [2100, "curx"],
      ]},
      { cap: "Everything about one thing, in one place — fields, files, comments.", d: 4200, cues: [
        [0, "cls", "arow", "fresh", 0], [500, "pulse", "meta"], [1500, "flash", "meta"],
      ]},
      { cap: "…including who changed what, and when.", d: 3400, cues: [
        [300, "cam", "hist", 1.45], [700, "pulse", "hist"],
        [1900, "wide"], [2300, "settle", "pwin"],
      ]},
    ],
  },

  "views-glasses": {
    crumb: "Work · Orders", cat: 2, h: 255, center: false,
    html:
      `<div class="t-view" data-t="v1"><div style="width:min(340px,94%)">` +
      vtabs(0) +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59"], t: "tr1" },
        ["Tomas", "Silk Scarf ×2", "$38"],
        ["Priya S.", "Gift Bundle ×1", "$69"],
      ]}) + `</div></div>` +
      `<div class="t-view off" data-t="v2"><div>` +
      vtabs(1) +
      kanban([
        { name: "Pending", dot: "var(--t-warn)", cards: [
          { name: "Anika — $59", sub: "Rose Dress ×1", t: "kA" },
          { name: "Priya S. — $69", sub: "Gift Bundle ×1" },
        ]},
        { name: "Confirmed", dot: "var(--primary)", cards: [
          { name: "Tomas — $38", sub: "Silk Scarf ×2" },
        ]},
      ]) + `</div></div>` +
      `<div class="t-view off" data-t="v3"><div>` +
      vtabs(2) +
      `<div style="border:1px solid var(--border);border-radius:9px;overflow:hidden;width:250px;background:var(--card)" data-t="cal">` +
      `<div style="font-size:8.5px;font-weight:800;letter-spacing:.05em;padding:5px 9px;border-bottom:1px solid var(--border)">MARCH</div>` +
      `<div style="display:grid;grid-template-columns:repeat(5,1fr);border-bottom:1px solid var(--border)">${["Mon", "Tue", "Wed", "Thu", "Fri"]
        .map((d) => `<span style="font-size:7px;font-weight:700;color:var(--muted);text-align:center;padding:2px 0">${d}</span>`).join("")}</div>` +
      `<div style="display:grid;grid-template-columns:repeat(5,1fr)">${[9, 10, 11, 12, 13]
        .map((n, i) => `<div style="min-height:44px;padding:3px;border-right:${i < 4 ? "1px solid var(--border)" : "0"}">` +
          `<div style="font-size:7px;color:var(--muted)">${n}</div>` +
          (n === 10 ? calChip("Anika", "acc", "calA") : n === 12 ? calChip("Tomas", "") : n === 13 ? calChip("Priya S.", "") : "") +
          `</div>`).join("")}</div>` +
      `</div></div></div>`,
    beats: [
      { cap: "The board is the data. A view is a pair of glasses.", d: 3400, cues: [
        [700, "flash", "tr1"],
      ]},
      { cap: "Same rows as cards on a Kanban — drag between stages.", d: 4000, cues: [
        [0, "cls", "v1", "off", 1], [260, "cls", "v2", "off", 0],
        [800, "cam", "kA", 1.35], [1100, "pulse", "kA"], [2900, "wide"],
      ]},
      { cap: "Same rows on a Calendar — anything with a date has a place.", d: 4000, cues: [
        [0, "cls", "v2", "off", 1], [260, "cls", "v3", "off", 0],
        [800, "cam", "calA", 1.5], [1100, "pulse", "calA"], [2900, "wide"],
      ]},
      { cap: "Three views, one board — the data never moved.", d: 3200, cues: [
        [500, "settle", "cal"],
      ]},
    ],
  },

  "table-mastery": {
    crumb: "Work · Orders", cat: 2, h: 268, center: false,
    html:
      `<div style="max-width:330px">` +
      `<table class="t-tbl"><thead><tr data-t="hr">` +
      `<th>Buyer</th><th><span data-t="tmh2">Item</span></th><th><span data-t="tmh3">Total</span></th>` +
      `</tr></thead><tbody>` +
      TM_ROWS.map((r, i) =>
        `<tr${i === 4 ? ' data-t="r4"' : ""}><td>${r[0]}</td><td><span data-t="tmi${i}">${r[1]}</span></td><td><span data-t="tmt${i}" class="t-num">${r[2]}</span></td></tr>`
      ).join("") +
      `</tbody></table>` +
      `<div style="display:flex;gap:6px;margin-top:7px;min-height:20px">` +
      `<span class="t-in" data-t="pin">${chip("header stays ⤓", "acc")}</span>` +
      `<span class="t-in" data-t="mv">${chip("↔ column moved")}</span>` +
      `</div></div>`,
    beats: [
      { cap: "Pin the header — scroll 5,000 rows without losing the labels.", d: 4200, cues: [
        [500, "cam", "r4", 1.15], [1300, "flash", "hr"], [1700, "show", "pin"], [3300, "wide"],
      ]},
      { cap: "Drag columns into your order; resize to fit your eyes.", d: 4600, cues: [
        [100, "hide", "pin"],
        [300, "cur", "tmh3"], [1000, "click", "tmh3"], [1200, "cur", "tmh2"],
        [1850, "flash", "hr"], [1900, "text", "tmh2", "Total"], [1900, "text", "tmh3", "Item"],
        ...tmSwapCues,
        [2400, "show", "mv"], [2900, "curx"],
      ]},
      { cap: "Arrange the view all you like — the rows underneath never change.", d: 3400, cues: [
        [400, "settle", "hr"], [1400, "hide", "mv"],
      ]},
    ],
  },

  "filter-stack": {
    crumb: "Work · Orders", cat: 2, h: 250, center: false,
    html:
      `<div style="max-width:420px">` +
      `<div style="display:flex;gap:6px;align-items:center;margin-bottom:8px;flex-wrap:wrap" data-t="bar">` +
      `<span class="t-chip" data-t="fbtn">Filter +</span>` +
      `<span class="t-in" data-t="f1">${chip("Status: Pending ✕", "acc")}</span>` +
      `<span class="t-in" data-t="f2">${chip("City: Riverside ✕", "acc")}</span>` +
      `<span class="t-in" data-t="clr" style="font-size:9.5px;font-weight:700;color:var(--muted)">clear ✕</span>` +
      `<span style="margin-left:auto">${chip(`<span class="t-num" data-t="cnt">214</span>&nbsp;rows`, "", "cntc")}</span>` +
      `</div>` +
      tbl({ head: ["Buyer", "City", "Status"], rows: [
        { c: ["Anika", "Riverside", chip("Pending", "warn")], t: "p0" },
        { c: ["Tomas", "Kingsport", chip("Pending", "warn")], t: "p1" },
        { c: ["Priya S.", "Riverside", chip("Shipped", "acc")], t: "p2" },
        { c: ["Omar K.", "Hillview", chip("Confirmed", "acc")], t: "p3" },
      ]}) + `</div>`,
    beats: [
      { cap: "Stack filters like sentences: Status is Pending…", d: 4200, cues: [
        [300, "cam", "bar", 1.3], [800, "cur", "fbtn"], [1600, "click", "fbtn"],
        [1800, "show", "f1"], [2300, "wide"],
        [2600, "cls", "p2", "dim", 1], [2700, "cls", "p3", "dim", 1],
        [2900, "count", "cnt", 214, 42], [3000, "pulse", "cntc"],
      ]},
      { cap: "…and City is Riverside. The count updates live.", d: 4200, cues: [
        [600, "click", "fbtn"], [800, "show", "f2"],
        [1400, "cls", "p1", "dim", 1],
        [1700, "count", "cnt", 42, 7], [1800, "pulse", "cntc"],
        [2800, "show", "clr"],
      ]},
      { cap: "Clear the chips, everything returns. Filters hide, never delete.", d: 4600, cues: [
        [300, "cur", "clr"], [1100, "click", "clr"],
        [1300, "hide", "f1"], [1400, "hide", "f2"], [1450, "hide", "clr"],
        [1600, "cls", "p1", "dim", 0], [1650, "cls", "p2", "dim", 0], [1700, "cls", "p3", "dim", 0],
        [1900, "count", "cnt", 7, 214], [2000, "pulse", "cntc"],
        [2400, "curx"], [2900, "settle", "cntc"],
      ]},
    ],
  },

  "undo-trash": {
    crumb: "Work · Orders", cat: 2, h: 245, center: false,
    html:
      `<div style="display:flex;gap:14px;align-items:flex-start;max-width:460px">` +
      `<div style="flex:1;min-width:0">` +
      `<table class="t-tbl"><thead><tr><th>Buyer</th><th>Item</th><th style="text-align:right">Total</th><th></th></tr></thead><tbody data-t="ob">` +
      `<tr><td>Tomas</td><td>Silk Scarf ×2</td><td class="r t-num">$38</td><td></td></tr>` +
      `<tr><td>Priya S.</td><td>Gift Bundle ×1</td><td class="r t-num">$69</td><td></td></tr>` +
      `<tr class="t-in in" data-t="arow"><td style="border-bottom:0">Anika</td><td style="border-bottom:0">Rose Dress ×1</td><td class="r t-num" style="border-bottom:0">$59</td><td style="border-bottom:0"><span data-t="del" style="color:var(--muted)">🗑</span></td></tr>` +
      `</tbody></table>` +
      `<div class="t-in" data-t="undoc" style="margin-top:9px">${chip("Undo import · 500 rows swept back")}</div>` +
      `</div>` +
      `<div style="width:180px;flex:none">` +
      win("Trash",
        `<div style="display:block;width:100%">` +
        `<div data-t="tz" style="min-height:16px;color:var(--muted)">empty</div>` +
        `<div class="t-in" data-t="trow2" style="display:flex;gap:6px;align-items:center;margin-top:6px">${chip("restorable", "warn")}${btn("Restore", "rbtn", "o")}</div>` +
        `</div>`, "twin") +
      `</div></div>`,
    beats: [
      { cap: "Deleted something? It went to Trash — not to heaven.", d: 4200, cues: [
        [300, "cur", "del"], [1100, "click", "del"], [1300, "hide", "arow"],
        [1500, "text", "tz", `Anika — Rose Dress ×1 · <b>$59</b>`],
        [1600, "show", "trow2"], [1800, "cam", "twin", 1.3], [1900, "curx"], [2300, "pulse", "twin"],
      ]},
      { cap: "Restore brings it back, history and all.", d: 4200, cues: [
        [300, "cur", "rbtn"], [1100, "click", "rbtn"],
        [1300, "show", "arow"], [1400, "text", "tz", "empty"],
        [1600, "curx"], [1900, "hide", "trow2"], [2000, "wide"],
        [2400, "flash", "arow"], [2700, "settle", "arow"],
      ]},
      { cap: "And a 500-row import? One undo step. Never be afraid to click.", d: 4200, cues: [
        [400, "show", "undoc"], [900, "cam", "undoc", 1.35], [1200, "pulse", "undoc"],
        [3000, "wide"],
      ]},
    ],
  },

  // ═══════════════ Chapter 11 · Automations ═══════════════
  "rule-anatomy": {
    crumb: "Work · Automation Studio", cat: 2, h: 260,
    html:
      `<div style="display:flex;flex-direction:column;gap:4px;align-items:center;width:min(330px,92%)" data-t="stack">` +
      `<div class="t-in" data-t="c1" style="width:100%">${win("TRIGGER", `invoice becomes ${chip("Overdue", "bad")}`, "", "width:100%")}</div>` +
      `<div class="t-in" data-t="a1" style="color:var(--muted);font-size:10px;line-height:1.1">↓</div>` +
      `<div class="t-in" data-t="c2" style="width:100%">${win("CHECK", `amount over <b>$50</b>?`, "", "width:100%")}</div>` +
      `<div class="t-in" data-t="a2" style="color:var(--muted);font-size:10px;line-height:1.1">↓</div>` +
      `<div class="t-in" data-t="c3" style="display:flex;gap:8px;width:100%">` +
      win("THEN", "remind the customer", "cthen", "flex:1;min-width:0") +
      win("ELSE", "just tell me", "celse", "flex:1;min-width:0") +
      `</div></div>`,
    beats: [
      { cap: "Trigger: the event the rule watches.", d: 3800, cues: [
        [400, "show", "c1"], [800, "cam", "c1", 1.3],
      ]},
      { cap: "Check: an optional question — only act if this is true.", d: 3800, cues: [
        [200, "show", "a1"], [500, "show", "c2"], [900, "cam", "c2", 1.3],
      ]},
      { cap: "Then / Else: what happens — and what happens otherwise.", d: 4200, cues: [
        [200, "show", "a2"], [500, "show", "c3"], [900, "cam", "c3", 1.25],
        [1400, "pulse", "cthen"], [2000, "pulse", "celse"],
      ]},
      { cap: "Three slots you can read aloud — every rule you'll ever build.", d: 3200, cues: [
        [300, "wide"], [900, "settle", "stack"],
      ]},
    ],
  },
};
