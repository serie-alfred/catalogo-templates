# Inventário do que é editável na Nuvemshop, depois do tema publicado

> Investigação só-leitura em `../global-templates` (trilha `Nuvemshop/`), cruzada com
> `src/data/conteudo/schemas.generated.json` e `src/data/layoutData.ts` deste repo. Cobre as
> famílias **09 a 13**, as únicas que hoje declaram `'Nuvemshop'` em `platforms` (120 `LayoutItem`s:
> 24 seleções × 5 famílias). Família 09 (Editorial) é usada como referência detalhada em cada
> tabela, porque é a mais madura (portada na fase 3) e os nomes dos settings das famílias 10–13
> seguem o mesmo padrão — mas **não são o mesmo schema**: cada família tem seu próprio desenho,
> com seus próprios campos (ver "Diferenças entre famílias" ao final de cada bloco, quando relevante).

## Método e o que não pude confirmar

- Para cada `.tpl`, extraí o bloco `{% schema %}` (é JSON válido) e resolvi o texto do `"label"`
  (`t:sa.<selection>_<NN>.<chave>`) pelo arquivo `translations/pt.schema.json` da mesma pasta —
  por isso as tabelas abaixo trazem o rótulo em português que o lojista vê no customizador, não a
  chave crua.
- Comparei cada campo do `schema` de conteúdo do catálogo (`schemas.generated.json`) com os
  `settings` do `.tpl` pelo texto do rótulo e pela leitura do corpo do template (quem usa `s.<id>`,
  quem usa `product.`/`category.`/`store.`/`navigation`/`breadcrumbs`/`cart.`).
- **Não encontrei `../.nuvemshop-contrato.md`** nem a pasta `e-temas` que o `global-templates/README.md`
  diz conter esse contrato (`o contrato da trilha é o .nuvemshop-contrato.md da pasta e-temas`) — essa
  pasta não existe neste cliente, só os 6 repos de produto. Não pude ler o contrato diretamente;
  o que está abaixo vem só da leitura dos `.tpl`, dos `components.md`/`paridade-*.md` do
  `global-templates` e do schema de conteúdo deste repo. Onde o comportamento exato da Nuvemshop em
  produção importa (ex.: se o tema-base Ipanema expõe um `logo` global fora destas seções), eu
  marquei explicitamente como não confirmado.
- `Spot` (o card de produto) é um **snippet incluído**, não uma seção com schema próprio — não
  tem settings e não aparece no customizador como bloco separado; por isso não tem tabela própria
  abaixo (ele herda cor/fonte da seção que o inclui, como o catálogo já documenta em `CardDaLoja`).

## Como ler as tabelas

- **Setting real no `.tpl`** — o campo é um `"type": "setting"` dentro do `{% schema %}` daquela
  seção: o lojista edita no customizador de tema (Design > Temas > Editar > a seção), sem precisar
  de outro admin.
- **Dado nativo (produto/categoria/loja)** — o campo não é setting: o `.tpl` lê de um objeto nativo
  do motor Liquid da Nuvemshop (`product.*`, `category.*`, `navigation`, `breadcrumbs`, `cart.*`,
  `store.*`). Editável, mas em OUTRO lugar do admin (cadastro de produto, de categoria, menus,
  configurações da loja) — nunca no customizador de tema, e nunca pelo painel "Conteúdo" do e-temas.
- **Fixo / não disponível** — não há setting nem dado nativo correspondente: ou o texto está
  hard-coded no `.tpl` (raro, geralmente um rótulo de ícone redundante), ou o recurso não existe
  na Nuvemshop (lista de desejos nativa, avaliação nativa, campo "novidade", filtro de cor
  nomeado por variação) — **limitação arquitetural**, não descuido de porte.
- **Cor / Fonte (Nível 1)** não entra nas tabelas de conteúdo (são a aba "Estilo", não "Conteúdo");
  todas as seções de família 09–13 na Nuvemshop as expõem como `setting_type: "color"`/`"text"`
  (fonte), com `default_setting` apontando para o token de Nível 2 da marca (`sa_color_primary`,
  `sa_font_primary`, etc.) — isso já é tratado por outro mecanismo (`NIVEL1_DAS_FAMILIAS`) e **é
  sempre editável** nas 5 famílias.

---

## Common (header, spot, breadcrumb, footer)

### Header09 (`Nuvemshop/Common/template_9/header/sections/header-09.tpl`)

