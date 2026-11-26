# Inventário: o que o lojista edita depois do tema publicado (Wake 2.0 / Design Studio)

> Investigação só-leitura em `../global-templates` (branch `main`, estado em 26/11/2026) e,
> para o lado do catálogo, em `src/data/layoutData.ts`, `src/data/conteudo/schemas.generated.json`
> e nos componentes de `src/components/templates/**` deste repo. Nenhum arquivo foi alterado.
>
> **Método:** `find Wake -iname "*.schema.json"` deu a lista exata de seções que são bloco do
> Design Studio (presença do arquivo = bloco; ausência = fixo no tema). Cada achado foi conferido
> no HTML (`block_data ?? {}`, `api-content`, `common?.menu_groups`) e, para a regra da categoria,
> no gerador (`produtos-template-generator/src/platforms/wake/services/processors/designStudio.js`
> e `index.js`), que é quem realmente decide o que vira bloco e onde.

## 0. Achado que corrige o README do `global-templates`

O `README.md` do `global-templates` (linha 123, escrita em 09/11/2026 — `git blame` confirma) diz:
"Não são bloco: PDP, **categoria**, header/footer/breadcrumb/spot e os globais". Isso está
**desatualizado**: os commits `8231c9e2` e `15f8f67b` (17/11/2026, "categorias 09 a 16 editáveis no
Design Studio") adicionaram `<selection>.schema.json` às três/quatro seções de **todas** as páginas
de categoria do catálogo (exceto as pastas mais antigas que nunca tiveram `category-description`/
`category-title`). Confirmado em disco: há 30 arquivos `category-*.schema.json` em
`Wake/Category/template_{1,2,6,7,9,10,11,12,13,14,15,16,17}/`. PDP e Common continuam mesmo —
nenhum arquivo `*.schema.json` existe em `Wake/Product/**` nem em `Wake/Common/**` (confirmado por
busca exaustiva). Ou seja: **a frase do README vale para PDP e Common, não vale mais para
categoria.**

## 1. Página de Produto (PDP) — confirmação exaustiva: NENHUM bloco

Varredura em `Wake/Product/template_{1,2,3,4,6,7,9,10,11,12,13,14,15,16,17}/*` (15 famílias com
pasta `Product`): **zero** arquivos `*.schema.json`. Os componentes existentes são
`product-info`, `product-description`, `product-related`, `product-reviews`, `banner-top`
(só template_1), `product-banner` (só template_1). Nenhum HTML lê `block_data`.

Isso confirma a afirmação do usuário: **a Wake não tem CMS/Design Studio na PDP.** Tudo que esses
componentes mostram cai em uma de três origens, nenhuma delas é o painel "Conteúdo" do catálogo
depois do tema publicado:

| Origem | O que é | Exemplo |
| --- | --- | --- |
| **Cadastro do produto** (nativo da Wake, fora do tema) | nome, descrição, preço, fotos, variações, SKU | `p.name`, `p.images`, atributos/variações |
| **Fixo no código do tema** (o que o generator escreveu a partir do `config.json`, na hora da geração — nunca mais muda) | rótulos de botão, textos de frete/parcelamento, placeholders, acordeões de política | `buyLabel` ("Comprar"), `shippingLabel`, `cepHelpLabel`, `soldOutText`, `notifySuccess` |
| **Nada** (campo nem existe na Wake) | — | — |

Exemplo concreto — `src/components/templates/product/template_9/ProductInfo/index.tsx` declara
`ProductInfo09Conteudo` com 17 campos de rótulo (`newLabel`, `refLabel`, `colorLabel`, `sizeLabel`,
`sizeGuideLabel`, `soldOutText`, `notifyLabel`, `notifyNamePlaceholder`, `notifyEmailPlaceholder`,
`notifySubmitLabel`, `notifySuccess`, `buyLabel`, `shippingLabel`, `cepPlaceholder`,
`cepButtonLabel`, `cepHelpLabel`, `cepHelpUrl`, `accordions[]`). **Todos** esses campos, na Wake,
viram texto estático no tema gerado — editáveis pelo CS **antes** do export (no painel do
catálogo), mas **não** pelo lojista **depois** de publicado. `ProductDescription09Conteudo`
(`eyebrow`, `title`, `titleEmphasis`, `specsLabel`, `hiddenSpecs`) e `ProductRelated` (sem campos de
texto próprios — usa o Card da loja) seguem a mesma regra.

O `README.md` do `global-templates` confirma a razão arquitetural no item 25 do checklist: "Promessa
de política da loja sai vazia onde o lojista não edita. [...] na PDP e no FAQ de categoria (que não
são bloco do Design Studio) [nota: a frase da categoria está desatualizada, ver §0] [...] a
variável fica `""`" — ou seja, o próprio generator sabe que não pode prometer frete grátis/prazo em
nome do lojista num campo que ele nunca vai poder editar.

**`CategoryTitle`/`ProductReviews` como singleton só-Tray:** `category-title` e `product-reviews`
são `SINGLETONS_DA_TRAY` no catálogo (`sectionRules.ts`) porque o generator da Tray não instancia
cópias fora da Home — isso não muda a conclusão acima para a Wake (PDP sem CMS).

## 2. Página de Categoria — bloco existe, mas é UM só para TODAS as categorias

### 2.1 O que tem schema.json (= é bloco)

| Template | `category-main` | `category-description` | `category-title` | `category-banner` |
| --- | --- | --- | --- | --- |
| 1 | ✅ | ✅ | — | — |
| 2 | ✅ | — | — | ✅ |
| 6 | ✅ | ✅ | ✅ | — |
| 7 | ✅ | — | — | — |
| 9–17 | ✅ | ✅ | ✅ | — |

(`template_17` tem `category-description`/`category-main`/`category-title`, igual a 9–16.)

### 2.2 A pegadinha arquitetural: não é "por categoria", é "a categoria genérica inteira"

Em `produtos-template-generator/src/platforms/wake/services/processors/designStudio.js` +
`index.js` (linhas 361–383): as seções de categoria viram bloco do MESMO jeito que a home
(`gravarBloco`), mas são registradas em `content_for_page` da entrada **`{ type: "hotsite" }`**
genérica do `Configs/pages.json` — a rota que atende **"categorias, marcas e hotsites que nenhuma
rota custom pega"** (comentário do próprio arquivo, linhas 56–61). **Isso significa que o lojista
edita o layout de categoria UMA vez no Design Studio, e essa mesma edição aparece em TODAS as
categorias da loja** — não existe "editar a categoria Vestidos" separado de "editar a categoria
Calçados" no nível do bloco. Além disso, `index.js` só liga o Design Studio na categoria quando
**todas** as seções de categoria da família viraram bloco (linha 374–379); se faltar uma, a página
toda fica sem o editor e sai um aviso no log do generator.

Dentro desse bloco único, o que MUDA por categoria vem de outro lugar — o próprio dado da
categoria na Wake (nome, contagem de produtos, subcategorias, produtos listados), lido pelo tema
independente do `block_data`. Exemplo, `category-title` do template 9
(`Wake/Category/template_9/category-title/category-title.schema.json`): só 2 campos —
`titulo` ("vazio = nome da categoria") e `rotulo_contagem` ("texto depois da quantidade") — o nome
em si e o número continuam vindo do cadastro da categoria, o bloco só troca o RÓTULO ao redor
deles. O mesmo vale para `category-main` (`vazio_texto`, `rotulo_filtrar`, `rotulo_ordenar`... —
produtos/filtros reais vêm sempre da categoria) e para `category-description`
(`prefixo`, `titulo_faq`, `ler_mais`, `ler_menos` são rótulos; `texto_1..4` e
`pergunta_1..6`/`resposta_1..6` SÃO texto livre, mas por serem parte do bloco único, editar esse
texto no painel aplica o MESMO texto/FAQ a toda categoria da loja — não é um FAQ por categoria).

### 2.3 Mapeamento campo a campo — família 09 (`CategoryDescription09`, a referência)

`src/components/templates/category/template_9/CategoryDescription/index.tsx` declara:

```ts
interface CategoryDescription09Conteudo {
  titlePrefix?: string;
  faqTitle?: string;
  readMoreLabel?: string;
  readLessLabel?: string;
}
```

| Campo do catálogo (`CategoryDescription09Conteudo`) | Setting Wake (`category-description.schema.json`, type `category_description_09`) | Editável na Wake? |
| --- | --- | --- |
| `titlePrefix` | `prefixo` ("Título · Prefixo antes do nome") | **Sim** — Design Studio, bloco único da categoria |
| `faqTitle` | `titulo_faq` ("Perguntas · Título") | **Sim** — idem |
| `readMoreLabel` | `ler_mais` | **Sim** — idem |
| `readLessLabel` | `ler_menos` | **Sim** — idem |
| *(sem equivalente no catálogo)* | `texto_1`…`texto_4` (parágrafos "Sobre") | **Sim, mas texto único para todas as categorias** — no catálogo esse texto vem de `useCategoriaDaLoja()` (Conteúdo da loja → categorias, `descricao`/`sobre`), não deste schema de seção |
| *(sem equivalente no catálogo)* | `pergunta_1`…`pergunta_6` / `resposta_1`…`resposta_6` | idem — no catálogo vem de `ConteudoLoja.categorias[].faq` |

O nome da categoria em si (`NOME = 'Vestidos'` no mock) e a contagem de produtos nunca passam por
estes campos — são dado real de categoria, então "vêm da categoria" nos dois lados (catálogo e
Wake), e o `category-main.schema.json` só expõe os RÓTULOS do estado vazio/filtros:

```json
// category-main.schema.json (template_9)
{ "vazio_texto": "...", "vazio_botao1": "...", "vazio_link1": "...", "vazio_botao2": "...", "vazio_link2": "..." }
```

(Templates 1/2/6/7 têm uma lista menor/diferente — ex. template_1 troca `vazio_botao1/2` por
`rotulo_filtrar`/`rotulo_ordenar`; template_2 acrescenta `rotulo_todos_filtros`/`rotulo_limpar`.
Confira o arquivo do template específico antes de assumir paridade 1:1 entre famílias.)

`category-banner` (só `template_2`): `imagem_desktop`, `imagem_mobile`, `link`, `alt` — bloco único
(mesma banner para toda categoria, quando nenhuma veio do cadastro da categoria). Esse é o caso em
que o usuário disse explicitamente "os banners, em todas as plataformas" podem ser editáveis — aqui
é verdade, mas com a mesma ressalva: um banner só, repetido em toda categoria, não um banner por
categoria.

## 3. Página Home — bloco em TODAS as 17 famílias (confirmado, sem exceção real)

Toda seção de Home que o catálogo lista tem `<slug>.schema.json` ao lado do `.html`, em TODOS os
`Wake/Home/template_{1..17}/<slug>/` com conteúdo de texto — inclusive as famílias "legadas" (1–8),
que o README já apontava e a varredura confirma (ex.: `template_4/banner-solo`,
`template_6/buy-size`, `template_7/rooms`, `template_8/countdown` — todos com `.schema.json`).
Única exceção: as pastas **globais** (`help-float`, `popup-news`), que de propósito NÃO têm
`.schema.json` — ver §4.

(As pastas `Wake/Home/template 3` e `Wake/Common/template 3`, com espaço no nome, são órfãs de
propósito — o README explica que colidiriam com `template_3` ou não resolvem; não contam para
nenhum item de catálogo ativo.)

### 3.1 Mapeamento campo a campo — família 09, seções de Home

| `selection` | Campo do catálogo (`src/components/templates/home/template_9/<Comp>/index.tsx`) | Setting Wake (`<slug>.schema.json`, tipo `<slug>_09`) | Editável? |
| --- | --- | --- | --- |
| `showcase` | `title` | `titulo` | Sim — bloco |
| | `titleEmphasis` | `titulo_destaque` | Sim |
| | `subtitle` | `subtitulo` | Sim |
| | `viewAllLabel` / `viewAllUrl` | `ver_todos` / `ver_todos_url` | Sim |
| | `tagLabel` | `selo` | Sim |
| | *(sem campo no catálogo)* | `colecao` (hotsite_products), `limite` | Sim — só existe do lado Wake (escolha de coleção/hotsite) |
| `categories` | `title`/`titleEmphasis` | `titulo`/`titulo_italico` | Sim |
| | `viewAllLabel`/`viewAllUrl` | `ver_todas`/`ver_todas_url` | Sim |
| | `itemLinkLabel` | `ver` | Sim |
| | `categories[].name/url/image/imageAlt` | `categoria_N_nome/url/imagem` (N=1..5, fixo) | Sim, mas **lista de tamanho fixo** (5 categorias) no bloco, enquanto o catálogo usa array livre |
| `ruler` | `benefits[].icon/title/text/url` | `beneficio_N_icone/titulo/texto/url` (N=1..4) | Sim — mesma ressalva de lista fixa |
| `brands` (comp. `Brand`) | *(não lido — ver nota)* | `chamada`, `ver_todas`/`ver_todas_url`, `marca_N_imagem/name/url/style` (N=1..6) | Sim |
| `editorial` | `eyebrow`/`title`/`titleEmphasis`/`text` | `chamada`/`titulo`/`titulo_destaque`/`texto` | Sim |
| | `ctaLabel`/`url` | `cta`/`url` | Sim |
| | `imageDesktop`/`imageMobile`/`imageAlt` | `imagem`/`imagem_mobile`/`alt` | Sim |
| | `posts[].image/kicker/title/url` | `post_N_imagem/kicker/title/url` (N=1..3) | Sim |
| `countdown` | `eyebrow`/`title`/`titleEmphasis`/`text` | `chamada`/`titulo`/`titulo_destaque`/`texto` | Sim |
| | `endDate` | `fim` (ISO 8601) | Sim |
| | `ctaLabel`/`ctaUrl` | `cta`/`cta_url` | Sim |
| | `daysLabel`/`hoursLabel`/`minutesLabel`/`secondsLabel` | `dias`/`horas`/`minutos`/`segundos` | Sim |
| `client-review` | `eyebrow` | `chamada` | Sim |
| | `reviews[].text/rating/author/productPrefix/productName/productUrl` | `depoimento_N_text/rating/author/product_prefix/product_name/product_url` (N=1..5) | Sim — lista fixa de 5 |
| `newsletter` | `eyebrow`/`title`/`titleEmphasis`/`text` | `chamada`/`titulo`/`titulo_destaque`/`texto` | Sim |
| | `namePlaceholder`/`emailPlaceholder` | `placeholder_nome`/`placeholder_email` | Sim |
| | `buttonLabel` | `botao` | Sim |
| | `successMessage` | `sucesso` | Sim |
| | `privacyPrefix`/`privacyLabel`/`privacyUrl` | `politica_prefixo`/`politica`/`politica_url` | Sim |
| | *(sem campo correspondente no catálogo)* | `erro` (mensagem de erro de envio) | Campo existe só do lado Wake — não há equivalente no `Newsletter09Conteudo` do catálogo hoje |
| `banner-main` | `BannerMain09Conteudo.slides[]` (lista livre) | `slide_N_*` (N=1..3, fixo: imagem/imagem_mobile/chamada/titulo/italico/texto/principal/principal_url/secundario/secundario_url/alt) | Sim — mesma ressalva de lista fixa (3 slides no bloco) |

**Nota "brands":** o componente do catálogo chama-se `Brand` (não `Brands`), em
`src/components/templates/home/template_9/Brand/index.tsx`; não confirmei o nome exato da interface
de conteúdo dele nesta rodada (não lido byte a byte) — os nomes de campo acima vêm do lado Wake
(`brands.schema.json`) e são uma correspondência **por posição/semântica**, não uma leitura direta
do `.tsx`. Trate como "muito provável, não 100% confirmado".

## 4. Componentes GLOBAIS (`help-float`, `popup-news`) — nem bloco, nem fixo: "Conteúdos" por ID

Presentes só nas famílias **6, 9, 10, 11, 12, 13, 14, 15, 16, 17** (confirmado: não há
`help-float`/`popup-news` em `Wake/Home/template_{1,2,3,4,5,7,8}`). Nenhum tem `.schema.json` —
de propósito, porque "o Design Studio não tem bloco global" (só injeta em página hotsite via
`content_for_page`, e um global precisa aparecer em TODA página, inclusive PDP e busca, que não são
hotsite). Confirmado em `Wake/Home/template_9/help-float/help-float.html` (linha 29):

```html
<div class="api-content hf09-content">
```

O comentário no topo do arquivo diz: "CONTEÚDO EDITÁVEL: o bloco `api-content` abaixo — e só ele —
vira UM conteúdo da Wake" — o generator publica esse miolo como **um** conteúdo (`Conteúdos` do
admin da Wake, lido por ID via `common.graphql`) e ele é **o mesmo em toda página da loja**
(não varia por família, nem por página — é instanciado uma vez por tema). `global: true` no
catálogo (`LayoutItem.global`) é o sinal que liga esse componente a este contrato.

