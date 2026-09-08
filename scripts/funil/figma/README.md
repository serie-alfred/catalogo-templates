# Coordenadas de referência do Figma

Cada arquivo é a árvore de um frame da seção **"Versão Final V4"** do Figma
`KzS8xPnnvstskzqgk81OTe`, com as coordenadas ABSOLUTAS de cada caixa
(`{name, id, x, y, w, h, depth}`), extraída pelo servidor Dev Mode MCP.

O `2-geometria.mjs` compara `getBoundingClientRect()` do editor renderizado
contra estes números, com tolerância de ±1px. São **fixture**, não saída: só
mude se o design mudar — e, nesse caso, reextraia em vez de editar à mão.

| Arquivo | Frame |
|---|---|
| `t1-topbar.json` | topbar do canvas |
| `t1-esquerda.json` · `t1-direita.json` | Tela 1 — Componentes |
| `t3-esquerda.json` | Tela 3 — Identidade visual |
| `t4-esquerda.json` | Tela 4 — Tipografia |
| `t5-esquerda.json` | Tela 5 — Variáveis globais |
| `modal.json` | modal "Componentes de seções" |

Duas caixas divergem de propósito e o script as trata como esperadas:
`t5.titulo1` (rótulo diferente, decisão de escopo) e `modal.listaCategorias`
(o mock do Figma desenha 12 categorias; o catálogo real tem outra contagem).