| Campo do catálogo (`Header09`) | Status | Setting / origem |
| --- | --- | --- |
| `topbarMessages[].text` / `.url` (régua, até 3) | Setting real | `msg_1`/`msg_2`/`msg_3` + `msg_1_url`/`msg_2_url`/`msg_3_url` |
| `logo`, `logoAlt` | **Dado nativo da loja** | `store.logo()` — logo é da configuração de Design/Marca da própria Nuvemshop (fora do tema, fora das seções); **não confirmado** se o alt é customizável nesse mesmo lugar |
| `brandName` (marca em texto, sem logo) | Setting real | `marca` |
| `searchPlaceholder` | Setting real | `busca` |
| `accountLabel` / `accountMobileLabel` | Setting real | `conta` / `conta_mobile` |
| `wishlistLabel`, `wishlistUrl` | **Fixo / não disponível** | a Nuvemshop não tem lista de desejos nativa (mesma limitação documentada no `product-info`) |
| `cartLabel` | Setting real | `sacola` |
| `helpLabel`, `helpUrl` | Setting real | `ajuda` (rótulo no menu mobile) / `ajuda_url` |
| `destaque` (item do menu em destaque) | Setting real | `destaque` |
| `menu[]` (itens, `label`/`url`/`highlight`), `menu[].children[]` | **Dado nativo da loja** | `navigation` — o menu principal nativo da Nuvemshop (admin > Design > Menus); sem menu cadastrado, cai num menu de exemplo fixo no `.tpl` |
| `viewAllLabel` | Setting real | `ver_tudo` |

### Breadcrumb09 (sem schema de conteúdo no catálogo)

Trilha 100% nativa: lê `breadcrumbs` (objeto da página, com `name`/`url`/`last`) e a chave de tradução
do tema `breadcrumbs.home` para o rótulo "Início". **Nenhum conteúdo é setting** — só cor/fonte
(`breadcrumb_bg`, `breadcrumb_text`, `breadcrumb_font`). O rótulo "Início" é editável, mas pela
tradução do TEMA (Design > Editar idioma), um mecanismo da Nuvemshop fora do escopo deste catálogo,
não pelo customizador de seção nem pelo painel "Conteúdo" do e-temas.

### Footer09

| Campo do catálogo (`Footer09`) | Status | Setting / origem |
| --- | --- | --- |
| `columns[].title` (até 3) | Setting real | `titulo_1`/`titulo_2`/`titulo_3` |
| `columns[].links[]` (`label`/`url`/`highlight`) | **Dado nativo da loja** | `menu_1`/`menu_2`/`menu_3` são `setting_type: "menu"` — um PICKER de um menu nativo da Nuvemshop (não texto livre): o lojista escolhe qual menu cadastrado aparece em cada coluna; os itens em si (rótulo/link) vêm do cadastro do menu, não de settings do footer |
| `destaque` (link em destaque) | Setting real | `destaque` |
| `contactTitle` | Setting real | `contato_titulo` |
| `contactLines[].text` / `.url` (até 3) | Setting real | `contato_1`/`contato_2`/`contato_3` + `contato_1_url`/`contato_2_url`/`contato_3_url` |
| `contactHours` | Setting real | `horario` |
| `socials[].network`, `.url` | Setting real (parcial) | uma URL fixa por rede (`rede_youtube`, `rede_instagram`, `rede_x`, `rede_linkedin`, `rede_facebook`) — a rede em si não é um campo livre (`network`), é o ÍD do setting; não dá para o lojista adicionar uma rede fora dessa lista de 5 |
| `brandName` | Setting real | `marca` (texto grande do rodapé) |
| `brandUrl` | **Fixo / não disponível** | não há um link próprio para a marca do rodapé no `.tpl` desta família |
| `payments[].method` | Setting real (toggle, não lista livre) | `pag_visa`, `pag_mastercard`, `pag_diners`, `pag_hipercard`, `pag_elo`, `pag_amex`, `pag_aura`, `pag_pix`, `pag_boleto` — cada bandeira é um toggle liga/desliga fixo, não uma lista editável de bandeiras |
| `legal` | Setting real | `legal` |

**Diferenças entre famílias (footer/header):** 10–13 têm campos bem diferentes (selos de segurança,
apps, serviços com ícone, newsletter embutida no rodapé na 11/12/13, régua de serviços no header da
10/12) — a tabela acima vale só para a 09; o mecanismo (setting de texto por campo, `menu` picker
para colunas, `product_list`/toggle para o resto) é o mesmo nas 5.

---

## Home

### Banner Grid 09 — exemplo de correspondência quase 1:1

