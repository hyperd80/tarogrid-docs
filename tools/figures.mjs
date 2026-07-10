// Designed static illustrations — replace all text-drawn diagrams.
// Composed from the same kit primitives the demo player uses.

const zone = (name, cls, items = []) =>
  `<div class="k-zone ${cls} col">${name}${items.map((i) => `<span class="k-mini">${i}</span>`).join("")}</div>`;
const cell = (cls = "") => `<span class="k-cell ${cls}"></span>`;
const row = (inner, cls = "") => `<div class="k-r ${cls}">${inner}</div>`;
const r3 = (cls = "") => row(cell() + cell() + cell(), cls);
const board = (rows, head) => `<div class="k-board"><div class="k-bhead">${head}</div>${rows}</div>`;
const win = (title, body, cls = "") =>
  `<div class="k-win ${cls}"><div class="k-whead">${title}</div><div class="k-wbody">${body}</div></div>`;

export const FIGURES = {
  "workspace-map": `
  <div class="k-frame"><span class="k-flabel">WORKSPACE = YOUR COMPANY</span>
    <div class="k-split">
      ${zone("MONEY", "money", ["invoices · receipts", "expenses · orders", "courier cash"])}
      ${zone("PEOPLE", "people", ["customers · suppliers", "your team"])}
      ${zone("WORK", "work", ["your own boards", "projects · workflows"])}
    </div>
    <div class="k-base">Underneath it all: <b>BOARDS</b> — the company's databases</div>
  </div>
  <p class="figcap">One company, one home. Everything inside belongs to it.</p>`,

  "window-board": `
  <div class="k-split fig-gap">
    <div class="k-col"><div class="k-tag">the cockpit</div>${win("MODULE WINDOW", "e.g. the Invoice Center — friendly, smart, safe")}</div>
    <div class="k-col mid"><span class="k-updown">reads&nbsp;+&nbsp;writes<br>⇅<br>shows&nbsp;live&nbsp;data</span></div>
    <div class="k-col"><div class="k-tag">the engine room</div>${board(r3() + r3("hl-row") + r3(), "BOARD — e.g. INVOICE BOARD")}</div>
  </div>
  <p class="figcap">You work in the window; the truth lives on the board. You can always look underneath.</p>`,

  "board-layers": `
  <div class="k-split">${board(
    `<div class="k-gband">GROUP — “NEW”</div>` + r3() + row(cell() + `<span class="k-cellv">$59</span>` + cell(), "hl-row") + `<div class="k-gband g2">GROUP — “SHIPPED”</div>` + r3(),
    "BOARD — ORDERS"
  )}
    <div class="k-legend">
      <div><span class="k-dot b1"></span><b>Board</b> — one kind of information</div>
      <div><span class="k-dot b2"></span><b>Group</b> — a stage you'd say out loud</div>
      <div><span class="k-dot b3"></span><b>Item</b> — one row, one real thing</div>
      <div><span class="k-dot b4"></span><b>Cell</b> — one fact (this order's total)</div>
    </div>
  </div>`,

  "two-workspaces": `
  <div class="k-split fig-gap">
    <div class="k-frame sm"><span class="k-flabel">MAYA'S CLOSET</span>
      <div class="k-minirows">${board(r3() + r3(), "ORDERS")}</div>
      <div class="k-base">Team: Maya · Sana · Ben</div>
    </div>
    <div class="k-wall"></div>
    <div class="k-frame sm"><span class="k-flabel">ATLAS STUDIO</span>
      <div class="k-minirows">${board(r3() + r3(), "PROJECTS")}</div>
      <div class="k-base">Team: 6 designers</div>
    </div>
  </div>
  <p class="figcap">No door between them — ever.</p>`,

  "screen-anatomy": `
  <div class="k-appmock">
    <div class="k-side tall"><div class="k-si"></div><div class="k-si"></div><div class="k-si"></div><div class="k-si"></div><span class="k-nb pin">1</span></div>
    <div class="k-appmain">
      ${board(r3() + r3() + r3(), "BOARD AREA")}<span class="k-nb pin2">2</span>
      ${win("MODULE WINDOW", "floats over your boards", "over sm")}<span class="k-nb pin3">3</span>
      <div class="k-askrow"><span class="k-ask">⌘K&nbsp; find · ask · act</span><span class="k-nb">4</span><span class="k-chip round">?</span><span class="k-nb">5</span></div>
    </div>
  </div>`,

  "tarogrid-map": `
  <div class="k-map">
    <div class="k-split">
      <span class="k-chip">🛍️ Catalog</span><span class="k-arrow"></span>
      <span class="k-chip">🔗 Shop link</span><span class="k-arrow"></span>
      <span class="k-chip">📋 Orders Board</span><span class="k-arrow"></span>
      <span class="k-chip">🚚 Courier</span><span class="k-arrow"></span>
      <span class="k-chip">💵 Courier Cash</span>
    </div>
    <div class="k-mapnotes">
      <span class="k-mini">fraud check 🟢 · stock counts down · booking without re-typing</span>
    </div>
    <div class="k-split">${zone("MONEY", "money", ["invoices · receipts · expenses", "→ NET: did I make money?"])}</div>
    <div class="k-split">
      ${zone("PEOPLE", "people", ["one customer = one row,", "matched across everything"])}
      ${zone("WORK", "work", ["your own boards,", "connected when you want"])}
    </div>
  </div>
  <p class="figcap">Every arrow is a chore you no longer do — and an error you can no longer make.</p>`,
};
