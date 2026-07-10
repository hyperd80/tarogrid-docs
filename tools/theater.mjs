// The demo theater — the shared engine behind every :::demo block.
//
// Recycled from the owner-approved website scene prototypes
// (Website/Prototypes/tarogrid-scene-*.html): the director cue engine,
// the rostrum camera, the OS-pointer cursor grammar (enters and leaves by
// MOVING through the frame edge, never by fading; clicks read as a
// tip-anchored tick plus the control's own pressed state), chip swaps,
// KPI count-ups, settle sweeps, toasts, and the phone shell — re-expressed
// compactly for inline article demos, in the docs site's own tokens, and
// re-cast to the global cast (CAST.md: Maya's Closet / Atlas Studio, $).
//
// Storytelling rule carried over from the prototypes: the cursor appears
// ONLY when a human acts. When TaroGrid acts on its own, no cursor —
// the absence is the argument.
//
// A demo is: { ws, crumb, cat, h, html, beats } (see demos.mjs).
// Each beat: { cap, d, cues: [[atMs, op, ...args], ...] } — offsets are
// relative to the beat's start; build.mjs flattens them to one absolute
// cue list embedded as JSON next to the stage markup.
//
// Ops the player understands (t = a data-t target name inside the stage):
//   ["cam", t, scale]        camera eases to frame the element
//   ["wide"]                 camera pulls back to full frame
//   ["cur", t]               cursor glides to the element (first use enters
//                            through the right frame edge)
//   ["click", t]             cursor tick + the control's .pressed state
//   ["curx"]                 cursor exits through the right frame edge
//   ["chip", t, s, label]    status chip swaps to data-s=s with new label
//   ["show", t] / ["hide", t]  entrance/exit for .t-in elements
//   ["cls", t, name, on]     generic class toggle (toggles, dims, nodes…)
//   ["text", t, html]        replace innerHTML (build-time authored)
//   ["type", t, text]        typewriter into the element
//   ["count", t, from, to, pre]  animated number (pre = "$" or "")
//   ["row", t, rowHtml]      insert a table row at top, landing + fresh ring
//   ["flash", t]             one scan-highlight sweep
//   ["pulse", t]             one emphasis pulse (amounts, counters)
//   ["settle", t]            the loop-closing green settle animation
//   ["toast", html] / ["toastx"]  in-frame toast corner
//   ["carry", t, dest]       pick an element up and carry it into dest
//                            (kanban drags, column moves)