| Campo do catálogo (`BannerGrid09`) | Status | Setting |
| --- | --- | --- |
| `eyebrow`, `note` | Setting real | `chamada`, `nota` |
| `banners[].title/.titleEmphasis/.linkLabel/.url/.imageDesktop/.imageMobile/.imageAlt` (até 3) | Setting real | `titulo_N`, `italico_N`, `rotulo_N`, `link_N`, `imagem_N`, `imagem_mobile_N`, `alt_N` |

Este é o caso mais limpo do catálogo: **todo** campo de conteúdo tem um setting com o mesmo rótulo
(os textos de `translations/pt.schema.json` batem quase literalmente com os `title` do schema do
catálogo — ex. "Trecho do título em itálico" é idêntico nos dois lados). Mesmo padrão em
**Brands09, Categories09, BannerMain09, Editorial09, Newsletter09, PopupNews09, HelpFloat09,
Ruler09, Countdown09** — tabela resumida:

| Seleção | Campos do catálogo sem setting correspondente (NO-MATCH real, não falha de heurística) |
| --- | --- |
| Brands09 | nenhum — 100% coberto |
| Categories09 | `itemLinkLabel` (desktop, ao lado do nome) é coberto por `ver` (rótulo "Ver" dos cards) — **coberto**, 100% |
| BannerMain09 | nenhum — 100% coberto |
| Ruler09 | `benefits[].text` (linha de apoio) **não** bate com nada → na verdade É `texto_N` no `.tpl`, 100% coberto; heurística de texto errou |
| HelpFloat09 | 100% coberto (`buttonLabel`→`botao`, `footerText`→`rodape`) |
| PopupNews09 | 100% coberto, inclusive `delaySeconds`→`atraso` e `dismissDays`→`dias` |
| Newsletter09 | 100% coberto (`buttonLabel`→`botao`) |
| Countdown09 | `endDate`/`ctaUrl` → **setting real** (`fim_data`+`fim_hora` combinam a data; `cta_url`); 100% coberto |
| Editorial09 | 100% coberto |

### Banner Side 09 (vitrine lateral + card) e Showcase09 — fonte de produtos

| Campo do catálogo | Status | Setting / origem |
| --- | --- | --- |
| `title`, `titleEmphasis`, cartão (`eyebrow`/`title`/`titleEmphasis`/`ctaLabel`), `tagLabel` | Setting real | `titulo`, `titulo_destaque`, `cartao_chamada`, `cartao_titulo`, `cartao_titulo_destaque` (reaproveita `titulo_destaque`), `cartao_cta`, `selo` |
| `banner.imageDesktop/.imageMobile/.imageAlt/.url` | Setting real | `imagem`, `imagem_mobile`, `alt`, `link` |
| `collectionId` (ID de coleção VTEX) / `collectionUrl` (caminho de categoria) | **Setting real, mecanismo diferente** | bloco privado `banner-side-09-produtos` (`blocks/`), com `products_source` — um `setting_type: "product_list"`, picker NATIVO da Nuvemshop (coleção, categoria ou lista manual de produtos), e `max_products` (quantidade). Não é texto livre como na VTEX, mas **é editável pelo lojista no customizador**, só que como bloco separado dentro da seção, não um campo de texto |

Mesmo mecanismo de `product_list` em **Showcase09** (bloco `showcase-09-produtos`).

### Client Review 09

| Campo do catálogo | Status | Setting |
| --- | --- | --- |
| `eyebrow` | Setting real | `chamada` |
| `reviews[].text` (depoimento) | Setting real | `texto_N` (a heurística por palavra errou: o rótulo PT é literalmente "Texto") |
| `reviews[].rating`, `.author`, `.productPrefix`, `.productName`, `.productUrl` (até 5) | Setting real | `nota_N`, `autor_N`, `prefixo_N`, `produto_N`, `produto_url_N` |

100% coberto — são depoimentos manuais (a Nuvemshop não tem prova social nativa), todos em settings.

---

## Category

### Category Title 09

| Campo do catálogo | Status | Setting |
| --- | --- | --- |
| `allLabel` (chip "todas as subcategorias") | Setting real | `todos` |
| (o resto: nome/foto de cada subcategoria, trilha de chips) | **Dado nativo** | `category.subcategories` (confirmado pelo `.tpl`: 10 ocorrências de `category.`) — vêm do cadastro de categorias da loja |

### Category Description 09 — o caso que confirma a regra do usuário

