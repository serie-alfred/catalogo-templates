# O catálogo de templates e sua relação com o `faststore.starter`

Este documento explica **o que é este catálogo, por que ele existe** e **como
encontrar, para cada componente do preview, o componente equivalente no projeto
`faststore.starter`** — usado como fonte da verdade de layout, configuração de
carrosséis (Swiper) e estilos.

## Por que este projeto existe

Este repositório (`catalogo-templates`) é uma **ferramenta de montagem visual de
temas de e-commerce**. Em `/gerador`, o usuário final:

1. Arrasta e escolhe componentes pré-prontos (header, vitrines, banners, footer…).
2. Ajusta variáveis visuais (cores, fontes) globais e por componente.
3. Vê uma **prévia navegável** do site (`/p/{id}/...`) e/ou **exporta** um
   `config.json`.

Esse `config.json` é depois consumido por um **sistema downstream separado** (o
gerador de tema propriamente dito), que materializa a loja real. **Este repo só
produz a UI do catálogo, as prévias e o JSON — ele não gera o tema publicado.**

Ou seja: os componentes daqui são **réplicas visuais** (mock, sem dados reais) dos
componentes reais que existem na plataforma de destino. Para a plataforma **VTEX**,
a plataforma de destino é o **FastStore**, cujos componentes vivem no projeto irmão
`faststore.starter`.

```
e-temas/
├── catalogo-templates/           ← este projeto (mock/preview + JSON)
├── faststore.starter/            ← componentes REAIS da VTEX FastStore (referência)
├── produtos-template-generator/  ← monta o tema a partir do config.json
└── global-templates/             ← catálogo Tray/Wake (trilha legada)
```

Os quatro são repositórios git independentes, lado a lado. O mapa completo está em
[../../CLAUDE.md](../../CLAUDE.md).

## Como os componentes do catálogo são organizados

- Os componentes de template ficam em `src/components/templates/{common,home,category,product}/template_N/<Nome>/` (`index.tsx` + `index.module.css`).
- Cada um é registrado em [src/utils/templateRegistry.ts](../src/utils/templateRegistry.ts) com um nome tipo `Showcase01`, `Header03`, `Spot04`… onde **o número = o `template_N`** da pasta (`Showcase01` = `home/template_1/Showcase`, `Showcase03` = `home/template_3/Showcase`, etc.).
- O que o usuário pode escolher é definido em [src/data/layoutData.ts](../src/data/layoutData.ts). Cada `LayoutItem` declara:
  - `component`: a chave no `TemplateRegistry` (ex.: `"Showcase01"`).
  - `platforms`: quais plataformas suportam aquele item (`'Tray' | 'Wake' | 'VTEX'`).
  - **`path`**: o caminho do componente equivalente **no `faststore.starter`** (ex.: `"organisms/ProductShelfCustom01"`). **Só itens com plataforma `VTEX` têm `path`.**

## Como achar o componente de referência no `faststore.starter`

Para qualquer componente do preview cujo item em `layoutData.ts` tenha `'VTEX'` em
`platforms`:

1. Abra [src/data/layoutData.ts](../src/data/layoutData.ts) e localize o `LayoutItem` (pelo `component`).
2. Leia o campo **`path`** dele.
3. O componente de referência está em **`../faststore.starter/src/components/<path>/`**.

Exemplo: o item `component: "Showcase01"` tem `path: "organisms/ProductShelfCustom01"`
→ a referência é `../faststore.starter/src/components/organisms/ProductShelfCustom01/`
(`index.tsx` + `style.module.scss`).

> Repare na "tradução" de nomes: o catálogo usa nomes genéricos de marketing
> (`Showcase`, `Spot`, `Brand`) e o FastStore usa os nomes técnicos da plataforma
> (`ProductShelfCustom`, `ProductCard`, `Brands`). O `path` é o que amarra os dois.

## Mapa dos componentes VTEX (catálogo → faststore.starter)