// ---------------------------------------------------------------------------
// CSS — namespaced t-*; the k-* figure kit stays untouched and both can be
// composed inside a stage. Colors ride the site tokens; the three status
// hues get their own pairs so chips/lights read in both themes.
// ---------------------------------------------------------------------------
export const THEATER_CSS = `
:root{--t-ok:#1e7a44;--t-ok-bg:#e2f2e8;--t-warn:#9a6b12;--t-warn-bg:#f7ecd7;--t-bad:#b3403e;--t-bad-bg:#fbe9e8;
--t-ease:cubic-bezier(.23,1,.32,1);--t-io:cubic-bezier(.77,0,.175,1)}
[data-theme=dark]{--t-ok:#7ed6a3;--t-ok-bg:#1d3226;--t-warn:#e3b566;--t-warn-bg:#3a2f18;--t-bad:#e8918f;--t-bad-bg:#3d2222}
/* ---- figure shell ---- */
.demo{border:1px solid var(--border);border-radius:16px;margin:22px 0;overflow:hidden;background:var(--card);box-shadow:var(--shadow)}
.demo figcaption{background:var(--soft);padding:9px 14px;font-size:13.5px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border)}
.demo-play{display:inline-flex;width:20px;height:20px;border-radius:99px;background:var(--primary);color:#fff;align-items:center;justify-content:center;font-size:9px;flex:none}
.demo-dur{color:var(--muted);font-size:12px;margin-left:auto;font-variant-numeric:tabular-nums}
.demo-sim{font-size:10px;font-weight:700;letter-spacing:.5px;color:var(--muted);border:1px solid var(--border);border-radius:99px;padding:1px 8px;white-space:nowrap}
/* ---- stage / frame / camera ---- */
.t-stage{position:relative}
.t-frame{position:relative;background:var(--card);overflow:hidden}
.t-chrome{display:flex;align-items:center;gap:9px;padding:8px 12px;border-bottom:1px solid var(--border);position:relative;z-index:4;background:var(--card)}
.t-lights{display:flex;gap:5px}
.t-lights i{width:8px;height:8px;border-radius:50%;background:var(--border)}
.t-ws{font-size:11.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-ws span{color:var(--muted);font-weight:500}
.t-askpill{margin-left:auto;display:flex;align-items:center;gap:6px;border:1px solid var(--border);background:var(--soft);border-radius:99px;padding:3px 9px;font-size:10.5px;color:var(--muted);flex:none}
.t-askpill kbd{font:10px ui-monospace,Menlo,monospace;border:1px solid var(--border);border-radius:4px;padding:0 4px;background:var(--card)}
.t-avatar{width:20px;height:20px;border-radius:50%;background:var(--soft);color:var(--primary-ink);font-size:9px;font-weight:800;display:grid;place-items:center;flex:none}
.t-viewport{position:relative;overflow:hidden}
.t-camera{position:absolute;inset:0;transform-origin:0 0;transition:transform .7s var(--t-io)}
.t-app{display:grid;grid-template-columns:40px 1fr;height:100%}
.t-app.bare{grid-template-columns:1fr}
.t-snav{border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px 0}
.t-snav .c{width:22px;height:22px;border-radius:7px;display:grid;place-items:center}
.t-snav .c i{width:8px;height:8px;border-radius:3px;display:block}
.t-snav .c.on{background:var(--soft);outline:1px solid var(--border)}
.t-main{padding:10px 12px 12px;min-width:0;position:relative}
.t-main.center{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap}
.t-crumb{font-size:10.5px;color:var(--muted);margin-bottom:8px}
.t-crumb b{color:var(--ink);font-weight:700}
@media(max-width:480px){.t-snav{display:none}.t-app{grid-template-columns:1fr}.t-askpill{display:none}}
/* ---- the ACTUAL cursor (opaque OS pointer; motion-only entry/exit) ---- */
.t-cursor{position:absolute;left:0;top:0;z-index:9;width:20px;height:22px;pointer-events:none;transition:transform 1ms linear;transform:translate(-48px,-48px)}
.t-cursor .p{display:block;transform-origin:4px 3px;transition:transform .09s var(--t-ease)}
.t-cursor.tick .p{transform:scale(.84)}
.t-cursor svg{display:block;filter:drop-shadow(0 1.5px 2px rgba(0,0,0,.35))}
.pressed{transform:scale(.94)!important}
/* ---- entrance grammar ---- */
.t-in{opacity:0;transform:translateY(5px) scale(.98);transition:opacity .3s var(--t-ease),transform .34s var(--t-ease)}
.t-in.in{opacity:1;transform:none}
.t-dim{opacity:.45;transition:opacity .35s var(--t-ease)}
.t-undim{opacity:1}
/* ---- tables (real board rows) ---- */
.t-tbl{width:100%;border-collapse:collapse;font-size:11px}
.t-tbl th{font-size:8.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);text-align:left;padding:3px 7px;border-bottom:1px solid var(--border);white-space:nowrap}
.t-tbl td{padding:0 7px;height:29px;border-bottom:1px solid var(--border);vertical-align:middle;white-space:nowrap}
.t-tbl td.r{text-align:right;font-weight:700}
.t-tbl tr{transition:background-color .25s var(--t-ease),opacity .3s var(--t-ease)}
.t-tbl tr.dim{opacity:.45}
.t-tbl tr.fresh{background:var(--soft);box-shadow:inset 0 0 0 1px var(--border)}
.t-tbl tr.new{opacity:0;transform:translateY(-6px)}
.t-tbl tr.landed{opacity:1;transform:none;transition:opacity .3s var(--t-ease),transform .3s var(--t-ease)}
.t-scan{background:var(--soft)!important}
.t-settle{animation:t-settle 1.8s var(--t-ease) 1}
@keyframes t-settle{0%{background:transparent;box-shadow:inset 0 0 0 1px transparent}25%{background:var(--t-ok-bg);box-shadow:inset 0 0 0 1px var(--t-ok)}100%{background:transparent;box-shadow:inset 0 0 0 1px transparent}}
.t-mono{font-family:ui-monospace,Menlo,monospace;font-size:.92em}
.t-num{font-variant-numeric:tabular-nums}
.t-pul{animation:t-pul .5s var(--t-ease) 1}
@keyframes t-pul{0%{transform:scale(1)}40%{transform:scale(1.09)}100%{transform:scale(1)}}
/* ---- chips / lights ---- */
.t-chip{display:inline-flex;align-items:center;gap:5px;border-radius:99px;padding:2px 8px;font-size:9.5px;font-weight:700;background:var(--soft);color:var(--muted);border:1px solid var(--border);transition:opacity .14s var(--t-ease),transform .14s var(--t-ease);white-space:nowrap}
.t-chip.swap{opacity:0;transform:translateY(-2px)}
.t-chip[data-s=acc]{background:var(--soft);color:var(--primary-ink);border-color:transparent}
.t-chip[data-s=ok]{background:var(--t-ok-bg);color:var(--t-ok);border-color:transparent}
.t-chip[data-s=warn]{background:var(--t-warn-bg);color:var(--t-warn);border-color:transparent}
.t-chip[data-s=bad]{background:var(--t-bad-bg);color:var(--t-bad);border-color:transparent}
.t-light{width:12px;height:12px;border-radius:99px;display:inline-block;flex:none}
.t-light.g{background:#41a874}.t-light.y{background:#daa832}.t-light.r{background:#d95a58}
/* ---- KPIs ---- */
.t-kpis{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-bottom:8px}
.t-kpis.two{grid-template-columns:repeat(2,1fr)}
.t-kpi{padding:5px 9px;border-right:1px solid var(--border);min-width:0}
.t-kpi:last-child{border-right:0}
.t-kpi .k{font-size:8.5px;color:var(--muted);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-kpi .v{font-size:13px;font-weight:800;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
/* ---- cards (recipe / module window) ---- */
.t-card{border:1px solid var(--border);border-radius:10px;background:var(--card);padding:9px 11px;transition:background-color .3s var(--t-ease),box-shadow .3s var(--t-ease)}
.t-card.fresh{background:var(--soft);box-shadow:inset 0 0 0 1px var(--border)}
.t-card .cn{font-size:11.5px;font-weight:700}
.t-card .cs{font-size:9.5px;color:var(--muted);margin-top:1px}
.t-card .cr{font-size:10.5px;color:var(--muted);line-height:1.5;margin-top:7px}
.t-card .cr b{color:var(--ink)}
.t-crow{display:flex;align-items:center;gap:8px}
.t-win{background:var(--card);border:1px solid var(--border);border-radius:10px;box-shadow:var(--shadow);min-width:150px;max-width:100%}
.t-win .wh{padding:6px 10px;border-bottom:1px solid var(--border);font-size:9.5px;font-weight:800;letter-spacing:.04em;display:flex;align-items:center;gap:6px}
.t-win .wb{padding:8px 10px;font-size:10.5px;display:flex;gap:6px;align-items:center;flex-wrap:wrap;line-height:1.5}
/* ---- toggle ---- */
.t-tgl{flex:none;width:34px;height:20px;border-radius:10px;background:var(--border);position:relative;transition:background-color .25s var(--t-ease),transform .12s var(--t-ease);display:inline-block;cursor:default}
.t-tgl i{position:absolute;top:2.5px;left:2.5px;width:15px;height:15px;border-radius:50%;background:var(--card);box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .25s var(--t-ease);display:block}
.t-tgl.on{background:var(--primary)}
.t-tgl.on i{transform:translateX(14px)}
/* ---- buttons ---- */
.t-btn{display:inline-flex;align-items:center;gap:5px;background:var(--primary);color:#fff;border-radius:7px;padding:5px 12px;font-size:10.5px;font-weight:700;transition:transform .12s var(--t-ease),opacity .3s var(--t-ease);box-shadow:0 1px 2px rgba(0,0,0,.12);white-space:nowrap}
.t-btn.o{background:var(--card);color:var(--ink);border:1px solid var(--border);box-shadow:none}
/* ---- ASK bar ---- */
.t-ask{display:flex;align-items:center;gap:7px;border:1px solid var(--border);border-radius:9px;background:var(--card);box-shadow:var(--shadow);padding:7px 11px;font-size:11px;min-width:0;max-width:100%}
.t-ask kbd{font:9.5px ui-monospace,Menlo,monospace;border:1px solid var(--border);border-radius:4px;padding:0 4px;color:var(--muted);flex:none}
.t-ask .tx{min-width:0;overflow:hidden;white-space:nowrap;color:var(--ink);font-weight:600}
.t-ask .tx:empty:before{content:"Ask anything…";color:var(--muted);font-weight:400}
.t-ask .tx.typing:after{content:"";display:inline-block;width:1.5px;height:11px;background:var(--primary);margin-left:1px;vertical-align:-1.5px;animation:t-caret .8s step-end infinite}
@keyframes t-caret{50%{opacity:0}}
/* ---- phone shell (customer side / mobile) ---- */
.t-phone{width:148px;background:var(--card);border:1px solid var(--border);border-radius:20px;box-shadow:var(--shadow);overflow:hidden;flex:none;position:relative}
.t-phone .ph-n{height:14px;display:grid;place-items:center}
.t-phone .ph-n i{width:40px;height:4px;border-radius:2px;background:var(--border);display:block}
.t-phone .ph-b{padding:6px 9px 11px;position:relative}
.t-shophead{display:flex;align-items:center;gap:6px;padding:0 0 7px}
.t-shophead .sa{width:20px;height:20px;border-radius:6px;background:var(--primary);color:#fff;font-size:8px;font-weight:800;display:grid;place-items:center;flex:none}
.t-shophead .sn{font-size:9.5px;font-weight:700;line-height:1.15}
.t-shophead .ss{font-size:7.5px;color:var(--muted)}
.t-sgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.t-scard{border:1px solid var(--border);border-radius:8px;overflow:hidden;background:var(--card)}
.t-scard .si{height:40px}.t-scard .si svg{display:block;width:100%;height:100%}
.t-scard .sb2{padding:4px 5px 5px}
.t-scard .snm{font-size:7.5px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-scard .spr{font-size:7.5px;color:var(--muted);font-weight:600;margin:1px 0 3px}
.t-scard .add{width:100%;height:15px;border:1px solid var(--border);border-radius:5px;font-size:7px;font-weight:700;color:var(--primary-ink);display:grid;place-items:center;transition:background-color .2s var(--t-ease),transform .12s var(--t-ease)}
.t-scard.added .add{background:var(--soft);border-color:transparent}
.t-szs{display:flex;gap:3px;margin-bottom:3px}
.t-sz{min-width:12px;height:12px;padding:0 2px;border:1px solid var(--border);border-radius:3px;display:grid;place-items:center;font-size:6.5px;font-weight:700;color:var(--muted);transition:background-color .18s var(--t-ease),color .18s var(--t-ease)}
.t-sz.sel{background:var(--soft);color:var(--primary-ink);border-color:transparent}
.t-payrow{display:flex;gap:4px;margin:6px 0 5px}
.t-payopt{flex:1;border:1px solid var(--border);border-radius:6px;padding:3px 2px;text-align:center;font-size:7px;font-weight:700;color:var(--muted);transition:background-color .2s var(--t-ease),color .2s var(--t-ease)}
.t-payopt.sel{background:var(--soft);color:var(--primary-ink);border-color:transparent}
.t-totrow{display:flex;justify-content:space-between;font-size:7.5px;font-weight:500;color:var(--muted);padding:1px 1px}
.t-totrow.grand{font-size:8.5px;font-weight:800;color:var(--ink);border-top:1px solid var(--border);margin-top:2px;padding-top:3px}
.t-place{width:100%;background:var(--primary);color:#fff;border-radius:6px;padding:5px 0;font-size:8.5px;font-weight:700;margin-top:5px;text-align:center;transition:transform .12s var(--t-ease)}
.t-psuccess{position:absolute;inset:0;background:var(--card);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;opacity:0;pointer-events:none;transition:opacity .28s var(--t-ease);z-index:2}
.t-psuccess.in{opacity:1}
.t-psuccess .ok{width:30px;height:30px;border-radius:50%;background:var(--t-ok-bg);color:var(--t-ok);display:grid;place-items:center;transform:scale(.8);transition:transform .35s var(--t-ease)}
.t-psuccess.in .ok{transform:scale(1)}
.t-psuccess .s1{font-size:10px;font-weight:800}
.t-psuccess .s2{font-size:8px;color:var(--muted)}
/* ---- chat (share / link unfurl) ---- */
.t-bub{max-width:128px;margin-left:auto;background:var(--soft);color:var(--ink);border-radius:10px 10px 3px 10px;padding:7px 8px;font-size:8.5px;font-weight:500;line-height:1.4}
.t-bub .lc{margin-top:5px;background:var(--card);border:1px solid var(--border);border-radius:6px;padding:5px 6px;display:flex;align-items:center;gap:5px}
.t-bub .lc i{width:14px;height:14px;border-radius:4px;background:var(--primary);flex:none;display:block}
.t-bub .lc span{font-size:7.5px;font-weight:700}
/* ---- lifecycle nodes (invoice life) ---- */
.t-life{display:flex;align-items:flex-start;padding:10px 4px 2px}
.t-node{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative;min-width:0}
.t-node .nb{width:17px;height:17px;border-radius:50%;border:1.5px solid var(--border);background:var(--card);display:grid;place-items:center;color:transparent;transition:border-color .3s var(--t-ease),background-color .3s var(--t-ease),color .3s var(--t-ease);z-index:1}
.t-node.done .nb{border-color:var(--primary);background:var(--soft);color:var(--primary-ink)}
.t-node.done.ok .nb{border-color:var(--t-ok);background:var(--t-ok-bg);color:var(--t-ok)}
.t-node .nl{font-size:7.5px;font-weight:700;color:var(--muted);transition:color .3s var(--t-ease);white-space:nowrap}
.t-node.done .nl{color:var(--ink)}
.t-node .trk{position:absolute;top:8px;right:50%;width:100%;height:1.5px;background:var(--border);z-index:0}
.t-node:first-child .trk{display:none}
.t-node .trk i{position:absolute;inset:0;background:var(--primary);transform:scaleX(0);transform-origin:left;transition:transform .4s var(--t-io);display:block}
.t-node.wired .trk i{transform:scaleX(1)}
/* ---- toast ---- */
.t-toast{position:absolute;top:8px;right:8px;z-index:7;display:flex;align-items:center;gap:7px;background:var(--card);border:1px solid var(--border);border-radius:9px;padding:6px 10px;font-size:9.5px;font-weight:500;box-shadow:var(--shadow);opacity:0;transform:translateY(-6px);transition:opacity .22s var(--t-ease),transform .22s var(--t-ease);pointer-events:none;max-width:78%}
.t-toast.in{opacity:1;transform:none}
.t-toast b{font-weight:700}
.t-toast .tk{display:grid;place-items:center;width:16px;height:16px;border-radius:50%;background:var(--t-ok-bg);color:var(--t-ok);flex:none;font-size:8px}
/* ---- checklist ---- */
.t-task{display:flex;gap:7px;align-items:center;font-size:10.5px;padding:3px 0}
.t-box{width:14px;height:14px;border-radius:4px;border:1.5px solid var(--border);display:inline-flex;align-items:center;justify-content:center;font-size:8px;color:#fff;flex:none;transition:background-color .25s var(--t-ease),border-color .25s var(--t-ease)}
.t-box.done{background:var(--primary);border-color:var(--primary)}
/* ---- product tile (catalog cards) ---- */
.t-prod{width:76px;background:var(--card);border:1px solid var(--border);border-radius:10px;overflow:hidden;text-align:center;box-shadow:var(--shadow);flex:none}
.t-prod .pi{height:44px}.t-prod .pi svg{display:block;width:100%;height:100%}
.t-prod .pn{font-size:8px;font-weight:700;margin-top:3px;padding:0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t-prod .pp{font-size:8.5px;color:var(--primary-ink);font-weight:800;padding-bottom:5px}
.t-prod .pp s{color:var(--muted);opacity:.6;margin-right:3px;font-weight:600}
/* ---- kanban ---- */
.t-kcol{background:var(--soft);border:1px solid var(--border);border-radius:9px;padding:7px 7px 9px;min-width:96px;flex:1;max-width:150px}
.t-kcol .kh{font-size:8px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin-bottom:6px;display:flex;gap:4px;align-items:center}
.t-kcol .kh i{width:7px;height:7px;border-radius:99px;display:block}
.t-kcard{background:var(--card);border:1px solid var(--border);border-radius:7px;padding:6px 8px;font-size:9.5px;font-weight:600;box-shadow:var(--shadow);margin-bottom:5px;transition:box-shadow .2s var(--t-ease)}
.t-kcard .kc2{font-size:8px;color:var(--muted);font-weight:500;margin-top:1px}
.t-kcard.lift{box-shadow:0 8px 20px -8px rgba(0,0,0,.35);rotate:-2deg}
/* ---- carry (drag) ---- */
.t-carry{position:absolute;z-index:8;transition:transform .6s var(--t-io);margin:0!important}
/* ---- view switching (hard cuts between screens, S4 grammar) ---- */
.t-view{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;padding:10px 12px;transition:opacity .25s var(--t-ease)}
.t-view.off{opacity:0;pointer-events:none}
/* ---- window lift (the "board underneath" move) ---- */
.t-lift{transition:transform .8s var(--t-io);display:inline-block}
.t-lift.up{transform:translateY(-16px) rotate(-2deg)}
/* ---- phone recede (PiP hands the frame back) ---- */
.t-phone{transition:opacity .4s var(--t-ease),transform .5s var(--t-io)}
.t-phone.gone{opacity:0;transform:translateX(24%) scale(.92);pointer-events:none}
/* ---- caption bar ---- */
.t-capbar{display:flex;align-items:center;gap:9px;padding:8px 12px;border-top:1px solid var(--border);background:var(--card)}
.t-playbtn{display:grid;place-items:center;width:26px;height:26px;border-radius:99px;border:1px solid var(--border);background:var(--card);color:var(--ink);cursor:pointer;flex:none;padding:0}
.t-playbtn:hover{border-color:var(--primary)}
.t-playbtn svg{display:block}
.t-cap{font-size:12px;font-weight:500;min-width:0;flex:1;line-height:1.4}
.t-dots{display:flex;gap:4px;flex:none}
.t-dots button{width:16px;height:16px;border-radius:50%;display:grid;place-items:center;border:0;background:none;cursor:pointer;padding:0}
.t-dots button i{width:6px;height:6px;border-radius:50%;background:var(--border);transition:background-color .2s var(--t-ease),transform .2s var(--t-ease);display:block}
.t-dots button[aria-current=true] i{background:var(--primary);transform:scale(1.35)}
.t-dots button:hover i{background:var(--muted)}
/* ---- static fallback (reduced motion; capbar stays as an opt-in Play) ---- */
.t-story{display:none;margin:0;padding:10px 14px 12px;border-top:1px solid var(--border);font-size:12.5px;color:var(--muted)}
.t-story li{margin:4px 0 4px 18px}
.t-static .t-story{display:block}
.t-static .t-dots{display:none}
.t-static .t-cursor{display:none}
.t-static .t-in{opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.t-cursor{display:none!important}}
`;

