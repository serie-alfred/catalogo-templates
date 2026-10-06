/* Checkout01 · montado pelo build/build.mjs a partir de modelos/Checkout01/src/js — não edite o dist à mão */
(function () {
'use strict';
if (window.__etmCheckout) return;
var CONFIG = {"modelo":"Checkout01","contrato":1,"versao":null};
/* ETC:SLOT config */
/* @arquivo core.js */
/*
 * core.js — o núcleo do JS do Checkout01: os ganchos que o resto usa.
 *
 * O build junta todos os src/js/*.js num IIFE só (core.js primeiro, o resto em
 * ordem alfabética), então as funções daqui são locais e visíveis aos outros
 * arquivos. O arquivo roda no <head>, ANTES do vtexjs e com os ~188 templates
 * Knockout já no DOM (medido no S1): nada aqui pode depender de vtexjs no
 * instante em que carrega.
 *
 * Tudo é IDEMPOTENTE, porque a armadilha nº 1 dos 35 projetos que lemos é o
 * ouvinte registrado dentro de outro evento, sem guarda (cada hashchange ou
 * ajaxStop somava mais um handler):
 *   onStep(fn)          fn(etapa, anterior) a cada troca de etapa, e já na hora com a atual;
 *                       a mesma fn registrada duas vezes vale uma
 *   onOrderForm(fn)     fn(orderForm) a cada orderFormUpdated.vtex, e já na hora se houver
 *                       um orderForm; um ouvinte jQuery só, qualquer que seja o número de fns
 *   waitFor(sel, fn, o) fn(el) uma vez, quando `sel` existir; um MutationObserver por
 *                       seletor, desligado ao achar ou no timeout (o.timeout, padrão 10 s)
 *   ready(fn)           fn() no DOMContentLoaded (ou já, se passou)
 *
 * `window.__etmCheckout` guarda o CONFIG (modelo, contrato, versão: o compose
 * preenche) e os ganchos, para depurar no Console. O invólucro do build sai
 * cedo se ele já existir: o arquivo incluído duas vezes roda uma vez só.
 *
 * Nenhuma cor, nenhuma rede, nada no cartão: o JS não entra no iframe do card-ui.
 */
var etapaAtual = null;
var ouvintesEtapa = [];
var ouvintesOrderForm = [];
var orderFormLigado = false;
var esperas = {};

function chamar(fn, a, b) {
  try {
    fn(a, b);
  } catch (erro) {
    if (window.console && window.console.error) window.console.error('[etm-checkout]', erro);
  }
}

function onStep(fn) {
  if (typeof fn !== 'function' || ouvintesEtapa.indexOf(fn) !== -1) return fn;
  ouvintesEtapa.push(fn);
  if (etapaAtual) chamar(fn, etapaAtual, null);
  return fn;
}

function emitirEtapa(nova, anterior) {
  for (var i = 0; i < ouvintesEtapa.length; i++) chamar(ouvintesEtapa[i], nova, anterior);
}

function ligarOrderForm() {
  if (orderFormLigado || !window.jQuery) return;
  orderFormLigado = true;
  window.jQuery(window).on('orderFormUpdated.vtex', function (evento, orderForm) {
    for (var i = 0; i < ouvintesOrderForm.length; i++) chamar(ouvintesOrderForm[i], orderForm);
  });
}

function onOrderForm(fn) {
  if (typeof fn !== 'function' || ouvintesOrderForm.indexOf(fn) !== -1) return fn;
  ouvintesOrderForm.push(fn);
  ligarOrderForm();
  var atual = window.vtexjs && window.vtexjs.checkout && window.vtexjs.checkout.orderForm;
  if (atual) chamar(fn, atual);
  return fn;
}

function ready(fn) {
  if (document.readyState !== 'loading') chamar(fn);
  else document.addEventListener('DOMContentLoaded', function () { chamar(fn); });
}

function waitFor(seletor, fn, opcoes) {
  var limite = opcoes && opcoes.timeout != null ? opcoes.timeout : 10000;
  var achado = document.querySelector(seletor);
  if (achado) {
    chamar(fn, achado);
    return function () {};
  }
  var espera = esperas[seletor];
  if (!espera) {
    espera = esperas[seletor] = { fns: [], observador: null, relogio: null };
    var encerrar = function () {
      if (espera.observador) espera.observador.disconnect();
      if (espera.relogio) clearTimeout(espera.relogio);
      delete esperas[seletor];
    };
    espera.observador = new MutationObserver(function () {
      var el = document.querySelector(seletor);
      if (!el) return;
      var fns = espera.fns.slice();
      encerrar();
      for (var i = 0; i < fns.length; i++) chamar(fns[i], el);
    });
    espera.observador.observe(document.documentElement, { childList: true, subtree: true });
    espera.relogio = setTimeout(encerrar, limite);
  }
  if (espera.fns.indexOf(fn) === -1) espera.fns.push(fn);
  return function () {
    var i = espera.fns.indexOf(fn);
    if (i !== -1) espera.fns.splice(i, 1);
  };
}

ready(ligarOrderForm);

window.__etmCheckout = {
  config: CONFIG,
  onStep: onStep,
  onOrderForm: onOrderForm,
  waitFor: waitFor,
  ready: ready,
  etapa: function () { return etapaAtual; }
};
/* @arquivo carrinho-dom.js */
/*
 * carrinho-dom.js — o "reaplicar" das peças que o JS injeta no carrinho e no
 * resumo (frente B1): tag de desconto, preço "de" do resumo lateral, contagem
 * no título, "Compartilhar carrinho" e "Continuar comprando".
 *
 * O Knockout re-renderiza as linhas do carrinho, os itens e os totais do
 * resumo lateral a cada atualização do orderForm, e o i18n reescreve o texto
 * do #cart-title (levando junto o que estiver dentro). Por isso cada peça é
 * uma função IDEMPOTENTE registrada aqui com reaplicarNoCarrinho(fn), e todas
 * rodam juntas, no máximo uma vez por tarefa:
 *   - a cada orderFormUpdated.vtex e a cada troca de etapa (onOrderForm / onStep);
 *   - a cada mudança de filhos dentro de .checkout-container (um MutationObserver
 *     só, ligado no ready). As mutações que as próprias funções fazem são
 *     descartadas (takeRecords), então uma rodada que já achou tudo no lugar
 *     não agenda outra: o DOM converge.
 * A função recebe o orderForm atual (ou null) e nunca guarda nó nativo entre
 * duas rodadas.
 *
 * O estado mora em var SEM inicializador e é criado na primeira chamada: o
 * build junta os arquivos num IIFE só, em ordem alfabética, e quem registra
 * pode rodar antes deste arquivo inicializar qualquer coisa.
 */
var ck01Aplicadores;
var ck01Observador;
var ck01Agendado;

function orderFormCk01() {
  var co = window.vtexjs && window.vtexjs.checkout;
  return (co && co.orderForm) || null;
}

function reaplicarNoCarrinho(fn) {
  if (!ck01Aplicadores) ck01Aplicadores = [];
  if (typeof fn !== 'function' || ck01Aplicadores.indexOf(fn) !== -1) return fn;
  ck01Aplicadores.push(fn);
  if (ck01Aplicadores.length === 1) {
    onOrderForm(agendarCk01);
    onStep(agendarCk01);
    ready(ligarObservadorCk01);
  }
  agendarCk01();
  return fn;
}

function agendarCk01() {
  if (ck01Agendado) return;
  ck01Agendado = true;
  setTimeout(rodarCk01, 0);
}

function rodarCk01() {
  ck01Agendado = false;
  if (!document.querySelectorAll || !document.createElement) return;
  var of = orderFormCk01();
  var lista = ck01Aplicadores || [];
  for (var i = 0; i < lista.length; i++) chamar(lista[i], of);
  if (ck01Observador) ck01Observador.takeRecords();
}

function ligarObservadorCk01() {
  if (ck01Observador || typeof MutationObserver === 'undefined') return;
  var raiz = document.querySelector('.checkout-container');
  if (!raiz) return;
  ck01Observador = new MutationObserver(agendarCk01);
  ck01Observador.observe(raiz, { childList: true, subtree: true });
  agendarCk01();
}

/** O nó [data-ck01="<peca>"] filho direto de `pai`, criado se faltar (tag, classe e atributos). */
function pecaCk01(pai, peca, tag, classe) {
  var filhos = pai.children || [];
  for (var i = 0; i < filhos.length; i++) {
    if (filhos[i].getAttribute && filhos[i].getAttribute('data-ck01') === peca) return filhos[i];
  }
  var el = document.createElement(tag);
  el.className = classe;
  el.setAttribute('data-ck01', peca);
  return el;
}

/*
 * Escreve o texto só quando o VALOR muda (o último escrito fica em
 * data-ck01-texto): sem mutação à toa, e quem trocou o texto por fora (a
 * normalização da validação, uma extensão de tradução) não é desfeito a cada rodada.
 */
function textoCk01(el, texto) {
  if (el.getAttribute('data-ck01-texto') === texto && el.firstChild) return;
  el.setAttribute('data-ck01-texto', texto);
  el.textContent = texto;
}

/** Remove os [data-ck01="<peca>"] que sobraram dentro de `raiz`. */
function removerCk01(raiz, peca) {
  if (!raiz || !raiz.querySelectorAll) return;
  var achados = raiz.querySelectorAll('[data-ck01="' + peca + '"]');
  for (var i = 0; i < achados.length; i++) achados[i].parentNode.removeChild(achados[i]);
}

/*
 * Moeda no formato do checkout ("R$ 899,90"), a partir de centavos e do
 * storePreferencesData do orderForm (símbolo, casas, separadores). Sem ele,
 * o padrão brasileiro.
 */
function moedaCk01(centavos, of) {
  var pref = (of && of.storePreferencesData) || {};
  var fmt = pref.currencyFormatInfo || {};
  var casas = fmt.currencyDecimalDigits != null ? Number(fmt.currencyDecimalDigits) : 2;
  var decimal = fmt.currencyDecimalSeparator || ',';
  var grupo = fmt.currencyGroupSeparator != null ? fmt.currencyGroupSeparator : '.';
  var tamanho = Number(fmt.currencyGroupSize) || 3;
  var simbolo = pref.currencySymbol || 'R$';
  var partes = ((Number(centavos) || 0) / 100).toFixed(casas).split('.');
  var inteiro = partes[0].replace(new RegExp('\\B(?=(\\d{' + tamanho + '})+(?!\\d))', 'g'), grupo);
  var numero = casas > 0 ? inteiro + decimal + partes[1] : inteiro;
  return fmt.startsWithCurrencySymbol === false ? numero + ' ' + simbolo : simbolo + ' ' + numero;
}

/*
 * Casa as linhas do DOM (que só dizem o SKU, em data-sku) com os itens do
 * orderForm: o mesmo SKU pode aparecer em mais de um item (vendedor, anexo),
 * então cada linha consome o próximo item daquele SKU, na ordem.
 */
function itensPorSkuCk01(of) {
  var mapa = {};
  var itens = (of && of.items) || [];
  for (var i = 0; i < itens.length; i++) {
    var it = itens[i];
    if (!it || it.id == null) continue;
    var id = String(it.id);
    (mapa[id] = mapa[id] || []).push(it);
  }
  return {
    proximo: function (sku) {
      var fila = mapa[String(sku)];
      return fila && fila.length ? fila.shift() : null;
    }
  };
}
/* @arquivo compartilhar.js */
/*
 * compartilhar.js — "Compartilhar carrinho" e as ações do resumo lateral (frente B1).
 *
 *   carrinho   <button class="ck01-compartilhar" data-ck01="compartilhar"> como último filho
 *              de .cart-template.full-cart .cart-links-bottom, irmão dos CTAs nativos
 *              (#cart-to-orderform, #cart-choose-more-products): a ordem visual é CSS.
 *   ETP2–4     <div class="ck01-acoes" data-ck01="acoes"> como último filho de
 *              .cart-fixed .summary-template-holder, com o botão e um
 *              <a class="ck01-continuar" data-ck01="continuar"> "Continuar comprando",
 *              que leva para onde o #cart-choose-more-products nativo leva (a loja).
 *
 * O botão copia location.origin + '/checkout?orderFormId=<id>#/cart' (o link
 * que reabre este carrinho em outro navegador) e troca o rótulo por "Link
 * copiado" por uns segundos. Sem Clipboard API (http, navegador antigo), cai
 * no execCommand('copy'); se nem isso der, mostra o link num prompt para
 * copiar à mão. Nenhuma rede: o id vem do orderForm que a página já tem.
 * Textos por textoI18n('ck01.*') — as chaves estão no i18n.js e no i18n-carrinho.js.
 * Contorno cinza nos dois tamanhos (gate0 #2): é CSS.
 */
var ck01CopiaRelogio;

function urlDoCarrinhoCk01() {
  var of = orderFormCk01();
  var co = window.vtexjs && window.vtexjs.checkout;
  var id = (of && of.orderFormId) || (co && co.orderFormId);
  if (!id) return null;
  return window.location.origin + '/checkout?orderFormId=' + encodeURIComponent(id) + '#/cart';
}

function copiarLegadoCk01(texto) {
  var area = document.createElement('textarea');
  area.value = texto;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.top = '0';
  area.style.left = '-9999px';
  document.body.appendChild(area);
  area.select();
  var ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (erro) {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

function copiarCk01(texto, pronto) {
  var nav = window.navigator;
  if (nav && nav.clipboard && typeof nav.clipboard.writeText === 'function') {
    nav.clipboard.writeText(texto).then(
      function () { pronto(true); },
      function () { pronto(copiarLegadoCk01(texto)); }
    );
    return;
  }
  pronto(copiarLegadoCk01(texto));
}

function rotularCompartilhar(botao) {
  textoCk01(botao, textoI18n('ck01.compartilhar') || 'Compartilhar carrinho');
}

function aoCompartilhar(evento) {
  var botao = evento.currentTarget;
  var url = urlDoCarrinhoCk01();
  if (!url) return;
  copiarCk01(url, function (ok) {
    if (!ok) {
      window.prompt(textoI18n('ck01.compartilharManual') || 'Copie o link do carrinho:', url);
      return;
    }
    textoCk01(botao, textoI18n('ck01.compartilhado') || 'Link copiado');
    botao.setAttribute('data-ck01-copiado', '');
    clearTimeout(ck01CopiaRelogio);
    ck01CopiaRelogio = setTimeout(function () {
      var atuais = document.querySelectorAll('[data-ck01="compartilhar"]');
      for (var i = 0; i < atuais.length; i++) {
        atuais[i].removeAttribute('data-ck01-copiado');
        rotularCompartilhar(atuais[i]);
      }
    }, 2500);
  });
}

function botaoCompartilhar(pai) {
  var botao = pecaCk01(pai, 'compartilhar', 'button', 'ck01-compartilhar');
  if (!botao.getAttribute('type')) {
    botao.setAttribute('type', 'button');
    botao.addEventListener('click', aoCompartilhar);
  }
  if (!botao.hasAttribute('data-ck01-copiado')) rotularCompartilhar(botao);
  return botao;
}

function aplicarCompartilharCarrinho() {
  var links = document.querySelector('.cart-template.full-cart .cart-links-bottom');
  if (!links) return;
  var botao = botaoCompartilhar(links);
  if (botao.parentNode !== links || botao.nextSibling) links.appendChild(botao);
}

function aplicarAcoesResumo() {
  var holder = document.querySelector('.cart-fixed .summary-template-holder');
  if (!holder) return;
  var acoes = pecaCk01(holder, 'acoes', 'div', 'ck01-acoes');
  var botao = botaoCompartilhar(acoes);
  if (botao.parentNode !== acoes) acoes.appendChild(botao);
  var continuar = pecaCk01(acoes, 'continuar', 'a', 'ck01-continuar');
  var nativo = document.querySelector('#cart-choose-more-products');
  var href = (nativo && nativo.getAttribute('href')) || '/';
  if (continuar.getAttribute('href') !== href) continuar.setAttribute('href', href);
  textoCk01(continuar, textoI18n('ck01.continuar') || 'Continuar comprando');
  if (continuar.parentNode !== acoes || continuar.previousSibling !== botao) acoes.insertBefore(continuar, botao.nextSibling);
  if (acoes.parentNode !== holder || acoes.nextSibling) holder.appendChild(acoes);
}

reaplicarNoCarrinho(aplicarCompartilharCarrinho);
reaplicarNoCarrinho(aplicarAcoesResumo);
/* @arquivo contagem.js */
/*
 * contagem.js — a contagem "(NN)" do título do carrinho (frente B1).
 *
 *   #cart-title  "Resumo do pedido" (i18n shoppingCart) + <span class="ck01-contagem"
 *                data-ck01="contagem"> (NN)</span> como último filho
 *
 * NN = soma das quantidades dos itens do orderForm, com zero à esquerda até
 * dois dígitos (o Figma escreve "(05)"). O i18n reescreve o texto do título
 * (e leva o span junto): o reaplicar do carrinho-dom.js o põe de volta.
 */
function aplicarContagem(of) {
  var titulo = document.querySelector('#cart-title');
  if (!titulo) return;
  var itens = (of && of.items) || [];
  var total = 0;
  for (var i = 0; i < itens.length; i++) total += Number(itens[i] && itens[i].quantity) || 0;
  if (!total) {
    removerCk01(titulo, 'contagem');
    return;
  }
  var span = pecaCk01(titulo, 'contagem', 'span', 'ck01-contagem');
  textoCk01(span, ' (' + (total < 10 ? '0' : '') + total + ')');
  if (span.parentNode !== titulo || span.nextSibling) titulo.appendChild(span);
}

reaplicarNoCarrinho(aplicarContagem);
/* @arquivo entrega-aguardando.js */
/*
 * entrega-aguardando.js — gate0 #15: a caixa fechada "2. Entrega" do e-mail e
 * do perfil diz "Aguardando o preenchimento dos dados", como o Figma da ETP2.
 * Com o frete calculado, o omnishipping troca o texto nativo pelo resumo da
 * retirada; ele volta como nó nosso (texto do vtex.i18n, global.waiting):
 *
 *   <p class="ck01-aguardando" data-ck01="aguardando">…</p>
 *
 * último filho do #shipping-data, só em #/email e #/profile e só sem
 * html.ck01-entrega-visitada (gate0 #22). O 41-perfil.css esconde o nativo da
 * caixa quando o nó existe (:has()): sem JS, fica o nativo.
 *
 * Roda pelo reaplicarNoCarrinho (carrinho-dom.js) e, no microtask, pelo
 * observador da própria caixa: o Knockout refaz os filhos do #shipping-data
 * depois do 1º orderForm e o resumo aparecia ~0,5 s (medido, 25/09).
 */
var ck01CaixaObservada;

function aplicarAguardandoEntrega() {
  if (!document.querySelector) return;
  var caixa = document.querySelector('#shipping-data');
  if (!caixa) return;
  if (ck01CaixaObservada !== caixa && typeof MutationObserver !== 'undefined') {
    ck01CaixaObservada = caixa;
    new MutationObserver(aplicarAguardandoEntrega).observe(caixa, { childList: true });
  }
  if ((etapaAtual !== 'email' && etapaAtual !== 'perfil') || entregaVisitada()) {
    removerCk01(caixa, 'aguardando');
    return;
  }
  var texto = pecaCk01(caixa, 'aguardando', 'p', 'ck01-aguardando');
  textoCk01(texto, textoI18n('global.waiting') || 'Aguardando o preenchimento dos dados');
  if (texto.parentNode !== caixa || texto.nextSibling) caixa.appendChild(texto);
}

reaplicarNoCarrinho(aplicarAguardandoEntrega);
/* @arquivo entrega-visitada.js */
/*
 * entrega-visitada.js — gate0 #22: o "Aguardando" (#15) só vale até o
 * comprador chegar à entrega nesta compra.
 *   html.ck01-entrega-visitada  passou por #/shipping ou #/payment com este orderForm
 *   html.ck01-entrega-pendente  aba nova, o palpite diz visitada: a caixa não mostra nada
 * Com a 1ª, e-mail e perfil mostram o resumo nativo e o "Editar" (41-perfil.css).
 *
 * Marca por orderFormId no localStorage (ck01-entregas-visitadas, os 10
 * últimos); troca de id na mesma página: a marca acompanha. O cookie do
 * orderForm é HttpOnly e o único que muda num carrinho novo (medido): o
 * palpite do <head> (?orderFormId= ou ck01-ultimo-orderform) só segura a
 * caixa; o 1º orderForm decide, e ela se solta na mesma tarefa, com o
 * "Aguardando" (ou o resumo) já no lugar. Estado em var sem inicializador.
 */
var ck01EntregaVisitadaEm; // id da compra que chegou à entrega; true = pendente (sem orderForm)
var ck01OrderFormAtual; // o último id que um orderForm confirmou

function chaveEntregasVisitadas() {
  return 'ck01-entregas-visitadas';
}

function chaveUltimoOrderForm() {
  return 'ck01-ultimo-orderform';
}

/** A lista (vazia se faltar, estiver estragada ou o storage lançar). */
function lerEntregasVisitadas() {
  try {
    var bruto = window.localStorage.getItem(chaveEntregasVisitadas());
    var lista = bruto ? JSON.parse(bruto) : [];
    return Object.prototype.toString.call(lista) === '[object Array]' ? lista : [];
  } catch (erro) {
    return [];
  }
}

function entregaVisitadaNoStorage(id) {
  var lista = lerEntregasVisitadas();
  for (var i = 0; i < lista.length; i++) if (lista[i] === id) return true;
  return false;
}

/** Põe `id` no fim da lista (sem repetir) e guarda só os 10 últimos. */
function gravarEntregaVisitada(id) {
  try {
    var lista = lerEntregasVisitadas();
    var nova = [];
    for (var i = 0; i < lista.length; i++) if (typeof lista[i] === 'string' && lista[i] !== id) nova.push(lista[i]);
    nova.push(id);
    if (nova.length > 10) nova = nova.slice(nova.length - 10);
    window.localStorage.setItem(chaveEntregasVisitadas(), JSON.stringify(nova));
  } catch (erro) {
    /* storage bloqueado: só na memória */
  }
}

/** O palpite do <head>: o ?orderFormId= da URL ou o último id visto. */
function palpiteDeOrderForm() {
  var busca = (window.location && window.location.search) || '';
  var m = /[?&]orderFormId=([0-9a-zA-Z]+)/.exec(busca);
  if (m) return m[1];
  try {
    return window.localStorage.getItem(chaveUltimoOrderForm()) || null;
  } catch (erro) {
    return null;
  }
}

function lembrarOrderForm(id) {
  try {
    window.localStorage.setItem(chaveUltimoOrderForm(), id);
  } catch (erro) {
    /* storage bloqueado: sem palpite */
  }
}

function entregaVisitada() {
  return document.documentElement.classList.contains('ck01-entrega-visitada');
}

function marcarClasse(classe, ligar) {
  var lista = document.documentElement.classList;
  if (ligar === lista.contains(classe)) return false;
  if (ligar) lista.add(classe);
  else lista.remove(classe);
  return true;
}

function marcarEntregaVisitada(ligar) {
  // a caixa troca o "Aguardando" pelo resumo (ou o contrário)
  if (marcarClasse('ck01-entrega-visitada', ligar)) agendarCk01();
  // decidido: a caixa só se solta com o "Aguardando" (ou sem ele) já no lugar
  if (marcarClasse('ck01-entrega-pendente', false)) aplicarAguardandoEntrega();
}

onStep(function (etapa) {
  if (etapa !== 'entrega' && etapa !== 'pagamento') return;
  ck01EntregaVisitadaEm = ck01OrderFormAtual || true;
  if (ck01OrderFormAtual) gravarEntregaVisitada(ck01OrderFormAtual);
  marcarEntregaVisitada(true);
});

onOrderForm(function (of) {
  var id = of && of.orderFormId;
  if (!id || id === ck01OrderFormAtual) return;
  var anterior = ck01OrderFormAtual;
  ck01OrderFormAtual = id;
  lembrarOrderForm(id);
  // pendente, ou troca de id na mesma compra: a marca acompanha
  if (ck01EntregaVisitadaEm === true || (anterior && ck01EntregaVisitadaEm === anterior)) {
    ck01EntregaVisitadaEm = id;
    gravarEntregaVisitada(id);
    marcarEntregaVisitada(true);
    return;
  }
  var naEntrega = etapaAtual === 'entrega' || etapaAtual === 'pagamento';
  var visitada = entregaVisitadaNoStorage(id) || naEntrega;
  if (naEntrega) gravarEntregaVisitada(id);
  ck01EntregaVisitadaEm = visitada ? id : undefined;
  marcarEntregaVisitada(visitada);
});

// A aba nova segura a caixa no <head>, pelo palpite.
var ck01Palpite = palpiteDeOrderForm();
if (ck01Palpite && entregaVisitadaNoStorage(ck01Palpite)) marcarClasse('ck01-entrega-pendente', true);
/* @arquivo etapa.js */
/*
 * etapa.js — grava a etapa no <html> já no <head>, a partir do hash.
 *
 *   html.ck01-step-<etapa>   carrinho | email | perfil | entrega | pagamento
 *   html.ck01-passo-<passo>  carrinho | identificacao | pagamento  (o passo do stepper, gate0 #1)
 *
 * Roda antes do primeiro paint (o arquivo é um <script> bloqueante no <head>),
 * então o stepper e o grid por etapa não piscam. Hash vazio é o carrinho (o
 * router nativo vai para lá); hash desconhecido tira as duas classes.
 *
 * O mapa espelha checkout.json › etapas: o teste do build roda este arquivo e
 * confere cada hash do modelo. As áreas da grade por etapa (10-base.css) e o
 * passo aceso do stepper (21-stepper.css) dependem só destas duas classes.
 *
 * Fora do checkout.json, um hash TRANSITÓRIO: #/orderform é o href do "Seguir
 * com o pedido" (#cart-to-orderform); o router nativo passa por ele antes de
 * decidir a etapa (#/email na primeira vez; #/profile, #/shipping ou #/payment
 * se os dados já existem). Sem ele no mapa, a página ficava um instante sem
 * classe nenhuma: a grade do orderform sem as áreas da etapa e o stepper sem
 * passo aceso. Vale o e-mail, o primeiro passo do orderform e o que aparece
 * na maioria das vezes; o passo (Identificação) já é o certo.
 */
var ETAPA_DO_HASH = {
  '#/cart': 'carrinho',
  '#/orderform': 'email',
  '#/email': 'email',
  '#/profile': 'perfil',
  '#/shipping': 'entrega',
  '#/payment': 'pagamento'
};
var PASSO_DA_ETAPA = {
  carrinho: 'carrinho',
  email: 'identificacao',
  perfil: 'identificacao',
  entrega: 'identificacao',
  pagamento: 'pagamento'
};

function etapaDoHash(hash) {
  var h = (hash || '').split('?')[0];
  if (h === '' || h === '#' || h === '#/') return 'carrinho';
  return Object.prototype.hasOwnProperty.call(ETAPA_DO_HASH, h) ? ETAPA_DO_HASH[h] : null;
}

function aplicarEtapa() {
  var nova = etapaDoHash(window.location.hash);
  if (nova === etapaAtual) return;
  var lista = document.documentElement.classList;
  var atuais = Array.prototype.slice.call(lista);
  for (var i = 0; i < atuais.length; i++) {
    if (atuais[i].indexOf('ck01-step-') === 0 || atuais[i].indexOf('ck01-passo-') === 0) lista.remove(atuais[i]);
  }
  if (nova) {
    lista.add('ck01-step-' + nova);
    lista.add('ck01-passo-' + PASSO_DA_ETAPA[nova]);
  }
  var anterior = etapaAtual;
  etapaAtual = nova;
  emitirEtapa(nova, anterior);
}

/*
 * O passo aceso também para leitor de tela: aria-current="step" no <li> do
 * stepper (o header é template, só existe depois do parse: por isso no ready).
 * A cor e o negrito são CSS (21-stepper.css, por html.ck01-passo-*).
 */
function marcarPassoAtual(etapa) {
  if (!document.querySelectorAll) return;
  var passo = etapa ? PASSO_DA_ETAPA[etapa] : null;
  var itens = document.querySelectorAll('.etm-stepper__passo[data-passo]');
  for (var i = 0; i < itens.length; i++) {
    if (itens[i].getAttribute('data-passo') === passo) itens[i].setAttribute('aria-current', 'step');
    else itens[i].removeAttribute('aria-current');
  }
}

aplicarEtapa();
window.addEventListener('hashchange', aplicarEtapa);
ready(function () { onStep(marcarPassoAtual); });
/* @arquivo i18n-carrinho.js */
/*
 * i18n-carrinho.js — os textos da frente B1 (carrinho e resumo), somados ao
 * dicionário do i18n.js pelo textos(): o título "Resumo do pedido", os CTAs
 * nativos e "Compartilhar carrinho"/"Continuar comprando" já estão lá; aqui
 * ficam só os que as peças injetadas usam a mais.
 *
 *   ck01.compartilhado        rótulo do botão por uns segundos, depois de copiar o link
 *   ck01.compartilharManual   o prompt quando o navegador não deixa copiar
 *
 * Só pt-BR, como o i18n.js.
 */
textos('ck01', {
  compartilhado: 'Link copiado',
  compartilharManual: 'Copie o link do carrinho:'
});
/* @arquivo i18n-entrega.js */
/*
 * i18n-entrega.js — os textos do Figma na ETP3 (#/shipping), frente B3.
 *
 * Só os nós do Knockout leem o vtex.i18n (medido na sonda de 25/09: o dicionário
 * pt-BR tem 1.143 chaves e nenhuma do omnishipping, do address-form nem do modal de
 * pontos — essas ilhas React trazem o próprio react-intl). Por isso aqui entram só os
 * títulos e textos das caixas que o checkout desenha:
 *
 *   clientProfileData.identification  "1. DADOS PESSOAIS"  (o "1." e a caixa alta são CSS)
 *   paymentData.payment               "3. PAGAMENTO"       (o nativo é "Pagamento ", com espaço)
 *   global.waiting                    "Aguardando o preenchimento dos dados"
 *
 * "Ir para o pagamento" é do omnishipping (React): o texto nativo já é o do Figma, e o
 * global.goToPayment do i18n.js cobre o botão do Knockout quando o omnishipping não
 * está. "Editar" (global.edit) e o "2. ENTREGA" (nó de texto sem data-i18n) idem.
 *
 * Os rótulos do formulário de endereço do Figma (CEP, Rua, Número, Complemento,
 * Referência, Destinatário) são do address-form (React) e não passam por aqui; o
 * formulário não foi visto ao vivo (a conta só tem retirada).
 */
textos({
  clientProfileData: { identification: 'Dados pessoais' },
  paymentData: { payment: 'Pagamento' },
  global: { waiting: 'Aguardando o preenchimento dos dados' }
});
/* @arquivo i18n-identificacao.js */
/*
 * i18n-identificacao.js — os textos do e-mail e dos dados pessoais (frente B2),
 * pelo dicionário do próprio checkout (textos() do i18n.js).
 *
 * O build junta os arquivos em ordem alfabética, e este vem ANTES do i18n.js:
 * textos() é function (içada) e só mexe em var sem inicializador ou que o
 * i18n.js reinicializa com o mesmo valor, então pode ser chamada aqui.
 *
 * Os que já estão no i18n.js (frente Base) não se repetem: E-mail
 * (clientProfileData.preemail), Nome, Sobrenome, "Ir para a entrega".
 */
textos({
  global: {
    // Figma: sem o ponto final do nativo ("…com promoções.").
    optinNewsLetter: 'Quero receber e-mails com promoções'
  },
  clientProfileData: {
    // Link de pessoa jurídica (gate0 #3): sobe para a linha do título "1. Dados
    // pessoais" (41-perfil.css), onde cabe um rótulo curto nos dois tamanhos.
    includeCo: 'Sou pessoa jurídica'
  }
});
/* @arquivo i18n-pagamento.js */
/*
 * i18n-pagamento.js — os textos do Figma na ETP4 (#/payment), frente D1.
 *
 * Os títulos das três caixas e o botão final já saem do dicionário (i18n.js e
 * i18n-entrega.js: "Dados pessoais", "Pagamento", paymentData.confirm =
 * "Finalizar pedido"). Falta um, que o vtex.i18n.init() não alcança:
 *
 *   #edit-shipping-data   o "Editar" da caixa "2. Entrega" (Figma Frame 42307)
 *                         (e o tabindex dele, no fim deste arquivo)
 *
 * O link é do omnishipping (React) e traz data-i18n="[title]global.edit", mas a
 * ilha monta DEPOIS do init e fica com o title nativo ("alterar"). O rótulo do
 * botão é esse title (content: attr(title), no 60-pagamento.css), como no
 * "Editar" dos dados pessoais, que o Knockout traduz. Aqui cada atributo pedido
 * por data-i18n="[attr]chave" dentro do #shipping-data recebe o texto do
 * dicionário (global.edit = "Editar", i18n.js) — só ATRIBUTO: o React não
 * compara atributo com o DOM ao re-renderizar, e texto de nó do React não se
 * mexe (quebraria a reconciliação).
 *
 * Roda pelo reaplicarNoCarrinho (carrinho-dom.js): a cada orderForm, troca de
 * etapa e mudança no DOM (a ilha que remonta volta a receber o texto). Só grava
 * quando o valor muda, então não gera mutação à toa.
 *
 * O formulário do cartão NÃO passa por aqui: o card-ui é outro documento, com
 * i18n próprio, e o JS do modelo não entra no iframe ("Código de segurança" e
 * "Parcelamentos disponíveis:" ficam os do card-ui; ver 61-cartao.css).
 */
function aplicarTextosPagamento() {
  if (!document.querySelectorAll) return;
  var alvos = document.querySelectorAll('#shipping-data [data-i18n*="["]');
  for (var i = 0; i < alvos.length; i++) {
    var pedidos = String(alvos[i].getAttribute('data-i18n') || '').split(';');
    for (var j = 0; j < pedidos.length; j++) {
      var m = /^\s*\[([\w-]+)\]\s*(\S+)\s*$/.exec(pedidos[j]);
      if (!m) continue;
      var texto = textoI18n(m[2]);
      if (texto && alvos[i].getAttribute(m[1]) !== texto) alvos[i].setAttribute(m[1], texto);
    }
  }
}

reaplicarNoCarrinho(aplicarTextosPagamento);

/*
 * Teclado (verificação da frente D1, 25/09): o 60-pagamento.css esconde o "Alterar opções de
 * entrega" (#open-shipping), que era o ÚNICO link da caixa "2. Entrega" na ordem de tabulação: o
 * #edit-shipping-data nativo vem com tabindex="-1" e o título é um <span>. Sem isto, quem usa
 * teclado não volta à entrega pela caixa. Só o atributo, só nesse link (o Knockout liga nele
 * visible e title, não tabindex; escondido, ele não recebe foco). O "Editar" dos dados pessoais
 * fica como o nativo (tabindex="-1" também, sem alternativa desde sempre).
 */
function editarEntregaNoTeclado() {
  if (!document.querySelector) return;
  var el = document.querySelector('#shipping-data #edit-shipping-data[tabindex="-1"]');
  if (el) el.setAttribute('tabindex', '0');
}

reaplicarNoCarrinho(editarEntregaNoTeclado);
/* @arquivo i18n.js */
/*
 * i18n.js — os textos do Figma nos nós NATIVOS, pelo dicionário do próprio checkout.
 *
 *   vtex.i18n['pt-BR'].<ns>.<chave> = '…'  +  vtex.i18n.init()
 *
 * Medido (docs/ecossistema-checkout-vtex.md §1.6): o texto sobrevive ao
 * re-render do Knockout, porque os templates traduzem [data-i18n] pelo mesmo
 * dicionário. Nada de font-size: 0 + ::after { content }: o leitor de tela lê o
 * texto certo.
 *
 * Quando: no DOMContentLoaded os scripts do checkout (fim do <body>) já rodaram
 * e o vtex.i18n existe; se ainda não existir, a primeira orderFormUpdated.vtex
 * tenta de novo. Uma vez aplicado, não repete a cada evento.
 *
 * Os textos abaixo são os títulos e botões comuns (e os rótulos que a
 * viabilidade marcou como css+i18n). Outro arquivo do modelo acrescenta os seus
 * com textos('<ns>', { chave: '…' }) — pode chamar antes ou depois deste
 * arquivo rodar (o build junta tudo num IIFE; function é içada, var não, por
 * isso nada aqui depende de var inicializada no carregamento). O namespace ck01
 * é nosso: os nós que o JS injeta usam data-i18n="ck01.<chave>" ou
 * textoI18n('ck01.<chave>').
 *
 * Só pt-BR: o modelo é desenhado em português. Em outra língua o dicionário da
 * VTEX fica como está.
 *
 * Rótulo único nos dois tamanhos (gate0 #7 e #12, viabilidade › inviaveis): o
 * Figma muda o texto por viewport no mesmo nó — cart.finalize ("Seguir com o
 * pedido" no desktop × "Finalizar compra" no celular) e paymentData.confirm
 * ("Finalizar pedido" × "Finalizar compra"). Um texto só por chave, o do
 * desktop (#12):
 *   cart.finalize        "Seguir com o pedido"  #cart-to-orderform
 *   paymentData.confirm  "Finalizar pedido"     #payment-data-submit (e os outros
 *                                               botões de confirmar do pagamento)
 *   global.continue_     "Continuar"            #btn-client-pre-email (é o nativo;
 *                                               fica escrito para não depender dele)
 */
var LOCALE_I18N = 'pt-BR';
var textosI18n;
var i18nAplicado = false;
var i18nLigado = false;

function textosDoFigma() {
  return {
    shoppingCart: 'Resumo do pedido',
    totalizers: {
      summary: 'Informações',
      Discounts: 'Desconto'
    },
    cart: {
      finalize: 'Seguir com o pedido',
      chooseMoreProducts: 'Continuar comprando'
    },
    global: {
      continue_: 'Continuar',
      goToShipping: 'Ir para a entrega',
      goToPayment: 'Ir para o pagamento',
      edit: 'Editar'
    },
    paymentData: {
      confirm: 'Finalizar pedido'
    },
    clientProfileData: {
      preemail: 'E-mail',
      firstName: 'Nome',
      lastName: 'Sobrenome'
    },
    ck01: {
      compartilhar: 'Compartilhar carrinho',
      continuar: 'Continuar comprando'
    }
  };
}

function mesclarI18n(alvo, fonte) {
  for (var k in fonte) {
    if (!Object.prototype.hasOwnProperty.call(fonte, k)) continue;
    var v = fonte[k];
    if (v && typeof v === 'object') {
      if (!alvo[k] || typeof alvo[k] !== 'object') alvo[k] = {};
      mesclarI18n(alvo[k], v);
    } else {
      alvo[k] = v;
    }
  }
  return alvo;
}

function mapaI18n() {
  if (!textosI18n) textosI18n = mesclarI18n({}, textosDoFigma());
  return textosI18n;
}

/** Acrescenta textos: textos('cart', { finalize: '…' }) ou textos({ cart: { … } }). */
function textos(ns, mapa) {
  var novo = {};
  if (typeof ns === 'string') novo[ns] = mapa;
  else novo = ns;
  mesclarI18n(mapaI18n(), novo);
  if (i18nAplicado) aplicarI18n();
}

/** O texto de 'ns.chave' (o nosso, ou o da VTEX quando não sobrescrevemos). */
function textoI18n(caminho) {
  var partes = String(caminho).split('.');
  var bases = [mapaI18n()];
  var dic = window.vtex && window.vtex.i18n && window.vtex.i18n[LOCALE_I18N];
  if (dic) bases.push(dic);
  for (var b = 0; b < bases.length; b++) {
    var no = bases[b];
    for (var i = 0; i < partes.length && no != null; i++) no = no[partes[i]];
    if (typeof no === 'string') return no;
  }
  return '';
}

function aplicarI18n() {
  var i18n = window.vtex && window.vtex.i18n;
  var dic = i18n && i18n[LOCALE_I18N];
  if (!dic || typeof dic !== 'object') return false;
  mesclarI18n(dic, mapaI18n());
  if (typeof i18n.init === 'function') i18n.init();
  i18nAplicado = true;
  return true;
}

function tentarI18n() {
  if (!i18nAplicado) aplicarI18n();
}

function ligarI18n() {
  if (i18nLigado) return;
  i18nLigado = true;
  ready(tentarI18n);
  onOrderForm(tentarI18n);
}

ligarI18n();
window.__etmCheckout.textos = textos;
window.__etmCheckout.textoI18n = textoI18n;
/* @arquivo tag-desconto.js */
/*
 * tag-desconto.js — a tag "NN%" e o preço "de" do resumo lateral (frente B1).
 *
 *   .ck01-tag      <span data-ck01="tag">      NN% = round((listPrice − sellingPrice) / listPrice × 100)
 *                  carrinho: em tr.product-item td.product-price, logo depois do
 *                  del.old-product-price (dentro de .list-price);
 *                  resumo lateral (ETP2–4): em li.hproduct .description, ao lado do preço "de".
 *                  Um papel só de cor: --ck01-tag-bg / --ck01-tag-text (gate0 #2).
 *   .ck01-preco-de <span data-ck01="preco-de"> o listPrice UNITÁRIO, no formato do checkout,
 *                  antes do strong.price do resumo lateral (o mini-cart nativo só tem
 *                  o preço de venda). Unitário porque o strong.price nativo é o
 *                  sellingPriceLabel, unitário — como o de/por da linha do carrinho.
 *
 * Sem desconto (listPrice ≤ sellingPrice, ou o arredondamento dá 0%) as duas
 * somem. A tag é decorativa (aria-hidden): o desconto já está no de/por.
 * Os números vêm do orderForm (orderFormUpdated.vtex), nunca do texto da tela.
 */
function pctDescontoCk01(item) {
  var de = Number(item && item.listPrice);
  var por = Number(item && item.sellingPrice);
  if (!(de > 0) || !(por >= 0) || por >= de) return 0;
  return Math.round(((de - por) / de) * 100);
}

function tagCk01(pai, depoisDe, pct) {
  var tag = pecaCk01(pai, 'tag', 'span', 'ck01-tag');
  tag.setAttribute('aria-hidden', 'true');
  textoCk01(tag, pct + '%');
  if (tag.parentNode !== pai || tag.previousSibling !== depoisDe) pai.insertBefore(tag, depoisDe.nextSibling);
  return tag;
}

function aplicarTagsCarrinho(of) {
  var linhas = document.querySelectorAll('#cartLoadedDiv table.cart-items tr.product-item');
  if (!linhas.length) return;
  var itens = itensPorSkuCk01(of);
  for (var i = 0; i < linhas.length; i++) {
    var linha = linhas[i];
    var item = itens.proximo(linha.getAttribute('data-sku'));
    var celula = linha.querySelector('td.product-price');
    if (!celula) continue;
    var de = celula.querySelector('.old-product-price');
    var pct = item ? pctDescontoCk01(item) : 0;
    if (!pct || !de || !de.parentNode) {
      removerCk01(celula, 'tag');
      continue;
    }
    tagCk01(de.parentNode, de, pct);
  }
}

function aplicarTagsResumo(of) {
  var itensLi = document.querySelectorAll('.cart-fixed .summary-cart-template-holder li.hproduct');
  if (!itensLi.length) return;
  var itens = itensPorSkuCk01(of);
  for (var i = 0; i < itensLi.length; i++) {
    var li = itensLi[i];
    var item = itens.proximo(li.getAttribute('data-sku'));
    var desc = li.querySelector('.description');
    if (!desc) continue;
    var pct = item ? pctDescontoCk01(item) : 0;
    if (!pct) {
      removerCk01(desc, 'preco-de');
      removerCk01(desc, 'tag');
      continue;
    }
    var preco = desc.querySelector('.price');
    var precoDe = pecaCk01(desc, 'preco-de', 'span', 'ck01-preco-de');
    textoCk01(precoDe, moedaCk01(item.listPrice, of));
    var tag = pecaCk01(desc, 'tag', 'span', 'ck01-tag');
    tag.setAttribute('aria-hidden', 'true');
    textoCk01(tag, pct + '%');
    // ordem: preço "de" · tag · preço "por" (o CSS posiciona pela grade; o DOM segue a leitura)
    var antes = preco && preco.parentNode === desc ? preco : null;
    if (precoDe.parentNode !== desc || precoDe.nextSibling !== tag || tag.nextSibling !== antes) {
      desc.insertBefore(precoDe, antes);
      desc.insertBefore(tag, antes);
    }
  }
}

reaplicarNoCarrinho(aplicarTagsCarrinho);
reaplicarNoCarrinho(aplicarTagsResumo);
})();
/* ETC:SLOT integracoes */
