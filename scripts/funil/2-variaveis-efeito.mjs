/**
 * Estágio 2v — cada opção do painel MUDA o que diz que muda?
 *
 * O `1-variaveis` prova que a variável é LIDA por uma regra viva do SCSS. Não
 * prova que trocar o valor aparece na tela: a regra pode perder a cascata para
 * outra no mesmo elemento (foi o caso do BannerMain08, em que "Fonte do texto"
 * não fazia nada e "Fonte do título" pintava o hero inteiro). Aqui cada variável
 * do `variablesSchema` de cada item é ligada com um valor-sentinela no wrapper
 * da seção — o mesmo lugar em que o painel a aplica — e o estágio mede, nó a nó,
 * o estilo computado antes e depois:
 *
 *  1. toda variável muda ALGUM nó (em desktop ou no mobile). Variável com
 *     `previewNote` (só aparece com algo aberto/hover) não precisa mudar em
 *     repouso, mas é listada;
 *  2. duas variáveis de FONTE do mesmo item não podem mudar exatamente os mesmos
 *     textos — se mudam, uma delas é rótulo de mentira;
 *  3. a lista de textos que cada fonte muda vai para .funil/variaveis-efeito.json,
 *     para conferir a olho se "Fonte do título" pega os títulos e "Fonte do
 *     texto" os parágrafos.
 *
 * Renderiza pelo /p (ThemeRenderer, o mesmo do canvas), um snapshot por
 * plataforma × página com todos os itens daquela página.
 */
import fs from 'node:fs';
import path from 'node:path';
import { relatorio, itens, BASE_URL, SAIDA, espera } from './lib/util.mjs';
import { abrirBrowser } from './lib/editor.mjs';

const r = relatorio('Estágio 2v — cada opção do painel muda a tela');
const browser = await abrirBrowser();

const SLUG = { home: 'home', category: 'categoria', product: 'produto', common: 'home' };
const COR = 'rgb(1, 2, 3)';
const FONTE = "'Sentinela Funil', monospace";

const comSchema = itens().filter(i => i.variablesSchema?.length && i.layoutKey !== 'spot');
const plataformaDe = i => (i.platforms.includes('VTEX') ? 'VTEX' : i.platforms[0]);
// Página em que o item é renderizado. O breadcrumb "common" fica escondido na
// home (`belongsToPage` em utils/previewRender.ts): mede-se na categoria.
const paginaDe = i => (i.layoutKey === 'breadcrumb' && i.pagina[0] === 'common' ? 'category' : i.pagina[0]);

// Um snapshot por plataforma × página
const grupos = new Map();
for (const i of comSchema) {
  const chave = `${plataformaDe(i)}|${paginaDe(i)}`;
  if (!grupos.has(chave)) grupos.set(chave, []);
  grupos.get(chave).push(i);
}

const snapshotBase = {
  colors: { colorPrimary: '#1a1a1a', colorSecondary: '#ffffff', colorTertiary: '#fff', colorPrimaryBackground: '#000', colorSecondaryBackground: '#dd1838', colorTertiaryBackground: '#000', colorFooter: '#1A051C', colorFooterText: '#94A3B8', colorPrimaryText: '#fff', colorSecondaryText: '#51ff00' },
  fonts: { fontPrimary: 'Roboto', fontSecondary: 'Roboto', fontTertiary: 'Roboto' },
  logo: '',
  favicon: '',
};

/** Estilo computado de cada nó da seção (e dos pseudo-elementos), numa string por nó. */
const LER = `(uid) => {
  const raiz = document.querySelector('[data-section-uid="' + uid + '"]');
  if (!raiz) return null;
  const props = ['color','backgroundColor','borderTopColor','borderBottomColor','borderLeftColor','borderRightColor','outlineColor','textDecorationColor','fill','stroke','fontFamily','boxShadow','backgroundImage'];
  const ler = c => props.map(p => c[p]).join('|');
  return [...raiz.querySelectorAll('*')].map(n => {
    const proprio = [...n.childNodes].filter(x => x.nodeType === 3).map(x => x.textContent.trim()).join(' ').trim();
    return {
      texto: proprio.slice(0, 40),
      papel: n.getAttribute('data-role') || '',
      tag: n.tagName.toLowerCase(),
      // display:none também tem estilo computado: só conta o nó que tem caixa.
      visivel: n.getClientRects().length > 0 && getComputedStyle(n).visibility !== 'hidden',
      estilo: ler(getComputedStyle(n)) + '§' + ler(getComputedStyle(n, '::before')) + '§' + ler(getComputedStyle(n, '::after')),
    };
  });
}`;

const resultado = {};