// ---------------------------------------------------------------------------
// Player JS — appended to the site's APP_JS. Plain string, no backticks or
// ${} inside (it is embedded into a template literal by build.mjs).
// ---------------------------------------------------------------------------
export const THEATER_JS = String.raw`
/* ---- demo theater player ---- */
/* All engine state hangs off one lazily-created global so thInit is safe to
   call from ANY point in the page lifecycle (including before this file's
   top-level would have run under an early boot). */
function thState(){
  if (!window.__thState) window.__thState = { stages: [], io: null, raf: false, ioAlive: false, ioBroken: false };
  return window.__thState;
}
function thInit(){
  var TH = thState();
  TH.stages = TH.stages.filter(function(st){ return document.contains(st.el); });
  if (!TH.io && "IntersectionObserver" in window){
    try {
      TH.io = new IntersectionObserver(function(es){
        TH.ioAlive = true;
        es.forEach(function(e){
          var st = TH.stages.find(function(s){ return s.el === e.target; });
          if (st){ st.visible = e.isIntersecting; }
        });
      }, {threshold: .35});
    } catch (err) { TH.io = null; }
  }
  document.querySelectorAll(".t-stage[data-demo]").forEach(function(el){
    if (el._th) return;
    el._th = true;
    var dataEl = el.querySelector("script[type='application/json']");
    if (!dataEl) return;
    var spec; try { spec = JSON.parse(dataEl.textContent); } catch(err){ return; }
    var st = {
      el: el, spec: spec,
      vp: el.querySelector(".t-viewport"), cam: el.querySelector(".t-camera"),
      cur: el.querySelector(".t-cursor"), capEl: el.querySelector(".t-cap"),
      snapshot: el.querySelector(".t-frame").innerHTML,
      time: 0, idx: 0, playing: true, userPaused: false, visible: false,
      curOn: false, camS: {s:1, x:0, y:0}, lastTs: null, holdUntil: 0
    };
    if (REDUCED){
      /* static storyboard, with the Play button as opt-in motion-on-request */
      el.classList.add("t-static");
      st.static = true;
      spec.cues.forEach(function(c){ thRun(st, c.op, true); });
      thCap(st, spec.caps.length - 1);
      thPlaying(st, false);
      var pb0 = el.querySelector(".t-playbtn");
      if (pb0) pb0._wired = true;
      if (pb0) pb0.addEventListener("click", function(){
        if (!st.static){ st.userPaused = st.playing; thPlaying(st, !st.playing); return; }
        st.static = false;
        el.classList.remove("t-static");
        thWire(st);
        thReset(st);
        st.visible = true; st.noIO = true;
        TH.stages.push(st);
        thPlaying(st, true);
        thLoop();
      }, false);
      return;
    }
    thWire(st);
    TH.stages.push(st);
    if (TH.io && !TH.ioBroken){
      TH.io.observe(el);
      /* fail-open: a working IO always delivers an initial entry per target.
         If none ever arrives, the host broke IO — play on time instead. */
      setTimeout(function(){
        if (!TH.ioAlive){
          TH.ioBroken = true;
          TH.stages.forEach(function(s){ s.visible = true; s.noIO = true; });
        }
      }, 1200);
    } else {
      st.visible = true; st.noIO = true;
    }
  });
  thLoop();
}
function thWire(st){
  var dots = st.el.querySelector(".t-dots");
  if (dots && !dots.childElementCount){
    st.spec.caps.forEach(function(b, i){
      var d = document.createElement("button");
      d.setAttribute("aria-label", "Beat " + (i + 1));
      d.setAttribute("aria-current", i === 0 ? "true" : "false");
      d.innerHTML = "<i></i>";
      d.addEventListener("click", function(){ thJump(st, i); });
      dots.appendChild(d);
    });
    var pb = st.el.querySelector(".t-playbtn");
    if (pb && !pb._wired){
      pb._wired = true;
      pb.addEventListener("click", function(){
        st.userPaused = st.playing;
        thPlaying(st, !st.playing);
      });
    }
  }
}
function thLoop(){
  var TH = thState();
  if (!TH.raf){ TH.raf = true; requestAnimationFrame(thTick); }
}
function thPlaying(st, on){
  st.playing = on;
  var pb = st.el.querySelector(".t-playbtn");
  if (pb){
    pb.setAttribute("aria-label", on ? "Pause" : "Play");
    pb.innerHTML = on
      ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1.2"/><rect x="14" y="4" width="5" height="16" rx="1.2"/></svg>'
      : '<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5-13-7.5z"/></svg>';
  }
}
function thTick(ts){
  var TH = thState();
  TH.stages = TH.stages.filter(function(st){ return document.contains(st.el); });
  TH.stages.forEach(function(st){
    if (!st.playing || !st.visible) { st.lastTs = null; return; }
    if (st.lastTs == null){ st.lastTs = ts; return; }
    var dt = Math.min(80, ts - st.lastTs); st.lastTs = ts;
    if (st.holdUntil > 0){
      st.holdUntil -= dt;
      if (st.holdUntil <= 0){ thReset(st); }
      return;
    }
    st.time += dt;
    while (st.idx < st.spec.cues.length && st.spec.cues[st.idx].t <= st.time){
      thRun(st, st.spec.cues[st.idx].op, false);
      st.idx++;
    }
    thCap(st, thBeat(st));
    if (st.time >= st.spec.dur){ st.holdUntil = 900; }
  });
  requestAnimationFrame(thTick);
}
function thBeat(st){
  var b = 0;
  for (var i = 0; i < st.spec.caps.length; i++){ if (st.time >= st.spec.caps[i].t) b = i; }
  return b;
}
function thCap(st, i){
  if (st._cap === i) return;
  st._cap = i;
  if (st.capEl) st.capEl.textContent = st.spec.caps[i].cap;
  var dots = st.el.querySelectorAll(".t-dots button");
  dots.forEach(function(d, k){ d.setAttribute("aria-current", k === i ? "true" : "false"); });
}
function thReset(st){
  st.el.querySelector(".t-frame").innerHTML = st.snapshot;
  st.vp = st.el.querySelector(".t-viewport");
  st.cam = st.el.querySelector(".t-camera");
  st.cur = st.el.querySelector(".t-cursor");
  st.time = 0; st.idx = 0; st.holdUntil = 0; st.curOn = false; st._cap = -1;
  st.camS = {s:1, x:0, y:0};
  thCap(st, 0);
}
function thJump(st, i){
  thReset(st);
  st.time = st.spec.caps[i].t;
  while (st.idx < st.spec.cues.length && st.spec.cues[st.idx].t <= st.time){
    thRun(st, st.spec.cues[st.idx].op, true);
    st.idx++;
  }
  thCap(st, i);
  st.lastTs = null;
  if (!st.userPaused) thPlaying(st, true);
}
/* target + geometry */
function thT(st, name){ return st.el.querySelector('[data-t="' + name + '"]'); }
function thRect(st, el){
  var x = 0, y = 0, n = el;
  while (n && n !== st.cam){ x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return {x:x, y:y, w:el.offsetWidth, h:el.offsetHeight};
}
function thCamApply(st, dur){
  st.cam.style.transitionDuration = dur + "ms";
  st.cam.style.transform = "translate(" + st.camS.x + "px," + st.camS.y + "px) scale(" + st.camS.s + ")";
}
/* ops */
function thRun(st, op, inst){
  var k = op[0], el;
  /* static (reduced-motion) render: framing and pointer ops don't apply */
  if (st.static && (k === "cam" || k === "wide" || k === "cur" || k === "curx")) return;
  switch(k){
  case "cam":
    el = thT(st, op[1]); if (!el) break;
    var s = op[2] || 1.25, vw = st.vp.clientWidth, vh = st.vp.clientHeight, r = thRect(st, el);
    var tx = vw/2 - s*(r.x + r.w/2), ty = vh/2 - s*(r.y + r.h/2);
    tx = Math.min(0, Math.max(vw*(1-s), tx)); ty = Math.min(0, Math.max(vh*(1-s), ty));
    st.camS = {s:s, x:tx, y:ty}; thCamApply(st, inst ? 0 : 750);
    break;
  case "wide":
    st.camS = {s:1, x:0, y:0}; thCamApply(st, inst ? 0 : 650);
    break;
  case "cur":
    el = thT(st, op[1]); if (!el || !st.cur) break;
    var rr = thRect(st, el), cx = rr.x + rr.w*0.55, cy = rr.y + rr.h*0.62;
    if (inst){ st.cur.style.transitionDuration = "1ms"; st.cur.style.transform = "translate(" + cx + "px," + cy + "px)"; st.curOn = true; break; }
    if (!st.curOn){
      st.cur.style.transitionDuration = "1ms";
      st.cur.style.transform = "translate(" + (st.vp.clientWidth + 24) + "px," + Math.max(30, cy - 40) + "px)";
      void st.cur.offsetWidth;
      st.curOn = true;
    }
    st.cur.style.transitionDuration = ".65s";
    st.cur.style.transitionTimingFunction = "cubic-bezier(.77,0,.175,1)";
    st.cur.style.transform = "translate(" + cx + "px," + cy + "px)";
    break;
  case "curx":
    if (!st.cur) break;
    st.curOn = false;
    if (inst){ st.cur.style.transitionDuration = "1ms"; }
    else { st.cur.style.transitionDuration = ".5s"; }
    st.cur.style.transform = "translate(" + (st.vp.clientWidth + 24) + "px,90px)";
    break;
  case "click":
    el = thT(st, op[1]);
    if (inst || !el) break;
    st.cur.classList.add("tick");
    el.classList.add("pressed");
    setTimeout(function(){ el.classList.remove("pressed"); st.cur.classList.remove("tick"); }, 150);
    break;
  case "chip":
    el = thT(st, op[1]); if (!el) break;
    var apply = function(){ el.dataset.s = op[2]; el.innerHTML = op[3]; };
    if (inst){ apply(); break; }
    el.classList.add("swap");
    setTimeout(function(){ apply(); el.classList.remove("swap"); }, 130);
    break;
  case "show": el = thT(st, op[1]); if (el) el.classList.add("in"); break;
  case "hide": el = thT(st, op[1]); if (el) el.classList.remove("in"); break;
  case "cls":
    el = thT(st, op[1]); if (!el) break;
    el.classList.toggle(op[2], op[3] !== 0);
    break;
  case "text": el = thT(st, op[1]); if (el) el.innerHTML = op[2]; break;
  case "type":
    el = thT(st, op[1]); if (!el) break;
    if (inst){ el.textContent = op[2]; el.classList.remove("typing"); break; }
    el.textContent = ""; el.classList.add("typing");
    (function(target, txt){
      var i = 0;
      var iv = setInterval(function(){
        if (!document.contains(target) || i >= txt.length){ clearInterval(iv); target.classList.remove("typing"); return; }
        target.textContent += txt[i++];
      }, 34);
    })(el, op[2]);
    break;
  case "count":
    el = thT(st, op[1]); if (!el) break;
    var from = op[2], to = op[3], pre = op[4] || "";
    if (inst){ el.textContent = pre + to.toLocaleString("en-US"); break; }
    (function(target){
      var t0 = performance.now();
      function stp(ts2){
        var p = Math.min(1, (ts2 - t0)/600); p = 1 - Math.pow(1 - p, 3);
        target.textContent = pre + Math.round(from + (to - from)*p).toLocaleString("en-US");
        if (p < 1 && document.contains(target)) requestAnimationFrame(stp);
      }
      requestAnimationFrame(stp);
    })(el);
    break;
  case "row":
    el = thT(st, op[1]); if (!el) break;
    var tr = document.createElement("tr");
    tr.className = "new fresh";
    tr.innerHTML = op[2];
    el.insertBefore(tr, el.firstChild);
    if (inst){ tr.classList.remove("new"); tr.classList.add("landed"); }
    else { requestAnimationFrame(function(){ requestAnimationFrame(function(){ tr.classList.add("landed"); }); }); }
    break;
  case "flash":
    el = thT(st, op[1]);
    if (inst || !el) break;
    el.classList.add("t-scan");
    setTimeout(function(){ el.classList.remove("t-scan"); }, 240);
    break;
  case "pulse":
    el = thT(st, op[1]);
    if (inst || !el) break;
    el.classList.add("t-pul");
    setTimeout(function(){ el.classList.remove("t-pul"); }, 520);
    break;
  case "settle":
    el = thT(st, op[1]);
    if (inst || !el) break;
    el.classList.add("t-settle");
    setTimeout(function(){ el.classList.remove("t-settle"); }, 1850);
    break;
  case "toast":
    el = st.el.querySelector(".t-toast"); if (!el) break;
    el.innerHTML = '<span class="tk">✓</span><span>' + op[1] + "</span>";
    if (inst){ el.classList.add("in"); break; }
    el.classList.remove("in"); void el.offsetWidth; el.classList.add("in");
    break;
  case "toastx":
    el = st.el.querySelector(".t-toast"); if (el) el.classList.remove("in");
    break;
  case "carry":
    el = thT(st, op[1]);
    var dest = thT(st, op[2]);
    if (!el || !dest) break;
    if (inst){ dest.appendChild(el); break; }
    var r1 = thRect(st, el), r2 = thRect(st, dest);
    el.style.width = r1.w + "px"; el.style.left = r1.x + "px"; el.style.top = r1.y + "px";
    el.classList.add("t-carry", "lift");
    st.cam.appendChild(el);
    void el.offsetWidth;
    el.style.transform = "translate(" + (r2.x + 7 - r1.x) + "px," + (r2.y + r2.h - 4 - r1.y) + "px)";
    setTimeout(function(){
      if (!document.contains(el)) return;
      el.classList.remove("t-carry", "lift");
      el.style.cssText = "";
      dest.appendChild(el);
    }, 640);
    break;
  }
}
`;

