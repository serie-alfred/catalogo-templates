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

`.env.example` only lists SMTP. The full set used at runtime:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` — used by [src/app/gerador/api/send-email/route.ts](src/app/gerador/api/send-email/route.ts) (Nodemailer; sends the exported layout JSON as an attachment).
- `GOOGLE_FONTS_API_KEY` — used by [src/app/gerador/api/fonts/route.ts](src/app/gerador/api/fonts/route.ts) to proxy the Google Fonts list.

## Architecture

Next.js 15 App Router, React 19, TypeScript strict, CSS Modules + a few globals in [src/styles/](src/styles/). Path alias `@/* → ./src/*`.

### Two route groups, two purposes

- `(home)` — public marketing/showcase page ([src/app/(home)/page.tsx](<src/app/(home)/page.tsx>)). Uses Geist font via `next/font`, loads only `globals.css`.
- `gerador` — the interactive layout-builder tool. Split into two route groups, each with its **own root layout**: `(editor)` ([src/app/gerador/(editor)/page.tsx](<src/app/gerador/(editor)/page.tsx>), URL `/gerador`) loads `gerador.css` + `templates.css` + `globals.css` + `storefront.css` + `editor-canvas.css` and wraps children in `LayoutProvider`; `(frame)` (URL `/gerador/frame-mobile`) is the isolated document rendered inside the mobile-preview iframe. **No `next/font`** here — fonts are user-selectable at runtime. Route handlers under `src/app/gerador/api/**` sit outside both groups (they need no layout).

The two routes intentionally have separate `layout.tsx` files. Don't unify them.

### The gerador is one big hook + a context

All state for the builder lives in [src/hooks/useLayoutGenerator.ts](src/hooks/useLayoutGenerator.ts) — selections, current platform, focused section, current page (`selectedPage`), mobile/desktop toggle, theme colors, fonts, canvas/screenshot refs, section selection (`selectedUid`/`hoveredUid`), the section actions (`moveSection`/`duplicateSection`/`removeSection`), the Wake-token popup state, export logic. [src/context/LayoutContext.tsx](src/context/LayoutContext.tsx) just wraps that hook and exposes it via `useLayout()`. Components inside `gerador/` should consume `useLayout()` rather than receiving these as props.

There is also a near-empty [src/context/LayoutProviders.client.tsx](src/context/LayoutProviders.client.tsx) that re-wraps the same provider; nothing imports it. Prefer `LayoutContext.tsx` directly.

### Adding or editing a template

> **Coming from the `faststore.starter` repo?** Run `/from-faststore <Name>` ([.claude/commands/from-faststore.md](.claude/commands/from-faststore.md)) instead of doing the steps below by hand — it generates the preview, converts the SCSS, derives the `variablesSchema`, and registers the component. See [memory/from-faststore.md](memory/from-faststore.md). The manual steps below are the underlying contract.

A template is a React component plus a catalog entry. Two files always need to change together:

1. **Component** — add it under `src/components/templates/{common,home,category,product}/template_N/<Name>/`. The folder convention is `index.tsx` + `index.module.css`. Components receive `{ isMobile }` from [ThemeRenderer](src/components/preview/ThemeRenderer/index.tsx) — the single renderer for every surface. Templates may read **only** `logo` and `selections` from `useLayout()`: outside the editor the context is seeded by hand ([SeededLayoutProvider](src/components/preview/SeededLayoutProvider/index.tsx)), so any other field is a default, not real state.
2. **Registry** — import it in [src/utils/templateRegistry.ts](src/utils/templateRegistry.ts) and add it to the `TemplateRegistry` object. The string key must match the `component` field used in `LAYOUTS`. **If the registry entry is missing, `ThemeRenderer` silently falls back to a placeholder PNG from `/public/images/gerador/`.**
3. **Catalog** — add a `LayoutItem` to the appropriate `LayoutSection` in [src/data/layoutData.ts](src/data/layoutData.ts). `LAYOUTS` is the source of truth for what users can pick. Each item declares `selection` (semantic slot name, drives the special rules below), `pagina` (`common | home | category | product`), `platforms` (`Tray | Wake`), and `component` (the `TemplateRegistry` key).

### Per-component variables (`variablesSchema`)

A `LayoutItem` may declare `variablesSchema: ComponentVariable[]` ([src/data/layoutData.ts](src/data/layoutData.ts)) to expose **per-instance** color/font overrides in the gerador. **Only `Header01` (id `"01"`) has one so far** — 9 vars: topbar/header/nav/submenu × bg+text, plus `--header-font`.

- `ComponentVariable = { cssVar, label, type: "color" | "font", default, group?, inheritsLabel? }`. `cssVar` is the literal CSS custom-property name written verbatim into `config.json` (e.g. `--header-topbar-bg`); `default` is the value the downstream SCSS uses as its `var()` fallback; `group` buckets fields in the panel; `inheritsLabel` is the friendly name of the global token shown while the field is still unset.
- **UI:** the pencil/"Editar" button and the [ComponentVariablesPanel](src/components/gerador/ComponentVariablesPanel/index.tsx) right-side drawer appear only when `variablesSchema` is non-empty (colors → `ColorPicker`, fonts → `FontSelector`). Live preview applies `item.variables` as inline CSS vars on the wrapper in `DraggablePreviewList` (drawer has no dark overlay so the preview stays visible).
- **State:** `LayoutSelection.variables?: Record<cssVar, value>` in `useLayoutGenerator` (`setItemVariable`, `resetItemVariables`, `editingUid`); persisted with `selections` under the `layoutSelections` localStorage key.
- **Export:** `pickChangedVariables()` writes ONLY keys whose value differs from the schema `default` (omitted key ⇒ downstream SCSS uses its own `var()` fallback), as a `variables` object on the entry — in both `buildConfigJson` (Tray/Wake) and `buildFaststoreConfigJson` (VTEX).
- Font values are stored as `'Family', sans-serif`; the panel parses the family out for `FontSelector` and re-wraps on change.

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

### The editor canvas is fully interactive (Shopify model)

The `/gerador` canvas renders the theme **exactly like `/p`** — Swipers drag, hovers open megamenus, clicks work. There is no edit/navigate mode toggle. Editing lives in a left-hand [SectionsPanel](src/components/gerador/SectionsPanel/index.tsx); drag-and-drop happens on rows of text there, never on the canvas. Removing dnd from the canvas is what allowed the old `pointer-events: none` to go away.

- **One renderer for every surface.** [ThemeRenderer](src/components/preview/ThemeRenderer/index.tsx) serves `/p`, the editor canvas ([ThemeCanvas](src/components/gerador/ThemeCanvas/index.tsx)), the mobile iframe and the export stage. `SortableItem` and `DraggablePreviewList` are gone. Its wrappers are bare `div`s **on purpose**: no `overflow`, no `transform`, no `will-change` — those clipped megamenus and made the section a containing block for the Headers' `position: fixed` drawers.
- **Hover/selection chrome is `outline` + `position: relative`** ([editor-canvas.css](src/styles/editor-canvas.css)), never `border` or `transform`. `outline` with `outline-offset: -2px` doesn't participate in layout (zero pixel shift), and `position: relative` does **not** create a containing block for `fixed`. Read the comment at the top of that file before changing it.
- **Event delegation** lives in [useCanvasInteractions](src/hooks/useCanvasInteractions.ts): all listeners run in **capture phase** and never `stopPropagation`, so `preventDefault` kills only the browser's default action while the template's own handlers still run. `<a href>`, `auxclick`, `submit` and `dragstart` are neutralized; `pointerdown`/`mousedown`/`touchstart` are untouched (the Swiper gesture depends on them). `<a>` without `href` (used as a button in several templates) is deliberately left alone. Hover is written straight to the DOM as `data-hovered` — it's too high-frequency for React state.
- **Mobile view is an `<iframe>`** at 375px ([MobileFrame](src/components/gerador/MobileFrame/index.tsx) → `/gerador/frame-mobile`), because mobile drawers/mini-carts are `position: fixed` and escaped the old 400px div to cover the whole editor. The `(frame)` route group has its own root layout (no `gerador.css`, no `LayoutProvider`). The bridge is `postMessage` ([frameMessage.ts](src/types/frameMessage.ts)) with two separate messages: `theme` (coalesced per `requestAnimationFrame`, so a color-picker keystroke re-renders one `<div style>` and the memoized `ThemeRenderer` bails out) and `content` (carries the large `logo` data-URL, rarely changes). **The child announces `ready`** — the iframe's `load` fires before React hydrates, so a parent-first message would be lost. The iframe stays mounted (hidden) in desktop view: remounting would reload the document, refetch fonts and lose Swiper/drawer state.
- **Fonts must be injected into the iframe's own document** — `loadGoogleFont(family, doc)` in [googleFont.ts](src/utils/googleFont.ts), including the per-component fonts parsed out of `sel.variables`. Skipping that silently falls back (e.g. `Header01`'s Manrope).
- **The export stage is mounted on demand** ([ExportStage](src/components/gerador/ExportStage/index.tsx), gated by `isCapturing`) instead of living in the DOM permanently — it used to mount every template a third time. It's rendered as a sibling of `<main>`, not inside it, because `.preview-area` is `position: relative` + `overflow-y: auto` and would clip it.
- **Two accepted limitations.** (1) The 320px panel narrows the canvas to ~1044px on a 1440 screen, so `container-type: inline-size` (which lives in each template's shell) resolves one breakpoint below `/p`. Do **not** "fix" this with `transform: scale()` — that reintroduces the `fixed` containing block. (2) A desktop drawer covers the whole window, panel and dock included. Both are solved by putting the desktop canvas in an iframe too, which is deliberately not done yet.

### Theming

Colors and fonts in `useLayoutGenerator` are pushed to `:root` as CSS custom properties (`--text-primary-color`, `--secondary-color`, `--tertiary-color`, `--background-primary-color`, `--background-secundary-color`, `--background-tertiary-color`, `--background-footer`, `--text-color-footer`, `--text-color-base`, `--text-color-secundary`, `--font-primary`, `--font-secundary`). Templates **must** read theme values from these variables — do not hardcode colors/fonts in template CSS Modules. `--text-color-base` and `--text-color-secundary` are auto-derived from background luminance; don't try to set them directly.

**Neutrals over a customizable background must derive from the theme text, never a fixed gray.** Muted/secondary text, placeholders, and any border (especially input borders) sit on a background the user can change — a fixed gray (`#6b6b6b`, `#e4e7ea`, a local `--h5-border: #e4e7ea`…) breaks contrast on a dark theme. Write them as `color-mix(in srgb, var(--<section>-text, var(--<global-text>, #hex)) N%, transparent)` (muted text 45–60%, placeholder 48–55%, borders 12–22%) so they follow the theme text automatically. Only translucent overlays, shadows, and non-color values (timings, sizes) stay raw. This is why the local `--h5-*`/`--f4-*`/`--h6-*`/`--f6-*` neutral vars are defined as `color-mix(...)` at the component root (kept byte-identical in the sibling `faststore.starter` SCSS for parity).

Note the typo `--background-secundary-color` (and `--text-color-secundary`, `--font-secundary`) — these are baked into both the hook and the template CSS, so keep the misspelling when adding new variables that reference them.

### Persistence

Selections, platform, colors, and fonts are mirrored to `localStorage` under keys `layoutSelections`, `layoutPlatform`, `colors`, `fonts`. The hook hydrates from these on mount via `useState` initializers (guarded for SSR).

### Export flow

`exportLayout` (called from the Sidebar) does three things in sequence: (1) `await mountExportStage()` — which flips `isCapturing`, mounts [ExportStage](src/components/gerador/ExportStage/index.tsx) off-screen and resolves after two `requestAnimationFrame`s (layout, then paint) — then `await`s `waitForImages` on both copies plus `document.fonts.ready` before `html2canvas`ing the `desktopPreviewRef` (1920px) and `mobilePreviewRef` (375px) divs, downloading PNGs to the user. **Those awaits are load-bearing**: the stage used to be mounted since page load, so images and fonts were long since ready; without them the PNGs come out with blank images and fallback type, and nobody checks the PNG; (2) build a JSON config grouped by `platform → { global, variables, [page]: items[] }`; (3) POST it to `/gerador/api/send-email` which mails it as `config.json`. When `platform === 'wake'`, the JSON also includes `wakeToken` from the `WakePopup` input.

### Shareable preview (`/p/[id]/[page]`)

Alongside export, the Sidebar has a **Preview** button ([PreviewButton](src/components/gerador/PreviewButton/index.tsx), next to Export in [SidebarIcons](src/components/gerador/Sidebar/SidebarIcons/index.tsx)) that persists the current theme server-side and returns a short random URL the client can open and navigate like a real site. Three pages share one id: `/p/{id}/home`, `/p/{id}/categoria`, `/p/{id}/produto`, switched via a floating bubble ([PreviewNav](src/components/preview/PreviewNav/index.tsx)).

- **Snapshot**: `useLayoutGenerator.buildPreviewSnapshot()` serializes `{ platform, selections, colors, fonts, logo, favicon }` (`PreviewSnapshot` in [src/lib/previewStore.ts](src/lib/previewStore.ts)); `createPreview()` POSTs it to `/gerador/api/preview` and returns `${origin}/p/{id}/home`.
- **Storage is hybrid** ([previewStore.ts](src/lib/previewStore.ts)): a `fileStore` writes `.preview-store/{id}.json` in dev (zero config, gitignored) and a `kvStore` uses `@vercel/kv` in prod. `getStore()` picks KV when `KV_REST_API_URL` is set. The module is `server-only`; the client hook imports only the **type** (`import type`), so it never bundles it.
- **Rendering reuse**: the page-filter + priority-sort rules live in [src/utils/previewRender.ts](src/utils/previewRender.ts) (`selectionsForPage`, `getPriorityOrder`, `belongsToPage`, `slugToPagina`/`PREVIEW_PAGES`), and `ThemeRenderer` is now literally the same component the editor uses — the two views can't diverge because there is only one.
- **Theme outside the gerador**: [SharedPreview](src/components/preview/SharedPreview/index.tsx) applies the theme vars inline on a wrapper (`buildThemeStyle` in [themeStyle.ts](src/utils/themeStyle.ts), shared with the mobile iframe) plus the Google-font `<link>`s, and wraps children in [SeededLayoutProvider](src/components/preview/SeededLayoutProvider/index.tsx) with `{ logo, selections }` from the snapshot. The preview must NOT run `useLayoutGenerator` (it would hydrate the author's localStorage). The `p` route group has its own `layout.tsx` importing `templates.css` + `globals.css` + `storefront.css` + `preview.css` (no `gerador.css`, no `LayoutProvider`).
- **Shared storefront CSS**: [storefront.css](src/styles/storefront.css) holds the two rules that must hold on all three surfaces (`.preview-sticky-header` and the `.preview-template .component__container` 1200px clamp). Document-level rules stay split on purpose — `preview.css` for `/p`, `(frame)/frame.css` for the iframe — because their `color-scheme: light !important` / `background: #fff !important` would repaint the editor's own chrome.
- **Prod requires** a Vercel KV database and env vars `KV_REST_API_URL` / `KV_REST_API_TOKEN`.

### Mobile users

`useIsMobile` short-circuits the gerador to `<DesktopOnlyNotice />` — the builder is desktop-only by design. The mobile _preview_ inside the desktop UI is a separate concept (the `isMobileView` toggle).

## Code style

- Prettier: `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`, `arrowParens: 'avoid'` ([.prettierrc](.prettierrc)).
- ESLint: `@typescript-eslint/no-explicit-any` is `error` (not warn). For plain `.js/.mjs/.cjs` files only, double quotes and semicolons are enforced (different from the `.ts/.tsx` rules — see [eslint.config.mjs](eslint.config.mjs)).
- `next.config.ts` sets `eslint.ignoreDuringBuilds: false`, so a lint failure fails `yarn build`.
