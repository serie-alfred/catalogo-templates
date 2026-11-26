/**
 * Estágio 1c — o conteúdo real do cliente (src/types/conteudo.ts) está de pé?
 *
 * O CS sobe textos, imagens e listas em cima do mock de cada componente; o
 * que dá para editar vem do `section.schema` dos manifests do starter (o CMS
 * da VTEX), copiado por `yarn derivar:conteudo`. Confere, sem navegador:
 *
 *  1. o schema gerado é o do starter — um campo novo lá precisa de um
 *     `yarn derivar:conteudo` aqui (sem o starter ao lado, só avisa);
 *  2. as regras do `resolverConteudo` e do `sanitizarConteudo`, rodando o
 *     próprio `src/utils/conteudo.ts` no Node (só importa tipos);
 *  3. todo componente que lê pelo `useConteudoDaSecao` tem schema, e todo campo
 *     do tipo `…Conteudo` dele existe no schema — erro de digitação num nome de
 *     campo faria o painel gravar uma chave que o template nunca lê;
 *  4. família listada em `FAMILIAS_MIGRADAS` tem TODO componente com schema
 *     lendo pelo hook (trava de regressão para a migração, família a família).
 *
 * Não prova que o campo aparece na tela: isso é com o `2-conteudo` (marcador
 * único em cada campo, conferido no DOM).
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

import {
  FASTSTORE_STARTER,
  GLOBAL_TEMPLATES,
  RAIZ,
  itens,
  ler,
  relatorio,
} from './lib/util.mjs';
import { ARQUIVO_EDITAVEIS, derivarEditaveis } from '../derivar-editaveis.mjs';
import {
  ARQUIVO_CAMPOS,
  ARQUIVO_SCHEMAS,
  arquivosDasReplicas,
  camposDoTipo,
  derivarCampos,
  derivarConteudo,
  serializar,
} from '../derivar-conteudo.mjs';

/** Famílias cuja migração terminou: todo componente com schema lê pelo hook. */
const FAMILIAS_MIGRADAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];

const r = relatorio('1-conteudo · schema do starter, resolvedor e migração');

// ── 1. schema gerado = starter ─────────────────────────────────────────────
const noDisco = ler(ARQUIVO_SCHEMAS);
r.ok('src/data/conteudo/schemas.generated.json existe', noDisco, 'rode yarn derivar:conteudo');
const schemas = noDisco ? JSON.parse(noDisco) : { componentes: {}, semSchema: [] };
const starter = process.env.DERIVAR_STARTER || FASTSTORE_STARTER;
if (fs.existsSync(path.join(starter, 'src/components'))) {
  r.ok(
    'schema gerado é o do starter (yarn derivar:conteudo sem diff)',
    // CRLF → LF: com `core.autocrlf=true` (Windows) o git entrega o arquivo com
    // CRLF, e o 1-checkout já reprova por isso; aqui a comparação é do conteúdo.
    noDisco.replace(/\r\n/g, '\n') === serializar(derivarConteudo(starter)),
    'um manifest mudou: rode yarn derivar:conteudo e revise o diff'
  );
} else {
  console.log('  ⏳ schema não conferido contra o starter: sem faststore.starter ao lado');
}
r.ok(
  'campos.generated.json é o das réplicas de agora (yarn derivar:conteudo sem diff)',
  ler(ARQUIVO_CAMPOS).replace(/\r\n/g, '\n') === serializar(derivarCampos()),
  'uma réplica mudou o tipo …Conteudo ou passou a ler pelo hook: rode yarn derivar:conteudo'
);

// ── 1a. escolha é lista, não texto ───────────────────────────────────────
// O lojista escolhe ícone e rede de uma lista; nunca cola SVG nem digita um nome
// que a peça precisa reconhecer (a régua 01 pedia "Ícone (SVG)" e o injetava).
const textoQueDeviaSerLista = [];
const varrer = (comp, no, pref) => {
  for (const [k, v] of Object.entries(no.properties ?? {})) {
    const rotulo = `${v.title ?? ''} ${v.description ?? ''}`;
    if (v.type === 'string' && !v.enum && (/\bsvg\b/i.test(v.title ?? '') || /valores aceitos/i.test(rotulo)) && !v.widget)
      textoQueDeviaSerLista.push(`${comp}.${pref}${k}`);
    if (v.items) varrer(comp, v.items, `${pref}${k}[].`);
    if (v.properties) varrer(comp, v, `${pref}${k}.`);
  }
};
for (const [comp, { schema }] of Object.entries(schemas.componentes)) varrer(comp, schema, '');
r.ok(
  'nenhum campo de SVG livre nem de "valores aceitos" em texto (o schema oferece a lista)',
  !textoQueDeviaSerLista.length,
  textoQueDeviaSerLista.join(', ')
);