// ---------------------------------------------------------------------------
// View helpers for demos.mjs — compose realistic mini-UI as strings.
// Every id an op targets is a data-t attribute.
// ---------------------------------------------------------------------------
const dt = (t) => (t ? ` data-t="${t}"` : "");

export const chip = (label, s = "", t = "") =>
  `<span class="t-chip"${s ? ` data-s="${s}"` : ""}${dt(t)}>${label}</span>`;

export const light = (c, t = "") => `<span class="t-light ${c}"${dt(t)}></span>`;

export const tgl = (t = "", on = false) =>
  `<span class="t-tgl${on ? " on" : ""}"${dt(t)}><i></i></span>`;

export const btn = (label, t = "", kind = "") =>
  `<span class="t-btn ${kind}"${dt(t)}>${label}</span>`;

export const kpis = (items, cls = "") =>
  `<div class="t-kpis ${cls}">${items
    .map((k) => `<div class="t-kpi"><div class="k">${k[0]}</div><div class="v"${dt(k[2])}>${k[1]}</div></div>`)
    .join("")}</div>`;

// tbl({t, head:[...], rows, aligns:"llr"}) — td.r for "r". A row is either a
// plain cell array or { c: [...], cls, t } when the tr itself is a cue target.
export const tbl = ({ t = "", head = [], rows = [], aligns = "" }) =>
  `<table class="t-tbl"><thead><tr>${head
    .map((h, i) => `<th${aligns[i] === "r" ? ' style="text-align:right"' : ""}>${h}</th>`)
    .join("")}</tr></thead><tbody${dt(t)}>${rows
    .map((r) => (Array.isArray(r) ? trow(r, aligns) : trow(r.c, aligns, r.cls || "", r.t || "")))
    .join("")}</tbody></table>`;

