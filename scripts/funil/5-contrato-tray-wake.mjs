/**
 * Estágio 5 — contrato Tray/Wake (e Nuvemshop, com a flag), estático.
 *
 * Montar o tema é o `4-tema-tray-wake` (o generator com `GENERATOR_LOCAL=1`: a
 * Wake não chama a API e a Tray não abre `tray watch`). Este estágio confere o
 * contrato sem executar, no config que o /gerador exportou no estágio 3: o
 * caminho de origem, a unicidade da key, os limites conhecidos de instância e,
 * na Wake 2.0, os schemas dos blocos do Design Studio.
 *
 * A Nuvemshop entra com NEXT_PUBLIC_PLATAFORMA_NUVEMSHOP=1, a mesma flag que a
 * põe no /gerador e no estágio 3 (que grava o config dela). Regra própria: o
 * config não carrega credencial nenhuma (`conferirNuvemshop`).
 */
import fs from 'node:fs';
import path from 'node:path';
import { GLOBAL_TEMPLATES, SAIDA, relatorio } from './lib/util.mjs';
import {
  conferirTrayWake,
  conferirNuvemshop,
  conferirSchemasDesignStudio,
  conferirLpNuvemshop,
  conferirParidadeGlobalTemplates,
} from './lib/contrato.mjs';
import { NUVEMSHOP_LIGADA } from '../../src/types/platform.ts';

const r = relatorio('Estágio 5 — contrato Tray/Wake');

// As origens abaixo são conferidas no clone local; o generator clona o remoto.
// Diz qual árvore foi lida e reprova se o local não for o que está empurrado.
await conferirParidadeGlobalTemplates(r);

// Wake 2.0: o bloco do Design Studio (`<sel>.schema.json`) e o HTML que o lê.
conferirSchemasDesignStudio(r);

const PLATAFORMAS = ['Tray', 'Wake', ...(NUVEMSHOP_LIGADA ? ['Nuvemshop'] : []), 'Wake 2.0'];

for (const plataforma of PLATAFORMAS) {
  const arquivo = `${SAIDA}/config-${plataforma}.json`;
  if (!fs.existsSync(arquivo)) {
    r.ok(`${plataforma}: config disponível`, false, 'rode o estágio 3 antes');
    continue;
  }
  const config = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  const entradas =
    plataforma === 'Nuvemshop'
      ? conferirNuvemshop(config, r)
      : conferirTrayWake(config, plataforma, r);

  // Nenhuma pasta com espaço pode aparecer num caminho resolvido: o generator
  // monta `template_${N}` literalmente, então "template 4" é invisível para ele.
  const comEspaco = entradas.filter(
    e => /\s/.test(`template_${e.template}`) || /\s/.test(e.selection)
  );
  r.ok(
    `${plataforma}: nenhum template/selection com espaço`,
    comEspaco.length === 0,
    comEspaco.map(e => e.selection).join(', ')
  );

  // Duas entradas apontando para a MESMA pasta de origem são a duplicata que
  // importa. Fora da Home o generator não instancia: o `instanceCount` não chega
  // a processCategoryHtmlFile nem a processProductHtmlFile, então a segunda vira
  // include repetido do primeiro snippet mais um `_2.html` órfão no tema.
  const conta = chave => {
    const m = new Map();
    for (const e of entradas) {
      const k = chave(e);
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return m;
  };
  //
  // A Nuvemshop não tem esse limite: cada instância é uma entrada de `sections`
  // no JSON da página, com os próprios settings (contrato da Nuvemshop, §2.1 C).
  const foraDaHome = [
    ...conta(e => `${e.balde}::template_${e.template}/${e.selection}`),
  ]
    .filter(([k, n]) => n > 1 && !k.startsWith('home::'))
    .map(([k, n]) => `${k} ×${n}`);
  if (plataforma !== 'Nuvemshop')
    r.ok(
      `${plataforma}: nenhuma origem repetida fora da Home`,
      foraDaHome.length === 0,
      foraDaHome.join(', ')
    );

  // Vários MODELOS no mesmo slot é outra coisa: são pastas distintas. Não
  // quebra, mas um config assim não é alcançável pela UI — o `toggleSelection`
  // trata esses slots como singleton. Só aparece porque o estágio 3 semeia o
  // catálogo inteiro de propósito, para cobrir todos os caminhos.
  const multi = [...conta(e => `${e.balde}::${e.selection}`)].filter(
    ([, n]) => n > 1
  );
  if (multi.length) {
    console.log(
      `     ℹ️  ${plataforma}: ${multi.length} slots com mais de um modelo (seleção máxima do estágio 3)`
    );
  }
}

// O config do modo LP da Nuvemshop (fase 7), que o estágio 3 exporta com a flag:
// as mesmas regras de origem e de credencial, mais as da LP.
if (NUVEMSHOP_LIGADA) {
  const arquivo = `${SAIDA}/config-Nuvemshop-lp.json`;
  if (fs.existsSync(arquivo))
    conferirLpNuvemshop(JSON.parse(fs.readFileSync(arquivo, 'utf8')), r);
  else r.ok('Nuvemshop-lp: config disponível', false, 'rode o estágio 3 antes');
}

// O universo endereçável, para a cobertura não virar surpresa.
let alcancaveis = 0;
let inalcancaveis = 0;
for (const plataforma of PLATAFORMAS) {
  for (const secao of ['Common', 'Home', 'Category', 'Product', 'Landing']) {
    const base = path.join(GLOBAL_TEMPLATES, plataforma, secao);
    if (!fs.existsSync(base)) continue;
    for (const tpl of fs.readdirSync(base)) {
      if (!fs.statSync(path.join(base, tpl)).isDirectory()) continue;
      const n = fs
        .readdirSync(path.join(base, tpl))
        .filter(c => fs.statSync(path.join(base, tpl, c)).isDirectory()).length;
      /^template_\d+$/.test(tpl) ? (alcancaveis += n) : (inalcancaveis += n);
    }
  }
}
console.log(
  `  ℹ️  universo em global-templates: ${alcancaveis} componentes endereçáveis, ` +
    `${inalcancaveis} em pastas cujo nome o generator não resolve`
);

process.exit(r.fechar() ? 0 : 1);
