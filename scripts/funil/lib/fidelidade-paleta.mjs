/**
 * A segunda leitura do `2-fidelidade`: a PALETA fora do `[data-role]` e sob
 * `:hover`.
 *
 * Por que existe: o portão casa nó a nó por `data-role` e mede repouso — então
 * é cego para quebra do contrato de Nível 1 em nó sem `data-role` e em estilo de
 * `:hover`. Medido no back-port `92aa66f` (23/09): o sublinhado do
 * `<a class=comprar>` do BannerCarousel06 virou `#fff` cravado e o par seguiu
 * 198/198; o mesmo com o `.outer` do Categories06, o `.accordion`/`.sign` do
 * TrustvoxReviews06 e as bordas de `:hover` do chip e do "ver todos" do
 * Categories06 e do "veja" do BannerSide06. Foi uma sonda à mão que achou.
 *
 * Como lê, depois da medição de repouso e na MESMA página:
 *
 * 1. Todo nó dentro da raiz do componente, com chave = `data-role`, senão o nome
 *    LOCAL das classes de CSS module (`style_comprar__eOG6y` no webpack do
 *    starter, `BannerCarousel_comprar__r_H4T` no Turbopack daqui — o
 *    `/from-faststore` preserva o nome), senão a chave do ancestral + a tag.
 *    Chave que só existe de um lado e pinta com o tema REPROVA: é cor de tema que
 *    ninguém do outro lado confere. Até 24/09 ela sumia da conta — trocar
 *    `.comprar` por `.buy` com `#fff` cravado dava 0 asserções e 0 falhas. A que
 *    só pinta cravado continua fora: é estrutura, assunto do `data-role`. E tela
 *    com 0 asserções reprova, salvo par que declara `semPaleta`.
 * 2. Só o que PINTA: cor e fonte só em nó com texto próprio — o
 *    `[data-fs-button-wrapper]` do Trustvox herda o azul do core do FastStore e
 *    divergia, sem texto nenhum para pintar —; borda só do lado visível;
 *    fill/stroke só em forma de SVG.
 * 3. DUAS vezes: com a paleta-sonda do estágio e com uma segunda paleta. Valor
 *    que muda entre as duas acompanha o tema; valor que não muda está cravado.
 *    É isso que decide o que vira asserção — sem interpretar cor nenhuma, então
 *    `color-mix` com branco, sombra e degradê entram do mesmo jeito. Asserção só
 *    onde algum lado acompanha o tema: o que os dois cravam é design, não
 *    contrato, e o `2-fidelidade` não mede design fora do `data-role`.
 * 4. De novo com `:hover` emulado em TODA regra (ver `emularHover`), comparando
 *    só o que o hover mudou em algum dos lados.
 */

/** Tokens da segunda paleta: cor e família que nenhum dos dois repos crava. */
export function paletaB(paleta) {
  return Object.fromEntries(
    Object.keys(paleta).map((k, i) => [
      k,
      paleta[k].startsWith('rgb(') ? `rgb(0, 0, ${100 + i})` : `'SondaB${i}', serif`,
    ])
  );
}

/**
 * Mapa `{ chave: { propriedade: [registros] } }` de tudo que pinta dentro de
 * `raiz`. Registro = o valor com a paleta do estágio, seguido de ` ⇢ <valor com
 * a paleta B>` quando o valor acompanha o tema. Roda na página: autocontido.
 */