## 5. Common (header, footer, breadcrumb, spot) — nenhum bloco; menu principal = Gestor de Menu; rodapé quase sempre fixo

Zero `.schema.json` em qualquer `Wake/Common/template_*/*`, para TODAS as famílias (1–17, incluindo
as variantes com espaço no nome). Dentro disso, duas sub-regras bem diferentes:

### 5.1 Header: menu principal é SEMPRE Gestor de Menu, texto ao redor é fixo

Confirmado em `Wake/Common/template_{1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17}/header/*.html` —
todos leem `common?.menu_groups` filtrado pela posição **"Topo Header"**:

```scriban
{{~ hd09_grupo = (common?.menu_groups ?? []) | group.by @(do; ret $0.position; end) | group.get "Topo Header" | array.first ~}}
```

Ou seja: o **menu principal** (itens de navegação, submenus) é editável pelo lojista, sempre — mas
pelo **Gestor de Menu** nativo da Wake, um painel fora do Design Studio, não pelo `config.json`/CMS
do tema. Sem grupo cadastrado nessa posição, cai no menu de exemplo do catálogo (hardcoded no
`.html`, ex. `hd09_menu_padrao`). O resto do header (textos da topbar, busca, mini-cart) é fixo no
tema gerado, exceto o logo (slot `hdNN_logo`, preenchido pelo generator a partir do asset enviado no
catálogo — não editável depois, é parte da publicação do tema) e os textos de aviso da topbar, que o
checklist item 25 do `README.md` cita como "a primeira coisa que se revisa na entrega" (fixo,
revisão manual, não editável pelo lojista).

