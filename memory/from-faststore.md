---
name: from-faststore
description: The /from-faststore command ingests a FastStore component from the sibling .starter repo into the catalog preview (registry + layoutData + derived variablesSchema)
metadata:
  type: project
---

`/from-faststore <Name>` (`.claude/commands/from-faststore.md`) is the downstream pair of the `.starter`'s `/to-faststore`. It takes a VTEX FastStore component from `../faststore.starter/src/components/<kind>/<Name>/` and produces the catalog **preview**: a React component with FIXED data (no VTEX/GraphQL/hooks), a flat `index.module.css`, a `TemplateRegistry` entry, and a `layoutData.ts` `LayoutItem`.

Key behaviors:
- **Color gate (precondition):** it derives the `variablesSchema` by regex over the source SCSS, matching the two-level chain `var(--<section>-<role>, var(--<global>, <default>))`. If the component still uses a hardcoded local palette (`--f4-*`, `--h4-*`) instead of the chain, it ABORTS the schema derivation and points back to the `.starter` standardization — never invents cssVars the SCSS doesn't consume. So a component must already follow the `.starter` chained-fallback convention before ingestion. See [[per-component-variables]].
- **Derivation:** G1=cssVar → schema `cssVar`; G2=global token → `inheritsLabel` (fixed table, typos preserved); G3=default → `default` (must stay byte-identical so `pickChangedVariables` diffs correctly); `type` is font/color by G2 + default shape; `label`/`group` are PT-BR heuristics confirmed by the dev.
- **SCSS→CSS:** inverts `/to-faststore` (de-nests, resolves `&`, lifts `@media`, strips `$`/`@mixin`/SCSS functions), keeps `var(--…)` verbatim.
- **Registration:** `templateRegistry.ts` (key = `component`) + `layoutData.ts` (unique 12-char `key`, `path` required for VTEX, `platforms` includes `'VTEX'`, `backgroundVars` from the global bg tokens used).

Note: some legacy `template_4` preview stubs (`common/template_4/{Footer,Header}`) predate this and don't match the `.starter` MANU designs — overwrite them via the command when ingesting the real `.starter` component.
