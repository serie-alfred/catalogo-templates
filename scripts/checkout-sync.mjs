/**
 * yarn checkout:sync [--sha <sha>] [--repo <pasta>]
 *
 * Vendoriza no catálogo UM COMMIT do `checkout-vtex` — o mesmo SHA que o
 * generator clona para montar o checkout do cliente. É o que garante a
 * invariante central do checkout (checkout-vtex/docs/arquitetura.md): o preview
 * do /gerador e o arquivo entregue saem do MESMO `lib/compose.mjs`, byte a byte.
 *
 * Lê o commit, nunca o working tree ("clone enxerga commit"): `git archive` do
 * SHA pedido (ou do HEAD) de `../checkout-vtex` (ou `--repo`, ou
 * `CHECKOUT_VTEX_DIR`). Escreve:
 *
 *   src/lib/checkout/*.mjs                    lib/*.mjs do SHA (menos os *.test.mjs), intocado
 *   src/data/checkout/Checkout01/checkout.json
 *   public/gerador/checkout/Checkout01/       dist/Checkout01/** (a base com slots + default/)
 *   public/gerador/checkout/Checkout01/<etapa>.<vp>.html        as fixtures do preview
 *   public/gerador/checkout/Checkout01/<etapa>.<vp>.card.html   o iframe do cartão (pagamento)
 *   src/data/checkout/VERSION.json            { sha, hashes, provisorio, fixtures }
 *
 * FIXTURES. A preferida é a REAL, `modelos/Checkout01/fixtures/<etapa>/<vp>/`
 * do SHA (`yarn fixtures:capturar` do checkout-vtex): o DOM com o NOSSO JS, o
 * CSSOM serializado, `[data-etm-slot=header|footer]` e o `card.html` do cartão.
 * Ela vem pronta e anonimizada pela captura do checkout-vtex; o sync só renomeia o `card.html`
 * para o nome achatado e reconfere tudo. Fixture real cujo `sha256Js` não é o do `dist/default` do MESMO SHA
 * reprova: o preview mostraria um DOM que o JS entregue não produz.
 *
 * Só onde falta a real entra a PROVISÓRIA, gerada aqui a partir de
 * `modelos/Checkout01/captura-crua/<etapa>-<vp>/dom.html` (o DOM NATIVO, sem o
 * nosso JS). `provisorio: true` no VERSION.json se sobrou alguma.
 *
 * O catálogo é repo PÚBLICO. A captura crua vem de uma conta real, então a
 * fixture provisória sai sem script nenhum, sem dado da conta (host, favicon,
 * seller, imagem de produto, endereço do ponto de retirada) e sem dado pessoal
 * (e-mail, nome, CPF), e o CSS nativo da VTEX aponta para as URLs VERSIONADAS do
 * CDN (io2.vtex.com/checkout-ui/v6.x, vtex.vtexassets.com) em vez de ser copiado.
 * Real ou provisória, o script REPROVA se sobrar `<script>`, atributo de evento
 * (`on…=`) ou URL `javascript:` — não é aviso (o iframe do preview não tem
 * sandbox e é da origem do catálogo). E REPROVA se QUALQUER arquivo que ele
 * grava (lib, checkout.json, dist, fixtures, cartões, VERSION.json) tiver termo
 * da lista do repo público (gate0 #29): a canônica do checkout-vtex, a do
 * PRÓPRIO SHA, lida com `git show` e importada de um `data:` URL — em memória.
 * Nem a lista nem as trocas são gravadas no catálogo; SHA sem ela, ou com ela
 * dentro do `lib/` (que vem inteiro para cá), não passa. Depois do sync, o
 * catálogo confere o que vendorizou pelos hashes do VERSION.json.
 *
 * Só a provisória precisa do Chrome (o mesmo do funil): o HTML é reescrito
 * pelo DOMParser do navegador, que não executa script nem busca recurso.
 */
import { execFileSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";
import {
  MODELO,
  VIEWPORTS,
  CHECKOUT_VTEX,
  DEST,
  nomeDaFixture,
  nomeDoCartao,
  listaDoSha,
} from "./funil/lib/checkout.mjs";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// ── argumentos ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const arg = nome => {
  const i = args.indexOf(`--${nome}`);
  return i === -1 ? undefined : args[i + 1];
};
const REPO = arg("repo") ? path.resolve(arg("repo")) : CHECKOUT_VTEX;

/** A pasta temporária da rodada (o tar do SHA e a área de preparo); `falhar` a apaga. */
let TMP = null;