| Catálogo (`component`) | Pasta no catálogo | `path` → `faststore.starter/src/components/…` | Swiper? |
|---|---|---|---|
| `Header01/03/04/05/06/07` | `common/template_N/Header` | `organisms/Header0N` | Header06 sim |
| `Spot01/03/04/05/06/07` | `common/template_N/Spot` | `molecules/ProductCard0N` | — |
| `Breadcrumb01` | `common/.../Breadcrumb` | `overrides/Breadcrumb01` | — |
| `Footer01/03/04/05/06/07` | `common/template_N/Footer` | `organisms/Footer0N` | Footer03 sim |
| `BannerFull01` | `home/template_1/BannerFull` | `atoms/BannerFull01` | — |
| `Brand01` | `home/template_1/Brand` | `molecules/Brands01` | **sim** |
| `Categories01` | `home/template_1/Categories` | `molecules/Categories01` | **sim** |
| `BannerMain01/06` | `home/template_N/BannerMain` | `organisms/BannerMain0N` | **sim** |
| `Ruler01` | `home/template_1/Ruler` | `molecules/Ruler01` | **sim** |
| `BannerGrid01` | `home/.../BannerGrid` | `molecules/BannerGrid01` | — |
| `BannerSide01` | `home/.../BannerSide` | `molecules/BannerSide01` | — |
| `Showcase01/03/04/05/06/07` | `home/template_N/Showcase` | `organisms/ProductShelfCustom0N` | **sim** |
| `TextArea` | `home/template_1/TextArea` | `molecules/TextArea` (`override: true`) | — |
| `CategoryMain01` | `category/template_1/CategoryMain` | `organisms/MainCategory01` | **sim** (filtros) |
| `CategoryDescription01` | `category/.../CategoryDescription` | `organisms/DescriptionCategory01` | — |
| `ProductDescription01` | `product/.../ProductDescription` | `molecules/ProductDescription01` | — |
| `ProductInfo01` | `product/template_1/ProductInfo` | `molecules/ProductInfo01` (galeria: `molecules/ProductGallery01`) | **sim** (galeria) |
| `ProductInfo03` | `product/template_3/ProductInfo` | `organisms/ProductDetails02` (galeria embutida, não é componente à parte) | **sim** (galeria) |
| `ProductRelated01` | `product/template_1/ProductRelated` | `organisms/ProductShowcase01` | **sim** |

**Leva de 11/09 — 12 pares novos, todos com prova de 1:1** (estágio `2-fidelidade`
do funil, desktop e mobile):

| Catálogo (`component`) | Pasta no catálogo | `path` → `faststore.starter/src/components/…` | Swiper? |
|---|---|---|---|
| `Ruler03` | `home/template_3/Ruler` | `molecules/BenefitsStrip07` | — |
| `ClientReview07` | `home/template_7/ClientReview` | `molecules/SocialProof07` | — |
| `BannerSoloLeft07` | `home/template_7/BannerSoloLeft` | `molecules/EditorialBanner07` | — |
| `Categories07` | `home/template_7/Categories` | `molecules/Categories07` | — |
| `BannerSide06` | `home/template_6/BannerSide` | `molecules/BannerSide06` | — |
| `BannerMain07` | `home/template_7/BannerMain` | `organisms/BannerMain07` | — |
| `ShopByRoom07` | `home/template_7/ShopByRoom` | `organisms/ShopByRoom07` | — |
| `Newsletter07` | `home/template_7/Newsletter` | `organisms/Newsletter07` | — |
| `BuySize06` | `home/template_6/BuySize` | `molecules/Categories06` | — |
| `HelpFloat06` | `home/template_6/HelpFloat` | `organisms/HelpFloatButton06` | — |
| `BannerGrid06` | `home/template_6/BannerGrid` | `molecules/BannerGrid06` | **sim** |
| `BannerCarousel06` | `home/template_6/BannerCarousel` | `molecules/BannerCarousel06` | **sim** |

Cinco deles não tinham slot equivalente e ganharam **seção própria** no painel:
Ambientes, Newsletter, Compre por tamanho, Ajuda flutuante e Outras linhas. Criar
uma seção custa três edições — a linha no tipo `Layouts`, o bloco em `LAYOUTS` e o
import no registry. `LayoutKey` é derivado e `getPriorityOrder` já devolve 2 por
default.

