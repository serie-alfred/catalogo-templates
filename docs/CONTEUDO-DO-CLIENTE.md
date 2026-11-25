# Conteúdo real do cliente no /gerador

Plano aprovado em 23/11/2026 (arquitetura B: Supabase Free + Vercel Blob). Este arquivo é o roteiro;
o que já está no código está resumido em **Conteúdo do cliente** no [CLAUDE.md](../CLAUDE.md).

## Andamento

Branch `feat/conteudo-do-cliente`, desenvolvida no worktree `../catalogo-templates-conteudo` (a pasta
`catalogo-templates` continua na `main`). Dev do worktree: `yarn next dev -p 5514` → http://localhost:5514.
Imagens em produção: **Vercel Blob no plano Pro** (decidido em 24/11/2026).

**Feito:** base do conteúdo em 3 níveis, `?rev=1` leve, funil `1-conteudo`/`2-conteudo`, famílias **09 a 17**
inteiras editáveis (189 peças; as 10–17 por agentes Sonnet, uma família por agente, em 24/11/2026), aba
**Conteúdo** no painel da direita, upload de imagem (dev local; produção no Blob), e o **conteúdo da loja**
(rail **Conteúdo da loja**: nome, avisos, menus, links legais, contato, redes, dados legais, pagamentos,
selos, banners e categorias, que valem para toda peça que mostra aquilo e ficam ao trocar de template).

Legenda: ✅ feito · 🔄 em andamento · ⏳ a fazer · ⛔ espera uma ação do Matheus.

**Mudança no plano (25/11/2026): o conteúdo da loja mora no TEMA, não no Supabase.** É um documento de
poucos KB (texto e URLs de imagem do Blob). No tema ele ganha sem código novo o que o plano previa
construir à parte: desfazer, as versões dos temas salvos, o snapshot do `/p`, a troca de template e de
plataforma; e funciona em produção assim que a branch subir, sem esperar o login Supabase nem uma
migração SQL. O Supabase continua no plano para os **produtos** (centenas de itens por cliente, planilha,
importação), que é onde o tamanho pesa. Efeito colateral aceito: um segundo tema do mesmo cliente
começa com uma CÓPIA do conteúdo da loja, não com o mesmo documento.

### O que falta, por quê e de quem

