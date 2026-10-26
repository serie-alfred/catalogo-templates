# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product flow

End users open `/gerador` and visually compose an e-commerce theme by drag-and-dropping pre-made components and tweaking visual variables (colors, fonts) that drive the components' appearance. When they finish, they export — the app screenshots desktop+mobile previews and emails the resulting theme configuration as a `config.json` attachment to the team. A developer then feeds that JSON into a separate downstream system that materializes the actual storefront theme. **This repo only produces the catalog UI, the previews, and the JSON; it does not generate the deployed theme itself.**

The catalog components are **mock replicas** of the real platform components. For VTEX, the real components live in the sibling repo `../faststore.starter`, and each VTEX `LayoutItem` in `layoutData.ts` carries a `path` pointing to its counterpart there. See **[docs/CATALOGO-E-FASTSTORE.md](docs/CATALOGO-E-FASTSTORE.md)** for why this catalog exists and how to find a preview component's FastStore reference (used as the source of truth for layout, Swiper config, and styles).

## Commands

Yarn is the canonical package manager (per [README.md](README.md)) — do not run `npm install` here.

```bash
yarn dev       # next dev
yarn build     # next build (ESLint runs as part of the build — see next.config.ts)
yarn lint      # next lint
yarn start     # next start (production)
yarn checkout:sync [--sha <sha>] [--repo <pasta>]   # vendoriza UM commit do ../checkout-vtex (ver "Modo Checkout")
```

O `yarn dev` fixa a 5503. Com a porta ocupada (outra sessão), suba `yarn next dev -p <porta>` e rode o
funil com `FUNIL_BASE_URL=http://localhost:<porta>`; o `2-checkout` quer o dev **sem KV**
(`env KV_REST_API_URL= KV_REST_API_TOKEN= UPSTASH_REDIS_REST_URL= UPSTASH_REDIS_REST_TOKEN= yarn next dev -p 5511`).

There is no test runner. Verification is `yarn funil` — the stages in [scripts/funil/](scripts/funil/) covering catalog integrity, the editor, the export and the theme the generator assembles from it. See [scripts/funil/README.md](scripts/funil/README.md) for what each one proves and what it needs. It wants `yarn dev` up, a Chrome (or `CHROME_PATH`), and — for `2-fidelidade` — the starter's own `yarn dev` on :3000; the preflight aborts the whole run when that one is missing, so reach for a single stage (`yarn funil 1`) when you only need the static checks.

### Required env vars

