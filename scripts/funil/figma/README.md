# Coordenadas de referência do Figma

Cada arquivo é a árvore de um frame da seção **"Versão Final V4"** do Figma
`KzS8xPnnvstskzqgk81OTe`, com as coordenadas ABSOLUTAS de cada caixa
(`{name, id, x, y, w, h, depth}`), extraída pelo servidor Dev Mode MCP.

O `2-geometria.mjs` compara `getBoundingClientRect()` do editor renderizado
contra estes números, com a tolerância por classe de nó descrita abaixo (`TOL`). São **fixture**, não saída: só
mude se o design mudar — e, nesse caso, reextraia em vez de editar à mão.

| Arquivo | Frame |
|---|---|
| `t1-topbar.json` | topbar do canvas |
| `t1-esquerda.json` · `t1-direita.json` | Tela 1 — Componentes |
| `t3-esquerda.json` | Tela 3 — Identidade visual |
| `t4-esquerda.json` | Tela 4 — Tipografia |
| `t5-esquerda.json` | Tela 5 — Variáveis globais |
| `modal.json` | modal "Componentes de seções" |

O estágio **reprova** desde 10/09. A tolerância é por classe de nó, não um número só:
estrutura e controles de tamanho fixo em **0,5px** (tudo ali vem de padding/gap declarados em px
inteiros, e o ruído do layout engine é ~0,01); nós de texto com posição em 0,5px, largura em
1,5px (dois motores de fonte medem o avanço diferente) e altura em 1px — o Figma arredonda a
caixa de texto.

Algumas caixas divergem de propósito e o script as trata como esperadas — e a
divergência é por **eixo**, não pelo nó inteiro. A lista é `DIVERGENCIAS_CONSCIENTES` em
`2-geometria.mjs` (11/11/2026: 8 entradas):

| Caixa | Eixo | Motivo |
| --- | --- | --- |
| `t5.titulo1` | só `w` | rótulo diferente: o Figma escreve "Defina a Cor Primária", o produto expõe os valores reais |
| `modal.linha1`, `modal.card1–3` | só `h` | o rodapé do card mostra os chips de variável, que o mock não desenha |
| `t3.meta1–3` | só `w` | o Figma escreve "90 x 90 (X Mb)", o produto "(2 Mb)" |

**Exceção morta reprova.** O script confere que cada waiver AINDA diverge: se o eixo voltar a
bater, ele pede a remoção da entrada. Sem isso a lista incha, e cada entrada obsoleta passa a
esconder uma regressão futura.

## Delta ratificado: o `PanelToggle` não existe no Figma

O controle de recolher painel **não tem nó em nenhuma fixture** — o design só
desenha o estado expandido. Ele já foi `opacity: 0` por causa disso, e a decisão
se provou errada: ninguém o encontrava.

Hoje ele é visível e discreto, e o delta está **contido nos 32px de
`--ed-canvas-pad`**, o vão entre o painel e o iframe onde o Figma só pinta o
papel quadriculado. Nenhum pixel novo cai sobre conteúdo desenhado — a versão
rotacionada anterior, essa sim, invadia 12px do painel esquerdo.

O estágio 2a mede a contenção (`toggle esquerdo cabe no vão do canvas`): se o
padding do canvas mudar ou o controle escorregar, reprova.