| # | O que falta | Por quê | Quem | Status |
| --- | --- | --- | --- | --- |
| 1.4 | Assinar o **Vercel Pro**, criar um **Blob store** (acesso **Public**, região iad1) e ligá-lo ao projeto (Connect Project, ambientes Production e Preview); a Vercel cadastra o `BLOB_READ_WRITE_TOKEN` | Uso comercial pede o Pro pelos termos; sem o store o upload em produção responde 503. Público porque o `/p` abre sem login e o código grava com `access: 'public'` | Matheus | 🔄 |
| 1.7 | Autorizar o **push** da branch (a Vercel gera um deploy de preview só dela, sem tocar a produção) | Nada saiu da máquina até agora: o upload real e o T3 só existem num deploy | Matheus | ⛔ |
| 1.3 | Conferir o upload no deploy de preview (Blob, CORS no PNG do export) e ajustar | O código do Blob está pronto, mas só roda com o token | Claude | ⛔ 1.4 + 1.7 |
| 1.6 | Decidir como migrar as famílias 10–17 | Trabalho mecânico (~170 peças) | Matheus | ✅ agentes Sonnet |
| 1.5 | Migrar as famílias 10–17 | O CS precisa de qualquer template | Claude | ✅ |
| 2.1 | **Conteúdo da loja**: menus, avisos, contato, redes, dados legais, banners, categorias — preenchidos uma vez e ligados às peças (vínculos), no rail **Conteúdo da loja** | Antes cada seção guardava o próprio conteúdo: trocar de template perdia o menu; o cliente tem UM menu | Claude | ✅ |
| 2.2 | Mergear o `feat/login-supabase` | Os **produtos** (fase 3) ficam no Supabase do login. O conteúdo da loja não depende mais dele (ver abaixo) | Matheus | ⛔ (só para a fase 3) |
| 2.3 | Rodar a migração SQL dos produtos no SQL Editor do Supabase (eu entrego o arquivo, no padrão da `contas`) | Cria as tabelas; o código não cria tabela sozinho | Matheus | ⛔ 3.1 |
| 2.4 | Migrar as famílias 01–08 (85 peças + TextArea) | Nelas os nomes de campo eram os da Tray: renomeados para os do schema, peça a peça | Claude | ✅ |
| 3.1 | Produtos da loja: cadastro no painel (fotos em WebP, preço, "de", parcelas, esgotado, selo, descrição, ficha, variações por tipo), replicados em toda vitrine, grade, relacionados e PDP | Antes vitrines e PDP mostravam os produtos de exemplo | Claude | 🔄 piloto na 09 pronto; demais famílias em andamento; planilha depois |
| 3.2 | Uma planilha de produtos de um cliente (real ou de exemplo) | Testar com dados de verdade (nomes longos, fotos, preços) | Matheus | ⏳ |
| 3.3 | **Itálico liga/desliga** nos destaques dos templates (Tipografia) | Templates com itálico que o cliente não usa (ou o contrário) | Claude | ✅ no catálogo e no config; ⏳ starter, global-templates e generator |
| 4.1 | Importar produtos pela URL da loja atual do cliente | O mais rápido para quem está migrando de plataforma | Claude | ⏳ |
| 4.2 | Duas ou três URLs de lojas de clientes (VTEX, Shopify, Nuvemshop…) | Cada plataforma expõe os produtos de um jeito | Matheus | ⏳ |
| 5.1 | Arquivamento em 3 meses, limpeza de imagens sem uso, backup noturno, uso do banco no painel | Manter o Supabase Free e o Blob enxutos sem quebrar links de cliente | Claude | ⏳ |
| 0.6 | Decidir o aviso de hidratação de `useId` no `/p` (CategoryDescription09, ProductInfo09) | Já existe na `main`, intermitente (3/6 cargas); não é desta branch | Matheus | ⛔ |
| — | Revisar a branch e decidir PR e merge na `main` | O repo é seu; eu não abro PR nem faço merge sem você pedir | Matheus | a cada marco |

### Quando você testa

| Marco | O que você testa | Onde | Quando |
| --- | --- | --- | --- |
| T1 | Textos e listas da família 09 na aba Conteúdo, no canvas e no `/p` | dev do worktree (5514) | ✅ **agora** |
| T2 | Imagens na família 09 (enviar arquivo) | dev do worktree (5514) | ✅ **agora** |
| T3 | Upload e preview num deploy de verdade | link de preview da Vercel | assim que 1.4 + 1.7 (eu confiro antes de passar) |
| T5 | Menus, contato e banners da loja que ficam ao trocar de template (rail **Conteúdo da loja**) | dev do worktree (5514); no deploy de preview depois do 1.7 | ✅ **agora** |
| T4 | Famílias 10–17 editáveis (as 01–08 depois, na 2.4) | dev do worktree (5514) | ✅ **agora** |
| T6 | Produtos do cliente nas vitrines, PLP e PDP (Conteúdo da loja → Produtos) | dev do worktree (5514) | ✅ **agora** na família 09; as outras ao fim da 3.1 |
| T7 | Importar produtos pela URL | dev (5514) | depois da 4.1 (com a 4.2) |

## Contexto

O CS quer subir o conteúdo do cliente — textos, banners, menus do header e do rodapé, produtos e
vitrines, tudo que a loja real deixa editar — e mandar o link do preview para o cliente ver a loja
com o conteúdo dele. Hoje cada um dos 319 componentes desenha um conteúdo fixo (`MOCK` copiado do
`mock.ts` do starter nas famílias 09–17; texto inline nas 01–08). O editor só personaliza cor e
fonte (`variablesSchema`) e as 4 imagens de marca (data URL).

