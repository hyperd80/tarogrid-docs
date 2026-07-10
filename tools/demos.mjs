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
  // ---- Chapter 6: Sell ----
  "golden-path": [
    { cap: "Your Catalog holds the products — photo, price, stock.", art: `<div class="k-split"><div class="k-prod"><div class="ph">🌹</div><div class="nm">Rose Dress</div><div class="pr">$59</div></div><div class="k-prod"><div class="ph">🧣</div><div class="nm">Silk Scarf</div><div class="pr">$19</div></div></div>` },
    { cap: "Your shop link shows them to the world — no app, no account needed.", art: `<div class="k-split">${phone("Order")}${chip("yourshop.link/maya")}</div>` },
    { cap: "An order becomes a row on the Orders Board — by itself.", art: `<div class="k-split">${board(r3() + r3("pop hl-row"))}</div>` },
    { cap: "Fraud checked, stock counted, courier ready. The path continues.", art: `<div class="k-split">${chip("🟢 safe", "pop")}${chip(`stock <span class="k-count"><span class="a">12</span><span class="b">11</span></span>`, "pop d2")}${chip("🚚 ready", "pop d3")}</div>` },
  ],
  "catalog-shelf": [
    { cap: "The Catalog window — every product in one place.", art: `<div class="k-split">${win("Product Catalog", `<span class="k-chip sm">🌹 $59</span><span class="k-chip sm">🧣 $19</span><span class="k-chip sm">🎁 $69</span>`)}</div>` },
    { cap: "Add a product: photo, price, and stock if you track it.", art: `<div class="k-split"><div class="k-prod pop"><div class="ph">🌹</div><div class="nm">Rose Dress</div><div class="pr">$59 · 12 in stock</div></div></div>` },
    { cap: "Underneath the window: a real board — one row per product.", art: `<div class="k-stack">${win("Product Catalog", "your shelf", "over lift")}${board(r3() + r3("hl-row"), "PRODUCTS BOARD")}</div>` },
  ],
  "variants-sale": [
    { cap: "Options like size or color live on one product — not three copies.", art: `<div class="k-split"><div class="k-prod"><div class="ph">🌹</div><div class="nm">Rose Dress</div><div class="pr">$59</div></div>${chip("S", "sm")}${chip("M", "sm")}${chip("L", "sm")}</div>` },
    { cap: "Set a sale price — it wins automatically, everywhere.", art: `<div class="k-split"><div class="k-prod"><div class="ph">🌹</div><div class="nm">Rose Dress</div><div class="pr"><span class="k-strike">$59</span>$49</div></div>${chip("sale live ✓", "good pop")}</div>` },
    { cap: "Stock counts down on every sale — per option.", art: `<div class="k-split">${chip(`M size · stock <span class="k-count"><span class="a">8</span><span class="b">7</span></span>`, "pop")}</div>` },
  ],
  "combo-bundle": [
    { cap: "Two products become one bundle, with its own price.", art: `<div class="k-split"><div class="k-prod"><div class="ph">🌹</div><div class="nm">Rose Dress</div><div class="pr">$59</div></div><span class="k-cellv">+</span><div class="k-prod"><div class="ph">🧣</div><div class="nm">Silk Scarf</div><div class="pr">$19</div></div><span class="k-arrow"></span><div class="k-prod pop"><div class="ph">🎁</div><div class="nm">Gift Bundle</div><div class="pr">$69</div></div></div>` },
    { cap: "A bundle sale draws down BOTH stocks — honestly.", art: `<div class="k-split">${chip(`🌹 stock <span class="k-count"><span class="a">12</span><span class="b">11</span></span>`, "pop")}${chip(`🧣 stock <span class="k-count"><span class="a">30</span><span class="b">29</span></span>`, "pop d2")}</div>` },
  ],
  "form-builder": [
    { cap: "Fields: what you ask the customer — name, phone, address.", art: `<div class="k-split">${phone("Order")}</div>` },
    { cap: "The product picker is the heart of the form.", art: `<div class="k-split"><div class="k-phone"><div class="k-line"></div><span class="k-chip sm pop">🌹 Rose Dress $59</span><div class="k-btn">Order</div></div></div>` },
    { cap: "Brand it, then Share to web — your shop is live.", art: `<div class="k-split">${chip("Share to web ✓", "good pop")}${chip("yourshop.link/maya", "pop d2")}</div>` },
  ],
  "shop-link": [
    { cap: "Publishing gives you a short link, made for chat.", art: `<div class="k-split">${chip("yourshop.link/maya · copied ✓", "pop")}</div>` },
    { cap: "Pasted in a chat, it unfurls: your shop's name, real products, live prices.", art: `<div class="k-split">${win("Maya's Closet", `<span class="k-chip sm">🌹 $59</span><span class="k-chip sm">🧣 $19</span><span class="k-chip sm">🎁 $69</span>`, "pop")}</div>` },
    { cap: "Change a price in the Catalog — the live page updates on refresh.", art: `<div class="k-split">${chip("Catalog edited")}${arrow()}${chip("shop page updated ✓", "good pop")}</div>` },
  ],
  "shop-branding": [
    { cap: "Set your shop's look once — every form inherits it.", art: `<div class="k-split">${chip("🎨 shop look")}${arrow()}${win("Form A", "inherits ✓", "sm")}${win("Form B", "inherits ✓", "sm")}</div>` },
    { cap: "Any form can override one piece — “this form only.”", art: `<div class="k-split">${win("Form B", `own background · <span class="k-chip sm pop">this form only</span>`)}</div>` },
  ],
  "form-to-board": [
    { cap: "A customer fills your form and taps Order…", art: `<div class="k-split">${phone("Order")}</div>` },
    { cap: "…and every answer flies to its own column on the Orders Board.", art: `<div class="k-split">${board(row(`<span class="k-cellv pop">Anika</span>` + `<span class="k-chip sm pop d2">🌹 ×1</span>` + `<span class="k-cellv pop d3">$59</span>`, "hl-row"), "ORDERS")}</div>` },
    { cap: "TaroGrid adds what you'd forget: arrival time, fraud check, status Pending.", art: `<div class="k-split">${chip("🕒 9:12 pm", "pop")}${chip("🟢 fraud checked", "pop d2")}${chip("Status: Pending", "pop d3")}</div>` },
    { cap: "Stock counts down — and the customer matches by phone. No duplicate Anikas.", art: `<div class="k-split">${chip(`stock <span class="k-count"><span class="a">12</span><span class="b">11</span></span>`, "pop")}${chip("Matched: Anika ✓", "good pop d2")}</div>` },
  ],
  "customer-checkout": [
    { cap: "Your customer sees a clean page: your products, your prices, your look.", art: `<div class="k-split">${phone("Order")}<div class="k-prod"><div class="ph">🌹</div><div class="nm">Rose Dress</div><div class="pr">$59</div></div></div>` },
    { cap: "They choose how to pay — for example, cash on delivery.", art: `<div class="k-split">${chip("💵 Cash on delivery ✓", "pop")}${chip("💳 Pay online", "sm")}</div>` },
    { cap: "They tap Order — done. No account, no app, no friction.", art: `<div class="k-split">${chip("Order placed ✓", "good pop")}</div>` },
  ],
  "test-shop": [
    { cap: "Before you share the link: order from yourself.", art: `<div class="k-split">${phone("Order")}</div>` },
    { cap: "Find your test order, check every hop worked.", art: `<div class="k-split">${board(r3("hl-row"), "ORDERS")}${chip("🟢", "sm pop")}</div>` },
    { cap: "Then delete it — Trash keeps it recoverable, like everything.", art: `<div class="k-split">${chip("🗑️ moved to Trash · restorable", "pop")}</div>` },
  ],
  "edit-after-launch": [
    { cap: "Edit price, photo, or stock in the Catalog — the one true place.", art: `<div class="k-split"><div class="k-prod"><div class="ph">🌹</div><div class="nm">Rose Dress</div><div class="pr"><span class="k-strike">$59</span>$54</div></div></div>` },
    { cap: "Your live shop follows. Old orders keep their original prices.", art: `<div class="k-split">${chip("shop page: $54 ✓", "good pop")}${chip("yesterday's order: still $59", "pop d2")}</div>` },
  ],
  "two-doors": [
    { cap: "The Sales Form: a door for customers — products, payment, delivery.", art: `<div class="k-split">${phone("Order")}${arrow()}${board(r3("hl-row"), "ORDERS")}</div>` },
    { cap: "An intake form: a door for requests — straight onto a Work board.", art: `<div class="k-split">${win("Client request", "name · brief · deadline", "sm")}${arrow()}${board(r3("hl-row"), "REQUESTS")}</div>` },
    { cap: "Same trick, different doors: forms write rows.", art: `<div class="k-split">${chip("form", "sm")}${arrow()}${chip("row", "sm")}${chip("always", "good sm pop")}</div>` },
  ],
  "own-domain": [
    { cap: "Coming: your shop on your own web address.", art: `<div class="k-split">${chip("shop.yourbrand.com", "pop")}</div>` },
    { cap: "One small setting where you bought your domain — TaroGrid will guide you.", art: `<div class="k-split">${chip("connected ✓", "good pop")}</div>` },
  ],
  // ---- Chapter 5: Selling fields ----
  "product-field": [
    { cap: "Not typed text — a real product lives in the cell.", art: `<div class="k-split">${board(row(cell() + `<span class="k-chip sm">🌹 Rose Dress ×1</span>` + `<span class="k-cellv">$59</span>`, "hl-row"), "ORDERS")}</div>` },
    { cap: "Tap the chip: photo, price, stock — live from the Catalog.", art: `<div class="k-split"><div class="k-prod pop"><div class="ph">🌹</div><div class="nm">Rose Dress</div><div class="pr">$59 · 11 left</div></div></div>` },
    { cap: "Order placed → stock draws down. Bundles draw down every member.", art: `<div class="k-split">${chip(`🌹 <span class="k-count"><span class="a">12</span><span class="b">11</span></span>`, "pop")}${chip(`🧣 <span class="k-count"><span class="a">30</span><span class="b">29</span></span>`, "pop d2")}</div>` },
  ],
  "courier-book": [
    { cap: "Status flips to Confirmed → the courier books itself from the row.", art: `<div class="k-split">${chip("✓ Confirmed")}${arrow()}${chip("🚚 Booking…", "pop")}</div>` },
    { cap: "The tracking ID types itself in. No copy-paste, no typos.", art: `<div class="k-split">${chip("#TRK-88412 ✓", "good pop")}</div>` },
    { cap: "Delivery status updates on its own: in transit → delivered.", art: `<div class="k-split">${chip("📦 In transit")}${arrow()}${chip("✓ Delivered", "good pop")}</div>` },
    { cap: "Delivered cash-on-delivery money appears in Courier Cash.", art: `<div class="k-split">${win("Courier Cash", `To collect: <b>$59</b> ${chip("new", "sm good pop")}`)}</div>` },
  ],
  "fraud-light": [
    { cap: "Every order gets a light: green, yellow, or red.", art: `<div class="k-split"><span class="k-light g"></span><span class="k-light y"></span><span class="k-light r"></span></div>` },
    { cap: "It reads this phone number's delivery history: received vs returned.", art: `<div class="k-split">${chip("📱 …4521")}${chip("8 received ✓", "good pop")}${chip("5 returned ↩", "pop d2")}</div>` },
    { cap: "A signal, not a verdict. Red means: check before you ship.", art: `<div class="k-split"><span class="k-light r"></span>${chip("review before shipping", "pop")}</div>` },
  ],
  "order-row": [
    { cap: "One order row, five selling superpowers.", art: `<div class="k-split">${board(row(`<span class="k-cellv">Anika</span>` + `<span class="k-chip sm">🌹 ×1</span>` + `<span class="k-cellv">$59</span>` + `<span class="k-light g"></span>` + `<span class="k-chip sm">🚚</span>`, "hl-row"), "ORDERS")}</div>` },
    { cap: "Product chip → true total → fraud light → courier → cash on delivery.", art: `<div class="k-split">${chip("🌹 product", "sm pop")}${chip("$59 total", "sm pop")}${chip("🟢 fraud", "sm pop d2")}${chip("🚚 courier", "sm pop d2")}${chip("💵 COD", "sm pop d3")}</div>` },
  ],
  "advance-shield": [
    { cap: "A risky order? Ask for a small advance — about the delivery fee.", art: `<div class="k-split"><span class="k-light r"></span>${arrow()}${chip("💳 advance link · $5 · 24h", "pop")}</div>` },
    { cap: "Paid → the order confirms itself. Real skin in the game.", art: `<div class="k-split">${chip("paid ✓", "good pop")}${arrow()}${chip("Order: Confirmed", "good pop d2")}</div>` },
    { cap: "Not paid in time → flagged for your review. Never auto-cancelled.", art: `<div class="k-split">${chip("⏰ expired")}${arrow()}${chip("flagged for review", "pop")}</div>` },
  ],
};
