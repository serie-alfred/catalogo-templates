# Trazer componente do FastStore para o catálogo (preview)

Ingere um componente VTEX FastStore do projeto irmão **`faststore.starter`** (`.starter`) para dentro deste catálogo: gera a **versão preview** (React com dados fixos, sem VTEX/GraphQL/hooks), registra no `TemplateRegistry` e cria a entrada em `layoutData.ts` — derivando o `variablesSchema` a partir do SCSS (modo herança ou fiel, passo 1). É o par downstream do comando `/to-faststore` do `.starter`.

Argumento: `$ARGUMENTS` = nome do componente (`Footer04`, `Header01`, `ProductDetails02`) ou caminho do `index.tsx`. Origem default: `../faststore.starter`.

## Princípios embutidos (já assumidos — NÃO precisam ser repetidos no prompt)

Rodar `/from-faststore <Nome>` já implica, por padrão, sem o dev pedir:

1. **Conteúdo dinâmico → fixo e coerente.** Todo dado VTEX/GraphQL/hook vira conteúdo fixo que faça sentido para o **contexto da página** (PDP → produto plausível; categoria → categoria; etc.). Reaproveite `mock.ts` quando existir.
2. **Expor TODAS as variáveis de estilo do componente.** Cada CSS var component-scoped (`var(--<comp>-X, …)`) que o SCSS consome vira um item do `variablesSchema` — cor e fonte — para o usuário final editar, igual aos outros componentes (passos 1 e 5).
3. **Grafo completo, tudo num arquivo só.** O componente e TODOS os sub-componentes que ele usa (recursivamente, via `manifest.json` → `dependencies.components`) entram **hardcode no MESMO `index.tsx`**. Não separe por componente nem crie pastas por sub-componente — recrie o HTML estático equivalente (inclusive markup de libs `@faststore/ui`) inline (passo 3).
4. **Estrutura espelha o slot.** Use o(s) template(s) já existente(s) do mesmo slot como referência de wrapper/estrutura (ex.: `product/template_1/ProductInfo`).
5. **Numeração automática do `template_N`** = próximo número livre do slot no catálogo (passo 2).
6. **Bloco colocável (organism) vs peça (molecule):** se a origem é meio-bloco que depende de um irmão (ex.: `ProductInfo02` é só a coluna de info, ao lado da galeria), migre o **organism** que compõe o bloco inteiro e use o `path` dele (passo 2).

Decisões que **continuam exigindo o dev** (pergunte, não invente): zona temável com valor cru/token interno (passo 1, "quando PARAR"); `selection`/`pagina` quando o nome não casa a tabela (passo 2); `platforms` além de `'VTEX'`.

## 0. Resolver e ler a origem

1. Localize a pasta do componente no `.starter`, varrendo os kinds: `../faststore.starter/src/components/{atoms,molecules,organisms,overrides}/$ARGUMENTS/`. Se o usuário passou um caminho, use-o. Se não achar, **aborte** listando onde procurou.
2. Leia da pasta de origem:
   - `index.tsx` — estrutura/props/hooks a remover.
   - `style.module.scss` — vira o CSS do preview e a fonte do `variablesSchema`.
   - `mock.ts` (se existir) — **fonte dos dados fixos** do preview.
   - `manifest.json` (se existir) — o `id` (ex.: `organisms/Footer04`) dá o **`path` VTEX** exato; o bloco `section` indica que é um **bloco colocável** (organism) — relevante p/ o passo 2.
3. **Leia o grafo de dependências recursivamente.** Para cada item de `manifest.json` → `dependencies.components`, abra a pasta correspondente (ex.: `molecules/ProductTitle02`) e leia seu `index.tsx` + `style.module.scss` — e repita para as dependências dele. Tudo isso será inlined num arquivo só (passo 3) e suas CSS vars entram no `variablesSchema` (passo 5). Ex.: `organisms/ProductDetails02` → `ProductGallery02` + `ProductInfo02` → `ProductTitle02`/`ProductPrice02`/`ProductVariations02`/`ProductBuy02`/`ProductSpecsAccordion02`.

## 1. Modo de derivação das variáveis (cor/fonte) — lê o SCSS

O `.starter` tem dois padrões de CSS var component-scoped. **Detecte qual o componente usa e derive de acordo — NÃO aborte por causa de 1 nível.** Verifique no `style.module.scss` (e nos SCSS das dependências do passo 0):

- **Modo HERANÇA (cadeia de 2 níveis):** `var(--<secao>-<papel>, var(--<token-global>, #hex))` — ex.: `var(--footer-bg, var(--background-footer, #1A051C))`. O default herda um **brand token** da marca → schema **com** `inheritsLabel` + `backgroundVars` (passo 5, **caminho A**). É o padrão dos Footer/Header/Spot/Showcase base.