**O que a exploração mostrou**
- "O que dá para editar de verdade" já existe por componente: `faststore.starter/src/components/<path>/manifest.json` → `section.schema` (o schema do CMS da VTEX). 275 dos 319 itens têm (contagem do `yarn derivar:conteudo`): 3.405 campos (2.595 texto, 214 imagem, 18 galeria, 117 textarea, 283 listas, 59 booleanos). Os 44 sem schema vivem do catálogo da plataforma: 16 Spot, 12 Breadcrumb, 11 ProductRelated e 5 de PLP/PDP das famílias 01 e 04.
- As réplicas 09–17 já usam os nomes de campo do starter (`Header09`: `topbarMessages`, `menu[]` com `children`). As 01–08 usam nomes da origem Tray (`Footer01`: `whatsapp_number` × starter `whatsapp`).
- Menu é dado da LOJA em 3 de 4 plataformas (Wake: grupo "Topo Header"; Nuvemshop: `navigation`; Tray: `categories`); só na VTEX é campo da seção. Vitrine = seção + coleção (`collectionId` no `ProductShelfCustom09`).
- `CardDaLoja` renderiza `<Card soCard />` sem produto: card de outra família repete o 1º produto de exemplo dele em todos os slots.
- O polling do `/p` (`GET /api/preview/{id}?rev=1`, a cada 5 s) lê o snapshot INTEIRO do KV para devolver só o `rev`.
- `html2canvas` roda sem `useCORS` (`src/utils/screenshotExport.ts`): imagem de outro domínio não entra no PNG do "Baixar".

## Decisões

- **Arquitetura B**: conteúdo da loja, produtos e mídia no **Supabase Free** (Postgres); imagens no **Vercel Blob**; o conteúdo de cada seção continua no tema (KV).
- **Só preview**: o `config.json` não muda.
- **Validação informal**: o cliente avisa o CS; o link ao vivo de hoje basta (sem publicar/aprovar).
- **Produtos**: planilha CSV/XLSX, cadastro manual, partir dos exemplos, importar da loja atual por URL.
- **Arquivamento automático depois de 3 meses** sem ninguém abrir o tema no editor (o link continua funcionando).

### Por que B (custo e limites, preços oficiais de nov/2026)

| Cenário | Total/mês | Aguenta |
| --- | --- | --- |
| A — tudo no tema (Vercel Pro + Upstash pago + Blob) | ~US$ 20–25 | Centenas de clientes; teto de 10 MB por snapshot; cada edição e cada consulta trafegam o documento inteiro; 2º tema/LP duplica o conteúdo |
| **B — escolhida (Vercel Pro + Supabase Free + Blob)** | **~US$ 20** | ~300 clientes **ativos** no banco grátis (com arquivamento, sem teto de total); imagens a centavos (1.000 clientes ≈ 20 GB ≈ US$ 0,46/mês) |
| B crescido (+ Supabase Pro) | ~US$ 45 | Milhares de clientes, backup diário, disco que cresce sozinho |
| C — CMS headless (Payload/Sanity) | — | Descartada: duas ferramentas para o CS, segunda autenticação, upgrades do Next presos ao CMS |

- Vercel: o Hobby é só para uso não comercial → **Pro** (US$ 20/mês por dev com acesso ao painel; CS e clientes não contam), com US$ 20 de crédito que cobre funções e Blob desta feature. Limites que moldam o desenho: corpo de requisição 4,5 MB, função até 300 s.
- Supabase Free: 500 MB de banco (cota de uso justo, não trava); a trava real é o disco fixo de 2 GB, que vira somente-leitura a 95% e destrava sozinho abaixo disso; sem backup; pausa após 7 dias sem uso (o cron diário cobre). Upgrade (+US$ 25) só para backup gerenciado ou mais de ~300 clientes ativos.
- "Banco da Vercel" = Marketplace (a Vercel própria só tem Blob e Global Config; o antigo Vercel Postgres virou Neon). Neon Free: 1 GB, não pausa, 6 h de histórico, mas teto de 100 CU-hora/mês (estourou = computação suspensa até o mês seguinte), retomada de algumas centenas de ms depois de 5 min parado, e seria um segundo banco ao lado do Supabase do login. Supabase também se instala pela Vercel (`vercel install supabase`).

## Arquitetura

