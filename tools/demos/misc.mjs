// ASK (Ch 12), Settings/apps (Ch 17/18), kanban-drag, advance-shield demos.
// Grammar + authoring rules: see ../theater.mjs and ../demos.mjs.

import {
  chip, light, tgl, btn, kpis, tbl, trow, rowCells, card, win, ask, life,
  task, prod, phone, shopHead, shopCard, bubble, success, kanban, ART,
} from "../theater.mjs";

// One mini order card shared by the multi-device demos — the SAME order
// (Anika · #MC-1041 · Rose Dress $59) on every screen, so sync reads concrete.
const devOrder = (stT) =>
  `<div style="display:block"><div style="font-weight:700">Anika · <span class="t-mono">#MC-1041</span></div>` +
  `<div style="margin:3px 0 5px">Rose Dress ×1 — <b class="t-num">$59</b></div>${chip("Pending", "warn", stT)}</div>`;

const offOrder = (vT) =>
  `<div style="display:block"><div style="font-weight:700">Anika · <span class="t-mono">#MC-1041</span> · Rose Dress ×1</div>` +
  `<div style="margin-top:4px">total → <b class="t-num" data-t="${vT}">—</b></div></div>`;

export const DEMOS_MISC = {
  "kanban-drag": {
    crumb: "Work · Orders · Kanban", cat: 2, h: 350, center: false,
    html:
      `<div style="max-width:430px">` +
      kanban([
        { name: "Pending", dot: "var(--t-warn)", t: "colP", cards: [
          { name: "Anika — $59", sub: "Rose Dress ×1", t: "kc" },
          { name: "Omar K. — $38", sub: "Silk Scarf ×2" },
        ]},
        { name: "Confirmed", dot: "var(--primary)", t: "colC", cards: [
          { name: "Tomas — $19", sub: "Silk Scarf ×1", t: "kcT" },
        ]},
        { name: "Done", dot: "var(--t-ok)", t: "colD", cards: [
          { name: "Lena M. — $59", sub: "Rose Dress ×1" },
        ]},
      ]) +
      `<div style="margin-top:4px">` +
      tbl({ head: ["Buyer", "Items", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59", chip("Pending", "warn", "tstat")], t: "trow" },
        { c: ["Omar K.", "Silk Scarf ×2", "$38", chip("Pending", "warn")], t: "trowO" },
        { c: ["Tomas", "Silk Scarf ×1", "$19", chip("Confirmed", "acc", "tstatT")], t: "trowT" },
        { c: ["Lena M.", "Rose Dress ×1", "$59", chip("Done", "ok")], t: "trowL" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "Same orders, two glasses: cards on a Kanban, rows in the Table — one board underneath.", d: 3800, cues: [
        [2000, "cam", "colP", 1.18],
      ]},
      { cap: "Drag Anika's card from Pending to Confirmed…", d: 3800, cues: [
        [100, "cur", "kc"], [900, "click", "kc"],
        [1100, "carry", "kc", "colC"], [1100, "cur", "colC"],
        [2300, "curx"],
      ]},
      { cap: "…and in the Table below, her status cell flips too. One truth, many glasses.", d: 3800, cues: [
        [300, "cam", "trow", 1.3], [900, "flash", "trow"],
        [1100, "chip", "tstat", "acc", "Confirmed"],
      ]},
      { cap: "The drag was an edit — same as typing it into the row.", d: 3200, cues: [
        [300, "wide"], [900, "settle", "trow"],
      ]},
      { cap: "It works hands-free too: the courier marks Tomas delivered — his card moves itself.", d: 4800, cues: [
        [400, "carry", "kcT", "colD"],
        [1400, "cam", "trowT", 1.3], [1900, "flash", "trowT"],
        [2100, "chip", "tstatT", "ok", "Done ✓"],
        [3400, "wide"],
      ]},
    ],
  },

  // ═══════════════ Chapter 12 · ASK ═══════════════,

  "ask-three": {
    crumb: "ASK · ⌘K", cat: 2, h: 265,
    html:
      `<div style="display:flex;flex-direction:column;gap:12px;align-items:center;width:100%">` +
      `<div style="width:min(320px,94%)" data-t="bar">${ask("at")}</div>` +
      `<div style="position:relative;width:min(320px,94%);height:106px">` +
      `<div class="t-in" data-t="fw" style="position:absolute;left:0;right:0;top:0">${win("Results",
        `<div style="display:block;width:100%">` +
        `<div data-t="f1" style="display:flex;gap:6px;background:var(--soft);border-radius:6px;padding:3px 7px;margin-bottom:3px"><span><b>Cour</b>ier Cash — Money window</span><span style="margin-left:auto;color:var(--muted)">open ↵</span></div>` +
        `<div style="display:flex;gap:6px;padding:2px 7px;color:var(--muted)"><b>Cour</b>ier bookings — board</div>` +
        `<div style="display:flex;gap:6px;padding:2px 7px;color:var(--muted)"><b>Cour</b>ier charges — Expenses view</div></div>`)}</div>` +
      `<div class="t-in" data-t="aw" style="position:absolute;left:0;right:0;top:0">${win("Revenue · this month",
        `<div style="display:block;width:100%"><div style="font-size:16px;font-weight:800" class="t-num" data-t="amt">$1,240</div>` +
        `<div style="color:var(--muted);margin-top:1px">21 paid invoices · up from $980 last month</div>` +
        `<div style="margin-top:6px">${chip("from Money · Invoices", "")} ${chip("📊 Pin to dashboard", "")}</div></div>`)}</div>` +
      `<div class="t-in" data-t="cw" style="position:absolute;left:0;right:0;top:0">${win("New expense?",
        `<div style="display:block;width:100%">` +
        `<div style="margin-bottom:5px">Ads boost — <b>$20</b> · today</div>` +
        `<div style="margin-bottom:6px">${chip("Money · Expenses", "")} ${chip("category: Marketing", "")}</div>` +
        `<div>${btn("Confirm", "cfm")} ${chip("editable before it lands", "")}</div></div>`)}</div>` +
      `</div>` +
      `<div class="t-in" data-t="verbs" style="display:flex;gap:8px">${chip("Find", "acc")}${chip("Ask", "acc")}${chip("Act", "acc")}</div></div>`,
    beats: [
      { cap: "One bar on every screen — ⌘K. It speaks three verbs.", d: 3000, cues: [
        [600, "pulse", "bar"],
      ]},
      { cap: "FIND: three letters reach any window, board, or record — ranked as you type.", d: 4400, cues: [
        [200, "cam", "bar", 1.35], [500, "type", "at", "cour"],
        [1500, "show", "fw"], [1700, "cam", "fw", 1.25], [2600, "pulse", "f1"],
      ]},
      { cap: "ASK: a question, answered from your own data — the figure itself, not a link.", d: 4600, cues: [
        [0, "hide", "fw"], [200, "cam", "bar", 1.35], [400, "type", "at", "revenue this month"],
        [1600, "show", "aw"], [1800, "cam", "aw", 1.3], [2700, "pulse", "amt"],
      ]},
      { cap: "ACT: a sentence becomes work — a filled-in expense card, waiting on your confirm.", d: 4400, cues: [
        [0, "hide", "aw"], [200, "cam", "bar", 1.35], [400, "type", "at", "spent 20 on boost"],
        [1600, "show", "cw"], [1800, "cam", "cw", 1.25],
      ]},
      { cap: "Nothing writes itself silently — you confirm, then it lands in Money · Expenses.", d: 4400, cues: [
        [200, "cur", "cfm"], [1100, "click", "cfm"], [1400, "curx"],
        [1600, "hide", "cw"], [1800, "toast", "Expense logged · Ads <b>$20</b> → Money · Expenses"], [2000, "wide"],
      ]},
      { cap: "Find · Ask · Act. One bar, three verbs.", d: 3200, cues: [
        [0, "toastx"], [400, "show", "verbs"], [900, "settle", "verbs"],
      ]},
    ],
  },

  "ask-order": {
    crumb: "ASK · ⌘K", cat: 2, h: 300,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div style="width:min(340px,96%)" data-t="bar">${ask("at")}</div>` +
      `<div style="position:relative;width:min(340px,96%);height:168px">` +
      `<div class="t-in" data-t="cardw" style="position:absolute;left:0;right:0;top:0">${win("New order? · nothing written yet",
        `<div style="display:block;width:100%">` +
        `<div data-t="lcust" style="margin-bottom:6px">Customer: ${chip("Anika ✓ matched", "acc", "match")} ${chip("Not them?", "", "notthem")}</div>` +
        `<div data-t="lprod" style="margin-bottom:5px">Order: Silk Scarf ×<b data-t="qty">2</b> — 2 × $19 = <b class="t-num" data-t="tot">$38</b></div>` +
        `<div data-t="linv" style="margin-bottom:7px">Invoice: draft <span class="t-mono">INV-0143</span> — $38, ready to send</div>` +
        `<div>${btn("Confirm", "cfm")}</div></div>`)}</div>` +
      `<div class="t-in" data-t="done" style="position:absolute;left:0;right:0;top:0">${win("Created — as one step ✓",
        `<div style="display:block;width:100%;line-height:1.6">` +
        `<div>✓ Customer <b>Anika</b> — matched, not duplicated</div>` +
        `<div>✓ Order <span class="t-mono">#MC-1043</span> — Silk Scarf ×2, $38</div>` +
        `<div>✓ Draft invoice <span class="t-mono">INV-0143</span> — $38</div>` +
        `<div>✓ Stock — Silk Scarf 30 → 28</div>` +
        `<div class="t-in" data-t="undoc" style="margin-top:3px">${chip("↩ Undo reverses all four — as one step", "")}</div></div>`)}</div>` +
      `</div></div>`,
    beats: [
      { cap: "Type it like you'd say it: “create an order for Anika — 2 × Silk Scarf.”", d: 4800, cues: [
        [1800, "cam", "bar", 1.3], [2100, "type", "at", "create an order for Anika — 2 × Silk Scarf"],
      ]},
      { cap: "One card previews the whole cascade — customer, order, draft invoice.", d: 4600, cues: [
        [0, "wide"], [300, "show", "cardw"], [600, "cam", "cardw", 1.25],
        [1500, "flash", "lcust"], [2300, "flash", "lprod"], [3100, "flash", "linv"],
      ]},
      { cap: "It found Anika in your customer list — no duplicate. Wrong match? “Not them.”", d: 3600, cues: [
        [400, "pulse", "match"], [1800, "pulse", "notthem"],
      ]},
      { cap: "Everything is editable before confirm — quantities, prices, even the invoice.", d: 3600, cues: [
        [400, "pulse", "qty"], [1200, "pulse", "tot"], [2000, "pulse", "linv"],
      ]},
      { cap: "Confirm → it all happens: customer, order, invoice, stock — one write.", d: 4400, cues: [
        [200, "cur", "cfm"], [1000, "click", "cfm"], [1300, "curx"],
        [1500, "hide", "cardw"], [1700, "show", "done"], [1900, "cam", "done", 1.2],
        [2200, "toast", "Order <b>#MC-1043</b> created · invoice drafted"],
      ]},
      { cap: "Undo → it all reverses, as one step. Four things made; zero forms filled.", d: 4200, cues: [
        [0, "toastx"], [400, "show", "undoc"], [900, "pulse", "undoc"],
        [1600, "wide"], [2100, "settle", "done"],
      ]},
    ],
  },

  // ═══════════════ Chapter 17/18 · Settings & apps ═══════════════,

  "access-center": {
    crumb: "Settings · Access Center", cat: 2, h: 340, center: false,
    html:
      `<div style="max-width:430px;display:flex;flex-direction:column;gap:8px">` +
      `<div data-t="mods" style="display:flex;gap:7px">` +
      win("Invoices", chip("Chosen people ▾", "acc", "m1"), "w1", "min-width:0;flex:1") +
      win("Orders", chip("Everyone ▾", "", "m2"), "w2", "min-width:0;flex:1") +
      win("Campaigns", chip("Owners only ▾", "", "m3"), "w3", "min-width:0;flex:1") + `</div>` +
      tbl({ t: "pt", head: ["Person", "", "Invoices access"], rows: [
        { c: ["Maya", `<span style="color:var(--muted)">owner</span>`, chip("Owner", "acc")], t: "rMaya" },
        { c: ["Sana", `<span style="color:var(--muted)">packs parcels</span>`, chip("View ▾", "", "psana")], t: "rSana" },
        { c: ["Ben", `<span style="color:var(--muted)">replies to messages</span>`, chip("No access ▾", "", "pben")], t: "rBen" },
      ]}) +
      `<div class="t-in" data-t="crown" style="align-self:flex-start;max-width:100%">${win("Ben's screen · Campaigns board",
        `Client total billed: ${chip("🔒 Hidden", "warn", "hid")}`)}</div></div>`,
    beats: [
      { cap: "Per module, choose who's in: Everyone · Owners only · Chosen people.", d: 4200, cues: [
        [2000, "cam", "mods", 1.25], [2600, "pulse", "m1"],
      ]},
      { cap: "Per person: No access · View · Manage. Invoices is “Chosen people” — here's your team.", d: 3800, cues: [
        [300, "cam", "pt", 1.25], [1100, "flash", "rSana"], [1700, "flash", "rBen"],
      ]},
      { cap: "Sana packs parcels and books couriers — one click bumps her to Manage.", d: 4400, cues: [
        [300, "cur", "psana"], [1300, "click", "psana"],
        [1500, "chip", "psana", "acc", "Manage ▾"], [2300, "curx"],
      ]},
      { cap: "Saved as you click — it applies instantly, everywhere Sana looks. No re-login.", d: 3600, cues: [
        [400, "toast", "Sana → <b>Manage</b> on Invoices · applied everywhere"], [1200, "pulse", "psana"],
      ]},
      { cap: "And the crown rule: what's hidden leaks nowhere — derived values show 🔒 Hidden.", d: 4400, cues: [
        [0, "toastx"], [300, "show", "crown"], [700, "cam", "crown", 1.35], [1600, "pulse", "hid"],
      ]},
      { cap: "Ben's boards still work — invoice numbers just never leak into them. One screen decides.", d: 3800, cues: [
        [400, "wide"], [1000, "settle", "crown"],
      ]},
    ],
  },

  "three-frames": {
    bare: true, h: 245,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div data-t="devs" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">` +
      win("💻 Web", devOrder("st1"), "d1") +
      win("🖥️ Desktop · Sana", devOrder("st2"), "d2") +
      win("📱 Phone · you", devOrder("st3"), "d3") + `</div>` +
      `<div class="t-in" data-t="sync">${chip("every device caught up ✓", "ok")}</div></div>`,
    beats: [
      { cap: "The same workspace on web, desktop, and phone — three doors, one home.", d: 3600, cues: [
        [600, "pulse", "d1"], [1000, "pulse", "d2"], [1400, "pulse", "d3"],
      ]},
      { cap: "One order on all three: Anika's Rose Dress, $59, still Pending everywhere.", d: 3400, cues: [
        [300, "flash", "d1"], [800, "flash", "d2"], [1300, "flash", "d3"],
      ]},
      { cap: "You confirm it from your phone, on the bus…", d: 3600, cues: [
        [300, "cam", "d3", 1.35],
        [1200, "cls", "st3", "pressed", 1], [1350, "cls", "st3", "pressed", 0],
        [1550, "chip", "st3", "acc", "Confirmed"], [1700, "pulse", "d3"],
      ]},
      { cap: "…and it flows to the others — usually before you look up.", d: 4200, cues: [
        [300, "wide"], [1000, "chip", "st2", "acc", "Confirmed"], [1100, "pulse", "d2"],
        [1500, "chip", "st1", "acc", "Confirmed"], [1600, "pulse", "d1"],
        [2400, "show", "sync"], [2800, "settle", "sync"],
      ]},
      { cap: "Later, Sana books the courier from her desktop — your screens learn it just as fast.", d: 4600, cues: [
        [300, "hide", "sync"], [700, "chip", "st2", "acc", "Booked · TRK-8847"], [800, "pulse", "d2"],
        [1600, "chip", "st3", "acc", "Booked · TRK-8847"], [1700, "pulse", "d3"],
        [2100, "chip", "st1", "acc", "Booked · TRK-8847"], [2200, "pulse", "d1"],
        [3100, "show", "sync"],
      ]},
      { cap: "No sync button anywhere. Caught up is the default state.", d: 3200, cues: [
        [500, "settle", "sync"],
      ]},
    ],
  },

  "sync-conflict": {
    crumb: "Work · Orders", cat: 2, h: 320,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div data-t="devs" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">` +
      win(`💻 Laptop · Maya ${chip("offline", "warn", "off1")}`, offOrder("v1"), "d1") +
      win(`📱 Phone · Sana ${chip("offline", "warn", "off2")}`, offOrder("v2"), "d2") + `</div>` +
      `<div style="position:relative;width:min(340px,96%);height:112px">` +
      `<div class="t-in" data-t="dlg" style="position:absolute;left:0;right:0;top:0">${win("You both edited this cell",
        `<div style="display:block;width:100%"><div style="margin-bottom:6px;color:var(--muted)">Anika · <span class="t-mono">#MC-1041</span> · <b style="color:var(--ink)">total</b> — two versions, 2 minutes apart:</div>` +
        `<div style="display:flex;gap:6px;flex-wrap:wrap">${btn("Keep $59 — Maya", "k59", "o")} ${btn("Keep $54 — Sana", "k54")}</div></div>`)}</div>` +
      `<div class="t-in" data-t="hist" style="position:absolute;left:0;right:0;top:36px;display:flex;justify-content:center">${chip("🕘 Maya's $59 stays in history — restorable anytime", "")}</div>` +
      `</div></div>`,
    beats: [
      { cap: "Two devices, offline, the same order open — Anika's #MC-1041. It happens.", d: 3800, cues: [
        [600, "pulse", "d1"], [1100, "pulse", "d2"], [2000, "cam", "devs", 1.2],
      ]},
      { cap: "Maya prices it $59 on the laptop; Sana keys in $54 on the phone. Both edits are real.", d: 4400, cues: [
        [300, "cam", "d1", 1.35], [800, "text", "v1", "$59"], [900, "pulse", "v1"],
        [1900, "cam", "d2", 1.35], [2400, "text", "v2", "$54"], [2500, "pulse", "v2"],
        [3400, "wide"],
      ]},
      { cap: "Back online, the edits meet. TaroGrid never silently picks a winner — it asks you.", d: 4400, cues: [
        [300, "chip", "off1", "", "online"], [500, "chip", "off2", "", "online"],
        [800, "toast", "Back online · syncing 2 changes — 1 conflict found"],
        [1800, "toastx"], [1900, "show", "dlg"], [2200, "cam", "dlg", 1.25],
      ]},
      { cap: "You pick. That's the whole ceremony.", d: 4200, cues: [
        [300, "cur", "k54"], [1200, "click", "k54"], [1600, "curx"],
        [1800, "hide", "dlg"], [2000, "wide"],
        [2300, "text", "v1", "$54 ✓"], [2400, "pulse", "d1"],
        [2700, "text", "v2", "$54 ✓"], [2800, "pulse", "d2"],
      ]},
      { cap: "The version you didn't pick stays in history. Nothing is destroyed.", d: 4000, cues: [
        [500, "show", "hist"], [1100, "settle", "hist"],
      ]},
    ],
  },

  "advance-shield": {
    crumb: "Work · Orders", cat: 2, h: 345, center: false,
    html:
      `<div style="max-width:460px">` +
      kpis([["Orders today", "5", "kOrd"], ["In risk review", "2", "kRisk"], ["Advance paid", "—", "kAdv"]]) +
      tbl({ head: ["Buyer", "Total", "Fraud", "Status"], aligns: "lr", rows: [
        { c: ["Anika", "$59", light("g"), chip("Done", "ok")], t: "row0" },
        { c: ["New number", "$59", light("r", "rl"), chip("Pending", "", "st1") + ` <span class="t-in" data-t="adv">${chip("💳 advance link · $5", "acc")}</span>`], t: "row1" },
        { c: ["Tomas", "$19", light("g"), chip("Confirmed", "acc")], t: "row3" },
        { c: ["New number", "$34", light("r", "rl2"), chip("⏰ advance expired", "warn", "st2")], t: "row2" },
        { c: ["Priya S.", "$69", light("g"), chip("Confirmed", "acc")], t: "row4" },
      ]}) +
      `<div style="margin-top:8px"><span class="t-in in" data-t="reqw">${btn("Request advance · $5", "req", "o")}</span></div></div>`,
    beats: [
      { cap: "Five orders in. Three cleared the fraud check — two brand-new numbers didn't.", d: 4200, cues: [
        [2000, "cam", "row1", 1.3], [2600, "pulse", "rl"],
      ]},
      { cap: "A risky order? Ask for a small advance — about the delivery fee.", d: 4600, cues: [
        [300, "cur", "req"], [1300, "click", "req"],
        [1600, "show", "adv"], [1800, "flash", "row1"], [2500, "curx"], [2800, "hide", "reqw"],
      ]},
      { cap: "Paid → the order confirms itself. Real skin in the game.", d: 4400, cues: [
        [400, "toast", "Advance paid · <b>$5</b> ✓"],
        [1200, "chip", "st1", "ok", "Confirmed ✓"],
        [1500, "count", "kRisk", 2, 1], [1550, "pulse", "kRisk"],
        [1700, "text", "kAdv", "$5"], [1750, "pulse", "kAdv"],
      ]},
      { cap: "Not paid in time? Flagged for your review — never auto-cancelled.", d: 4400, cues: [
        [0, "toastx"], [300, "cam", "row2", 1.3], [1000, "flash", "row2"],
        [1300, "chip", "st2", "warn", "flagged for your review"], [1700, "pulse", "rl2"],
      ]},
      { cap: "Two risky orders: one proved itself with $5, one waits for your eyes. Nothing auto-dies.", d: 4200, cues: [
        [300, "wide"], [1000, "settle", "row1"],
      ]},
    ],
  },

  // ═══════════════ Chapter 5 · Selling fields ═══════════════,

};
