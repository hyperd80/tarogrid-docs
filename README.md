# tarogrid-docs

The content source for the **TaroGrid Help Center** — one source that will publish to five surfaces: the public help site, the in-app help panel, the Academy, the interactive tours, and the onboarding layer.

**Constitution:** the master plan (`Help Center/TAROGRID_HELP_CENTER_MASTER_PLAN.md` in the owner's workspace) — Parts 1–3 define the voice, the article template, and the sitemap. Every article follows them.

## Layout

```
content/            the articles — markdown + frontmatter, one file per article
  00-start-here/    Chapter 0 (W-…)
  01-core-ideas/    Chapter 1 (C-…)
meta/
  chapters.json     chapter order, titles, blurbs
  synonyms.json     search synonym map (English / বাংলা / Banglish)
tools/build.mjs     builder → site/
tracker/            the production tracker (import into a TaroGrid board)
site/               generated output (not committed)
```

## Article format

Frontmatter carries the §2.3 metadata (`id · title · promise · tier · chapter · status · keywords · tour · related`). The body is markdown plus two extensions:

- `:::demo id · "Title" · 20s` … `:::` — the animation storyboard (becomes the in-app Tour Spec)
- `:::why Title` … `:::` — callouts; types: `note · tip · warning · why · example · shortcut`
- fenced ` ```diagram ` blocks — hand-drawn-style ASCII diagrams

Status values: `live ✅ · soon 🔜 · pro 💠 · beta 🧪`.

## Build

```
npm install
node tools/build.mjs
```

Outputs: `site/index.html` (self-contained reader — open it anywhere), `site/articles.json` (the future in-app help bundle), `site/artifact.html` (hosted-preview variant).

## Rules that keep these docs honest

- Nothing unshipped is documented as shipped — roadmap items are 🔜 stubs.
- Bold **UI labels** must match the app's strings (linted against the app per release, from R5 on).
- Every product ship lists affected article IDs (app repo `CHANGE_PROTOCOL.md` §11); the docs update merges before the ship is done.