export const trow = (cells, aligns = "", cls = "", t = "") => {
  const inner = cells.map((c, i) => `<td${aligns[i] === "r" ? ' class="r t-num"' : ""}>${c}</td>`).join("");
  return cls || t ? `<tr class="${cls}"${dt(t)}>${inner}</tr>` : `<tr>${inner}</tr>`;
};
// row op payload: the INNER html of a <tr> (player wraps it)
export const rowCells = (cells, aligns = "") =>
  cells.map((c, i) => `<td${aligns[i] === "r" ? ' class="r t-num"' : ""}>${c}</td>`).join("");

export const card = ({ t = "", name, stat = "", statT = "", rule = "", right = "", cls = "" }) =>
  `<div class="t-card ${cls}"${dt(t)}><div class="t-crow"><div style="min-width:0"><div class="cn">${name}</div>${
    stat ? `<div class="cs"${dt(statT)}>${stat}</div>` : ""
  }</div>${right}</div>${rule ? `<div class="cr">${rule}</div>` : ""}</div>`;

export const win = (title, body, t = "", style = "") =>
  `<div class="t-win"${dt(t)}${style ? ` style="${style}"` : ""}><div class="wh">${title}</div><div class="wb">${body}</div></div>`;

export const ask = (t = "", inner = "") =>
  `<div class="t-ask"><kbd>⌘K</kbd><span class="tx"${dt(t)}>${inner}</span></div>`;

