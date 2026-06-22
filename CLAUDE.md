# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product flow

End users open `/gerador` and visually compose an e-commerce theme by drag-and-dropping pre-made components and tweaking visual variables (colors, fonts) that drive the components' appearance. When they finish, they export — the app screenshots desktop+mobile previews and emails the resulting theme configuration as a `config.json` attachment to the team. A developer then feeds that JSON into a separate downstream system that materializes the actual storefront theme. **This repo only produces the catalog UI, the previews, and the JSON; it does not generate the deployed theme itself.**

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
- `gerador` — the interactive layout-builder tool ([src/app/gerador/page.tsx](src/app/gerador/page.tsx)). Loads `gerador.css` + `templates.css` + `globals.css` and wraps children in `LayoutProvider`. **No `next/font`** here — fonts are user-selectable at runtime.

The two routes intentionally have separate `layout.tsx` files. Don't unify them.

### The gerador is one big hook + a context

All state for the builder lives in [src/hooks/useLayoutGenerator.ts](src/hooks/useLayoutGenerator.ts) — selections, current platform, focused section, mobile/desktop toggle, theme colors, fonts, screenshot refs, the Wake-token popup state, export logic. [src/context/LayoutContext.tsx](src/context/LayoutContext.tsx) just wraps that hook and exposes it via `useLayout()`. Components inside `gerador/` should consume `useLayout()` rather than receiving these as props.

There is also a near-empty [src/context/LayoutProviders.client.tsx](src/context/LayoutProviders.client.tsx) that re-wraps the same provider; nothing imports it. Prefer `LayoutContext.tsx` directly.

### Adding or editing a template

> **Coming from the `faststore.starter` repo?** Run `/from-faststore <Name>` ([.claude/commands/from-faststore.md](.claude/commands/from-faststore.md)) instead of doing the steps below by hand — it generates the preview, converts the SCSS, derives the `variablesSchema`, and registers the component. See [memory/from-faststore.md](memory/from-faststore.md). The manual steps below are the underlying contract.

A template is a React component plus a catalog entry. Two files always need to change together:

1. **Component** — add it under `src/components/templates/{common,home,category,product}/template_N/<Name>/`. The folder convention is `index.tsx` + `index.module.css`. Components receive `{ isMobile }` from the renderer (see [src/components/gerador/SortableItem/index.tsx:50](src/components/gerador/SortableItem/index.tsx#L50)).
2. **Registry** — import it in [src/utils/templateRegistry.ts](src/utils/templateRegistry.ts) and add it to the `TemplateRegistry` object. The string key must match the `component` field used in `LAYOUTS`. **If the registry entry is missing, `SortableItem` silently falls back to a placeholder PNG from `/public/images/gerador/`.**
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
- **`pagina === "common"`** — one selection produces multiple `LayoutSelection` rows, one per page in `item.pagina`. Re-selecting the same common item on the same `layoutKey` replaces the existing row.
- Other items — appended, with a `MAX_PER_PAGE` (currently 101) cap per page.

The same `selection` strings drive the duplicate-button blacklist in [src/components/gerador/DraggablePreviewList/index.tsx](src/components/gerador/DraggablePreviewList/index.tsx) (singletons can't be duplicated). Update both lists when introducing a new singleton.

### Render order

`DraggablePreviewList` filters by `selectedPage`, then sorts by `getPriorityOrder`: `header=0, breadcrumb=1, footer=3, everything else=2`. Drag-and-drop reorders within that. `spot` only renders on the `common` view; `breadcrumb` is hidden on `home`.

### Theming

Colors and fonts in `useLayoutGenerator` are pushed to `:root` as CSS custom properties (`--text-primary-color`, `--secondary-color`, `--tertiary-color`, `--background-primary-color`, `--background-secundary-color`, `--background-tertiary-color`, `--background-footer`, `--text-color-footer`, `--text-color-base`, `--text-color-secundary`, `--font-primary`, `--font-secundary`). Templates **must** read theme values from these variables — do not hardcode colors/fonts in template CSS Modules. `--text-color-base` and `--text-color-secundary` are auto-derived from background luminance; don't try to set them directly.

Note the typo `--background-secundary-color` (and `--text-color-secundary`, `--font-secundary`) — these are baked into both the hook and the template CSS, so keep the misspelling when adding new variables that reference them.

### Persistence

Selections, platform, colors, and fonts are mirrored to `localStorage` under keys `layoutSelections`, `layoutPlatform`, `colors`, `fonts`. The hook hydrates from these on mount via `useState` initializers (guarded for SSR).

### Export flow

`exportLayout` (called from the Sidebar) does three things in sequence: (1) `html2canvas` the hidden `desktopPreviewRef` (1920px) and `mobilePreviewRef` (375px) divs that `PreviewArea` renders off-screen, downloading PNGs to the user; (2) build a JSON config grouped by `platform → { global, variables, [page]: items[] }`; (3) POST it to `/gerador/api/send-email` which mails it as `config.json`. When `platform === 'wake'`, the JSON also includes `wakeToken` from the `WakePopup` input.

### Mobile users

`useIsMobile` short-circuits the gerador to `<DesktopOnlyNotice />` — the builder is desktop-only by design. The mobile _preview_ inside the desktop UI is a separate concept (the `isMobileView` toggle).

## Code style

- Prettier: `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`, `arrowParens: 'avoid'` ([.prettierrc](.prettierrc)).
- ESLint: `@typescript-eslint/no-explicit-any` is `error` (not warn). For plain `.js/.mjs/.cjs` files only, double quotes and semicolons are enforced (different from the `.ts/.tsx` rules — see [eslint.config.mjs](eslint.config.mjs)).
- `next.config.ts` sets `eslint.ignoreDuringBuilds: false`, so a lint failure fails `yarn build`.