- **Modo FIEL (cadeia de 1 nível):** `var(--<comp>-X, <default>)` — ex.: `var(--prod-info-btn-bg, #121212)`, quando o autor do `.starter` escolheu defaults locais do componente, **sem** herdar a marca. Isso é **válido e comum** — NÃO precisa virar 2 níveis. Schema **fiel**: default byte-idêntico ao SCSS, **sem** `inheritsLabel`, `backgroundVars: []`, e **NÃO** edite o `.starter` (passo 5, **caminho B**). Foi assim no `ProductInfo03` (`organisms/ProductDetails02`).

Um mesmo componente pode misturar os dois — derive cada var pelo seu próprio padrão. Em ambos os modos: **exponha toda** var component-scoped que o SCSS consome e **nunca invente** vars que o SCSS não usa (quebra o contrato com o `template-generator`).

**Vars que NÃO viram schema (ficam estruturais no CSS, fora do painel):** paleta local sem default temático consumida crua (`var(--f<N>-ink)` sem fallback), neutros estruturais (`--f<N>-grey-NN`, `--f<N>-ease`, `--f<N>-hairline`, `--f<N>-mono`) e offsets de layout (`--prod-gallery-top` etc.). Mantêm o valor no CSS.

**Quando PARAR e perguntar ao dev (não auto-resolver):** uma zona claramente temável (fundo de seção, botão, texto principal) usa **hex/rgba cru fora de qualquer `var()`** ou um **token interno do catálogo** (`var(--paper)`, `var(--ink)`, `var(--accent)`, `var(--font-body)`, `var(--font-display)` — de `globals.css`, não existem fora do catálogo). Aí o painel não consegue editar a propriedade. Emita:

> "Em `$ARGUMENTS`, a zona `.X` usa valor cru/token interno do catálogo (`…`) fora de uma CSS var component-scoped — o painel não consegue editar. Posso: (a) padronizar o SCSS no `.starter` (`var(--<comp>-X, <default>)`) e então expor a var, ou (b) deixar essa propriedade fixa e seguir com as demais. Como prefere?"

## 2. Mapear destino (pagina / selection / seção / template_N)

Derive de forma determinística a partir do nome/kind. Tabela (espelha `src/data/layoutData.ts` → `LAYOUTS`):

| Prefixo do nome | `pagina` | `selection` | seção em `LAYOUTS` |
| --- | --- | --- | --- |
| `Header*` | `["common"]` | `header` | `header` |
| `Footer*` / `Newsletter*` | `["common"]` | `footer` | `footer` |
| `ProductCard*` / `Spot*` | `["common"]` | `spot` | `spot` |
| `Breadcrumb*` | `["common"]` | `breadcrumb` | `breadcrumb` |
| `Brands*` | `["home"]` | `brands` | `brands` |
| `Categories*` | `["home"]` | `categories` | `categories` |
| `BannerMain*` | `["home"]` | `banner-main` | `banner` |
| `BannerFull*` | `["home"]` | `banner-full` | `bannerFull` |
| `ProductShelf*` / vitrine | `["home"]` | `showcase` | `showcase` |
| `MainCategory*` | `["category"]` | `category-main` | `categoryMain` |
| `DescriptionCategory*` | `["category"]` | `category-description` | `categoryDescription` |
| `ProductInfo*` / `ProductDetails*` | `["product"]` | `product-info` | `productInfo` |
| `ProductDescription*` | `["product"]` | `product-description` | `productDescription` |
| `ProductShowcase*` | `["product"]` | `product-related` | `productRelated` |

- **Bloco colocável (organism) vs peça (molecule).** Se a origem é uma *molecule* que renderiza só meio-bloco e na página fica ao lado de um irmão (ex.: `ProductInfo02` é só a coluna de info, ao lado de `ProductGallery02`), prefira migrar o **organism** que compõe o bloco inteiro — o que tem `section` no `manifest.json` (ex.: `organisms/ProductDetails02`). O preview reproduz o bloco completo e o `path` aponta p/ o organism. Na dúvida, confirme com o dev.
- **`template_N` e o sufixo numérico = próximo número livre do slot NO CATÁLOGO, não o sufixo do nome FastStore.** Olhe os `id` já existentes na seção de `LAYOUTS` e use o próximo livre. Costuma bater com o sufixo FastStore, mas **nem sempre**: `organisms/ProductDetails02` virou `template_3`/`ProductInfo03` porque o slot `product-info` já tinha template_1 e template_2 (ProductInfo01/02 Tray/Wake).
- **Nome de pasta/família = o do slot, não o nome FastStore.** A pasta é `src/components/templates/<pagina>/template_N/<Família>/`, onde `<Família>` é o nome já usado pelos irmãos do slot (ex.: slot product-info → pasta `ProductInfo`, mesmo a origem sendo `ProductDetails02`). A chave no registry/`component` carrega o número (`ProductInfo03`). Em slots novos, `<Família>` = o nome FastStore sem sufixo (`Footer`, `Header`, `Spot`).
- Se o nome não casar nenhuma regra da tabela, **pergunte ao dev** qual seção/`selection`/`pagina` usar — não invente.
- **Se a pasta de preview já existir**, avise: pode ser stub legado com outra estrutura. Confirme com o dev se deve **sobrescrever** com a versão fiel do `.starter`.

