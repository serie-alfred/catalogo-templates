/**
 * O que o LOJISTA consegue mudar depois do tema publicado, campo a campo, em cada
 * plataforma — a lista que o painel Conteúdo mostra (e o preview respeita):
 *
 *   ../global-templates/<Tray|Wake|Nuvemshop>/<Página>/template_<N>/<selection>/
 *     → src/data/conteudo/editaveis.generated.json
 *
 * Regra do produto: campo que o lojista muda de algum jeito na plataforma (CMS,
 * Design Studio, painel do tema, Gestor de Menu) fica editável no e-temas; campo
 * que fica fixo no código do tema não aparece. Sem aviso: some.
 *
 * - **VTEX** não entra no arquivo: o painel É o schema do CMS da FastStore.
 * - **Wake 2.0** decide por pasta: `<selection>.schema.json` (bloco do Design
 *   Studio, home e categoria), `global: true` (vira um Conteúdo da Wake) ou o
 *   rodapé (exceção do produto: o cliente pede troca de texto e link depois) =
 *   todos os campos; sem bloco, só o que vem do Gestor de Menu (`menu_groups`
 *   no HTML). PDP e header não são bloco.
 * - **Tray** (painel do tema: `settings-content.html` + `settings.X|default('…')`)
 *   e **Nuvemshop** (settings do `{% schema %}` do `.tpl`) decidem por CAMPO: o
 *   texto do mock da réplica é o padrão do setting que o substitui, então campo
 *   cujo texto está entre os padrões é editável. Imagem, link, data e menu não
 *   têm texto em comum: valem se a pasta tem um setting daquele tipo (o link, se
 *   o rótulo ao lado for editável). Pasta sem painel = nada. Logo, nome, redes,
 *   pagamento e linha legal valem por evidência na pasta (`POR_EVIDENCIA`).
 * - **Conteúdo do produto** (`DO_PRODUTO`): na PDP, a tag, os acordeões e os
 *   textos descritivos vêm, na loja, do CADASTRO de cada produto — editáveis em
 *   toda plataforma, mesmo onde a PDP não tem CMS (Wake). Saem também em
 *   `doProduto`, para o painel dizer de onde vêm.
 * - **A descrição e a ficha do produto** (`daFicha`): as peças da PDP que as
 *   desenham (lidas do produto da loja) ganham os dois campos do produto no
 *   painel da seção — na loja, vêm do cadastro em toda plataforma.
 *
 *   yarn derivar:editaveis
 *
 * Outro checkout do global-templates entra por `DERIVAR_GLOBAL_TEMPLATES`. O
 * estágio `1-conteudo` do funil compara o arquivo com `derivarEditaveis()`.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { GLOBAL_TEMPLATES, RAIZ, itens, ler } from './funil/lib/util.mjs';
import { arquivosDasReplicas, serializar } from './derivar-conteudo.mjs';

export const ARQUIVO_EDITAVEIS = path.join(
  RAIZ,
  'src/data/conteudo/editaveis.generated.json'
);

/** As plataformas com limite (VTEX é o CMS inteiro; a Wake legado saiu do seletor). */
export const PLATAFORMAS = ['Tray', 'Wake 2.0', 'Nuvemshop'];

const PASTA = { common: 'Common', home: 'Home', category: 'Category', product: 'Product' };

const norm = s => String(s).replace(/\s+/g, ' ').trim();

const ENTIDADES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decodificar = s =>
  s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) =>
    e[0] === '#'
      ? String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : +e.slice(1))
      : (ENTIDADES[e.toLowerCase()] ?? m)
  );

/* ── O lado do catálogo: o mock de cada campo ─────────────────────────── */

/** O texto do objeto literal passado a `useConteudoDaSecao(...)`. */
function fonteDoMock(fonte) {
  const id = /useConteudoDaSecao\((\w+)\)/.exec(fonte)?.[1];
  if (!id) return null;
  const m = new RegExp(`const\\s+${id}\\b[^=]*=\\s*\\{`).exec(fonte);
  if (!m) return null;
  let profundidade = 0;
  let saida = '';
  for (let i = m.index + m[0].length; i < fonte.length; i++) {
    const c = fonte[i];
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < fonte.length && fonte[j] !== c) j += fonte[j] === '\\' ? 2 : 1;
      saida += fonte.slice(i, j + 1);
      i = j;
      continue;
    }
    if ('{(['.includes(c)) profundidade++;
    else if ('})]'.includes(c)) {
      if (profundidade === 0) break;
      profundidade--;
    }
    saida += c;
  }
  return saida;
}

