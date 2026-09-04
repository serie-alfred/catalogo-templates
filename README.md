# Catálogo de Templates — o site E-temas

Este repositório **é o E-temas** (`e-temas.com.br`): em `/gerador`, o cliente monta o tema da
própria loja escolhendo componentes prontos, ajusta cores e fontes, navega um preview real e
exporta a configuração.

O que sai daqui é um **`config.json`**. Quem materializa a loja é um sistema separado, o
[`produtos-template-generator`](../produtos-template-generator). Este projeto produz a UI do
catálogo, os previews e o JSON — não gera o tema publicado.

Os componentes daqui são **réplicas visuais** (mock, sem dados reais) dos componentes da
plataforma de destino. Para VTEX, os reais vivem no repo irmão
[`faststore.starter`](../faststore.starter) — cada `LayoutItem` VTEX carrega um `path` apontando
para lá. Ver [docs/CATALOGO-E-FASTSTORE.md](docs/CATALOGO-E-FASTSTORE.md).

> 📖 **As regras de como trabalhar aqui estão no [CLAUDE.md](CLAUDE.md)** — arquitetura do editor,
> o renderer único, o canvas em iframe, o preview compartilhável, variáveis por componente,
> convenções de tema. Este README é a porta de entrada.
>
> 🗺️ O papel deste repositório no conjunto: [../CLAUDE.md](../CLAUDE.md).

---

## Rodando

```bash
yarn install
yarn dev      # http://localhost:5503/gerador
yarn build    # o CI roda lint + build a cada push na main
yarn lint
yarn start    # produção
```

Node **24.20.0** — a LTS ativa (Krypton) —, fixado em `package.json` → `volta` e `engines`, com
`.nvmrc` (`24`) para quem usa nvm. `yarn` é o gerenciador — existe um
`package-lock.json` velho ao lado do `yarn.lock`; não rode `npm install`.

O script `test` aponta para `jest`, mas **jest não está instalado e não há testes**.

### Variáveis de ambiente

Todas listadas em `.env.example`:

| Var | Para quê |
| --- | --- |
| `SMTP_*`, `CONTACT_EMAIL` | envio do `config.json` por e-mail no export |
| `GOOGLE_FONTS_API_KEY` | lista de fontes do seletor |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Vercel KV, onde o preview compartilhável é persistido |
| `CRON_SECRET` | opcional — protege `/api/keep-alive`, o ping que impede o KV free de expirar |

Sem `KV_REST_API_URL`, o preview compartilhável grava em `.preview-store/` no disco (só dev).

---

## As três superfícies

O mesmo tema é renderizado em três lugares, **pelo mesmo componente**
([`ThemeRenderer`](src/components/preview/ThemeRenderer/index.tsx)) — por isso não divergem:

| Superfície | URL | O que é |
| --- | --- | --- |
| **Editor** | `/gerador` | o canvas, dentro de um `<iframe>`, com o dock de seções à esquerda |
| **Preview compartilhável** | `/p/{id}/{home\|categoria\|produto}` | link que o cliente abre e navega como um site |
| **Export stage** | — | montado sob demanda para o `html2canvas` gerar os PNGs |

O canvas ser um iframe é a decisão que sustenta o resto: os headers têm mini-cart e drawers
`position: fixed` com alturas em `vh`, que fora do iframe resolveriam contra a janela do editor e
cobririam a interface inteira. Dentro dele, o viewport **é** a loja. Detalhes e as armadilhas em
[CLAUDE.md](CLAUDE.md).

---

## Adicionar um componente ao catálogo

Vindo do `faststore.starter`, rode **`/from-faststore <Nome>`** — ele lê o componente real, gera
o preview, converte o SCSS, deriva o `variablesSchema` e registra tudo.

À mão, três coisas mudam juntas:

1. **Componente** em `src/components/templates/{common,home,category,product}/template_N/<Nome>/`
   (`index.tsx` + `index.module.css`).
2. **Registry** — importar em [src/utils/templateRegistry.ts](src/utils/templateRegistry.ts).
3. **Catálogo** — um `LayoutItem` em [src/data/layoutData.ts](src/data/layoutData.ts), com `key`
   única e, para VTEX, o `path` do componente no starter.

Faltando o registro no registry, o item cai num PNG placeholder **sem erro nenhum**. O
`CLAUDE.md` traz o comando que audita os dois lados — hoje há 23 componentes registrados sem item
ativo, incluindo o tema 07 inteiro.

---

## Estrutura

```text
src/
├── app/
│   ├── (home)/                 landing pública
│   ├── gerador/(editor)/       o editor — /gerador
│   ├── gerador/(frame)/        documento do iframe — /gerador/frame-mobile
│   ├── gerador/api/            fonts · preview · send-email
│   ├── p/[id]/[page]/          preview compartilhável
│   └── api/keep-alive/         ping do KV
├── components/
│   ├── templates/              os componentes do catálogo (por página e template_N)
│   ├── gerador/                UI do editor (Sidebar, SectionsPanel, PreviewFrame…)
│   ├── preview/                ThemeRenderer, SharedPreview, SeededLayoutProvider
│   └── common/                 header/footer do site
├── data/layoutData.ts          o que o usuário pode escolher — fonte de verdade
├── utils/templateRegistry.ts   nome → componente
├── hooks/useLayoutGenerator.ts todo o estado do editor
├── lib/previewStore.ts         persistência do preview (KV em prod, arquivo em dev)
└── styles/                     globals · gerador · templates · storefront · preview · editor-canvas
```

Os PNGs em `public/images/gerador/` são só fallback: os itens ativos têm `image: ""` e renderizam
o componente React de verdade.