### 5.2 Footer: só o `Footer05` liga o Gestor de Menu — os outros são 100% fixos

Busca por `menu_group` em `Wake/Common/*/footer/footer.html`: **só** `template_5/footer/footer.html`
contém a referência (posição **"Rodapé"**):

```scriban
{{~ ft05_grupo = (common?.menu_groups ?? []) | group.by @(do; ret $0.position; end) | group.get "Rodapé" | array.first ~}}
```

com fallback para colunas fixas (`ft05_colunas_padrao`) se não houver grupo cadastrado. **Todos os
outros rodapés conferidos (01, 06, 07, 09, 10, 11, 17, e por amostragem os demais)** declaram as
colunas de link inteiramente hardcoded no `.html` (`ft09_colunas = [...]` com `title`/`links`
literais) — sem nenhuma leitura de `common.menu_groups`. **Isso contraria uma leitura apressada do
CLAUDE.md deste repo** ("menu do rodapé" como conceito geral do produto é real no catálogo/CMS, mas
no tema Wake hoje só o Footer05 de fato conecta esse menu ao Gestor de Menu da loja; nos demais, o
que o CS digitou no painel "Conteúdo" do catálogo vira texto fixo do tema no momento da geração, e o
lojista não pode mais trocar os links do rodapé depois, exceto reabrindo um novo ciclo de geração**
— a não ser que também sejam migrados para o padrão do Footer05.

### 5.3 Breadcrumb e Spot

Nenhum dos dois tem `.schema.json` em nenhuma família (`Wake/Common/template_*/breadcrumb`,
`Wake/Common/template_*/spot`). O breadcrumb lê nome de categoria/produto reais (dado, não texto de
tema); o Spot (card de produto) usa dado do produto (nome, preço, imagem) + texto fixo do tema
(rótulos como "Esgotado", parcelamento) — nenhum dos dois é editável pelo lojista depois de
publicado.

## Regras gerais

| `pagina` | Tem Design Studio na Wake? | Exceções / nuance |
| --- | --- | --- |
| **`home`** | **Sim, sempre** (todas as 17 famílias, todas as seções de texto) | Globais (`help-float`, `popup-news`, só famílias 6 e 9–17) não são bloco — viram "Conteúdos" por ID, um só para a loja inteira |
| **`category`** | **Sim, desde 17/11/2026** (famílias 1,2,6,7,9–17; sempre que a família tiver `category-main`/`category-description`/`category-title`/`category-banner`) | O bloco é **um só para todas as categorias da loja** (registrado na entrada genérica `hotsite` do tema, não por categoria) — texto livre (parágrafos, FAQ) editado no Design Studio aparece igual em toda categoria; o que de fato muda por categoria (nome, contagem, produtos, subcategorias) vem do cadastro nativo da categoria na Wake, não do bloco. O README do `global-templates` ainda lista "categoria" como não-bloco — está desatualizado (ver §0) |
| **`product`** | **Não, nunca** (zero `.schema.json` em qualquer `Wake/Product/template_*`) | Dado real do produto (nome, preço, fotos, variações) vem do cadastro de produto da Wake, sempre; todo texto de UI (rótulos de botão, frete, placeholders, acordeões) é fixo no tema a partir do que o CS digitou no catálogo — congelado na publicação |
| **`common`** (header/footer/breadcrumb/spot) | **Não, nunca** (zero `.schema.json`) | **Header:** menu principal sempre editável, mas pelo **Gestor de Menu** (posição "Topo Header" em `common.menu_groups`), não pelo Design Studio — vale em todas as famílias conferidas (1–17). **Footer:** só o `Footer05` liga ao Gestor de Menu (posição "Rodapé"); todos os outros rodapés são 100% fixos, inclusive os links de coluna. Breadcrumb e Spot: sempre fixos (fora do dado real do produto/categoria que atravessam) |

**Cruzamentos que fogem da regra simples "página X = bloco/não-bloco":**

1. **Logo** (header e rodapé) — nunca é bloco nem Gestor de Menu: é parte da publicação do tema
   (`assets.logo`/`assets.footerLogo` do `config.json`, slot `hdNN_logo`/`ftNN_logo`), congelada no
   momento da geração, igual a qualquer outra imagem fixa.
2. **Vitrine (`showcase`) na home** — é bloco, mas o campo "produtos" (`colecao`/`hotsite_products`)
   não existe no catálogo: é escolha feita DENTRO do Design Studio, direto na Wake, sem equivalente
   no painel "Conteúdo" do catálogo.
3. **Listas de tamanho fixo** — toda seção do catálogo que usa array livre (`categories[]`,
   `benefits[]`, `reviews[]`, `slides[]`, `posts[]`) vira, no bloco Wake, um número fixo de slots
   nomeados (`categoria_1..5`, `beneficio_1..4`, `depoimento_1..5`, `slide_1..3`, `post_1..3`) — o
   lojista pode editar o conteúdo de cada slot, mas não adicionar/remover itens além do que o bloco
   declara.
4. **`category-description` / `category-main`** — têm campos de texto livre (parágrafos, FAQ,
   mensagens de estado vazio) que SÃO Design Studio, mas por serem o bloco único da categoria
   genérica, funcionam mais como "textos padrão da página de categoria da loja" do que como
   conteúdo por categoria individual — ao contrário da VTEX/FastStore, onde (segundo a premissa do
   usuário) o CMS por categoria é nativo e por registro.
5. **Campo com texto da réplica que promete política da loja** (frete grátis, prazo, troca) — nos
   locais sem Design Studio (PDP, e no FAQ de categoria antes de 17/11) o generator zera a variável
   de propósito (`""`) em vez de publicar uma promessa que o lojista não pode editar nem desmentir
   (checklist item 25 do `README.md`). Vale conferir se esse zeramento foi revisto para os campos de
   categoria que passaram a ser bloco depois dessa data — não confirmei isso nesta rodada (ficou
   fora do escopo: exigiria ler o HTML inteiro de cada `category-description.html`, não só o
   schema).

**O que fica em aberto / não confirmado com certeza:**

- Não abri o conteúdo completo de `component.html` de cada `category-description`/`category-main`
  de TODAS as 13 famílias para verificar se o texto-promessa (item 5 acima) foi tratado igual em
  todas — só confirmei o schema (quais campos existem), não a lógica interna de cada HTML em cada
  família.
- O campo de conteúdo do componente `Brand`/`brands` no catálogo (nomes exatos da interface
  TypeScript) não foi lido linha a linha — o mapeamento da tabela §3.1 para essa seção é por
  semântica/posição com o schema Wake, não por leitura direta do `.tsx`.
- Não investiguei o painel administrativo real da Wake (fora dos dois repos) para confirmar que o
  "Gestor de Menu" realmente é um recurso do admin Wake (fora do Design Studio) como o `README.md` e
  os comentários do código afirmam — tomei a documentação do próprio repo como fonte, não uma conta
  de admin real.