/** Campo de 1º nível → os textos e números que o mock dele traz (aninhados inclusive). */
function folhasDoMock(objeto) {
  const folhas = {};
  let profundidade = 0;
  let chave = null;
  for (let i = 0; i < objeto.length; ) {
    const c = objeto[i];
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < objeto.length && objeto[j] !== c) j += objeto[j] === '\\' ? 2 : 1;
      if (chave) (folhas[chave] ??= []).push(objeto.slice(i + 1, j).replace(/\\(['"`\\])/g, '$1'));
      i = j + 1;
      continue;
    }
    if ('{(['.includes(c)) profundidade++;
    else if ('})]'.includes(c)) profundidade--;
    else if (profundidade === 0) {
      const m = /^(\w+)\s*:/.exec(objeto.slice(i));
      if (m && /[\s,{]/.test(objeto[i - 1] ?? ',')) {
        chave = m[1];
        i += m[0].length;
        continue;
      }
    } else if (chave && /\d/.test(c) && !/[\w.]/.test(objeto[i - 1])) {
      const n = /^\d+(\.\d+)?/.exec(objeto.slice(i))[0];
      (folhas[chave] ??= []).push(n);
      i += n.length;
      continue;
    }
    i++;
  }
  return folhas;
}

/** O tipo do campo, pelo schema do starter (o que diz se é imagem) e pelo nome. */
function tipoDoCampo(chave, schema) {
  const widget = schema?.widget?.['ui:widget'];
  if (widget === 'image-uploader' || widget === 'media-gallery') return 'imagem';
  if (/(^|[a-z])(Url|Href)$|^(url|href|link)$|Link$/.test(chave) && schema?.type !== 'array')
    return 'link';
  if (/date|Date$/.test(chave) || /\bISO\b/.test(schema?.title ?? '')) return 'data';
  if (/Alt$|^alt$/.test(chave)) return 'alt';
  return 'texto';
}

/**
 * Campos sem texto em comum com o tema, mas que a pasta prova editáveis por outra
 * via: o cadastro da loja (Nuvemshop: logo, nome, redes) ou um setting com nome
 * próprio (Tray: `*_marca`, `*_pagamentos`). A prova é procurada no painel da
 * Tray (`settings-content.html`) e no `.tpl` da Nuvemshop.
 */
const SOCIAL_DA_LOJA = /settings\.social_(facebook|instagram|twitter|linkedin|youtube|tiktok|pinterest)/;
const POR_EVIDENCIA = [
  { campo: /^logo(Alt)?$/, Nuvemshop: /store\.logo|has_logo/, Tray: /name="\w*logo|settings\.logo\b/ },
  { campo: /^brand(Name|Mark)$/, Nuvemshop: /store\.name/, Tray: /name="\w*_marca/ },
  {
    // As redes da loja: lista (`socials`) ou um link por rede (`instagramUrl`).
    // Na Wake e na Tray antigas vêm das configurações da loja (`settings.social_*`).
    campo: /^socials?$|^(youtube|instagram|twitter|linkedin|facebook|tiktok|pinterest)Url$/,
    Nuvemshop: /store\.(instagram|facebook)|rede_/,
    Tray: /name="\w*(instagram|redes|social)|settings\.social_(facebook|instagram|twitter|linkedin|youtube|tiktok|pinterest)/,
    'Wake 2.0': SOCIAL_DA_LOJA,
  },
  // O WhatsApp/contato do topo das famílias antigas: o número das configurações da loja.
  // Na Wake, também o link de WhatsApp de um api-content (a barra do topo, um conteúdo editável).
  {
    campo: /^(whatsapp|contact)$/,
    Tray: /settings\.whatsapp_number/,
    'Wake 2.0': /settings\.social_whatsapp\b|class="[^"]*\bapi-content\b[^"]*"[^>]*>[^]{0,600}?(api\.whatsapp\.com|wa\.me)/,
  },
  // O rótulo do WhatsApp só é editável quando vem dentro do conteúdo (na Tray ele é fixo).
  { campo: /^whatsappLabel$/, 'Wake 2.0': /class="[^"]*\bapi-content\b[^"]*"[^>]*>[^]{0,600}?(api\.whatsapp\.com|wa\.me)/ },
  { campo: /^(payments|paymentMethods)$/, Nuvemshop: /pagamento|"visa"/, Tray: /name="\w*pagamento/ },
  // A linha legal tem marcadores ([RAZÃO SOCIAL]…) que o tema troca pelos dados da loja.
  { campo: /^(legal|copyright)$/, Nuvemshop: /"id": "(legal|copyright)"/, Tray: /name="\w*_(legal|copyright)/ },
];

/**
 * [peça, campos] que, na loja, são do cadastro do produto e não do tema. O resto
 * da PDP (botões, frete, CEP, avise-me, política da loja) segue a plataforma.
 */
const DO_PRODUTO = [
  // A tag do produto ("Novidade", "Novo", "Oferta", "Drop 07").
  [/^ProductInfo(02|09|13)$/, /^(newLabel|newTagLabel|offerTagLabel|badge)$/],
  // Os acordeões da descrição (descrição, composição, modo de usar, garantia…).
  [/^ProductInfo\d+$/, /^(accordions|extraAccordion)$/],
  // A legenda da tabela de medidas, que é do produto.
  [/^ProductInfo14$/, /^sizeTableCaption$/],
  // 07: a linha/coleção e os benefícios da peça; o título, o FAQ e a entrega da descrição.
  [/^ProductInfo07$/, /^(eyebrow|benefits)$/],
  [/^ProductDescription07$/, /^(descTitle|faqItems|deliveryInfo)$/],
  // 10: a aba extra (garantia) e o quadro de garantia da descrição.
  [/^ProductDescription10$/, /^(extraTab(Label|Text)|info(Title|Text))$/],
];

/**
 * O miolo de cada `<div class="… api-content …">` do HTML (fora dos comentários Scriban,
 * que costumam citá-lo): o trecho que o generator da Wake publica como conteúdo.
 */
function blocosApiContent(html) {
  const semComentario = html.replace(/\{\{-?~?\s*##[\s\S]*?##\s*~?-?\}\}/g, '');
  const blocos = [];
  const abre = /<div\b[^>]*class="[^"]*\bapi-content\b[^"]*"[^>]*>/g;
  let m;
  while ((m = abre.exec(semComentario))) {
    let nivel = 1;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = m.index + m[0].length;
    let t;
    while (nivel && (t = tag.exec(semComentario))) nivel += t[0][1] === '/' ? -1 : 1;
    if (!t) break;
    blocos.push(semComentario.slice(m.index + m[0].length, t.index));
  }
  return blocos;
}

/* ── O lado da plataforma: o que a pasta deixa o lojista trocar ───────── */

/**
 * `{ textos, imagem, link, data, menu, tudo, menuDoHtml }` da pasta, ou null se a
 * pasta não existe. `tudo` = a pasta inteira é editável (bloco Wake, global).
 */
function capacidades(plataforma, pasta, item) {
  if (!fs.existsSync(pasta)) return null;
  const arquivos = fs.readdirSync(pasta, { recursive: true }).map(f => path.join(pasta, String(f)));
  const cap = { textos: new Set(), imagem: false, link: false, data: false, menu: false, tudo: false, fonte: '' };

  if (plataforma === 'Wake 2.0') {
    // O rodapé não é bloco, mas é exceção do produto: o cliente pede para trocar
    // textos e links depois, e o time os troca no tema — então fica editável como na VTEX.
    cap.tudo =
      item.global === true ||
      item.selection === 'footer' ||
      arquivos.some(f => f.endsWith('.schema.json'));
    cap.menu = arquivos.some(f => f.endsWith('.html') && ler(f).includes('menu_groups'));
    // O que o HTML lê das configurações da loja (redes, WhatsApp): `POR_EVIDENCIA`.
    cap.fonte = arquivos.filter(f => f.endsWith('.html')).map(ler).join('\n');
    // O que está num `api-content` (a barra do topo do header) vira um conteúdo da Wake que o
    // lojista edita em Conteúdos: os textos dele casam com o mock como os da Tray.
    for (const bloco of blocosApiContent(cap.fonte)) {
      for (const t of bloco.split(/<[^>]*>/)) if (norm(decodificar(t))) cap.textos.add(norm(decodificar(t)));
      if (/<a\b[^>]*href=/i.test(bloco)) cap.link = true;
      if (/<img\b/i.test(bloco)) cap.imagem = true;
    }
    return cap;
  }

  if (plataforma === 'Tray') {
    const painel = path.join(pasta, 'settings-content.html');
    // Sem painel do tema, o menu do header ainda é a árvore de categorias da loja.
    cap.menu = arquivos.some(f => f.endsWith('.html') && /\bcategories\b/.test(ler(f)));
    // As configurações da loja que o HTML lê (redes, WhatsApp, logo) valem mesmo sem painel.
    cap.fonte = arquivos.filter(f => f.endsWith('.html')).map(ler).join('\n');
    if (!fs.existsSync(painel)) return cap;
    const html = ler(painel);
    for (const m of html.matchAll(/(?:placeholder|value)="([^"]*)"/g)) cap.textos.add(norm(decodificar(m[1])));
    for (const m of html.matchAll(/<textarea[^>]*>([\s\S]*?)<\/textarea>/g))
      for (const linha of decodificar(m[1]).split('\n')) cap.textos.add(norm(linha));
    for (const f of arquivos.filter(a => a.endsWith('.html')))
      for (const m of ler(f).matchAll(/\|default\((['"])((?:(?!\1).)*)\1\)/g)) cap.textos.add(norm(m[2]));
    const nomes = [...html.matchAll(/name="([^"]+)"/g)].map(m => m[1]);
    cap.imagem = nomes.some(n => /img|imagem|image|logo|banner|arte/.test(n)) || /type="file"/.test(html);
    cap.link = nomes.some(n => /url|link|href/.test(n));
    cap.data = nomes.some(n => /data|fim|date|prazo/.test(n));
    // Menu do header = a árvore de categorias; links do rodapé = textarea "Rótulo | /url".
    cap.menu = true;
    return cap;
  }

  // Nuvemshop
  const settings = [];
  const coletar = no => {
    if (Array.isArray(no)) no.forEach(coletar);
    else if (no && typeof no === 'object') {
      if (no.type === 'setting') settings.push(no);
      Object.values(no).forEach(coletar);
    }
  };
  for (const f of arquivos.filter(a => a.endsWith('.tpl'))) {
    const tpl = ler(f);
    cap.fonte += tpl;
    // O menu principal é a navegação nativa da loja (Navegação, no admin).
    if (/\bnavigation\b/.test(tpl.replace(/\{%\s*schema[\s\S]*$/, ''))) cap.menu = true;
    const schema = /\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/.exec(tpl)?.[1];
    if (schema) coletar(JSON.parse(schema));
  }
  {
    for (const s of settings) {
      const t = s.setting_type;
      if (t === 'image_picker') cap.imagem = true;
      else if (t === 'url') cap.link = true;
      else if (t === 'date' || t === 'time') cap.data = true;
      else if (t === 'menu') cap.menu = true;
      if (s.default !== undefined && s.default !== '' && typeof s.default !== 'boolean')
        cap.textos.add(norm(s.default));
    }
  }
  return cap;
}

/** Campo de 1º nível → o texto do valor dele no objeto literal do mock. */
function valoresDoMock(objeto) {
  const valores = {};
  let profundidade = 0;
  let chave = null;
  let inicio = 0;
  const fecha = fimDoValor => {
    if (chave) valores[chave] = objeto.slice(inicio, fimDoValor).trim();
    chave = null;
  };
  for (let i = 0; i < objeto.length; ) {
    const c = objeto[i];
    if (c === "'" || c === '"' || c === '`') {
      let j = i + 1;
      while (j < objeto.length && objeto[j] !== c) j += objeto[j] === '\\' ? 2 : 1;
      i = j + 1;
      continue;
    }
    if ('{(['.includes(c)) profundidade++;
    else if ('})]'.includes(c)) profundidade--;
    else if (profundidade === 0 && c === ',') fecha(i);
    else if (profundidade === 0 && !chave) {
      const m = /^(\w+)\s*:/.exec(objeto.slice(i));
      if (m && /[\s,{]/.test(objeto[i - 1] ?? ',')) {
        chave = m[1];
        i += m[0].length;
        inicio = i;
        continue;
      }
    }
    i++;
  }
  fecha(objeto.length);
  return valores;
}

/**
 * Os campos (de um nível) que a plataforma deixa o lojista trocar: texto em comum
 * com o setting, menu, evidência (`POR_EVIDENCIA`) e imagem/link/data pelo tipo.
 */
function decidir(campos, folhas, props, cap, plataforma, deMenu) {
  const editaveis = new Set();
  // 1º os campos de texto (o link e o alt olham para eles).
  for (const c of campos) {
    if (deMenu.has(c)) {
      if (cap.menu) editaveis.add(c);
      continue;
    }
    const textos = (folhas[c] ?? []).map(norm).filter(Boolean);
    if (textos.some(t => cap.textos.has(t))) editaveis.add(c);
  }
  for (const c of campos) {
    if (editaveis.has(c) || deMenu.has(c)) continue;
    const tipo = tipoDoCampo(c, props[c]);
    const irmao = c.replace(/(Url|Href|Link|Alt)$/, '');
    const temIrmao =
      [irmao, `${irmao}Label`, `${irmao}Text`, `${irmao}Title`].some(
        x => x !== c && editaveis.has(x)
      ) || (/^(url|href|link)$/.test(c) && [...editaveis].some(x => /cta|Label$|^title$/.test(x)));
    const evidencia = POR_EVIDENCIA.find(e => e.campo.test(c))?.[plataforma];
    if (evidencia?.test(cap.fonte)) editaveis.add(c);
    else if (tipo === 'imagem' && cap.imagem) editaveis.add(c);
    else if (tipo === 'alt' && cap.imagem) editaveis.add(c);
    else if (tipo === 'link' && cap.link && temIrmao) editaveis.add(c);
    else if (tipo === 'data' && cap.data) editaveis.add(c);
  }
  return editaveis;
}

/* ── O casamento ──────────────────────────────────────────────────────── */

/** Campo → slot da loja dos vínculos de menu (src/utils/conteudoLoja.ts). */
async function camposDeMenu() {
  const { VINCULOS_RESUMO } = await import(
    pathToFileURL(path.join(RAIZ, 'src/utils/conteudoLoja.ts')).href
  );
  return VINCULOS_RESUMO.filter(v => v.slot === 'menuPrincipal' || v.slot === 'menuRodape');
}

export async function derivarEditaveis(globalTemplates = process.env.DERIVAR_GLOBAL_TEMPLATES || GLOBAL_TEMPLATES) {
  const desenhados = JSON.parse(ler(path.join(RAIZ, 'src/data/conteudo/campos.generated.json'))).componentes;
  const schemas = JSON.parse(ler(path.join(RAIZ, 'src/data/conteudo/schemas.generated.json'))).componentes;
  const replicas = arquivosDasReplicas();
  const menus = await camposDeMenu();

  const componentes = {};
  const doProduto = {};
  for (const item of itens()) {
    const campos = desenhados[item.component];
    if (!campos?.length || componentes[item.component]) continue;
    const objeto = fonteDoMock(ler(replicas.get(item.component)));
    const folhas = objeto ? folhasDoMock(objeto) : {};
    const props = schemas[item.component]?.schema.properties ?? {};
    const deMenu = new Set(
      menus.filter(v => new RegExp(v.de).test(item.component)).map(v => v.campo)
    );
    const doCadastro = campos.filter(c =>
      DO_PRODUTO.some(([peca, campo]) => peca.test(item.component) && campo.test(c))
    );
    if (doCadastro.length) doProduto[item.component] = doCadastro;

    const porPlataforma = {};
    for (const plataforma of PLATAFORMAS) {
      if (!item.platforms.includes(plataforma)) continue;
      const pasta = path.join(
        globalTemplates,
        plataforma === 'Wake 2.0' ? 'Wake' : plataforma,
        PASTA[item.pagina[0]],
        `template_${item.template}`,
        item.selection
      );
      const cap = capacidades(plataforma, pasta, item);
      const editaveis = new Set();
      if (cap?.tudo) campos.forEach(c => editaveis.add(c));
      else if (cap) {
        decidir(campos, folhas, props, cap, plataforma, deMenu).forEach(c => editaveis.add(c));
        // Campo-objeto (a `topbar` do Header01) que não é todo editável: decide por
        // subcampo e grava `campo.sub` — o painel e o preview mostram só esses.
        for (const c of campos) {
          const sub = props[c]?.properties;
          if (editaveis.has(c) || props[c]?.type !== 'object' || !sub) continue;
          const subcampos = Object.keys(sub);
          const valor = (valoresDoMock(objeto ?? '')[c] ?? '').trim();
          const interno = valor.startsWith('{') ? valor.slice(1, -1) : '';
          const sim = decidir(subcampos, folhasDoMock(interno), sub, cap, plataforma, new Set());
          if (sim.size === subcampos.length) editaveis.add(c);
          else sim.forEach(k => editaveis.add(`${c}.${k}`));
        }
      }
      doCadastro.forEach(c => editaveis.add(c));
      porPlataforma[plataforma] = [...editaveis].sort(
        (a, b) => campos.indexOf(a.split('.')[0]) - campos.indexOf(b.split('.')[0])
      );
    }
    componentes[item.component] = porPlataforma;
  }

  // As peças da PDP que desenham a descrição ou a ficha do produto da loja.
  const daFicha = {};
  for (const [nome, arquivo] of replicas) {
    if (!/^Product(Info|Description)\d+$/.test(nome)) continue;
    const fonte = ler(arquivo);
    if (!fonte.includes('useProdutosDaLoja')) continue;
    const campos = ['description', 'specs'].filter(c => new RegExp(`\\.${c}\\b`).test(fonte));
    if (campos.length) daFicha[nome] = campos;
  }

  // As peças que desenham a categoria da loja (nome, descrição, FAQ): o painel da
  // seção oferece esses campos do cadastro da categoria ali mesmo.
  const daCategoria = {};
  for (const [nome, arquivo] of replicas) {
    const fonte = ler(arquivo);
    if (!fonte.includes('useCategoriaDaLoja')) continue;
    const campos = [
      /useCategoriaDaLoja\(\)\?\.name|\b(categoria|loja)\?\.name/.test(fonte) && 'name',
      /\.paragrafos/.test(fonte) && 'description',
      /\bcategoria\??\.faq/.test(fonte) && 'faq',
    ].filter(Boolean);
    if (campos.length) daCategoria[nome] = campos;
  }

  const ordenar = o => Object.fromEntries(Object.entries(o).sort(([a], [b]) => a.localeCompare(b)));
  return {
    $gerado:
      'yarn derivar:editaveis, dos portes em global-templates (Wake: bloco/global/Gestor de Menu; Tray: painel do tema; Nuvemshop: settings). VTEX não entra: lá vale o schema do CMS inteiro. Não edite à mão.',
    doProduto: ordenar(doProduto),
    daFicha: ordenar(daFicha),
    daCategoria: ordenar(daCategoria),
    componentes: ordenar(componentes),
  };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const gt = process.env.DERIVAR_GLOBAL_TEMPLATES || GLOBAL_TEMPLATES;
  if (!fs.existsSync(path.join(gt, 'Wake'))) {
    console.error(`global-templates não encontrado em ${gt} (DERIVAR_GLOBAL_TEMPLATES aponta outro checkout).`);
    process.exit(1);
  }
  const dados = await derivarEditaveis(gt);
  fs.writeFileSync(ARQUIVO_EDITAVEIS, serializar(dados));
  const total = {};
  const sim = {};
  const desenhados = JSON.parse(ler(path.join(RAIZ, 'src/data/conteudo/campos.generated.json'))).componentes;
  for (const [comp, porPlat] of Object.entries(dados.componentes))
    for (const [p, lista] of Object.entries(porPlat)) {
      total[p] = (total[p] ?? 0) + desenhados[comp].length;
      sim[p] = (sim[p] ?? 0) + lista.length;
    }
  console.log(
    `${Object.keys(dados.componentes).length} peças → ${path.relative(RAIZ, ARQUIVO_EDITAVEIS)}\n${ 
      PLATAFORMAS.map(p => `  ${p}: ${sim[p] ?? 0}/${total[p] ?? 0} campos editáveis pelo lojista`).join('\n')}`
  );
}
