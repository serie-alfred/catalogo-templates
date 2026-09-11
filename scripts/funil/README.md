# Funil de teste do E-temas

Cobre o produto inteiro, na ordem em que ele acontece: **catálogo → editor →
export do `config.json` → tema montado pelo generator → tema que compila**. Existe porque cada
perna tem um jeito próprio de falhar em silêncio — item invisível no catálogo,
seção que não monta no canvas, config que sai válido mas aponta para uma pasta
inexistente, tema que só quebra na loja.

```bash
yarn funil                # tudo, para no primeiro erro
yarn funil 1              # só o estágio 1
yarn funil 2-edicao       # um estágio específico
yarn funil 4              # só o tema FastStore (minutos)
yarn alcance              # diagnóstico avulso, não é estágio (ver abaixo)
```

**Pré-requisitos:** Node 24 (`nvm use 24`), Chrome instalado (ou `CHROME_PATH`),
e o `yarn dev` de pé para os estágios 2 e 3. Saídas em `.funil/` (ignorada).

| Estágio | O que prova | Precisa de |
|---|---|---|
| `1-catalogo` | chaves e ids únicos, registry casado, mock em disco, **origem real em `global-templates`** para todo item Tray/Wake, manifest para todo `path` VTEX | nada |
| `2-editor` | shell, canvas, painéis, atalhos, modal, troca de plataforma, fonte que não vaza no `:root`, contraste derivado | dev server |
| `2-render` | **os 67 componentes do catálogo** montam sozinhos, sem erro de console, com altura e conteúdo (`FUNIL_RENDER_NOVOS=1` reduz aos 23 do redesign) | dev server |
| `2-edicao` | regras de negócio: singleton substitui, não-singleton coexiste, duplicar/remover, painel de variáveis, troca de plataforma | dev server |
| `2-geometria` | fidelidade ao Figma contra as coordenadas em `figma/` — **reprova**, com tolerância por classe de nó e exceções codificadas por eixo | dev server |
| `2-preview` | visão mobile, link `/p/{id}/{page}` compartilhável e a rota `/gerador/import-log` | dev server |
| `2-zoom` | o preview "Desktop" é desktop: viewport lógica de 1440 em qualquer tela, escala, controle de zoom e **clique de mouse real** dentro do frame escalado | dev server |
| `2-usabilidade` | todo controle é achável, alcançável e faz alguma coisa: varredura de alcance, as 10 cores globais, o `FontSelector` no caminho feliz, `ScrollArea`, o `Fechar` do modal, a fonte das superfícies portalizadas e o `DesktopOnlyNotice` | dev server |
| `2-integracao` | a escolha do cliente **chega ao config**: cor global → `config.json` → as 3 páginas do preview → sobrevive ao reload | dev server |
| `3-export` | o botão "Baixar" entrega os três configs; cada um resolve o contrato da sua plataforma; os dois PNGs saem | dev server |
| `4-tema-faststore` | o generator monta o tema de verdade e **ele compila** (`yarn build`) — a única perna do pipeline executável desta máquina | estágio 3 · `gh` autenticado · minutos |
| `5-contrato-tray-wake` | contrato estático de Tray e Wake: pasta de origem, `instanceCount`, dedupe `key::arquivo`, nenhum caminho com espaço | estágio 3 |

## Estágio 4 — o que ele monta, e por que cruzado

Ele parte do config **coerente** do estágio 3 (um modelo por slot, mesma família)
e troca a vitrine da home pela da família 06, mantendo o `ProductCard01` como
spot. Só assim a **substituição de spot** é exercitada: ela é um
`replaceAll('ProductCard06','ProductCard01')` sobre todo arquivo de texto do
asset, e num tema de família única não há o que trocar.

O `config.json` do generator é versionado — o estágio guarda e devolve, inclusive
se algo estourar no meio.

Duas coisas que ele **não** faz, de propósito: não roda `--push` (não cria
`preview/<hash>`) e não roda `--sync` (não publica no Headless CMS da VTEX).

