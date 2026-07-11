// Chapter 8 (Money) + Chapter 2 (Boards & views) + rule-anatomy demos.
// Grammar + authoring rules: see ../theater.mjs and ../demos.mjs.
// Polished to the flagship standard (flagship.mjs): full-screen context,
// KPI strips that recompute, seeded cast rows, honest arithmetic, a skipped
// row where a rule/sweep runs, camera wide→in→wide, cursor only for humans.

import {
  chip, light, tgl, btn, kpis, tbl, trow, rowCells, card, win, ask, life,
  task, prod, phone, shopHead, shopCard, bubble, success, kanban, ART,
} from "../theater.mjs";

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

// The public invoice page (phone) shared by publish-invoice / gateway-connect:
// the same $83 order the flagship checkout placed (#MC-1042).
const invPhone = (extra) =>
  phone(
    `<div style="font-size:7.5px;font-weight:800;letter-spacing:.06em;color:var(--muted)">MAYA'S CLOSET</div>` +
    `<div class="t-mono" style="font-size:10px;font-weight:800;margin:2px 0 6px">INV-0143</div>` +
    `<div class="t-totrow"><span>Rose Dress ×1</span><span>$59</span></div>` +
    `<div class="t-totrow"><span>Silk Scarf ×1</span><span>$19</span></div>` +
    `<div class="t-totrow"><span>Delivery</span><span>$5</span></div>` +
    `<div class="t-totrow grand"><span>Total due</span><span>$83</span></div>` +
    extra,
    "ph");

// table-mastery rows (cols 2+3 swap during the drag beat) — sum $263
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

