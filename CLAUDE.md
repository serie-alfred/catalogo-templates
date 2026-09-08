# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product flow

End users open `/gerador` and visually compose an e-commerce theme by drag-and-dropping pre-made components and tweaking visual variables (colors, fonts) that drive the components' appearance. When they finish, they export — the app screenshots desktop+mobile previews and emails the resulting theme configuration as a `config.json` attachment to the team. A developer then feeds that JSON into a separate downstream system that materializes the actual storefront theme. **This repo only produces the catalog UI, the previews, and the JSON; it does not generate the deployed theme itself.**

The catalog components are **mock replicas** of the real platform components. For VTEX, the real components live in the sibling repo `../faststore.starter`, and each VTEX `LayoutItem` in `layoutData.ts` carries a `path` pointing to its counterpart there. See **[docs/CATALOGO-E-FASTSTORE.md](docs/CATALOGO-E-FASTSTORE.md)** for why this catalog exists and how to find a preview component's FastStore reference (used as the source of truth for layout, Swiper config, and styles).

## Commands

Yarn is the canonical package manager (per [README.md](README.md)). A stale `package-lock.json` exists in the repo alongside `yarn.lock` — do not run `npm install` here; if a fresh install is ever needed, delete `package-lock.json` first.

```bash
yarn dev       # next dev
yarn build     # next build (ESLint runs as part of the build — see next.config.ts)
yarn lint      # next lint
yarn start     # next start (production)
```

`package.json` defines `"test": "jest"`, but Jest is not installed and there are no test files in `src/`. Treat the test script as non-functional until a test setup is added.

### Required env vars

`.env.example` lists all of them. The full set used at runtime:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` — used by [src/app/gerador/api/send-email/route.ts](src/app/gerador/api/send-email/route.ts) (Nodemailer; sends the exported layout JSON as an attachment).
- `GOOGLE_FONTS_API_KEY` — used by [src/app/gerador/api/fonts/route.ts](src/app/gerador/api/fonts/route.ts) to proxy the Google Fonts list.
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` — Vercel KV, used by [src/lib/previewStore.ts](src/lib/previewStore.ts) for the shareable preview. Without `KV_REST_API_URL` the store falls back to `.preview-store/` on disk (dev only).
- `CRON_SECRET` — optional; when set, [/api/keep-alive](src/app/api/keep-alive/route.ts) requires `Authorization: Bearer <CRON_SECRET>` from the Vercel cron.

## Architecture

Next.js 15 App Router, React 19, TypeScript strict, CSS Modules + a few globals in [src/styles/](src/styles/). Path alias `@/* → ./src/*`.

### Two route groups, two purposes

- `(home)` — public marketing/showcase page ([src/app/(home)/page.tsx](<src/app/(home)/page.tsx>)). Uses Geist font via `next/font`, loads only `globals.css`.
- `gerador` — the interactive layout-builder tool. Split into two route groups, each with its **own root layout**: `(editor)` ([src/app/gerador/(editor)/page.tsx](<src/app/gerador/(editor)/page.tsx>), URL `/gerador`) loads `templates.css` + `globals.css` + `storefront.css` + `editor-canvas.css` + `editor-tokens.css` (in that order — the dark-mode lock in the last one has to win) and wraps children in `LayoutProvider`; `(frame)` (URL `/gerador/frame-mobile`) is the isolated document rendered inside the preview iframe. Route handlers under `src/app/gerador/api/**` sit outside both groups (they need no layout).
  - **`next/font` is for the CHROME only.** Inter is loaded in the editor layout as `inter.variable` and applied on `.ed-shell`. It must never go on `<body>`: `ExportStage` mounts `ThemeRenderer` in this same document and no template declares its own `font-family`, so the generated class (0,1,0) would beat `body { font-family: var(--font-family) }` (0,0,1) and silently change the typography of the exported PNGs. The **theme** fonts stay runtime-selectable, as before.

The two routes intentionally have separate `layout.tsx` files. Don't unify them.

### The gerador is one big hook + a context