### Conteúdo em 3 níveis (o mesmo raciocínio das cores)
- **Nível 1 — seção**: `LayoutSelection.content?: Record<campo, valor>`, esparso, ao lado de `variables`. Vai no tema (sessionStorage, undo, temas salvos, snapshot do preview).
- **Nível 2 — loja**: `ConteudoLoja` canônico do cliente — avisos, menus (principal, rodapé, institucional), contato, redes, dados legais, pagamentos e selos, banners principais, categorias, coleções, produto/categoria em destaque — mais os produtos. Sobrevive à troca de template: Header09 → Header12 mantém o menu; "Por template" leva os produtos e banners para a família nova.
- **Nível 3 — mock**: o `MOCK` do componente (= `mock.ts` do starter).
- Uma função pura resolve os três: `resolverConteudo(componente, nivel1, loja, mock)` em `src/utils/conteudo.ts`. Listas substituem; objetos mesclam por chave.
- **Vínculos** campo → slot da loja em `src/data/conteudo/vinculos.ts`: proposta gerada por nome de campo (`menu`, `topbarMessages`, `whatsapp`, `social*`, `paymentMethods`, `collectionId`…) + arquivo curado que vence, com renomeação de chave quando a forma difere (`Footer01.institucionalMenu[].name` ← `menus.institucional[].label`).
- Trocar um singleton no lugar (`toggleSelection`) leva as chaves do nível 1 que existem, com o mesmo tipo, no schema do novo; `changePlatform` mantém `content` como mantém `variables`; duplicar seção copia `content`.

### Schema derivado do starter
- `scripts/derivar-conteudo.mjs` (`yarn derivar:conteudo`, aceita `DERIVAR_STARTER` como o `derivar:css`): para cada `LayoutItem` com `path`, lê `manifest.json` → `section.schema`, grava `src/data/conteudo/schemas.generated.json` (por componente) e a proposta de vínculos. `collectionId`/`collectionUrl` viram o seletor de coleção da loja.
- Os 44 sem schema ganham mini-schema à mão (`src/data/conteudo/schemasExtras.ts`: qual coleção, qual produto) e leem os produtos da loja.

### Dados (Supabase) e imagens (Blob)
- **Âncora = tema salvo** (`temaAtual`), sem conceito novo na tela. Ao subir o primeiro conteúdo da loja numa aba sem tema, o editor pede o nome do cliente e salva o tema. "Salvar como novo" copia conteúdo e produtos; "Abrir versão" restaura o doc da loja daquela versão (antes guarda o atual como versão); produtos não são versionados na v1. Permissão = `podeMexer` de `src/lib/temasStore.ts`.
- `PreviewSnapshot` ganha `temaId?`, para o `/p` achar o nível 2.
- Migração `supabase/migrations/<data>_conteudo.sql` no padrão da `contas` (RLS ligado sem política, grant só ao `service_role`, idempotente):
  - `conteudo_loja (tema_id text pk, doc jsonb, versao int, atualizado_por, atualizado_em)` — `versao` dá o 409 "outra pessoa alterou o conteúdo".
  - `conteudo_loja_versoes (tema_id, versao_tema, doc)` — cópia do doc a cada "Salvar" do tema.
  - `produtos (id uuid, tema_id, ordem, dados jsonb, origem in ('manual','planilha','exemplo','url'), criado_em, atualizado_em)`, índice `(tema_id, ordem)`.
  - `midias (id uuid, tema_id, url, caminho, bytes, largura, altura, origem_url, status in ('pendente','ok'), criado_em)`.
  - `clientes_conteudo (tema_id pk, ultimo_acesso, arquivado_em, arquivo_url)`.
- Libs `server-only`: `src/lib/conteudoStore.ts`, `src/lib/produtosStore.ts`, `src/lib/midiasStore.ts`, sobre o cliente admin do Supabase (`src/lib/supabase/admin.ts` da branch `feat/login-supabase`). **Sem Supabase em dev** → arquivo JSON em `.preview-store/`, no padrão do `src/lib/kv.ts`, para `yarn dev` e funil rodarem offline. Produção sem as variáveis → 503 nomeando o que falta (como os temas).
- **Imagens**: o navegador redimensiona e comprime em WebP (banner ≤ 2400 px, produto ≤ 1200 px, logo/selo ≤ 800 px com alfa), pede o token em `POST /gerador/api/temas/{id}/midias` (registra `midias` como `pendente`) e sobe direto com `@vercel/blob/client`, sem passar pelo limite de 4,5 MB da função; o `onUploadCompleted` marca `ok`. Caminho `temas/{temaId}/{uuid}.webp`, imutável, cache longo. Em dev, `.preview-store/midias/` servido por rota só de dev.
- Imagem de URL externa (planilha, importação) é rehospedada no servidor: só http(s), bloqueia IP privado, 10 s, 10 MB, `sharp` (já instalado; vira dependência explícita) → WebP → Blob, em lotes.
- Rotas (atrás de `exigirConta`): `GET/PUT /gerador/api/temas/{id}/conteudo`; `GET/POST …/produtos`, `PATCH/DELETE …/produtos/{pid}`, `POST …/produtos/lote`, `POST …/produtos/importar-url`; `POST …/midias`, `POST …/midias/remota`.
- Região: as funções da Vercel rodam em `iad1` por padrão; conferir a região do projeto Supabase do login e alinhar (`regions` no `vercel.json`) — consulta colocalizada ~10–30 ms, entre continentes ~150 ms.

