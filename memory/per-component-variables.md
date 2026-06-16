---
name: per-component-variables
description: How per-component color/font overrides work in the gerador (variablesSchema → config.json variables)
metadata:
  type: project
---

The gerador supports per-instance color/font overrides written into each config.json entry as a `variables` object (keys are literal CSS custom-property names like `--header-topbar-bg`, applied verbatim by the downstream template-generator).

**To add this to a new component:**
1. Add `variablesSchema: ComponentVariable[]` to its `LayoutItem` in `src/data/layoutData.ts` (only Header01 / id "01" has one so far). The pencil "Editar" button + side panel only appear when this exists and is non-empty.
2. In the component's CSS Module, swap the global tokens for the individual `--component-*` vars using the **chained fallback** convention so defaults never regress:
   `var(--header-topbar-bg, var(--background-secundary-color, #122161))` — individual var wins; else the existing global token; else the hardcoded default.
3. State/setters live in `useLayoutGenerator` (`setItemVariable`, `resetItemVariables`, `editingUid`); persistence rides along with `selections` in localStorage automatically.
4. Config injection: `pickChangedVariables()` includes ONLY keys whose value differs from the schema default, in both `buildConfigJson` (Tray/Wake) and `buildFaststoreConfigJson` (VTEX).

Panel: `src/components/gerador/ComponentVariablesPanel` (right-side drawer, no dark overlay so live preview stays visible). Live preview = `item.variables` applied as inline CSS vars on the wrapper in `DraggablePreviewList`.

Font values are stored as `'Family', sans-serif`; the panel parses the family out for `FontSelector` and re-wraps on change.
