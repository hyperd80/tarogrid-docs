// Animated demo scenes — one entry per article's demo, composed from the kit
// primitives styled in build.mjs. Each scene: { cap, art }. The player cycles
// scenes; with prefers-reduced-motion the scenes render stacked and static.

const cell = (cls = "") => `<span class="k-cell ${cls}"></span>`;
const row = (inner, cls = "") => `<div class="k-r ${cls}">${inner}</div>`;
const r3 = (cls = "") => row(cell() + cell() + cell(), cls);
const board = (rows, head = "ORDERS") =>
  `<div class="k-board"><div class="k-bhead">${head}</div>${rows}</div>`;
const win = (title, body, cls = "") =>
  `<div class="k-win ${cls}"><div class="k-whead">${title}</div><div class="k-wbody">${body}</div></div>`;
const phone = (btn = "Order — cash on delivery") =>
  `<div class="k-phone"><div class="k-line"></div><div class="k-line"></div><div class="k-line"></div><div class="k-btn">${btn}</div></div>`;
const chip = (txt, cls = "") => `<span class="k-chip ${cls}">${txt}</span>`;
const arrow = () => `<span class="k-arrow"></span>`;
const zone = (name, cls) => `<div class="k-zone ${cls}">${name}</div>`;
const task = (label, done) =>
  `<div class="k-task"><span class="k-box ${done ? "done tick" : ""}">${done ? "✓" : ""}</span>${label}</div>`;
const side = (items) =>
  `<div class="k-side">${items.map((c) => `<div class="k-si ${c}"></div>`).join("")}</div>`;

