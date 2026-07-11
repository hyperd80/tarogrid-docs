// Animated demo scenes — one entry per article's demo, played by the demo
// theater (tools/theater.mjs). Entries live in per-chapter files under
// tools/demos/ so parallel authors never collide; this file aggregates.
//
// The theater grammar is recycled from the owner-approved website scene
// prototypes: a realistic mini-app frame, a rostrum camera, an OS-pointer
// cursor that appears ONLY when a human acts, timed beats with captions,
// chip swaps, count-ups, settle sweeps.
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

import { DEMOS_FLAGSHIP } from "./demos/flagship.mjs";
import { DEMOS_CORE } from "./demos/core.mjs";
import { DEMOS_SELL } from "./demos/sell.mjs";
import { DEMOS_ORDERS } from "./demos/orders.mjs";
import { DEMOS_MONEY } from "./demos/money.mjs";
import { DEMOS_MISC } from "./demos/misc.mjs";

export const DEMOS = {
  ...DEMOS_CORE,
  ...DEMOS_SELL,
  ...DEMOS_ORDERS,
  ...DEMOS_MONEY,
  ...DEMOS_MISC,
  ...DEMOS_FLAGSHIP,
};
