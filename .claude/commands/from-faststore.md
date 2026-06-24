# Trazer componente do FastStore para o catálogo (preview)

Ingere um componente VTEX FastStore do projeto irmão **`faststore.starter`** (`.starter`) para dentro deste catálogo: gera a **versão preview** (React com dados fixos, sem VTEX/GraphQL/hooks), registra no `TemplateRegistry` e cria a entrada em `layoutData.ts` — derivando o `variablesSchema` a partir do SCSS padronizado. É o par downstream do comando `/to-faststore` do `.starter`.

Argumento: `$ARGUMENTS` = nome do componente (`Footer04`, `Header01`) ou caminho do `index.tsx`. Origem default: `../faststore.starter`.

## 0. Resolver e ler a origem

1. Localize a pasta do componente no `.starter`, varrendo os kinds: `../faststore.starter/src/components/{atoms,molecules,organisms,overrides}/$ARGUMENTS/`. Se o usuário passou um caminho, use-o. Se não achar, **aborte** listando onde procurou.
2. Leia da pasta de origem:
   - `index.tsx` — estrutura/props/hooks a remover.
   - `style.module.scss` — vira o CSS do preview e a fonte do `variablesSchema`.
   - `mock.ts` (se existir) — **fonte dos dados fixos** do preview.
   - `manifest.json` (se existir) — o `id` (ex.: `organisms/Footer04`) dá o **`path` VTEX** exato.

## 1. Gate de pré-condição (cor) — NÃO PULAR

A derivação do `variablesSchema` só funciona se o SCSS seguir o **fallback encadeado** do `.starter` (ver `faststore.starter/CLAUDE.md` → "CSS Module Conventions"). Verifique no `style.module.scss`:

- ✅ **Conforme:** as cores/fontes de tema aparecem como `var(--<secao>-<papel>, var(--<token-global>, #hex))` (ex.: `var(--footer-bg, var(--background-footer, #1A051C))`).

- ❌ **Não-conforme — Caso A (paleta local):** o componente declara uma paleta local no topo do seletor raiz (ex.: `--f3-ink: #000;`, `--f4-paper: #fff;`) e a consome como `var(--f3-ink)` **sem** a cadeia de 2 níveis para um token global. Os vars `--f<N>-*` de **cor** (tinta, papel, acento) precisam ser removidos; substitua cada uso pela cadeia completa `var(--<secao>-<papel>, var(--<token-global>, #hex))`. Vars estruturais (`--f<N>-grey-NN`, `--f<N>-ease`, `--f<N>-hairline`, `--f<N>-mono`) são **isentos** — podem permanecer como locais.

- ❌ **Não-conforme — Caso B (tokens internos do catálogo):** o SCSS usa `var(--paper)`, `var(--ink)`, `var(--accent)`, `var(--font-body)` ou `var(--font-display)` diretamente. Esses são tokens de `catalogo-templates/src/styles/globals.css` — **não são brand tokens** do `template-generator` e não existem fora do catálogo. Precisam ser substituídos pela cadeia `var(--<secao>-<papel>, var(--<token-global>, #hex))` antes de importar.

- ❌ **Não-conforme — Caso C (hardcoded sem cadeia):** uma zona temável (ex.: `.siteHeader`, `.newsletter`) tem `background: rgba(255,255,255,0.96)` ou hex direto **fora de qualquer `var()`**. Isso significa que o painel não consegue mudar essa propriedade mesmo que `variablesSchema` declare o cssVar. Corrija para `var(--<secao>-bg, var(--<token-global>, <valor-original>))` antes de importar.

- ❌ **Não-conforme — Caso D (neutral estrutural em zona temável):** uma zona semântica relevante (ex.: `.newsletter`, `.legal`, `.siteHeader`) usa `background: var(--f<N>-grey-NN)` em vez de uma cadeia de brand token. `--f<N>-grey-NN` é um neutral estrutural — o painel não o expõe. Se a zona deve ser temável, promova para `var(--<secao>-newsletter-bg, var(--background-primary-color, #f4f4f4))` (e adicione a entrada ao `variablesSchema`) antes de importar.

Se qualquer caso acima for detectado, **NÃO derive o `variablesSchema`**. Emita:

> "`$ARGUMENTS` não segue o padrão de cores do `.starter` (motivo: Caso X). Padronize o SCSS primeiro (veja `faststore.starter/CLAUDE.md` e o exemplo de `Footer01`/`Header01`), rodando o ajuste no `.starter`. Posso: (a) gerar só o preview + registro **sem** painel de variáveis, ou (b) parar aqui. Como prefere?"

Nunca invente cssVars que o SCSS não consome — isso quebra o contrato com o `template-generator`.

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