### Limites e limpeza (cron diário que já existe, `/api/keep-alive`)
- **Regra fixa: limpeza automática nunca quebra um link enviado ao cliente.** O automático arquiva; só o manual apaga.
- **Arquivar** depois de 3 meses sem abrir o tema no editor (`clientes_conteudo.ultimo_acesso`, atualizado no `GET …/conteudo`; visita ao `/p` não conta): doc, versões, produtos e mídias do cliente viram um JSON num Blob privado e saem do banco. O `/p` lê o arquivo (URL imutável, em cache); abrir o tema no editor devolve tudo ao banco. Teto de clientes por execução para caber nos 300 s.
- **Imagens órfãs**: apaga a imagem sem referência em nenhuma fonte (doc atual e versões, produtos, todas as versões do tema no KV, snapshot do preview) há mais de 7 dias; `pendente` há mais de 24 h também sai. O job só varre temas mexidos na última semana e nunca toca tema arquivado.
- **Apagar** (manual, em "Temas salvos"): remove também conteúdo, produtos e imagens (prefixo `temas/{id}/`).
- **Export noturno** das tabelas para um Blob privado (`backups/conteudo-<data>.json`, guarda 14) — o backup que o Free não tem.
- Painel `/gerador/contas` (agência) mostra o uso do banco ("120 MB de 500 MB") por uma função SQL `tamanho_do_banco()` concedida ao `service_role`.

### Renderização
- `src/context/ConteudoContext.tsx` (`ConteudoProvider` com `{ loja, produtos }`), **fora** do `LayoutContext` — não depende do cast `as unknown as` do `SeededLayoutProvider`.
- `ThemeRenderer`: `Secao` recebe `conteudo={item.content}` e o expõe junto do `SecaoUidContext` (vira `{ uid, componente, conteudo }`); o comparador do memo ganha `a.conteudo === b.conteudo`.
- Hooks: `useConteudoDaSecao<T>(mock: T): T`; `useProdutos({ colecao?, limite? })` (null = loja sem produtos → mock da família); `useProdutoEmDestaque()`, `useCategoriaEmDestaque()`.
- `Produto` canônico (`name`, `images[]`, `price`, `listPrice`, `installments`, `inStock`, `brand`, `badge`, `categoryIds`, `description` em texto puro, `specs`, `variants`, `rating`); cada Spot exporta `deProduto(p): ProdutoNN`; `CardDaLoja` passa o produto ao card escolhido (conserta a repetição do 1º mock).
- Superfícies: canvas (iframe: mensagem nova `conteudo-loja` em `src/types/frameMessage.ts`, coalescida por rAF; o nível 1 já viaja em `selections`); `ExportStage` (provider direto do hook); `/p` (`SeededStorefront`: snapshot do KV + loja do Supabase/arquivo pelo `temaId`, em paralelo); `/templates` e thumbs (sem conteúdo → mock, nada muda).
- Conteúdo da loja ou produto mudou → dispara o re-save do preview que já existe (bump do `rev`) → o `/p` aberto se atualiza pelo `PreviewLive`.
- `rev` numa chave própria (`preview:{id}:rev`); o `?rev=1` lê só ela (se não existir, lê o snapshot uma vez e grava a chave).
- `html2canvas` com `useCORS: true`.