export const DEMOS_MONEY = {
  "money-map": {
    bare: true, h: 265,
    html:
      `<div style="display:flex;flex-direction:column;gap:12px;align-items:center;width:100%">` +
      `<div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="min">` +
      `<span style="font-size:8px;font-weight:800;letter-spacing:.06em;color:var(--muted)">IN</span>` +
      flowStep("mi1", chip(`Anika orders · <b>$59</b>`, ""), true) +
      flowStep("mi2", win("Invoice", `<span class="t-mono">INV-0142</span> · <b>$59</b>`, "invw", "min-width:0")) +
      flowStep("mi3", win("Payment", `<b>$59</b> ${chip("verified", "acc")}`, "payw", "min-width:0")) +
      flowStep("mi4", win("Receipt", `<span class="t-mono">RCT-090</span> ${chip("sent", "acc")}`, "rcw", "min-width:0")) +
      `</div>` +
      `<div style="display:flex;gap:7px;align-items:center;flex-wrap:wrap;justify-content:center" data-t="mout">` +
      `<span style="font-size:8px;font-weight:800;letter-spacing:.06em;color:var(--muted)">OUT</span>` +
      `<span class="t-in" data-t="mo1">${win("Expenses", `ads <b>$20</b> · packaging <b>$8</b>`, "exw", "min-width:0")}</span>` +
      `</div>` +
      `<div class="t-in" data-t="net">${win("Net this month",
        `<span style="color:var(--muted)">In <b class="t-num" style="color:var(--ink)">$514</b> − out <b class="t-num" style="color:var(--ink)">$28</b> =</span> <b class="t-num" data-t="netv" style="font-size:15px">+$0</b><span class="t-in" data-t="nettick" style="color:var(--t-ok);font-weight:800">✓</span>`, "netw")}</div>` +
      `</div>`,
    beats: [
      { cap: "Money in has four stops. Watch one $59 order — Anika's — walk all of them.", d: 4000, cues: [
        [400, "show", "mi1"], [1900, "cam", "mi1", 1.5],
      ]},
      { cap: "The order becomes an invoice — a real document, numbered and dated.", d: 3800, cues: [
        [300, "show", "mi2"], [700, "cam", "invw", 1.4], [1400, "pulse", "invw"],
      ]},
      { cap: "The invoice collects a payment — verified real, straight from the gateway.", d: 3800, cues: [
        [300, "show", "mi3"], [700, "cam", "payw", 1.4],
        [1300, "toast", "Payment received · <b>$59</b> · INV-0142"],
      ]},
      { cap: "…and the receipt writes and sends itself. Money IN: one unbroken chain.", d: 4000, cues: [
        [0, "toastx"], [300, "show", "mi4"], [700, "cam", "rcw", 1.4], [2700, "wide"],
      ]},
      { cap: "Money out: expenses, logged the moment they happen — ads, packaging, all of it.", d: 3800, cues: [
        [300, "show", "mo1"], [800, "cam", "exw", 1.35], [2700, "wide"],
      ]},
      { cap: "One honest number falls out: in $514, out $28 — net +$486. You made money.", d: 4600, cues: [
        [300, "show", "net"], [700, "cam", "netw", 1.35], [1100, "count", "netv", 0, 486, "+$"],
        [1900, "show", "nettick"], [2200, "settle", "netw"], [3500, "wide"],
      ]},
    ],
  },

  "first-invoice": {
    crumb: "Money · Invoices", cat: 0, h: 340, center: false,
    html:
      `<div style="max-width:470px">` +
      kpis([["Outstanding", "$205", "kOut"], ["Paid this month", "$1,240", "kPaid"], ["Drafts", "1", "kDr"]]) +
      `<div style="display:flex;gap:12px;align-items:flex-start">` +
      `<div style="flex:1;min-width:0">` +
      `<div style="display:flex;align-items:center;gap:6px;margin:2px 0 6px"><span style="font-size:11px;font-weight:800">Invoices</span><span style="margin-left:auto">${btn("New invoice", "newb")}</span></div>` +
      `<table class="t-tbl"><thead><tr><th>Invoice</th><th>Client</th><th style="text-align:right">Total</th><th>Status</th></tr></thead><tbody data-t="list">` +
      trow([`<span class="t-mono">INV-0141</span>`, "Atlas Studio", "$120", chip("Sent", "acc")], "llr") +
      trow([`<span class="t-mono">INV-0140</span>`, "Tomas", "$26", chip("Sent", "acc")], "llr") +
      trow([`<span class="t-mono">INV-0139</span>`, "Lena M.", "$69", chip("Paid ✓", "ok")], "llr") +
      `</tbody></table></div>` +
      `<div class="t-in" data-t="ed" style="width:190px;flex:none">` +
      win(`INVOICE <span class="t-mono" style="color:var(--muted);font-weight:600" data-t="num">№ —</span>`,
        `<div style="display:block;width:100%">` +
        `<div style="font-size:10px;color:var(--muted);padding-bottom:3px">To: <b style="color:var(--ink)">Anika</b></div>` +
        `<div class="t-in" data-t="li1" style="display:flex;justify-content:space-between;gap:10px;padding:2px 0">Rose Dress ×1 <b class="t-num">$59</b></div>` +
        `<div class="t-in" data-t="li2" style="display:flex;justify-content:space-between;gap:10px;padding:2px 0">Silk Scarf ×1 <b class="t-num">$19</b></div>` +
        `<div class="t-in" data-t="li3" style="display:flex;justify-content:space-between;gap:10px;padding:2px 0">Delivery <b class="t-num">$5</b></div>` +
        `<div style="display:flex;justify-content:space-between;gap:10px;border-top:1px solid var(--border);margin-top:5px;padding-top:4px">Total <b class="t-num" data-t="tot">$0</b></div>` +
        `<div class="t-in" data-t="dch" style="margin-top:6px">${chip("DRAFT — edit freely", "", "dchc")}</div>` +
        `</div>`, "invw") +
      `</div></div></div>`,
    beats: [
      { cap: "Your Invoices screen — what's out, what's paid. Time to add one for Anika's order.", d: 3400, cues: [] },
      { cap: "A new invoice for Anika — one click, and a blank draft opens.", d: 4000, cues: [
        [300, "cur", "newb"], [1200, "click", "newb"], [1500, "show", "ed"],
        [1900, "cam", "ed", 1.25], [2400, "curx"],
      ]},
      { cap: "Now the dance: line items land one by one… the dress, $59.", d: 3600, cues: [
        [400, "show", "li1"], [700, "count", "tot", 0, 59, "$"], [800, "pulse", "tot"],
      ]},
      { cap: "…the scarf — and the total rebuilds itself with every landing…", d: 3400, cues: [
        [300, "show", "li2"], [600, "count", "tot", 59, 78, "$"], [700, "pulse", "tot"],
      ]},
      { cap: "…delivery in: $83. Arithmetic you never have to do again.", d: 3600, cues: [
        [300, "show", "li3"], [600, "count", "tot", 78, 83, "$"], [700, "pulse", "tot"],
      ]},
      { cap: "Still a draft: no number yet, nothing sent — edit as much as you like.", d: 3800, cues: [
        [300, "show", "dch"], [700, "pulse", "num"], [1300, "pulse", "dchc"], [2500, "wide"],
      ]},
      { cap: "…and it's already on the board, waiting for publish day. Drafts: 2.", d: 4200, cues: [
        [400, "row", "list", rowCells([`<span class="t-mono">№ —</span>`, "Anika", "$83", chip("Draft", "")], "llr")],
        [1100, "count", "kDr", 1, 2], [1200, "pulse", "kDr"],
        [1900, "settle", "invw"],
      ]},
    ],
  },

  // ═══════════════ Chapter 8 · Money (cont.) ═══════════════

  "publish-invoice": {
    crumb: "Money · Invoices", cat: 0, h: 320, center: false,
    html:
      `<div class="t-view" data-t="v1"><div style="max-width:470px">` +
      kpis([["Outstanding", "$205", "kOut"], ["Awaiting payment", "3", "kWait"], ["Drafts", "1", "kDr"]]) +
      `<table class="t-tbl"><thead><tr><th>Invoice</th><th>Client</th><th style="text-align:right">Total</th><th>Status</th><th></th></tr></thead><tbody>` +
      `<tr data-t="drow"><td><span class="t-mono" data-t="num">№ draft</span></td><td>Anika</td><td class="r t-num">$59</td><td>${chip("Draft", "", "dst")}</td><td>${btn("Publish", "pub")}</td></tr>` +
      trow([`<span class="t-mono">INV-0141</span>`, "Atlas Studio", "$120", chip("Sent", "acc"), ""], "llr") +
      trow([`<span class="t-mono">INV-0140</span>`, "Tomas", "$26", chip("Sent", "acc"), ""], "llr") +
      `</tbody></table></div></div>` +
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
      { cap: "A draft invoice for Anika, sitting on your Invoices board with the rest.", d: 3400, cues: [
        [500, "cam", "drow", 1.2], [2400, "wide"],
      ]},
      { cap: "Publish mints a real number — never reused, never edited after. The one-way door.", d: 4200, cues: [
        [300, "cam", "drow", 1.25], [900, "cur", "pub"], [1700, "click", "pub"],
        [1900, "chip", "dst", "acc", "Sent"], [2000, "text", "num", `<span class="t-mono">INV-2026-014</span>`], [2100, "pulse", "num"],
        [2600, "curx"], [3400, "wide"],
      ]},
      { cap: "Your customer gets a public page — no account, no app, just a link.", d: 4000, cues: [
        [100, "cls", "v1", "off", 1], [300, "cls", "v2", "off", 0], [900, "cam", "ph", 1.35],
      ]},
      { cap: "And the moment they open it, you see it: Viewed, timestamped.", d: 4400, cues: [
        [0, "wide"], [100, "cls", "v2", "off", 1], [300, "cls", "v1", "off", 0],
        [700, "toast", "<b>Anika</b> opened INV-2026-014 · 2:14 pm"],
        [1400, "cam", "drow", 1.25], [1900, "chip", "dst", "acc", "Viewed 👁"], [2200, "pulse", "dst"],
        [3200, "toastx"], [3500, "wide"],
      ]},
    ],
  },

  "gateway-connect": {
    crumb: "Money · Settings · Payments", cat: 0, h: 300, center: false,
    html:
      `<div class="t-view" data-t="v1"><div style="max-width:420px">` +
      win("Settings · Payments",
        `<div style="display:block;width:100%">` +
        `<div style="display:flex;align-items:center;gap:8px;padding:3px 0">Card gateway ${chip("Not connected", "", "gst")} <span style="margin-left:auto">${btn("Connect", "cbtn")}</span></div>` +
        `<div style="display:flex;align-items:center;gap:8px;padding:3px 0;color:var(--muted)">Cash on delivery ${chip("Always on", "acc")}</div>` +
        `<div class="t-in" data-t="keyrow" style="display:flex;align-items:center;gap:8px;padding:3px 0;color:var(--muted)">Account key <span class="t-mono">••••••••</span> ${chip("saved", "ok")}</div>` +
        `</div>`, "sw") +
      `</div></div>` +
      `<div class="t-view off" data-t="v2" style="align-items:center;gap:14px">` +
      phone(
        `<div style="font-size:7.5px;font-weight:800;letter-spacing:.06em;color:var(--muted)">MAYA'S CLOSET</div>` +
        `<div class="t-mono" style="font-size:10px;font-weight:800;margin:2px 0 6px">INV-2026-014</div>` +
        `<div class="t-totrow"><span>Rose Dress ×1</span><span>$59</span></div>` +
        `<div class="t-totrow grand"><span>Total due</span><span>$59</span></div>` +
        `<div class="t-in" data-t="payb" class="t-place">Pay $59 online</div>` +
        success("psucc", "Payment received", "$59 · verified real"),
        "ph") +
      `<div style="display:flex;flex-direction:column;gap:8px;align-items:center">` +
      win("Invoice — Anika", `$59 ${chip("Sent", "acc", "pst")}`, "iw2") +
      `<div class="t-in" data-t="rc">${chip("receipt minted → RCT-091", "ok")}</div>` +
      `</div></div>`,
    beats: [
      { cap: "Connect your payment gateway once, in Settings — the account key saves itself.", d: 4400, cues: [
        [300, "cam", "sw", 1.3], [900, "cur", "cbtn"], [1700, "click", "cbtn"],
        [1900, "chip", "gst", "acc", "Connected ✓"], [2200, "show", "keyrow"],
        [2700, "curx"], [3500, "wide"],
      ]},
      { cap: "From now on, every public invoice grows a Pay button.", d: 3800, cues: [
        [100, "cls", "v1", "off", 1], [300, "cls", "v2", "off", 0],
        [900, "cam", "payb", 1.4], [1500, "pulse", "payb"], [2800, "wide"],
      ]},
      { cap: "Your customer pays — real money, verified. No screenshots accepted, ever.", d: 4200, cues: [
        [300, "cam", "payb", 1.35],
        [900, "cls", "payb", "pressed", 1], [1050, "cls", "payb", "pressed", 0],
        [1250, "show", "psucc"], [2400, "wide"],
      ]},
      { cap: "Paid stamps itself, and the receipt mints on its own. The loop closes clean.", d: 4200, cues: [
        [400, "cam", "iw2", 1.3], [900, "chip", "pst", "ok", "PAID ✓"], [1300, "show", "rc"],
        [1800, "settle", "iw2"], [3000, "wide"],
      ]},
    ],
  },

  "expense-ask": {
    crumb: "Money · Expenses", cat: 0, h: 330, center: false,
    html:
      `<div style="max-width:440px">` +
      kpis([["Spent this month", "$92", "kSpent"], ["Net this month", "+$486", "kNet"]], "two") +
      `<div style="width:min(300px,94%);margin:2px auto 8px" data-t="askw">${ask("askt")}</div>` +
      `<table class="t-tbl"><thead><tr><th>Expense</th><th>When</th><th style="text-align:right">Amount</th></tr></thead><tbody data-t="list">` +
      trow(["Packaging", "yesterday", "$8"], "llr") +
      trow(["Fabric supplier", "Mon", "$64"], "llr") +
      `</tbody></table>` +
      `<div class="t-in" data-t="cc" style="margin-top:9px">${win("New expense?",
        `<div style="display:block;width:100%">Ads — <b>$20</b> · today <span style="margin-left:auto">${btn("Confirm", "cf")} ${chip("Cancel", "", "cancel")}</span></div>`, "ccw")}</div>` +
      `</div>`,
    beats: [
      { cap: "The fastest expense entry is a sentence — no form, no fields.", d: 4000, cues: [
        [300, "cam", "askw", 1.3], [900, "type", "askt", "spent 20 on boost"],
      ]},
      { cap: "ASK reads it and shows a confirm card. Nothing happens until you agree.", d: 4000, cues: [
        [300, "show", "cc"], [700, "cam", "cc", 1.3], [2800, "wide"],
      ]},
      { cap: "You confirm — the only click. It lands on the ledger…", d: 3800, cues: [
        [200, "cur", "cf"], [1000, "click", "cf"], [1300, "hide", "cc"],
        [1500, "row", "list", rowCells(["Ads · boost", "today", "$20"], "llr")],
        [1900, "curx"],
      ]},
      { cap: "…and your two honest numbers move at once: spent up, net down. On the books.", d: 4400, cues: [
        [300, "count", "kSpent", 92, 112, "$"], [400, "pulse", "kSpent"],
        [900, "count", "kNet", 486, 466, "+$"], [1000, "pulse", "kNet"],
        [1900, "wide"], [2400, "settle", "kNet"],
      ]},
    ],
  },

  // ═══════════════ Chapter 11 · Automations ═══════════════

  "rule-anatomy": {
    crumb: "Work · Automation Studio", cat: 2, h: 335,
    html:
      `<div style="display:flex;gap:14px;align-items:flex-start;justify-content:center;flex-wrap:wrap;width:100%">` +
      `<div style="display:flex;flex-direction:column;gap:4px;align-items:center;width:min(230px,64%)" data-t="stack">` +
      `<div class="t-in" data-t="c1" style="width:100%">${win("TRIGGER", `invoice becomes ${chip("Overdue", "bad")}`, "", "width:100%")}</div>` +
      `<div class="t-in" data-t="a1" style="color:var(--muted);font-size:10px;line-height:1.1">↓</div>` +
      `<div class="t-in" data-t="c2" style="width:100%">${win("CHECK", `amount over <b>$50</b>?`, "", "width:100%")}</div>` +
      `<div class="t-in" data-t="a2" style="color:var(--muted);font-size:10px;line-height:1.1">↓</div>` +
      `<div class="t-in" data-t="c3" style="display:flex;gap:8px;width:100%">` +
      win("THEN", "remind the customer", "cthen", "flex:1;min-width:0") +
      win("ELSE", "just tell me", "celse", "flex:1;min-width:0") +
      `</div></div>` +
      `<div class="t-in" data-t="livewrap" style="width:200px;flex:none">` +
      `<div style="font-size:9px;font-weight:800;letter-spacing:.05em;color:var(--muted);margin-bottom:5px">A REAL ROW HITS IT</div>` +
      `<table class="t-tbl"><thead><tr><th>Invoice</th><th style="text-align:right">Amount</th></tr></thead><tbody>` +
      `<tr data-t="lr"><td><span class="t-mono">INV-0138</span></td><td class="r"><span data-t="lamt">$120</span> ${chip("Overdue", "bad", "lst")}</td></tr>` +
      `</tbody></table>` +
      `<div class="t-in" data-t="lout" style="margin-top:7px">${chip("→ reminder sent to Tomas", "acc")}</div>` +
      `</div></div>`,
    beats: [
      { cap: "Every rule is three slots. Trigger: the event the rule watches for.", d: 3800, cues: [
        [400, "show", "c1"], [900, "cam", "c1", 1.3],
      ]},
      { cap: "Check: an optional question — only act if this is true.", d: 3600, cues: [
        [200, "show", "a1"], [500, "show", "c2"], [900, "cam", "c2", 1.3],
      ]},
      { cap: "Then / Else: what happens — and what happens otherwise.", d: 4000, cues: [
        [200, "show", "a2"], [500, "show", "c3"], [900, "cam", "c3", 1.25],
        [1400, "pulse", "cthen"], [2000, "pulse", "celse"],
      ]},
      { cap: "Now watch it fire: INV-0138 is $120 and Overdue — over $50, so THEN wins.", d: 4400, cues: [
        [300, "wide"], [700, "show", "livewrap"], [1100, "cam", "livewrap", 1.15],
        [1600, "flash", "lr"], [2000, "show", "lout"],
      ]},
      { cap: "Three slots you can read aloud — every rule you'll ever build.", d: 3400, cues: [
        [300, "wide"], [900, "settle", "stack"],
      ]},
    ],
  },

  // ═══════════════ Chapter 2 · Boards & views ═══════════════

  "build-board": {
    crumb: "Work · Deliveries", cat: 2, h: 275, center: false,
    html:
      `<div style="max-width:400px">` +
      `<div style="font-size:12.5px;font-weight:800;margin-bottom:7px" data-t="bname"><span data-t="bnt"></span><span style="color:var(--muted);font-weight:500;font-size:10px"> · new board</span></div>` +
      `<table class="t-tbl"><thead><tr data-t="hd">` +
      `<th><span class="t-in" data-t="c1">Buyer</span></th>` +
      `<th><span class="t-in" data-t="c2">Item</span></th>` +
      `<th style="text-align:right"><span class="t-in" data-t="c3">Cash due</span></th>` +
      `</tr></thead>` +
      `<tbody>${bandRow("g1", "OUT FOR DELIVERY")}</tbody>` +
      `<tbody data-t="nb"></tbody>` +
      `<tbody>${bandRow("g2", "DELIVERED", true)}</tbody>` +
      `<tbody data-t="db"></tbody>` +
      `</table></div>`,
    beats: [
      { cap: "A blank board. Name it for what a row will be: “Deliveries.”", d: 3800, cues: [
        [400, "cam", "bname", 1.5], [1100, "type", "bnt", "Deliveries"],
      ]},
      { cap: "Groups appear — the stages you'd say out loud: out for delivery, delivered.", d: 3800, cues: [
        [200, "wide"], [700, "show", "g1"], [1600, "show", "g2"],
      ]},
      { cap: "Columns: one fact each — who, what, how much cash is riding on it.", d: 3800, cues: [
        [200, "cam", "hd", 1.3], [500, "show", "c1"], [1000, "show", "c2"], [1500, "show", "c3"],
        [2900, "wide"],
      ]},
      { cap: "Rows do the rest — real deliveries, dropping into the right group.", d: 4200, cues: [
        [400, "row", "nb", rowCells(["Anika", "Rose Dress ×1", "$59"], "llr")],
        [1300, "row", "nb", rowCells(["Tomas", "Silk Scarf ×2", "$38"], "llr")],
        [2300, "row", "db", rowCells(["Priya S.", "Gift Bundle ×1", "$69"], "llr")],
      ]},
      { cap: "Blank to working in under a minute — no setup, no template, no code.", d: 3400, cues: [
        [300, "cam", "nb", 1.15], [900, "settle", "nb"], [2400, "wide"],
      ]},
    ],
  },

  "item-panel": {
    crumb: "Work · Orders", cat: 2, h: 290, center: false,
    html:
      `<div style="max-width:470px">` +
      kpis([["Orders today", "6", "kOrd"], ["Pending COD", "$147", "kCod"], ["Unread", "2", "kUn"]]) +
      `<div style="display:flex;gap:12px;align-items:flex-start">` +
      `<div style="flex:1;min-width:0">` +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59"], t: "arow" },
        ["Tomas", "Silk Scarf ×2", "$38"],
        ["Priya S.", "Gift Bundle ×1", "$69"],
        ["Omar K.", "Silk Scarf ×1", "$19"],
      ]}) + `</div>` +
      `<div class="t-in" data-t="panel" style="width:180px;flex:none">` +
      win("Anika — Rose Dress ×1",
        `<div style="display:block;width:100%">` +
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:2px 0">Status ${chip("Booked", "acc")}</div>` +
        `<div style="display:flex;justify-content:space-between;padding:2px 0">Total <b class="t-num">$59</b></div>` +
        `<div style="display:flex;justify-content:space-between;padding:2px 0">Courier <span class="t-mono">TRK-8841</span></div>` +
        `<div data-t="meta" style="padding:3px 0;color:var(--muted)">💬 2 comments · 📎 1 file</div>` +
        `<div data-t="hist" style="padding:2px 0;color:var(--muted)"><span style="letter-spacing:2px">●●●</span> every change kept</div>` +
        `</div>`, "pwin") +
      `</div></div></div>`,
    beats: [
      { cap: "Your Orders board — every order a row. Click one to see everything about it.", d: 3600, cues: [
        [600, "cam", "arow", 1.15], [2400, "wide"],
      ]},
      { cap: "Click Anika's row — the Item panel slides in beside it.", d: 3800, cues: [
        [300, "cur", "arow"], [1100, "click", "arow"], [1250, "cls", "arow", "fresh", 1],
        [1450, "show", "panel"], [1700, "cam", "panel", 1.2], [2100, "curx"],
      ]},
      { cap: "Everything about one thing, in one place — status, total, courier, files, comments.", d: 4400, cues: [
        [0, "cls", "arow", "fresh", 0], [500, "pulse", "meta"], [1600, "flash", "meta"],
      ]},
      { cap: "…including who changed what, and when. Nothing about this order is lost.", d: 3800, cues: [
        [300, "cam", "hist", 1.4], [700, "pulse", "hist"],
        [1900, "wide"], [2300, "settle", "pwin"],
      ]},
    ],
  },

  "views-glasses": {
    crumb: "Work · Orders", cat: 2, h: 280, center: false,
    html:
      `<div class="t-view" data-t="v1"><div style="width:min(360px,94%)">` +
      vtabs(0) +
      tbl({ head: ["Buyer", "Item", "Total"], aligns: "llr", rows: [
        { c: ["Anika", "Rose Dress ×1", "$59"], t: "tr1" },
        ["Tomas", "Silk Scarf ×2", "$38"],
        ["Priya S.", "Gift Bundle ×1", "$69"],
        ["Omar K.", "Silk Scarf ×1", "$19"],
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
        { name: "Done", dot: "var(--t-ok)", cards: [
          { name: "Omar K. — $19", sub: "Silk Scarf ×1" },
        ]},
      ]) + `</div></div>` +
      `<div class="t-view off" data-t="v3"><div>` +
      vtabs(2) +
      `<div style="border:1px solid var(--border);border-radius:9px;overflow:hidden;width:270px;background:var(--card)" data-t="cal">` +
      `<div style="font-size:8.5px;font-weight:800;letter-spacing:.05em;padding:5px 9px;border-bottom:1px solid var(--border)">MARCH</div>` +
      `<div style="display:grid;grid-template-columns:repeat(5,1fr);border-bottom:1px solid var(--border)">${["Mon", "Tue", "Wed", "Thu", "Fri"]
        .map((d) => `<span style="font-size:7px;font-weight:700;color:var(--muted);text-align:center;padding:2px 0">${d}</span>`).join("")}</div>` +
      `<div style="display:grid;grid-template-columns:repeat(5,1fr)">${[9, 10, 11, 12, 13]
        .map((n, i) => `<div style="min-height:46px;padding:3px;border-right:${i < 4 ? "1px solid var(--border)" : "0"}">` +
          `<div style="font-size:7px;color:var(--muted)">${n}</div>` +
          (n === 10 ? calChip("Anika", "acc", "calA") : n === 11 ? calChip("Omar K.", "") : n === 12 ? calChip("Tomas", "") : n === 13 ? calChip("Priya S.", "") : "") +
          `</div>`).join("")}</div>` +
      `</div></div></div>`,
    beats: [
      { cap: "The board is the data. A view is just a pair of glasses you put on it.", d: 3600, cues: [
        [700, "flash", "tr1"], [1400, "cam", "tr1", 1.15], [2600, "wide"],
      ]},
      { cap: "The same four orders as cards on a Kanban — drag between stages.", d: 4200, cues: [
        [0, "cls", "v1", "off", 1], [260, "cls", "v2", "off", 0],
        [900, "cam", "kA", 1.3], [1200, "pulse", "kA"], [3000, "wide"],
      ]},
      { cap: "The same four on a Calendar — anything with a date finds its day.", d: 4200, cues: [
        [0, "cls", "v2", "off", 1], [260, "cls", "v3", "off", 0],
        [900, "cam", "calA", 1.4], [1200, "pulse", "calA"], [3000, "wide"],
      ]},
      { cap: "Three views, one board — same Anika, same $59. The data never moved.", d: 3600, cues: [
        [500, "settle", "cal"],
      ]},
    ],
  },

  "table-mastery": {
    crumb: "Work · Orders", cat: 2, h: 300, center: false,
    html:
      `<div style="max-width:360px">` +
      `<div style="display:flex;gap:6px;align-items:center;margin-bottom:7px">${chip(`<b class="t-num">5,000</b> rows`, "acc")}${chip("header pinned ⤓", "", "pinc")}</div>` +
      `<table class="t-tbl"><thead><tr data-t="hr">` +
      `<th>Buyer</th><th><span data-t="tmh2">Item</span></th><th style="text-align:right"><span data-t="tmh3">Total</span></th>` +
      `</tr></thead><tbody>` +
      TM_ROWS.map((r, i) =>
        `<tr${i === 4 ? ' data-t="r4"' : ""}><td>${r[0]}</td><td><span data-t="tmi${i}">${r[1]}</span></td><td class="r"><span data-t="tmt${i}" class="t-num">${r[2]}</span></td></tr>`
      ).join("") +
      `</tbody></table>` +
      `<div style="display:flex;gap:6px;margin-top:7px;min-height:20px">` +
      `<span class="t-in" data-t="mv">${chip("↔ column moved")}</span>` +
      `</div></div>`,
    beats: [
      { cap: "A busy board — thousands of orders. Pin the header and scroll without losing the labels.", d: 4400, cues: [
        [500, "cam", "r4", 1.15], [1300, "flash", "hr"], [1700, "pulse", "pinc"], [3300, "wide"],
      ]},
      { cap: "Drag a column into the order you want — grab Total, drop it before Item.", d: 4800, cues: [
        [300, "cur", "tmh3"], [1000, "click", "tmh3"], [1200, "cur", "tmh2"],
        [1850, "flash", "hr"], [1900, "text", "tmh2", "Total"], [1900, "text", "tmh3", "Item"],
        ...tmSwapCues,
        [2400, "show", "mv"], [2900, "curx"],
      ]},
      { cap: "Resize, reorder, arrange it all you like — the rows underneath never change.", d: 3600, cues: [
        [400, "settle", "hr"], [1400, "hide", "mv"],
      ]},
    ],
  },

  "filter-stack": {
    crumb: "Work · Orders", cat: 2, h: 290, center: false,
    html:
      `<div style="max-width:440px">` +
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
        { c: ["Lena M.", "Riverside", chip("Pending", "warn")], t: "p4" },
        { c: ["Chen W.", "Kingsport", chip("Shipped", "acc")], t: "p5" },
      ]}) + `</div>`,
    beats: [
      { cap: "214 orders. Stack filters like a sentence — first: Status is Pending…", d: 4400, cues: [
        [300, "cam", "bar", 1.3], [800, "cur", "fbtn"], [1600, "click", "fbtn"],
        [1800, "show", "f1"], [2300, "wide"],
        [2600, "cls", "p2", "dim", 1], [2650, "cls", "p3", "dim", 1], [2700, "cls", "p5", "dim", 1],
        [2900, "count", "cnt", 214, 42], [3000, "pulse", "cntc"],
      ]},
      { cap: "…and City is Riverside. The rows that don't fit fade; the count follows, live.", d: 4400, cues: [
        [600, "click", "fbtn"], [800, "show", "f2"],
        [1400, "cls", "p1", "dim", 1],
        [1700, "count", "cnt", 42, 7], [1800, "pulse", "cntc"],
        [2800, "show", "clr"],
      ]},
      { cap: "Clear the chips and all 214 return. Filters hide rows — they never delete them.", d: 4800, cues: [
        [300, "cur", "clr"], [1100, "click", "clr"],
        [1300, "hide", "f1"], [1400, "hide", "f2"], [1450, "hide", "clr"],
        [1600, "cls", "p1", "dim", 0], [1650, "cls", "p2", "dim", 0], [1700, "cls", "p3", "dim", 0], [1750, "cls", "p5", "dim", 0],
        [1900, "count", "cnt", 7, 214], [2000, "pulse", "cntc"],
        [2400, "curx"], [2900, "settle", "cntc"],
      ]},
    ],
  },

  "undo-trash": {
    crumb: "Work · Orders", cat: 2, h: 275, center: false,
    html:
      `<div style="display:flex;gap:14px;align-items:flex-start;max-width:470px">` +
      `<div style="flex:1;min-width:0">` +
      `<table class="t-tbl"><thead><tr><th>Buyer</th><th>Item</th><th style="text-align:right">Total</th><th></th></tr></thead><tbody data-t="ob">` +
      `<tr><td>Tomas</td><td>Silk Scarf ×2</td><td class="r t-num">$38</td><td></td></tr>` +
      `<tr><td>Priya S.</td><td>Gift Bundle ×1</td><td class="r t-num">$69</td><td></td></tr>` +
      `<tr><td>Omar K.</td><td>Silk Scarf ×1</td><td class="r t-num">$19</td><td></td></tr>` +
      `<tr class="t-in in" data-t="arow"><td style="border-bottom:0">Anika</td><td style="border-bottom:0">Rose Dress ×1</td><td class="r t-num" style="border-bottom:0">$59</td><td style="border-bottom:0"><span data-t="del" style="color:var(--muted)">🗑</span></td></tr>` +
      `</tbody></table>` +
      `<div class="t-in" data-t="undoc" style="margin-top:9px">${chip("Undo import · 500 rows swept back")}</div>` +
      `</div>` +
      `<div style="width:184px;flex:none">` +
      win("Trash",
        `<div style="display:block;width:100%">` +
        `<div data-t="tz" style="min-height:16px;color:var(--muted)">empty</div>` +
        `<div class="t-in" data-t="trow2" style="display:flex;gap:6px;align-items:center;margin-top:6px">${chip("restorable", "warn")}${btn("Restore", "rbtn", "o")}</div>` +
        `</div>`, "twin") +
      `</div></div>`,
    beats: [
      { cap: "Delete an order by mistake? It doesn't vanish — it goes to Trash.", d: 4200, cues: [
        [300, "cur", "del"], [1100, "click", "del"], [1300, "hide", "arow"],
        [1500, "text", "tz", `Anika — Rose Dress ×1 · <b>$59</b>`],
        [1600, "show", "trow2"], [1800, "cam", "twin", 1.3], [1900, "curx"], [2300, "pulse", "twin"],
      ]},
      { cap: "Restore brings it back — the row, its history, everything, exactly as it was.", d: 4200, cues: [
        [300, "cur", "rbtn"], [1100, "click", "rbtn"],
        [1300, "show", "arow"], [1400, "text", "tz", "empty"],
        [1600, "curx"], [1900, "hide", "trow2"], [2000, "wide"],
        [2400, "flash", "arow"], [2700, "settle", "arow"],
      ]},
      { cap: "And a 500-row import gone wrong? One undo step sweeps it all back. Never fear the click.", d: 4400, cues: [
        [400, "show", "undoc"], [900, "cam", "undoc", 1.3], [1200, "pulse", "undoc"],
        [3200, "wide"],
      ]},
    ],
  },

};