| Campo do catálogo | Status | Setting / origem |
| --- | --- | --- |
| `titlePrefix` ("Sobre") | Setting real | `prefixo` |
| `faqTitle` ("Perguntas frequentes") | Setting real | `titulo_faq` |
| `readMoreLabel`, `readLessLabel` | Setting real | `ler_mais`, `ler_menos` (a heurística por palavra falhou; rótulos batem: "Ler mais"/"Ler menos") |
| **Nome e descrição da categoria, e as próprias perguntas/respostas do FAQ** | **Dado nativo (cadastro de categoria)** | `category.name` e `category.description` — o comentário do próprio `.tpl` é explícito: *"O FAQ NÃO é slot de settings: o template da categoria é um só para todas as categorias, e um FAQ no painel sairia igual em todas"*. Cada `<details><summary>Pergunta</summary><p>Resposta</p></details>` dentro do HTML de `category.description` (cadastrado no admin da Nuvemshop) vira um item do acordeão. Sem descrição cadastrada, a seção não aparece |

Isso confirma ponto a ponto a regra que o usuário descreveu: o FAQ e o texto "sobre a categoria" são
sempre editáveis, mas pelo CADASTRO DE CATEGORIA da Nuvemshop (fora do tema), nunca por um setting
do tema — porque o template é compartilhado por todas as categorias.

### Category Main 09 (PLP: filtros, ordenação, grade)

| Campo do catálogo | Status | Setting / origem |
| --- | --- | --- |
| `pageSize` (produtos por página) | **Fixo / não disponível** | não é setting — o tamanho de página do "carregar mais" é fixo no `.tpl`/JS, não exposto ao lojista |
| `specFacetKey`, `countLabel`, `filterLabel`, `sortLabel`, `sortPrefix`, `clearLabel`, `clearAllLabel`, `applyLabel`, `resultsLabel`, `progressLabel`, `loadMoreLabel` | Setting real | `especificacao`, `contagem`, `filtrar`, `ordenar`, `ordenar_prefixo`, `limpar`, `limpar_tudo`, `aplicar`, `resultados`, `progresso`, `carregar_mais` |
| `emptyEyebrow/Title/Text` + os 2 botões do estado vazio (`emptyPrimaryLabel/Url`, `emptySecondaryLabel/Url`) | Setting real | `vazio_chamada`, `vazio_titulo`, `vazio_texto`, `vazio_botao1`/`vazio_link1`, `vazio_botao2`/`vazio_link2` — 100% coberto (a heurística automática marcou 4 como NO-MATCH por diferença de rótulo, mas existem) |
| **Produtos da grade, contagem real, opções de filtro (valores de cada especificação), ordenação disponível** | **Dado nativo (catálogo)** | `products`, `products_count`, `product_filters`, `category.sort_method` — confirmado no corpo do `.tpl` (`products ?? []`, `products_count ?? …`, `product_filters ?? []`); o snippet `sa-category-main-09-faceta.tpl` desenha os VALORES de cada faceta a partir do filtro nativo da Nuvemshop |

---

## Product

### Product Description 09

| Campo do catálogo | Status | Setting |
| --- | --- | --- |
| `eyebrow`, `title`, `titleEmphasis` | Setting real | `chamada`, `titulo`, `titulo_destaque` |
| `specsLabel` (rótulo das especificações) | Setting real | `ficha` ("Rótulo da ficha") |
| `hiddenSpecs` (especificações a esconder) | **Fixo / não disponível** | não há setting equivalente; se a família 09 esconde alguma especificação, é hard-coded no `.tpl`, não configurável por nome |
| (a própria descrição do produto, a ficha técnica/specs) | **Dado nativo (cadastro de produto)** | `product.description`, `product.attributes`/specs nativas — confirmado por 8 ocorrências de `product.` no `.tpl` |

### Product Info 09 (PDP — o exemplo que o usuário deu)