const falhar = mensagem => {
  console.error(`\n💥 checkout:sync — ${mensagem}`);
  if (TMP) fs.rmSync(TMP, { recursive: true, force: true });
  process.exit(1);
};

const git = (...a) =>
  execFileSync("git", ["-C", REPO, ...a], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();

if (!fs.existsSync(REPO)) falhar(`repo do checkout-vtex não encontrado em ${REPO}`);
let SHA;
try {
  SHA = git("rev-parse", "--verify", `${arg("sha") ?? "HEAD"}^{commit}`);
} catch {
  falhar(
    `${arg("sha") ?? "HEAD"} não é um commit de ${REPO}. O sync lê um COMMIT, não o working tree — ` +
      "commite no checkout-vtex (ou passe --sha / --repo apontando para um snapshot com commit)."
  );
}

// ── extrai o commit ─────────────────────────────────────────────────────────
TMP = fs.mkdtempSync(path.join(os.tmpdir(), "checkout-sync-"));
const TAR = path.join(TMP, "sha.tar");
const ARVORE = path.join(TMP, "arvore");
fs.mkdirSync(ARVORE);
// Só o que existe no SHA vai para o `git archive` (caminho ausente o faz falhar):
// um SHA antigo não tem `fixtures/`, e um novo pode não precisar da captura crua.
const existeNoSha = rel => {
  try {
    return git("ls-tree", "--name-only", SHA, "--", rel) !== "";
  } catch {
    return false;
  }
};
const PEDIDOS = [
  "lib",
  `modelos/${MODELO}/checkout.json`,
  `dist/${MODELO}`,
  `modelos/${MODELO}/fixtures`,
  `modelos/${MODELO}/captura-crua`,
].filter(existeNoSha);
try {
  execFileSync("git", ["-C", REPO, "archive", "--format=tar", "-o", TAR, SHA, "--", ...PEDIDOS], {
    stdio: ["ignore", "ignore", "pipe"],
  });
  execFileSync("tar", ["-xf", TAR, "-C", ARVORE]);
} catch (e) {
  falhar(`git archive ${SHA.slice(0, 7)} falhou: ${String(e.stderr ?? e).trim().split("\n").pop()}`);
}
const daArvore = rel => path.join(ARVORE, rel);

/*
 * A trava do repo público (gate0 #29) usa a lista CANÔNICA do checkout-vtex, a
 * do SHA que está sendo vendorizado — a mesma com que a captura de lá reprova —,
 * nunca uma cópia daqui. `listaDoSha` a acha fora do `lib/`, lê com `git show` e
 * importa de um `data:` URL: nada disso vai para o disco nem para o catálogo, e
 * este script não guarda termo nenhum (nem as TROCAS, que vêm do mesmo arquivo).
 */
let PROIBIDOS, sobrasProibidas, trechosProibidos, TROCAS;
try {
  ({ PROIBIDOS, sobrasProibidas, trechosProibidos, TROCAS } = (await listaDoSha(REPO, SHA)).publico);
} catch (e) {
  falhar(`o SHA ${SHA.slice(0, 12)} não serve: ${e.message}`);
}

const model = JSON.parse(fs.readFileSync(daArvore(`modelos/${MODELO}/checkout.json`), "utf8"));
if (model.id !== MODELO) falhar(`checkout.json do ${MODELO} diz id "${model.id}"`);

// ── destinos ────────────────────────────────────────────────────────────────
const DEST_LIB = DEST.lib;
const DEST_DATA = DEST.data;
const DEST_PUBLIC = DEST.public;
const escritos = new Map(); // caminho relativo à raiz → sha256

/*
 * Tudo é gravado primeiro numa área de PREPARO (TMP/preparo, espelhando os
 * caminhos da raiz) e só vai para o catálogo depois de TODAS as travas passarem
 * (fim do arquivo). Antes, uma fixture reprovada no meio (sha256Js defasado,
 * termo proibido) deixava o `public/` já apagado e meio reescrito, o `lib/` do
 * SHA novo e o VERSION.json do velho: o /gerador ficava sem as fixturas das
 * etapas seguintes até alguém rodar o sync de novo.
 */
const PREPARO = path.join(TMP, "preparo");
const sha256 = buf => crypto.createHash("sha256").update(buf).digest("hex");
function gravar(abs, conteudo) {
  const rel = path.relative(RAIZ, abs);
  const destino = path.join(PREPARO, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, conteudo);
  escritos.set(rel, sha256(fs.readFileSync(destino)));
}

// lib/*.mjs, menos os testes (usam fs e os repos irmãos; não servem ao navegador).
const libs = fs
  .readdirSync(daArvore("lib"))
  .filter(n => n.endsWith(".mjs") && !n.endsWith(".test.mjs"))
  .sort();
for (const n of libs) gravar(path.join(DEST_LIB, n), fs.readFileSync(daArvore(`lib/${n}`)));

gravar(
  path.join(DEST_DATA, MODELO, "checkout.json"),
  fs.readFileSync(daArvore(`modelos/${MODELO}/checkout.json`))
);

// public/: apagado e reescrito inteiro (no fim, ao aplicar) — é espelho do SHA,
// não pasta de trabalho.
const copiarArvore = (de, para) => {
  for (const ent of fs.readdirSync(de, { withFileTypes: true })) {
    const a = path.join(de, ent.name);
    const b = path.join(para, ent.name);
    if (ent.isDirectory()) copiarArvore(a, b);
    else gravar(b, fs.readFileSync(a));
  }
};
copiarArvore(daArvore(`dist/${MODELO}`), DEST_PUBLIC);

// Imagem neutra no lugar das fotos de produto (hospedadas no CDN da conta).
const PLACEHOLDER = "produto.svg";
gravar(
  path.join(DEST_PUBLIC, PLACEHOLDER),
  '<svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 55 55">' +
    '<rect width="55" height="55" fill="#eeeeee"/><circle cx="21" cy="20" r="4" fill="#c4c4c4"/>' +
    '<path d="M12 40l10-12 7 8 5-6 9 10z" fill="#c4c4c4"/></svg>\n'
);

// ── fixture provisória (captura crua → publicável) ──────────────────────────


/**
 * Uma captura crua → uma fixture publicável. Roda DENTRO do navegador (é
 * passada ao `page.evaluate`), então não enxerga nada deste módulo.
 */
function processarFixture(html, opcoes) {
  /* Roda no navegador (DOMParser). Sem closure: tudo vem em `opcoes`. */
  const { etapa, passo, vp, versao, placeholder, nomes, trocas: trocasDaLista, sha } = opcoes;
  const d = new DOMParser().parseFromString(html, "text/html");
  const relato = { removidos: {}, reescritos: {} };
  const conta = (onde, k) => {
    onde[k] = (onde[k] ?? 0) + 1;
  };

  // 1. Nada executável nem que busque conteúdo de fora.
  for (const sel of ["script", "noscript", "iframe", "object", "embed", "base", "template"])
    d.querySelectorAll(sel).forEach(e => {
      e.remove();
      conta(relato.removidos, sel);
    });
  d.querySelectorAll('meta[http-equiv="origin-trial" i], meta[name="msapplication-TileImage"]').forEach(e => {
    e.remove();
    conta(relato.removidos, "meta");
  });
  d.querySelectorAll("link").forEach(l => {
    const rel = (l.getAttribute("rel") ?? "").toLowerCase();
    if (/icon|preconnect|dns-prefetch|preload|prefetch|modulepreload|manifest/.test(rel)) {
      l.remove();
      conta(relato.removidos, `link[rel=${rel}]`);
    }
  });
  // Comentários condicionais do IE carregam <script>/<link> de verdade.
  const comentarios = [];
  const tw = d.createTreeWalker(d, NodeFilter.SHOW_COMMENT);
  while (tw.nextNode()) comentarios.push(tw.currentNode);
  for (const c of comentarios)
    if (/^\s*\[if|<script|<link/i.test(c.data)) {
      c.remove();
      conta(relato.removidos, "comentario-condicional");
    }
  for (const el of d.querySelectorAll("*"))
    for (const a of [...el.attributes]) {
      if (/^on/i.test(a.name)) {
        el.removeAttribute(a.name);
        conta(relato.removidos, "atributo on*");
      } else if (/^\s*javascript:/i.test(a.value) && /^(href|src|action|formaction|xlink:href)$/i.test(a.name)) {
        el.setAttribute(a.name, "#");
        conta(relato.reescritos, "javascript:");
      }
    }
  d.querySelectorAll("form[action]").forEach(f => f.removeAttribute("action"));

  // 2. O CSS da CONTA sai; entra o nosso no MESMO lugar da cascata: a base por
  //    <link> e o `:root` do compose num <style>, que o /gerador reescreve ao vivo.
  const custom = d.querySelector("link#checkout-custom-css") ?? d.querySelector('link[href*="/files/checkout6-custom.css"]');
  if (!custom) throw new Error("fixture sem o <link> do checkout6-custom.css: não sei onde a nossa base entra na cascata");
  const base = d.createElement("link");
  base.id = "ck-base";
  base.rel = "stylesheet";
  base.href = "checkout6-custom.css";
  const tokens = d.createElement("style");
  tokens.id = "ck-tokens";
  custom.replaceWith(base, tokens);
  d.querySelectorAll('link[href*="/arquivos/checkout-custom"]').forEach(e => {
    e.remove();
    conta(relato.removidos, "legado /arquivos/checkout-custom");
  });

  // 3. CSS nativo pelas URLs versionadas do CDN; o host da conta vira o CDN público.
  d.querySelectorAll("link[href]").forEach(l => {
    let href = l.getAttribute("href");
    if (href.startsWith("//")) href = `https:${href}`;
    // `[\w-]+` já cobre o prefixo do workspace (`<ws>--<conta>`).
    const m = /^https:\/\/[\w-]+\.(?:myvtex|vtexassets)\.com\/_v\/public\/assets\/v1\/(.*)$/.exec(href);
    if (m && !/^https:\/\/vtex\.vtexassets\.com\//.test(href)) {
      href = `https://vtex.vtexassets.com/_v/public/assets/v1/${m[1]}`;
      conta(relato.reescritos, "css da conta → vtex.vtexassets.com");
    }
    if (href !== l.getAttribute("href")) l.setAttribute("href", href);
  });

  // 4. Imagem de fora vira o placeholder local; link de navegação vira "#".
  d.querySelectorAll("img").forEach(i => {
    const src = i.getAttribute("src") ?? "";
    if (/^(https?:)?\/\//.test(src) || src.startsWith("/")) {
      i.setAttribute("src", placeholder);
      conta(relato.reescritos, "img → placeholder");
    }
    i.removeAttribute("srcset");
  });
  d.querySelectorAll("source[srcset]").forEach(s => s.removeAttribute("srcset"));
  // Qualquer href que não seja de <link> (o Knockout deixa `href` até em <span>).
  d.querySelectorAll("[href]:not(link)").forEach(a => {
    const href = a.getAttribute("href");
    if (/^(https?:)?\/\//.test(href) || href.startsWith("/")) {
      a.setAttribute("href", "#");
      conta(relato.reescritos, "href → #");
    }
  });

  // 5. Dados pessoais (fictícios na captura, mas normalizados: CPF gerado tem
  //    DV válido e pode existir) e dados da conta: as TROCAS da lista do SHA
  //    (`[fonte, flags, substituto]`, em ordem — as mesmas da captura do
  //    checkout-vtex), depois os nomes de produto.
  const trocas = [
    ...trocasDaLista.map(([fonte, flags, para]) => [new RegExp(fonte, flags), para]),
    ...nomes.map(([de, para]) => [de, para]),
  ];
  const normalizar = texto => {
    let t = texto;
    for (const [de, para] of trocas) t = typeof de === "string" ? t.split(de).join(para) : t.replace(de, para);
    return t;
  };
  const textos = d.createTreeWalker(d, NodeFilter.SHOW_TEXT);
  while (textos.nextNode()) {
    const n = textos.currentNode;
    const novo = normalizar(n.data);
    if (novo !== n.data) {
      n.data = novo;
      conta(relato.reescritos, "texto normalizado");
    }
  }
  for (const el of d.querySelectorAll("*"))
    for (const a of [...el.attributes]) {
      const novo = normalizar(a.value);
      if (novo !== a.value) {
        el.setAttribute(a.name, novo);
        conta(relato.reescritos, `atributo ${a.name} normalizado`);
      }
    }
  const porId = { "client-first-name": "Cliente", "client-last-name": "Exemplo" };
  for (const [id, valor] of Object.entries(porId)) {
    const inp = d.getElementById(id);
    if (inp && inp.getAttribute("value")) inp.setAttribute("value", valor);
  }
  // Endereço do ponto de retirada: é o da conta, não o do comprador.
  const ENDERECO = { street: "Rua Exemplo", number: "100", neighborhood: "Centro", complement: "", reference: "", postalCode: "00000-000" };
  d.querySelectorAll(".pickup-point-address .address-summary, .vtex-omnishipping-1-x-PickupPointAddress .address-summary").forEach(box => {
    for (const [classe, valor] of Object.entries(ENDERECO))
      box.querySelectorAll(`.${classe}`).forEach(e => {
        e.textContent = valor;
        conta(relato.reescritos, "endereço do ponto de retirada");
      });
  });

  // 6. O que o etapa.js faria no <head> (a fixture não tem script): a etapa e o passo no <html>.
  d.documentElement.classList.add(`ck01-step-${etapa}`, `ck01-passo-${passo}`);

  // 7. Slots do header e do footer, onde a costura do checkout-vtex os põe
  //    (docs/spikes/S1.md): header entre .pci-alert-topbar e
  //    .vtex-front-messages-placeholder; footer depois de #universal-extensions.
  //    Comentários e não um <div>: o DOM fica igual ao da página costurada.
  const slot = (nome, depoisDe) => {
    if (!depoisDe) throw new Error(`âncora do slot ${nome} ausente`);
    const ini = d.createComment(` ck-slot:${nome} `);
    const fim = d.createComment(` /ck-slot:${nome} `);
    depoisDe.after(ini, fim);
  };
  slot("header", d.querySelector(".pci-alert-topbar"));
  slot("footer", d.getElementById("universal-extensions"));

  const meta = d.createElement("meta");
  meta.name = "etm-fixture";
  meta.content = `provisoria · captura crua · checkout-ui ${versao} · ${etapa}-${vp} · checkout-vtex ${sha.slice(0, 12)}`;
  d.head.prepend(meta);

  let saida = `<!DOCTYPE html>\n<!-- E-temas · fixture PROVISÓRIA do ${"Checkout01"} (${etapa}, ${vp}px), gerada por scripts/checkout-sync.mjs a partir da captura crua do checkout-vtex@${sha.slice(0, 12)}. Sem script, sem dado da conta nem pessoal. Não edite: rode yarn checkout:sync. -->\n${d.documentElement.outerHTML}\n`;
  // Entidade que o DOMParser decodifica e o outerHTML não reescapa não existe; mas o
  // `&nbsp;` volta como caractere — sem efeito visual.
  saida = saida.replace(/\r\n?/g, "\n");
  return { html: saida, relato };
}

const CAPTURA = daArvore(`modelos/${MODELO}/captura-crua`);
const REAIS = daArvore(`modelos/${MODELO}/fixtures`);
const pares = model.etapas.flatMap(e => VIEWPORTS.map(vp => ({ etapa: e.id, passo: e.passo, vp })));
const realDe = p => path.join(REAIS, p.etapa, String(p.vp));
const temReal = p => fs.existsSync(path.join(realDe(p), "index.html"));
const temCrua = p => fs.existsSync(path.join(CAPTURA, `${p.etapa}-${p.vp}`, "dom.html"));
const provisorios = pares.filter(p => !temReal(p));
const semNada = provisorios.filter(p => !temCrua(p));
if (semNada.length)
  falhar(`sem fixture real nem captura crua no SHA para: ${semNada.map(p => `${p.etapa}-${p.vp}`).join(", ")}`);

/** Atributo de evento (`onclick=`, `onerror=`…) dentro de uma tag. */
const EXECUTAVEL_EVENTO = /<[a-z][^>]*\son[a-z]+\s*=/i;
/** URL `javascript:` nos atributos que navegam ou carregam (os que a provisória reescreve). */
const EXECUTAVEL_URL = /\s(?:href|src|action|formaction|xlink:href)\s*=\s*["']?\s*javascript:/i;

/** A mesma trava para real e provisória: nada proibido, nada executável, o que o CheckoutFrame precisa. */
function conferirPublicavel(nome, html, { cartao = false } = {}) {
  const sobras = sobrasProibidas(html);
  if (sobras.length) {
    if (typeof trechosProibidos === "function") for (const t of trechosProibidos(html)) console.error("   ", t);
    return `ainda tem ${sobras.length} termo(s) da lista do repo público (trechos acima) — o catálogo é público`;
  }
  if (/<script/i.test(html)) return "ainda tem <script>";
  // A fixture roda num iframe SEM sandbox, na origem do catálogo: atributo de
  // evento ou URL javascript: executaria como um <script>. A captura do
  // checkout-vtex e a provisória já os tiram; aqui é a trava de quem publica.
  if (EXECUTAVEL_EVENTO.test(html)) return "ainda tem atributo de evento (on…=)";
  if (EXECUTAVEL_URL.test(html)) return "ainda tem URL javascript: em href/src/action";
  if (!/<link id="ck-base" rel="stylesheet" href="checkout6-custom\.css">/.test(html)) return 'sem o <link id="ck-base">';
  if (!/<style id="ck-tokens">/.test(html)) return 'sem o <style id="ck-tokens">';
  if (cartao) return null;
  const slotDiv = n => new RegExp(`<div data-etm-slot="${n}"[^>]*>`).test(html);
  const slotComentario = n => html.includes(`<!-- ck-slot:${n} -->`) && html.includes(`<!-- /ck-slot:${n} -->`);
  for (const n of ["header", "footer"]) if (!slotDiv(n) && !slotComentario(n)) return `sem o slot ${n}`;
  return null;
}

const fixtures = {};
const shaJsDoDist = sha256(fs.readFileSync(daArvore(`dist/${MODELO}/default/${model.arquivos.js}`)));

// ── fixtures REAIS ──────────────────────────────────────────────────────────
for (const p of pares.filter(temReal)) {
  const dir = realDe(p);
  const nome = nomeDaFixture(p.etapa, p.vp);
  const meta = JSON.parse(fs.readFileSync(path.join(dir, "fixture.json"), "utf8"));
  if (meta.etapa !== p.etapa || meta.vp !== p.vp || meta.modelo !== MODELO)
    falhar(`fixtures/${p.etapa}/${p.vp}/fixture.json diz ${meta.modelo} ${meta.etapa}-${meta.vp}`);
  // A fixture foi capturada com o JS que o generator entrega deste SHA? Sem isso o
  // preview mostra um DOM que o checkout6-custom.js entregue não produz.
  if (meta.sha256Js !== shaJsDoDist)
    falhar(
      `fixtures/${p.etapa}/${p.vp}: sha256Js ${String(meta.sha256Js).slice(0, 12)} ≠ dist/${MODELO}/default/${model.arquivos.js} ${shaJsDoDist.slice(0, 12)} — recapture (yarn fixtures:capturar) e commite no checkout-vtex`
    );
  let html = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  let card = null;
  if (fs.existsSync(path.join(dir, "card.html"))) {
    // O público é achatado (<etapa>.<vp>.html ao lado da base, que a fixture pede
    // por caminho relativo), então o card.html de cada vp ganha nome próprio.
    card = nomeDoCartao(p.etapa, p.vp);
    const refs = html.match(/ src="card\.html"/g) ?? [];
    if (refs.length !== 1) falhar(`fixtures/${p.etapa}/${p.vp}/index.html cita o card.html ${refs.length} vezes (esperado: 1)`);
    html = html.replace(' src="card.html"', ` src="${card}"`);
    const htmlCard = fs.readFileSync(path.join(dir, "card.html"), "utf8");
    const erroCard = conferirPublicavel(card, htmlCard, { cartao: true });
    if (erroCard) falhar(`fixture ${card}: ${erroCard}`);
    gravar(path.join(DEST_PUBLIC, card), htmlCard);
  } else if (/<iframe/i.test(html)) {
    falhar(`fixtures/${p.etapa}/${p.vp}/index.html tem <iframe> sem card.html ao lado`);
  }
  const erro = conferirPublicavel(nome, html);
  if (erro) falhar(`fixture ${nome}: ${erro}`);
  gravar(path.join(DEST_PUBLIC, nome), html);
  fixtures[nome] = {
    etapa: p.etapa,
    vp: p.vp,
    origem: "real",
    checkoutUi: meta.versoes?.checkoutUi ?? null,
    cardUi: meta.versoes?.cardUi ?? null,
    capturadaEm: meta.capturadaEm,
    sha256Js: meta.sha256Js,
    ...(card ? { card } : {}),
    bytes: Buffer.byteLength(html),
  };
}

// ── fixtures PROVISÓRIAS (só onde falta a real) ──────────────────────────────
if (provisorios.length) {
  const findChrome = () => {
    if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
    for (const c of [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium-browser",
    ])
      if (fs.existsSync(c)) return c;
    falhar("Chrome não encontrado (defina CHROME_PATH): o sync reescreve as fixtures provisórias com o DOMParser do navegador");
  };

  const navegador = await puppeteer.launch({ executablePath: findChrome(), headless: "shell" });
  const pagina = await navegador.newPage();
  // A página de trabalho é about:blank e o DOMParser não busca nada; bloquear a
  // rede é só a garantia de que nenhum byte sai daqui.
  await pagina.setRequestInterception(true);
  pagina.on("request", r => (r.url() === "about:blank" ? r.continue() : r.abort()));
  await pagina.goto("about:blank");

  // Nomes de produto das capturas → "Produto de teste N", construído sobre TODAS
  // as capturas para a mesma peça ter o mesmo nome em todas as etapas. Os produtos
  // de teste da conta carregam marca real de cliente no nome.
  const nomesBrutos = [];
  for (const p of pares.filter(temCrua)) {
    const html = fs.readFileSync(path.join(CAPTURA, `${p.etapa}-${p.vp}`, "dom.html"), "utf8");
    const achados = await pagina.evaluate(h => {
      const d = new DOMParser().parseFromString(h, "text/html");
      const out = [];
      d.querySelectorAll(".cart-items img[alt], .product-item img[alt], img.photo[alt]").forEach(i =>
        out.push(i.getAttribute("alt").split(" | ")[0].trim())
      );
      d.querySelectorAll(".product-name, [id^='product-name']").forEach(e => {
        if (!e.children.length || e.tagName === "A") out.push(e.textContent.trim());
        if (e.getAttribute("title")) out.push(e.getAttribute("title").trim());
      });
      return out.filter(Boolean);
    }, html);
    for (const n of achados) if (!nomesBrutos.includes(n)) nomesBrutos.push(n);
  }
  // Do mais longo para o mais curto: um nome contido em outro não pode ser trocado antes.
  const nomes = nomesBrutos
    .map((n, i) => [n, `Produto de teste ${String(i + 1).padStart(2, "0")}`])
    .sort((a, b) => b[0].length - a[0].length);

  for (const p of provisorios) {
    const pasta = path.join(CAPTURA, `${p.etapa}-${p.vp}`);
    const html = fs.readFileSync(path.join(pasta, "dom.html"), "utf8");
    const versoes = JSON.parse(fs.readFileSync(path.join(pasta, "versoes.json"), "utf8"));
    let r;
    try {
      r = await pagina.evaluate(processarFixture, html, {
        ...p,
        versao: versoes.checkoutUi,
        placeholder: PLACEHOLDER,
        nomes,
        trocas: TROCAS,
        sha: SHA,
      });
    } catch (e) {
      await navegador.close();
      falhar(`fixture ${p.etapa}-${p.vp}: ${e.message}`);
    }
    const nome = nomeDaFixture(p.etapa, p.vp);
    const erro = conferirPublicavel(nome, r.html);
    if (erro) {
      await navegador.close();
      falhar(`fixture ${nome}: ${erro}`);
    }
    gravar(path.join(DEST_PUBLIC, nome), r.html);
    fixtures[nome] = {
      etapa: p.etapa,
      vp: p.vp,
      origem: "provisoria",
      checkoutUi: versoes.checkoutUi,
      bytes: Buffer.byteLength(r.html),
      removidos: r.relato.removidos,
      reescritos: r.relato.reescritos,
    };
  }
  await navegador.close();
}

// ── VERSION.json ────────────────────────────────────────────────────────────
const ordem = pares.map(p => nomeDaFixture(p.etapa, p.vp));
const lista = ordem.map(n => [n, fixtures[n]]);
const provisorio = lista.some(([, f]) => f.origem !== "real");
const commit = git("log", "-1", "--format=%cI %s", SHA);
const version = {
  descricao:
    "O commit do checkout-vtex vendorizado pelo yarn checkout:sync. Não edite: rode o sync. " +
    "`hashes` é o sha256 de CADA arquivo gravado (lib, checkout.json, dist, fixtures, cartões): o estágio " +
    "1-checkout do funil confere a integridade por eles e, com o checkout-vtex ao lado, que cada arquivo é o do SHA.",
  repo: "seriedesign/checkout-vtex",
  sha: SHA,
  commit,
  modelo: MODELO,
  contrato: model.contrato,
  provisorio,
  fixtures: {
    origem: provisorio
      ? `modelos/${MODELO}/fixtures (reais) e, onde faltam, modelos/${MODELO}/captura-crua (provisórias: DOM nativo, sem o nosso JS)`
      : `modelos/${MODELO}/fixtures (reais: DOM com o nosso JS, CSSOM serializado, card.html do cartão)`,
    reais: lista.filter(([, f]) => f.origem === "real").length,
    provisorias: lista.filter(([, f]) => f.origem !== "real").length,
    sha256JsDoDist: shaJsDoDist,
    checkoutUi: [...new Set(lista.map(([, f]) => f.checkoutUi).filter(Boolean))].join(", "),
    viewports: VIEWPORTS,
    etapas: model.etapas.map(e => e.id),
    arquivos: Object.fromEntries(
      lista.map(([n, f]) => [
        n,
        Object.fromEntries(Object.entries(f).filter(([k]) => !["removidos", "reescritos"].includes(k))),
      ])
    ),
  },
  libs,
  hashes: Object.fromEntries([...escritos].sort(([a], [b]) => a.localeCompare(b))),
};
const textoVersion = `${JSON.stringify(version, null, 2)}\n`;

// ── a lista do repo público sobre TUDO o que vai ser gravado (gate0 #29) ─────
// Não só as fixtures: o lib, o checkout.json, o dist, os cartões e o próprio
// VERSION.json (que leva a mensagem do commit) vão para o catálogo público.
// Binário só pelos termos: o padrão do CPF casaria por acaso num PNG.
const sujos = [];
const conferirTermos = (rel, buf) => {
  const binario = /\.(png|jpe?g|gif|webp|woff2?|ico)$/i.test(rel);
  const texto = buf.toString(binario ? "latin1" : "utf8");
  const sobras = binario ? PROIBIDOS.filter(re => new RegExp(re.source, re.flags.replace("g", "")).test(texto)) : sobrasProibidas(texto);
  if (sobras.length) sujos.push({ rel, n: sobras.length, trechos: binario ? [] : (trechosProibidos?.(texto) ?? []) });
};
for (const rel of [...escritos.keys()].sort()) conferirTermos(rel, fs.readFileSync(path.join(PREPARO, rel)));
conferirTermos(path.relative(RAIZ, path.join(DEST_DATA, "VERSION.json")), Buffer.from(textoVersion));
if (sujos.length) {
  for (const { rel, trechos } of sujos) {
    console.error(`   ${rel}`);
    for (const t of trechos.slice(0, 4)) console.error("     ", t);
  }
  falhar(
    `${sujos.length} arquivo(s) com termo da lista do repo público — ${sujos.map(s => `${s.rel} (${s.n})`).join(", ")}. ` +
      "O catálogo é público: nada foi gravado."
  );
}

// ── aplica: só aqui o catálogo é tocado, com todas as travas já passadas ─────
fs.rmSync(DEST_PUBLIC, { recursive: true, force: true });
fs.mkdirSync(DEST_LIB, { recursive: true });
for (const velho of fs.readdirSync(DEST_LIB).filter(n => n.endsWith(".mjs") && !libs.includes(n)))
  fs.rmSync(path.join(DEST_LIB, velho));
for (const rel of escritos.keys()) {
  const destino = path.join(RAIZ, rel);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.copyFileSync(path.join(PREPARO, rel), destino);
}
fs.mkdirSync(DEST_DATA, { recursive: true });
fs.writeFileSync(path.join(DEST_DATA, "VERSION.json"), textoVersion);
const entradasDist = fs.readdirSync(daArvore(`dist/${MODELO}`)).length;
fs.rmSync(TMP, { recursive: true, force: true });

console.log(`✅ checkout-vtex@${SHA.slice(0, 12)} (${commit}) → catálogo`);
console.log(`   lib: ${libs.join(", ")}`);
console.log(`   modelo: src/data/checkout/${MODELO}/checkout.json (contrato ${model.contrato})`);
console.log(`   base: public/gerador/checkout/${MODELO}/ (${entradasDist} entradas do dist)`);
for (const [nome, f] of lista)
  console.log(
    f.origem === "real"
      ? `   fixture REAL ${nome}: ${Math.round(f.bytes / 1024)} kB · js ${f.sha256Js.slice(0, 12)} · checkout-ui ${f.checkoutUi}${f.card ? ` · + ${f.card}` : ""}`
      : `   fixture PROVISÓRIA ${nome}: ${Math.round(f.bytes / 1024)} kB · removidos ${Object.values(f.removidos).reduce((a, b) => a + b, 0)} · reescritos ${Object.values(f.reescritos).reduce((a, b) => a + b, 0)}`
  );
console.log(`   ${escritos.size} arquivos com hash em src/data/checkout/VERSION.json${provisorio ? " · provisorio: true" : " · todas as fixtures reais (provisorio: false)"}`);
console.log(`   lista do repo público: a do SHA, em memória — ${escritos.size + 1} arquivos conferidos, zero termos (nada dela gravado)`);
