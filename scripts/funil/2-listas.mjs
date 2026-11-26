/**
 * Estágio 2-listas — o canvas desenha só os itens que a lista do painel tem?
 *
 * Uma peça não pode inventar itens: o Banner 01 repetia o único slide do mock até
 * fazer 3 no carrossel, e o painel mostrava 1 — o CS não tinha como editar, apagar
 * ou duplicar os outros dois. Para cada lista de objetos que o painel mostra
 * (`campos.generated.json`), em lotes por página, semeia a lista com 1 item e com
 * 3 (todo texto = um marcador do item; escolha de lista = a 1ª opção) e conta o
 * marcador do 1º item no canvas: com 1 item ele não pode aparecer mais vezes do
 * que com 3. Lista cujo item não desenha o marcador fica como ⏳ (inconclusiva).
 *
 * Repetição de propósito (o mesmo item, não um item a mais) fica em `REPETE`.
 */
import { espera, itens, ler, RAIZ, relatorio } from './lib/util.mjs';
import { abrirBrowser, novaAba, semear, trocarPagina } from './lib/editor.mjs';
import path from 'node:path';

const r = relatorio('2-listas · o canvas desenha só os itens da lista do painel');

const REPETE = {
  'Header07.topbarNotices': 'a mensagem sai na barra de computador e na rotativa do celular',
  'Header13.topbarItems': 'letreiro: a fita repete as mensagens até cobrir a largura',
};

const schemas = JSON.parse(ler(path.join(RAIZ, 'src/data/conteudo/schemas.generated.json'))).componentes;
const desenhados = JSON.parse(ler(path.join(RAIZ, 'src/data/conteudo/campos.generated.json'))).componentes;

/** Um item com todo texto = o marcador (escolha = a 1ª opção; listas internas vazias). */
function item(schemaItem, marcador) {
  const saida = {};
  for (const [k, v] of Object.entries(schemaItem.properties ?? {}))
    if (v.type === 'string' && Array.isArray(v.enum)) saida[k] = v.enum[0];
    else if (v.type === 'string') saida[k] = marcador;
    else if (v.type === 'array') saida[k] = [];
  return saida;
}
const marca = (comp, campo) => `MKL${comp}${campo}`.replace(/[^A-Za-z0-9]/g, '');

const porPagina = { common: [], home: [], category: [], product: [] };
for (const i of itens()) {
  if (!i.platforms.includes('VTEX') || !desenhados[i.component]) continue;
  const props = schemas[i.component]?.schema.properties ?? {};
  const listas = desenhados[i.component].filter(
    f => props[f]?.type === 'array' && props[f].items?.type === 'object'
  );
  if (listas.length) porPagina[i.pagina[0]].push({ i, listas, props });
}

const browser = await abrirBrowser();
const inventam = [];
const inconclusivas = [];
let auditadas = 0;
try {
  const { page } = await novaAba(browser);
  for (const [pagina, lista] of Object.entries(porPagina)) {
    for (let ini = 0; ini < lista.length; ini += 25) {
      const lote = lista.slice(ini, ini + 25);
      const contagem = {};
      for (const quantos of [1, 3]) {
        const selecoes = lote.map(({ i, listas, props }, k) => ({
          uid: `lt-${k}`,
          id: i.id,
          layoutKey: i.layoutKey,
          pagina,
          content: Object.fromEntries(
            listas.map(campo => [
              campo,
              Array.from({ length: quantos }, (_, q) => item(props[campo].items, `${marca(i.component, campo)}Q${q}`)),
            ])
          ),
        }));
        await semear(page, { plataforma: 'VTEX', selecoes });
        if (pagina !== 'home') await trocarPagina(page, pagina);
        await page
          .waitForFunction(
            () => (document.querySelector('iframe')?.contentDocument?.querySelectorAll('[data-section-uid]').length ?? 0) > 0,
            { timeout: 60000, polling: 250 }
          )
          .catch(() => {});
        await espera(2500);
        const html = await page.evaluate(() => document.querySelector('iframe')?.contentDocument?.body?.innerHTML ?? '');
        for (const { i, listas } of lote)
          for (const campo of listas)
            (contagem[`${i.component}.${campo}`] ??= {})[quantos] =
              html.split(`${marca(i.component, campo)}Q0`).length - 1;
      }
      for (const [chave, c] of Object.entries(contagem)) {
        auditadas++;
        if (!c[3]) inconclusivas.push(chave);
        else if (c[1] > c[3] && !REPETE[chave]) inventam.push(`${chave} (1 item → ${c[1]}×; 3 itens → ${c[3]}× do 1º)`);
      }
    }
  }
} finally {
  await browser.close();
}

r.ok(`nenhuma peça desenha mais itens do que a lista tem (${auditadas} listas)`, !inventam.length, inventam.join(' | '));
for (const [chave, motivo] of Object.entries(REPETE)) console.log(`  ℹ️  ${chave}: repete de propósito — ${motivo}`);
if (inconclusivas.length)
  console.log(`  ⏳ ${inconclusivas.length} listas não desenham o marcador (item de escolha ou ícone): ${inconclusivas.join(', ')}`);
process.exit(r.fechar() ? 0 : 1);
