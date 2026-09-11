---
name: from-faststore
description: The /from-faststore command ingests a FastStore component from the sibling .starter repo into the catalog preview (registry + layoutData + derived variablesSchema)
metadata:
  type: project
---

`/from-faststore <Name>` (`.claude/commands/from-faststore.md`) is the downstream pair of the `.starter`'s `/to-faststore`. It takes a VTEX FastStore component from `../faststore.starter/src/components/<kind>/<Name>/` and produces the catalog **preview**: a React component with FIXED data (no VTEX/GraphQL/hooks), a flat `index.module.css`, a `TemplateRegistry` entry, and a `layoutData.ts` `LayoutItem`.

The command bakes in the standing prompt so you don't repeat it: dynamic→fixed coherent data, **expose ALL component-scoped style vars**, inline the **whole dependency graph in ONE file** (recreate `@faststore/ui` markup statically), mirror the sibling slot's structure, auto-number `template_N`, prefer the **organism** (placeable block) over a half-block molecule, and **never bring the source brand's logo asset** (see below).

**Logo never fixed.** Header/Footer sources from `.starter` often hardcode the source brand's logo (inline SVG mark, `<img src="...">` to a brand asset, or a hardcoded wordmark string). The command always strips that and replaces it with the catalog's standard dynamic-logo pattern — `const { logo } = useLayout()` (from `@/context/LayoutContext`), rendering `<img src={logo} alt="Logo" />` when set, else `<span className={styles.logoFallback}>SERIE//A</span>`. This is the exact scheme already used by `Header01`/`Header03`/`Header04`; `Header06` (Ferracini, migrated before this rule existed) was retrofitted to match it. Style `.logoFallback` to read theme color/font vars (`var(--header-text, var(--text-color-base, ...))`, `var(--font-primary)`) so it stays on-brand per the user's chosen palette instead of the source brand's.

Key behaviors:
- **Two derivation modes (no abort on single-level):** read the source SCSS (+ all deps). **Mode A — inheritance (2-level):** `var(--<sec>-<role>, var(--<global>, <default>))` → schema WITH `inheritsLabel` + `backgroundVars` (Footer/Header/Spot/Showcase base). **Mode B — faithful (1-level):** `var(--<comp>-X, <default>)` (author chose local defaults, no brand inheritance) → faithful schema, byte-identical default, OMIT `inheritsLabel`, `backgroundVars: []`, DON'T touch `.starter`. ProductInfo03 (`organisms/ProductDetails02`) is Mode B. Expose every component-scoped var the SCSS consumes; never invent vars it doesn't. Only STOP-and-ask when a themeable zone uses a **raw hex/rgba or catalog-internal token** (`--paper`/`--ink`/`--accent`/`--font-body`/`--font-display`) outside any var. See [[per-component-variables]].
- **Derivation fields:** cssVar→`cssVar`; default (A=G3 / B=G2) byte-identical so `pickChangedVariables` diffs; `type` font/color by global token + default shape; `inheritsLabel` only in Mode A (fixed table, typos preserved); `label`/`group` PT-BR heuristics confirmed by the dev. `rgba(…)` defaults stay rgba.
- **Numbering & path:** `template_N`/`id`/suffix = next free number of the catalog **slot** (NOT the FastStore suffix — `ProductDetails02` → `template_3`/`ProductInfo03`); folder = slot family name (`ProductInfo`); `component` = registry key; `path` = the migrated component's `manifest.id` (the organism for placeable blocks), may differ from `component`.
- **SCSS→CSS:** inverts `/to-faststore` (de-nests, resolves `&`, `@media`→`@container`, strips `$`/`@mixin`/SCSS functions), keeps `var(--…)` verbatim. **Reset fix:** `<button>`/`<li>`/`<ul>` needing own bg/border/list-style must be prefixed with the component root class (e.g. `.productDetails .addToCart`) to beat `.preview__area …` reset `(0,1,1)` — no `!important`.
- **Registration:** `templateRegistry.ts` (key = `component`) + `layoutData.ts` (unique 12-char `key`, `path` required for VTEX, `platforms` includes `'VTEX'`, `backgroundVars`).

**Prova de 1:1 (11/09).** O estágio `2-fidelidade` do funil casa nó a nó, por `data-role`
espelhado dos dois lados, o componente real (`localhost:3000/dev-fidelity?component=X`)
com a réplica (iframe do `/gerador`), em desktop 1440 e mobile 375. A caixa é a
asserção; CSS é diagnóstico. Ele normaliza quatro baselines de SHELL que o componente
não declara e que diferem entre as duas casas — `letter-spacing` (o core do FastStore
põe .16px no `body.theme`), cor de link não estilizado, e cor e fonte herdadas do
`<body>` — além de desligar `transition`/`animation` (a própria injeção da paleta
dispara as transições, e medir cedo lê o valor interpolado). E injeta uma **paleta-sonda**
com uma cor única por token de marca: ler `--background-secundary-color` onde o original
lê `--background-primary-color` deixa de ser invisível. **Ao migrar, ponha `data-role`
nos dois lados** — a família 06 do starter é anterior à convenção e precisa ganhá-los.

**Duas armadilhas que custaram caro na leva de 11/09:**
- `@container` que mira a PRÓPRIA raiz nunca casa (elemento não consulta o próprio
  container) — CSS válido que nunca aplica. Precisa de um `<div>` nu com
  `container-type` por fora. Mordeu `BannerSide06` e `BannerGrid06`.
- componente `position: fixed` mantém `@media`: não tem coluna cujo tamanho consultar.

Note: some legacy `template_4` preview stubs (`common/template_4/{Footer,Header}`) predate this and don't match the `.starter` MANU designs — overwrite them via the command when ingesting the real `.starter` component.