## 3. Gerar o preview React (`index.tsx`)

Inverter o que o `/to-faststore` faz. Regras:

- **Remover o dinâmico:** `import`s de `@faststore/core` / `@faststore/core/experimental`, hooks VTEX (`useSuggestions`, `useCartToggleButton`, `useLazyQuery`, `ProfileChallenge`, `useWishList`, …), queries GraphQL, `withMock`, e `import type` de typings VTEX. Remover `'use client'` se não sobrar hook React.
- **Dados fixos e coerentes:** reaproveite o `mock.ts` da origem (inline como `const product = { … }`). Sem `mock.ts`, monte um objeto **realista para o contexto da página** (PDP → produto plausível: nome, SKU, preço/preço-de, avaliação, variações de cor/tamanho, specs, imagens `placehold.co` 4:5) cobrindo cada array/campo que sofre `.map()`/render (senão o preview fica vazio).
- **Assinatura:** `const <Família> = () => { … }; export default <Família>;` (ou `function`), recebendo `{ isMobile }` quando há layout mobile que valha previsualizar (contrato do renderer — `src/components/gerador/SortableItem/index.tsx`). `useState` leve (cor/tamanho selecionados, accordion aberto) é OK p/ o preview parecer real — **sem** `'use client'` (o registry já roda no bundle client; os templates existentes usam `useState` sem a diretiva).
- **Grafo completo de sub-componentes, inline, num arquivo só:** siga `manifest.json` → `dependencies.components` **recursivamente** (lidos no passo 0) e inline TODO o markup estático no mesmo `index.tsx`. **Não importe nem crie pastas por sub-componente.** Markup vindo de libs (`@faststore/ui`: `SkuSelector`, `QuantitySelector`, `Rating`, `Button`, `Swiper`…) deve ser **recriado como HTML semântico próprio** (ex.: pills de tamanho → `<ul><li><span>`; estrelas → 5 `<svg>`; galeria → coluna de `<img>` + dots), preservando as mesmas `var(--…)` p/ refletir os overrides. O que o original esconde (`display:none`, ex.: o QuantitySelector do `ProductBuy02`) pode ser omitido no preview.
- **Estrutura de wrapper:** espelhe o template irmão do slot (ex.: `${styles.container} component__container` + `container-type: inline-size` na raiz p/ as media queries virarem `@container`).
- **Estilos:** `import styles from './index.module.css'` e troque `className={style.x}` → `className={styles.x}`.

## 4. Converter SCSS → CSS Module plano (`index.module.css`)

O catálogo usa **CSS plano** (CSS Modules `.css`, PostCSS), não SCSS. Inverter as regras do `/to-faststore`:

- **Desaninhar:** `.pai { .filho {} }` → `.pai .filho {}` (reconstrua a cadeia de ancestrais).
- **`&`:** `&:hover` → repetir o seletor pai (`.x:hover`); idem `&::before`, `&:last-of-type`.
- **`@media` → `@container`:** extraia os aninhados para o topo (seletor completo desaninhado) e troque `@media (min/max-width: …)` por `@container (min/max-width: …)` — o preview roda num container com `container-type: inline-size` na raiz, então é a largura do componente (desktop/mobile do gerador) que importa, não a da viewport. Mantenha os mesmos breakpoints do original.
- **Eliminar SCSS-only:** variáveis `$x`, `@mixin`/`@include`/`@extend`, e funções (`darken()`, `lighten()`, `color-mix()` se o alvo não suportar) → resolver para CSS plano ou hex equivalente. Se aparecer algo que não dá para resolver, avise.
- **MANTER `var(--…)` verbatim** — é o que faz o preview refletir o tema e os overrides por instância.
- **Vencer o reset global da preview:** `src/styles/templates.css` tem `.preview__area input, .preview__area button, .preview__area ul, .preview__area li { border:none; background:none; list-style:none; … }` (especificidade `(0,1,1)`). Todo `<button>`/`<li>`/`<ul>`/`<input>` do componente que **precise** de `background`/`border`/`list-style` próprios precisa ganhar especificidade — **prefixe a regra com a classe raiz do componente** (ex.: `.productDetails .addToCart`, `.productDetails .sizeOption` → `(0,2,0)`). **Sem `!important`** (convenção — ver `ProductInfo01`). Elementos que QUEREM o reset (setas, header de accordion, swatches que usam `outline`) ficam sem prefixo.
- Referência de saída fiel: `src/components/templates/common/template_1/Header/index.module.css` e `product/template_3/ProductInfo/index.module.css` (componente grande, com o fix do reset).