// ── 1b. o que o lojista edita em cada plataforma (yarn derivar:editaveis) ──
const editaveis = JSON.parse(ler(ARQUIVO_EDITAVEIS) || '{"componentes":{}}').componentes;
const desenhadosNoDisco = JSON.parse(ler(ARQUIVO_CAMPOS) || '{"componentes":{}}').componentes;
if (fs.existsSync(path.join(process.env.DERIVAR_GLOBAL_TEMPLATES || GLOBAL_TEMPLATES, 'Wake'))) {
  r.ok(
    'editaveis.generated.json é o dos portes de agora (yarn derivar:editaveis sem diff)',
    ler(ARQUIVO_EDITAVEIS).replace(/\r\n/g, '\n') === serializar(await derivarEditaveis()),
    'um porte, um mock ou uma réplica mudou: rode yarn derivar:editaveis e revise o diff'
  );
} else {
  console.log('  ⏳ editáveis não conferidos contra os portes: sem global-templates ao lado');
}
const foraDoPainel = Object.entries(editaveis).flatMap(([comp, porPlat]) =>
  Object.entries(porPlat).flatMap(([p, lista]) =>
    lista.filter(c => !desenhadosNoDisco[comp]?.includes(c.split('.')[0])).map(c => `${comp}.${c} (${p})`)
  )
);
r.ok('todo campo editável é um campo que o painel mostra', !foraDoPainel.length, foraDoPainel.join(', '));
const naPagina = pagina =>
  itens().filter(i => i.pagina[0] === pagina && editaveis[i.component]);
const doProduto = JSON.parse(ler(ARQUIVO_EDITAVEIS) || '{}').doProduto ?? {};
const pdpWake = naPagina('product').filter(i =>
  (editaveis[i.component]['Wake 2.0'] ?? []).some(c => !doProduto[i.component]?.includes(c))
);
r.ok(
  'Wake: na página de produto só o que é do cadastro do produto (sem Design Studio na PDP)',
  !pdpWake.length,
  pdpWake.map(i => `${i.component}: ${editaveis[i.component]['Wake 2.0']}`).join(' | ')
);
const cadastroFaltando = Object.entries(doProduto).flatMap(([comp, lista]) =>
  Object.entries(editaveis[comp] ?? {}).flatMap(([p, ed]) =>
    lista.filter(c => !ed.includes(c)).map(c => `${comp}.${c} (${p})`)
  )
);
r.ok(
  'o que é do cadastro do produto (tag, acordeões, descrição) é editável em toda plataforma',
  !cadastroFaltando.length && ['ProductInfo09', 'ProductInfo12', 'ProductInfo17'].every(c => doProduto[c]?.includes('accordions')) && doProduto.ProductInfo09.includes('newLabel'),
  cadastroFaltando.join(', ') || JSON.stringify(doProduto)
);
// O menu (Gestor de Menu / árvore de categorias) e o que o HTML lê das configurações
// da loja (`settings.social_*`, `settings.whatsapp_number`, `settings.logo`).
const MENU = /^(menu|navItems|mobileNavItems|categories|columns|logo|whatsapp|socials?|topbar\.(socials|contact)|(youtube|instagram|twitter|linkedin|facebook)Url)$/;
const headerWake = itens()
  .filter(i => i.selection === 'header' && editaveis[i.component]?.['Wake 2.0'])
  .filter(i => editaveis[i.component]['Wake 2.0'].some(c => !MENU.test(c)));
r.ok(
  'Wake: no header só o menu (Gestor de Menu) e o que vem das configurações da loja; o resto é do tema',
  !headerWake.length,
  headerWake.map(i => `${i.component}: ${editaveis[i.component]['Wake 2.0']}`).join(' | ')
);
const homeWakeParcial = naPagina('home').filter(
  i => i.platforms.includes('Wake 2.0') &&
    editaveis[i.component]['Wake 2.0'].length !== desenhadosNoDisco[i.component].length
);
r.ok(
  'Wake: seção da home é bloco do Design Studio, todo campo editável',
  !homeWakeParcial.length,
  homeWakeParcial.map(i => i.component).join(', ')
);
const inteiroNaWake = sel =>
  itens().filter(
    i => (sel === 'global' ? i.global : i.selection === sel) &&
      i.platforms.includes('Wake 2.0') && editaveis[i.component] &&
      editaveis[i.component]['Wake 2.0'].length !== desenhadosNoDisco[i.component].length
  );
for (const [sel, nome] of [['footer', 'o rodapé (exceção: o cliente troca texto e link depois)'], ['global', 'os globais (pop-up, ajuda flutuante: Conteúdos da Wake)']]) {
  const parciais = inteiroNaWake(sel);
  r.ok(`Wake: ${nome} com todo campo editável`, !parciais.length, parciais.map(i => i.component).join(', '));
}
const daFicha = JSON.parse(ler(ARQUIVO_EDITAVEIS) || '{}').daFicha ?? {};
const descricoesSemFicha = Object.keys(desenhadosNoDisco)
  .filter(c => /^ProductDescription\d+$/.test(c))
  .filter(c => !daFicha[c]?.includes('description'));
r.ok(
  'toda seção de descrição oferece a descrição do produto (cadastro) no painel',
  !descricoesSemFicha.length && daFicha.ProductDescription09?.join() === 'description,specs',
  descricoesSemFicha.join(', ') || JSON.stringify(daFicha.ProductDescription09)
);
// A categoria (nome, descrição, FAQ) é do cadastro: toda peça de título e de
// descrição de categoria a lê e o painel da seção a oferece (daCategoria). O texto
// dela só chega ao HTML escapado (paragrafosEmHtml/faqEmHtml), nunca cru.
const daCategoria = JSON.parse(ler(ARQUIVO_EDITAVEIS) || '{}').daCategoria ?? {};
const pecasDeCategoria = [...new Set(itens().filter(i => /^category-(title|description)$/.test(i.selection)).map(i => i.component))];
const semCategoria = pecasDeCategoria.filter(c => !daCategoria[c]);
r.ok('toda peça de título e descrição de categoria lê a categoria da loja (e o painel a oferece)', !semCategoria.length, semCategoria.join(', '));
const replicasDaCategoria = arquivosDasReplicas();
const injetaCategoria = Object.keys(daCategoria).filter(c => {
  const fonte = ler(replicasDaCategoria.get(c) ?? '');
  return /__html:\s*categoria\b|__html:\s*\w*\.?paragrafos|__html:\s*f\.(answer|question)/.test(fonte);
});
r.ok('o texto da categoria da loja nunca vai cru para o HTML', !injetaCategoria.length, injetaCategoria.join(', '));
const semExemplo = Object.keys(daCategoria).filter(
  c => !ler(replicasDaCategoria.get(c) ?? '').includes('.categoriaPadrao = categoriaDoExemplo(')
);
r.ok('toda peça com categoria expõe o exemplo (categoriaPadrao) para o painel partir dele', !semExemplo.length, semExemplo.join(', '));