export const life = (nodes) =>
  `<div class="t-life">${nodes
    .map(
      (n) =>
        `<div class="t-node${n.ok ? " ok" : ""}"${dt(n.t)}><span class="trk"><i></i></span><span class="nb"><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></span><span class="nl">${n.l}</span></div>`
    )
    .join("")}</div>`;

export const task = (label, done, t = "") =>
  `<div class="t-task"><span class="t-box${done ? " done" : ""}"${dt(t)}>${done ? "✓" : ""}</span>${label}</div>`;

// Product art — tiny drawn renders (the photo slot). Fixed decorative colors
// on a neutral tile; these read as product photos, not UI, in both themes.
const TILE = '<rect width="48" height="34" fill="#efe9e0"/><ellipse cx="24" cy="31.5" rx="11" ry="1.6" fill="#000" opacity=".07"/>';
export const ART = {
  dress:
    `<svg viewBox="0 0 48 34">${TILE}<path d="M20 5l4 2 4-2 2 5-2.5 2.5L30 29a14 14 0 0 1-12 0l2.5-16.5L18 10z" fill="#c2607e"/><path d="M20 5l4 2 4-2" fill="none" stroke="#8e3f58" stroke-width="1.1"/><path d="M20.5 12.5h7" stroke="#a94a68" stroke-width="1"/></svg>`,
  scarf:
    `<svg viewBox="0 0 48 34">${TILE}<path d="M13 22c4-9 9-13 14-13 4 0 7 2 8 6-6-1-10 1-13 6-2 3-5 4-9 1z" fill="#4f8f8b"/><path d="M14 23c5 2 8 0 10-3" fill="none" stroke="#356663" stroke-width="1.2"/><path d="M33 15l3 7-4 1z" fill="#3f7975"/></svg>`,
  bundle:
    `<svg viewBox="0 0 48 34">${TILE}<rect x="15" y="13" width="18" height="14" rx="1.5" fill="#c9973a"/><rect x="15" y="13" width="18" height="4.5" fill="#b9862c"/><rect x="22.6" y="9" width="2.8" height="18" fill="#8e5f14"/><path d="M24 9c-3-4-8-2-6 1s6-1 6-1zm0 0c3-4 8-2 6 1s-6-1-6-1z" fill="#8e5f14"/></svg>`,
};

