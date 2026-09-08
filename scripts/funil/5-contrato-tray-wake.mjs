/**
 * Estágio 5 — contrato Tray/Wake, estático.
 *
 * Executar o generator nessas duas trilhas é inviável desta máquina, e não por
 * escolha: o `git ls-remote` do GitLab (tema-base da Tray) e do git.fbits.net
 * (tema da Wake) TRAVA dentro do git-credential-osxkeychain — só github.com tem
 * helper configurado. Somado a isso, a Tray abre `start cmd /k` (Windows) e a
 * Wake publica conteúdo ativo numa loja real via API, sem flag de bypass.
 *
 * O que dá para provar sem executar é o contrato: o caminho de origem, a
 * unicidade da key e os limites conhecidos de instância.
 */
import fs from 'node:fs';
import path from 'node:path';
import { GLOBAL_TEMPLATES, SAIDA, relatorio } from './lib/util.mjs';
import { conferirTrayWake } from './lib/contrato.mjs';

const r = relatorio('Estágio 5 — contrato Tray/Wake');

for (const plataforma of ['Tray', 'Wake']) {
  const arquivo = `${SAIDA}/config-${plataforma}.json`;
  if (!fs.existsSync(arquivo)) {
    r.ok(`${plataforma}: config disponível`, false, 'rode o estágio 3 antes');
    continue;
  }
  const config = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  const entradas = conferirTrayWake(config, plataforma, r);

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
  const foraDaHome = [
    ...conta(e => `${e.balde}::template_${e.template}/${e.selection}`),
  ]
    .filter(([k, n]) => n > 1 && !k.startsWith('home::'))
    .map(([k, n]) => `${k} ×${n}`);
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

// O universo endereçável, para a cobertura não virar surpresa.
let alcancaveis = 0;
let inalcancaveis = 0;
for (const plataforma of ['Tray', 'Wake']) {
  for (const secao of ['Common', 'Home', 'Category', 'Product']) {
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