// Com UM produto, o card da grade de categoria não pode ocupar a largura toda:
// \`repeat(auto-fit, …1fr)\` estica o item sozinho (a família 10 fazia isso);
// \`auto-fill\` mantém as colunas.
const gradesQueEsticam = fs
  .readdirSync(path.join(RAIZ, 'src/components/templates/category'))
  .map(t => path.join(RAIZ, 'src/components/templates/category', t, 'CategoryMain/index.module.css'))
  .filter(f => /repeat\(\s*auto-fit/.test(ler(f)))
  .map(f => path.relative(RAIZ, f));
r.ok('nenhuma grade de categoria estica um card único (auto-fill, não auto-fit)', !gradesQueEsticam.length, gradesQueEsticam.join(', '));

const caso = (comp, plat) => editaveis[comp]?.[plat] ?? [];
r.ok(
  'Nuvemshop: avaliações só com o título (o resto é do app de avaliação)',
  JSON.stringify(caso('ProductReviews09', 'Nuvemshop')) === '["title"]',
  caso('ProductReviews09', 'Nuvemshop')
);
r.ok(
  'Nuvemshop: PDP com o botão de comprar, sem o "Avise-me" (não existe lá)',
  caso('ProductInfo09', 'Nuvemshop').includes('buyLabel') &&
    !caso('ProductInfo09', 'Nuvemshop').includes('notifyLabel'),
  caso('ProductInfo09', 'Nuvemshop')
);
r.ok(
  'Tray: header sem painel do tema (família 01) só com o menu e as configurações da loja',
  caso('Header01', 'Tray').every(c => MENU.test(c)),
  caso('Header01', 'Tray')
);
r.ok(
  'categoria igual nas três: os rótulos da descrição 09 são editáveis em todas',
  ['Tray', 'Wake 2.0', 'Nuvemshop'].every(
    p => caso('CategoryDescription09', p).length === desenhadosNoDisco.CategoryDescription09.length
  )
);

// ── 2. regras do resolvedor e do sanitizador ───────────────────────────────
const TESTE = `
import { resolverConteudo, sanitizarConteudo, levarConteudo } from ${JSON.stringify(
  pathToFileURL(path.join(RAIZ, 'src/utils/conteudo.ts')).href
)};
const casos = [];
const ok = (nome, cond, det = '') => casos.push({ nome, ok: !!cond, det: String(det) });
const MOCK = { title: 'Mock', items: [{ a: 1 }, { a: 2 }], banner: { x: 'a', y: 'b' }, n: 3, flag: true };
const r0 = resolverConteudo(MOCK);
ok('sem nível, o resolvedor devolve uma cópia do mock', JSON.stringify(r0) === JSON.stringify(MOCK) && r0 !== MOCK);
const r1 = resolverConteudo(MOCK, { items: [{ a: 9 }] });
ok('lista do nível 1 substitui a do mock inteira', r1.items.length === 1 && r1.items[0].a === 9);
const r2 = resolverConteudo(MOCK, { banner: { x: 'z' } });
ok('objeto do nível 1 vem inteiro, sem mesclar com o mock', r2.banner.x === 'z' && r2.banner.y === undefined);
const r3 = resolverConteudo(MOCK, { title: '', items: [] });
ok('texto vazio e lista vazia valem (não voltam ao mock)', r3.title === '' && r3.items.length === 0);
const r4 = resolverConteudo(MOCK, { title: ['x'], items: 'x', banner: [1], n: '7', flag: 'sim' });
ok('valor com forma diferente da do mock é ignorado', r4.title === 'Mock' && r4.items.length === 2 && !Array.isArray(r4.banner) && r4.n === 3 && r4.flag === true, JSON.stringify(r4));
const r5 = resolverConteudo(MOCK, { imageDesktop: 'https://cdn.exemplo/x.webp' });
ok('campo opcional que o mock não traz entra', r5.imageDesktop === 'https://cdn.exemplo/x.webp');
ok('o nível mais forte (o último) vence', resolverConteudo(MOCK, { title: 'loja' }, { title: 'secao' }).title === 'secao');
ok('o nível 2 vale quando o 1 não tem o campo', resolverConteudo(MOCK, { title: 'loja' }, {}).title === 'loja');
const s1 = sanitizarConteudo({ url: 'javascript:alert(1)', vb: ' VBScript:x', img: 'data:image/png;base64,AAA', data: 'Data: 25/11 a 30/11', link: 'https://loja.exemplo' });
ok('sanitizar tira javascript:, vbscript: e data: de imagem', s1 && !('url' in s1) && !('vb' in s1) && !('img' in s1), JSON.stringify(s1));
ok('sanitizar mantém "Data: 25/11" (texto em português) e https', s1 && s1.data === 'Data: 25/11 a 30/11' && s1.link === 'https://loja.exemplo');
const s2 = sanitizarConteudo(JSON.parse('{"__proto__": {"poluido": 1}, "a": "b"}'));
ok('sanitizar ignora __proto__', s2 && s2.a === 'b' && !Object.prototype.hasOwnProperty.call(s2, '__proto__') && ({}).poluido === undefined);
ok('sanitizar recusa o que não é objeto', sanitizarConteudo('x') === undefined && sanitizarConteudo([1]) === undefined && sanitizarConteudo(null) === undefined);
ok('sanitizar devolve undefined quando nada sobra', sanitizarConteudo({ a: 'javascript:x' }) === undefined);
const s3 = sanitizarConteudo({ lista: ['ok', 'javascript:x', 3, null, { f: () => 1 }] });
ok('sanitizar limpa dentro de listas', s3 && JSON.stringify(s3.lista) === '["ok",3,{}]', JSON.stringify(s3));
const s4 = sanitizarConteudo({ n: Infinity, m: NaN, k: 2 });
ok('sanitizar tira número não finito', s4 && !('n' in s4) && !('m' in s4) && s4.k === 2);
ok('levarConteudo leva o nível 1 inteiro e nada quando não há', levarConteudo({ content: { a: 'b' } }).content.a === 'b' && Object.keys(levarConteudo({})).length === 0);
process.stdout.write(JSON.stringify(casos));
`;
try {
  const casos = JSON.parse(
    execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '--eval', TESTE], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  );
  for (const c of casos) r.ok(c.nome, c.ok, c.det);
} catch (erro) {
  r.ok('src/utils/conteudo.ts carrega no Node (só pode importar tipos)', false, String(erro.stderr || erro.message).split('\n')[0]);
}

