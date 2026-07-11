// Flagship demos — the polish exemplars. Every other demo file matches these.
// Grammar + authoring rules: see ../theater.mjs and ../demos.mjs.

import {
  chip, light, tgl, btn, kpis, tbl, trow, rowCells, card, win, ask, life,
  task, prod, phone, shopHead, shopCard, bubble, success, kanban, ART,
} from "../theater.mjs";

const smsIcon = (t) =>
  `<span class="t-in" data-t="${t}" style="color:var(--primary-ink);font-size:11px">✉</span>`;

export const DEMOS_FLAGSHIP = {
  "order-ripple": {
    crumb: "Work · Orders", cat: 2, h: 345, center: false,
    html:
      `<div style="max-width:460px">` +
      kpis([["Orders today", "6", "kOrd"], ["Pending COD", "$88", "kCod"], ["In risk review", "0", "kRisk"]]) +
      `<div style="display:flex;gap:6px;align-items:center;margin:2px 0 7px">${chip(`Rose Dress · stock <b class="t-num" data-t="stk">12</b>`, "", "stkc")}${chip("Silk Scarf · stock 30", "")}</div>` +
      tbl({
        t: "ob", head: ["Buyer", "Items", "Total", "Status"], aligns: "llr",
        rows: [
          { c: ["Priya S.", "Gift Bundle ×1", "$69", chip("Booked", "acc")], t: "seed1" },
          { c: ["Omar K.", "Silk Scarf ×1", "$19", chip("Confirmed", "acc")], t: "seed2" },
          { c: ["Anika", "Silk Scarf ×1", "$19", chip("Done", "ok")], t: "seed3" },
          { c: ["Lena M.", "Rose Dress ×1", "$59", chip("Done", "ok")], t: "seed4" },
        ],
      }) +
      `<div class="t-in" data-t="money" style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">` +
      win("Invoices", `Draft — Tomas · <b>$59</b> ${chip("new", "acc")}`) +
      win("Courier Cash", `To collect <b class="t-num" data-t="cc">$147</b>`) +
      `</div></div>` +
      phone(
        shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
        `<div class="t-sgrid">${shopCard({ art: "dress", name: "Rose Dress", price: "$59" })}${shopCard({ art: "scarf", name: "Silk Scarf", price: "$19" })}</div>` +
        `<div class="t-totrow grand" style="margin-top:6px"><span>Total</span><span>$59</span></div>` +
        `<div class="t-place" data-t="place" style="margin-top:5px">Order — cash on delivery</div>` +
        success("psucc", "Order placed", "#MC-1042 · Rose Dress ×1 · pay $59 on delivery"),
        "ph"
      ).replace('class="t-phone"', 'class="t-phone" style="position:absolute;right:8px;bottom:8px;z-index:6"'),
    beats: [
      { cap: "A customer orders from your shop link — no app, no account, no back-and-forth.", d: 4200, cues: [
        [300, "cam", "ph", 1.4],
        [1800, "cls", "place", "pressed", 1], [1950, "cls", "place", "pressed", 0],
        [2150, "show", "psucc"],
      ]},
      { cap: "The order lands on your Orders Board as a new row. You typed nothing.", d: 3800, cues: [
        [0, "cls", "ph", "gone", 1], [200, "cam", "ob", 1.15],
        [600, "row", "ob", rowCells(["Tomas", "Rose Dress ×1", "$59", chip("New", "acc", "st") + " " + chip("…", "", "risk")], "llr")],
        [1400, "count", "kOrd", 6, 7], [1450, "pulse", "kOrd"],
      ]},
      { cap: "The fraud check runs on its own, and stock counts itself down.", d: 4000, cues: [
        [200, "chip", "risk", "", "Checking…"],
        [1500, "chip", "risk", "ok", "🟢 Looks safe"],
        [2400, "count", "stk", 12, 11], [2450, "pulse", "stkc"],
      ]},
      { cap: "You confirm — your one human decision per order.", d: 3600, cues: [
        [200, "cur", "st"], [1200, "click", "st"],
        [1400, "chip", "st", "acc", "Confirmed"],
        [2100, "curx"],
      ]},
      { cap: "…and the courier books itself: tracking ID written to the row, no copy-paste, no typos.", d: 3800, cues: [
        [400, "toast", "Courier booked · <b>TRK-88412</b> written to the row"],
        [1200, "chip", "st", "acc", "Booked"],
      ]},
      { cap: "The money side updates itself — invoice drafted, Courier Cash now watching $147 for you.", d: 4400, cues: [
        [0, "toastx"], [300, "show", "money"], [600, "cam", "money", 1.25],
        [1400, "count", "kCod", 88, 147, "$"], [1450, "pulse", "kCod"],
      ]},
      { cap: "One tap from a customer — six things done for you. That's the ripple.", d: 3600, cues: [
        [300, "wide"], [900, "settle", "st"],
      ]},
    ],
  },

  "rule-card": {
    crumb: "Work · Automation Studio", cat: 2, h: 350, center: false,
    html:
      `<div style="max-width:460px">` +
      card({
        t: "rec", name: "Delivery follow-up", stat: "Off · never run", statT: "rstat",
        rule: `When an order becomes <b>Delivered</b>: move it to <b>Done</b>, request a review, and text the customer.`,
        right: tgl("tg"),
      }) +
      `<div style="display:flex;gap:6px;margin:8px 0 6px">${chip(`Processed <b class="t-num" data-t="kp">0</b>`, "", "kpc")}${chip(`Texts sent <b class="t-num" data-t="kt">0</b>`, "", "ktc")}${chip(`Skipped <b class="t-num" data-t="ks">0</b>`, "", "ksc")}</div>` +
      tbl({ t: "ob", head: ["Buyer", "Item", "Status", ""], rows: [
        { c: ["Anika", "Rose Dress ×1", chip("Delivered", "acc", "s0"), smsIcon("m0")], t: "r0" },
        { c: ["Tomas", "Silk Scarf ×2", chip("Delivered", "acc", "s1"), smsIcon("m1")], t: "r1" },
        { c: ["Priya S.", "Gift Bundle ×1", chip("Packed", "", "s2"), smsIcon("m2")], t: "r2" },
        { c: ["Omar K.", "Rose Dress ×1", chip("Delivered", "acc", "s3"), smsIcon("m3")], t: "r3" },
        { c: ["Lena M.", "Silk Scarf ×1", chip("Delivered", "acc", "s4"), smsIcon("m4")], t: "r4" },
      ]}) + `</div>`,
    beats: [
      { cap: "An automation is a written-down habit: WHEN this happens, DO that.", d: 3800, cues: [
        [300, "cam", "rec", 1.3], [800, "cls", "rec", "fresh", 1],
      ]},
      { cap: "Switch it on. That's the cursor's only job — then it leaves for good.", d: 3600, cues: [
        [200, "cur", "tg"], [1200, "click", "tg"], [1350, "cls", "tg", "on", 1],
        [1400, "text", "rstat", "On"], [2100, "curx"],
      ]},
      { cap: "…and it runs: the rule ripples down the board, accelerating as it goes.", d: 5200, cues: [
        [0, "cls", "rec", "fresh", 0], [200, "wide"],
        [700, "flash", "r0"], [800, "chip", "s0", "ok", "Done ✓"], [900, "show", "m0"], [950, "count", "kp", 0, 1], [960, "count", "kt", 0, 1],
        [1700, "flash", "r1"], [1800, "chip", "s1", "ok", "Done ✓"], [1900, "show", "m1"], [1950, "count", "kp", 1, 2], [1960, "count", "kt", 1, 2],
        [2500, "flash", "r2"], [2650, "count", "ks", 0, 1], [2700, "pulse", "ksc"],
        [3200, "flash", "r3"], [3280, "chip", "s3", "ok", "Done ✓"], [3350, "show", "m3"], [3400, "count", "kp", 2, 3], [3410, "count", "kt", 2, 3],
        [3800, "flash", "r4"], [3870, "chip", "s4", "ok", "Done ✓"], [3930, "show", "m4"], [3980, "count", "kp", 3, 4], [3990, "count", "kt", 3, 4],
      ]},
      { cap: "Notice what it skipped: Priya's order is only Packed — the trigger is precise.", d: 3800, cues: [
        [300, "cam", "r2", 1.3], [900, "flash", "r2"],
      ]},
      { cap: "You flipped one switch. Four orders processed themselves.", d: 3400, cues: [
        [300, "wide"], [900, "settle", "kpc"],
      ]},
      { cap: "And it fires on its own now — a new delivery processes with nobody at the keyboard.", d: 4600, cues: [
        [400, "row", "ob", rowCells(["Chen W.", "Silk Scarf ×1", chip("Delivered", "acc", "s5") , smsIcon("m5")], "")],
        [1300, "cam", "ob", 1.12],
        [1900, "chip", "s5", "ok", "Done ✓"], [2100, "show", "m5"],
        [2200, "count", "kp", 4, 5], [2250, "count", "kt", 4, 5],
        [3300, "wide"],
      ]},
    ],
  },

  // ═══════════════ Chapter 8 · Money ═══════════════,

  "invoice-life": {
    crumb: "Money · Invoices", cat: 0, h: 330, center: false,
    html:
      `<div style="max-width:460px">` +
      kpis([["Outstanding", "$205", "kOut"], ["Paid this month", "$1,240", "kPaid"], ["Awaiting payment", "3", "kWait"]]) +
      tbl({ head: ["Invoice", "Client", "Total", "Status", ""], aligns: "llr", rows: [
        { c: [`<span class="t-mono">INV-0142</span>`, "Anika", `<span data-t="amt">$59</span>`, chip("Draft", "", "st"), btn("Send", "send")], t: "row" },
        { c: [`<span class="t-mono">INV-0141</span>`, "Atlas Studio", "$120", chip("Sent", "acc"), ""], t: "row2" },
        { c: [`<span class="t-mono">INV-0140</span>`, "Tomas", "$26", chip("Sent", "acc"), ""], t: "row3" },
      ]}) +
      life([
        { l: "Sent", t: "n1" }, { l: "Delivered", t: "n2" }, { l: "Opened", t: "n3" },
        { l: "Paid", t: "n4", ok: true }, { l: "Receipt", t: "n5", ok: true },
      ]) + `</div>`,
    beats: [
      { cap: "An invoice walks a public, honest life — and you watch every step of it.", d: 3400, cues: [
        [400, "cam", "row", 1.2],
      ]},
      { cap: "You send it, with a pay link inside — the only click in this story.", d: 3800, cues: [
        [200, "cur", "send"], [1300, "click", "send"],
        [1500, "chip", "st", "acc", "Sent"], [1550, "cls", "n1", "done", 1],
        [2200, "curx"], [2500, "wide"],
      ]},
      { cap: "Delivered, confirmed.", d: 3200, cues: [
        [600, "cls", "n2", "wired", 1], [900, "cls", "n2", "done", 1],
      ]},
      { cap: "And here's the lean-in moment: your customer just opened it. You KNOW.", d: 4200, cues: [
        [500, "cls", "n3", "wired", 1], [800, "cls", "n3", "done", 1],
        [1000, "toast", "<b>Anika</b> opened your invoice · 2:14 pm"],
        [1400, "pulse", "n3"],
      ]},
      { cap: "Payment verified real — Paid stamps itself. The first green of the story.", d: 4400, cues: [
        [0, "toastx"], [500, "cls", "n4", "wired", 1], [800, "cls", "n4", "done", 1],
        [1000, "chip", "st", "ok", "Paid ✓"], [1100, "pulse", "amt"],
        [1800, "count", "kOut", 205, 146, "$"], [2300, "count", "kPaid", 1240, 1299, "$"],
        [2350, "count", "kWait", 3, 2], [2400, "pulse", "kPaid"],
      ]},
      { cap: "The receipt makes and sends itself. Zero clicks — the books already balance.", d: 4600, cues: [
        [500, "cls", "n5", "wired", 1], [800, "cls", "n5", "done", 1],
        [1000, "toast", "Receipt <b>RCT-090</b> sent to Anika"],
        [2000, "settle", "row"], [3200, "toastx"],
      ]},
    ],
  },

  "courier-cash": {
    crumb: "Money · Courier Cash", cat: 0, h: 350, center: false,
    html:
      `<div style="max-width:470px">` +
      `<div class="t-card" data-t="hcard" style="margin-bottom:8px"><div class="t-crow"><div><div class="cn">Batch CC-118 · your courier</div><div class="cs" data-t="hdate">Tuesday · out for delivery</div></div><span style="margin-left:auto">${chip("6 parcels", "acc")}</span></div></div>` +
      kpis([["Expected", "$324", "kExp"], ["Received", "—", "kRec"], ["Needs review", "—", "kVar"]]) +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", `<span class="t-mono">TRK-8841</span>`, "$59", chip("Out for delivery", "", "s0")], t: "p0" },
        { c: ["Tomas", `<span class="t-mono">TRK-8842</span>`, "$89", chip("Out for delivery", "", "s1")], t: "p1" },
        { c: ["Priya S.", `<span class="t-mono">TRK-8843</span>`, "$49", chip("Out for delivery", "", "s2")], t: "p2" },
        { c: ["Omar K.", `<span class="t-mono">TRK-8844</span>`, "$39", chip("Out for delivery", "", "s3")], t: "p3" },
        { c: ["Lena M.", `<span class="t-mono">TRK-8845</span>`, "$69", chip("Out for delivery", "", "s4")], t: "p4" },
        { c: ["Chen W.", `<span class="t-mono">TRK-8846</span>`, "$19", chip("Out for delivery", "", "s5")], t: "p5" },
      ]}) + `</div>`,
    beats: [
      { cap: "Six parcels out, $324 expected. The question this window answers: where is my cash-on-delivery money?", d: 3800, cues: [
        [400, "cam", "kExp", 1.3], [2500, "wide"],
      ]},
      { cap: "Deliveries confirm themselves — courier updates flow in, no portal-checking.", d: 5200, cues: [
        [300, "flash", "p0"], [400, "chip", "s0", "acc", "Delivered"],
        [1300, "flash", "p1"], [1400, "chip", "s1", "acc", "Delivered"],
        [2200, "flash", "p2"], [2300, "chip", "s2", "acc", "Delivered"],
        [3000, "flash", "p4"], [3100, "chip", "s4", "acc", "Delivered"],
        [3700, "flash", "p5"], [3800, "chip", "s5", "acc", "Delivered"],
      ]},
      { cap: "One came back. Stock and cash adjust themselves — Rose Dress restocked, Expected drops.", d: 4600, cues: [
        [300, "flash", "p3"], [400, "chip", "s3", "warn", "Returned ↩"],
        [800, "cam", "p3", 1.25],
        [1500, "toast", "Return adjustment · Rose Dress <b>+1</b> back in stock"],
        [2400, "count", "kExp", 324, 285, "$"], [2450, "pulse", "kExp"],
      ]},
      { cap: "Next day: the courier's payout arrives → each line matches to your orders by tracking ID.", d: 5400, cues: [
        [0, "toastx"], [100, "wide"], [200, "text", "hdate", "Wednesday · settlement day"],
        [500, "toast", "Payout statement · <b>$236</b> received"],
        [1400, "flash", "p0"], [1500, "chip", "s0", "ok", "Settled ✓"],
        [2200, "flash", "p1"], [2300, "chip", "s1", "ok", "Settled ✓"],
        [2900, "flash", "p4"], [3000, "chip", "s4", "ok", "Settled ✓"],
        [3400, "flash", "p5"], [3500, "chip", "s5", "ok", "Settled ✓"],
        [3900, "count", "kRec", 0, 236, "$"],
      ]},
      { cap: "The sweep passed over the return on purpose — and one line didn't match. It waits for your eyes, never silently absorbed.", d: 4600, cues: [
        [0, "toastx"], [400, "flash", "p2"], [500, "chip", "s2", "warn", "Needs review 👀"],
        [1000, "cam", "p2", 1.3], [1400, "text", "kVar", "$49"], [1500, "pulse", "kVar"],
      ]},
      { cap: "Loop closed: Expected, Received, and the one exception — every dollar accounted for.", d: 3800, cues: [
        [300, "wide"], [900, "settle", "hcard"],
      ]},
    ],
  },

  // ═══════════════ Chapter 2 · Boards & views ═══════════════,

  "customer-checkout": {
    bare: true, h: 300,
    html: phone(
      shopHead("MC", "Maya's Closet", "yourshop.link/maya") +
      `<div class="t-sgrid">` +
      shopCard({ art: "dress", name: "Rose Dress", price: "$59", sizes: "S M L", t: "c1" }) +
      shopCard({ art: "scarf", name: "Silk Scarf", price: "$19", t: "c2" }) +
      `</div>` +
      `<div class="t-payrow" data-t="pay"><span class="t-payopt" data-t="cod">Cash on delivery</span><span class="t-payopt" data-t="onl">Pay online</span></div>` +
      `<div class="t-totrow"><span>Rose Dress · M</span><span class="t-num" data-t="t1">—</span></div>` +
      `<div class="t-totrow"><span>Silk Scarf</span><span class="t-num" data-t="t1b">—</span></div>` +
      `<div class="t-totrow"><span>Delivery</span><span class="t-num" data-t="t1c">$5</span></div>` +
      `<div class="t-totrow grand"><span>Total</span><span class="t-num" data-t="t2">$5</span></div>` +
      `<div class="t-place" data-t="place">Place order</div>` +
      success("succ", "Order placed", "#MC-1042 · 2 items · pay $83 on delivery"),
      "ph"),
    beats: [
      { cap: "Your customer sees a clean page: your products, your prices, your look.", d: 3600, cues: [
        [500, "cam", "c1", 1.55],
      ]},
      { cap: "They pick a size, add the dress…", d: 3800, cues: [
        [400, "cls", "c1-sz1", "sel", 1], [500, "pulse", "c1-sz1"],
        [1500, "cls", "c1-add", "pressed", 1], [1650, "cls", "c1-add", "pressed", 0],
        [1700, "cls", "c1", "added", 1], [1750, "text", "c1-add", "Added ✓"],
        [2000, "text", "t1", "$59"], [2100, "count", "t2", 5, 64, "$"],
      ]},
      { cap: "…and the scarf too. The total builds itself, delivery fee included.", d: 3800, cues: [
        [200, "cam", "c2", 1.55],
        [900, "cls", "c2-add", "pressed", 1], [1050, "cls", "c2-add", "pressed", 0],
        [1100, "cls", "c2", "added", 1], [1150, "text", "c2-add", "Added ✓"],
        [1400, "text", "t1b", "$19"], [1500, "count", "t2", 64, 83, "$"], [1600, "pulse", "t2"],
      ]},
      { cap: "They choose how to pay — cash on delivery, or online.", d: 3600, cues: [
        [200, "cam", "pay", 1.55], [900, "cls", "cod", "sel", 1], [1000, "pulse", "cod"],
      ]},
      { cap: "They tap Order — done. No account, no app, no friction. Order number and all.", d: 4000, cues: [
        [200, "cam", "ph", 1.2],
        [900, "cls", "place", "pressed", 1], [1050, "cls", "place", "pressed", 0],
        [1250, "show", "succ"],
      ]},
      { cap: "…and on your side, it's already a row on the Orders Board.", d: 3200, cues: [
        [500, "wide"],
      ]},
    ],
  },

  // ═══════════════ Chapter 11 · Automations ═══════════════,

};