`.env.example` lists all of them. The full set used at runtime:

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_EMAIL` — used by [src/app/gerador/api/send-email/route.ts](src/app/gerador/api/send-email/route.ts) (Nodemailer; sends the exported layout JSON as an attachment).
- `GOOGLE_FONTS_API_KEY` — used by [src/app/gerador/api/fonts/route.ts](src/app/gerador/api/fonts/route.ts) to proxy the Google Fonts list.
- `KV_REST_API_URL`, `KV_REST_API_TOKEN` — Vercel KV, used by [src/lib/previewStore.ts](src/lib/previewStore.ts) for the shareable preview. Without `KV_REST_API_URL` the store falls back to `.preview-store/` on disk (dev only).
- `CRON_SECRET` — optional; when set, [/api/keep-alive](src/app/api/keep-alive/route.ts) requires `Authorization: Bearer <CRON_SECRET>` from the Vercel cron.
- `ETEMAS_LOGIN_USER`, `ETEMAS_LOGIN_PASSWORD`, `ETEMAS_SESSION_SECRET` — o login da agência (ver **Login** abaixo). O segredo precisa de 32+ caracteres. **Em produção, sem as três o /gerador fica FECHADO** — cadastre antes de publicar.

#### O que cadastrar na Vercel (Settings → Environment Variables, Production)

Só os nomes; os valores ficam com o time e **nunca** entram no repo (ele é público):

| Variável | Para quê | Obrigatória |
| --- | --- | --- |
| `ETEMAS_LOGIN_USER` | usuário da conta única da agência | sim — sem ela o editor fecha |
| `ETEMAS_LOGIN_PASSWORD` | senha dessa conta (trocar invalida as sessões abertas) | sim |
| `ETEMAS_SESSION_SECRET` | assina o cookie de sessão; 32+ caracteres aleatórios (ex.: `openssl rand -base64 48`) | sim |
| `KV_REST_API_URL` + `KV_REST_API_TOKEN` (ou `UPSTASH_REDIS_REST_URL` + `_TOKEN`) | preview, histórico de temas e o limite de tentativas do login | já cadastradas |
| `GOOGLE_FONTS_API_KEY` | catálogo do Google Fonts no seletor | já cadastrada |
| `CRON_SECRET` | fecha o `/api/keep-alive` para quem não é o cron | recomendada |

Depois de cadastrar, faça um novo deploy (variável nova não chega a um deploy antigo). Para conferir sem
o painel: `/login` em produção diz "Acesso fechado" e lista os NOMES do que falta, nunca os valores.

## Architecture

Next.js 15 App Router, React 19, TypeScript strict, CSS Modules + a few globals in [src/styles/](src/styles/). Path alias `@/* → ./src/*`.

### Two route groups, two purposes

- `(home)` — public marketing/showcase page ([src/app/(home)/page.tsx](<src/app/(home)/page.tsx>)). Uses Geist font via `next/font`, loads only `globals.css`.
- `gerador` — the interactive layout-builder tool. Split into two route groups, each with its **own root layout**: `(editor)` ([src/app/gerador/(editor)/page.tsx](<src/app/gerador/(editor)/page.tsx>), URL `/gerador`) loads `templates.css` + `globals.css` + `storefront.css` + `editor-canvas.css` + `editor-tokens.css` (in that order — the dark-mode lock in the last one has to win) and wraps children in `LayoutProvider`; `(frame)` (URL `/gerador/frame-mobile`) is the isolated document rendered inside the preview iframe. Route handlers under `src/app/gerador/api/**` sit outside both groups (they need no layout).
  - **`next/font` is for the CHROME only.** Inter is loaded in the editor layout as `inter.variable` and applied on `.ed-shell`. It must never go on `<body>`: `ExportStage` mounts `ThemeRenderer` in this same document and no template declares its own `font-family`, so the generated class (0,1,0) would beat `body { font-family: var(--font-family) }` (0,0,1) and silently change the typography of the exported PNGs. The **theme** fonts stay runtime-selectable, as before.

The two routes intentionally have separate `layout.tsx` files. Don't unify them.

### The gerador is one big hook + a context

All state for the builder lives in [src/hooks/useLayoutGenerator.ts](src/hooks/useLayoutGenerator.ts) — selections, current platform, focused section, current page (`selectedPage`), the active rail destination (`railTarget`), mobile/desktop toggle, theme colors, fonts, assets, canvas/screenshot refs, section selection (`selectedUid`/`hoveredUid`), the section actions (`moveSection`/`duplicateSection`/`removeSection`), the Wake-token popup state, undo/redo, export logic. [src/context/LayoutContext.tsx](src/context/LayoutContext.tsx) just wraps that hook and exposes it via `useLayout()`. Components inside `gerador/` should consume `useLayout()` rather than receiving these as props.

**Undo/redo** lives in [src/hooks/useThemeHistory.ts](src/hooks/useThemeHistory.ts) and is an _observer_: it never intercepts an action, it serializes the result. The versioned document is `selections` + the 10 colors + the 3 fonts — not UI state, not `platform` (it has its own confirm dialog), not the three assets (2 MB data URLs × 50 entries). Structural changes commit immediately; everything else is debounced 250 ms so a color-picker drag is one entry — except while a **text field** has focus (the hex input, the font name): those fields write on every keystroke, so the entry stays open until focus leaves the field (`focusout`), and typing `#123456` slowly is one entry, not `#1`…`#12345`. `undo`/`redo` first close whatever is still open, so one Cmd+Z always goes back exactly one gesture.

**The seeded context must stay in sync.** [SeededLayoutProvider](src/components/preview/SeededLayoutProvider/index.tsx) forges the context object for `/p` and the iframe with an `as unknown as` cast, so the compiler will NOT catch a field you add to or remove from the hook's return.

### Adding or editing a template

> **Coming from the `faststore.starter` repo?** Run `/from-faststore <Name>` ([.claude/commands/from-faststore.md](.claude/commands/from-faststore.md)) instead of doing the steps below by hand — it generates the preview, converts the SCSS, derives the `variablesSchema`, and registers the component. See [memory/from-faststore.md](memory/from-faststore.md). The manual steps below are the underlying contract.

A template is a React component plus a catalog entry. Two files always need to change together:

1. **Component** — add it under `src/components/templates/{common,home,category,product}/template_N/<Name>/`. The folder convention is `index.tsx` + `index.module.css`. Components receive `{ isMobile }` from [ThemeRenderer](src/components/preview/ThemeRenderer/index.tsx) — the single renderer for every surface. Templates may read **only** `logo` and `selections` from `useLayout()`: outside the editor the context is seeded by hand ([SeededLayoutProvider](src/components/preview/SeededLayoutProvider/index.tsx)), so any other field is a default, not real state.
2. **Registry** — import it in [src/utils/templateRegistry.ts](src/utils/templateRegistry.ts) and add it to the `TemplateRegistry` object. The string key must match the `component` field used in `LAYOUTS`. **If the registry entry is missing, `ThemeRenderer` renders a visible red marker naming the component** — it used to emit `<img src="/images/gerador/…">`, which with `image: ''` in all items was a mute 404 (os campos `image` já estão preenchidos hoje — ver **Thumbs do seletor** abaixo), so the mistake hid instead of showing.
3. **Catalog** — add a `LayoutItem` to the appropriate `LayoutSection` in [src/data/layoutData.ts](src/data/layoutData.ts). `LAYOUTS` is the source of truth for what users can pick. Each item declares `selection` (semantic slot name, drives the special rules below), `pagina` (`common | home | category | product`), `platforms` (`Tray | Wake | VTEX`), and `component` (the `TemplateRegistry` key).

> **Os dois lados saem de sincronia com facilidade, e em silêncio.** Hoje eles estão casados:
> **100 componentes no registry, 100 `LayoutItem`s ativos, zero órfãos dos dois lados** — e o
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

### Thumbs do seletor (`image` / `imageSource`)

Cada card do modal "Componentes de seções" mostra
`public/images/gerador/<layoutKey>/<Component>.webp` — 744×401, que é 2× o slot
(`.carouselImage` é `aspect-ratio: 334.667/180.333`). **Os 100 itens têm imagem**; o fallback
`placehold.co` em [SelectSectionItem](src/components/gerador/SelectSectionItem/index.tsx) só
sobrevive como rede.

`imageSource` diz de onde a imagem veio, e é a **lista de pendências do designer**:

- `design` (56) — mockup entregue pelo designer: as pastas V1–V3 (famílias 1, 2 e 5) e o `Lote2`
  de 23/09/2026 (famílias 1, 3, 4, 5, 6 e 7). Os mockups **não são versionados** (~80 MB de JPG e
  PNG); `scripts/thumbs/mapa.json` guarda o pareamento e o caminho da origem.
- `auto` (44) — screenshot do componente real, tirado por `scripts/thumbs/auto.mjs`. Vale como
  "ainda não veio do design". Não tenta imitar o estilo do mockup de propósito: um "quase igual"
  apagaria a distinção que este campo existe para manter.

**O pareamento arte→componente se prova pelo texto, não pela semelhança.** Os arquivos chegam
com nome genérico (`Base-N.jpg`, `ChatGPT Image … .png`); o que liga cada um ao componente é um
texto de mock que só existe num lugar — `'Produto de Exemplo'` e `'10,71'` só no `Spot01`. O
`Lote2` foi gerado pelo designer a partir dos prints `auto`, e conserva o texto que o print tinha;
onde o print era só placeholder, a arte inventa copy em inglês. Compare com o componente **atual**
(`yarn dev`), não com o print do pedido: nome e conteúdo mudam entre o pedido e a entrega.

`yarn thumbs` regera tudo (o estágio `auto` precisa de `yarn dev` de pé); depois de mexer num
componente, `THUMBS_SO=<Component> yarn thumbs:auto` refotografa só ele — a rodada inteira regrava
os 44 prints, quase todos com bytes diferentes e nada visível mudado. **Duas travas impedem
que uma rodada futura apague a arte do designer**: o componente estar em `mapa.json`, ou o item já
estar marcado `imageSource: "design"`. O `aplicar.mjs` é idempotente e escreve o catálogo a partir
do que existe **em disco** — apagar um `.webp` devolve o item ao placeholder sem editar TypeScript.

`imageSharedWith` marca o item cujo mockup deixa dois componentes nítidos: os dois dividem o
mesmo arquivo até o designer entregar a arte isolada, e o campo some junto com a troca. **Hoje
nenhum** — os 4 que existiam (`Categories01`↔`BannerFull01`, `Brand01`↔`BannerSide01`) ganharam
arte própria no `Lote2`.

Arte fora da proporção do slot declara `"enquadramento": "contain"` no `mapa.json` e entra
inteira sobre branco (hoje só o `CategoryTitle06`, que chegou plano e 3:1).

O estágio 1 do funil confere o `mapa.json` contra o catálogo **nos dois sentidos**: componente
renomeado deixa o mapa apontando para um nome que não existe (o `ProductInfo05`→`06` de 22/09
fez isso), e o `design.mjs` escreveria um `.webp` que nenhum item lê.

`mobile` continua vazio e não é lido por ninguém: o mockup já traz desktop e celular no mesmo quadro.

O inventário completo, a lista do que falta e os 9 mockups órfãos (arte de componente que o
catálogo não tem) estão em **[docs/THUMBS-DOS-COMPONENTES.md](docs/THUMBS-DOS-COMPONENTES.md)**,
que é gerado — não edite à mão.

### Per-component variables (`variablesSchema`)

A `LayoutItem` may declare `variablesSchema: ComponentVariable[]` ([src/data/layoutData.ts](src/data/layoutData.ts)) to expose **per-instance** color/font overrides in the gerador. **63 of the 100 active items declare one.** It is not a property of being VTEX-capable: `Header07`, `Footer07`, `Spot06/07` and `Showcase06/07` are VTEX and declare none — they were enabled from the registry orphans and nobody has authored their schemas yet. To count: `grep -c "variablesSchema:" src/data/layoutData.ts`. `Header01` has 8 vars: topbar/header/nav × bg+text, `--cart-text` and `--header-font`.

- `ComponentVariable = { cssVar, label, type: "color" | "font", default, group?, inheritsLabel? }`. `cssVar` is the literal CSS custom-property name written verbatim into `config.json` (e.g. `--header-topbar-bg`); `default` is the value the downstream SCSS uses as its `var()` fallback; `group` buckets fields in the panel; `inheritsLabel` is the friendly name of the global token shown while the field is still unset.
- **UI:** [ComponentVariablesPanel](src/components/gerador/ComponentVariablesPanel/index.tsx) _is_ the right column of the shell — permanent, not a drawer. It shows the groups of the selected section (colors → `ColorPicker`, fonts → `FontSelector`) and has two empty states, because 37 of the 100 active items declare no schema at all. The inherited state renders as "Usando variável da {inheritsLabel} (clique aqui para alterar)" — that sentence lives in the control, not in the caller. Live preview applies `item.variables` as inline CSS vars on the section wrapper in [ThemeRenderer](src/components/preview/ThemeRenderer/index.tsx).
- **State:** `LayoutSelection.variables?: Record<cssVar, value>` in `useLayoutGenerator` (`setItemVariable`, `resetItemVariables`); persisted with `selections` under the `layoutSelections` key of the tab's `sessionStorage`.
- **Export:** `pickChangedVariables()` writes every schema key the user has set a value for, as a `variables` object on the entry — in both `buildConfigJson` (Tray/Wake) and `buildFaststoreConfigJson` (VTEX). It used to omit keys equal to the schema `default`, on the assumption that the downstream SCSS's `var()` fallback would land on that same default — but the real fallback is a 3-level chain (individual → global token → hardcoded default), and the *global token* in the middle isn't the schema default. A user picking white text that happens to match the default got the key omitted, the individual var never reached `:root`/the component, and the color silently became whatever the global token resolved to instead. Always emitting what was chosen is the only reading that can't regress this way.
- Font values are stored as `'Family', sans-serif`; the panel parses the family out for `FontSelector` and re-wraps on change.
- **Fontes das famílias 09 a 13 (23/10/2026):** os 120 itens têm a fonte no grupo "Tipografia". O nome
  segue a herança do SCSS do starter: `--<secao>-title-font` herda a fonte primária e `--<secao>-font` a
  secundária (o CategoryTitle fica `--cat-title-title-font`). Item com uma cadeia só tem uma variável só
  (`--spot-font` do Spot09). Na 11 a primária é o corpo e a secundária são números e rótulos, e os rótulos
  dizem isso. Vitrine, vitrine com banner e relacionados usam `--showcase-*`. O `default` é o Nível 3 do
  desenho com aspas simples: as réplicas derivadas normalizam as aspas só nas cadeias `--*-font`, porque o
  1-variaveis compara byte a byte. O "Por template" não grava fonte por seção: o tema da família já põe a
  fonte do desenho na primária e na secundária, e a cadeia cai nela.
- **Fontes das famílias antigas (01 a 07, 24/10/2026):** todo item com texto tem fonte no grupo
  "Tipografia". Os nomes são os que o starter já lia, com o prefixo das cores da seção
  (`--header-font`/`--header-body-font` do Header02, `--shelf-*` das peças 06 e da vitrine 07); a
  réplica passou a ler o mesmo Nível 1, nas mesmas regras. Seção que não declarava fonte nenhuma
  (família 04, TextArea, carrossel e depoimentos 06) lê `var(--<secao>-font, inherit)` na raiz:
  sem valor, o texto herda a fonte da loja, como antes, e o `default` do schema é `inherit`, sem
  `inheritsLabel`. Default sem família entre aspas simples (`sans-serif`, `inherit`) não é
  carregado do Google (`loadComponentFonts`). Ficaram sem fonte os 15 itens só de imagem e o
  `ProductRelated01`, cujo `path` (`organisms/ProductShowcase01`) é só o carrossel: o título é do
  CrossSellingShelf nativo e os cards são do Spot01.
- **`FontSelector` never writes to `:root`.** It only loads the face into the current document (the
  one `ExportStage` photographs). Writing there was wrong twice over: the global tokens already come
  from the hook, and per-component `cssVar`s are _not_ unique per instance — setting one Showcase's
  font wrote `--showcase-font` on `:root` and silently applied to every other Showcase.
- `ColorPicker` and `FontSelector` take `variant`: `block` in the left panels (no own label, control
  44px) and `field` in the right panel (label + gap 12, control 41px). Two different boxes in the
  Figma, not a preference.

The downstream **template-generator** reads each entry's `variables` and injects them into the component's SCSS, which must consume them via the chained-fallback convention `var(--header-topbar-bg, var(--background-secundary-color, #122161))` (individual var → global token → hardcoded default). Keep `cssVar` names in sync with that SCSS.

### Modo LP (Wake e VTEX)

Uma **área à parte**, como o modo Checkout: o rail ganha o alternador **Landing page**
(`[data-editor-mode-lp]`, ícone `LandingPage` de `assets/icons/editor.tsx`) em Wake e VTEX — onde o generator sabe montar uma LP
sozinha. Ali o usuário monta UMA landing page com **qualquer seção de miolo** do catálogo e exporta
**só ela**. Não existe componente "de LP": a antiga LP-componente (`BlackFriday01`, `pagina:
"landing"`) foi dividida nas seções da família 08 (`BannerMain08`, `Countdown08`, `Categories08`,
`Showcase08`, `ShelfBanner08`, `Editorial08`, `Ruler08`, `Newsletter08`, réplicas em
`templates/home/template_8/`), que valem na home e na LP. Contrato com os outros repos em
`../.lp-contrato.md`.

- **Estado** ([src/utils/lp.ts](src/utils/lp.ts)): `editorMode: 'lp'` e `lp = { nome, selections }`,
  documento à parte das seções da loja (chave `lp` da aba, sanitizado por `sanitizeLp`). O hook expõe
  as seções ATIVAS — as da loja ou as da LP — como `selections`/`setSelections`, então adicionar,
  mover, duplicar, remover e as variáveis funcionam sem um ramo por ação; o setter lê o modo de um
  ref. `selectedPage` vale `home` no modo LP. O histórico (`ThemeDoc.lp`) cobre as duas.
- **Abre com a Black Friday** (`lpInicial`): as 8 seções 08 na ordem do Figma, com uid fixo (SSR).
  É ponto de partida, não tipo.
- **O que entra**: `disponivelNaLp` = item com `pagina` `home` na plataforma. Header, footer,
  breadcrumb e spot são da loja (a LP herda os dela); seção de categoria/produto depende do contexto
  da PLP/PDP. O picker já filtra sozinho, porque a página ativa é `home`.
- **Topbar**: `LpNameField` no lugar do seletor de página — o nome, com o slug derivado (`slugDaLp`).
- **Export** (`buildLpConfigJson`): `tipo: "lp"`, `landingPage: { slug, nome }` e o balde `landing`
  na ORDEM da página, cada entrada no formato de uma entrada de `home`; nada de global/home/checkout.
  PNGs `lp-<slug>-*.png`, config `config-lp-<slug>.json`. O generator monta a LP como página custom
  de hotsite (Wake, clone da home do tema) ou como seções numa Landing Page do CMS (VTEX).
- **Preview**: `/p/{id}/lp` renderiza `snapshot.lp.selections` (o snapshot leva a LP quando o
  preview nasce no modo LP); o balão lista a LP pelo nome.
- **Funil**: `2-lp` prova o modo ponta a ponta (alternador, LP inicial, documento à parte, modal sem
  header/footer, variável no canvas, config `tipo: "lp"` contra o contrato do generator, `/p/{id}/lp`).
- **CSS das réplicas 08** deriva do SCSS do starter: `yarn derivar:css` regera as réplicas e o
  `home.scss` de cada seção Wake (`global-templates/Wake/Home/template_8/<selection>/`), como faz
  com o `Header08`/`Footer08`. Quando a raiz da peça tem regra mobile, o script põe o container
  num envelope `.<raiz>Box`, que a réplica renderiza: uma `@container` não estiliza o próprio
  container.

### Por template (rail)

O quinto destino do rail, **Por template** (`[data-rail-target="templates"]`, depois dos quatro do
Figma para não mexer nas coordenadas do `2-geometria`), lista as **famílias completas** e aplica uma
inteira na loja. Some no checkout e na LP.

- **Derivado, não à mão** ([src/utils/templatesCompletos.ts](src/utils/templatesCompletos.ts)): uma
  família (`template`) é completa quando cobre, na plataforma, `SLOTS_OBRIGATORIOS` — os singletons
  comuns de `sectionRules` (header, footer, breadcrumb, spot), `banner-main` e `showcase` na home,
  `category-main` e `product-info`. Família incompleta não aparece. Família nova (11, 12, 13) entra
  sozinha quando cobrir os slots. Nome: `09 · Editorial` … `13 · Noturno`; as demais, `Template NN`
  (nada de nome de cliente: o repo é público).
- **Aplicar** (`aplicarTemplate` no hook): troca TODAS as seções da loja pelas da família, uma por
  item, na ordem `ORDEM` (a da home segue o mapa do desenho das famílias 09–13; pop-up e ajuda
  flutuante por último), e traz a **cara** da família: `TEMA_DAS_FAMILIAS` (cores autorais de
  Nível 2 e fontes do desenho; as 3 derivadas recalculadas no mesmo render). Tudo num render só, então
  é UM passo de undo. O mapa é **gerado** a partir dos `_bases/<Comp>NN/notas.md` do starter e do
  contrato (regra no comentário do bloco); família sem entrada (01–08) mantém paleta e fontes, e a 13
  só troca as fontes (o SCSS dela não herda a marca). Com seções já escolhidas pede `confirm`, que
  diz o que muda. Vai para "Componentes" na home; dali cada peça se troca como antes.
- **Nível 1 onde o Nível 2 não basta** (`NIVEL1_DAS_FAMILIAS`): um token de Nível 2 serve a vários
  papéis do desenho (na 09, `--background-primary-color` é fundo do header #F7F4EF, botão #1D1B18 e
  acento #9C4A2F). O mapa, também gerado, compara cada var de cor do `variablesSchema` (hex do desenho =
  `default`) com o que a cadeia `var(--n1, var(--token, …))` da réplica resolve no tema da família e guarda
  só as que divergem; aplicar põe esses valores em `variables` das seções (mesmo render, mesmo undo). O
  painel da direita os mostra como cor própria, com "Restaurar padrão", e o export os leva por componente.
- **Entrada padrão:** uma aba nova entra com `ENTRADA_PADRAO` aplicado pelo mesmo `vestirTemplate`,
  sem `confirm` (ver "Entrada: a aba nova já vem com um template"). No pé do painel, **Começar do
  zero** esvazia a loja.
- **Funil:** `2-templates` (inclui a entrada padrão e o "Começar do zero").

### Selection rules in `toggleSelection`

`useLayoutGenerator.toggleSelection` is not a simple add — it enforces per-`selection` semantics that you must preserve when adding new selection types:

- **`showcase`** — first one is added; clicking the same one again duplicates; clicking a _different_ showcase replaces all existing showcase entries in place (keeping their `pagina`).
- **Singletons** (`category-main`, `category-banner`, `product-description`, `product-info`, `banner-top`, `banner-main`, `category-description`) — at most one per page; selecting a different one replaces in place.
- **`pagina === "common"`** — the code loops `item.pagina.map(...)` to produce one `LayoutSelection` per entry, but in practice **every item in `layoutData.ts` has a single-element `pagina`**, so a `common` item yields exactly ONE row; it's `belongsToPage` that makes it show up on all three pages. Re-selecting the same common item on the same `layoutKey` replaces the existing row.
- Other items — appended, with a `MAX_PER_PAGE` (currently 101) cap per page.

The same `selection` strings drive the duplicate-button blacklist in [src/utils/sectionRules.ts](src/utils/sectionRules.ts) (`NON_DUPLICABLE_SELECTIONS`). It is keyed by `selection`, not `layoutKey`, and that is load-bearing: the `bannerFull` section mixes `banner-full` (duplicable) with `category-banner` (singleton), so no layoutKey rule can separate them. A new singleton goes in **`PAGE_SINGLETON_SELECTIONS`** — that's the list `toggleSelection` reads, and `NON_DUPLICABLE_SELECTIONS` is a union derived from it, which the file itself says not to edit by hand.

### Render order

[previewRender.ts](src/utils/previewRender.ts) is the single source of truth: `selectionsForPage` filters by `selectedPage`, then sorts by `getPriorityOrder` (`header=0, breadcrumb=1, footer=3, everything else=2`). `spot` only renders on the `common` view; `breadcrumb` is hidden on `home`.

`SectionsPanel` does **not** reimplement that order — it splits the rows into three buckets (`order < 2` locked on top, `order === 2` reorderable, `order > 2` locked at the bottom) and puts only the middle bucket in a `SortableContext`. That's why header/breadcrumb/footer have no drag handle (`LOCKED_LAYOUT_KEYS`): the user can never attempt a drag that `getPriorityOrder` would undo. `moveSection` runs `arrayMove` over the indices of the **full `selections` array**, not the filtered one.

Each row is an accordion (Figma), and **several can be open at once** — each toggles on its own,
plus a "Recolher todas" bar that appears only from 2 open rows (the Figma frame draws exactly one
open, so at rest the screen still matches the design).

The 24px slot on the left is the **caret, and only the caret** — it is a `<button>` that toggles
the row. It used to swap for the drag grip while the pointer was over the row, and that was a
trap: the user aimed at the caret, the cursor entered, the caret became the grip, and the click
landed on the dnd-kit handle, which ignores a click without a drag (`distance: 4`). The grip now
lives in the row's 24px `padding-left` gutter — empty in the Figma — revealed on row hover or on
its own focus, so at rest the row is still 1:1 with a design that draws no handle.

**Open state lives in `useLayoutGenerator` (`expandedUids`), never in the row.** Three measured
reasons: "collapse all" has to reach every row; `SectionRowView` is mounted twice during a drag
(the `DragOverlay` clone would be born closed); and the left panel is unmounted on every rail
change. Selecting a section **writes** to the set — it is not part of the derivation. That
distinction is the fix: `expanded = open || selected` let the global selection override the local
toggle, so the `−` could not close a selected row.

Locked rows do **not** show a padlock — that claim was never true in the code; the reason is in
the `title`. The three buckets and the `SortableContext` are unchanged.

### The editor shell (redesign, Figma "Versão Final V4")

`/gerador` is a four-column, two-row CSS grid in [(editor)/index.module.css](<src/app/gerador/(editor)/index.module.css>):
columns `56px | 264px | minmax(0,1fr) | 264px` (rail, left panel, canvas, right panel), rows
`64px | minmax(0,1fr)` (topbar, content). The floating bottom dock is gone, and with it `Sidebar/`,
`SidebarTabEditTheme`, `PreviewArea` and `styles/gerador.css`.

- **The widths are NOT the literal Figma values any more** (they were `75.404 | 344.596 | 420`).
  That trio spent 840px on fixed chrome: on a 1440 notebook the canvas got 600px and the preview
  opened at 40% zoom, and on a 1280 one, 440px at 26% — the QA complaint. Measured through the same
  code path, the compact trio gives **856px / 55%** at 1440 and **696px / 44%** at 1280.
- **The topbar spans the canvas AND the right panel** (`grid-column: 3 / 5`), and is a direct child
  of the shell — not of the centre column, which is now the canvas alone. It used to stop at the
  canvas, and the right panel carried its own 64px header with **Pré-visualizar** and the export
  button. Those two are _global_ actions living in the _section properties_ panel, and their 273px
  pinned that panel's floor at 320px although its widest real content (the `ColorPicker` row) fits
  in ~201. Merging the two boxes is what bought `420 → 264`; the buttons stayed in the same corner.
  The `.actions` track is `auto`, **never** `var(--ed-right-w)` — collapsing the panel zeroes that
  variable and the buttons would vanish with it.
- **The topbar draws the bottom border** (`inset 0 -1px 0`) across both columns. `EditorCanvas` lost
  its own `inset 0 1px 0` top border in the same change, or the two stack into a 2px line.
- **`--ed-canvas-pad` stays at 32px** while everything else tightened to 16: it is the gutter the
  `PanelToggle` sits in, between the panel edge and the iframe. Shrink it and the control covers the
  storefront — funnel stage 2a fails on containment.
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
- The `.rail` element declares no `width`: it is the grid track (`--ed-rail-w: 56px`, [editor-tokens.css](src/styles/editor-tokens.css)) that sizes it — `padding: 16px` + a 24px mark. It was hug in the Figma (24 + the 27.404px mark + 24 = 75.404), which spent 19px of chrome around 20px icons.

**One renderer for every surface.** [ThemeRenderer](src/components/preview/ThemeRenderer/index.tsx)
serves `/p`, the editor canvas and the export stage. Its wrappers are bare `div`s **on purpose**: no
`overflow`, no `transform`, no `position` — those clipped megamenus and made the section a containing
block for the Headers' `position: fixed` drawers and for the templates' orphaned absolute
pseudo-elements. Read the comment at the top of [editor-canvas.css](src/styles/editor-canvas.css)
before touching it.

- **Selection chrome adds NOTHING to the wrappers.** The outline is `outline` + `outline-offset: -2px`
  (zero pixel shift), and both the hover label and the green/red action badges are single
  `position: fixed` children of the canvas `<body>`, placed from `getBoundingClientRect()`.
  Green duplicates, red removes; green hides for `NON_DUPLICABLE_SELECTIONS`, read off the
  `data-selection` the wrapper carries.
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

**O trabalho é por aba** ([src/utils/editorStorage.ts](src/utils/editorStorage.ts), `estadoDaAba`):
selections, platform, colors, fonts and the three assets go to **`sessionStorage`** under keys
`layoutSelections`, `layoutPlatform`, `colors`, `fonts`, `logo`, `favicon`, `ogImage` — and the
checkout/LP modes under `editorMode` (`loja|checkout|lp`), `checkout` (`{ model, variables, etapa }`)
and `lp` (`{ nome, selections }`), read back through `sanitizeEditorMode`/`sanitizeCheckout`/`sanitizeLp`;
plus `wakeToken` and the tab's two links, `temaAtual` (the saved theme it saves into) and
`previewAtual` (the preview it keeps up to date). The full list is `CHAVES_DA_ABA`. The hook
hydrates in a post-mount effect (not in `useState` initializers), gated by `hydrated` so the save
effects don't overwrite storage with defaults first.

It used to be `localStorage`, which is ONE for every tab of the origin: a second tab inherited the
first one's layout and both wrote the same keys. `sessionStorage` survives a reload of the same tab
and starts empty in a new one (which then enters with the default template, below). Screen preferences (`panelLeftCollapsed`, `panelRightCollapsed`,
`canvasZoom`) stay in `localStorage`. The first tab opened after the change migrates whatever is
still in the old keys (`migrarEstadoAntigo`) and deletes them. The browser's own "Duplicate tab"
copies `sessionStorage` — that copy then goes its own way. **Anything that seeds the editor from
outside (the funil, `scripts/thumbs/auto.mjs`, `/gerador/import-log`) writes `sessionStorage` in the
same tab and reloads.** Between sessions, the theme lives in the history ("Temas salvos", below).

### Entrada: a aba nova já vem com um template

A tab that starts **without any work** enters with **`ENTRADA_PADRAO`**
([templatesCompletos.ts](src/utils/templatesCompletos.ts): today **VTEX + `09 · Editorial`**; change
it there, `template` accepts `"09"` or `"9"`). The hook applies it inside the hydration effect, in the
**same render that turns `hydrated` on**, through the same `vestirTemplate` the "Por template" uses
(pieces, palette, fonts, Nível 1 per section) but **without the `confirm`** — nothing to lose. So the
empty-canvas invite never paints, not even for a frame, and the undo history is born with the template
as its baseline: there is no "Voltar" back to an empty screen.

"Without any work" is `abaSemTrabalho()` ([editorStorage.ts](src/utils/editorStorage.ts)): no key of
`CHAVES_DA_ABA` in the tab's `sessionStorage` (after the old-`localStorage` migration), **and** no
`?preview=` in the URL. Every hydrated tab writes its keys, so the default is never re-applied:

| Entry | What happens |
| --- | --- |
| new tab, `/gerador` | `ENTRADA_PADRAO` applied, no dialog, "Voltar" disabled |
| reload of a tab with work | whatever the tab had (the keys exist) |
| tab that switched platform/template or emptied the store, then reloads | what it had — an empty store stays empty and shows the invite |
| "Editar" from `/p` (`/gerador?preview=<id>`) | the preview's theme (the param skips the default) |
| …with an expired/unknown id, in a new tab | alert, then `ENTRADA_PADRAO` ("abre com o template padrão") |
| "Temas salvos" → Abrir | the saved theme (`carregarEstado`; the tab already had state) |
| `/gerador/import-log`, funil and `thumbs/auto.mjs` seeds | what they wrote (any key counts as work) |
| second tab | its own default; the first tab is untouched (`sessionStorage` is per tab) |

If `ENTRADA_PADRAO` stops being a complete template, `templatePadrao()` returns null and the tab opens
empty, with the invite below.

### Empty editor

With the store empty (loja mode only — the LP has its starting composition and the checkout a fixed
structure), [EmptyCanvas](src/components/gerador/EmptyCanvas/index.tsx) covers the canvas cell with
"Comece seu tema" and two buttons, `[data-inicio="template"]` (opens "Por template") and
`[data-inicio="zero"]` (goes to "Componentes"). A new tab no longer gets here (see above): it shows when
the store is empty **by choice** and the tab reloads, or when the default template is gone. It sits over
the iframe, which stays mounted (no new handshake), and disappears with the first section or "Começar
do zero" (`mostrarInicio` / `comecarDoZero` in the hook).

**Começar do zero** also lives at the foot of "Por template" (`[data-templates-zero]`): with sections
in the store it asks `confirm` and empties the store on every page (colors and fonts stay) — one undo
step — and goes to "Componentes" without the invite; reloading that empty tab shows the invite.

### Font selector

[FontSelector](src/components/gerador/FontSelector/index.tsx) opens the list on click/focus, without
typing: system fonts first ([fontCatalog.ts](src/utils/fontCatalog.ts), `FONTES_DO_SISTEMA` — they
never get a Google `<link>`, `loadGoogleFont` skips them), then Google Fonts by popularity (first 120,
the rest by typing). Typing filters; arrows + Enter pick; Enter with nothing highlighted applies the
typed name (the path when the catalog is down — the `role="status"` warning stays). The Google list
is fetched **once per page** (`carregarFontesGoogle`, a module-level promise — the editor mounts up to
four selectors), and `/gerador/api/fonts` caches Google's answer for a day (`revalidate`) and tells
the browser `private, max-age=86400`.

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
Tray↔Wake never loses anything — their catalogs are identical. **Leaving VTEX leaves the checkout
mode** (`modeForPlatform`): not only in `changePlatform` but in an effect on `platform`, because the
hydration and `/gerador/import-log` also write it. Coming back to VTEX does not re-enter the mode.
The `PlatformSelect` normally lives only under "Componentes"; in checkout mode (no "Componentes")
it shows in the left panel header, otherwise there would be no way to switch platform there.

### Export flow

`exportLayout` (the "Baixar" button, in the **topbar** since the right panel lost its header) does three things in sequence: (1) `await mountExportStage()` — which flips `isCapturing`, mounts [ExportStage](src/components/gerador/ExportStage/index.tsx) off-screen and resolves after two `requestAnimationFrame`s (layout, then paint) — then `await`s `waitForImages` on both copies plus `document.fonts.ready` before `html2canvas`ing the `desktopPreviewRef` (1920px) and `mobilePreviewRef` (375px) divs, downloading PNGs to the user. **Those awaits are load-bearing**: the stage used to be mounted since page load, so images and fonts were long since ready; without them the PNGs come out with blank images and fallback type, and nobody checks the PNG; (2) build a JSON config grouped by `platform → { global, variables, assets, [page]: items[] }`;
(3) **entrega por exatamente UM caminho, decidido por `localhost`**: em desenvolvimento faz o
download; fora dele envia via `/gerador/api/send-email` e **não** baixa — o config é insumo da
equipe de implantação, não arquivo do usuário final. O gate é `localhost`, **não um domínio**: o
host de produção já mudou uma vez (conta antiga da Vercel) e um gate por domínio volta a quebrar
em silêncio. Como o clique deixa de produzir arquivo, o envio **tem** de confirmar na tela
(`window.alert`) — foi a ausência desse sinal que fez este fluxo virar download no passado. Falha
de envio é a única exceção: baixa como resgate e avisa. `sendLayoutConfigEmail` **lança** em
resposta não-ok; `fetch` sozinho resolve num 500 e o `catch` nunca rodava, o que agora perderia o
config sem sinal nenhum. When `platform === 'wake'`, the JSON also includes `wakeToken`.
The screenshots are best-effort: a html2canvas failure warns and still delivers the JSON.

Both config shapes carry `assets` (logo, favicon, ogImage). The faststore one had none until this
redesign, so VTEX exports were silently dropping the brand assets.

### Shareable preview (`/p/[id]/[page]`)

Alongside export, the topbar has a **Pré-visualizar** button ([PreviewButton](src/components/gerador/PreviewButton/index.tsx)) that persists the current theme server-side and returns a short random URL the client can open and navigate like a real site. Three pages share one id: `/p/{id}/home`, `/p/{id}/categoria`, `/p/{id}/produto`, switched via a floating bubble ([PreviewNav](src/components/preview/PreviewNav/index.tsx)).

- **Snapshot**: `useLayoutGenerator.buildPreviewSnapshot()` serializes `{ platform, selections, colors, fonts, logo, favicon, ogImage }` (`PreviewSnapshot` in [src/lib/previewStore.ts](src/lib/previewStore.ts); `ogImage` is optional so older snapshots stay valid); `createPreview()` POSTs it to `/gerador/api/preview` and returns `${origin}/p/{id}/home`.
- **Storage is hybrid** ([previewStore.ts](src/lib/previewStore.ts)): a `fileStore` writes `.preview-store/{id}.json` in dev (zero config, gitignored) and a `kvStore` uses `@vercel/kv` in prod. `getStore()` picks KV when `KV_REST_API_URL` is set. The module is `server-only`; the client hook imports only the **type** (`import type`), so it never bundles it.
- **Rendering reuse**: the page-filter + priority-sort rules live in [src/utils/previewRender.ts](src/utils/previewRender.ts) (`selectionsForPage`, `getPriorityOrder`, `belongsToPage`, `slugToPagina`/`PREVIEW_PAGES`), and `ThemeRenderer` is now literally the same component the editor uses — the two views can't diverge because there is only one.
- **Theme outside the gerador**: [SharedPreview](src/components/preview/SharedPreview/index.tsx) applies the theme vars inline on a wrapper (`buildThemeStyle` in [themeStyle.ts](src/utils/themeStyle.ts), shared with the mobile iframe) plus the Google-font `<link>`s, and wraps children in [SeededLayoutProvider](src/components/preview/SeededLayoutProvider/index.tsx) with `{ logo, selections }` from the snapshot. The preview must NOT run `useLayoutGenerator` (it would hydrate the author's stored state). The `p` route group has its own `layout.tsx` importing `templates.css` + `globals.css` + `storefront.css` + `preview.css` (no chrome do editor, no `LayoutProvider`).
- **Shared storefront CSS**: [storefront.css](src/styles/storefront.css) holds the two rules that must hold on all three surfaces (`.preview-sticky-header` and the `.preview-template .component__container` 1200px clamp). Document-level rules stay split on purpose — `preview.css` for `/p`, `(frame)/frame.css` for the iframe — because their `color-scheme: light !important` / `background: #fff !important` would repaint the editor's own chrome.
- **Prod requires** a Vercel KV database and env vars `KV_REST_API_URL` / `KV_REST_API_TOKEN`.
- **"Editar" and the live preview** ([previewAoVivo.ts](src/utils/previewAoVivo.ts), the decision is
  documented there). `PreviewNav` has a fixed `[data-preview-editar]` (bottom-left) linking to
  `/gerador?preview={id}` (`&modo=checkout` from a checkout page): the hook fetches the snapshot from
  the PUBLIC `GET /api/preview/{id}`, loads it with `carregarEstado` (same sanitizers as hydration; one
  undo step), links the tab to that id (`previewAtual`) and strips the param from the URL. From then
  on — and also after "Pré-visualizar", which re-saves the SAME id when the tab already has one — every
  edit re-saves the snapshot under the same id, debounced 1.2 s (`PUT /gerador/api/preview/{id}`,
  `updatePreview`, TTL renewed: the link lives 3 days after the LAST edit). The open `/p` refreshes
  (`router.refresh()`, [PreviewLive](src/components/preview/PreviewLive/index.tsx)) by two paths:
  BroadcastChannel `etemas-preview` from the editor in the same browser (instant), and polling
  `GET /api/preview/{id}?rev=1` every 5 s while the tab is visible (other browsers). The snapshot
  carries `rev` (ms of the last save). No WebSocket/SSE: serverless doesn't keep connections and the
  KV is already the single source. Opening a saved theme unlinks the preview (the link belonged to the
  previous theme). `/p/{id}` alone redirects to `/p/{id}/home`. The link stays public.

### Saved themes (history)

Rail destination **"Temas salvos"** (`[data-rail-target="salvos"]`, after "Por template", in every
mode) → [PanelSavedThemes](src/components/gerador/EditorLeftPanel/PanelSavedThemes/index.tsx). ONE
history for the agency (single account, behind the login). Saving sends `estadoAtual()` — the
`EstadoDoEditor` ([types/estadoEditor.ts](src/types/estadoEditor.ts)): the preview snapshot + the LP
always + `editorMode` + `wakeToken`. First save creates the theme, the next ones append versions
(`temaAtual` links the tab); "Salvar como novo" forks. The list shows platform, date of the last version
and the version count; "Abrir" loads the last version (or one picked under "Versões") with
`carregarEstado` — one undo step, the panel stays open — and "Apagar" deletes the theme and every
version.

- **Storage** ([src/lib/temasStore.ts](src/lib/temasStore.ts)) on the same KV as the preview:
  sorted set `temas` (id → updatedAt), summary `tema:{id}`, each version in its own key
  `tema:{id}:v:{n}` (the state carries data-URL assets of up to 2 MB; one document with every version
  would outgrow Upstash's per-request limit). No TTL. More than 50 versions drops the oldest.
- **API** (behind the login): `GET/POST /gerador/api/temas`, `GET (?versao=n)/POST/DELETE
  /gerador/api/temas/{id}`. Without a database in production: 503 naming the variables.
- **Dev without KV**: [src/lib/kv.ts](src/lib/kv.ts) is a small KV interface (`get/mget/set/del/incr/
  zadd/zrem/zrevAll`) whose dev implementation is a JSON file at `.preview-store/kv.json` (gitignored,
  same folder as the dev previews), with the same semantics — so local tests run the production logic;
  only the primitive changes.

### Login

One agency account. [src/lib/auth.ts](src/lib/auth.ts) (Web Crypto only: it runs in the Edge
middleware and in the Node routes) + [src/middleware.ts](src/middleware.ts) (`matcher: /gerador`,
`/gerador/:path*`).

- **Protected**: everything under `/gerador` — editor, the canvas iframe (`/gerador/frame-mobile`),
  `/gerador/import-log` and all `/gerador/api/*` (create/re-save preview, history, send-email, fonts).
  Pages redirect to `/login?next=<path+query>` (so "Editar" from a preview survives the login); APIs
  answer 401 JSON.
- **Public on purpose**: `/` (home), `/p/...`, `GET /api/preview/{id}`, `/api/keep-alive` (cron),
  `/login`, `/api/auth/*`, and **files of `public/` under `/gerador/`** (checkout fixtures,
  `familia08/`, `footer08/` — the `/p` loads them): the rule is "last segment has an extension"; no
  app route has a dot.
- **Session**: cookie `etemas_sessao` = `<exp>.<HMAC-SHA256(secret, v1|user|exp|sha256(password))>`,
  httpOnly, `sameSite: lax`, `secure` in production, 7 days. Changing user, password or secret
  invalidates every open session — no session list in the database.
- **Login** (`POST /api/auth/login`, native form, works without JS): user AND password are always both
  compared, in constant time over their SHA-256 (`credenciaisConferem`); 10 failures per IP in 15 min
  block (counter `login-falhas:<ip>` in the KV; without a database the login works without the limit);
  `next` only accepts a path of this origin (`destinoSeguro` rejects `//host` and `/\host`). **Logout**:
  `POST /api/auth/logout` (the rail's "Sair", at its foot).
- **Modes** (`modoAuth`): `ligado` (the three vars, secret ≥ 32 chars); **`fechado`** — production
  without them: nobody gets in, pages go to `/login`, which says "Acesso fechado" and lists the missing
  NAMES, APIs answer 503; **`desligado-dev`** — development without them: no login, a warning in the
  terminal (once) and an icon at the foot of the rail (`[data-login-desligado]`, from
  `GET /api/auth/estado`, read at runtime because `/gerador` is prerendered). That's how `yarn dev` and
  the funil run. To test the login locally, put the three vars in `.env.development.local` (ignored by
  git; `.env.local` is TRACKED in this repo — never put credentials there).

### Modo Checkout (VTEX)

O rail ganha, só em VTEX, o alternador **Checkout** (`[data-editor-mode-toggle]`): o canvas troca a
loja pelo checkout nativo da VTEX com o visual do modelo `Checkout01` do repo irmão
[`../checkout-vtex`](../checkout-vtex/CLAUDE.md) (arquitetura §4 e `docs/gate0.md` lá). O cliente
só muda **cor e fonte**; a estrutura do checkout é fixa, então "Componentes" some do rail.

- **Estado** (`useLayoutGenerator`): `editorMode` e `checkout = { model, variables, etapa }`, em que
  `variables` é o **nível 1** (`faststore.checkout.variables`) e entra no undo/redo (`themeDoc`); a
  etapa é navegação, como `selectedPage`. O nível 2 são as cores/fontes globais da loja,
  `variaveisGlobais` — a MESMA função no preview e no export.
- **Chrome:** a topbar mostra `SelectCheckoutStep` (Carrinho · E-mail · Identificação · Entrega ·
  Pagamento); o painel direito é o `CheckoutVariablesPanel`, com o `VariablesList` extraído do
  `ComponentVariablesPanel`, dizendo AO VIVO de onde cada papel herda ("Herdando de cor primária da
  marca (#…)", "do padrão do modelo", e na **guarda de visibilidade** — gate0 #14a/#16, cor da loja
  que some no fundo — "Usando a cor do modelo (…) porque a da loja (…) não aparece no fundo").
- **Canvas:** `CheckoutFrame` (irmão do `PreviewFrame`; o `/p/{id}/checkout/{etapa}` reusa o mesmo)
  carrega a fixture ESTÁTICA `public/gerador/checkout/Checkout01/<etapa>.<vp>.html` (1280 ou 390,
  `LARGURA_CHECKOUT`) e, por ser mesma origem, escreve no `contentDocument`: o `:root` do
  `emitTokens` em `<style id="ck-tokens">`, o header/footer COMPOSTOS nos slots
  (`[data-etm-slot]` na fixture real, par de comentários `ck-slot:` na provisória), a fonte com os
  pesos 300–700 e as travas de clique/submit. No pagamento faz o mesmo no **iframe do cartão**
  (`pagamento.<vp>.card.html`, que carrega o mesmo CSS) e acerta a altura dele pela `scrollHeight`.
  No **rodapé**, `{{RAZAO_SOCIAL}}`, `{{CNPJ}}` e `{{AVISO_LEGAL}}` viram texto de EXEMPLO
  ([src/utils/checkoutExemplo.ts](src/utils/checkoutExemplo.ts), gate0 #26) — só no preview: o
  painel explica (`[data-checkout-placeholders]`) que o arquivo sai com os placeholders, preenchido
  pelo time antes de subir, e o compose/export continua com eles. O texto do header, o "100% seguro"
  e o passo ativo do stepper usam o papel derivado `--checkout-header-text` (gate0 #23, fora do
  painel): o texto da página enquanto ele tem 4,5:1 sobre o fundo do header, senão o contraste.
  No `<iframe>`: `data-pedido` (impressão de fixture + níveis + logo recebidos) e, depois dos
  efeitos, `data-aplicado` com o mesmo valor; `data-pronto` só com o logo já reduzido
  (`logoCheckoutPendente`: a redução é assíncrona). É por eles que o funil espera, não por tempo.
- **`/p/{id}/checkout/{etapa}`:** só snapshot VTEX **com** o bloco `checkout`
  (`snapshotTemCheckout`; o POST do preview grava o que vier, então um Tray com o bloco dá 404 e não
  ganha as etapas no menu). Cor e papel do snapshot passam pelos mesmos filtros do canvas
  (`variaveisValidas`, `nivel2DoPreview`) antes de virar CSS.
- **Sem drift:** nada no catálogo calcula token. [src/utils/checkout.ts](src/utils/checkout.ts) só
  adapta o estado ao `compose.mjs` vendorizado em `src/lib/checkout/` (ignorado pelo ESLint: é byte
  a byte o do SHA). O compose só **lança** pelo que é exclusivo do checkout (papel desconhecido,
  nível 1 inválido, modelo/template quebrado); nível 2 inválido, guarda de visibilidade e logo
  recusado (formato, > 100 KB — gate0 #17) voltam como **avisos** — o preview troca o logo recusado
  pelo de exemplo e o painel avisa (`[data-checkout-aviso]`). `reduzirLogo` nunca lança: só
  redesenha data URL (≤ 280×64); URL https vai como veio.
- **Export:** `faststore.checkout = { model, version: <SHA do VERSION.json>, variables }` sai em
  TODO tema VTEX, e `assets.logo` sai reduzido — o mesmo que o header do preview mostra.

**`yarn checkout:sync`** lê um COMMIT (`git archive`), nunca o working tree — o mesmo SHA que o
generator clona. Grava `src/lib/checkout/*.mjs`, `src/data/checkout/Checkout01/checkout.json`,
`public/gerador/checkout/Checkout01/` (o `dist/` inteiro + as fixtures) e
`src/data/checkout/VERSION.json` (SHA, o **sha256 de cada arquivo gravado** — lib, `checkout.json`,
dist, fixtures, cartões —, origem de cada fixture). **Fixtures:** prefere as
REAIS de `modelos/Checkout01/fixtures/<etapa>/<vp>/` (`yarn fixtures:capturar` do checkout-vtex:
DOM com o nosso JS, CSSOM serializado, `card.html`) — reprova se o `sha256Js` delas não for o do
`dist/default` do mesmo SHA — e só onde falta uma real gera a PROVISÓRIA da `captura-crua`
(precisa do Chrome). `provisorio: false` quando as 10 são reais. O catálogo é repo PÚBLICO: em
fixture real ou provisória, `<script>`, atributo `on…=` ou URL `javascript:` reprova (o iframe não
tem sandbox e é da origem do catálogo). **A lista do que o repo público não pode receber (gate0 #29)
não mora no catálogo** — nem cópia, nem vendorizada: é a canônica do checkout-vtex, fora do `lib/`
dele. O sync a acha no **próprio SHA** (o único `publico.mjs` fora do `lib/`; o caminho não aparece
aqui porque a pasta é um dos termos), lê com `git show` e importa de um `data:` URL, em memória;
com ela confere **todo** arquivo que vai gravar (lib, `checkout.json`, dist, fixtures, cartões e o
VERSION.json) e, na provisória, aplica as `TROCAS` dela. SHA sem a lista, com ela dentro do `lib/`
(o formato de antes do gate0 #29) ou com termo em qualquer arquivo reprova. `scripts/funil/lib/checkout.mjs` só sabe
**achar e carregar** a lista (`listaDoSha`, `listaDoWorkingTree`); não guarda termo. **Reprovar não toca o catálogo:** tudo é
preparado numa pasta temporária e só aplicado depois de todas as travas (antes de 25/09 uma
fixture reprovada no meio deixava o `public/` meio apagado, o `lib/` do SHA novo e o VERSION.json
do velho). Não edite nada disso à mão: o `1-checkout` confere a integridade pelos hashes do
VERSION.json e, com o checkout-vtex ao lado (`../checkout-vtex` ou `CHECKOUT_VTEX_DIR`), byte a byte
contra o SHA e os termos da lista carregada de lá (a do SHA; sem o commit, a do working tree) nos
vendorizados e em **todo** arquivo que a integração criou ou mudou (`FONTES_DA_INTEGRACAO` no
`1-checkout`, inclusive painéis e hooks fora do modo Checkout; arquivo novo da integração entra
nessa lista). Sem o checkout-vtex ao lado (clone só do catálogo, que é
público): "termos não conferidos: sem checkout-vtex ao lado" — aviso, não reprova.

Funil: `1-checkout` (estático: vendorizado = SHA, fixtures, JS da fixture = dist, papéis × CSS,
lint, `VAR_MAP`, hashes e a lista do repo público lida do checkout-vtex), `2-checkout` (o modo no navegador: nós reais por papel,
guarda, cartão, equivalência 0 px com controle negativo, logo, troca de plataforma, rodapé de
exemplo, header escuro e a rota `/p/{id}/checkout/{etapa}` — esta pede o dev **sem KV**, e o estágio
prova o armazenamento local antes de postar) e o `3-export` (`faststore.checkout` no config, e o
compose dele com os placeholders do rodapé). Ver [scripts/funil/README.md](scripts/funil/README.md).

O SHA vendorizado é o `sha` de [src/data/checkout/VERSION.json](src/data/checkout/VERSION.json)
— a única fonte dele no catálogo; nenhum doc ou comentário daqui repete o valor, que muda a cada
`yarn checkout:sync` (e, enquanto o checkout-vtex não tem remote, pode ser um commit que só existe
num snapshot local). O VERSION.json também diz `provisorio`, a origem de cada fixture e o sha256
de cada arquivo gravado. O que se desenha sobre o fundo do header e do rodapé (passo
inativo, traço, texto do rodapé, cadeado) vem derivado do lib (gate0 #28, papéis fora do painel);
o catálogo não calcula nada disso. O seletor de
plataforma no modo Checkout e a nova tentativa da equivalência (≤ 50 px, a 1ª captura no log) estão
aprovados (gate0 #27).

### Mobile users

`useIsMobile` short-circuits the gerador to `<DesktopOnlyNotice />` — the builder is desktop-only by design. The mobile _preview_ inside the desktop UI is a separate concept (the `isMobileView` toggle).

## Code style

- Prettier: `singleQuote: true`, `tabWidth: 2`, `trailingComma: 'es5'`, `arrowParens: 'avoid'` ([.prettierrc](.prettierrc)).
- ESLint: `@typescript-eslint/no-explicit-any` is `error` (not warn). For plain `.js/.mjs/.cjs` files only, double quotes and semicolons are enforced (different from the `.ts/.tsx` rules — see [eslint.config.mjs](eslint.config.mjs)).
- `next.config.ts` sets `eslint.ignoreDuringBuilds: false`, so a lint failure fails `yarn build`.