⚠️ O generator **clona** a origem dos componentes, inclusive de um `file://`.
Clone enxerga **commit**, não working tree: trabalho não commitado no starter fica
invisível e o tema sai com a versão antiga, sem aviso. O estágio avisa quando
`FASTSTORE_COMPONENTS_REPO` aponta para um checkout sujo.

## Por que Tray e Wake param na validação estática

Não é escolha: `git ls-remote` do GitLab e do `git.fbits.net` **trava** dentro do
`git-credential-osxkeychain` — só `github.com` tem helper aqui, via `gh`. Além
disso o fluxo da Tray usa `start cmd /k` e `cd /d` (Windows), e o da Wake publica
em loja real sem opt-in. O estágio 5 confere o contrato sem executar.

## Estágio 2c — as três features que os outros não tocam

A visão mobile troca a **moldura** do iframe: o documento é o mesmo
(`/gerador/frame-mobile`) dos dois lados. O preview serializa o tema num snapshot
do servidor (`.preview-store/` em dev, KV em produção) e devolve
`/p/{id}/{page}` — que renderiza **sem** o editor e sem postMessage, então é o
único lugar onde o caminho de serialização é exercitado ponta a ponta. E o
`import-log` é rota pública que lê o filesystem.

Ele achou dois defeitos no primeiro run: o `import-log` dava 500 em toda visita
sem `~/Downloads/log.txt`, e o logo da agência no `Footer` do template_1 tinha o
`d` do path truncado com reticências **no código-fonte**, reclamando
«<path> attribute d: Expected number» a cada render.

## Estágio 2e — o que os outros estágios não conseguem ver

Os demais provam que a UI reage. Este prova que a escolha **atravessa as camadas**.
A diferença importa: uma cor que se perde entre o ColorPicker, o estado, o
`postMessage` de tema e o `buildConfigJson` sai **verde no funil inteiro** — o
cliente escolhe a paleta, o tema é montado "com sucesso" e chega com outra cor.

Ele fecha o circuito: digita a cor, exporta, confere no `config.json`, abre o
preview compartilhável nas três páginas e procura a cor no HTML servido, e por fim
recarrega o editor para ver se o trabalho sobreviveu — o `/gerador` não tem
"salvar", o localStorage é o único lugar onde o tema vive entre sessões.

A perna **editor → config** da *variável por componente* não é exercitada aqui: o
painel de propriedades não expõe um seletor estável para dirigi-la. A perna
**config → tema** é, no estágio 4 (`InjectComponentVariables` põe
`--breadcrumb-text` dentro de `.breadcrumb` no SCSS gerado).

## Por que quase toda falha do funil já foi do PRÓPRIO funil

Cinco reprovações em 08–09/09 foram do harness, não do produto. Vale o padrão, porque a
próxima vai ser igual: **o teste chegava antes da UI**.

| Sintoma | Causa real |
| --- | --- |
| "seção não montou" | sleep fixo em vez de esperar a seção pintar |
| "0 botões de duplicar" | `semear` aguardava só `.ed-shell` — a casca, não a lista |
| "#dynamic-tabs não achado" | 15s fixos, insuficientes sob carga |
| "o botão Baixar não entrega o config" | o botão é `disabled` até o `platform` hidratar; clicar nele não faz nada, **em silêncio** |
| "404 no /p/{id}" | regex do teste parava no id e descartava o `/{page}` |
| "canvas renderiza no 1º load → 0 seções" | `s(6000)` fixo, e o canvas pinta **por volta** de 6 s — o estágio media na borda |
| "alternar para mobile não troca a moldura" (`desktop → desktop`) | o botão existe no HTML antes de o React hidratar; `.click()` num botão não hidratado não faz nada, **em silêncio** |
| o estágio de render morreu no 3º de 23, e levou 4 estágios junto | o mesmo clique não hidratado, agora num `waitForFunction` seco: a exceção subiu e abortou o lote inteiro |

Duas regras que saíram disso, e que valem para qualquer estágio novo:

1. **Espere a condição, não o relógio.** `waitForFunction` no elemento que você vai usar, nunca
   `espera(n)` como garantia.
2. **Antes de clicar, confira que dá para clicar.** Botão desabilitado engole o clique sem erro
   — foi a falha mais cara de diagnosticar, porque o estágio esperava 120s por um export que
   nunca começou.
