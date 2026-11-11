// Chapter 0 (Start here) + Chapter 1 (Core ideas) demos.
// Grammar + authoring rules: see ../theater.mjs and ../demos.mjs.

import {
  chip, light, tgl, btn, kpis, tbl, trow, rowCells, card, win, ask, life,
  task, prod, phone, shopHead, shopCard, bubble, success, kanban, ART,
} from "../theater.mjs";

// Local helpers — conceptual-demo furniture (k-* classes ride the site's
// figure kit, which ships on every page).
const km = (txt, t = "") =>
  `<span class="k-mini t-in"${t ? ` data-t="${t}"` : ""}>${txt}</span>`;
const nb = (n, t, style = "") =>
  `<span class="k-nb t-in" data-t="${t}"${style ? ` style="${style}"` : ""}>${n}</span>`;
const sideItem = (label, t) =>
  `<div class="t-in in" data-t="${t}" style="display:flex;align-items:center;gap:5px;min-width:0">` +
  `<span class="k-si" style="width:12px;flex:none"></span><span class="k-mini" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${label}</span></div>`;

export const DEMOS_CORE = {
  "three-ideas": {
    bare: true, h: 265,
    html:
      `<div class="t-view" data-t="v1"><div class="k-frame" data-t="fr"><span class="k-flabel">YOUR COMPANY — MAYA'S CLOSET</span>` +
      `<div class="k-split" style="align-items:stretch">` +
      `<div class="k-zone money col t-in" data-t="z1">MONEY${km("invoice $59 · Anika", "z1a")}${km("courier cash $147", "z1b")}</div>` +
      `<div class="k-zone people col t-in" data-t="z2">PEOPLE${km("Anika · repeat buyer", "z2a")}${km("Sana · your team", "z2b")}</div>` +
      `<div class="k-zone work col t-in" data-t="z3">WORK${km("Orders · Catalog", "z3a")}${km("boards you invent", "z3b")}</div>` +
      `<div class="k-zone outreach col t-in" data-t="z4">OUTREACH${km("3-email campaign", "z4a")}${km("who replied", "z4b")}</div>` +
      `</div></div></div>` +
      `<div class="t-view off" data-t="v2"><div style="width:min(360px,92%)" data-t="b2">` +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        ["Anika", "Rose Dress ×1", "$59"],
        { c: ["Tomas", "Silk Scarf ×2", "$38"], t: "b2row" },
        ["Priya S.", "Gift Bundle ×1", "$69"],
        { c: ["Omar K.", "Silk Scarf ×1", `<span data-t="b2cell">$19</span>`], t: "b2row2" },
        ["Lena M.", "Rose Dress ×1", "$59"],
      ]}) + `</div></div>` +
      `<div class="t-view off" data-t="v3" style="flex-direction:column;gap:2px">` +
      `<span class="t-lift" data-t="wlift" style="z-index:2">${win("Invoice Center", `Anika · <b>$59</b> ${chip("Paid ✓", "ok")}`)}</span>` +
      `<div style="width:min(340px,90%);margin-top:-14px" data-t="b3">` +
      tbl({ head: ["Invoice", "Client", "Total"], aligns: "llr", rows: [
        [`<span class="t-mono">INV-0142</span>`, "Anika", "$59"],
        { c: [`<span class="t-mono">INV-0141</span>`, "Atlas Studio", "$120"], t: "b3row" },
        [`<span class="t-mono">INV-0140</span>`, "Tomas", "$26"],
      ]}) + `</div></div>`,
    beats: [
      { cap: "This is your company — the Workspace. Everything lives inside it.", d: 3800, cues: [
        [400, "show", "z1"], [700, "show", "z2"], [1000, "show", "z3"], [1300, "show", "z4"],
      ]},
      { cap: "Each world already knows its job — money, people, work, outreach.", d: 4400, cues: [
        [200, "cam", "fr", 1.15],
        [500, "show", "z1a"], [800, "show", "z1b"], [1100, "show", "z2a"], [1400, "show", "z2b"],
        [1700, "show", "z3a"], [2000, "show", "z3b"], [2300, "show", "z4a"], [2600, "show", "z4b"],
        [3600, "wide"],
      ]},
      { cap: "Your company's information lives on boards — rows and columns.", d: 4200, cues: [
        [0, "cls", "v1", "off", 1], [260, "cls", "v2", "off", 0],
        [800, "flash", "b2row"], [1400, "cam", "b2row", 1.3],
      ]},
      { cap: "Every row is a real thing. Every cell is one fact — like Omar's $19.", d: 3600, cues: [
        [300, "cam", "b2cell", 1.55], [700, "pulse", "b2cell"], [2500, "wide"],
      ]},
      { cap: "Windows are smart screens that work on top of boards.", d: 4000, cues: [
        [0, "cls", "v2", "off", 1], [260, "cls", "v3", "off", 0],
        [800, "cam", "wlift", 1.3],
      ]},
      { cap: "Lift any window — a real board is always underneath. Nothing is hidden.", d: 5000, cues: [
        [300, "wide"], [700, "cls", "wlift", "up", 1], [1300, "flash", "b3row"],
        [3600, "cls", "wlift", "up", 0], [4200, "settle", "wlift"],
      ]},
    ],
  },

  "first-run-checklist": {
    cat: 2, h: 285, center: false,
    html:
      `<div style="display:flex;flex-direction:column;gap:10px;align-items:center">` +
      win(`Set up your company <span class="t-chip" data-s="acc" style="margin-left:auto"><b class="t-num" data-t="prog">1</b>&nbsp;of 6</span>`,
        `<div style="display:block;width:100%">` +
        task("Name your company", true) +
        task("Add a product", false, "tk2") +
        task("Publish your shop link", false, "tk3") +
        task("Get your first order", false, "tk4") +
        task("Confirm it", false, "tk5") +
        task("See your money", false, "tk6") +
        `</div>`, "cl") +
      `<div class="t-in" data-t="alldone">${chip("✓ All 6 steps complete — your business loop is live", "ok")}</div></div>`,
    beats: [
      { cap: "A fresh workspace starts with a six-step checklist — the first is already done.", d: 3600, cues: [
        [400, "cam", "cl", 1.2],
      ]},
      { cap: "Add a product, publish your link — each step ticks itself the moment it happens.", d: 4800, cues: [
        [600, "cls", "tk2", "done", 1], [620, "text", "tk2", "✓"], [660, "pulse", "tk2"], [700, "count", "prog", 1, 2],
        [2600, "cls", "tk3", "done", 1], [2620, "text", "tk3", "✓"], [2660, "pulse", "tk3"], [2700, "count", "prog", 2, 3],
      ]},
      { cap: "Your first order arrives — and the checklist notices on its own.", d: 4400, cues: [
        [400, "toast", "First order · <b>#MC-1042</b> — Anika · Rose Dress · $59"],
        [1500, "cls", "tk4", "done", 1], [1520, "text", "tk4", "✓"], [1560, "pulse", "tk4"], [1600, "count", "prog", 3, 4],
      ]},
      { cap: "You confirm it, the money lands — the last two tick themselves.", d: 4600, cues: [
        [0, "toastx"],
        [600, "cls", "tk5", "done", 1], [620, "text", "tk5", "✓"], [660, "pulse", "tk5"], [700, "count", "prog", 4, 5],
        [2500, "cls", "tk6", "done", 1], [2520, "text", "tk6", "✓"], [2560, "pulse", "tk6"], [2600, "count", "prog", 5, 6],
      ]},
      { cap: "All six done — the checklist retires itself.", d: 3800, cues: [
        [300, "wide"], [800, "show", "alldone"], [1000, "settle", "alldone"],
      ]},
    ],
  },

  "screen-anatomy": {
    crumb: "Work · Orders", cat: 2, h: 350, center: false,
    html:
      `<div style="max-width:460px;position:relative">` +
      nb("1", "n1", "position:absolute;left:-34px;top:4px;z-index:5") +
      nb("2", "n2", "position:absolute;right:-8px;top:92px;z-index:5") +
      `<div style="display:flex;justify-content:flex-end;align-items:center;gap:6px;margin-bottom:6px"><span class="k-chip round" data-t="hlp">?</span>${nb("5", "n5")}</div>` +
      tbl({ head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59", chip("Confirmed", "acc")], t: "row1" },
        { c: ["Tomas", "Silk Scarf ×2", "$38", chip("New", "acc")], t: "row2" },
        { c: ["Priya S.", "Gift Bundle ×1", "$69", chip("Booked", "acc")], t: "row3" },
        { c: ["Omar K.", "Silk Scarf ×1", "$19", chip("Packed")], t: "row4" },
      ]}) +
      `<div style="display:flex;gap:8px;align-items:center;margin-top:8px">${win("Courier Cash", `To collect <b>$88</b>`, "cc")}${nb("3", "n3")}</div>` +
      `<div style="display:flex;gap:8px;align-items:center;margin-top:8px" data-t="askrow"><span style="flex:1;max-width:230px">${ask("askt")}</span>${nb("4", "n4")}` +
      `<span class="t-in" data-t="ans">${chip("Courier Cash · $88 to collect", "acc")}</span></div>` +
      `</div>`,
    beats: [
      { cap: "One calm screen, five working parts — let's label them.", d: 3000, cues: [] },
      { cap: "① The sidebar — your company's map: money, people, work, outreach.", d: 3800, cues: [
        [300, "show", "n1"], [600, "cam", "n1", 1.4], [1100, "pulse", "n1"],
      ]},
      { cap: "② The board area — your data, live. Every screen sits on a board.", d: 3800, cues: [
        [200, "show", "n2"], [500, "cam", "row1", 1.15],
        [1000, "flash", "row1"], [1400, "flash", "row2"], [1800, "flash", "row3"],
      ]},
      { cap: "③ Module windows float over your boards — smart screens for money, people, outreach.", d: 3800, cues: [
        [200, "show", "n3"], [500, "cam", "cc", 1.35], [1100, "pulse", "cc"],
      ]},
      { cap: "④ The ASK bar (⌘K) finds, answers, and acts — from anywhere.", d: 4600, cues: [
        [200, "show", "n4"], [500, "cam", "askrow", 1.35],
        [900, "type", "askt", "courier cash"], [2500, "show", "ans"], [2800, "pulse", "ans"],
      ]},
      { cap: "⑤ And the ? button opens help for the exact screen you're on.", d: 3600, cues: [
        [200, "show", "n5"], [500, "cam", "hlp", 1.4], [1100, "pulse", "hlp"],
      ]},
      { cap: "Sidebar, boards, windows, ASK, help — you now know the whole screen.", d: 3400, cues: [
        [300, "wide"], [1000, "settle", "cc"],
      ]},
    ],
  },

  "first-three-wins": {
    cat: 2, h: 260,
    html:
      `<div class="t-view" data-t="v1">${prod({ art: "dress", name: "Rose Dress", price: "$59", t: "p1" })}` +
      `<div style="display:flex;flex-direction:column;gap:6px;align-items:flex-start">` +
      `<span class="t-in" data-t="stockc">${chip("12 in stock")}</span>` +
      `<span class="t-in" data-t="pchk">${chip("photo ✓ · price ✓ · ready", "acc")}</span></div></div>` +
      `<div class="t-view off" data-t="v2" style="flex-direction:column;gap:10px"><span class="t-lift">${btn("Publish", "pub")}</span>` +
      `<span class="t-in" data-t="lnk">${chip(`<span class="t-mono">yourshop.link/maya</span> · copied ✓`, "acc")}</span>` +
      `<span class="t-in" data-t="paste">${chip("→ paste it in your bio, a DM, a story")}</span></div>` +
      `<div class="t-view off" data-t="v3" style="align-items:flex-start"><div style="width:min(380px,94%);margin-top:6px">` +
      kpis([["Orders today", "0", "kOrd"], ["To collect", "$0", "kCol"]], "two") +
      tbl({ t: "ob", head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [] }) +
      `</div></div>`,
    beats: [
      { cap: "Win 1 — one real product: photo, price, stock.", d: 3800, cues: [
        [300, "cam", "p1", 1.35], [900, "show", "stockc"], [1700, "show", "pchk"],
      ]},
      { cap: "Win 2 — publish, and your shop link is ready to paste anywhere.", d: 4600, cues: [
        [0, "wide"], [100, "cls", "v1", "off", 1], [300, "cls", "v2", "off", 0],
        [800, "cur", "pub"], [1600, "click", "pub"], [1900, "show", "lnk"], [2500, "curx"],
      ]},
      { cap: "Drop it in your bio, your DMs, your story — that link IS your storefront.", d: 3200, cues: [
        [300, "show", "paste"], [700, "cam", "lnk", 1.3],
      ]},
      { cap: "Win 3 — order from yourself, and watch the row appear on its own.", d: 4800, cues: [
        [0, "wide"], [150, "cls", "v2", "off", 1], [400, "cls", "v3", "off", 0],
        [1100, "row", "ob", rowCells(["You", "Rose Dress ×1", "$59", chip("New", "acc")], "llr")],
        [1700, "cam", "ob", 1.25],
        [2400, "count", "kOrd", 0, 1], [2500, "count", "kCol", 0, 59, "$"], [2600, "pulse", "kOrd"],
      ]},
      { cap: "That's the whole loop — you've seen everything an order will ever do.", d: 3400, cues: [
        [300, "wide"], [900, "settle", "kOrd"],
      ]},
    ],
  },

  "data-safety": {
    bare: true, h: 275,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:10px;align-items:center">${chip("💻 your device", "", "dev")}<span class="k-arrow"></span>${chip("☁️ cloud", "", "cld")}<span class="k-arrow"></span>${chip("📱 your phone", "", "phn")}</div>` +
      `<div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap;justify-content:center">` +
      `<div style="width:235px" data-t="brd">` +
      `<div style="margin-bottom:6px">${chip(`Rose Dress · stock <b class="t-num" data-t="stk">12</b>`, "", "stkc")}</div>` +
      tbl({ head: ["Buyer", "Total", "Status"], aligns: "lr", rows: [
        { c: ["Anika", "$59", chip("Confirmed", "acc")], t: "ra" },
        { c: ["Tomas", "$38", chip("New", "acc", "stoma")], t: "rt" },
        { c: ["Priya S.", "$69", chip("Booked", "acc", "spriya")], t: "rp" },
      ]}) + `</div>` +
      win("Edits waiting",
        `<div style="display:block;width:100%"><div><b class="t-num" data-t="qn">0</b> queued ${chip("saved on device", "acc")}</div>` +
        `<div class="k-mini t-in" data-t="q1" style="display:block;margin-top:5px">• Tomas → Confirmed</div>` +
        `<div class="k-mini t-in" data-t="q2" style="display:block">• stock 12 → 11</div>` +
        `<div class="k-mini t-in" data-t="q3" style="display:block">• Priya → Packed</div></div>`, "queue") +
      `</div>` +
      `<div class="t-in" data-t="sync">${chip("✓ all three copies in step", "ok")}</div></div>`,
    beats: [
      { cap: "Your device keeps a full copy; the cloud keeps the shared copy.", d: 3800, cues: [
        [400, "pulse", "dev"], [900, "pulse", "cld"], [1400, "pulse", "phn"],
      ]},
      { cap: "The connection drops mid-delivery-day. Nothing freezes.", d: 3600, cues: [
        [300, "chip", "cld", "warn", "✈️ offline"], [900, "pulse", "cld"], [1400, "cam", "brd", 1.2],
      ]},
      { cap: "You keep working: confirm Tomas, count stock down, pack Priya's parcel.", d: 7000, cues: [
        [200, "cur", "stoma"], [1000, "click", "stoma"], [1150, "chip", "stoma", "acc", "Confirmed"],
        [1350, "show", "q1"], [1400, "count", "qn", 0, 1],
        [2300, "cur", "stkc"], [3000, "click", "stkc"], [3150, "count", "stk", 12, 11],
        [3350, "show", "q2"], [3400, "count", "qn", 1, 2],
        [4300, "cur", "spriya"], [5000, "click", "spriya"], [5150, "chip", "spriya", "acc", "Packed"],
        [5350, "show", "q3"], [5400, "count", "qn", 2, 3],
        [5900, "curx"], [6300, "pulse", "queue"],
      ]},
      { cap: "Every edit queued safely on your device — numbered, ordered, patient.", d: 3000, cues: [
        [300, "cam", "queue", 1.3],
      ]},
      { cap: "Back online — the queue uploads in order, oldest first.", d: 4400, cues: [
        [200, "chip", "cld", "ok", "📶 back online"],
        [900, "hide", "q1"], [950, "count", "qn", 3, 2],
        [1600, "hide", "q2"], [1650, "count", "qn", 2, 1],
        [2300, "hide", "q3"], [2350, "count", "qn", 1, 0],
        [2900, "wide"],
      ]},
      { cap: "Device, cloud, phone — every copy matches again. Nothing lost, nothing retyped.", d: 3800, cues: [
        [400, "show", "sync"], [700, "settle", "sync"], [1300, "pulse", "phn"],
      ]},
    ],
  },

  "workspace-walls": {
    bare: true, h: 265,
    html:
      `<div class="k-frame sm" data-t="f1"><span class="k-flabel">MAYA'S CLOSET</span>` +
      `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px" data-t="mc"><span class="t-avatar">M</span><b style="font-size:10.5px">Maya's Closet</b>${chip(`<b class="t-num" data-t="oc">3</b> orders`, "", "occ")}</div>` +
      `<div style="width:212px">` +
      tbl({ t: "wob", head: ["Buyer", "Total", "Status"], aligns: "lr", rows: [
        ["Anika", "$59", chip("Confirmed", "acc")],
        ["Priya S.", "$69", chip("Booked", "acc")],
        ["Omar K.", "$19", chip("Packed")],
      ]}) + `</div></div>` +
      `<div class="k-frame sm t-dim" data-t="f2"><span class="k-flabel">ATLAS STUDIO</span>` +
      `<div style="display:flex;align-items:center;gap:6px;margin-bottom:6px" data-t="as"><span class="t-avatar">A</span><b style="font-size:10.5px">Atlas Studio</b>${chip("6 people")}</div>` +
      `<div style="width:212px">` +
      tbl({ head: ["Project", "Stage"], rows: [
        { c: ["Logo refresh", chip("Design", "acc")], t: "a1" },
        { c: ["Brand book", chip("Review", "acc")], t: "a2" },
        { c: ["Website", chip("Build")], t: "a3" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "Two businesses, two workspaces — side by side, never mixing.", d: 3800, cues: [
        [500, "pulse", "mc"], [1100, "pulse", "as"],
      ]},
      { cap: "An order arrives in Maya's Closet…", d: 4400, cues: [
        [300, "cam", "f1", 1.2],
        [1000, "row", "wob", rowCells(["Tomas", "$38", chip("New", "acc")], "lr")],
        [1800, "count", "oc", 3, 4], [1900, "pulse", "occ"],
      ]},
      { cap: "…and Atlas Studio doesn't even blink. The wall is absolute.", d: 3400, cues: [
        [300, "wide"], [1000, "pulse", "as"],
      ]},
      { cap: "Switch workspaces — one click, and everything swaps: boards, money, people.", d: 4400, cues: [
        [400, "cls", "f1", "t-dim", 1], [400, "cls", "f2", "t-dim", 0],
        [900, "cam", "f2", 1.2], [1500, "pulse", "as"],
      ]},
      { cap: "Daniel's studio world: projects and stages — not a single order in sight.", d: 4000, cues: [
        [400, "flash", "a1"], [900, "flash", "a2"], [1400, "flash", "a3"],
      ]},
      { cap: "Walls, not fences — each business keeps its own boards, money, and people.", d: 3800, cues: [
        [300, "wide"], [800, "cls", "f1", "t-dim", 0],
        [1300, "settle", "mc"], [1450, "settle", "as"],
      ]},
    ],
  },

  // ═══════════════ Chapter 1 · Core ideas ═══════════════,

  "board-anatomy": {
    crumb: "Work · Orders", cat: 2, h: 255, center: false,
    html:
      `<div style="max-width:440px">` +
      tbl({ head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59", chip("Confirmed", "acc")], t: "r1" },
        { c: ["Tomas", "Silk Scarf ×2", "$38", chip("New", "acc")], t: "hrow" },
        { c: ["Priya S.", "Gift Bundle ×1", `<span data-t="hcell">$69</span>`, chip("Booked", "acc")], t: "prow" },
        { c: ["Omar K.", "Silk Scarf ×1", "$19", chip("Packed")], t: "r4" },
        { c: ["Lena M.", "Rose Dress ×1", "$59", chip("Done ✓", "ok")], t: "r5" },
      ]}) + `</div>`,
    beats: [
      { cap: "A shopkeeper's ledger: one line per order, one column per fact.", d: 3400, cues: [] },
      { cap: "A board is that ledger, made intelligent.", d: 3200, cues: [
        [400, "flash", "r1"], [800, "flash", "hrow"], [1200, "flash", "prow"],
      ]},
      { cap: "One row = one thing. This row is Tomas's order.", d: 3800, cues: [
        [300, "cam", "hrow", 1.3], [600, "cls", "hrow", "fresh", 1],
      ]},
      { cap: "One cell = one fact. Priya's total: $69.", d: 3400, cues: [
        [0, "cls", "hrow", "fresh", 0],
        [300, "cam", "hcell", 1.55], [700, "pulse", "hcell"],
      ]},
      { cap: "And every cell remembers who changed it, and when.", d: 4400, cues: [
        [500, "toast", "<b>$69</b> — written by your shop link · Tue 2:14 pm"],
        [2900, "toastx"], [3100, "wide"],
      ]},
      { cap: "Rows for things, columns for facts, memory built in — that's a board.", d: 3600, cues: [
        [800, "settle", "hrow"],
      ]},
    ],
  },

  "window-lifts": {
    crumb: "Money · Invoices", cat: 0, h: 295, center: false,
    html:
      `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;padding-top:8px">` +
      `<span class="t-lift" data-t="wl" style="z-index:2">${win("Invoice Center", `Anika · <b>$59</b> ${chip("Draft", "", "wst")} ${btn("Record payment", "rp")}`)}</span>` +
      `<div style="width:min(370px,92%);margin-top:-14px">` +
      tbl({ head: ["Invoice", "Client", "Total", "Status"], aligns: "llr", rows: [
        { c: [`<span class="t-mono">INV-0142</span>`, "Anika", "$59", chip("Draft", "", "bst")], t: "urow" },
        { c: [`<span class="t-mono">INV-0141</span>`, "Atlas Studio", "$120", chip("Sent", "acc")], t: "row2" },
        [`<span class="t-mono">INV-0140</span>`, "Tomas", "$26", chip("Sent", "acc")],
        [`<span class="t-mono">INV-0139</span>`, "Priya S.", "$69", chip("Sent", "acc")],
      ]}) + `</div></div>`,
    beats: [
      { cap: "The Invoice Center — a friendly cockpit.", d: 3400, cues: [
        [400, "cam", "wl", 1.3],
      ]},
      { cap: "Lift it like a sheet of glass — a real board is always underneath.", d: 4400, cues: [
        [200, "wide"], [700, "cls", "wl", "up", 1],
        [1400, "flash", "urow"], [2000, "flash", "row2"],
      ]},
      { cap: "Every number in the cockpit is really a row down here.", d: 3600, cues: [
        [300, "cam", "urow", 1.3], [700, "cls", "urow", "fresh", 1], [2600, "cls", "urow", "fresh", 0],
      ]},
      { cap: "Set it back down — cockpit on top, engine room below.", d: 3400, cues: [
        [200, "wide"], [700, "cls", "wl", "up", 0],
      ]},
      { cap: "Record Anika's payment up in the cockpit…", d: 4000, cues: [
        [300, "cam", "wl", 1.25], [900, "cur", "rp"], [1700, "click", "rp"],
        [1900, "chip", "wst", "ok", "Paid ✓"], [2600, "curx"],
      ]},
      { cap: "…and the row underneath updates itself — window and board can never disagree.", d: 5000, cues: [
        [300, "wide"], [900, "cls", "wl", "up", 1],
        [1500, "chip", "bst", "ok", "Paid ✓"], [1600, "pulse", "bst"],
        [2600, "cls", "wl", "up", 0], [3400, "settle", "urow"],
      ]},
    ],
  },

  // Recovered 2026-11-11 from the app bundle (app commit 88a1c5924, 2026-07-28) — its source commit was never pushed.
  "module-writes-back": {
    "crumb": "Money · Invoice board",
    "cat": 0,
    "h": 290,
    "center": false,
    "html": "<div style=\"max-width:460px\"><table class=\"t-tbl\"><thead><tr><th>Invoice</th><th>Client</th><th style=\"text-align:right\">Total</th><th>Status</th><th><span class=\"t-in\" data-t=\"nth\">Notes — yours</span></th></tr></thead><tbody><tr class=\"\" data-t=\"lrow\"><td><span class=\"t-mono\">INV-0142</span></td><td>Anika</td><td class=\"r t-num\">$59</td><td><span class=\"t-chip\" data-s=\"ok\" data-t=\"s1\">Paid</span></td><td><span class=\"t-in\" data-t=\"mycol\">✎ call before delivery</span></td></tr><tr class=\"\" data-t=\"r2\"><td><span class=\"t-mono\">INV-0141</span></td><td>Atlas Studio</td><td class=\"r t-num\">$120</td><td><span class=\"t-chip\" data-s=\"acc\" data-t=\"s2\">Sent</span></td><td></td></tr><tr class=\"\" data-t=\"r3\"><td><span class=\"t-mono\">INV-0140</span></td><td>Tomas</td><td class=\"r t-num\">$26</td><td><span class=\"t-chip\" data-s=\"acc\" data-t=\"s3\">Sent</span></td><td></td></tr><tr class=\"\" data-t=\"r4\"><td><span class=\"t-mono\">INV-0139</span></td><td>Priya S.</td><td class=\"r t-num\">$69</td><td><span class=\"t-chip\" data-s=\"warn\" data-t=\"s4\">Overdue</span></td><td></td></tr></tbody></table><div class=\"t-in\" data-t=\"expl\" style=\"margin-top:10px\"><div class=\"t-win\"><div class=\"wh\">Who writes this column?</div><div class=\"wb\">The Invoice Center does. It rewrites Status on every refresh — over anything typed by hand.</div></div></div></div>",
    "beats": [
      {
        "cap": "Built-in boards open like any other board now — no padlock, nothing greyed out.",
        "d": 3600,
        "cues": [
          [
            500,
            "pulse",
            "s2"
          ],
          [
            1000,
            "pulse",
            "s4"
          ]
        ]
      },
      {
        "cap": "So you fix Priya's status by hand. It saves. It looks right.",
        "d": 4400,
        "cues": [
          [
            300,
            "cur",
            "s4"
          ],
          [
            1200,
            "click",
            "s4"
          ],
          [
            1400,
            "chip",
            "s4",
            "ok",
            "Paid"
          ],
          [
            1900,
            "toast",
            "Saved"
          ],
          [
            2900,
            "curx"
          ],
          [
            3600,
            "toastx"
          ]
        ]
      },
      {
        "cap": "But that column has an owner — the Invoice Center is its writer.",
        "d": 4000,
        "cues": [
          [
            300,
            "show",
            "expl"
          ],
          [
            700,
            "cam",
            "expl",
            1.25
          ]
        ]
      },
      {
        "cap": "Its next refresh takes the column back. Your edit is gone, with no warning.",
        "d": 4600,
        "cues": [
          [
            0,
            "hide",
            "expl"
          ],
          [
            200,
            "wide"
          ],
          [
            700,
            "flash",
            "lrow"
          ],
          [
            1000,
            "flash",
            "r2"
          ],
          [
            1300,
            "flash",
            "r3"
          ],
          [
            1600,
            "flash",
            "r4"
          ],
          [
            1900,
            "chip",
            "s4",
            "warn",
            "Overdue"
          ],
          [
            2700,
            "pulse",
            "s4"
          ]
        ]
      },
      {
        "cap": "Put your own column beside it instead — the module never touches that one.",
        "d": 4800,
        "cues": [
          [
            200,
            "show",
            "nth"
          ],
          [
            600,
            "show",
            "mycol"
          ],
          [
            900,
            "cam",
            "mycol",
            1.35
          ],
          [
            1200,
            "pulse",
            "mycol"
          ],
          [
            2200,
            "wide"
          ],
          [
            2600,
            "flash",
            "lrow"
          ],
          [
            2900,
            "flash",
            "r4"
          ],
          [
            3400,
            "settle",
            "mycol"
          ]
        ]
      }
    ]
  },

  "locked-cell": {
    crumb: "Money · Invoice board", cat: 0, h: 290, center: false,
    html:
      `<div style="max-width:460px">` +
      tbl({ head: ["Invoice", "Client", "Total", "Status", `<span class="t-in" data-t="nth">Notes — yours</span>`], aligns: "llr", rows: [
        { c: [`<span class="t-mono">INV-0142</span>`, "Anika", "$59", chip("Paid 🔒", "ok", "lockchip"), `<span class="t-in" data-t="mycol">✎ call before delivery</span>`], t: "lrow" },
        { c: [`<span class="t-mono">INV-0141</span>`, "Atlas Studio", "$120", chip("Sent 🔒", "acc", "s2"), ""], t: "r2" },
        { c: [`<span class="t-mono">INV-0140</span>`, "Tomas", "$26", chip("Sent 🔒", "acc", "s3"), ""], t: "r3" },
        { c: [`<span class="t-mono">INV-0139</span>`, "Priya S.", "$69", chip("Overdue 🔒", "warn", "s4"), ""], t: "r4" },
      ]}) +
      `<div class="t-in" data-t="expl" style="margin-top:10px">${win("Why locked?", "The Invoice Center writes this column. Hand edits would vanish on refresh.")}</div></div>`,
    beats: [
      { cap: "Module-managed columns wear a small lock — the Invoice Center writes them.", d: 3600, cues: [
        [400, "pulse", "lockchip"], [900, "pulse", "s2"], [1400, "pulse", "s4"],
      ]},
      { cap: "You try to edit one — a gentle bounce, a small lock. Nothing budges.", d: 3800, cues: [
        [300, "cur", "lockchip"], [1100, "click", "lockchip"],
        [1250, "pulse", "lockchip"], [2200, "curx"],
      ]},
      { cap: "Why? The window writes this column. Hand edits would vanish on refresh.", d: 4000, cues: [
        [300, "show", "expl"], [700, "cam", "expl", 1.25],
      ]},
      { cap: "Add your own column instead — notes, tags, anything. That one is yours.", d: 4200, cues: [
        [0, "hide", "expl"], [200, "wide"],
        [700, "show", "nth"], [1100, "show", "mycol"],
        [1400, "cam", "mycol", 1.35], [1700, "pulse", "mycol"],
      ]},
      { cap: "The module refreshes its columns — Priya's overdue flips to paid — never touching yours.", d: 4800, cues: [
        [200, "wide"], [700, "flash", "lrow"], [1100, "flash", "r2"], [1500, "flash", "r3"], [1900, "flash", "r4"],
        [2100, "chip", "s4", "ok", "Paid 🔒"], [3000, "settle", "mycol"],
      ]},
    ],
  },

  "four-zones": {
    bare: true, h: 245,
    html:
      `<div class="k-frame" data-t="fr" style="width:min(600px,96%)"><span class="k-flabel">YOUR COMPANY</span>` +
      `<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:stretch">` +
      `<div class="k-zone money col t-in" data-t="zm">MONEY${km("invoice $59 · Anika", "m1")}${km("courier cash $147", "m2")}</div>` +
      `<div class="k-zone people col t-in" data-t="zp">PEOPLE${km("Anika · repeat customer", "p1")}${km("Sana · packs parcels", "p2")}</div>` +
      `<div class="k-zone work col t-in" data-t="zw">WORK${km("Orders · Catalog", "w1")}${km("any board you invent", "w2")}</div>` +
      `<div class="k-zone outreach col t-in" data-t="zo">OUTREACH${km("3-email campaign", "o1")}<span class="t-in" data-t="o2" style="margin-top:2px">${chip("Anika replied ✓", "ok")}</span></div>` +
      `</div></div>`,
    beats: [
      { cap: "Every workspace organizes itself into four worlds.", d: 3800, cues: [
        [400, "show", "zm"], [700, "show", "zp"], [1000, "show", "zw"], [1300, "show", "zo"],
      ]},
      { cap: "Money in and out: invoices, expenses, courier cash — and the always-honest net.", d: 4200, cues: [
        [300, "cam", "zm", 1.5], [800, "show", "m1"], [1500, "show", "m2"],
      ]},
      { cap: "People: customers and suppliers you work WITH — and your team working AS you.", d: 4000, cues: [
        [300, "cam", "zp", 1.5], [800, "show", "p1"], [1500, "show", "p2"],
      ]},
      { cap: "Work: your blank canvas — your own boards, your own rules.", d: 3800, cues: [
        [300, "cam", "zw", 1.5], [800, "show", "w1"], [1500, "show", "w2"],
      ]},
      { cap: "Outreach: campaigns and follow-ups — and who opened, clicked, replied.", d: 4200, cues: [
        [300, "cam", "zo", 1.5], [800, "show", "o1"], [1500, "show", "o2"], [1800, "pulse", "o2"],
      ]},
      { cap: "Four worlds, one company — everything already in its place.", d: 3800, cues: [
        [300, "wide"], [1000, "settle", "fr"],
      ]},
    ],
  },

  "board-zoom": {
    crumb: "Work · Orders", cat: 2, h: 305, center: false,
    html:
      `<div style="max-width:440px"><table class="t-tbl">` +
      `<thead><tr><th>Buyer</th><th>Item</th><th style="text-align:right">Total</th></tr></thead>` +
      `<tbody><tr data-t="g1"><td colspan="3" style="height:20px;font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--primary-ink);background:var(--soft)">NEW</td></tr>` +
      `<tr data-t="arow"><td>Anika</td><td>Rose Dress ×1</td><td class="r t-num"><span data-t="acell">$59</span></td></tr>` +
      `<tr><td>Tomas</td><td>Silk Scarf ×2</td><td class="r t-num">$38</td></tr>` +
      `<tr data-t="g2"><td colspan="3" style="height:20px;font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--t-warn);background:var(--t-warn-bg)">SHIPPED</td></tr>` +
      `<tr><td>Priya S.</td><td>Gift Bundle ×1</td><td class="r t-num">$69</td></tr>` +
      `<tr><td>Omar K.</td><td>Silk Scarf ×1</td><td class="r t-num">$19</td></tr>` +
      `<tr data-t="g3"><td colspan="3" style="height:20px;font-size:8px;font-weight:800;letter-spacing:.05em;color:var(--t-ok);background:var(--t-ok-bg)">DONE</td></tr>` +
      `<tr><td>Lena M.</td><td>Rose Dress ×1</td><td class="r t-num">$59</td></tr></tbody></table></div>`,
    beats: [
      { cap: "A board — the whole ledger, every order your shop has taken.", d: 3400, cues: [] },
      { cap: "Groups — colored sections you'd say out loud: New, Shipped, Done.", d: 4400, cues: [
        [300, "flash", "g1"], [1000, "flash", "g2"], [1700, "flash", "g3"], [2400, "cam", "g1", 1.25],
      ]},
      { cap: "Items — one row per real thing. This is Anika's order.", d: 3600, cues: [
        [300, "cam", "arow", 1.35], [600, "cls", "arow", "fresh", 1],
      ]},
      { cap: "Cells — one fact each. Anika's total: $59.", d: 3400, cues: [
        [0, "cls", "arow", "fresh", 0], [300, "cam", "acell", 1.6], [700, "pulse", "acell"],
      ]},
      { cap: "Every cell remembers who changed it, and when — history is built in.", d: 4200, cues: [
        [500, "toast", "Cell history · <b>Sana</b> set this yesterday, 4:02 pm"],
        [2800, "toastx"], [3000, "wide"],
      ]},
      { cap: "Board → group → item → cell. You just zoomed the whole way down.", d: 3400, cues: [
        [800, "settle", "arow"],
      ]},
    ],
  },

  "role-switch": {
    crumb: "Workspace", cat: 2, h: 275, center: false,
    html:
      `<div style="display:flex;gap:14px;align-items:flex-start;justify-content:center">` +
      `<div class="k-side tall" style="width:88px" data-t="side">` +
      sideItem("Home", "s1") + sideItem("Orders", "s2") + sideItem("Money", "s3") +
      sideItem("Expenses", "s4") + sideItem("Campaigns", "s5") +
      `</div>` +
      `<div style="width:min(330px,60vw)">` +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59"], t: "b1" },
        { c: ["Tomas", "Silk Scarf ×2", "$38"], t: "b2" },
        { c: ["Priya S.", "Gift Bundle ×1", "$69"], t: "b3" },
        { c: ["Omar K.", "Silk Scarf ×1", "$19"], t: "b4" },
      ]}) +
      `<div style="margin-top:8px" data-t="who">${chip("👤 Maya — owner: sees everything", "acc")}</div></div></div>`,
    beats: [
      { cap: "The owner sees everything — every board, every dollar.", d: 3400, cues: [
        [500, "pulse", "who"],
      ]},
      { cap: "Ben — member, no money access. Money isn't locked away; it's simply not there.", d: 4800, cues: [
        [400, "text", "who", chip("👤 Ben — member, no money access")],
        [1000, "cam", "side", 1.3], [1600, "hide", "s3"], [2000, "hide", "s4"],
        [3600, "wide"],
      ]},
      { cap: "Ben still confirms orders all day — his board is full and normal.", d: 3600, cues: [
        [400, "flash", "b1"], [800, "flash", "b2"], [1200, "flash", "b3"], [1600, "flash", "b4"],
      ]},
      { cap: "A guest — Daniel from Atlas Studio — sees ONE shared board. The rest doesn't exist.", d: 4800, cues: [
        [400, "text", "who", chip("👤 Daniel (Atlas Studio) — guest", "warn")],
        [1000, "cam", "side", 1.3], [1600, "hide", "s1"], [1900, "hide", "s5"],
        [2500, "pulse", "s2"], [3600, "wide"],
      ]},
      { cap: "Same board, three pairs of eyes — access shaped per person, not per password.", d: 3800, cues: [
        [800, "settle", "who"],
      ]},
    ],
  },

  "full-map": {
    bare: true, h: 285,
    html:
      `<div style="display:flex;flex-direction:column;gap:11px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="l1">` +
      chip("🛍️ Catalog", "", "catc") + `<span class="k-arrow"></span>` + chip(`<span class="t-mono">yourshop.link/maya</span>`, "", "lnk") + `<span class="k-arrow"></span>` + chip("Orders Board", "acc", "obc") + `</div>` +
      `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="l2">` +
      `<span class="t-in" data-t="m1">${chip("🟢 fraud checked", "ok")}</span>` +
      `<span class="t-in" data-t="m2">${chip(`stock 12 → 11`)}</span>` +
      `<span class="t-in" data-t="m3">${chip("🚚 courier booked", "acc")}</span></div>` +
      `<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="l3">` +
      `<span class="t-in" data-t="m4">${win("Courier Cash", `to collect <b>$147</b> → <b>yours ✓</b>`)}</span>` +
      `<span class="t-in" data-t="m5"><div class="k-zone money">MONEY</div></span></div>` +
      `<div style="display:flex;gap:10px;align-items:stretch;flex-wrap:wrap;justify-content:center;width:min(440px,96%)" data-t="l4">` +
      `<div class="k-zone people col t-in" data-t="m6">PEOPLE<span class="k-mini">every buyer remembered</span></div>` +
      `<div class="k-zone outreach col t-in" data-t="m7">OUTREACH<span class="k-mini">campaigns → replies</span></div>` +
      `<div class="k-zone work col t-in" data-t="m8">WORK<span class="k-mini">boards shaped your way</span></div>` +
      `</div></div>`,
    beats: [
      { cap: "Products flow from your Catalog to your shop link to your Orders Board.", d: 4200, cues: [
        [400, "cam", "l1", 1.2], [800, "pulse", "catc"], [1300, "pulse", "lnk"], [1800, "pulse", "obc"],
      ]},
      { cap: "From the order row: fraud checked, stock counted, courier booked — no typing.", d: 4400, cues: [
        [0, "wide"], [500, "show", "m1"], [1200, "show", "m2"], [1900, "show", "m3"],
      ]},
      { cap: "Delivered cash flows into Courier Cash, then into your money picture.", d: 4200, cues: [
        [400, "show", "m4"], [1200, "show", "m5"], [1600, "cam", "l3", 1.2],
      ]},
      { cap: "People beside everything, Outreach reaching out, Work shaped your way.", d: 4400, cues: [
        [0, "wide"], [500, "show", "m6"], [1100, "show", "m7"], [1700, "show", "m8"],
      ]},
      { cap: "One order in, every part of your company already knows — the map draws itself.", d: 3800, cues: [
        [800, "settle", "obc"],
      ]},
    ],
  },

};
