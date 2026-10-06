/**
 * O que se sabe de um modelo a partir do `checkout.json`, sem olhar o CSS:
 * a cadeia de 3 níveis de cada papel, a lista de aliases `--ck01-*`, a etapa de
 * cada hash e a validação do próprio `checkout.json`.
 *
 * O compose e o lint leem o modelo por aqui para que "o que o modelo declara"
 * tenha uma definição só.
 *
 * PURO: sem fs.
 */
import { VAR_MAP, FONT_KEYS, level2KeyFor } from './level2.mjs';
import { corVisivel, formatarRazao, limiteVisivel, mix, normalizeHex, parseFontValue, piorContraste, textoLegivel } from './derive.mjs';

/** A cadeia de 3 níveis que o `00-tokens.css` precisa declarar para o papel. */
export function cadeia(papel) {
  return papel.level2
    ? `var(${papel.cssVar}, var(${papel.level2}, ${papel.level3}))`
    : `var(${papel.cssVar}, ${papel.level3})`;
}

export function mapaPapeis(model) {
  return new Map(model.papeis.map(p => [p.cssVar, p]));
}

/** `[{nome, esperado}]`: todo alias `--ck01-*` que o `00-tokens.css` declara, na ordem do modelo. */
export function aliasesDoModelo(model) {
  return [
    ...model.papeis.map(p => ({ nome: p.alias, esperado: cadeia(p), papel: p })),
    ...model.neutros.map(n => ({ nome: n.cssVar, esperado: n.valor, neutro: n })),
  ];
}

/** `#/cart` → `carrinho`. Hash vazio é o carrinho (o router nativo vai para lá); desconhecido é `null`. */
export function etapaDoHash(model, hash) {
  const h = (hash ?? '').split('?')[0];
  if (h === '' || h === '#' || h === '#/') return model.etapas[0].id;
  const etapa = model.etapas.find(e => e.hash === h);
  return etapa ? etapa.id : null;
}

export function passoDaEtapa(model, etapaId) {
  return model.etapas.find(e => e.id === etapaId)?.passo ?? null;
}

const RGBA = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(,\s*(0|1|0?\.\d+)\s*)?\)$/;

/**
 * Confere o `checkout.json`. Devolve a lista de problemas (vazia = ok); o build
 * reprova com qualquer um. Cada item: `{ regra: 'modelo', mensagem }`.
 */