All state for the builder lives in [src/hooks/useLayoutGenerator.ts](src/hooks/useLayoutGenerator.ts) — selections, current platform, focused section, current page (`selectedPage`), the active rail destination (`railTarget`), mobile/desktop toggle, theme colors, fonts, assets, canvas/screenshot refs, section selection (`selectedUid`/`hoveredUid`), the section actions (`moveSection`/`duplicateSection`/`removeSection`), the Wake-token popup state, undo/redo, export logic. [src/context/LayoutContext.tsx](src/context/LayoutContext.tsx) just wraps that hook and exposes it via `useLayout()`. Components inside `gerador/` should consume `useLayout()` rather than receiving these as props.

**Undo/redo** lives in [src/hooks/useThemeHistory.ts](src/hooks/useThemeHistory.ts) and is an _observer_: it never intercepts an action, it serializes the result. The versioned document is `selections` + the 10 colors + the 3 fonts — not UI state, not `platform` (it has its own confirm dialog), not the three assets (2 MB data URLs × 50 entries). Structural changes commit immediately; everything else is debounced 250 ms so a color-picker drag is one entry.

**The seeded context must stay in sync.** [SeededLayoutProvider](src/components/preview/SeededLayoutProvider/index.tsx) forges the context object for `/p` and the iframe with an `as unknown as` cast, so the compiler will NOT catch a field you add to or remove from the hook's return.

### Adding or editing a template

> **Coming from the `faststore.starter` repo?** Run `/from-faststore <Name>` ([.claude/commands/from-faststore.md](.claude/commands/from-faststore.md)) instead of doing the steps below by hand — it generates the preview, converts the SCSS, derives the `variablesSchema`, and registers the component. See [memory/from-faststore.md](memory/from-faststore.md). The manual steps below are the underlying contract.

A template is a React component plus a catalog entry. Two files always need to change together:

1. **Component** — add it under `src/components/templates/{common,home,category,product}/template_N/<Name>/`. The folder convention is `index.tsx` + `index.module.css`. Components receive `{ isMobile }` from [ThemeRenderer](src/components/preview/ThemeRenderer/index.tsx) — the single renderer for every surface. Templates may read **only** `logo` and `selections` from `useLayout()`: outside the editor the context is seeded by hand ([SeededLayoutProvider](src/components/preview/SeededLayoutProvider/index.tsx)), so any other field is a default, not real state.
2. **Registry** — import it in [src/utils/templateRegistry.ts](src/utils/templateRegistry.ts) and add it to the `TemplateRegistry` object. The string key must match the `component` field used in `LAYOUTS`. **If the registry entry is missing, `ThemeRenderer` silently falls back to a placeholder PNG from `/public/images/gerador/`.**
3. **Catalog** — add a `LayoutItem` to the appropriate `LayoutSection` in [src/data/layoutData.ts](src/data/layoutData.ts). `LAYOUTS` is the source of truth for what users can pick. Each item declares `selection` (semantic slot name, drives the special rules below), `pagina` (`common | home | category | product`), `platforms` (`Tray | Wake | VTEX`), and `component` (the `TemplateRegistry` key).