// ── 2b. conteúdo da loja: a projeção para cada seção (os vínculos) ─────────
// Mocks no formato das réplicas 09–17 (as chaves que elas desenham): o que a
// loja preenche tem de chegar a cada peça no formato DELA.
const TESTE_LOJA = `
const url = n => ${JSON.stringify(pathToFileURL(path.join(RAIZ, 'src/utils')).href)} + '/' + n;
const { projetarLoja, linkDoWhatsapp, linkDoTelefone, ROTULO_DO_SLOT, SLOTS_VINCULADOS, VINCULOS_RESUMO } = await import(url('conteudoLoja.ts'));
const { sanitizarConteudoLoja, resolverConteudo } = await import(url('conteudo.ts'));
const { partirDaPagina } = await import(url('lojaDaPagina.ts'));
const { produtosDaLoja, normalizarProduto, MAX_PRODUTOS } = await import(url('produtos.ts'));
const { categoriaDaLoja } = await import(url('categoriaDaLoja.ts'));
const casos = [];
const ok = (nome, cond, det = '') => casos.push({ nome, ok: !!cond, det: String(det) });
const ano = new Date().getFullYear();

const HEADER = { brandName: 'X', topbarMessages: [{ text: 'a' }], menu: [{ label: 'M', url: '#', highlight: true, children: [{ label: 'c', url: '#' }] }] };
ok('loja vazia não dá nada a seção nenhuma', !projetarLoja('Header09', null, HEADER).conteudo && !projetarLoja('Header09', { versao: 1 }, HEADER).conteudo);
const menu = projetarLoja('Header09', { versao: 1, menuPrincipal: [{ label: 'Roupas', url: '/roupas', children: [{ label: 'Camisetas', url: '/c' }] }, { label: '  ' }] }, HEADER);
ok('menu principal vira o menu do header, sem itens em branco', menu.conteudo?.menu?.length === 1 && menu.conteudo.menu[0].label === 'Roupas', JSON.stringify(menu.conteudo));
ok('chave que o mock tem e a loja não sai com vazio do tipo (highlight: false)', menu.conteudo?.menu?.[0].highlight === false);
ok('subitens vão no formato do mock', menu.conteudo?.menu?.[0].children?.[0].label === 'Camisetas');
ok('a origem do campo é o slot (para o painel)', menu.origem.menu === 'menuPrincipal');
ok('nome da loja chega ao header mesmo sem brandName no mock (as réplicas o deixam fora)', projetarLoja('Header12', { versao: 1, nomeDaLoja: 'Loja X' }, { menu: [] }).conteudo?.brandName === 'Loja X');
ok('campo que a peça não desenha (fora do mock) não recebe nada',!projetarLoja('Header09', { versao: 1, menuPrincipal: [{ label: 'R' }] }, { brandName: 'X' }).conteudo);
ok('vínculo vale só para o tipo de peça (menu num não-header fica)', !projetarLoja('Showcase09', { versao: 1, menuPrincipal: [{ label: 'R' }] }, HEADER).conteudo);
const h03 = projetarLoja('Header03', { versao: 1, nomeDaLoja: 'Loja X', avisos: [{ text: 'A1' }, { text: 'A2' }], menuPrincipal: [{ label: 'M', url: '/m', children: [{ label: 'S', url: '/s' }] }] }, { topbar: { messages: [{ text: 'x' }] }, menu: { links: [{ label: 'x', link: '#', itensLevel1: [{ label: 'y', link: '#' }] }] } }).conteudo;
const h01 = projetarLoja('Header01', { versao: 1, menuPrincipal: [{ label: 'R', url: '/r' }] }, { menu: { links: [{ label: 'x', url: '#' }] } }).conteudo;
ok('header com menu em objeto (01, 03) recebe o menu no formato { links } do mock', h01?.menu?.links?.[0]?.label === 'R' && !Array.isArray(h01?.menu), JSON.stringify(h01?.menu));
ok('a barra do topo não vem da loja (é conteúdo de cada header)', !('topbar' in (h03 ?? {})) && !h01?.topbar, JSON.stringify(h03?.topbar));
ok('Header03: menu com link e submenu, nome em logo.text', h03?.menu?.links?.[0]?.link === '/m' && h03?.menu?.links?.[0]?.itensLevel1?.[0]?.label === 'S' && h03?.logo?.text === 'Loja X', JSON.stringify(h03));


ok('WhatsApp vira wa.me com 55', linkDoWhatsapp('(11) 98888-7777') === 'https://wa.me/5511988887777' && linkDoWhatsapp('https://wa.me/1') === 'https://wa.me/1' && linkDoWhatsapp('abc') === '');
ok('telefone vira tel:+55', linkDoTelefone('(11) 3333-4444') === 'tel:+551133334444');
const contato = { telefone: '(11) 3333-4444', whatsapp: '(11) 98888-7777', email: 'oi@loja.com', endereco: 'Rua A, 1', horario: 'Seg a sex' };
const F12 = { contactLines: [{ text: 'x', url: '#' }], whatsappLabel: 'x', whatsappUrl: '#' };
const f12 = projetarLoja('Footer12', { versao: 1, contato }, F12).conteudo;
ok('rodapé com campo de WhatsApp próprio não repete o WhatsApp nas linhas', f12 && !f12.contactLines.some(l => /WhatsApp/.test(l.text)) && f12.whatsappUrl === 'https://wa.me/5511988887777', JSON.stringify(f12));
ok('linhas de contato com telefone (tel:), e-mail (mailto:) e endereço', f12?.contactLines.some(l => l.url === 'tel:+551133334444') && f12.contactLines.some(l => l.url === 'mailto:oi@loja.com') && f12.contactLines.some(l => l.text === 'Rua A, 1'));
const f09 = projetarLoja('Footer09', { versao: 1, nomeDaLoja: 'Loja X', contato, dadosLegais: { razaoSocial: 'Loja X Ltda', cnpj: '12.345.678/0001-90' } }, { contactLines: [{ text: 'x' }], contactHours: 'x', legal: 'x', brandName: 'y' }).conteudo;
ok('linha legal: © ano · marca · razão · CNPJ · endereço', f09?.legal === '© ' + ano + ' Loja X · Loja X Ltda · CNPJ 12.345.678/0001-90 · Rua A, 1', f09?.legal);
ok('horário vai para o campo próprio, não para as linhas', f09?.contactHours === 'Seg a sex' && !f09.contactLines.some(l => l.text === 'Seg a sex'));
ok('sem razão social nem CNPJ, a linha legal fica a do mock', !('legal' in (projetarLoja('Footer09', { versao: 1, nomeDaLoja: 'Loja X' }, { legal: 'x' }).conteudo ?? {})));
const f11 = projetarLoja('Footer11', { versao: 1, nomeDaLoja: 'Loja X', dadosLegais: { razaoSocial: 'R Ltda', cnpj: '1' } }, { copyright: 'x', legalText: 'y' }).conteudo;
ok('com legalText ao lado, copyright é só "© ano Marca"', f11?.copyright === '© ' + ano + ' Loja X' && f11.legalText === 'R Ltda · CNPJ 1', JSON.stringify(f11));
const f10 = projetarLoja('Footer10', { versao: 1, dadosLegais: { cnpj: '1' } }, { legalLines: [{ text: 'a' }, { text: 'aviso de preços' }] }).conteudo;
ok('legalLines: a 1ª linha é a legal, o resto continua o do mock', f10?.legalLines?.length === 2 && f10.legalLines[1].text === 'aviso de preços');
const redes = projetarLoja('Footer09', { versao: 1, redes: [{ network: 'instagram', url: 'https://ig/x' }, { network: 'facebook' }], pagamentos: [{ method: 'pix' }, {}] }, { socials: [{ network: 'x', url: '#' }], payments: [{ method: 'visa' }] }).conteudo;
ok('redes e pagamentos sem rótulo ficam de fora', redes?.socials?.length === 1 && redes.payments?.length === 1 && redes.payments[0].method === 'pix', JSON.stringify(redes));

const B09 = { slides: [{ title: 'T', primaryLabel: 'P', primaryUrl: '#', imageDesktop: '/a', imageMobile: '/b', imageAlt: '' }] };
const b = projetarLoja('BannerMain09', { versao: 1, banners: [{ title: 'Verão', ctaLabel: 'Comprar', ctaUrl: '/verao', imageDesktop: 'https://cdn/x.webp' }] }, B09).conteudo;
ok('banner: ctaLabel/ctaUrl da loja viram primaryLabel/primaryUrl da 09', b?.slides?.[0].primaryLabel === 'Comprar' && b.slides[0].primaryUrl === '/verao', JSON.stringify(b));
ok('banner sem imagem de celular usa a do computador', b?.slides?.[0].imageMobile === 'https://cdn/x.webp');
ok('banner sem texto alternativo fica com alt vazio (decorativo), não com o do mock', b?.slides?.[0].imageAlt === '');
const cat = projetarLoja('Categories09', { versao: 1, categorias: [{ name: 'Tênis', url: '/tenis' }] }, { categories: [{ name: 'a', url: '#', image: '/i', imageAlt: '' }] }).conteudo;
ok('categoria sem texto alternativo usa o nome', cat?.categories?.[0].imageAlt === 'Tênis' && cat.categories[0].image === '');

const HF = { helpItems: [{ icon: 'whatsapp', label: 'WhatsApp', detail: '[00]', url: 'https://wa.me/' }, { icon: 'truck', label: 'Rastrear', url: '/r' }], footerText: 'x' };
const hf = projetarLoja('HelpFloat09', { versao: 1, contato }, HF).conteudo;
ok('ajuda flutuante: o canal de WhatsApp abre o número da loja, os outros ficam', hf?.helpItems?.[0].url === 'https://wa.me/5511988887777' && hf.helpItems[0].detail === '(11) 98888-7777' && hf.helpItems[1].url === '/r', JSON.stringify(hf));
ok('ajuda flutuante: rodapé com horário e telefone', hf?.footerText === 'Seg a sex · (11) 3333-4444');

ok('a seção vence a loja (nível 1 por cima)', resolverConteudo(HEADER, menu.conteudo, { menu: [] }).menu.length === 0);
const sl = sanitizarConteudoLoja({ versao: 9, nomeDaLoja: 'A', menuPrincipal: [{ label: 'x', url: 'javascript:alert(1)' }] });
ok('sanitizar a loja tira javascript: e fixa versao 1', sl?.versao === 1 && sl.menuPrincipal[0].url === undefined, JSON.stringify(sl));
ok('loja sem nada vira null', sanitizarConteudoLoja({ versao: 1 }) === null && sanitizarConteudoLoja('x') === null);
ok('todo slot vinculado tem nome na tela', SLOTS_VINCULADOS.every(s => ROTULO_DO_SLOT[s]), SLOTS_VINCULADOS.filter(s => !ROTULO_DO_SLOT[s]).join(', '));

const schemaBanners = { type: 'array', items: { type: 'object', properties: { title: {}, ctaLabel: {}, ctaUrl: {}, imageDesktop: {} } } };
const ini = partirDaPagina('banners', schemaBanners, [{ componente: 'Header09', titulo: 'Header 09', conteudo: HEADER }, { componente: 'BannerMain09', titulo: 'Banner 09', conteudo: { slides: [{ title: 'T', primaryLabel: 'P', primaryUrl: '/p', icon: 'x', imageDesktop: '/a' }] } }]);
ok('começar com o da página: acha a seção certa e converte para a loja', ini?.titulo === 'Banner 09' && ini.valor[0].ctaLabel === 'P' && ini.valor[0].ctaUrl === '/p' && !('icon' in ini.valor[0]), JSON.stringify(ini));
ok('começar com o da página: slot sem seção que o mostre dá null', partirDaPagina('categorias', schemaBanners, []) === null && partirDaPagina('contato', schemaBanners, []) === null);
// Os nomes das famílias 01–08 (origem Tray) também recebem a loja.
const L08 = { versao: 1, nomeDaLoja: 'Loja X', menuPrincipal: [{ label: 'Roupas', url: '/r', children: [{ label: 'Saias', url: '/s' }] }], avisos: [{ text: 'Frete' }], contato: { whatsapp: '(11) 98888-7777', telefone: '(11) 3333-4444', email: 'oi@x.com' }, redes: [{ network: 'facebook', url: 'https://fb/x' }], pagamentos: [{ method: 'pix' }, { method: 'visa' }], linksLegais: [{ label: 'Privacidade', url: '/p' }], dadosLegais: { razaoSocial: 'R Ltda', cnpj: '1' } };
const MEGA = { navItems: [{ label: 'a', url: '#', hasMega: true, highlight: false, megaColumns: [{ title: 'c', links: [{ label: 'l', url: '#' }] }] }], topbarMessages: [{ text: 'x', icon: 'truck' }] };
const h06 = projetarLoja('Header06', { ...L08, menuPrincipal: [...L08.menuPrincipal, { label: 'Sem sub', url: '/x' }] }, MEGA).conteudo;
ok('01–08: navItems recebem o menu; com subitens o megamenu abre (colunas = 2º nível)', h06?.navItems?.[0].label === 'Roupas' && h06.navItems[0].hasMega === true && h06.navItems[0].megaColumns?.[0].title === 'Saias' && h06.navItems[1].hasMega === false, JSON.stringify(h06?.navItems));
const tresNiveis = { ...L08, menuPrincipal: [{ label: 'Roupas', url: '/r', children: [{ label: 'Saias', url: '/s', children: [{ label: 'Midi', url: '/m' }] }] }] };
const mega3 = projetarLoja('Header07', tresNiveis, MEGA).conteudo?.navItems?.[0].megaColumns?.[0];
ok('o 3º nível do menu vira os links da coluna do megamenu (06, 07)', mega3?.links?.[0]?.label === 'Midi', JSON.stringify(mega3));
const h01n3 = projetarLoja('Header01', tresNiveis, { menu: { links: [{ label: 'x', link: '#', itensLevel1: [{ label: 'y', link: '#', itensLevel2: [{ label: 'z', link: '#' }] }] }] } }).conteudo;
ok('o 3º nível do menu chega ao Header01 (itensLevel2)', h01n3?.menu?.links?.[0]?.itensLevel1?.[0]?.itensLevel2?.[0]?.label === 'Midi', JSON.stringify(h01n3?.menu));
ok('01–08: mobileNavItems com os subitens em sublinks', projetarLoja('Header04', L08, { mobileNavItems: [{ label: 'a', url: '#', sublinks: [{ label: 'b', url: '#' }] }] }).conteudo?.mobileNavItems?.[0].sublinks?.[0].label === 'Saias');
const f01 = projetarLoja('Footer01', L08, { whatsapp: 'x', phone: 'x', email: 'x', socialFacebook: 'x', socialTwitter: 'x', institucionalMenu: [{ name: 'a', url: '#' }], paymentMethods: [{ src: '/v.png', alt: 'Visa' }], copyright: 'x' }).conteudo;
ok('01–08: contato e redes como textos soltos; rede que a loja não tem fica vazia', f01?.whatsapp === '(11) 98888-7777' && f01.phone === '(11) 3333-4444' && f01.email === 'oi@x.com' && f01.socialFacebook === 'https://fb/x' && f01.socialTwitter === '', JSON.stringify(f01));
ok('01–08: institucionalMenu recebe os links legais (label → name)', f01?.institucionalMenu?.[0].name === 'Privacidade');
ok('01–08: bandeiras com imagem na peça ficam as do mock', !('paymentMethods' in (f01 ?? {})) && !('payments' in (projetarLoja('Footer02', L08, { payments: [{ name: 'a', image: '/a.png' }] }).conteudo ?? {})));
ok('01–08: bandeiras como nomes (Footer05) e rótulos (Footer03)', JSON.stringify(projetarLoja('Footer05', L08, { paymentMethods: ['A'] }).conteudo?.paymentMethods) === '["Pix","Visa"]' && projetarLoja('Footer03', L08, { paymentMethods: [{ label: 'a', isHighlight: false }] }).conteudo?.paymentMethods?.[1].label === 'Visa');
const f03 = projetarLoja('Footer03', L08, { copyright: 'x', cnpj: 'x' }).conteudo;
ok('01–08: com campo de CNPJ próprio, a linha legal não repete o CNPJ', f03?.cnpj === '1' && !f03.copyright.includes('CNPJ'), JSON.stringify(f03));
ok('01–08: socials com rótulo (Footer04–06) ganham o nome da rede', projetarLoja('Footer04', L08, { socials: [{ label: 'a', url: '#' }] }).conteudo?.socials?.[0].label === 'Facebook');
ok('01–08: contactItems (Footer05) com rótulo e detalhe', projetarLoja('Footer05', L08, { contactItems: [{ label: 'a', detail: 'b' }] }).conteudo?.contactItems?.[0].detail === '(11) 98888-7777');
ok('01–08: ajuda flutuante 06 (href) abre o WhatsApp da loja', projetarLoja('HelpFloat06', L08, { helpItems: [{ label: 'WhatsApp', icon: '', href: '#' }] }).conteudo?.helpItems?.[0].href === 'https://wa.me/5511988887777');
// A categoria da página de categoria (src/utils/categoriaDaLoja.ts).
const plp = categoriaDaLoja({ versao: 1, categoria: { name: ' Vestidos ', description: 'Um.\\n\\n  \\nDois\\nlinha', faq: [{ question: 'P?', answer: 'R.' }, { question: 'sem resposta' }] } });
ok('categoria: nome aparado, parágrafos por linha em branco, FAQ só com pergunta e resposta', plp?.name === 'Vestidos' && plp.paragrafos.length === 2 && plp.paragrafos[1] === 'Dois\\nlinha' && plp.faq.length === 1, JSON.stringify(plp));
ok('categoria: sem nada preenchido dá null (as peças ficam com a de exemplo)', categoriaDaLoja({ versao: 1, categoria: { name: '  ', faq: [{}] } }) === null && categoriaDaLoja(null) === null);
// Produtos da loja (src/utils/produtos.ts): o que o CS cadastra pela metade sai completo.
ok('produtos: loja sem produto (ou só linhas em branco) dá null — as peças ficam com os de exemplo', produtosDaLoja(null) === null && produtosDaLoja({ versao: 1, produtos: [] }) === null && produtosDaLoja({ versao: 1, produtos: [{ price: 10 }, { name: '  ' }] }) === null);
const pr = normalizarProduto({ name: 'Tênis', price: 300, listPrice: 400, installments: 3, images: [{ productImage: '/a.webp' }, {}, { productImage: '/b.webp' }] }, 0);
ok('produtos: preço "de" maior fica; parcela sai do preço; fotos vazias saem', pr.listPrice === 400 && pr.installmentValue === 100 && pr.images.join() === '/a.webp,/b.webp' && pr.inStock && pr.id === 'loja-1', JSON.stringify(pr));
const pr2 = normalizarProduto({ name: 'X', price: 300, listPrice: 200, installments: 1, soldOut: true }, 4);
ok('produtos: "de" menor que o preço vira o preço; 1x é sem parcelamento; esgotado', pr2.listPrice === 300 && pr2.installments === 0 && !pr2.inStock && pr2.id === 'loja-5');
ok('produtos: sem nome ganha "Produto N"; número inválido vira 0', normalizarProduto({ price: -5, images: [{ productImage: '/x' }] }, 2).name === 'Produto 3' && normalizarProduto({ price: 'abc' }, 0).price === 0);
const vr = normalizarProduto({ name: 'V', variants: [
  { name: 'Tamanho', options: [{ label: 'P' }, { label: 'M', soldOut: true }] },
  { name: 'Cor', options: [{ label: 'Preto', color: '#000' }] },
  { name: 'Estampa', options: [{ label: 'Floral', swatchImage: '/f.webp' }] },
  { name: 'Vazia', options: [{}] },
  { name: 'Forçada', tipo: 'texto', options: [{ label: 'A', color: '#fff' }] },
] }, 0).variants;
ok('produtos: sem tipo, a opção decide (texto, cor, imagem); variação sem opção some; tipo escolhido vence', vr.length === 4 && vr.map(v => v.tipo).join() === 'texto,cor,imagem,texto', JSON.stringify(vr.map(v => v.tipo)));
ok('produtos: opção esgotada marcada', vr[0].options[1].available === false && vr[0].options[0].available === true);
ok('produtos: especificação sem nome ou valor sai', normalizarProduto({ name: 'S', specs: [{ name: 'A', value: '1' }, { name: 'B' }, { value: '2' }] }, 0).specs.length === 1);
ok('produtos: teto de ' + MAX_PRODUTOS + ' por loja', produtosDaLoja({ versao: 1, produtos: Array.from({ length: MAX_PRODUTOS + 20 }, (_, i) => ({ name: 'P' + i })) }).length === MAX_PRODUTOS);
process.stdout.write(JSON.stringify({ casos, vinculos: VINCULOS_RESUMO, rotulos: Object.keys(ROTULO_DO_SLOT) }));
`;
try {
  const saida = JSON.parse(
    execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '--eval', TESTE_LOJA], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
  );
  for (const c of saida.casos) r.ok(`loja: ${c.nome}`, c.ok, c.det);
  // Todo vínculo aponta para um campo que existe no schema de alguma peça do
  // tipo dele: um nome digitado errado no vínculo nunca casaria com nada.
  for (const v of saida.vinculos) {
    const de = new RegExp(v.de);
    const existe = Object.entries(schemas.componentes).some(
      ([nome, info]) => de.test(nome) && info.schema?.properties?.[v.campo]
    );
    r.ok(`loja: o vínculo ${v.campo} ← ${v.slot} casa com um campo de schema (${v.de})`, existe);
  }
  // O formulário da loja tem um campo para cada slot.
  const fonteDoSchema = ler('src/data/conteudo/schemaDaLoja.ts');
  const semCampo = saida.rotulos.filter(s => !new RegExp(`^  ${s}:`, 'm').test(fonteDoSchema));
  r.ok('loja: todo slot tem campo no formulário (schemaDaLoja.ts)', semCampo.length === 0, semCampo.join(', '));
} catch (erro) {
  r.ok(
    'src/utils/conteudoLoja.ts e lojaDaPagina.ts carregam no Node (só podem importar tipos)',
    false,
    String(erro.stderr || erro.message).split('\n').find(l => /Error/.test(l)) || String(erro.message).split('\n')[0]
  );
}

