---
name: from-faststore
description: The /from-faststore command ingests a FastStore component from the sibling .starter repo into the catalog preview (registry + layoutData + derived variablesSchema)
metadata:
  type: project
---

`/from-faststore <Name>` (`.claude/commands/from-faststore.md`) is the downstream pair of the `.starter`'s `/to-faststore`. It takes a VTEX FastStore component from `../faststore.starter/src/components/<kind>/<Name>/` and produces the catalog **preview**: a React component with FIXED data (no VTEX/GraphQL/hooks), a flat `index.module.css`, a `TemplateRegistry` entry, and a `layoutData.ts` `LayoutItem`.

The command bakes in the standing prompt so you don't repeat it: dynamic→fixed coherent data, **expose ALL component-scoped style vars**, inline the **whole dependency graph in ONE file** (recreate `@faststore/ui` markup statically), mirror the sibling slot's structure, auto-number `template_N`, and prefer the **organism** (placeable block) over a half-block molecule.

Key behaviors:
- **Two derivation modes (no abort on single-level):** read the source SCSS (+ all deps). **Mode A — inheritance (2-level):** `var(--<sec>-<role>, var(--<global>, <default>))` → schema WITH `inheritsLabel` + `backgroundVars` (Footer/Header/Spot/Showcase base). **Mode B — faithful (1-level):** `var(--<comp>-X, <default>)` (author chose local defaults, no brand inheritance) → faithful schema, byte-identical default, OMIT `inheritsLabel`, `backgroundVars: []`, DON'T touch `.starter`. ProductInfo03 (`organisms/ProductDetails02`) is Mode B. Expose every component-scoped var the SCSS consumes; never invent vars it doesn't. Only STOP-and-ask when a themeable zone uses a **raw hex/rgba or catalog-internal token** (`--paper`/`--ink`/`--accent`/`--font-body`/`--font-display`) outside any var. See [[per-component-variables]].
- **Derivation fields:** cssVar→`cssVar`; default (A=G3 / B=G2) byte-identical so `pickChangedVariables` diffs; `type` font/color by global token + default shape; `inheritsLabel` only in Mode A (fixed table, typos preserved); `label`/`group` PT-BR heuristics confirmed by the dev. `rgba(…)` defaults stay rgba.
- **Numbering & path:** `template_N`/`id`/suffix = next free number of the catalog **slot** (NOT the FastStore suffix — `ProductDetails02` → `template_3`/`ProductInfo03`); folder = slot family name (`ProductInfo`); `component` = registry key; `path` = the migrated component's `manifest.id` (the organism for placeable blocks), may differ from `component`.
- **SCSS→CSS:** inverts `/to-faststore` (de-nests, resolves `&`, `@media`→`@container`, strips `$`/`@mixin`/SCSS functions), keeps `var(--…)` verbatim. **Reset fix:** `<button>`/`<li>`/`<ul>` needing own bg/border/list-style must be prefixed with the component root class (e.g. `.productDetails .addToCart`) to beat `.preview__area …` reset `(0,1,1)` — no `!important`.
- **Registration:** `templateRegistry.ts` (key = `component`) + `layoutData.ts` (unique 12-char `key`, `path` required for VTEX, `platforms` includes `'VTEX'`, `backgroundVars`).

Note: some legacy `template_4` preview stubs (`common/template_4/{Footer,Header}`) predate this and don't match the `.starter` MANU designs — overwrite them via the command when ingesting the real `.starter` component.