## 5. Derivar o `variablesSchema` (núcleo)

Exponha **toda** CSS var component-scoped consumida pelo SCSS do componente e de TODAS as dependências (passo 0). Cada uma cai num de dois caminhos conforme o passo 1:

**Caminho A — herança (2 níveis).** Regex:
```
var\(\s*(--[\w-]+)\s*,\s*var\(\s*(--[\w-]+)\s*,\s*([^)]+)\)\s*\)
```
- **G1** = cssVar (`--footer-bg`); **G2** = token global herdado (`--background-footer`); **G3** = default (`#1A051C`).
- `default` = **G3**; `inheritsLabel` pela tabela abaixo; `backgroundVars` derivado de G2 (passo 6).

**Caminho B — fiel (1 nível).** Regex (capture só o que NÃO tem um segundo `var(` dentro — o que sobrou do A):
```
var\(\s*(--[\w-]+)\s*,\s*([^)]+)\)
```
- **G1** = cssVar (`--prod-info-btn-bg`); **G2** = default (`#121212`).
- `default` = **G2**; **omita** `inheritsLabel`; `backgroundVars: []`; **não** edite o `.starter`.

Para cada match, monte um `ComponentVariable` (`{ cssVar, label, type, default, group?, inheritsLabel? }` — tipo em `src/data/layoutData.ts`):

1. **Dedup** por cssVar (mantém a 1ª ocorrência; se o default divergir entre ocorrências, avise).
2. **`type`**: `"font"` se o token global ∈ {`--font-primary`,`--font-secundary`,`--font-tertiary`} **ou** o default tem `serif`/`sans-serif`/aspas; senão `"color"`. (Vale p/ A e B.)
3. **`default`** = o default do SCSS **verbatim/byte-idêntico** (A = G3; B = G2) — `pickChangedVariables` compara contra ele no export. Defaults `rgba(…)` ficam como rgba (o `ColorPicker` é hex-only, mas swatch e diff funcionam; converter pra hex quebraria o byte-idêntico).
4. **`inheritsLabel`** — **só no caminho A**, pela tabela fixa (preserve os typos). No caminho B, **omita o campo**.

   | G2 (token global) | `inheritsLabel` |
   | --- | --- |
   | `--background-primary-color` | "cor primária da marca" |
   | `--background-secundary-color` | "cor secundária da marca" |
   | `--background-tertiary-color` | "cor terciária da marca" |
   | `--background-footer` | "cor de fundo do rodapé" |
   | `--text-color-base` / `--text-primary-color` | "cor de texto primária" / "cor de texto base" |
   | `--text-color-secundary` / `--text-secundary-color` | "cor de texto secundária" |
   | `--text-color-footer` | "cor de texto do rodapé" |
   | `--font-primary` | "fonte primária" |
   | `--font-secundary` | "fonte secundária" |

5. **`label`/`group`** PT-BR por heurística do nome do cssVar (`topbar`→"Barra superior", `nav`→"Menu", `bg`→"Fundo …", `text`→"Texto …", `button`/`btn`→"Botão", `price`→"Preço", `title`→"Título", `rating`→"Avaliação", `variant`→"Variações", `badge`→"Selo", `newsletter`→"Newsletter", `font`/`title-font`→"Tipografia", `accent`→"Destaque", `legal`→"Barra legal"). **Proponha a tabela e confirme com o dev** antes de gravar (espelhe `Header01`, `Footer01`, `Spot01`, `ProductInfo01`/`ProductInfo03`). Componentes grandes podem passar de 15 itens — tudo bem.
6. **Não-vazio:** o array precisa ter ≥1 item (senão o lápis/painel não aparece — `ComponentVariablesPanel` só monta com `variablesSchema` não-vazio).
7. **Cross-check com o CSS gerado:** cada cssVar do schema deve realmente ser consumido pelo `index.module.css` (mesmo nome, mesmo default). Se uma zona temável ficou com valor cru (sem var), volte ao passo 1 ("quando PARAR e perguntar") — não gere schema com cssVar que o CSS não usa, nem deixe zona temável sem a var correspondente.