| Campo do catálogo | Status | Setting / origem |
| --- | --- | --- |
| `refLabel` (rótulo "Ref.") | Setting real | `rotulo_ref` |
| `buyLabel` ("Adicionar à sacola") | **Setting real** | `comprar` — ao contrário do exemplo hipotético do usuário (Wake sem CMS na PDP = impossível editar o texto do botão), **na Nuvemshop este texto É editável**, porque a família 09 declarou um setting para ele |
| `soldOutButtonLabel`, `soldOutText` | Setting real (parcial) | `esgotado_botao`, `esgotado_texto` |
| `showQuantity` (mostrar seletor de quantidade) | Setting real | `mostrar_quantidade` (toggle) — a comparação automática por palavra não achou por diferença de redação, mas o setting existe |
| `shippingLabel`, `cepPlaceholder`, `cepButtonLabel`, `cepHelpLabel`, `cepHelpUrl` | Setting real | `frete` (título), `cep_placeholder`, `cep_botao`, `cep_ajuda` (o link e a URL de ajuda são o mesmo texto fixo "Não sei meu CEP", sem URL configurável separada) |
| `accordions[].title/.text` (até 3) | Setting real | `acc_1_titulo`/`acc_1_texto` … `acc_3_titulo`/`acc_3_texto` |
| `sizeGuideLabel` | Setting real | `guia_rotulo` |
| `newLabel` ("chamada de lançamento") | **Fixo / não disponível** | a Nuvemshop não marca lançamento/novidade (mesma ausência documentada para a Wake no CLAUDE.md deste repo) — **limitação arquitetural real**, não de porte |
| `colorLabel`, `colorDisplay` (como mostrar a cor da variação) | **Fixo / não disponível** | a Nuvemshop não tem um campo de "nome da variação" configurável separado do valor cadastrado — o nome da opção (`product.variations`) vem direto do cadastro de produto, sem rótulo customizável por fora |
| `notifyLabel`, `notifyNamePlaceholder`, `notifyEmailPlaceholder`, `notifySubmitLabel`, `notifySuccess` ("Avise-me") | **Fixo / não disponível** | **limitação arquitetural confirmada**: a Nuvemshop não tem aviso de estoque nativo; o comentário do próprio `.tpl` diz: *"não há aviso de estoque nativo; o app que existir entra pelos slots de compra"* — exatamente o tipo de caso que o usuário descreveu (sem o recurso na plataforma, não dá pra editar o texto dele) |
| (fotos, SKU, preço, parcelamento, Pix, variações, estoque) | **Dado nativo (cadastro de produto)** | `product.media/sku/price/compare_at_price/get_max_installments/maxPaymentDiscount/variations/variants/default_options` — 76 ocorrências de `product.` no `.tpl`; nada disso é setting, tudo vem do cadastro de produto da Nuvemshop |

### Product Reviews 09 — o segundo exemplo que confirma a regra do usuário

| Campo do catálogo (`ProductReviews09`, 16 campos) | Status | Setting / origem |
| --- | --- | --- |
| `title` | Setting real | `titulo` |
| `countLabel`, `starSingular`, `starPlural`, `writeLabel`, `moreLabel`, `emptyText`, `pageSize`, `pageSizeMobile`, `formRatingLabel`, `formTitleLabel`, `formTextLabel`, `formNameLabel`, `formSubmitLabel`, `formSuccess`, `formError` (14 campos) | **Fixo / não disponível — limitação arquitetural** | a Nuvemshop **não tem avaliação nativa** (nem nota, nem lista, nem formulário em Liquid/Twig). O `.tpl` é só uma MOLDURA com título e um `nubesdk-slot` (`after_product_description`) onde um APP de avaliações (ex. Trustvox) se pendura e desenha seu próprio widget, com seus próprios textos. Comentário do `.tpl`: *"Avaliação é app, e app se pendura no tema por nubesdk-slot (...) Nada de nota é inventado"*. Sem o app instalado, a seção nem aparece na loja |

Este é o caso mais nítido da PDP: de 16 campos de conteúdo que o catálogo expõe como editáveis
("Conteúdo" da seção no editor), só 1 (`title`) tem efeito real na Nuvemshop — os outros 14 variam
conforme o app de avaliação que o lojista instalar (e cada app tem seu próprio texto, fora do
alcance do tema e do e-temas).

### Product Related 09 (sem schema de conteúdo no catálogo)

| Campo visível no `.tpl` | Status | Origem |
| --- | --- | --- |
| `titulo`, `titulo_destaque` ("Você também pode" + "gostar"), `selo` | Setting real | — |
| Produtos relacionados em si | **Dado nativo (produto/app/categoria)** | ordem de preferência nativa da Nuvemshop: 1) alternativos escolhidos à mão no produto (`product.metafields.related_products.alternative_product_ids`), 2) relacionados por app, 3) produtos da mesma categoria (`product.category.products`) — nunca um campo de conteúdo do e-temas |

---

## Regras gerais