> ⚠️ **O tipo `Layouts` PARECE duplicar as chaves de `LAYOUTS` e não duplica.** Trocá-lo
> por `typeof LAYOUTS` quebra a compilação: é a anotação que ALARGA os literais do
> `as const` para `LayoutItem`. Sem ela, `variablesSchema` some dos itens que não o
> declaram e `platforms` vira tupla de literais. Testado em 11/09; a linha a mais é o
> preço certo.

## Duas armadilhas de conversão que custaram caro

**1. `@container` que mira a própria raiz nunca casa.** Um elemento não consulta o
próprio container. Se a raiz do componente carrega o `container-type` e as regras
responsivas miram essa mesma raiz, elas são CSS válido que nunca aplica — falha
100% silenciosa. Aconteceu duas vezes na leva (`BannerSide06` e `BannerGrid06`,
este com 32px de diferença em 13 caixas). O conserto é um `<div>` nu com
`container-type: inline-size` por fora.

**2. Componente `position: fixed` mantém `@media`.** `HelpFloatButton06` é overlay
ancorado na viewport: não tem coluna cujo tamanho consultar, e um `@container`
mediria um ancestral que não governa nada. Dentro do iframe do canvas a viewport já
é 1440/375.

## Dois portões que provam o que antes era afirmação

- **`1-variaveis`** (estático): toda `cssVar` do `variablesSchema` é consumida pelo CSS,
  todo `default` é um dos Níveis 3 declarados, e nenhum template lê token interno do
  e-temas. Achou 16 defeitos na primeira execução.
- **`2-fidelidade`** (browser): casa nó a nó, por `data-role`, o componente real do
  starter (`/dev-fidelity`) com a réplica daqui (iframe do `/gerador`), em desktop e
  mobile. Só cobre par com `data-role` espelhado dos DOIS lados — hoje os 12 acima.
  Os itens anteriores seguem sem prova de 1:1 (ver `ACHADOS-EM-ABERTO.md`).

> Componentes de templates **sem** `'VTEX'` em `platforms` (ex.: `Ruler02/04/05`,
> `HomeCarousel06`, `ProductInfo02`, `BannerTripleSwiper05`) não têm `path` — são variantes
> exclusivas de Tray/Wake. Mas **"sem `path`" não significa "não existe no starter"**: antes de
> concluir que não há referência, procure pelo nome técnico em
> `../faststore.starter/src/components/`. Foi assim que `Showcase06/07`, `Spot06/07`, `Header07`,
> `Footer07`, `BannerMain06` e `TextArea` ganharam `path` — o equivalente já estava lá.
>
> Para checar um `path` novo sem subir nada, use as classes REAIS do generator
> (`AssetRegistry` + `DependencyResolver`) contra o starter: se o `resolve` não estourar, o
> `manifest.json` daquele componente e de todo o grafo abaixo dele está completo. Um `path` que
> não resolve derruba a geração do tema inteiro, não só aquele componente.

## Regra de ouro para carrosséis (Swiper)

Os componentes de preview que exibem carrosséis devem usar o **Swiper real**
(biblioteca `swiper`) com **a mesma configuração e o mesmo visual** do componente
de referência no `faststore.starter`:

- Config a espelhar do faststore: `modules` (Pagination/Navigation/Autoplay/Thumbs…),
  `slidesPerView`, `breakpoints`, `spaceBetween`, `loop`, `autoplay`, paginação e
  setas custom (com `isBeginning`/`isEnd` via `useRef`).
- **Diferença importante:** o catálogo é **mock** — não busca produtos (`useProductsQuery`),
  não tem skeletons nem `useAuth`. Copie do faststore **apenas** a config do Swiper e
  os estilos; mantenha o conteúdo mock (ex.: `Spot`, imagens placeholder).
- Estilos: no CSS Module, estilize as classes globais do Swiper com
  `:global(.swiper-pagination-bullet)` etc. **Nunca hardcode** cores/fontes que hoje
  vêm de CSS custom properties de tema (ex.: `var(--text-primary-color, …)`,
  `--background-primary-color-safe`, `--font-primary`).

**Padrão canônico de referência no catálogo:**
[`src/components/templates/home/template_1/Showcase/`](../src/components/templates/home/template_1/Showcase/)
— convertido a partir de `faststore.starter/src/components/organisms/ProductShelfCustom01`.
Use-o como modelo ao converter/ajustar outros carrosséis.
