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

**Leva de 11/09, segunda metade — os 12 de atrito real**, os que dependiam de
`usePDP`/`useSearch`/`useSession` ou de resolver próprio:

| Catálogo (`component`) | Pasta no catálogo | `path` → `faststore.starter/src/components/…` | Swiper? |
|---|---|---|---|
| `ProductBanner01` | `product/template_1/ProductBanner` | `molecules/ProductDescriptionBanner01` | — |
| `CategoryTitle06` | `category/template_6/CategoryTitle` | `organisms/CategoryTitle06` | — |
| `CategoryDescription06` | `category/template_6/CategoryDescription` | `organisms/CategorySeoFaq06` | — |
| `CategoryTabs06` | `home/template_6/CategoryTabs` | `molecules/CategoryTabs06` | **sim** |
| `PopupNews06` | `home/template_6/PopupNews` | `organisms/PopupNews06` | — |
| `CategoryMain06` | `category/template_6/CategoryMain` | `organisms/MainCategory06` | — |
| `CategoryMain07` | `category/template_7/CategoryMain` | `organisms/MainCategory07` | — |
| `ProductReviews06` | `product/template_6/ProductReviews` | `organisms/TrustvoxReviews06` | — |
| `ProductInfo01` (repontado) | `product/template_1/ProductInfo` | `organisms/ProductDetails01` | **sim** (galeria) |
| `ProductInfo04` | `product/template_4/ProductInfo` | `organisms/ProductDetails07` | — |
| `ProductInfo05` | `product/template_5/ProductInfo` | `organisms/ProductDetails06` | **sim** |
| `ProductInfo07` | `product/template_7/ProductInfo` | `organisms/ProductDetails03` | **sim** (mobile) |

`Header07` e `Footer07` entraram na mesma leva: os itens já existiam, mas
apontavam para `Header06`/`Footer06` — o preview mostrava um componente e o tema
saía com outro.

Fora da leva de propósito: **`WiddeScript06`** (injeta script de terceiro, não tem
UI) e os **16 institucionais**, que exigem abrir o tipo de página `landingPage` em
toda a cadeia.

Nove componentes não tinham slot equivalente e ganharam **seção própria** no
painel: Ambientes, Newsletter, Compre por tamanho, Ajuda flutuante, Outras linhas,
Banner do produto, Título da categoria, Avaliações do produto, Abas de categoria e
Pop-up de newsletter. Criar uma seção custa três edições — a linha no tipo
`Layouts`, o bloco em `LAYOUTS` e o import no registry. `LayoutKey` é derivado e
`getPriorityOrder` já devolve 2 por default.

### Seis componentes eram INVISÍVEIS no palco, cada um por um motivo

Sem renderizar no `/dev-fidelity` não há 1:1 para provar. Nenhum deles precisou de
mudança de comportamento — só de dado ou de uma prop que o palco injeta:

| Componente | Por que não desenhava | Saída |
|---|---|---|
| `ProductDescriptionBanner01` | sem conteúdo de CMS | fallback de mock |
| `TrustvoxReviews06` | `return null` sem produto | desenha a CASCA (o interior é do widget) |
| `CategorySeoFaq06` | recusa mock de propósito (o `MOCK_ENABLED` é true em produção) | `PROPS_DE_PALCO` no DevFidelityStage |
| `ProductDetails01` | `usePDP()` volta null fora da PDP | mock próprio |
| `ProductDetails03` | idem | mock próprio |
| `MainCategory06` | `scoped` derivava do CAMINHO da página: `/dev-fidelity` virava uma coleção que não existe | `collectionUrl: '/'` no palco |

### O que a rota real fornece e o clone precisa re-adicionar

Três dos componentes usam peças NATIVAS do FastStore (`[data-fs-button]`,
`[data-fs-rating]`, `[data-fs-sku-selector]`). O skin de cada um só ajusta o que
quer mudar; o resto vem do CSS do core, que no catálogo não existe. O portão
achou cada pedaço pela diferença de caixa:

- `[data-fs-button-wrapper]` tem `border: 2px solid transparent` → **4px** de
  altura e 4px de largura (botão de filtros da PLP 06);
- o wrapper também carrega `padding: 4px 16px` e a tipografia 16/600/16 → 32px
  por botão no mobile da PDP 03, e 1px de altura no título das avaliações;
- `[data-fs-rating]` e `[data-fs-sku-selector]` trazem a própria caixa (flex,
  respiro, corpo) → a linha de avaliação fechava com altura 0.

Cada um está no CSS do clone num bloco marcado "o que, na rota real, vem do CSS
do CORE do FastStore", com o número que o portão mediu.

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
  mobile. Só cobre par com `data-role` espelhado dos DOIS lados — hoje **25**
  componentes e ~9.800 asserções. Os itens anteriores a esta leva seguem sem prova
  de 1:1 (ver `ACHADOS-EM-ABERTO.md`).

### O que o `2-fidelidade` aprendeu no caminho

Cada item abaixo entrou porque uma divergência MEDIDA provou que faltava. Nenhum
deles dispensa asserção; todos fazem os dois lados ficarem comparáveis:

1. **Sete linhas de base de shell.** `letter-spacing`, cor de `<a>` sem classe,
   cor e fonte herdadas do `<body>`, `line-height` herdado, `font-family` de
   controle de formulário e — a sétima — `padding`: o catálogo tem
   `* { padding: 0 }` no `globals.css` e o starter não zera o UA padding do
   `<button>`.
2. **Os dois lados medem no MESMO scrollport.** O clone mede primeiro e entrega a
   altura do iframe à origem. Para `position: sticky` isso não é detalhe: o
   `.mStickyCta` da PDP 07 ficava grampeado no rodapé de um scrollport e em fluxo
   no outro, com a mesma regra dos dois lados.
3. **Sondas de NÍVEL 1.** Cada var do `variablesSchema` recebe cor (ou família)
   única nos dois lados. Sem isso o portão era cego para o erro que mais importa
   no elo frágil do pipeline — ler a var errada: trocar `--pdp-title-color` por
   `--pdp-accent` dentro do `.price` passava verde, porque as duas caem no mesmo
   fallback de Nível 2.
4. **Espera pelas IMAGENS.** O card da PLP dimensiona a foto pelo arquivo; medir
   no meio do carregamento dava `h=337` num cartão e `h=18` no vizinho.
5. **`textoLivre` por rodízio**, não só por marca: a barra de avisos do Header07
   troca de mensagem num timer e os dois lados montam em instantes diferentes.
6. **`soDesktop`** para o par cuja origem não renderiza no mobile (PopupNews06
   tem guarda `min-width: 1025px`) — e a saída DIZ que aquele par mede um
   viewport só.

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
