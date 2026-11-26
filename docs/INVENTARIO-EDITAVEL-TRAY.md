# Inventário do que é editável pós-publicação na Tray

> Investigação só-leitura em `../global-templates/Tray/` e `../produtos-template-generator`
> (generator irmão), cruzada com `src/data/layoutData.ts` e `src/data/conteudo/` deste repo.
> Nenhum arquivo foi alterado. Levantado em 26/11/2026.

## Conclusão geral

**A Tray TEM, sim, um mecanismo de CMS de tema pós-publicação — diferente do Design Studio da
Wake e do CMS da VTEX na mecânica, mas equivalente no efeito.** Não é um sistema de blocos
arrastáveis; é um **painel de configurações nativo da própria plataforma Tray**
(`theme/configs/settings.html`, que todo tema Tray pode declarar), que o nosso generator monta
automaticamente: para cada componente do catálogo que o lojista escolheu, se a pasta do
componente em `global-templates/Tray/.../<selection>/` tiver um par
`settings-content.html` + `settings-li.html`, o `settingsProcessor.js`
(`produtos-template-generator/src/platforms/tray/services/settingsProcessor.js`) **injeta esses
HTMLs dentro do `settings.html` do tema-base** — o `settings-li` vira um item na coluna da
esquerda do painel, o `settings-content` vira o formulário da direita. Isso é texto literal do
`README.md` do `global-templates` (linhas 91–106): *"O par `settings-content.html` +
`settings-li.html` só existe na Tray"*.

Esse `settings.html` final é o arquivo que a Tray lê como a tela de **personalização do tema**
no admin da loja (fora do alcance desta investigação dizer o rótulo exato do menu na UI atual da
Tray, mas a mecânica — um `settings.html` do tema virando formulário no admin — é um recurso
padrão e documentado da própria plataforma Tray, não algo que o e-temas inventou). Os valores que
o lojista digita ali são lidos em tempo de render pelo template (`{% set x =
settings.hd09_msg1_${}|default('texto do catálogo') %}`, confirmado lendo
`Tray/Common/template_9/header/header.html`) — ou seja, **são editáveis sem precisar de um novo
deploy/implantação**, exatamente como o Design Studio da Wake ou o CMS da VTEX, só que a interface
é um formulário de campos (texto, textarea, upload de imagem, checkbox "exibir bloco"), não um
editor de blocos.

