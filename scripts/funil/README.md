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
| `2-render` | cada componente novo monta sozinho, sem erro de console, com altura e conteúdo | dev server |
| `2-edicao` | regras de negócio: singleton substitui, não-singleton coexiste, duplicar/remover, painel de variáveis, troca de plataforma | dev server |
| `2-geometria` | fidelidade ao Figma (±1px) contra as coordenadas em `figma/` | dev server |
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