export const mapearPaleta = ({ raiz: seletor, paletaB }) => {
  const raiz = document.querySelector(seletor);
  if (!raiz) return null;
  const MODULO = /^[A-Za-z0-9-]+_(.+?)__[A-Za-z0-9_-]{5}$/;
  const PULA = new Set(['STYLE', 'SCRIPT', 'LINK', 'BR', 'WBR', 'NOSCRIPT', 'TEMPLATE', 'SOURCE', 'META']);
  const CAMPO = new Set(['INPUT', 'TEXTAREA', 'SELECT']);
  const FORMA = new Set(['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'text', 'use']);
  const LADOS = ['Top', 'Right', 'Bottom', 'Left'];
  const chaves = new Map();
  const chave = el => {
    if (chaves.has(el)) return chaves.get(el);
    let k = el.getAttribute('data-role') && `@${el.getAttribute('data-role')}`;
    if (!k) {
      const locais = [...el.classList].map(c => MODULO.exec(c)?.[1]).filter(Boolean).sort();
      const pai = el.parentElement;
      k = locais.length
        ? `.${locais.join('.')}`
        : `${pai && pai !== raiz ? chave(pai) : ''}>${el.tagName.toLowerCase()}`;
    }
    chaves.set(el, k);
    return k;
  };
  const face = v => String(v).split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase();
  const pintura = (cs, texto, forma) => {
    const out = [];
    if (texto) out.push(['color', cs.color], ['fontFamily', face(cs.fontFamily)]);
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') out.push(['backgroundColor', cs.backgroundColor]);
    if (/gradient/.test(cs.backgroundImage)) out.push(['backgroundImage', cs.backgroundImage]);
    for (const l of LADOS)
      if (parseFloat(cs[`border${l}Width`]) > 0 && !/none|hidden/.test(cs[`border${l}Style`]))
        out.push([`border${l}Color`, cs[`border${l}Color`]]);
    if (parseFloat(cs.outlineWidth) > 0 && cs.outlineStyle !== 'none')
      out.push(['outlineColor', cs.outlineColor]);
    if (cs.textDecorationLine !== 'none') out.push(['textDecorationColor', cs.textDecorationColor]);
    if (cs.boxShadow !== 'none') out.push(['boxShadow', cs.boxShadow]);
    if (forma) {
      if (cs.fill !== 'none') out.push(['fill', cs.fill]);
      if (cs.stroke !== 'none' && parseFloat(cs.strokeWidth) > 0) out.push(['stroke', cs.stroke]);
    }
    return out;
  };
  // Os alvos são fixados UMA vez: as duas paletas têm de ler os mesmos nós.
  const alvos = [...raiz.querySelectorAll('*')].filter(
    el => !PULA.has(el.tagName) && el.getClientRects().length
  );
  const ler = () =>
    alvos.map(el => {
      const lido = new Map();
      const cs = getComputedStyle(el);
      if (cs.visibility !== 'visible') return lido;
      const k = chave(el);
      const texto =
        CAMPO.has(el.tagName) ||
        [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      for (const [p, v] of pintura(cs, texto, FORMA.has(el.tagName.toLowerCase())))
        lido.set(`${k}\u0000${p}`, v);
      for (const ps of ['::before', '::after']) {
        const cp = getComputedStyle(el, ps);
        if (cp.content === 'none' || cp.content === 'normal') continue;
        // conteúdo em string pinta texto; `url()` e `""` não
        for (const [p, v] of pintura(cp, /^["'].+["']$/.test(cp.content), false))
          lido.set(`${k}${ps}\u0000${p}`, v);
      }
      if (CAMPO.has(el.tagName) && el.getAttribute('placeholder'))
        lido.set(`${k}::placeholder\u0000color`, getComputedStyle(el, '::placeholder').color);
      return lido;
    });
  const a = ler();
  // Mesma forma da injeção do estágio (`*` com !important): esta vem depois e
  // vence por ordem; sai logo em seguida e a paleta do estágio volta a valer.
  const b2 = document.createElement('style');
  b2.textContent = `*, *::before, *::after {${Object.entries(paletaB)
    .map(([k, v]) => `${k}: ${v} !important;`)
    .join('')}}`;
  document.head.appendChild(b2);
  const b = ler();
  b2.remove();
  const mapa = {};
  a.forEach((lido, i) => {
    for (const [kp, va] of lido) {
      const [k, p] = kp.split('\u0000');
      const vb = b[i].get(kp) ?? va;
      const registro = vb === va ? va : `${va} ⇢ ${vb}`;
      const lista = ((mapa[k] ??= {})[p] ??= []);
      if (!lista.includes(registro)) lista.push(registro);
    }
  });
  return mapa;
};

/**
 * Emula `:hover` em TODO nó: cada regra com `:hover` ganha uma cópia logo depois
 * dela, com o pseudo trocado por `:not(.funil-sem-hover)` — mesma
 * especificidade (0,1,0) e casa com qualquer nó. `el.hover()` do puppeteer
 * pairaria um nó por vez e exigiria saber QUAIS pairar; aqui os dois lados
 * entram no mesmo estado de uma vez. É um superconjunto do real (tudo pairado
 * junto), e vale como comparação porque os dois lados recebem o mesmo.
 * `@media (hover: hover)` casa no Chrome headless, nas duas larguras.
 * Devolve quantas regras copiou — zero quer dizer folha inacessível.
 */
export const emularHover = () => {
  const NAO = ':not(.funil-sem-hover)';
  let n = 0;
  const visitar = (dono, lista) => {
    for (let i = lista.length - 1; i >= 0; i--) {
      const r = lista[i];
      if (r instanceof CSSStyleRule) {
        if (r.cssRules?.length) visitar(r, r.cssRules);
        if (!r.selectorText.includes(':hover')) continue;
        try {
          dono.insertRule(`${r.selectorText.replaceAll(':hover', NAO)}{${r.style.cssText}}`, i + 1);
          n++;
        } catch {
          // seletor que o navegador recusa com o :not (pseudo-elemento de
          // scrollbar): essa regra fica sem emulação, dos dois lados
        }
      } else if (r.cssRules) visitar(r, r.cssRules);
    }
  };
  for (const folha of document.styleSheets) {
    let regras;
    try {
      regras = folha.cssRules;
    } catch {
      continue;
    }
    visitar(folha, regras);
  }
  return n;
};

/**
 * Lê repouso, emula o `:hover` e lê de novo. Tem de ser a ÚLTIMA coisa feita na
 * página: a emulação reescreve as folhas de estilo e não volta atrás.
 */
export async function medirPaleta(f, raiz, paleta) {
  const arg = { raiz, paletaB: paletaB(paleta) };
  const repouso = await f.evaluate(mapearPaleta, arg);
  const regras = await f.evaluate(emularHover);
  const hover = await f.evaluate(mapearPaleta, arg);
  return { repouso, hover, regras };
}

const igual = (a = [], b = []) =>
  a.length === b.length && [...a].sort().join('\n') === [...b].sort().join('\n');

const acompanha = r => r.includes(' ⇢ ');

/**
 * Registro legível: o valor com a paleta do estágio, com o token no lugar da
 * cor quando ela é exatamente a de um, e "cravado" quando não acompanha o tema.
 * Valor cravado nunca ganha nome de token: a fonte-base do `<body>` é Roboto, a
 * mesma família do `--font-secundary` na paleta, e texto que só herda a base
 * sairia como se lesse o token.
 */
function legivel(registro, nomes) {
  const [va] = registro.split(' ⇢ ');
  if (!acompanha(registro)) return `${va} cravado`;
  return nomes.has(va) ? `var(${nomes.get(va)})` : va;
}

/**
 * Compara os mapas dos dois lados e empurra uma divergência por asserção
 * reprovada. Devolve `{ repouso, hover, umLado, dispensadas }` — quantas
 * asserções houve em cada leitura, quantas chaves de um lado só reprovaram, e
 * quais chaves de `deUmLado` foram usadas (o estágio reprova a dispensa que
 * nenhuma tela do par usou).
 *
 * @param opcoes.deUmLado  `{ chave: motivo }` — divergências conhecidas, de um
 *                         lado só, que aguardam conserto na réplica
 * @param opcoes.semPaleta motivo pelo qual o par não tem nada que pinte com o
 *                         tema (0 asserções deixa de reprovar; >0 reprova)
 */
export function compararPaleta(
  origem,
  clone,
  rotulo,
  falhas,
  paleta,
  { deUmLado = {}, semPaleta = null } = {}
) {
  // cor pelo valor computado; fonte pela face, que é o que o mapa guarda
  const face = v => v.split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase();
  const nomes = new Map(
    Object.entries(paleta).map(([k, v]) => [v.startsWith('rgb(') ? v : face(v), k])
  );
  const lista = (v, erro) =>
    v.length ? `"${v.map(r => legivel(r, nomes)).join(' | ')}"` : erro;
  if (!origem.repouso || !clone.repouso) {
    falhas.push(`${rotulo}: paleta sem raiz do componente (${origem.repouso ? 'clone' : 'origem'})`);
    return { repouso: 1, hover: 0, umLado: 0, dispensadas: new Set() };
  }
  for (const [lado, m] of [['origem', origem], ['clone', clone]])
    if (!m.regras) falhas.push(`${rotulo}: nenhuma regra de :hover emulada na ${lado}`);

  const contar = (o, c, onde, soMudou) => {
    let n = 0;
    for (const [k, po] of Object.entries(o)) {
      const pc = c[k];
      if (!pc) continue;
      for (const p of new Set([...Object.keys(po), ...Object.keys(pc)])) {
        const vo = po[p] ?? [];
        const vc = pc[p] ?? [];
        if (soMudou && !soMudou(k, p)) continue;
        if (!vo.some(acompanha) && !vc.some(acompanha)) continue;
        n++;
        if (!igual(vo, vc))
          falhas.push(
            `${rotulo}${onde}: ${k} · ${p} ${lista(vo, '(não pinta)')} → ${lista(vc, '(não pinta)')}`
          );
      }
    }
    return n;
  };
  const mudou = m => (k, p) => !igual(m.repouso[k]?.[p], m.hover?.[k]?.[p]);
  const mO = mudou(origem);
  const mC = mudou(clone);
  const repouso = contar(origem.repouso, clone.repouso, '');
  const hover = contar(origem.hover ?? {}, clone.hover ?? {}, ' :hover', (k, p) => mO(k, p) || mC(k, p));

  // A chave de um lado só que pinta com o tema — cada uma é uma asserção
  // reprovada, salvo a divergência conhecida de `deUmLado`. A leitura sob
  // :hover só acrescenta o nó que o hover revela.
  let umLado = 0;
  const dispensadas = new Set();
  const vistas = new Set();
  const semPar = (a, b, lado, onde) => {
    for (const [k, ps] of Object.entries(a ?? {})) {
      if (b?.[k] || vistas.has(`${lado}\u0000${k}`)) continue;
      const tema = Object.keys(ps).filter(p => ps[p].some(acompanha));
      if (!tema.length) continue;
      vistas.add(`${lado}\u0000${k}`);
      if (k in deUmLado) {
        dispensadas.add(k);
        continue;
      }
      umLado++;
      falhas.push(
        `${rotulo}${onde}: ${k} só existe na ${lado} e pinta com o tema (${tema.join(', ')}) — o outro lado não tem o nó, ou a classe mudou de nome`
      );
    }
  };
  semPar(origem.repouso, clone.repouso, 'origem', '');
  semPar(clone.repouso, origem.repouso, 'réplica', '');
  semPar(origem.hover, clone.hover, 'origem', ' :hover');
  semPar(clone.hover, origem.hover, 'réplica', ' :hover');

  // Tela sem asserção nenhuma não provou nada — e passava com `0/0`.
  const semRegras = [origem, clone].filter(m => !m.regras).length;
  let vazio = 0;
  const medidas = repouso + hover + umLado + dispensadas.size;
  if (semPaleta && medidas) {
    vazio = 1;
    falhas.push(
      `${rotulo}: o par declara semPaleta ("${semPaleta}") e a leitura achou ${medidas} ponto(s) de tema — tire a dispensa`
    );
  } else if (!semPaleta && !medidas) {
    vazio = 1;
    falhas.push(
      `${rotulo}: 0 asserções de paleta — nada pinta com o tema nos dois lados, ou nenhuma chave casou; se o componente não tem cor nem fonte de tema, declare semPaleta no par`
    );
  }
  return {
    repouso: repouso + semRegras + vazio,
    hover,
    umLado,
    dispensadas,
  };
}