// ── 3. quem lê pelo hook tem schema, e os campos do tipo existem nele ──────
// O parser e o mapa componente → arquivo são os do `derivar-conteudo.mjs`: a
// mesma leitura que gera o campos.generated.json do painel.
const migrados = new Set();
for (const [nome, arquivo] of arquivosDasReplicas()) {
  const fonte = ler(arquivo);
  if (!fonte.includes('useConteudoDaSecao(')) continue;
  migrados.add(nome);
  r.ok(
    `${nome}: expõe o mock para o painel (\`${nome}.conteudoPadrao = MOCK\`)`,
    /\.conteudoPadrao\s*=\s*MOCK;/.test(fonte),
    'sem ele o painel Conteúdo não sabe o valor de partida dos campos'
  );
  const schema = schemas.componentes[nome]?.schema;
  if (!r.ok(`${nome}: lê pelo hook e tem schema`, schema, 'componente sem section.schema no starter')) continue;
  const campos = camposDoTipo(fonte);
  if (!r.ok(`${nome}: declara a interface …Conteudo`, campos, 'o tipo do MOCK é o contrato com o schema')) continue;
  const doSchema = Object.keys(schema.properties);
  const estranhos = campos.filter(c => !doSchema.includes(c));
  r.ok(`${nome}: todo campo do tipo existe no schema`, estranhos.length === 0, estranhos.join(', '));
  const faltam = doSchema.filter(c => !campos.includes(c));
  if (faltam.length) console.log(`  ℹ️  ${nome}: campos do schema que a réplica ainda não desenha: ${faltam.join(', ')}`);
}

// ── 4. família migrada = família inteira ───────────────────────────────────
const catalogo = itens();
for (const familia of FAMILIAS_MIGRADAS) {
  const faltam = catalogo
    .filter(i => i.template === familia && schemas.componentes[i.component] && !migrados.has(i.component))
    .map(i => i.component);
  r.ok(`família ${familia}: todo componente com schema lê pelo hook`, faltam.length === 0, faltam.join(', '));
}

const comSchema = catalogo.filter(i => schemas.componentes[i.component]);
const porFamilia = new Map();
for (const i of comSchema) {
  const f = porFamilia.get(i.template) ?? { total: 0, feitos: 0 };
  f.total++;
  if (migrados.has(i.component)) f.feitos++;
  porFamilia.set(i.template, f);
}
const comecadas = [...porFamilia]
  .filter(([, f]) => f.feitos)
  .map(([t, f]) => `${t.padStart(2, '0')}: ${f.feitos}/${f.total}`)
  .join(' · ');
console.log(
  `  (${migrados.size}/${comSchema.length} componentes com schema leem pelo hook${comecadas ? ` — ${comecadas}` : ''}; ` +
    `${schemas.semSchema.length} sem schema)`
);
process.exit(r.fechar() ? 0 : 1);