### Editor
- Painel da direita com abas **Conteúdo | Estilo** (o `ComponentVariablesPanel` vira "Estilo", intacto). `SchemaForm` monta o formulário do schema: texto, textarea, imagem (upload, URL, biblioteca do cliente), booleano, número, lista (dnd-kit: adicionar, remover, duplicar, reordenar), grupo, link, coleção. Campo vinculado mostra "Usando o conteúdo da loja: Menu principal (clique para personalizar só nesta seção)" e "Voltar ao conteúdo da loja".
- Destino novo no rail **Conteúdo da loja** (`[data-rail-target="conteudo"]`, no fim da lista para não mexer nas coordenadas do `2-geometria`): Produtos, Coleções, Categorias, Menus (árvore + colar lista indentada), Avisos, Banners, Contato e redes, Rodapé (dados legais, pagamentos, selos).
- Hook: `setConteudoDaSecao`/`resetConteudoDaSecao`; `conteudoLoja` no `ThemeDoc` (undo; produtos ficam fora, como os assets; apagar produto pede confirmação). A digitação já fecha a entrada do undo no `focusout`. `sanitizeSelections` valida `content` na hidratação (chave fora do schema, URL inválida, `data:`).
- Selecionar a seção no canvas abre a aba Conteúdo; editar submenu ou mini-carrinho abre a gaveta pelo `useAbrirNoCanvas`.

### Produtos — as 4 entradas
- **Manual**: tabela (miniatura, nome, preço, estoque, busca) + gaveta de edição com upload.
- **Partir dos exemplos**: copia os produtos mock da família do card escolhido para a lista do cliente.
- **Planilha CSV/XLSX**: lida no navegador (`papaparse` + `read-excel-file`; o pacote `xlsx` do npm está parado com vulnerabilidade conhecida), prévia com validação, envio em blocos, rehospedagem das imagens. Modelo em `public/modelos/produtos.csv` (nome, preço, preço de, parcelas, valor da parcela, imagem 1–4, url, marca, categoria, coleção, estoque, selo, descrição).
- **Importar da loja atual (URL)**: detectores em ordem — Shopify (`/products.json`), VTEX (`/api/catalog_system/pub/products/search`), WooCommerce (`/wp-json/wc/store/v1/products`), depois JSON-LD `Product` das páginas do `sitemap.xml` (teto de 60). O navegador pagina para cada chamada ficar bem abaixo de 300 s; guarda de SSRF, User-Agent genérico e limite por conta (contador no KV, como `login-falhas`).

### Migração dos 316 componentes
- Padrão: `const MOCK: XConteudo = {…}` com os nomes do schema do starter; o render usa `useConteudoDaSecao(MOCK)`. Placeholder (`placehold.co`) vira o padrão do campo de imagem. Descrição renderiza como texto (`white-space: pre-line`); os 20 templates com `dangerouslySetInnerHTML` são revistos.
- Piloto: família 09 inteira. 10–17: mecânico, um agente `sonnet` por família (nunca dois no mesmo arquivo; vínculos e schema gerados no fim). 01–08: renomear campos para os do starter, componente a componente. Cards + PLP/PDP/relacionados: adaptadores do `Produto`.

### Segurança
- Repo público: segredo do Supabase e `BLOB_READ_WRITE_TOKEN` só no servidor, nunca `NEXT_PUBLIC_`.
- Descrição em texto puro na v1 (sem HTML → sem XSS no `/p`, que é público); link só `http(s)`, relativo, `#`, `mailto:`, `tel:` (nunca `javascript:`/`data:`).
- Upload só imagem, tamanho máximo, MIME conferido no servidor; importação com guarda de SSRF e limite por conta.

## Fases (estimativa grosseira, 1 dev)

0. **Fundação** (4–6 dias): `rev` em chave própria; tipos; `derivar:conteudo`; resolvedor, hooks e providers; `ThemeRenderer`; migração SQL + libs com fallback de dev; upload ao Blob; `useCORS`; funil `1-conteudo`; piloto família 09 lendo pelo hook.
1. **Conteúdo por seção** (6–10 dias): abas Conteúdo/Estilo com `SchemaForm` e upload; famílias 10–17; `2-conteudo` (parte da seção).
2. **Conteúdo da loja** (6–8 dias): destino no rail, âncora no tema salvo, `conteudo_loja` + versões, vínculos, troca de template preservando; famílias 01–08; export noturno.
3. **Produtos** (6–8 dias): `Produto`, adaptadores dos 16 Spots + PLP/PDP/relacionados, `CardDaLoja`, manual, exemplos, planilha, coleções, destaques.
4. **Importação por URL** (4–6 dias).
5. **Operação** (2–3 dias): arquivamento de 3 meses + restauração, imagens órfãs, "Apagar" completo, uso do banco no painel.
- Depois, opcional: edição inline de texto no canvas (`data-campo`); migrar temas/previews do KV para o Supabase (um banco só).