3. **Um clique não é uma garantia.** Botão presente no HTML mas ainda não hidratado engole o
   clique do mesmo jeito. Clique e **verifique o efeito**; se não veio, clique de novo até vir
   ou até estourar o limite. Um clique único mais `espera(n)` reprovava 1 em 2 execuções.
4. **Clique por DOM prova lógica, não alcance.** `el.click()` dispara o handler sem hit-test,
   sem olhar `opacity`, `visibility` ou o que está por cima. O `PanelToggle` passou meses verde
   com `opacity: 0` — teste passando, feature que nenhum humano achava. Todo controle que o
   usuário precisa **descobrir** exige duas asserções: `visibilidadeDe()` (opacidade e caixa
   reais) e `clicarDeVerdade()` (hit-test do Chrome). As duas, porque o clique do Puppeteer pega
   oclusão mas ignora `opacity`. `.click()` por DOM continua legítimo para dirigir estado que já
   foi provado alcançável em outro lugar.
5. **Varredura não pode ser tudo-ou-nada.** Estágio que percorre N itens tem que envolver cada
   item num `try/catch`: a falha de um alvo é a falha DAQUELE alvo, aparece na tabela e conta no
   placar. Sem isso, uma exceção no 3º de 23 derruba o estágio — e, no `funil.mjs`, os quatro
   estágios seguintes que dependem dele. Um flake vira "6/10" e some a informação dos outros 20.

Quando um estágio falhar, a primeira pergunta é "o produto está errado ou o teste chegou cedo?".
Rode o estágio sozinho, com o dev quente: se passar, é o segundo caso.

**E se falhar sozinho, ainda não terminou.** O último flake desta lista falhou 3 de 3 vezes
isolado — parecia regressão, e eu cheguei a chamá-la assim. O que desempatou foi uma sonda de
timeline: medir a mesma condição aos 2, 4, 6 e 10 s e imprimir `pageerrors` junto. Deu
`0, 0, 3, 3` com zero erro — o produto renderizava, o relógio é que estava na borda.
Reprovação reprodutível prova que o teste é determinístico, não que o produto está errado.

## Por que a origem é conferida por caminho

Tray e Wake não têm manifest: o generator monta
`global-templates/<Plataforma>/<Common|Home|Category|Product>/template_<template>/<selection>`
e copia o que achar. O campo `component` **não participa do caminho** — é rótulo
do catálogo. Um `selection` com typo não dá erro em lugar nenhum: a seção
simplesmente não existe no tema entregue. O estágio 1 é o único lugar onde isso
aparece antes da loja.

No VTEX é o oposto: o `path` resolve contra `faststore.starter` pelo grafo de
`manifest.json`, e o estágio 3 usa o `AssetRegistry` + `DependencyResolver`
**reais do generator** — não uma réplica — porque um path que não resolve derruba
a geração do tema inteiro, não só aquele componente.

## `yarn alcance` — o que o catálogo NÃO alcança

`scripts/funil/alcance.mjs` não é estágio: não falha, não entra no `yarn funil`
(o runner só pega `^\d`). É inventário para decidir.

Ele responde "quais assets do `faststore.starter` nenhum tema consegue receber", e
existe porque o estágio 1 responde só metade. `conferirImports` parte dos 40 `path`
VTEX do catálogo — 106 assets. Faltam dois grupos de root que o resto do pipeline
injeta: `overrides/CrossSellingShelf01` (auto-injetado por `useLayoutGenerator`
quando `ProductShowcase01` é escolhido) e `organisms/ProductShowcase<NN>` (empurrado
por `BuildPipeline._resolve` para o sufixo da vitrine escolhida). Com os três grupos
são 46 roots → **109 assets**, e é por isso que uma varredura ingênua acusa o
`ProductShowcase07` de órfão sem ele ser.

O script também varre **import não declarado nos 186 manifests**, não só nos que
estão no alcance — um asset com `section` e import não declarado compila aqui e
quebra em `Cannot find module` no dia em que entrar no catálogo.

A leitura dos números e a decisão de cada caso ficam em
`faststore.starter/docs/alcance-do-catalogo.md`.
