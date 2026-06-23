---
name: per-component-variables
description: How per-component color/font overrides work in the gerador (variablesSchema → config.json variables)
metadata:
  type: project
---

The gerador supports per-instance color/font overrides written into each config.json entry as a `variables` object (keys are literal CSS custom-property names like `--header-topbar-bg`, applied verbatim by the downstream template-generator).

**To add this to a new component:**
1. Add `variablesSchema: ComponentVariable[]` to its `LayoutItem` in `src/data/layoutData.ts` (Header01, Breadcrumb01, the Spot cards Spot01/Spot03/Spot04/Spot05, and the Showcases Showcase01/Showcase03/Showcase04/Showcase05 have one). The pencil "Editar" button + side panel only appear when this exists and is non-empty.
   - **Spot cards (`--spot-*`) shared namespace:** `--spot-btn-bg`/`--spot-btn-text` (CTA/size button → secundary), `--spot-tag-bg`/`--spot-tag-text` (discount tag → tertiary), `--spot-font` (→ font-secundary). Defaults per card stay byte-identical to each card's original hex (the Level-3 fallback). Sourced from `repo-temp-faststore` ProductCard0N via `/from-faststore`. **Text/title and price colors are intentionally NOT themeable** — name/price stay a fixed hex per card (03/04 `#292929`/`#141414`; Spot05 price is a fixed `#0096fe` accent). Don't reintroduce `--spot-text`/`--spot-price`.
   - **Showcases/vitrines (`--showcase-*`) shared namespace:** `--showcase-title-color` (title → text-primary), `--showcase-font` (title font → font-secundary, except Showcase01 which uses font-primary/Manrope), `--showcase-accent` (active carousel dot → background-primary). Default accent per template matches its design (Showcase03 `#000000`, 04 `#e40101`, 05 `#0096fe`). Sourced from `repo-temp-faststore` ProductShelfCustom0N. **Catalog previews simulate the carousel** (static dots + arrows, no click); columns-per-view are driven by `@container` (container-type on `.shelf`/`.home__showcase`), but the spots rendered are dynamic from the user's `selection`s (`layoutKey === 'spot'`), not chosen by the showcase.
2. In the component's CSS Module, swap the global tokens for the individual `--component-*` vars using the **chained fallback** convention so defaults never regress:
   `var(--header-topbar-bg, var(--background-secundary-color, #122161))` — individual var wins; else the existing global token; else the hardcoded default.
3. State/setters live in `useLayoutGenerator` (`setItemVariable`, `resetItemVariables`, `editingUid`); persistence rides along with `selections` in localStorage automatically.
4. Config injection: `pickChangedVariables()` includes ONLY keys whose value differs from the schema default, in both `buildConfigJson` (Tray/Wake) and `buildFaststoreConfigJson` (VTEX).

Panel: `src/components/gerador/ComponentVariablesPanel` (right-side drawer, no dark overlay so live preview stays visible). Live preview = `item.variables` applied as inline CSS vars on the wrapper in `DraggablePreviewList`.

Font values are stored as `'Family', sans-serif`; the panel parses the family out for `FontSelector` and re-wraps on change.