1. **A Nuvemshop expõe quase todo texto de UI como `setting` de seção** — não só cor e fonte: título,
   subtítulo, chamada ("eyebrow"), texto de apoio, rótulo de botão/CTA, placeholder, texto de estado
   vazio/sucesso/erro, texto de acordeão, e até textos de até-N-itens-repetidos (slides, banners,
   categorias, marcas, depoimentos, atalhos) — cada ocorrência numerada (`titulo_1`, `titulo_2`…).
   Isso é bem mais granular do que o exemplo hipotético do usuário sugeria (cor/fonte/rótulo curto);
   na prática, qualquer texto que o DESIGN da família 09–13 trata como "autoral/editorial" (não
   proveniente do cadastro de produto/categoria) virou setting. A correspondência com o schema de
   conteúdo do catálogo (`schemas.generated.json`) é, para a maioria das seções de Home, praticamente
   1:1 campo a campo — nomes e até textos de rótulo quase idênticos (ex.: "Trecho do título em
   itálico" aparece literalmente dos dois lados).

2. **Três tipos de texto ficam de fora, por motivo arquitetural, não por falta de porte:**
   - **Dado de catálogo** (produto, categoria, menu): nome, descrição, preço, SKU, variações, fotos,
     especificações do produto; nome/descrição/FAQ da categoria; itens do menu principal e do
     rodapé. Sempre editável — mas no CADASTRO da Nuvemshop (produto, categoria, menus), nunca no
     tema. É o maior bloco de "fora do tema": confirmado em PDP (`product.*`, 76 ocorrências só no
     Product Info 09), PLP (`products`/`products_count`/`product_filters`), categoria
     (`category.name`/`.description`/`.subcategories`) e header/footer (`navigation`).
   - **Dado de app de terceiro**: avaliações de produto (nenhuma nota, estrela, formulário ou
     mensagem é setting — tudo é o widget do app que o lojista instalar) é o exemplo mais extremo;
     "Avise-me" (aviso de estoque) e lista de desejos também caem aqui, mas por ausência total do
     recurso nativo (nem setting, nem app padrão do tema — dependeria de um app que o lojista
     escolhesse instalar e o tema nem tem o slot pronto para isso hoje).
   - **Recurso que a Nuvemshop simplesmente não tem**: chamada de "novidade/lançamento" por data,
     nome de variação customizável separado do cadastro, link próprio da marca no rodapé, limite de
     itens por página configurável. Esses campos existem no schema do catálogo (porque o mesmo
     schema também serve VTEX/Wake/Tray, que têm o recurso) mas não têm contrapartida nenhuma na
     Nuvemshop — nem setting, nem dado nativo.

3. **Produtos em vitrines (Home) usam um mecanismo nativo próprio, não um campo de texto**: toda
   seção com lista de produtos (Showcase, Banner Side) declara um **bloco privado** (`blocks/*-produtos.tpl`,
   `deletable: false`, `limit: 1`) com `setting_type: "product_list"` — um seletor nativo da
   Nuvemshop (coleção, categoria ou produtos escolhidos à mão) mais `max_products`. Isso corresponde
   ao `collectionId`/`collectionUrl` que o schema do catálogo usa para VTEX, só que a UI é um picker
   nativo da plataforma, não um campo de texto livre — **é editável**, mas de um jeito que o painel
   "Conteúdo" atual do catálogo não representa (não é texto/imagem/toggle, é uma referência a
   catálogo escolhida num picker).
4. **Menu do rodapé é um picker de menu nativo (`setting_type: "menu"`), não uma lista de links
   digitada**: o lojista escolhe QUAL menu cadastrado aparece ali; o conteúdo dos links em si (rótulo,
   URL, submenu) é do cadastro de menus da Nuvemshop, não do tema.
5. **Bandeiras de pagamento e redes sociais são uma lista FIXA de togles/URLs**, não uma lista livre:
   a família 09 cobre 9 bandeiras e 5 redes nomeadas; o lojista liga/desliga ou preenche a URL de
   cada uma, mas não pode adicionar uma bandeira ou rede fora dessa lista pelo tema.
6. **Cada família (09–13) tem seu próprio desenho de conteúdo** — os nomes dos settings e até a
   quantidade de campos variam bastante entre família e família para a mesma seleção (ex.: Header09
   tem régua de 3 mensagens + atendimento; Header10 troca por departamentos + selo de marca + 4
   "serviços" com ícone). O MECANISMO (setting granular por campo de texto, mais o picker nativo de
   produto/menu, mais o dado de catálogo para produto/categoria) é idêntico nas 5 famílias; o
   conteúdo específico de cada campo, não.