- `template_N`: sufixo numérico do nome (`Footer04` → `template_4`). A pasta do preview é `src/components/templates/<pagina>/template_N/<NomeSemSufixo>/` (ex.: `common/template_4/Footer`). O **nome lógico da pasta é sem sufixo** (`Footer`, `Header`, `Spot`); a chave no registry/`component` **carrega** o sufixo (`Footer04`).
- Se o nome não casar nenhuma regra, **pergunte ao dev** qual seção/`selection`/`pagina` usar — não invente.
- **Se a pasta de preview já existir** (ex.: `common/template_4/Footer`), avise: pode ser stub legado com outra estrutura. Confirme com o dev se deve **sobrescrever** com a versão fiel do `.starter`.

## 3. Gerar o preview React (`index.tsx`)

Inverter o que o `/to-faststore` faz. Regras:

- **Remover o dinâmico:** `import`s de `@faststore/core` / `@faststore/core/experimental`, hooks VTEX (`useSuggestions`, `useCartToggleButton`, `useLazyQuery`, `ProfileChallenge`, `useWishList`, …), queries GraphQL, `withMock`, e `import type` de typings VTEX. Remover `'use client'` se não sobrar hook React.
- **Dados fixos:** reaproveite o `mock.ts` da origem — inline o objeto como `const data = { ... }` no preview (ou copie o literal) e renderize a partir dele. Se não houver `mock.ts`, monte um objeto de exemplo cobrindo cada array/campo que sofre `.map()`/render (senão o preview fica vazio).
- **Assinatura:** `export default function <Nome>({ isMobile }: { isMobile?: boolean })`. Mantenha `isMobile` (contrato do renderer — `src/components/gerador/SortableItem/index.tsx`) e use-o se houver layout mobile que valha previsualizar.
- **Sub-componentes do mesmo sufixo** (ex.: `Footer01` importa `Newsletter01`): inline o markup estático no preview (o catálogo não tem o grafo de `manifest.json`). Mantenha autossuficiente.
- **Estilos:** `import styles from './index.module.css'` e troque `className={style.x}` → `className={styles.x}`.

## 4. Converter SCSS → CSS Module plano (`index.module.css`)

O catálogo usa **CSS plano** (CSS Modules `.css`, PostCSS), não SCSS. Inverter as regras do `/to-faststore`:

- **Desaninhar:** `.pai { .filho {} }` → `.pai .filho {}` (reconstrua a cadeia de ancestrais).
- **`&`:** `&:hover` → repetir o seletor pai (`.x:hover`); idem `&::before`, `&:last-of-type`.
- **`@media` aninhados:** extrair para o topo, com o seletor completo desaninhado.
- **Eliminar SCSS-only:** variáveis `$x`, `@mixin`/`@include`/`@extend`, e funções (`darken()`, `lighten()`, `color-mix()` se o alvo não suportar) → resolver para CSS plano ou hex equivalente. Se aparecer algo que não dá para resolver, avise.
- **MANTER `var(--…)` verbatim** — é o que faz o preview refletir o tema e os overrides por instância.
- Referência de saída fiel: `src/components/templates/common/template_1/Header/index.module.css`.

## 5. Derivar o `variablesSchema` (núcleo)

Regex sobre o `style.module.scss` conforme:

```
var\(\s*(--[\w-]+)\s*,\s*var\(\s*(--[\w-]+)\s*,\s*([^)]+)\)\s*\)
```

- **G1** = cssVar de Nível 1 (`--footer-bg`, `--header-topbar-bg`, …).
- **G2** = token global herdado (`--background-footer`, `--text-color-base`, `--font-secundary`, …).
- **G3** = default (`#1A051C`, `'Poppins', sans-serif`, …).

Para cada match, monte um `ComponentVariable` (`{ cssVar, label, type, default, group?, inheritsLabel? }` — tipo em `src/data/layoutData.ts`):

1. **Dedup** por G1 (mantém a 1ª ocorrência; se o default divergir entre ocorrências, avise).
2. **`type`**: `"font"` se G2 ∈ {`--font-primary`,`--font-secundary`,`--font-tertiary`} ou o default tem `serif`/`sans-serif`/aspas; senão `"color"`.
3. **`default`** = G3 **verbatim** (precisa ser byte-idêntico ao fallback do SCSS — `pickChangedVariables` compara contra ele no export).
4. **`inheritsLabel`** pela tabela fixa (preserve os typos):

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