export const DEMOS = {
  "order-ripple": [
    { cap: "A customer orders from your shop link — no app, no account.", art: `<div class="k-split">${phone()}</div>` },
    { cap: "The order lands on your Orders Board as a new row. You typed nothing.", art: `<div class="k-split">${board(r3() + r3("pop hl-row") + r3())}</div>` },
    { cap: "The fraud check runs, and stock counts itself down.", art: `<div class="k-split">${chip("🟢 Looks safe", "good pop")}${chip(`Stock <span class="k-count"><span class="a">12</span><span class="b">11</span></span>`, "pop d2")}</div>` },
    { cap: "You confirm — and the courier is booked for you.", art: `<div class="k-split">${chip("✓ Confirmed", "good")}${arrow()}${chip("🚚 Courier booked · #TRK-88412", "pop")}</div>` },
    { cap: "The money side updates itself.", art: `<div class="k-split">${win("Invoices", `Draft — Anika · $59 ${chip("new", "good pop")}`)}</div>` },
    { cap: "Courier Cash tracks the $59 until it's truly yours.", art: `<div class="k-split">${win("Courier Cash", `To collect $59 ${arrow()} ${chip("Paid to you ✓", "good pop d2")}`)}</div>` },
  ],
  "three-ideas": [
    { cap: "This is your company — the Workspace. Everything lives inside it.", art: `<div class="k-frame"><span class="k-flabel">YOUR COMPANY</span><div class="k-split">${zone("MONEY", "money")}${zone("PEOPLE", "people")}${zone("WORK", "work")}${zone("OUTREACH", "outreach")}</div></div>` },
    { cap: "Your company's information lives on boards — rows and columns.", art: `<div class="k-split">${board(r3() + r3("hl-row") + r3(), "A BOARD")}</div>` },
    { cap: "Windows are smart screens that work on top of boards.", art: `<div class="k-stack">${win("Invoice Center", "Anika · $59 · Paid ✓", "over")}${board(r3() + r3(), "INVOICE BOARD")}</div>` },
    { cap: "Lift any window — a real board is always underneath. Nothing is hidden.", art: `<div class="k-stack">${win("Invoice Center", "Anika · $59 · Paid ✓", "over lift")}${board(r3() + r3("hl-row"), "INVOICE BOARD")}</div>` },
  ],
  "first-run-checklist": [
    { cap: "A fresh workspace starts with a six-step checklist.", art: `<div class="k-win"><div class="k-whead">Set up your company</div><div class="k-wbody">${task("Name your company", false)}${task("Add a product", false)}${task("Publish your shop link", false)}</div></div>` },
    { cap: "Each step ticks itself the moment you complete it.", art: `<div class="k-win"><div class="k-whead">Set up your company</div><div class="k-wbody">${task("Name your company", true)}${task("Add a product", true)}${task("Publish your shop link", false)}</div></div>` },
    { cap: "All six done — your business loop is live, and the checklist retires.", art: `<div class="k-split">${chip("✓ All 6 steps complete", "good pop")}</div>` },
  ],
  "screen-anatomy": [
    { cap: "① The sidebar — your company's map. ② The board area — your data.", art: `<div class="k-split">${side(["", "", "", ""])}<span class="k-nb">1</span>${board(r3() + r3())}<span class="k-nb">2</span></div>` },
    { cap: "③ Module windows float over your boards.", art: `<div class="k-split">${win("Courier Cash", "To collect $118")}<span class="k-nb">3</span></div>` },
    { cap: "④ The ASK bar (⌘K) finds, answers, and acts. ⑤ The ? explains any screen.", art: `<div class="k-split"><span class="k-ask">⌘K &nbsp;cour…</span><span class="k-nb">4</span>${chip("?", "round")}<span class="k-nb">5</span></div>` },
  ],
  "first-three-wins": [
    { cap: "Win 1 — one real product: photo, price, stock.", art: `<div class="k-split">${win("Product Catalog", `🌹 Rose Dress · $59 ${chip("12 in stock")}`)}</div>` },
    { cap: "Win 2 — publish, and your shop link is ready to paste anywhere.", art: `<div class="k-split">${chip("yourshop.link/maya ✓ copied", "pop")}</div>` },
    { cap: "Win 3 — order from yourself, and watch the row appear on its own.", art: `<div class="k-split">${phone("Order")}${arrow()}${board(r3() + r3("pop hl-row"))}</div>` },
  ],
  "data-safety": [
    { cap: "Your device keeps a full copy; the cloud keeps the shared copy.", art: `<div class="k-split">${chip("💻 your device")}${arrow()}${chip("☁️ cloud")}${arrow()}${chip("📱 your phone")}</div>` },
    { cap: "Offline? Keep working — changes queue up safely.", art: `<div class="k-split">${chip("✈️ offline")}${win("Edits waiting", `3 changes queued ${chip("saved on device", "good")}`)}</div>` },
    { cap: "Back online — the queue uploads in order. Every copy matches again.", art: `<div class="k-split">${chip("📶 reconnected")}${arrow()}${chip("✓ all copies in step", "good pop")}</div>` },
  ],
  "workspace-walls": [
    { cap: "Two businesses, two workspaces — side by side, never mixing.", art: `<div class="k-split"><div class="k-frame sm"><span class="k-flabel">MAYA'S CLOSET</span>${board(r3(), "ORDERS")}</div><div class="k-frame sm dim"><span class="k-flabel">ATLAS STUDIO</span>${board(r3(), "PROJECTS")}</div></div>` },
    { cap: "An order arrives in Maya's Closet. Atlas Studio doesn't even blink.", art: `<div class="k-split"><div class="k-frame sm"><span class="k-flabel">MAYA'S CLOSET</span>${board(r3("pop hl-row") + r3(), "ORDERS")}</div><div class="k-frame sm dim"><span class="k-flabel">ATLAS STUDIO</span>${board(r3(), "PROJECTS")}</div></div>` },
    { cap: "Switching workspaces switches everything — boards, money, people.", art: `<div class="k-split"><div class="k-frame sm dim"><span class="k-flabel">MAYA'S CLOSET</span>${board(r3(), "ORDERS")}</div><div class="k-frame sm"><span class="k-flabel">ATLAS STUDIO</span>${board(r3("hl-row"), "PROJECTS")}</div></div>` },
  ],
  "board-anatomy": [
    { cap: "A shopkeeper's ledger: one line per order, one column per fact.", art: `<div class="k-ledger"><div class="k-lline"></div><div class="k-lline"></div><div class="k-lline"></div></div>` },
    { cap: "A board is that ledger, made intelligent.", art: `<div class="k-split">${board(r3() + r3() + r3())}</div>` },
    { cap: "One row = one thing. This row is one order.", art: `<div class="k-split">${board(r3() + r3("hl-row") + r3())}</div>` },
    { cap: "One cell = one fact. This order's total: $59.", art: `<div class="k-split">${board(r3() + row(cell() + cell() + `<span class="k-cellv pop">$59</span>`) + r3())}</div>` },
  ],
  "window-lifts": [
    { cap: "The Invoice Center — a friendly cockpit.", art: `<div class="k-split">${win("Invoice Center", `Anika · $59 ${chip("Paid ✓", "good")}`)}</div>` },
    { cap: "Lift it like a sheet of glass — a real board is underneath.", art: `<div class="k-stack">${win("Invoice Center", "Anika · $59 · Paid ✓", "over lift")}${board(r3() + r3("hl-row"), "INVOICE BOARD")}</div>` },
    { cap: "The window reads and writes the board. Cockpit on top, engine room below.", art: `<div class="k-split">${win("WINDOW", "the cockpit")}<span class="k-arrow2">⇄</span>${board(r3() + r3(), "BOARD")}</div>` },
  ],
  "locked-cell": [
    { cap: "You try to edit a module-managed cell — a gentle bounce, a small lock.", art: `<div class="k-split">${board(r3() + row(cell() + cell("shake") + `<span class="k-chip sm">🔒</span>`) + r3(), "INVOICE BOARD")}</div>` },
    { cap: "Why? The window writes this column. Hand edits would vanish on refresh.", art: `<div class="k-split">${win("Invoice Center", "the writer ✍️")}${arrow()}${board(r3("hl-row"), "INVOICE BOARD")}</div>` },
    { cap: "Unlock to add your own column — notes, tags, anything.", art: `<div class="k-split">${board(row(cell() + cell() + `<span class="k-cellv pop">Notes ✎</span>`) + r3(), "+ YOUR COLUMN")}</div>` },
    { cap: "The module refreshes its columns — and never touches yours.", art: `<div class="k-split">${chip("module columns refreshed ↻")}${chip("your column untouched ✓", "good pop d2")}</div>` },
  ],
  "four-zones": [
    { cap: "Every workspace organizes itself into four worlds.", art: `<div class="k-split">${zone("MONEY", "money")}${zone("PEOPLE", "people")}${zone("WORK", "work")}${zone("OUTREACH", "outreach")}</div>` },
    { cap: "Money in and out: invoices, expenses, courier cash, the net.", art: `<div class="k-split">${zone("MONEY", "money big")}${chip("invoice $59", "pop")}${chip("expenses", "pop d2")}</div>` },
    { cap: "People: customers and suppliers (WITH) — and your team (AS).", art: `<div class="k-split">${zone("PEOPLE", "people big")}${chip("Anika · customer", "pop")}${chip("Sana · team", "pop d2")}</div>` },
    { cap: "Work: your blank canvas — your own boards, your own rules.", art: `<div class="k-split">${zone("WORK", "work big")}${chip("any board you invent", "pop")}</div>` },
    { cap: "Outreach: campaigns and follow-ups — and who opened, clicked, replied.", art: `<div class="k-split">${zone("OUTREACH", "outreach big")}${chip("3-email campaign", "pop")}${chip("Anika replied ✓", "good pop d2")}</div>` },
  ],
  "board-zoom": [
    { cap: "A board — the whole ledger.", art: `<div class="k-split">${board(`<div class="k-gband">NEW</div>` + r3() + r3() + `<div class="k-gband g2">SHIPPED</div>` + r3())}</div>` },
    { cap: "Groups — colored sections you'd say out loud: New, Shipped, Done.", art: `<div class="k-split">${board(`<div class="k-gband hl">NEW</div>` + r3() + r3())}</div>` },
    { cap: "Items — one row per real thing. This is Anika's order.", art: `<div class="k-split">${board(r3() + r3("hl-row") + r3())}</div>` },
    { cap: "Cells — one fact each. And every cell remembers who changed it, and when.", art: `<div class="k-split">${board(row(cell() + `<span class="k-cellv">$59</span>` + `<span class="k-hist pop">● ● ●</span>`))}</div>` },
  ],
  "role-switch": [
    { cap: "The owner sees everything.", art: `<div class="k-split">${side(["", "", "", "", ""])}${board(r3() + r3())}</div>` },
    { cap: "A member without money access — money isn't locked; it's simply not there.", art: `<div class="k-split">${side(["", "gone", "", "gone", ""])}${board(r3() + r3())}</div>` },
    { cap: "A guest sees one shared board. The rest of your company doesn't exist.", art: `<div class="k-split">${side(["", "gone", "gone", "gone", "gone"])}${board(r3(), "SHARED BOARD")}</div>` },
  ],
  "full-map": [
    { cap: "Products flow from your Catalog to your shop link to your Orders Board.", art: `<div class="k-split">${chip("🛍️ Catalog")}${arrow()}${chip("🔗 Shop link")}${arrow()}${board(r3("hl-row"), "ORDERS")}</div>` },
    { cap: "From the order row: fraud checked, stock counted, courier booked.", art: `<div class="k-split">${chip("🟢 safe", "pop")}${chip(`stock <span class="k-count"><span class="a">12</span><span class="b">11</span></span>`, "pop d2")}${chip("🚚 booked", "pop d3")}</div>` },
    { cap: "Delivered cash flows into Courier Cash, then into your money picture.", art: `<div class="k-split">${chip("🚚 Delivered")}${arrow()}${win("Courier Cash", "to collect → yours ✓")}${arrow()}${zone("MONEY", "money")}</div>` },
    { cap: "People beside everything, Outreach reaching out, Work shaped your way.", art: `<div class="k-split">${zone("PEOPLE", "people")}${zone("OUTREACH", "outreach")}${zone("WORK", "work")}${chip("one customer = one row", "pop")}</div>` },
  ],
};