export function validarModelo(model) {
  const erros = [];
  const erro = mensagem => erros.push({ regra: 'modelo', mensagem });

  if (!model || typeof model !== 'object') return [{ regra: 'modelo', mensagem: 'checkout.json vazio' }];
  const m = /^Checkout(\d{2})$/.exec(model.id ?? '');
  if (!m) erro(`id "${model.id}" não é Checkout<NN>`);
  else if (model.prefixo !== `ck${m[1]}`) erro(`prefixo "${model.prefixo}" deveria ser "ck${m[1]}" (o sufixo é a ilha)`);
  if (!Number.isInteger(model.contrato) || model.contrato < 1) erro('contrato precisa ser um inteiro ≥ 1');
  for (const k of ['css', 'js', 'header', 'footer']) {
    if (typeof model.arquivos?.[k] !== 'string') erro(`arquivos.${k} ausente`);
  }

  // Stepper e etapas
  const passos = new Set((model.stepper ?? []).map(p => p.id));
  const ids = new Set();
  const hashes = new Set();
  for (const e of model.etapas ?? []) {
    if (ids.has(e.id)) erro(`etapa repetida: ${e.id}`);
    ids.add(e.id);
    if (!/^#\/[a-z]+$/.test(e.hash ?? '')) erro(`etapa ${e.id}: hash "${e.hash}" fora do formato #/<rota>`);
    if (hashes.has(e.hash)) erro(`hash repetido: ${e.hash}`);
    hashes.add(e.hash);
    if (!passos.has(e.passo)) erro(`etapa ${e.id}: passo "${e.passo}" não existe no stepper`);
    for (const vp of model.figma?.viewports ?? []) {
      if (!model.figma.frames?.[`${e.figma}-${vp}`]) erro(`etapa ${e.id}: frame ${e.figma}-${vp} não está em figma.frames`);
    }
  }
  if (!ids.size) erro('nenhuma etapa');

  // Breakpoints: o fim de cada faixa em px. O lint só aceita @media nesses números
  // (max-width: N) e no começo da faixa seguinte (min-width: N + 1).
  const bps = model.breakpoints && typeof model.breakpoints === 'object' ? Object.entries(model.breakpoints) : [];
  if (!bps.length) erro('breakpoints ausente (ex.: { "mobile": 767, "tablet": 1023 })');
  for (const [nome, px] of bps) {
    if (!Number.isInteger(px) || px < 1) erro(`breakpoints.${nome} = ${JSON.stringify(px)} não é um inteiro de px`);
  }
  const valoresBp = bps.map(([, px]) => px);
  if (valoresBp.some((px, i) => i > 0 && !(px > valoresBp[i - 1]))) erro('breakpoints precisam ser crescentes, sem repetir');

  // Papéis
  const prefixoAlias = `--${model.prefixo}-`;
  const porVar = new Map();
  const valoresNivel2 = new Set(Object.values(VAR_MAP));
  const fontesNivel2 = new Set(FONT_KEYS.map(k => VAR_MAP[k]));
  for (const p of model.papeis ?? []) {
    const onde = `papel ${p.cssVar}`;
    if (!/^--checkout-[a-z0-9]+(-[a-z0-9]+)*$/.test(p.cssVar ?? '')) erro(`${onde}: nome fora de --checkout-<papel>`);
    if (porVar.has(p.cssVar)) erro(`${onde}: repetido`);
    porVar.set(p.cssVar, p);
    const esperado = `${prefixoAlias}${(p.cssVar ?? '').slice('--checkout-'.length)}`;
    if (p.alias !== esperado) erro(`${onde}: alias "${p.alias}" deveria ser "${esperado}"`);
    if (p.type !== 'color' && p.type !== 'font') erro(`${onde}: type "${p.type}" (só color ou font)`);
    if (p.default !== p.level3) erro(`${onde}: default "${p.default}" ≠ level3 "${p.level3}" (default é o nível 3)`);
    if (p.type === 'color' && normalizeHex(p.level3) !== p.level3) erro(`${onde}: level3 "${p.level3}" não é hex minúsculo de 6 dígitos`);
    if (p.type === 'font' && !parseFontValue(p.level3)) erro(`${onde}: level3 "${p.level3}" não é uma pilha de fonte válida`);
    if (p.level2 != null) {
      if (!valoresNivel2.has(p.level2)) erro(`${onde}: level2 "${p.level2}" não está no VAR_MAP`);
      else if ((p.type === 'font') !== fontesNivel2.has(p.level2)) erro(`${onde}: level2 "${p.level2}" é de outro tipo (${level2KeyFor(p.level2)})`);
    }
    if (typeof p.painel !== 'boolean') erro(`${onde}: painel precisa ser true/false`);
    if (p.painel && (!p.label || !p.group)) erro(`${onde}: papel do painel precisa de label e group`);
    if (!p.painel && !p.derivado) erro(`${onde}: fora do painel sem ser derivado — ninguém define esse valor`);
  }
  const neutrosHex = new Map((model.neutros ?? []).filter(n => normalizeHex(n.valor) === n.valor).map(n => [n.cssVar, n]));
  for (const p of model.papeis ?? []) {
    if (!p.derivado) continue;
    const onde = `papel ${p.cssVar}`;
    const { regra, de, com, peso } = p.derivado;
    if (p.type !== 'color') erro(`${onde}: só cor pode ser derivada`);
    if (p.level2 != null) erro(`${onde}: derivado não tem nível 2`);
    if (regra === 'visivel') {
      // gate0 #28: `de` (papel fixo ou neutro hex) sobre o fundo `sobre`; abaixo do
      // limite, a `senao` (pura ou, com `misturar`, a menor mistura com o fundo).
      const { sobre, min, senao, misturar } = p.derivado;
      const cor = porVar.get(de) ?? neutrosHex.get(de);
      const fundo = porVar.get(sobre);
      const alt = porVar.get(senao);
      if (!cor) { erro(`${onde}: visível a partir de "${de}", que não é papel nem neutro hex do modelo`); continue; }
      if (cor.cssVar?.startsWith('--checkout-') && (cor.type !== 'color' || cor.derivado)) erro(`${onde}: visível a partir de ${de}, que precisa ser cor fixa (não derivada) ou neutro`);
      if (!fundo) { erro(`${onde}: visível sobre "${sobre}", que não é papel`); continue; }
      if (fundo.type !== 'color' || fundo.derivado) erro(`${onde}: visível sobre ${sobre}, que precisa ser cor fixa (não derivada)`);
      if (!alt) { erro(`${onde}: alternativa "${senao}", que não é papel`); continue; }
      if (alt.type !== 'color' || alt.derivado?.regra === 'visivel') erro(`${onde}: alternativa ${senao} precisa ser cor (pode ser derivada, mas não de outra regra "visivel")`);
      if (typeof min !== 'number' || !(min >= 1 && min <= 21)) { erro(`${onde}: min ${min} fora de 1–21 (razão de contraste WCAG)`); continue; }
      if (misturar != null && typeof misturar !== 'boolean') erro(`${onde}: misturar precisa ser true/false`);
      const c3 = cor.level3 ?? cor.valor;
      if ([c3, fundo.level3, alt.level3].some(v => normalizeHex(v) == null)) continue;
      // No nível 3 a regra tem que reproduzir o Figma — é o que o limite garante:
      // o par do Figma passa por construção (ver `limiteVisivel`).
      const calculado = corVisivel(c3, fundo.level3, limiteVisivel(min, c3, fundo.level3), alt.level3, { misturar: !!misturar }).valor;
      if (calculado !== p.level3) erro(`${onde}: visível(${c3} sobre ${fundo.level3}) = ${calculado}, mas o level3 é ${p.level3}`);
      continue;
    }
    const base = porVar.get(de);
    if (!base) { erro(`${onde}: derivado de "${de}", que não é papel`); continue; }
    if (base.derivado) erro(`${onde}: derivado de outro derivado (${de})`);
    if (regra === 'mistura') {
      const outro = porVar.get(com);
      if (!outro) { erro(`${onde}: mistura com "${com}", que não é papel`); continue; }
      if (outro.derivado) erro(`${onde}: mistura com outro derivado (${com})`);
      if (typeof peso !== 'number' || peso < 0 || peso > 100) { erro(`${onde}: peso ${peso} fora de 0–100`); continue; }
      // No nível 3 a regra tem que reproduzir o Figma: senão o papel muda de cor
      // no instante em que a loja define só o texto, mesmo com o texto igual ao do Figma.
      const calculado = mix(base.level3, outro.level3, peso);
      if (calculado !== p.level3) erro(`${onde}: mix(${base.level3}, ${outro.level3}, ${peso}) = ${calculado}, mas o level3 é ${p.level3}`);
    } else if (regra === 'legivel') {
      // gate0 #23: o texto `de` sobre o fundo `sobre`, com a régua `min` da WCAG.
      const { sobre, min } = p.derivado;
      const fundo = porVar.get(sobre);
      if (base.type !== 'color') erro(`${onde}: legível a partir de "${de}", que não é cor`);
      if (!fundo) { erro(`${onde}: legível sobre "${sobre}", que não é papel`); continue; }
      if (fundo.type !== 'color' || fundo.derivado) erro(`${onde}: legível sobre ${sobre}, que precisa ser cor fixa (não derivada)`);
      if (typeof min !== 'number' || !(min >= 1 && min <= 21)) { erro(`${onde}: min ${min} fora de 1–21 (razão de contraste WCAG)`); continue; }
      if (normalizeHex(base.level3) == null || normalizeHex(fundo.level3) == null) continue;
      // No nível 3 a regra tem que reproduzir o Figma (a mesma exigência da mistura).
      const calculado = textoLegivel(base.level3, fundo.level3, min).valor;
      if (calculado !== p.level3) erro(`${onde}: legível(${base.level3} sobre ${fundo.level3}, ${min}) = ${calculado}, mas o level3 é ${p.level3}`);
    } else if (regra !== 'contraste') {
      erro(`${onde}: regra "${regra}" desconhecida (contraste | mistura | legivel | visivel)`);
    }
  }

  // Guarda de visibilidade (gate0 #14a): `visibilidade: { contra: [fundos], min }`.
  // Ela só age no nível 2 (a cor que a loja não escolheu para o checkout), mede a
  // razão de contraste WCAG contra fundos FIXOS (sem guarda própria, senão a ordem
  // de resolução mudaria o resultado) e cai no nível 3 — que, por isso, tem que
  // passar na própria régua.
  for (const p of model.papeis ?? []) {
    if (p.visibilidade == null) continue;
    const onde = `papel ${p.cssVar}`;
    const { contra, min } = p.visibilidade;
    if (p.type !== 'color' || p.derivado) erro(`${onde}: visibilidade só vale para cor que não é derivada`);
    if (p.level2 == null) erro(`${onde}: visibilidade sem nível 2 — a guarda só age na cor herdada da loja`);
    const minOk = typeof min === 'number' && min >= 1 && min <= 21;
    if (!minOk) erro(`${onde}: visibilidade.min ${min} fora de 1–21 (razão de contraste WCAG)`);
    if (!Array.isArray(contra) || contra.length === 0) {
      erro(`${onde}: visibilidade.contra precisa listar os papéis de fundo`);
      continue;
    }
    let fundosOk = true;
    for (const nome of contra) {
      const f = porVar.get(nome);
      if (!f) { erro(`${onde}: visibilidade contra "${nome}", que não é papel`); fundosOk = false; continue; }
      if (f.type !== 'color' || f.derivado || f.visibilidade) {
        erro(`${onde}: visibilidade contra ${nome}, que precisa ser cor fixa (não derivada, sem guarda própria)`);
        fundosOk = false;
      }
    }
    if (!fundosOk || !minOk || normalizeHex(p.level3) == null || contra.some(n => normalizeHex(porVar.get(n).level3) == null)) continue;
    const pior = piorContraste(p.level3, contra.map(nome => ({ nome, valor: porVar.get(nome).level3 })));
    if (pior.razao < min) {
      erro(`${onde}: o nível 3 ${p.level3} tem contraste ${formatarRazao(pior.razao)} contra ${pior.nome} (${pior.valor}), abaixo do mínimo ${formatarRazao(min)} — a guarda cairia num valor que ela mesma reprova`);
    }
  }

  // Neutros
  const aliases = new Set((model.papeis ?? []).map(p => p.alias));
  const neutros = new Set();
  for (const n of model.neutros ?? []) {
    if (!(n.cssVar ?? '').startsWith(prefixoAlias)) erro(`neutro ${n.cssVar}: fora do prefixo ${prefixoAlias}`);
    if (aliases.has(n.cssVar)) erro(`neutro ${n.cssVar}: mesmo nome de um papel`);
    if (neutros.has(n.cssVar)) erro(`neutro ${n.cssVar}: repetido`);
    neutros.add(n.cssVar);
    if (normalizeHex(n.valor) !== n.valor && !RGBA.test(n.valor ?? '')) erro(`neutro ${n.cssVar}: valor "${n.valor}" não é hex minúsculo nem rgb()/rgba()`);
  }

  // Slots, handles, placeholders, limites
  for (const k of ['css', 'js', 'header', 'footer']) {
    if (!Array.isArray(model.slots?.[k])) erro(`slots.${k} precisa ser uma lista`);
  }
  for (const h of model.handles ?? []) {
    const mh = /^vtex-[a-z0-9-]+-(\d+)-x-$/.exec(h.prefixo ?? '');
    if (!mh) erro(`handle "${h.prefixo}" fora do formato vtex-<app>-<major>-x-`);
    else if (Number(mh[1]) !== h.major) erro(`handle "${h.prefixo}": major ${h.major} não bate com o nome`);
  }
  for (const ph of model.placeholders ?? []) {
    if (!/^\{\{[A-Z][A-Z_]*\}\}$/.test(ph.id ?? '')) erro(`placeholder "${ph.id}" fora do formato {{NOME}}`);
    if ((ph.id ?? '').startsWith('{{ETC_')) erro(`placeholder "${ph.id}": o prefixo ETC_ é do compose, não do time`);
  }
  for (const k of ['jsBytes', 'logoAvisoBytes', 'logoErroBytes']) {
    if (!Number.isInteger(model.limites?.[k]) || model.limites[k] <= 0) erro(`limites.${k} precisa ser um inteiro > 0`);
  }
  return erros;
}