> **Os dois lados saem de sincronia com facilidade, e em silêncio.** Hoje eles estão casados:
> **67 componentes no registry, 67 `LayoutItem`s ativos, zero órfãos dos dois lados** — e o
> `layoutData.ts` não tem mais nenhum item comentado. Foi assim que ficou depois que os 22 órfãos
> (o tema **07 inteiro** incluído) viraram itens de verdade; antes, metade do catálogo estava
> importada e invisível. Confira os dois sentidos antes de commitar:
>
> ```bash
> node -e "const s=require('fs').readFileSync('src/data/layoutData.ts','utf8').replace(/\/\*[\s\S]*?\*\//g,'').replace(/^\s*\/\/.*$/gm,'');
> const act=new Set([...s.matchAll(/component:\s*['\"]([A-Za-z0-9]+)['\"]/g)].map(m=>m[1]));
> const reg=new Set([...require('fs').readFileSync('src/utils/templateRegistry.ts','utf8').matchAll(/^import\s+([A-Z][A-Za-z0-9]+)/gm)].map(m=>m[1]));
> console.log('no registry sem item ativo:',[...reg].filter(x=>!act.has(x)).sort().join(', ')||'nenhum');
> console.log('ativo sem registry (cai no placeholder):',[...act].filter(x=>!reg.has(x)).join(', ')||'nenhum')"
> ```
>
> O `replace` do bloco `/* … */` continua no comando de propósito: é barato e protege contra a
> volta do padrão de deixar item comentado no arquivo.
>
> **Um componente só entra se a origem existir na plataforma que ele declara**, e isso é
> verificável sem subir nada: Tray/Wake resolvem por
> `global-templates/<Tray|Wake>/<Common|Home|Category|Product>/template_<template>/<selection>`
> (o campo `component` **não** participa do caminho), e VTEX resolve o `path` contra
> `../faststore.starter` pelo grafo de `manifest.json`. `Newsletter01` ficou de fora justamente
> por isso: não tem `template_1/newsletter` em nenhuma das duas plataformas, não tem manifest
> próprio, e o mock é sub-componente do `Footer01` (que já o renderiza).

### Per-component variables (`variablesSchema`)

A `LayoutItem` may declare `variablesSchema: ComponentVariable[]` ([src/data/layoutData.ts](src/data/layoutData.ts)) to expose **per-instance** color/font overrides in the gerador. **28 of the 67 active items declare one** — every VTEX-capable Header/Footer/Spot/Showcase plus Breadcrumb01, Categories01, BannerMain01, Ruler01, BannerGrid01, CategoryMain01, CategoryDescription01, ProductDescription01 and ProductInfo01/03. To list them: `grep -c "variablesSchema:" src/data/layoutData.ts`. `Header01` has 9 vars: topbar/header/nav/submenu × bg+text, plus `--header-font`.

- `ComponentVariable = { cssVar, label, type: "color" | "font", default, group?, inheritsLabel? }`. `cssVar` is the literal CSS custom-property name written verbatim into `config.json` (e.g. `--header-topbar-bg`); `default` is the value the downstream SCSS uses as its `var()` fallback; `group` buckets fields in the panel; `inheritsLabel` is the friendly name of the global token shown while the field is still unset.
- **UI:** [ComponentVariablesPanel](src/components/gerador/ComponentVariablesPanel/index.tsx) _is_ the right column of the shell — permanent, not a drawer. It shows the groups of the selected section (colors → `ColorPicker`, fonts → `FontSelector`) and has two empty states, because 39 of the 67 active items declare no schema at all. The inherited state renders as "Usando variável da {inheritsLabel} (clique aqui para alterar)" — that sentence lives in the control, not in the caller. Live preview applies `item.variables` as inline CSS vars on the section wrapper in [ThemeRenderer](src/components/preview/ThemeRenderer/index.tsx).
- **State:** `LayoutSelection.variables?: Record<cssVar, value>` in `useLayoutGenerator` (`setItemVariable`, `resetItemVariables`, `editingUid`); persisted with `selections` under the `layoutSelections` localStorage key.
- **Export:** `pickChangedVariables()` writes ONLY keys whose value differs from the schema `default` (omitted key ⇒ downstream SCSS uses its own `var()` fallback), as a `variables` object on the entry — in both `buildConfigJson` (Tray/Wake) and `buildFaststoreConfigJson` (VTEX).
- Font values are stored as `'Family', sans-serif`; the panel parses the family out for `FontSelector` and re-wraps on change.
- **`FontSelector` never writes to `:root`.** It only loads the face into the current document (the
  one `ExportStage` photographs). Writing there was wrong twice over: the global tokens already come
  from the hook, and per-component `cssVar`s are _not_ unique per instance — setting one Showcase's
  font wrote `--showcase-font` on `:root` and silently applied to every other Showcase.
- `ColorPicker` and `FontSelector` take `variant`: `block` in the left panels (no own label, control
  44px) and `field` in the right panel (label + gap 12, control 41px). Two different boxes in the
  Figma, not a preference.