## Arquivos

- Mudam: `src/hooks/useLayoutGenerator.ts`, `src/hooks/useThemeHistory.ts`, `src/components/preview/ThemeRenderer/index.tsx`, `src/components/templates/CardDaLoja.tsx`, `src/components/gerador/EditorRightPanel/`, `src/components/gerador/ComponentVariablesPanel/`, `src/components/gerador/EditorLeftPanel/` + `EditorRail/`, `src/components/gerador/EditorLeftPanel/PanelSavedThemes/`, `src/types/frameMessage.ts`, `src/lib/previewStore.ts` + `src/app/api/preview/[id]/route.ts`, `src/lib/temasStore.ts` (apagar/copiar), `src/components/preview/SeededStorefront/`, `src/utils/screenshotExport.ts`, `src/utils/platformCompat.ts`, `src/app/api/keep-alive/route.ts` (jobs), `vercel.json` (região), `package.json`, `.env.example`, `CLAUDE.md` (seção nova + variáveis), `scripts/funil/README.md`.
- Novos: `src/types/conteudo.ts`, `src/utils/conteudo.ts`, `src/context/ConteudoContext.tsx`, `src/hooks/useConteudoDaSecao.ts`, `src/data/conteudo/*`, `scripts/derivar-conteudo.mjs`, `src/lib/{conteudo,produtos,midias}Store.ts`, `src/components/gerador/SchemaForm/`, `src/components/gerador/EditorLeftPanel/PanelConteudoLoja/`, `supabase/migrations/<data>_conteudo.sql`, `scripts/funil/1-conteudo.mjs`, `scripts/funil/2-conteudo.mjs`, `public/modelos/produtos.csv`.
- Reaproveitar: `podeMexer`/`exigirConta`, padrão de fallback do `src/lib/kv.ts`, `useAbrirNoCanvas`, `ColorPicker`/`FontSelector`, dnd-kit, `rev` + `PreviewLive`, cron `/api/keep-alive`.

## Pré-requisitos
- Conta da Vercel no **Pro** (uso comercial; o Blob do Hobby para 30 dias ao estourar) e um Blob store ligado ao projeto (`BLOB_READ_WRITE_TOKEN`).
- `feat/login-supabase` mergeada (traz o projeto e o cliente do Supabase). Se atrasar, a fase 0 traz só `src/lib/supabase/admin.ts`, idêntico ao da branch.

## Verificação
- `yarn derivar:conteudo` duas vezes sem diff (idempotente).
- `npx tsc --noEmit` + `yarn lint` (não `yarn build` com o dev de pé na 5503).
- `yarn funil 1` com o `1-conteudo`: schema gerado = starter; todo componente com schema chama `useConteudoDaSecao`; vínculos apontam para campo e slot existentes; nenhum `data:` em conteúdo.
- `2-conteudo` (navegador, dev sem Supabase/Blob → fallback em arquivo): preenche cada campo de texto com um marcador único e confere cada marcador no DOM (campo de gaveta/mobile abre pelo `useAbrirNoCanvas`); sobe imagem; edita o menu da loja e vê no header; troca Header09 → Header12 e o menu fica; produto manual, por exemplo e por planilha aparece na vitrine e na PLP; `/p/{id}` mostra tudo e se atualiza; recarregar a aba mantém; arquivar (forçando a data) mantém o `/p` com o conteúdo e abrir o tema restaura.
- `2-geometria` com o destino novo e as abas do painel; `3-export`: `config.json` sem conteúdo (só preview) e PNG com as imagens.
- Manual em produção: CORS das imagens do Blob no PNG; tema do cliente → 3 produtos por planilha → coleção na vitrine 09 → menu → link `/p` numa janela anônima.