export const prod = ({ art, name, price, was = "", t = "" }) =>
  `<div class="t-prod"${dt(t)}><div class="pi">${ART[art]}</div><div class="pn">${name}</div><div class="pp"${dt(t ? t + "-pr" : "")}>${
    was ? `<s>${was}</s>` : ""
  }${price}</div></div>`;

// Phone shells
export const phone = (inner, t = "") =>
  `<div class="t-phone"${dt(t)}><div class="ph-n"><i></i></div><div class="ph-b">${inner}</div></div>`;

export const shopHead = (initials, name, sub) =>
  `<div class="t-shophead"><span class="sa">${initials}</span><div><div class="sn">${name}</div><div class="ss">${sub}</div></div></div>`;

export const shopCard = ({ art, name, price, sizes = "", t = "" }) =>
  `<div class="t-scard"${dt(t)}><div class="si">${ART[art]}</div><div class="sb2"><div class="snm">${name}</div><div class="spr">${price}</div>${
    sizes
      ? `<div class="t-szs">${sizes.split(" ").map((s, i) => `<span class="t-sz"${dt(t ? `${t}-sz${i}` : "")}>${s}</span>`).join("")}</div>`
      : ""
  }<div class="add"${dt(t ? t + "-add" : "")}>Add</div></div></div>`;

