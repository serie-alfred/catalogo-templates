# Funil de teste do E-temas

Cobre o produto inteiro, na ordem em que ele acontece: **catálogo → editor →
export do `config.json` → tema montado pelo generator**. Existe porque cada
perna tem um jeito próprio de falhar em silêncio — item invisível no catálogo,
seção que não monta no canvas, config que sai válido mas aponta para uma pasta
inexistente, tema que só quebra na loja.

```bash
yarn funil                # tudo, para no primeiro erro
yarn funil 1              # só o estágio 1
yarn funil 2-edicao       # um estágio específico
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
