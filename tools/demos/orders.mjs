// Chapter 5 (Selling fields) + Chapter 7 (Orders & delivery) demos.
// Grammar + authoring rules: see ../theater.mjs and ../demos.mjs.
// Polish bar: the flagship exemplars in ./flagship.mjs (courier-cash is the
// sibling for the Money-side demos here).

import {
  chip, light, tgl, btn, kpis, tbl, trow, rowCells, card, win, ask, life,
  task, prod, phone, shopHead, shopCard, bubble, success, kanban, ART,
} from "../theater.mjs";

const box = (t = "") => `<span class="t-box"${t ? ` data-t="${t}"` : ""}></span>`;
const mono = (s, t = "") => `<span class="t-mono"${t ? ` data-t="${t}"` : ""}>${s}</span>`;

export const DEMOS_ORDERS = {
  "product-field": {
    crumb: "Work · Orders", cat: 2, h: 330, center: false,
    html:
      `<div style="max-width:440px;position:relative">` +
      kpis([["Orders today", "4", "kOrd"], ["Revenue today", "$175", "kRev"], ["Low stock", "0"]]) +
      `<div style="display:flex;gap:6px;align-items:center;margin:2px 0 7px">` +
      chip(`🌹 Rose Dress · stock <b class="t-num" data-t="s1">12</b>`, "", "sc1") +
      chip(`🧣 Silk Scarf · stock <b class="t-num" data-t="s2">30</b>`, "", "sc2") +
      `</div>` +
      tbl({ t: "ob", head: ["Buyer", "Product", "Total"], aligns: "llr", rows: [
        { c: ["Anika", chip("🌹 Rose Dress ×1", "acc", "pchip"), "$59"], t: "prow" },
        ["Tomas", chip("🧣 Silk Scarf ×2", "acc"), "$38"],
        ["Omar K.", chip("🧣 Silk Scarf ×1", "acc"), "$19"],
        ["Lena M.", chip("🌹 Rose Dress ×1", "acc"), "$59"],
      ]}) +
      `<span class="t-in" data-t="tile" style="position:absolute;right:0;top:96px;z-index:5">${prod({ art: "dress", name: "Rose Dress", price: "$59 · 12 left", t: "pt" })}</span>` +
      `</div>`,
    beats: [
      { cap: "A live Orders Board — but look closer: not typed text, a real product lives in each cell.", d: 3600, cues: [
        [1600, "cam", "prow", 1.3], [2300, "flash", "prow"], [2800, "pulse", "pchip"],
      ]},
      { cap: "Tap the chip: photo, price, stock — live from the Catalog.", d: 4200, cues: [
        [200, "cur", "pchip"], [1000, "click", "pchip"],
        [1200, "show", "tile"], [1500, "cam", "tile", 1.45], [2200, "curx"],
      ]},
      { cap: "A new order lands → stock draws itself down: 12 left becomes 11.", d: 4400, cues: [
        [0, "hide", "tile"], [200, "wide"],
        [700, "row", "ob", rowCells(["Chen W.", chip("🌹 Rose Dress ×1", "acc"), "$59"], "llr")],
        [1500, "count", "kOrd", 4, 5], [1550, "pulse", "kOrd"],
        [1900, "count", "kRev", 175, 234, "$"],
        [2600, "count", "s1", 12, 11], [2650, "pulse", "sc1"],
      ]},
      { cap: "A Gift Bundle order draws down every member — the dress AND the scarf.", d: 4400, cues: [
        [400, "row", "ob", rowCells(["Priya S.", chip("🎁 Gift Bundle ×1", "acc"), "$69"], "llr")],
        [1100, "count", "kOrd", 5, 6], [1200, "count", "kRev", 234, 303, "$"],
        [1800, "cam", "sc1", 1.35],
        [2300, "count", "s1", 11, 10], [2350, "pulse", "sc1"],
        [2800, "count", "s2", 30, 29], [2850, "pulse", "sc2"],
      ]},
      { cap: "Six orders, two stocks, one revenue line — the Catalog keeps every number true.", d: 3800, cues: [
        [300, "wide"], [1000, "settle", "sc1"],
      ]},
    ],
  },

  "courier-book": {
    crumb: "Work · Orders", cat: 2, h: 340, center: false,
    html:
      `<div style="max-width:460px">` +
      kpis([["Pending", "1", "kP"], ["Booked", "1", "kB"], ["In transit", "3", "kT"]]) +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", mono("—", "trk"), "$59", chip("Pending", "warn", "st")], t: "row" },
        ["Tomas", mono("TRK-8836"), "$38", chip("In transit", "acc")],
        ["Priya S.", mono("TRK-8835"), "$69", chip("Booked", "acc")],
        ["Omar K.", mono("TRK-8833"), "$19", chip("In transit", "acc")],
        ["Lena M.", mono("TRK-8830"), "$59", chip("In transit", "acc")],
      ]}) +
      `<div data-t="money" style="margin-top:10px">${win("Courier Cash", `Watching <b class="t-num" data-t="kCC">$185</b> of COD money for you`)}</div>` +
      `</div>`,
    beats: [
      { cap: "A board of parcels already moving — and Anika's new $59 order, still Pending.", d: 3400, cues: [
        [1500, "cam", "row", 1.25], [2300, "flash", "row"],
      ]},
      { cap: "You flip it to Confirmed — the one human act in this story.", d: 3800, cues: [
        [200, "cur", "st"], [1200, "click", "st"], [1400, "chip", "st", "acc", "Confirmed"],
        [1500, "count", "kP", 1, 0], [2100, "curx"],
        [2900, "chip", "st", "", "Booking…"],
      ]},
      { cap: "Watch the Tracking cell: the ID types itself in. No copy-paste, no typos.", d: 4400, cues: [
        [300, "cam", "trk", 1.5], [700, "type", "trk", "TRK-8841"],
        [1800, "chip", "st", "acc", "Booked"], [1900, "count", "kB", 1, 2],
        [2600, "toast", "Courier booked · <b>TRK-8841</b> written to the row"],
      ]},
      { cap: "Delivery status updates on its own: in transit… delivered.", d: 4600, cues: [
        [0, "toastx"], [300, "wide"],
        [900, "chip", "st", "acc", "In transit"], [1000, "count", "kB", 2, 1], [1050, "count", "kT", 3, 4],
        [2900, "flash", "row"], [3100, "chip", "st", "ok", "Delivered ✓"], [3200, "count", "kT", 4, 3],
      ]},
      { cap: "…and Courier Cash adds the $59 — now watching $244 of delivery money for you.", d: 4200, cues: [
        [400, "cam", "money", 1.3],
        [1200, "count", "kCC", 185, 244, "$"], [1300, "pulse", "kCC"],
      ]},
      { cap: "Confirm was your only click. Booking, tracking, cash — the row did the rest.", d: 3800, cues: [
        [300, "wide"], [1000, "settle", "row"],
      ]},
    ],
  },

  "fraud-light": {
    crumb: "Work · Orders", cat: 2, h: 325, center: false,
    html:
      `<div style="max-width:440px">` +
      `<div style="display:flex;gap:6px;margin-bottom:7px">` +
      chip(`${light("g")} <b class="t-num" data-t="kg">2</b> safe`, "", "kgc") +
      chip(`${light("y")} 1 caution`, "") +
      chip(`${light("r")} 1 risky`, "") +
      `</div>` +
      tbl({ t: "ob", head: ["Buyer", "Phone", "Total", "Check"], aligns: "llr", rows: [
        { c: ["Anika", mono("…8802"), "$59", light("g", "l1")], t: "r1" },
        { c: ["Tomas", mono("…6714"), "$38", light("g", "l2")], t: "r2" },
        { c: ["Omar K.", mono("…3319"), "$19", light("y", "l3")], t: "r3" },
        { c: ["Lena M.", mono("…4521"), "$69", light("r", "l4")], t: "r4" },
      ]}) +
      `<div class="t-in" data-t="hist" style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">` +
      chip("📱 …4521") + chip("8 received ✓", "ok") + chip("5 returned ↩", "warn", "hw") +
      `</div>` +
      `<div class="t-in" data-t="verdict" style="margin-top:7px">${chip("review before shipping", "bad")}</div>` +
      `</div>`,
    beats: [
      { cap: "Every order gets a light in its own column: green, yellow, or red — at a glance.", d: 3800, cues: [
        [700, "pulse", "l1"], [1100, "pulse", "l2"], [1500, "pulse", "l3"], [1900, "pulse", "l4"],
      ]},
      { cap: "The greens ship without a second thought. This morning: one yellow, one red.", d: 3800, cues: [
        [300, "cam", "r3", 1.25], [800, "flash", "r3"],
        [1600, "flash", "r4"], [2000, "pulse", "l4"],
      ]},
      { cap: "The red one? It reads the phone number's delivery history: 8 received, 5 returned.", d: 4600, cues: [
        [300, "cam", "r4", 1.3], [700, "flash", "r4"],
        [1400, "show", "hist"], [1800, "cam", "hist", 1.35], [2700, "pulse", "hw"],
      ]},
      { cap: "A signal, not a verdict. Red means: check before you ship — one call saves a $69 loss.", d: 4400, cues: [
        [300, "show", "verdict"], [700, "cam", "verdict", 1.35], [900, "pulse", "verdict"],
        [2900, "wide"],
      ]},
      { cap: "New orders get their light on arrival — the history vets them, nobody presses a button.", d: 4600, cues: [
        [500, "row", "ob", rowCells(["Chen W.", mono("…7208"), "$59", chip("…", "", "nl")], "llr")],
        [1300, "chip", "nl", "", "Checking…"],
        [2300, "chip", "nl", "ok", "🟢 Looks safe"],
        [2500, "count", "kg", 2, 3], [2550, "pulse", "kgc"],
      ]},
    ],
  },

  "order-row": {
    crumb: "Work · Orders", cat: 2, h: 265, center: false,
    html:
      `<div style="max-width:520px">` +
      kpis([["Orders today", "4", "kO"], ["Pending COD", "$116", "kC"], ["In risk review", "1", "kR"]]) +
      tbl({ head: ["Buyer", "Product", "Total", "Check", "Courier", "Cash"], aligns: "llr", rows: [
        { c: [
          "Anika",
          `<span data-t="c1">${chip("🌹 Rose Dress ×1", "acc")}</span>`,
          `<span data-t="c2">$59</span>`,
          `<span data-t="c3">${light("g")}</span>`,
          `<span data-t="c4">${chip("🚚 Book", "")}</span>`,
          `<span data-t="c5">${chip("💵 COD", "")}</span>`,
        ], t: "row" },
        ["Tomas", chip("🧣 Silk Scarf ×2", "acc"), "$38", light("g"), chip("🚚 TRK-8842", ""), chip("💵 COD", "")],
        ["Priya S.", chip("🎁 Gift Bundle ×1", "acc"), "$69", light("g"), chip("🚚 TRK-8843", ""), chip("💳 Paid", "")],
        ["Omar K.", chip("🧣 Silk Scarf ×1", "acc"), "$19", light("y"), chip("—", ""), chip("💵 COD", "")],
      ]}) + `</div>`,
    beats: [
      { cap: "Every row on the Orders Board is a whole order — this one has five selling superpowers.", d: 3600, cues: [
        [1600, "cam", "row", 1.3], [2100, "cls", "row", "fresh", 1],
      ]},
      { cap: "A real product lives in the first cell → the true total computes itself…", d: 3800, cues: [
        [0, "cls", "row", "fresh", 0],
        [300, "cam", "c1", 1.6], [700, "pulse", "c1"],
        [2000, "cam", "c2", 1.6], [2400, "pulse", "c2"],
      ]},
      { cap: "…the fraud light reads this buyer's delivery history…", d: 3200, cues: [
        [300, "cam", "c3", 1.7], [700, "pulse", "c3"],
      ]},
      { cap: "…the courier books from the row, and cash-on-delivery money is tracked to the dollar.", d: 4200, cues: [
        [300, "cam", "c4", 1.6], [700, "pulse", "c4"],
        [2000, "cam", "c5", 1.6], [2400, "pulse", "c5"],
      ]},
      { cap: "One order row, five selling superpowers — and every row on this board has them.", d: 3800, cues: [
        [300, "wide"], [1100, "settle", "row"],
      ]},
    ],
  },

  // ═══════════════ Chapter 7 · Orders & delivery ═══════════════,

  "order-life": {
    crumb: "Work · Orders", cat: 2, h: 330, center: false,
    html:
      `<div style="max-width:460px">` +
      kpis([["Open orders", "4", "kOpen"], ["Out for delivery", "2"], ["Reconciled today", "3", "kRec"]]) +
      tbl({ t: "ob", head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [
        ["Tomas", "Silk Scarf ×2", "$38", chip("Booked", "acc")],
        ["Priya S.", "Gift Bundle ×1", "$69", chip("In transit", "acc")],
        ["Omar K.", "Silk Scarf ×1", "$19", chip("Confirmed", "acc")],
        ["Lena M.", "Rose Dress ×1", "$59", chip("In transit", "acc")],
      ]}) +
      `<div data-t="lf">` +
      life([
        { l: "Pending", t: "n1" }, { l: "Confirmed", t: "n2" }, { l: "Booked", t: "n3" },
        { l: "In transit", t: "n4" }, { l: "Delivered", t: "n5" }, { l: "Reconciled", t: "n6", ok: true },
      ]) + `</div></div>`,
    beats: [
      { cap: "The board is mid-story: four parcels moving. An order's whole life reads along the bottom.", d: 3400, cues: [
        [1500, "cam", "lf", 1.25], [2500, "wide"],
      ]},
      { cap: "An order is born Pending — Anika just tapped Order on your shop link.", d: 3800, cues: [
        [400, "row", "ob", rowCells(["Anika", "Rose Dress ×1", "$59", chip("Pending", "warn", "st")], "llr")],
        [1100, "count", "kOpen", 4, 5], [1150, "pulse", "kOpen"],
        [1500, "cls", "n1", "done", 1],
        [1900, "cam", "ob", 1.15],
      ]},
      { cap: "You confirm it — your one human decision per order.", d: 3600, cues: [
        [300, "cur", "st"], [1300, "click", "st"],
        [1500, "chip", "st", "acc", "Confirmed"],
        [1550, "cls", "n2", "wired", 1], [1650, "cls", "n2", "done", 1],
        [2200, "curx"],
      ]},
      { cap: "Booked — the courier's tracking ID lands in the row by itself.", d: 4000, cues: [
        [400, "toast", "Courier booked · <b>TRK-8847</b> written to the row"],
        [1200, "chip", "st", "acc", "Booked"],
        [1250, "cls", "n3", "wired", 1], [1350, "cls", "n3", "done", 1],
      ]},
      { cap: "In transit… delivered — the row updates itself while you pack the next parcel.", d: 4400, cues: [
        [0, "toastx"], [300, "wide"],
        [800, "flash", "ob"], [900, "chip", "st", "acc", "In transit"],
        [950, "cls", "n4", "wired", 1], [1050, "cls", "n4", "done", 1],
        [2700, "flash", "ob"], [2800, "chip", "st", "acc", "Delivered"],
        [2850, "cls", "n5", "wired", 1], [2950, "cls", "n5", "done", 1],
      ]},
      { cap: "Reconciled: the payout matched your row — the first green of the story, and the loop closes.", d: 5000, cues: [
        [500, "cls", "n6", "wired", 1], [700, "cls", "n6", "done", 1],
        [800, "chip", "st", "ok", "Reconciled ✓"],
        [1500, "count", "kOpen", 5, 4], [1600, "count", "kRec", 3, 4], [1650, "pulse", "kRec"],
        [2600, "settle", "ob"],
      ]},
    ],
  },

  "confirm-dispatch": {
    crumb: "Work · Orders", cat: 2, h: 315, center: false,
    html:
      `<div style="max-width:460px">` +
      kpis([["Pending", "5", "kP"], ["Booked today", "0", "kB"], ["Held for review", "0", "kR"]]) +
      tbl({ t: "tb", head: ["", "Buyer", "Total", "Check", "Status"], aligns: "llr", rows: [
        { c: [box("b1"), "Anika", "$59", light("g", "l1"), chip("Pending", "", "s1")], t: "r1" },
        { c: [box("b2"), "Tomas", "$38", light("g", "l2"), chip("Pending", "", "s2")], t: "r2" },
        { c: [box("b3"), "Priya S.", "$69", light("g", "l3"), chip("Pending", "", "s3")], t: "r3" },
        { c: [box(), "Omar K.", "$19", light("y", "l4"), chip("Pending", "", "s4")], t: "r4" },
        { c: [box(), "Lena M.", "$69", light("r", "l5"), chip("Pending", "", "s5")], t: "r5" },
      ]}) +
      `<div style="margin-top:10px">${btn("Confirm 3 orders", "call")}</div>` +
      `</div>`,
    beats: [
      { cap: "The morning routine: five orders in overnight — the lights have already done the thinking.", d: 3800, cues: [
        [700, "pulse", "l1"], [1000, "pulse", "l2"], [1300, "pulse", "l3"],
        [1600, "pulse", "l4"], [1900, "pulse", "l5"],
      ]},
      { cap: "Scan the lights, select the safe rows…", d: 4800, cues: [
        [200, "cur", "b1"], [800, "click", "b1"], [950, "cls", "b1", "done", 1], [960, "text", "b1", "✓"], [980, "cls", "r1", "fresh", 1],
        [1600, "cur", "b2"], [2100, "click", "b2"], [2250, "cls", "b2", "done", 1], [2260, "text", "b2", "✓"], [2280, "cls", "r2", "fresh", 1],
        [2900, "cur", "b3"], [3400, "click", "b3"], [3550, "cls", "b3", "done", 1], [3560, "text", "b3", "✓"], [3580, "cls", "r3", "fresh", 1],
        [4100, "cls", "r4", "dim", 1], [4200, "cls", "r5", "dim", 1],
      ]},
      { cap: "…one click confirms them together.", d: 3600, cues: [
        [300, "cur", "call"], [1100, "click", "call"],
        [1350, "chip", "s1", "acc", "Confirmed"], [1500, "chip", "s2", "acc", "Confirmed"], [1650, "chip", "s3", "acc", "Confirmed"],
        [1800, "count", "kP", 5, 2], [2300, "curx"],
      ]},
      { cap: "The dispatch recipe books every courier — tracking IDs land in the rows, faster and faster.", d: 4600, cues: [
        [400, "flash", "r1"], [500, "chip", "s1", "acc", "Booked · TRK-8851"], [600, "count", "kB", 0, 1],
        [1500, "flash", "r2"], [1600, "chip", "s2", "acc", "Booked · TRK-8852"], [1700, "count", "kB", 1, 2],
        [2200, "flash", "r3"], [2300, "chip", "s3", "acc", "Booked · TRK-8853"], [2400, "count", "kB", 2, 3],
        [2700, "cls", "r1", "fresh", 0], [2800, "cls", "r2", "fresh", 0], [2900, "cls", "r3", "fresh", 0],
      ]},
      { cap: "It never touched the yellow or the red — risky orders wait for your eyes, on purpose.", d: 4400, cues: [
        [300, "cam", "r4", 1.25], [900, "flash", "r4"], [1400, "flash", "r5"],
        [1900, "count", "kR", 0, 2], [1950, "pulse", "kR"],
        [3100, "wide"],
      ]},
      { cap: "…while you pack.", d: 3800, cues: [
        [400, "toast", "3 couriers booked · <b>tracking IDs written</b>"],
        [1600, "settle", "tb"],
      ]},
    ],
  },

  "courier-connect": {
    crumb: "Settings · Couriers", cat: 2, h: 270, center: false,
    html:
      `<div style="max-width:450px">` +
      win("Couriers", `account key <span class="t-mono" data-t="key">—</span> ${btn("Save", "save")} <span class="t-in" data-t="conn">${chip("Courier connected ✓", "ok")}</span>`, "sw") +
      `<div class="t-in" data-t="obw" style="margin-top:10px">` +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", mono("—", "trk1"), "$59", chip("Confirmed", "acc", "st1")], t: "row1" },
        { c: ["Tomas", mono("—", "trk2"), "$38", chip("Confirmed", "acc", "st2")], t: "row2" },
        { c: ["Priya S.", mono("—"), "$69", chip("Pending", "warn", "st3")], t: "row3" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "Your courier account details go into Settings — once.", d: 4600, cues: [
        [300, "cam", "sw", 1.3],
        [900, "cur", "key"], [1700, "click", "key"], [1900, "text", "key", "••••••••"], [2000, "pulse", "key"],
        [2800, "cur", "save"], [3600, "click", "save"],
      ]},
      { cap: "Connected — three waiting orders can book now, straight from their rows.", d: 3800, cues: [
        [200, "show", "conn"], [600, "curx"],
        [1100, "show", "obw"], [1600, "wide"],
      ]},
      { cap: "Anika's books itself: Booking… then the tracking ID types in. No copy-paste, no typos.", d: 4600, cues: [
        [300, "cam", "row1", 1.3],
        [700, "chip", "st1", "", "Booking…"],
        [1500, "type", "trk1", "TRK-8841"],
        [2600, "chip", "st1", "acc", "Booked"],
      ]},
      { cap: "Tomas's too — the queue drains itself while you do something else.", d: 4200, cues: [
        [300, "flash", "row2"], [500, "chip", "st2", "", "Booking…"],
        [1200, "type", "trk2", "TRK-8842"],
        [2300, "chip", "st2", "acc", "Booked"],
      ]},
      { cap: "Priya's stays Pending — nothing books before you confirm. One key, once; bookings forever.", d: 4400, cues: [
        [300, "cam", "row3", 1.25], [800, "flash", "row3"],
        [2000, "wide"], [2700, "settle", "sw"],
      ]},
    ],
  },

  "track-deliveries": {
    crumb: "Work · Orders", cat: 2, h: 350, center: false,
    html:
      `<div style="max-width:470px">` +
      `<div class="t-card" data-t="hcard" style="margin-bottom:8px"><div class="t-crow"><div><div class="cn">Batch CC-120 · your courier</div><div class="cs">Thursday · out for delivery</div></div><span style="margin-left:auto">${chip("6 parcels", "acc")}</span></div></div>` +
      kpis([["Out for delivery", "6", "kOut"], ["Delivered", "—", "kDel"], ["COD riding", "$273", "kCod"]]) +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", mono("TRK-8861"), "$59", chip("Out for delivery", "", "s1")], t: "r1" },
        { c: ["Tomas", mono("TRK-8862"), "$38", chip("Out for delivery", "", "s2")], t: "r2" },
        { c: ["Priya S.", mono("TRK-8863"), "$69", chip("Out for delivery", "", "s3")], t: "r3" },
        { c: ["Omar K.", mono("TRK-8864"), "$19", chip("Out for delivery", "", "s4")], t: "r4" },
        { c: ["Lena M.", mono("TRK-8865"), "$59", chip("Out for delivery", "", "s5")], t: "r5" },
        { c: ["Chen W.", mono("TRK-8866"), "$29", chip("Out for delivery", "", "s6")], t: "r6" },
      ]}) + `</div>`,
    beats: [
      { cap: "Six parcels riding with the courier, $273 of COD — and not one courier-portal tab open.", d: 3800, cues: [
        [400, "cam", "kCod", 1.3], [2500, "wide"],
      ]},
      { cap: "Delivery statuses refresh themselves — updates flow into the rows, no portal-checking.", d: 5400, cues: [
        [300, "flash", "r1"], [400, "chip", "s1", "acc", "Delivered"], [500, "count", "kDel", 0, 1],
        [1300, "flash", "r2"], [1400, "chip", "s2", "acc", "Delivered"], [1500, "count", "kDel", 1, 2],
        [2100, "flash", "r3"], [2200, "chip", "s3", "acc", "Delivered"], [2300, "count", "kDel", 2, 3],
        [2800, "flash", "r4"], [2900, "chip", "s4", "acc", "Delivered"], [3000, "count", "kDel", 3, 4],
        [3500, "flash", "r6"], [3600, "chip", "s6", "acc", "Delivered"], [3700, "count", "kDel", 4, 5],
        [4200, "count", "kOut", 6, 1],
      ]},
      { cap: "One parcel never made it. A Returned parcel raises its hand — it doesn't hide.", d: 4400, cues: [
        [400, "flash", "r5"], [600, "chip", "s5", "warn", "Returned ↩"],
        [1100, "cam", "r5", 1.3],
        [1900, "count", "kOut", 1, 0],
        [2300, "count", "kCod", 273, 214, "$"], [2400, "pulse", "kCod"],
      ]},
      { cap: "…and offers the fix: the Rose Dress goes back on the shelf — stock 11 → 12.", d: 4200, cues: [
        [400, "toast", "Returned parcel · restock <b>+1 Rose Dress</b> · stock 11 → 12"],
      ]},
      { cap: "Delivered, returned, riding — the board knows where every parcel and every dollar is.", d: 3800, cues: [
        [0, "toastx"], [300, "wide"], [1000, "settle", "hcard"],
      ]},
    ],
  },

  "fetch-payouts": {
    crumb: "Money · Courier Cash", cat: 0, h: 350, center: false,
    html:
      `<div style="max-width:470px">` +
      card({
        t: "hcard", name: "Batch CC-119 · your courier",
        stat: "Friday · settlement day · 6 parcels",
        right: btn("Fetch payouts ⬇", "fetch"),
      }) +
      `<div style="margin-top:8px">` +
      kpis([["Expected", "$324", "kExp"], ["Received", "—", "kRec"], ["Needs review", "—", "kVar"]]) +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", mono("TRK-8841"), "$59", chip("Delivered", "acc", "s1")], t: "r1" },
        { c: ["Tomas", mono("TRK-8842"), "$89", chip("Delivered", "acc", "s2")], t: "r2" },
        { c: ["Priya S.", mono("TRK-8843"), "$49", chip("Delivered", "acc", "s3")], t: "r3" },
        { c: ["Omar K.", mono("TRK-8844"), "$39", chip("Delivered", "acc", "s4")], t: "r4" },
        { c: ["Lena M.", mono("TRK-8845"), "$69", chip("Delivered", "acc", "s5")], t: "r5" },
        { c: ["Chen W.", mono("TRK-8846"), "$19", chip("Delivered", "acc", "s6")], t: "r6" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "Settlement day: six delivered parcels — $324 of your money is in the courier's hands.", d: 3800, cues: [
        [400, "cam", "kExp", 1.3], [2500, "wide"],
      ]},
      { cap: "Where your courier supports it: fetch the payout statement with one click.", d: 4200, cues: [
        [300, "cur", "fetch"], [1300, "click", "fetch"], [1900, "curx"],
        [2300, "toast", "Payout statement · <b>$275</b> · 6 lines"],
      ]},
      { cap: "Each line matches to an order by tracking ID — reconciling, faster and faster.", d: 5000, cues: [
        [0, "toastx"],
        [400, "flash", "r1"], [500, "chip", "s1", "ok", "Reconciled ✓"],
        [1400, "flash", "r2"], [1500, "chip", "s2", "ok", "Reconciled ✓"],
        [2200, "flash", "r4"], [2300, "chip", "s4", "ok", "Reconciled ✓"],
        [2800, "flash", "r5"], [2900, "chip", "s5", "ok", "Reconciled ✓"],
        [3300, "flash", "r6"], [3400, "chip", "s6", "ok", "Reconciled ✓"],
        [3900, "count", "kRec", 0, 275, "$"], [4000, "pulse", "kRec"],
      ]},
      { cap: "Five matched. Priya's $49 didn't — it waits for your eyes, never silently absorbed.", d: 4600, cues: [
        [400, "flash", "r3"], [500, "chip", "s3", "warn", "Needs review 👀"],
        [1000, "cam", "r3", 1.3],
        [1600, "text", "kVar", "$49"], [1700, "pulse", "kVar"],
      ]},
      { cap: "Honest math, every time: $275 received + $49 in review = $324 accounted for.", d: 4200, cues: [
        [300, "wide"], [1000, "settle", "hcard"],
      ]},
    ],
  },

  "manual-remit": {
    crumb: "Money · Courier Cash", cat: 0, h: 345, center: false,
    html:
      `<div style="max-width:470px">` +
      win("Log a remittance", `your courier · Jul 11 · <b>$<span class="t-num" data-t="amt">—</span></b> ${btn("Log it", "log")} <span class="t-in" data-t="mt">${chip("4 orders → Reconciled ✓", "ok", "mtc")}</span>`, "rw") +
      `<div style="margin-top:10px">` +
      kpis([["Awaiting payout", "$285", "kAw"], ["Reconciled today", "—", "kRec"], ["Still in transit", "$29", "kTr"]]) +
      tbl({ head: ["Buyer", "Tracking", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", mono("TRK-8841"), "$59", chip("Delivered", "acc", "s1")], t: "r1" },
        { c: ["Tomas", mono("TRK-8842"), "$89", chip("Delivered", "acc", "s2")], t: "r2" },
        { c: ["Priya S.", mono("TRK-8843"), "$68", chip("Delivered", "acc", "s3")], t: "r3" },
        { c: ["Omar K.", mono("TRK-8844"), "$69", chip("Delivered", "acc", "s4")], t: "r4" },
        { c: ["Chen W.", mono("TRK-8849"), "$29", chip("In transit", "", "s5")], t: "r5" },
      ]}) + `</div></div>`,
    beats: [
      { cap: "Any courier, any payout — four delivered parcels, $285 owed to you.", d: 3800, cues: [
        [1500, "cam", "rw", 1.3],
      ]},
      { cap: "…log what they paid you.", d: 4400, cues: [
        [300, "cur", "amt"], [1100, "click", "amt"],
        [1300, "count", "amt", 0, 285], [1500, "pulse", "amt"],
        [2500, "cur", "log"], [3300, "click", "log"], [3800, "curx"],
      ]},
      { cap: "TaroGrid matches the money to delivered orders — all four flip to Reconciled together.", d: 5000, cues: [
        [200, "wide"],
        [500, "flash", "r1"], [600, "chip", "s1", "ok", "Reconciled ✓"],
        [1300, "flash", "r2"], [1400, "chip", "s2", "ok", "Reconciled ✓"],
        [1950, "flash", "r3"], [2050, "chip", "s3", "ok", "Reconciled ✓"],
        [2450, "flash", "r4"], [2550, "chip", "s4", "ok", "Reconciled ✓"],
        [3100, "show", "mt"], [3300, "pulse", "mtc"],
        [3700, "count", "kAw", 285, 0, "$"], [3900, "count", "kRec", 0, 285, "$"],
      ]},
      { cap: "Chen's parcel is still on the road — the match leaves it alone until it lands.", d: 4200, cues: [
        [300, "cam", "r5", 1.3], [800, "flash", "r5"], [1500, "pulse", "kTr"],
        [2900, "wide"],
      ]},
      { cap: "$59 + $89 + $68 + $69 = $285 — balanced to the dollar, logged in ten seconds.", d: 4000, cues: [
        [800, "settle", "rw"],
      ]},
    ],
  },

  "returns-restock": {
    crumb: "Work · Orders", cat: 2, h: 335, center: false,
    html:
      `<div style="max-width:450px">` +
      kpis([["Out for delivery", "3", "kO"], ["Returned this week", "0", "kRw"], ["Return cost", "—", "kC"]]) +
      `<div style="display:flex;gap:6px;margin:2px 0 7px">` +
      chip(`🌹 Rose Dress · stock <b class="t-num" data-t="stk">11</b>`, "", "stkc") +
      chip("🧣 Silk Scarf · stock 30", "") +
      `</div>` +
      tbl({ head: ["Buyer", "Item", "Total", "Status"], aligns: "llr", rows: [
        { c: ["Anika", "Silk Scarf ×1", "$19", chip("Delivered", "acc", "s1")], t: "r1" },
        { c: ["Tomas", "Silk Scarf ×2", "$38", chip("Out for delivery", "", "s2")], t: "r2" },
        { c: ["Lena M.", "Rose Dress ×1", "$59", chip("Out for delivery", "", "st")], t: "row" },
        { c: ["Omar K.", "Gift Bundle ×1", "$69", chip("Out for delivery", "", "s4")], t: "r4" },
      ]}) +
      `<div class="t-in" data-t="exp" style="margin-top:10px">${win("Expenses", `Return delivery — <b>$10</b> ${chip("logged", "warn")}`)}</div>` +
      `</div>`,
    beats: [
      { cap: "Most parcels land. Lena's Rose Dress didn't — a parcel comes back.", d: 4200, cues: [
        [1500, "cam", "row", 1.25], [2200, "flash", "row"],
        [2500, "chip", "st", "warn", "Returned ↩"],
        [3000, "count", "kO", 3, 2], [3100, "count", "kRw", 0, 1], [3150, "pulse", "kRw"],
      ]},
      { cap: "First: put the product back on the shelf.", d: 3800, cues: [
        [300, "cam", "stkc", 1.4],
        [1100, "count", "stk", 11, 12], [1200, "pulse", "stkc"],
      ]},
      { cap: "Then the honest part: a return cost you two delivery fees. Count it.", d: 4400, cues: [
        [300, "show", "exp"], [700, "cam", "exp", 1.3], [1300, "pulse", "exp"],
        [1900, "text", "kC", "$10"], [2000, "pulse", "kC"],
      ]},
      { cap: "The rest of the board never stopped — deliveries keep confirming while you shelve the dress.", d: 4400, cues: [
        [300, "wide"],
        [900, "flash", "r2"], [1000, "chip", "s2", "acc", "Delivered"],
        [1900, "flash", "r4"], [2000, "chip", "s4", "acc", "Delivered"],
        [2600, "count", "kO", 2, 0],
      ]},
      { cap: "Stock true, cost counted — a return handled in full, not swept under the rug.", d: 3800, cues: [
        [800, "settle", "stkc"],
      ]},
    ],
  },

  "phone-orders": {
    bare: true, h: 300,
    html: phone(
      `<div style="font-size:8px;font-weight:800;letter-spacing:.06em;color:var(--muted);margin:2px 0 6px">ORDERS · PENDING · <b class="t-num" data-t="bdg" style="color:var(--primary-ink)">3</b></div>` +
      `<div class="t-card" data-t="oc" style="padding:7px 8px;margin-bottom:6px">` +
      `<div class="t-crow" style="gap:6px"><b style="font-size:9.5px">Anika — $59</b>${light("g", "ocl")}</div>` +
      `<div class="cs">Rose Dress ×1 · COD</div>` +
      `<div style="margin-top:5px">${chip("→ swipe to confirm", "", "ocst")}</div></div>` +
      `<div class="t-card" data-t="c2" style="padding:7px 8px;margin-bottom:6px">` +
      `<div class="t-crow" style="gap:6px"><b style="font-size:9.5px">Tomas — $38</b>${light("y", "yl")}</div>` +
      `<div class="cs">Silk Scarf ×2 · COD</div></div>` +
      `<div class="t-card" data-t="c3" style="padding:7px 8px;margin-bottom:8px">` +
      `<div class="t-crow" style="gap:6px"><b style="font-size:9.5px">Priya S. — $69</b>${light("g")}</div>` +
      `<div class="cs">Gift Bundle ×1 · COD</div></div>` +
      `<div style="font-size:8px;font-weight:800;letter-spacing:.06em;color:var(--muted);margin:4px 0 5px">CONFIRMED</div>` +
      `<div data-t="gc" style="min-height:36px"></div>`,
      "ph"),
    beats: [
      { cap: "On your phone, orders become cards — everything important at a glance.", d: 3800, cues: [
        [400, "cam", "ph", 1.15], [1400, "pulse", "bdg"], [2000, "pulse", "ocl"],
      ]},
      { cap: "The fraud light rides along: Anika's is green — safe to confirm from anywhere.", d: 3600, cues: [
        [300, "cam", "oc", 1.35], [900, "pulse", "ocl"],
      ]},
      { cap: "Swipe to confirm.", d: 3800, cues: [
        [500, "cls", "oc", "pressed", 1], [700, "cls", "oc", "pressed", 0],
        [900, "carry", "oc", "gc"],
        [1700, "chip", "ocst", "ok", "Confirmed ✓"],
        [2100, "count", "bdg", 3, 2], [2150, "pulse", "bdg"],
      ]},
      { cap: "Tomas's yellow stays put in Pending — it waits for a closer look, not a thumb-swipe.", d: 3800, cues: [
        [300, "cam", "c2", 1.35], [900, "pulse", "yl"],
      ]},
      { cap: "Packing with one hand, running the shop with the other.", d: 3800, cues: [
        [400, "settle", "oc"], [1400, "wide"],
      ]},
    ],
  },

};