export const bubble = (text, url = "", t = "") =>
  `<div class="t-bub"${dt(t)}>${text}${url ? `<span class="lc"><i></i><span class="t-mono">${url}</span></span>` : ""}</div>`;

export const success = (t, line1, line2) =>
  `<div class="t-psuccess"${dt(t)}><span class="ok"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg></span><div class="s1">${line1}</div><div class="s2">${line2}</div></div>`;

export const kanban = (cols) =>
  `<div style="display:flex;gap:8px;align-items:flex-start;justify-content:center">${cols
    .map(
      (c) =>
        `<div class="t-kcol"><div class="kh"><i style="background:${c.dot}"></i>${c.name}</div><div${dt(c.t)}>${(c.cards || [])
          .map((k) => `<div class="t-kcard"${dt(k.t)}>${k.name}${k.sub ? `<div class="kc2">${k.sub}</div>` : ""}</div>`)
          .join("")}</div></div>`
    )
    .join("")}</div>`;

// snav category dot colors (zone language from the figures kit)
export const CAT_COLORS = ["var(--why-b)", "var(--ex-b)", "var(--tip-b)", "var(--note-b)"];

// The OS pointer (S5 grammar: opaque, realistic, drop-shadowed)
export const CURSOR_SVG =
  '<span class="p"><svg width="20" height="22" viewBox="0 0 22 24"><path d="M5.5 3.2 L5.5 20.2 L9.7 16.2 L12.2 21.9 L14.9 20.7 L12.4 15.1 L18.2 15.1 Z" fill="#ffffff" stroke="#1c1c22" stroke-width="1.3" stroke-linejoin="round"/></svg></span>';

// ---------------------------------------------------------------------------
// Stage assembly + cue flattening (called by build.mjs per :::demo block)
// ---------------------------------------------------------------------------
export function buildStage(id, demo, title) {
  const { ws = "Maya's Closet", crumb = "", cat = -1, h = 235, bare = false, center = true, beats } = demo;
  // flatten beats → absolute cue list + caption track
  const caps = [];
  const cues = [];
  let t = 0;
  for (const b of beats) {
    caps.push({ t, cap: b.cap });
    for (const c of b.cues || []) cues.push({ t: t + c[0], op: c.slice(1) });
    t += b.d;
  }
  cues.sort((a, b2) => a.t - b2.t);
  const dur = t;
  const spec = JSON.stringify({ dur, caps, cues }).replace(/</g, "\\u003c");

  const snav = bare
    ? ""
    : `<div class="t-snav" aria-hidden="true">${CAT_COLORS.map(
        (c, i) => `<div class="c${i === cat ? " on" : ""}"><i style="background:${c}"></i></div>`
      ).join("")}</div>`;
  const chrome = bare
    ? ""
    : `<div class="t-chrome" aria-hidden="true"><div class="t-lights"><i></i><i></i><i></i></div><div class="t-ws">${ws} <span>· demo</span></div><div class="t-askpill"><span>Ask anything</span><kbd>⌘K</kbd></div><div class="t-avatar">${ws[0] || "M"}</div></div>`;
  const crumbHtml = crumb ? `<div class="t-crumb"><b>${crumb.split(" · ")[0]}</b>${crumb.includes(" · ") ? " · " + crumb.split(" · ").slice(1).join(" · ") : ""}</div>` : "";

  const mm = Math.floor(dur / 60000);
  const ss = Math.round((dur % 60000) / 1000);
  const durLabel = `${mm}:${String(ss).padStart(2, "0")}`;

  return `<figure class="demo">
  <figcaption><span class="demo-play">▶</span> <strong>${title}</strong><span class="demo-sim">SIMULATED</span><span class="demo-dur">${durLabel}</span></figcaption>
  <div class="t-stage" data-demo="${id}">
    <div class="t-frame">${chrome}<div class="t-viewport" style="height:${h}px"><div class="t-camera"><div class="t-app${bare ? " bare" : ""}">${snav}<div class="t-main${center ? " center" : ""}">${crumbHtml}${demo.html}</div></div><div class="t-cursor" aria-hidden="true">${CURSOR_SVG}</div></div><div class="t-toast" aria-live="polite"></div></div></div>
    <div class="t-capbar"><button class="t-playbtn" aria-label="Pause"><svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="5" height="16" rx="1.2"/><rect x="14" y="4" width="5" height="16" rx="1.2"/></svg></button><span class="t-cap">${beats[0].cap}</span><span class="t-dots" role="group" aria-label="Beats"></span></div>
    <ol class="t-story">${beats.map((b) => `<li>${b.cap}</li>`).join("")}</ol>
    <script type="application/json">${spec}</script>
  </div>
</figure>`;
}