**Isso contraria a suposição inicial da tarefa** (de que a Tray teria "arquitetura mais
rígida/antiga, sem CMS"). A frase do `CLAUDE.md` sobre `SINGLETONS_DA_TRAY` ("o generator da Tray
não instancia cópias de seção fora da Home") é verdadeira, mas fala de **estrutura de página**
(quantas vezes uma seção pode repetir), não de **conteúdo editável** — são questões independentes.

### O que NÃO existe

- Não existe nada parecido com blocos de Design Studio (schema JSON por bloco, drag-and-drop,
  `content_for_page`) nem com o CMS de página da VTEX. Não há `manifest.json`, não há
  `<slug>.schema.json` em nenhuma pasta de `Tray/` (conferido com `find`).
- Não existe um "gestor de menu" próprio na Tray separado da árvore de categorias: o comentário
  de `Tray/Common/template_9/header/header.html` é explícito — `menu ... a árvore de categorias
  da loja (categories), um nível de submenu` — ou seja, o menu do header é 100% a hierarquia de
  categorias cadastrada na Tray (nativo), sem campo para adicionar um item de menu avulso
  (um link "Blog", por exemplo) por fora da árvore. Já os **links do rodapé** são um caso à parte:
  `settings-content.html` do footer tem textareas de texto livre (`Rótulo | /url`, uma linha por
  link) — portanto o rodapé aceita qualquer link digitado pelo lojista, não só categorias.
- Nem toda família/template tem o painel: é incremental. Famílias antigas (`template_1/2/3`)
  frequentemente não têm `settings-content.html` nenhum para header/footer — nesses casos o texto
  é mesmo 100% fixo no código, sem exceção (ver tabela abaixo).

## O que é nativo da Tray (cadastro de loja) vs. o que é o painel de tema vs. o que é fixo

| Tipo de dado | Onde o lojista edita | Evidência |
| --- | --- | --- |
| **Produto** (nome, descrição, fotos, preço, variações, estoque, avaliações, relacionados) | Admin da Tray → cadastro de produto (fora do tema) | `product-info/settings-content.html` da família 09: *"Fotos, preço, parcelamento, variações, compra, aviso de estoque e frete vêm do próprio produto e da Tray"*; `product-reviews`: *"Média, contagem e lista vêm das avaliações do produto na Tray"*; `product-related`: *"Os produtos são os relacionados cadastrados no próprio produto"* |
| **Categoria** (nome, descrição, FAQ) | Admin da Tray → cadastro de categoria (fora do tema) | `category-description/settings-content.html`: *"O texto e as perguntas vêm da descrição de cada categoria (cadastro da categoria), em HTML: cada `<details><summary>Pergunta</summary><p>Resposta</p></details>` vira um item das FAQ, e um `<h2>` no começo vira o título"* |
| **Menu do header** | Admin da Tray → árvore de categorias (não há item de menu avulso) | comentário de `header.html` (acima) |
| **Links do rodapé** | Painel de tema (Design) da Tray, texto livre | `footer/settings-content.html`: textarea `Rótulo \| /url`, uma por linha |
| **Banner de categoria** (`category-banner`) | Admin da Tray → módulo nativo de **Banners** (associado à categoria), não o painel de tema | `Category/template_6/category-banner/category-banner.html` lê `banners.extra9`/`banners.extra10` — campo nativo da Tray, não `settings.*` |
| **Card de produto na lista** (`spot`) | 100% nativo (preço, parcela, selo, estoque) — nenhuma pasta `spot` tem `settings-content.html` em nenhuma família | `find` confirma 0/16 |
| **Breadcrumb** | Dinâmico (caminho da navegação) — nenhuma pasta `breadcrumb` tem painel, nem precisa | `find` confirma 0/13 |
| **Textos de banners decorativos, títulos de seção, rótulos de botão, CTAs, textos de apoio, popup de newsletter, "ajuda flutuante"** | Painel de tema (Design) da Tray — texto/imagem por campo, com "Exibir bloco" (checkbox) em banners/pop-ups/seções opcionais | `settings-content.html` de cada componente (banner-main, categories, help-float, popup-news, editorial, countdown, ruler, showcase, brands, client-review, newsletter, category-title, category-main, product-description, product-related, product-reviews, header, footer — ver tabela completa abaixo) |
| **O que realmente é 100% fixo, sem exceção** | Nada a editar depois de implantado | Só os `template_N` listados na coluna "sem painel" da tabela abaixo (famílias 1–3 principalmente, mais `spot`/`breadcrumb`/`category-banner` legados) |

## Tabela completa: cobertura do painel por `selection` (todas as famílias/`template_N` do Tray)

Contagem de pastas `Tray/<Seção>/template_<N>/<selection>/` que **têm** `settings-content.html`
("com painel") vs. que **não têm** ("sem painel" — nesses `template_N` específicos o conteúdo é
fixo no HTML, sem exceção), e a leitura de "editável=sim/não" para o catálogo de hoje.

| `selection` | Com painel | Sem painel (quais `template_N`) | Editável na Tray? |
| --- | ---: | --- | --- |
| header | 14 | 3 — `Common/template_1,2,3` | **Parcial.** Sim nas famílias 4–17; não nas 1–3 (texto fixo) |
| footer | 16 | 1 — `Common/template_2` | **Quase sempre sim** (só o 2 é fixo) |
| breadcrumb | 0 | 13 (todas) | **Não precisa** — é navegação dinâmica, sem texto de catálogo |
| spot (card de produto) | 0 | 16 (todas) | **Não** — todo o conteúdo é nativo do produto/Tray; não há "texto de catálogo" a editar aqui |
| banner-main | 13 | 1 — `Home/template_1` | **Quase sempre sim** |
| banner-side | 13 | 0 | **Sim** |
| banner-grid | 11 | 0 | **Sim** |
| banner-full | 3 | 0 | **Sim** |
| banner-duplo, banner-solo, banner-solo-left, banner-triple-swiper, home-carousel, multi-categories, combined-categ, special-offers, rooms, product-banner, product-lines, category-tabs, buy-size | 1 cada | 0 | **Sim** (famílias legadas específicas, 1 ocorrência cada) |
| banner-triple | 1 | 1 — `Home/template_6` | **Parcial** |
| brands | 10 | 0 | **Sim** |
| categories (vitrine "compre por categoria") | 12 | 0 | **Sim** |
| category-main (grade/filtros da PLP) | 11 | 2 — `Category/template_1,2` | **Parcial** — textos/rótulos de filtro editáveis nas famílias com painel; produtos/filtros em si são sempre nativos |
| category-title | 10 | 0 | **Sim** (rótulo do chip "todas"; nome/contagem são nativos) |
| category-description (texto + FAQ) | 10 | 1 — `Category/template_1` | **Quase sempre sim** — mas só os RÓTULOS ("Sobre", "Perguntas frequentes", "Ler mais/menos"); o texto e as perguntas em si vêm do cadastro de categoria, não do painel |
| category-banner | 0 | 2 — `Category/template_2,6` | **Sim, mas por OUTRO mecanismo** — módulo nativo de Banners da Tray, não o painel de tema |
| category-footer | 0 | 1 — `Category/template_6` | **Não** (único caso, legado) |
| category-triple, client-review (`Home/template_6`) | 0 | 1 cada | **Não** nesse `template_6` específico (nas demais famílias `client-review` TEM painel, 10 ocorrências) |
| countdown | 10 | 0 | **Sim** |
| editorial | 10 | 0 | **Sim** |
| ruler | 15 | 0 | **Sim** |
| showcase | 17 | 0 | **Sim** (título/CTA da vitrine; produtos sempre nativos) |
| newsletter | 12 | 1 — `Common/template_5` | **Quase sempre sim** |
| help-float | 10 | 0 | **Sim** |
| popup-news | 10 | 0 | **Sim** |
| product-info (PDP) | 14 | 1 — `Product/template_2` | **Quase sempre sim** — mas só rótulos/CTAs/acordeões de texto (ex.: "Adicionar à sacola", "Avise-me quando chegar", título do frete, textos de acordeão); fotos/preço/parcelamento/variações/estoque são sempre nativos |
| product-description | 10 | 2 — `Product/template_1,6` | **Parcial** |
| product-related | 10 | 2 — `Product/template_1,6` | **Parcial** — só o título; os produtos relacionados são sempre nativos |
| product-reviews | 10 | 0 | **Sim** — só rótulos; média/contagem/lista são sempre nativas |

## Cruzamento com o catálogo deste repo (`src/data/layoutData.ts` e os schemas de conteúdo)

- `grep -c "'Tray'" src/data/layoutData.ts` → **319** `LayoutItem`s declaram a plataforma Tray —
  praticamente o catálogo inteiro (316 itens ativos no total, por `CLAUDE.md`), confirmando a nota
  do `CLAUDE.md`: *"hoje todo item está em Tray, Wake e VTEX"*.
- O conteúdo editável no painel **Conteúdo** do `/gerador` (`campos.generated.json` /
  `schemas.generated.json`, ~744 KB, 275 componentes com schema segundo o `CLAUDE.md`) é **o mesmo
  schema do `faststore.starter`**, aplicado de forma idêntica independente da plataforma
  selecionada — ele não tem hoje nenhuma noção de "este campo não existe de verdade na Tray" ou
  "este campo na Tray vem do cadastro nativo, não do tema".
- Cruzando selection a selection (tabela acima) com o que o schema de conteúdo expõe: **a grande
  maioria dos campos do schema TEM, sim, um campo correspondente no painel real da Tray** (rótulos,
  CTAs, textos de banner, textos de pop-up, acordeões da PDP) — a exceção relevante é quando o
  schema expõe um campo que no Tray é só espelho de um dado nativo (ex.: se o schema tiver um campo
  "texto da avaliação" ou "nome do produto relacionado" editável manualmente, isso **não tem**
  equivalente editável na Tray pós-publicação, porque lá esse dado vem sempre do cadastro de
  produto/avaliação da própria Tray — o painel só edita o RÓTULO ao redor, nunca o dado em si).
- **Famílias 1–3 são o maior risco de falso-positivo**: o catálogo oferece conteúdo editável para
  header/footer dessas famílias (families 1–3 todas têm `variablesSchema`/content no catálogo,
  por `CLAUDE.md`: "famílias antigas (01 a 07)... todo item com texto tem fonte"), mas na Tray
  **esses três `template_N` não têm `settings-content.html` nenhum** para header/footer — ou seja,
  o CS pode digitar um texto de exemplo ali no painel "Conteúdo" do `/gerador`, ele aparece no
  preview/PNG exportado, mas **esse texto nunca chega a virar campo editável pelo lojista na Tray
  depois de publicado**: fica fixo no tema como o texto que foi implantado.

## O que não consegui confirmar com certeza

- **Não encontrei o nome exato da tela no admin da Tray** onde o lojista vê esse `settings.html`
  (ex.: se é "Aparência → Personalizar", "Configurações do tema" ou outro rótulo) — isso está fora
  do alcance deste repositório e do `produtos-template-generator` (que só sabe que o arquivo se
  chama `theme/configs/settings.html` dentro do `tema-base`, clonado de outro repositório que não
  foi investigado aqui). A mecânica (formulário de tema = página de admin) é um recurso padrão
  documentado de temas Tray, mas o rótulo da tela não pôde ser verificado.
- **`tema-base` (o repositório clonado pelo generator como base do tema Tray) não está disponível
  localmente** nesta máquina — não consegui inspecionar o `settings.html` original (antes da
  injeção) nem confirmar se há algum campo nativo de "menu customizado" por fora da árvore de
  categorias. A conclusão de que o menu do header é só a árvore de categorias se apoia no
  comentário de `header.html`, que é uma fonte confiável (comentário do próprio componente
  replicado), mas não é uma prova direta do `tema-base`.
- **Não há `../produtos-template-generator` cópia de `Nuvemshop`/documentação cruzada com API da
  Tray** além do que já está em `global-templates/README.md`; não encontrei um repositório
  separado de "docs da API da Tray" para confirmar de forma independente o cadastro nativo de
  produto/categoria — a conclusão sobre produto/categoria serem nativos se apoia inteiramente nos
  comentários dos próprios componentes (`settings-content.html`/`header.html` etc.), que são
  consistentes entre si e com o que se espera de qualquer plataforma de e-commerce real, mas não
  vêm de uma fonte externa (API docs da Tray).
- **Não contei campo a campo** os ~275 componentes do `schemas.generated.json` contra os ~277
  `settings-content.html` da Tray (seria uma segunda rodada de trabalho); a tabela acima é por
  `selection` (tipo de componente), que é o nível em que o schema de conteúdo e o painel da Tray
  realmente operam (um schema por tipo de componente, compartilhado entre `template_N`). Se for
  necessário um relatório campo-a-campo (ex.: "o campo X do schema do Header09 tem/não tem
  equivalente no `hd09_*` do painel"), isso é factível mas exige outra rodada dedicada.

## Arquivos e evidências citadas

- `../global-templates/README.md` (linhas 42–57 estrutura; 86–106 "De que é feito um
  componente" / par `settings-content.html`+`settings-li.html`; 118–158 contrato Wake 2.0, usado
  aqui só como contraste)
- `../global-templates/Tray/Common/template_9/header/header.html` (comentário + `{% set %}` lendo
  `settings.hd09_*`)
- `../global-templates/Tray/Common/template_9/{header,footer}/settings-content.html`
- `../global-templates/Tray/Category/template_9/{category-main,category-title,category-description}/settings-content.html`
- `../global-templates/Tray/Category/template_6/category-banner/category-banner.html` (lê
  `banners.extra9`/`extra10`, módulo nativo de Banners da Tray)
- `../global-templates/Tray/Home/template_9/{banner-main,categories,help-float,popup-news}/settings-content.html`
- `../global-templates/Tray/Product/template_9/{product-info,product-related,product-reviews}/settings-content.html`
- `../produtos-template-generator/src/platforms/tray/services/settingsProcessor.js` (injeta os
  fragmentos em `theme/configs/settings.html`)
- `../produtos-template-generator/src/platforms/tray/index.js` (linha 30:
  `path.join(THEME_BASE_PATH, 'theme', 'configs', 'settings.html')`)
- `../produtos-template-generator/src/platforms/tray/core/configLoader.js` (resolução de pasta por
  `Seção/template_N/selection`)
- `../produtos-template-generator/src/platforms/tray/services/fileProcessors/processor.js` (linhas
  16–19: comentário confirmando que o par de arquivos é mesclado pelo `settingsProcessor`)
- `src/data/layoutData.ts` deste repo (319 ocorrências de `'Tray'`)
- `src/data/conteudo/schemas.generated.json`, `campos.generated.json` (schema de conteúdo
  compartilhado entre plataformas, sem distinção por plataforma hoje)
