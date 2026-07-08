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
Documentos/Projetos/Produtos/
├── catalogo-templates/     ← este projeto (mock/preview + JSON)
└── faststore.starter/      ← componentes REAIS da VTEX FastStore (referência)
```

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
| `Header01/03/04/05/06` | `common/template_1/3/4/5/6/Header` | `organisms/Header0N` | Header06 sim |
| `Spot01/03/04/05` | `common/template_N/Spot` | `molecules/ProductCard0N` | — |
| `Breadcrumb01` | `common/.../Breadcrumb` | `overrides/Breadcrumb01` | — |
| `Footer01/03/04/05/06` | `common/template_N/Footer` | `organisms/Footer0N` | Footer03 sim |
| `BannerFull01` | `home/template_1/BannerFull` | `atoms/BannerFull01` | — |
| `Brand01` | `home/template_1/Brand` | `molecules/Brands01` | **sim** |
| `Categories01` | `home/template_1/Categories` | `molecules/Categories01` | **sim** |
| `BannerMain01` | `home/template_1/BannerMain` | `organisms/BannerMain01` | **sim** |
| `Ruler01` | `home/template_1/Ruler` | `molecules/Ruler01` | **sim** |
| `BannerGrid01` | `home/.../BannerGrid` | `molecules/BannerGrid01` | — |
| `BannerSide01` | `home/.../BannerSide` | `molecules/BannerSide01` | — |
| `Showcase01/03/04/05` | `home/template_N/Showcase` | `organisms/ProductShelfCustom0N` | **sim** |
| `CategoryMain01` | `category/template_1/CategoryMain` | `organisms/MainCategory01` | **sim** (filtros) |
| `CategoryDescription01` | `category/.../CategoryDescription` | `organisms/DescriptionCategory01` | — |
| `ProductDescription01` | `product/.../ProductDescription` | `molecules/ProductDescription01` | — |
| `ProductInfo01` | `product/template_1/ProductInfo` | `molecules/ProductInfo01` (galeria: `molecules/ProductGallery01`) | **sim** (galeria) |
| `ProductInfo03` | `product/template_3/ProductInfo` | `organisms/ProductDetails02` (galeria: `molecules/ProductGallery02`) | **sim** (galeria) |
| `ProductRelated01` | `product/template_1/ProductRelated` | `organisms/ProductShowcase01` | **sim** |

> Componentes de templates **sem** `'VTEX'` em `platforms` (ex.: `Showcase02/06/07`,
> `Ruler02`, `HomeCarousel06`, `ProductInfo02`, `BannerTripleSwiper05`) **não têm**
> referência no `faststore.starter` — são variantes exclusivas de Tray/Wake.

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