## 6. Registrar nos 3 lugares (ver `CLAUDE.md` → "Adding or editing a template")

1. **`src/utils/templateRegistry.ts`** — `import <Componente> from '@/components/templates/<pagina>/template_N/<Família>';` (no bloco do template N; `<Componente>` = chave com número, ex.: `ProductInfo03`; `<Família>` = pasta do slot, ex.: `ProductInfo` — passo 2) e adicione `<Componente>` ao objeto `TemplateRegistry`. A string-chave **deve** bater com o campo `component` (senão `SortableItem` cai no PNG placeholder).
2. **`src/data/layoutData.ts`** — `LayoutItem` na `LayoutSection` da seção mapeada:
   - `id`: o número livre do slot (`"03"`); `template`: o número (`"3"`); `selection`/`pagina`: do passo 2 (ambos do **passo 2**, não do sufixo FastStore).
   - `key`: **12 chars único** — gere e cheque colisão (`grep "key:" src/data/layoutData.ts`).
   - `component`: a chave do registry (`"ProductInfo03"`).
   - `platforms`: inclua `'VTEX'` (pergunte se também `'Tray'`/`'Wake'`).
   - `path`: do `manifest.id` do componente migrado (organism quando for bloco colocável, ex.: `"organisms/ProductDetails02"`) — **obrigatório p/ VTEX**; sem ele o `buildFaststoreConfigJson` descarta a entrada. Pode diferir do `component`.
   - `backgroundVars`: no **caminho A**, derive dos tokens de fundo herdados (`--background-footer`→`"footer"`, `--background-primary-color`→`"primary"`, `--background-secundary-color`→`"secondary"`, `--background-tertiary-color`→`"tertiary"`). No **caminho B** (fiel, sem herança), `[]`.
   - `image`/`mobile`: `""` (o preview substitui o PNG).
   - `variablesSchema`: o array do passo 5.

## 7. Atualizar docs/memória do catálogo

- Confirme que `memory/from-faststore.md` e `memory/per-component-variables.md` refletem o que foi feito.

## Verificação

1. `yarn lint` e `npx tsc --noEmit` (permitidos em `.claude/settings.local.json`) — garante que o import do registry, o `LayoutItem` e o CSS plano compilam (sem SCSS remanescente).
2. `yarn dev` → `/gerador`: plataforma **VTEX** + página certa → o **card renderiza o preview** (não o PNG) ⇒ registry+component casam. Selecione → o **lápis** abre ⇒ `variablesSchema` não-vazio. Mude uma cor/fonte → **preview muda ao vivo** ⇒ SCSS lê `var(--<comp-var>)`.
3. **Exportar** → no `config.json`, bloco `faststore` com `{ component: "organisms/<Nome>", title, key, variables? }`, e `variables` **só** com os valores alterados (via `pickChangedVariables`).

## Checklist final

- [ ] Origem + **grafo de dependências** lidos de `../faststore.starter/.../` (index.tsx + scss + mock.ts + manifest.json, recursivo)
- [ ] Destino: organism vs molecule decidido; `template_N`/`id`/sufixo = **próximo livre do slot**; pasta = família do slot
- [ ] Modo de var detectado: A (herança, 2 níveis) e/ou B (fiel, 1 nível) — sem aborto; só PARA p/ valor cru/token interno em zona temável
- [ ] Preview: sem hooks/GraphQL; dados fixos coerentes; **todo o grafo inline num só arquivo** (markup de `@faststore/ui` recriado); `{ isMobile }`; `import styles from './index.module.css'`
- [ ] SCSS → CSS plano (desaninhado, sem `&`/`$`/`@mixin`/funções SCSS; `@media`→`@container`; `var(--…)` mantidos); `button`/`li` com bg/border **prefixados com a classe raiz** (vence o reset da preview, sem `!important`)
- [ ] `variablesSchema` com **todas** as vars do componente: caminho A (com `inheritsLabel`+`backgroundVars`) ou B (sem `inheritsLabel`, `backgroundVars: []`); `default` byte-idêntico; labels confirmados com o dev
- [ ] Registrado em `templateRegistry.ts` (chave = `component`) e em `layoutData.ts` (`key` único, `path` p/ VTEX, `platforms` com `'VTEX'`, `backgroundVars`)
- [ ] `yarn lint` + `npx tsc --noEmit` limpos; preview, lápis e overrides ao vivo validados em `yarn dev`