The downstream **template-generator** reads each entry's `variables` and injects them into the component's SCSS, which must consume them via the chained-fallback convention `var(--header-topbar-bg, var(--background-secundary-color, #122161))` (individual var → global token → hardcoded default). Keep `cssVar` names in sync with that SCSS.

### Selection rules in `toggleSelection`

`useLayoutGenerator.toggleSelection` is not a simple add — it enforces per-`selection` semantics that you must preserve when adding new selection types:

- **`showcase`** — first one is added; clicking the same one again duplicates; clicking a _different_ showcase replaces all existing showcase entries in place (keeping their `pagina`).
- **Singletons** (`category-main`, `category-banner`, `product-description`, `product-info`, `banner-top`, `banner-main`, `category-description`) — at most one per page; selecting a different one replaces in place.
- **`pagina === "common"`** — the code loops `item.pagina.map(...)` to produce one `LayoutSelection` per entry, but in practice **every item in `layoutData.ts` has a single-element `pagina`**, so a `common` item yields exactly ONE row; it's `belongsToPage` that makes it show up on all three pages. Re-selecting the same common item on the same `layoutKey` replaces the existing row.
- Other items — appended, with a `MAX_PER_PAGE` (currently 101) cap per page.

The same `selection` strings drive the duplicate-button blacklist, now in [src/utils/sectionRules.ts](src/utils/sectionRules.ts) (`NON_DUPLICABLE_LAYOUT_KEYS` — singletons can't be duplicated). Update both lists when introducing a new singleton.

### Render order

[previewRender.ts](src/utils/previewRender.ts) is the single source of truth: `selectionsForPage` filters by `selectedPage`, then sorts by `getPriorityOrder` (`header=0, breadcrumb=1, footer=3, everything else=2`). `spot` only renders on the `common` view; `breadcrumb` is hidden on `home`.

`SectionsPanel` does **not** reimplement that order — it splits the rows into three buckets (`order < 2` locked on top, `order === 2` reorderable, `order > 2` locked at the bottom) and puts only the middle bucket in a `SortableContext`. That's why header/breadcrumb/footer have no drag handle (`LOCKED_LAYOUT_KEYS`): the user can never attempt a drag that `getPriorityOrder` would undo. `moveSection` runs `arrayMove` over the indices of the **full `selections` array**, not the filtered one.

Each row is an accordion (Figma). The 24px slot on the left shows the caret at rest — 1:1 with the
design, which draws no drag handle — and swaps it for the grip while the pointer is over the row;
locked rows show a padlock. The three buckets and the `SortableContext` are unchanged.

### The editor shell (redesign, Figma "Versão Final V4")

`/gerador` is a four-column CSS grid in [(editor)/index.module.css](<src/app/gerador/(editor)/index.module.css>):
`75.404px | 344.596px | minmax(0,1fr) | 420px` — rail, left panel, canvas column, right panel.
The centre column is a sub-grid of `64px | minmax(0,1fr)` (topbar, canvas). The floating bottom dock
is gone, and with it `Sidebar/`, `SidebarTabEditTheme`, `PreviewArea` and `styles/gerador.css`.

- **`minmax(0, 1fr)` is load-bearing** in both axes. Plain `1fr` carries `min-width/min-height: auto`,
  and the `<iframe>` (a replaced element with a 300px intrinsic width) would blow the track out and
  push the right panel off screen.
- **The class is `.shell`, not `.main`** — `globals.css` has `.main { padding: 0 15% }`.
- **The iframe height comes from the grid**, not from a `calc()`. It used to be
  `calc(100dvh - 132px)`, where 132 hand-encoded the old dock's padding. Now the canvas row is
  `minmax(0,1fr)` of a `100dvh` shell and `PreviewFrame .host` is `height: 100%`. The invariant is the
  same and stronger: **no term depends on content**. An auto-height iframe makes `vh`/`fixed` resolve
  against the whole page — the original bug, in disguise.
- **`ExportStage` is a sibling of the shell**, which is `overflow: hidden` and would clip the
  off-screen stage at `top/left: -99999px`.
- The rail's width is never declared: `padding: 24px` + the 27.404px mark _are_ the 75.404px.

**One renderer for every surface.** [ThemeRenderer](src/components/preview/ThemeRenderer/index.tsx)
serves `/p`, the editor canvas and the export stage. Its wrappers are bare `div`s **on purpose**: no
`overflow`, no `transform`, no `position` — those clipped megamenus and made the section a containing
block for the Headers' `position: fixed` drawers and for the templates' orphaned absolute
pseudo-elements. Read the comment at the top of [editor-canvas.css](src/styles/editor-canvas.css)
before touching it.

- **Selection chrome adds NOTHING to the wrappers.** The outline is `outline` + `outline-offset: -2px`
  (zero pixel shift), and both the hover label and the green/red action badges are single
  `position: fixed` children of the canvas `<body>`, placed from `getBoundingClientRect()`.
  Green duplicates, red removes; green hides for `NON_DUPLICABLE_LAYOUT_KEYS`, read off the
  `data-layout-key` the wrapper already carries.
- **Event delegation** lives in [useCanvasInteractions](src/hooks/useCanvasInteractions.ts): all
  listeners run in **capture phase** and never `stopPropagation`, so `preventDefault` kills only the
  browser's default action while the template's own handlers still run. It takes `enabled` — the
  effect must not run before `FrameClient` has content, or `rootRef` is still null and it silently
  never attaches.
- **The canvas is an `<iframe>` — in BOTH views** ([PreviewFrame](src/components/gerador/PreviewFrame/index.tsx)
  → `/gerador/frame-mobile`; desktop full width, mobile 375px). This is the load-bearing decision, not
  a nicety: the Headers' mini-carts, drawers and search overlays are `position: fixed` **with
  `calc(100vh - N)` heights**, and in the editor's own document both resolve against the editor
  window. Inside the iframe the viewport **is** the storefront. Switching desktop↔mobile is pure CSS
  on the host — same document, no reload — and the `@container` queries resolve against the real width.
  - The bridge is `postMessage` ([frameMessage.ts](src/types/frameMessage.ts)): `hello`, `theme`
    (coalesced per `requestAnimationFrame`), `content`, `highlight`, `scroll-to` downward; `ready`,
    `select`, `hover`, `shortcut`, `section-action` upward.
  - **The handshake needs BOTH `hello` and `ready`.** The `<iframe>` is in the served HTML, so the
    browser starts fetching the child before the editor bundle finishes hydrating; with a bundle this
    size the child often hydrates _first_ and its `ready` lands on a parent that is not listening yet.
    Whichever side arrives last kicks off the exchange. Dropping either direction brings back a blank
    canvas on first load.
  - Fonts must be injected into the iframe's own document — `loadGoogleFont(family, doc)` in
    [googleFont.ts](src/utils/googleFont.ts), including the per-component fonts parsed out of
    `sel.variables`.
- **Nothing in the left panel may have `transform`, `filter` or `contain`**: it would become the
  containing block of the dnd-kit `DragOverlay` (still portalled to `document.body`) and of the
  ColorPicker popover (portalled for the same reason — the panels are `overflow: auto/clip`).

### Design tokens for the chrome

[src/styles/editor-tokens.css](src/styles/editor-tokens.css) holds the Figma palette under a
**mandatory `--ed-` prefix**: the same `:root` also receives the _store theme_ tokens
(`--background-primary-color`, `--font-primary`…) that `useLayoutGenerator` writes imperatively. Two
vocabularies in one scope — an unprefixed token here would collide with the customer's theme.

The dark-mode lock needs all three parts (`color-scheme: light !important`, the `body` background and
a re-declaration of `--background` inside the media query): `color-scheme` alone does **not** affect
`prefers-color-scheme`, so `globals.css` would keep setting `--background: #0a0a0a`. Same recipe as
[preview.css](src/styles/preview.css). `:focus-visible` is restored scoped to `.ed-shell` with
`!important`, because `globals.css` kills focus with `!important` and is shared with `(home)`, `/p`
and the frame.

### Theming

Colors and fonts in `useLayoutGenerator` are pushed to `:root` as CSS custom properties (`--text-primary-color`, `--secondary-color`, `--tertiary-color`, `--background-primary-color`, `--background-secundary-color`, `--background-tertiary-color`, `--background-footer`, `--text-color-footer`, `--text-color-base`, `--text-color-secundary`, `--font-primary`, `--font-secundary`). Templates **must** read theme values from these variables — do not hardcode colors/fonts in template CSS Modules.

**Three of the ten colors are derived**, not authored: `colorPrimaryText`, `colorSecondaryText` and
`colorTertiary` are recomputed from the luminance of the matching brand background (YIQ, threshold 128) whenever that background changes. They are read-only in the UI and their setters are **not**
exposed on the context — they used to be editable fields whose edits were overwritten on the next
touch of any background. The values still ship in `config.json` and in the preview snapshot.

**Neutrals over a customizable background must derive from the theme text, never a fixed gray.** Muted/secondary text, placeholders, and any border (especially input borders) sit on a background the user can change — a fixed gray (`#6b6b6b`, `#e4e7ea`, a local `--h5-border: #e4e7ea`…) breaks contrast on a dark theme. Write them as `color-mix(in srgb, var(--<section>-text, var(--<global-text>, #hex)) N%, transparent)` (muted text 45–60%, placeholder 48–55%, borders 12–22%) so they follow the theme text automatically. Only translucent overlays, shadows, and non-color values (timings, sizes) stay raw. This is why the local `--h5-*`/`--f4-*`/`--h6-*`/`--f6-*` neutral vars are defined as `color-mix(...)` at the component root (kept byte-identical in the sibling `faststore.starter` SCSS for parity).

Note the typo `--background-secundary-color` (and `--text-color-secundary`, `--font-secundary`) — these are baked into both the hook and the template CSS, so keep the misspelling when adding new variables that reference them.

### Persistence

Selections, platform, colors, fonts and the three assets are mirrored to `localStorage` under keys
`layoutSelections`, `layoutPlatform`, `colors`, `fonts`, `logo`, `favicon`, `ogImage`. The hook
hydrates in a post-mount effect (not in `useState` initializers), gated by `hydrated` so the save
effects don't overwrite storage with defaults first.

**Hydration validates.** `layoutSelections` and `layoutPlatform` go through `sanitizeSelections` /
`sanitizePlatform` ([platformCompat.ts](src/utils/platformCompat.ts)) — the catalog may have changed
between sessions, and `/gerador/import-log` is a third writer of `layoutPlatform` that stores a raw
value.

### Switching platform

`changePlatform` **preserves what is compatible**. It used to be `setSelections([])`: every section on
every page was wiped, variable overrides included, with no warning and no undo. Now
`partitionByPlatform` splits by the item's `platforms`; survivors keep their `uid`, `pagina` and the
very same `variables` object (same item ⇒ same schema ⇒ `pickChangedVariables` still compares against
the same defaults). Losses raise a confirm listing them by name; cancelling changes nothing.
Tray↔Wake never loses anything — their catalogs are identical.

### Export flow

`exportLayout` (the "Baixar" button in the right panel header) does three things in sequence: (1) `await mountExportStage()` — which flips `isCapturing`, mounts [ExportStage](src/components/gerador/ExportStage/index.tsx) off-screen and resolves after two `requestAnimationFrame`s (layout, then paint) — then `await`s `waitForImages` on both copies plus `document.fonts.ready` before `html2canvas`ing the `desktopPreviewRef` (1920px) and `mobilePreviewRef` (375px) divs, downloading PNGs to the user. **Those awaits are load-bearing**: the stage used to be mounted since page load, so images and fonts were long since ready; without them the PNGs come out with blank images and fallback type, and nobody checks the PNG; (2) build a JSON config grouped by `platform → { global, variables, assets, [page]: items[] }`;
(3) **always** download it, and _additionally_ mail it via `/gerador/api/send-email` on
`www.e-temas.com.br` — the button says "Baixar", so it downloads everywhere; the mail is how the
implementation team receives it. When `platform === 'wake'`, the JSON also includes `wakeToken`.
The screenshots are best-effort: a html2canvas failure warns and still delivers the JSON.

Both config shapes carry `assets` (logo, favicon, ogImage). The faststore one had none until this
redesign, so VTEX exports were silently dropping the brand assets.

### Shareable preview (`/p/[id]/[page]`)

Alongside export, the right panel header has a **Pré-visualizar** button ([PreviewButton](src/components/gerador/PreviewButton/index.tsx)) that persists the current theme server-side and returns a short random URL the client can open and navigate like a real site. Three pages share one id: `/p/{id}/home`, `/p/{id}/categoria`, `/p/{id}/produto`, switched via a floating bubble ([PreviewNav](src/components/preview/PreviewNav/index.tsx)).

- **Snapshot**: `useLayoutGenerator.buildPreviewSnapshot()` serializes `{ platform, selections, colors, fonts, logo, favicon, ogImage }` (`PreviewSnapshot` in [src/lib/previewStore.ts](src/lib/previewStore.ts); `ogImage` is optional so older snapshots stay valid); `createPreview()` POSTs it to `/gerador/api/preview` and returns `${origin}/p/{id}/home`.
- **Storage is hybrid** ([previewStore.ts](src/lib/previewStore.ts)): a `fileStore` writes `.preview-store/{id}.json` in dev (zero config, gitignored) and a `kvStore` uses `@vercel/kv` in prod. `getStore()` picks KV when `KV_REST_API_URL` is set. The module is `server-only`; the client hook imports only the **type** (`import type`), so it never bundles it.
- **Rendering reuse**: the page-filter + priority-sort rules live in [src/utils/previewRender.ts](src/utils/previewRender.ts) (`selectionsForPage`, `getPriorityOrder`, `belongsToPage`, `slugToPagina`/`PREVIEW_PAGES`), and `ThemeRenderer` is now literally the same component the editor uses — the two views can't diverge because there is only one.
- **Theme outside the gerador**: [SharedPreview](src/components/preview/SharedPreview/index.tsx) applies the theme vars inline on a wrapper (`buildThemeStyle` in [themeStyle.ts](src/utils/themeStyle.ts), shared with the mobile iframe) plus the Google-font `<link>`s, and wraps children in [SeededLayoutProvider](src/components/preview/SeededLayoutProvider/index.tsx) with `{ logo, selections }` from the snapshot. The preview must NOT run `useLayoutGenerator` (it would hydrate the author's localStorage). The `p` route group has its own `layout.tsx` importing `templates.css` + `globals.css` + `storefront.css` + `preview.css` (no chrome do editor, no `LayoutProvider`).
- **Shared storefront CSS**: [storefront.css](src/styles/storefront.css) holds the two rules that must hold on all three surfaces (`.preview-sticky-header` and the `.preview-template .component__container` 1200px clamp). Document-level rules stay split on purpose — `preview.css` for `/p`, `(frame)/frame.css` for the iframe — because their `color-scheme: light !important` / `background: #fff !important` would repaint the editor's own chrome.
- **Prod requires** a Vercel KV database and env vars `KV_REST_API_URL` / `KV_REST_API_TOKEN`.

### Mobile users

`useIsMobile` short-circuits the gerador to `<DesktopOnlyNotice />` — the builder is desktop-only by design. The mobile _preview_ inside the desktop UI is a separate concept (the `isMobileView` toggle).

## Code style

- Prettier: `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`, `arrowParens: 'avoid'` ([.prettierrc](.prettierrc)).
- ESLint: `@typescript-eslint/no-explicit-any` is `error` (not warn). For plain `.js/.mjs/.cjs` files only, double quotes and semicolons are enforced (different from the `.ts/.tsx` rules — see [eslint.config.mjs](eslint.config.mjs)).
- `next.config.ts` sets `eslint.ignoreDuringBuilds: false`, so a lint failure fails `yarn build`.