for (const [chave, lista] of grupos) {
  const [plataforma, pagina] = chave.split('|');
  const selections = lista.map(i => ({ uid: `v-${i.layoutKey}-${i.id}`, id: i.id, layoutKey: i.layoutKey, pagina: i.pagina[0] }));
  const res = await fetch(`${BASE_URL}/gerador/api/preview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...snapshotBase, platform: plataforma, selections }),
  });
  if (!res.ok) {
    r.ok(`${chave}: snapshot do preview`, false, `HTTP ${res.status}`);
    continue;
  }
  const { id } = await res.json();

  for (const largura of [1440, 375]) {
    const page = await browser.newPage();
    await page.setViewport({ width: largura, height: 900 });
    await page.goto(`${BASE_URL}/p/${id}/${SLUG[pagina]}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForSelector('[data-section-uid]', { timeout: 60000 }).catch(() => {});
    await espera(2500);
    // Sem transição nem animação: com `transition: color .3s` o estilo computado
    // logo depois da troca ainda é o valor velho (falso "não muda"), e um
    // carrossel/fade em andamento muda nós sem variável nenhuma (falso "muda").
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    await espera(300);

    for (const item of lista) {
      const uid = `v-${item.layoutKey}-${item.id}`;
      const nome = `${item.component} (${plataforma}/${pagina})`;
      resultado[nome] ??= {};
      const antes = await page.evaluate(new Function(`return (${LER})`)(), uid);
      if (!antes) {
        if (largura === 1440) r.ok(`${nome}: a seção renderiza no /p`, false);
        continue;
      }
      for (const v of item.variablesSchema) {
        const valor = v.type === 'font' ? FONTE : COR;
        // A base é lida de novo a cada variável, no mesmo tique da troca: o que
        // mudar sozinho entre uma variável e outra (autoplay) não conta.
        const { base, depois } = await page.evaluate(
          (uid, css, val, ler) => {
            const w = document.querySelector(`[data-section-uid="${uid}"]`);
            const fn = new Function(`return (${ler})`)();
            // `transition` com !important numa classe vence o reset global:
            // a transição criada pela troca é levada ao fim antes da leitura.
            const fimDasTransicoes = () => {
              void getComputedStyle(w).color;
              for (const a of document.getAnimations()) if (a instanceof CSSTransition) a.finish();
            };
            const base = fn(uid);
            w.style.setProperty(css, val);
            fimDasTransicoes();
            const out = fn(uid);
            w.style.removeProperty(css);
            fimDasTransicoes();
            return { base, depois: out };
          },
          uid,
          v.cssVar,
          valor,
          LER
        );
        let mudou = depois
          .map((n, k) => (base[k] && n.estilo !== base[k].estilo ? n : null))
          .filter(Boolean);
        const ocultos = mudou.filter(n => !n.visivel).length;
        mudou = mudou.filter(n => n.visivel);
        const reg = (resultado[nome][v.cssVar] ??= { rotulo: v.label, tipo: v.type, nota: v.previewNote ?? null, nos: {}, textos: {} });
        reg.nos[largura] = mudou.length;
        (reg.ocultos ??= {})[largura] = ocultos;
        reg.textos[largura] = [...new Set(mudou.filter(n => n.texto).map(n => n.papel || n.texto))].slice(0, 12);
      }
    }
    await page.close();
  }
}

// ── Veredito por variável e por item
for (const [nome, vars] of Object.entries(resultado)) {
  for (const [css, v] of Object.entries(vars)) {
    const total = (v.nos[1440] ?? 0) + (v.nos[375] ?? 0);
    if (v.nota && total === 0) {
      console.log(`  ⏸️  ${nome}: ${css} (“${v.rotulo}”) não aparece em repouso — ${v.nota}`);
      continue;
    }
    const ocultos = (v.ocultos?.[1440] ?? 0) + (v.ocultos?.[375] ?? 0);
    r.ok(
      `${nome}: ${css} (“${v.rotulo}”) muda a tela`,
      total > 0,
      ocultos ? `só muda ${ocultos} nó(s) sem caixa (display:none/hidden)` : 'nenhum nó muda em 1440 nem em 375'
    );
  }
  const fontes = Object.entries(vars).filter(([, v]) => v.tipo === 'font');
  for (let a = 0; a < fontes.length; a++) {
    for (let b = a + 1; b < fontes.length; b++) {
      const [ca, va] = fontes[a];
      const [cb, vb] = fontes[b];
      const ta = [...(va.textos[1440] ?? []), ...(va.textos[375] ?? [])].sort().join('|');
      const tb = [...(vb.textos[1440] ?? []), ...(vb.textos[375] ?? [])].sort().join('|');
      if (!ta || !tb) continue;
      r.ok(`${nome}: “${va.rotulo}” e “${vb.rotulo}” mudam textos diferentes`, ta !== tb, `${ca} e ${cb} mudam os mesmos textos: ${ta.slice(0, 120)}`);
    }
  }
}

fs.mkdirSync(SAIDA, { recursive: true });
fs.writeFileSync(path.join(SAIDA, 'variaveis-efeito.json'), JSON.stringify(resultado, null, 2));
console.log(`   textos que cada variável muda: .funil/variaveis-efeito.json`);

await browser.close();
process.exit(r.fechar() ? 0 : 1);
