# 🖼️ Catálogo de Templates - Projeto SERIE A

Este é um projeto Next.js com foco em criação visual de _templates_ de layout.

## 📦 Tecnologias Utilizadas

- [Next.js 14+](https://nextjs.org/) com estrutura baseada em `/app`
- [TypeScript](https://www.typescriptlang.org/)
- [@dnd-kit](https://dndkit.com/) – para drag-and-drop altamente personalizável
- [ESLint + Prettier](https://eslint.org/) – para padronização de código
- [CSS Modules](https://github.com/css-modules/css-modules) – escopo local de estilos
- [Yarn](https://yarnpkg.com/) como gerenciador de pacotes

## 📜 Scripts disponíveis

### Desenvolvimento

```bash
yarn dev
```

### Build

```bash
yarn build
```

### Lint

```bash
yarn lint
```

> ⚠️ Certifique-se de não utilizar `npm` junto ao `yarn`. Remova o `package-lock.json` se ele existir para evitar conflitos.

### Instalação de dependências

```bash
yarn install
```

## 🛠️ Configuração do ESLint

Este projeto utiliza a nova configuração baseada em `eslint.config.mjs` (via `defineConfig`), com suporte para:

- TypeScript (`@typescript-eslint`)
- React (`eslint-plugin-react`)
- Regras adicionais personalizadas

Para instalar as dependências do ESLint corretamente:

```bash
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react
```

## 🖼️ Imagens dos Templates

As imagens dos templates ficam em:

```
/public/images/gerador/
```

Os nomes das imagens são definidos em `layoutData.ts` e carregados de forma dinâmica conforme o layout e a plataforma.

## 📄 Licença

Desenvolvido com 💙 por SERIE A