5. **`label`/`group`** PT-BR por heurística do nome do cssVar (`topbar`→"Barra superior", `nav`→"Menu", `bg`→"Fundo …", `text`→"Texto …", `button`/`btn`→"Botão"/"Newsletter", `newsletter`→"Newsletter", `font`/`title-font`→"Tipografia", `accent`→"Destaque", `legal`→"Barra legal"). **Proponha a tabela e confirme com o dev** antes de gravar (espelhe o estilo das schemas-base: `Header01`, `Footer01`, `Spot01`).
6. **Validação cruzada:** cada G1 deve aparecer só em cadeias de 2 níveis; nunca como `var(--X)` sozinho com default divergente. O resultado precisa ser **não-vazio** (senão o lápis/painel não aparece — `ComponentVariablesPanel` só monta com `variablesSchema` não-vazio).
7. **Vars no schema mas ausentes no SCSS (Caso C retroativo):** após derivar o array, grep cada G1 no SCSS. Se um cssVar esperado (ex.: `--header-bg`) aparece no schema mas o SCSS tem um valor hardcoded ou token estrutural naquela zona, isso é o Caso C/D do Gate — **inclua na lista de correções necessárias** antes de gravar (não gere o schema sem o SCSS corrigido).
8. **Fundo de zonas com neutral estrutural (Caso D retroativo):** se `.newsletter`, `.siteHeader`, `.legal` ou zona equivalente usar `background: var(--f<N>-grey-NN)` em vez de um brand var, sinalize. Só é aceitável deixar como structural se a zona for puramente decorativa e nunca precisar de override de marca.

## 6. Registrar nos 3 lugares (ver `CLAUDE.md` → "Adding or editing a template")

1. **`src/utils/templateRegistry.ts`** — `import <Nome> from '@/components/templates/<pagina>/template_N/<NomeSemSufixo>';` (no bloco do template N) e adicione `<Nome>` ao objeto `TemplateRegistry`. A string-chave **deve** bater com o campo `component` (senão `SortableItem` cai no PNG placeholder).
2. **`src/data/layoutData.ts`** — `LayoutItem` na `LayoutSection` da seção mapeada:
   - `id`: o sufixo (`"04"`); `template`: o número (`"4"`); `selection`/`pagina`: do passo 2.
   - `key`: **12 chars único** — gere e cheque colisão (`grep "key:" src/data/layoutData.ts`).
   - `component`: a chave do registry (`"Footer04"`).
   - `platforms`: inclua `'VTEX'` (pergunte se também `'Tray'`/`'Wake'`).
   - `path`: do `manifest.id` (`"organisms/Footer04"`) — **obrigatório p/ VTEX**; sem ele o `buildFaststoreConfigJson` descarta a entrada.
   - `backgroundVars`: derive dos tokens de fundo usados no SCSS (`--background-footer`→`"footer"`, `--background-primary-color`→`"primary"`, `--background-secundary-color`→`"secondary"`, `--background-tertiary-color`→`"tertiary"`).
   - `image`/`mobile`: `""` (o preview substitui o PNG).
   - `variablesSchema`: o array do passo 5.

## 7. Atualizar docs/memória do catálogo

- Confirme que `memory/from-faststore.md` e `memory/per-component-variables.md` refletem o que foi feito.

## Verificação

1. `yarn lint` e `npx tsc --noEmit` (permitidos em `.claude/settings.local.json`) — garante que o import do registry, o `LayoutItem` e o CSS plano compilam (sem SCSS remanescente).
2. `yarn dev` → `/gerador`: plataforma **VTEX** + página certa → o **card renderiza o preview** (não o PNG) ⇒ registry+component casam. Selecione → o **lápis** abre ⇒ `variablesSchema` não-vazio. Mude uma cor/fonte → **preview muda ao vivo** ⇒ SCSS lê `var(--<comp-var>)`.
3. **Exportar** → no `config.json`, bloco `faststore` com `{ component: "organisms/<Nome>", title, key, variables? }`, e `variables` **só** com os valores alterados (via `pickChangedVariables`).

## Checklist final

- [ ] Origem lida de `../faststore.starter/.../$ARGUMENTS/` (index.tsx + scss + mock.ts + manifest.json)
- [ ] Gate de cor passou (SCSS conforme) — sem Caso A (paleta local), B (tokens internos), C (hardcoded sem var), D (neutral em zona temável) — ou tratado com o dev
- [ ] Preview gerado: sem hooks/GraphQL, dados fixos do mock, `{ isMobile }`, `import styles from './index.module.css'`
- [ ] SCSS convertido para CSS plano (desaninhado, sem `&`/`@container`/`$`/`@mixin`/funções SCSS), `var(--…)` mantidos
- [ ] `variablesSchema` derivado por regex; `default` byte-idêntico ao SCSS; labels confirmados com o dev
- [ ] Registrado em `templateRegistry.ts` (chave = `component`) e em `layoutData.ts` (`key` único, `path` p/ VTEX, `platforms` com `'VTEX'`, `backgroundVars`)
- [ ] `yarn lint` + `npx tsc --noEmit` limpos; preview e lápis validados em `yarn dev`
