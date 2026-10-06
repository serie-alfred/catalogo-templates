'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { CaixaDoFrame } from '@/hooks/useCanvasZoom';
import { loadGoogleFont } from '@/utils/googleFont';
import {
  PESOS_CHECKOUT,
  carregarBase,
  comporCheckout,
  familiaDoCheckout,
  logoRecusado,
  rodapeDeExemplo,
  tokensDoCheckout,
  urlDaFixture,
  type BaseDoModelo,
  type CheckoutEtapa,
} from '@/utils/checkout';

import styles from './index.module.css';

export interface CheckoutFrameProps {
  etapa: CheckoutEtapa;
  mobile: boolean;
  /** `faststore.variables`: as cores e fontes globais da loja (nível 2). */
  level2: Record<string, string>;
  /** `faststore.checkout.variables`: os papéis do checkout (nível 1). */
  level1: Record<string, string>;
  /** O logo já reduzido para o header. Vazio: o logo de exemplo do Figma. */
  logo: string;
  /**
   * A redução do logo ainda não voltou: o header mostra o anterior, então o
   * frame não se declara pronto (`data-pronto`) até ela chegar.
   */
  logoPendente?: boolean;
  /**
   * No editor, a caixa do `useCanvasZoom` (largura lógica fixa + escala). Sem
   * ela (o /p), o iframe ocupa o contêiner.
   */
  caixa?: CaixaDoFrame;
  /** Cmd/Ctrl+Z e Y com o foco DENTRO do iframe — o documento é outro. */
  onAtalho?: (acao: 'undo' | 'redo') => void;
  /**
   * Clique num botão que, no checkout de verdade, leva a outra etapa ("Seguir com o
   * pedido", "Ir para a entrega", "Editar"…): o preview troca de fixture. Sem ele, o
   * clique só morre, como qualquer outro.
   */
  onNavegar?: (etapa: CheckoutEtapa) => void;
}

/**
 * Botão nativo → a etapa a que ele leva no checkout. O clique continua bloqueado
 * (a fixture não navega nem envia nada); só o editor troca a fixture. O botão
 * final do pagamento não está aqui de propósito: ele finaliza a compra.
 */
const NAVEGACAO: ReadonlyArray<readonly [string, CheckoutEtapa]> = [
  ['#cart-to-orderform', 'email'],
  ['#btn-client-pre-email', 'perfil'],
  ['#go-to-shipping', 'entrega'],
  ['#btn-go-to-payment', 'pagamento'],
  ['#orderform-minicart-to-cart', 'carrinho'],
  ['#edit-profile-data', 'perfil'],
  ['#edit-shipping-data', 'entrega'],
];

function etapaDoClique(alvo: EventTarget | null): CheckoutEtapa | null {
  const el = alvo as Element | null;
  if (!el || typeof el.closest !== 'function') return null;
  for (const [seletor, etapa] of NAVEGACAO) if (el.closest(seletor)) return etapa;
  return null;
}

const bloquear = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * Preenche um slot da fixture com o header ou o footer composto.
 *
 * A fixture REAL (`yarn fixtures:capturar` do checkout-vtex) traz
 * `<div data-etm-slot="<nome>" style="display: contents">` no lugar exato em que
 * a costura do checkout-vtex põe o template na página real
 * (checkout-vtex/docs/spikes/S1.md) — `display: contents`, então o slot não vira
 * caixa e nenhum seletor muda. A PROVISÓRIA (captura crua, feita pelo
 * `checkout:sync` só onde falta a real) marca o mesmo lugar com o par de
 * comentários `<!-- ck-slot:<nome> -->` … `<!-- /ck-slot:<nome> -->`.
 */
function preencherSlot(doc: Document, nome: string, html: string): boolean {
  const fragmento = (contexto: Range) => {
    const frag = contexto.createContextualFragment(html);
    // O lint do checkout-vtex já proíbe <script> em template; aqui é a segunda trava.
    frag.querySelectorAll('script').forEach(s => s.remove());
    return frag;
  };

  const div = doc.querySelector(`[data-etm-slot="${nome}"]`);
  if (div) {
    const range = doc.createRange();
    range.selectNodeContents(div);
    div.replaceChildren(fragmento(range));
    return true;
  }

  const it = doc.createNodeIterator(doc.body ?? doc, NodeFilter.SHOW_COMMENT);
  let ini: Node | null = null;
  let fim: Node | null = null;
  for (let n = it.nextNode(); n; n = it.nextNode()) {
    const t = (n as Comment).data.trim();
    if (t === `ck-slot:${nome}`) ini = n;
    else if (t === `/ck-slot:${nome}`) fim = n;
  }
  if (!ini || !fim || ini.parentNode !== fim.parentNode) return false;
  while (ini.nextSibling && ini.nextSibling !== fim) ini.nextSibling.remove();
  const range = doc.createRange();
  range.setStartAfter(ini);
  fim.parentNode!.insertBefore(fragmento(range), fim);
  return true;
}

/**
 * O iframe do cartão da fixture de pagamento (`<etapa>.<vp>.card.html`): o
 * card-ui da VTEX é OUTRO documento, que carrega o MESMO checkout6-custom.css
 * (escopo `#app-container`, contrato.md). Por isso ele também tem o par
 * `<link id="ck-base">` + `<style id="ck-tokens">`, e o CheckoutFrame o pinta
 * como pinta a página.
 */
const iframeDoCartao = (doc: Document) =>
  doc.querySelector<HTMLIFrameElement>(
    '#iframe-placeholder-creditCardPaymentGroup iframe, iframe[src$=".card.html"]'
  );

/** O documento do cartão, se já carregou e é uma fixture (tem a base). */
function documentoDoCartao(iframe: HTMLIFrameElement | null): Document | null {
  const d = iframe?.contentDocument;
  return d && d.readyState === 'complete' && d.getElementById('ck-base')
    ? d
    : null;
}

/** Cliques, submits e arrastes morrem na captura; Cmd/Ctrl+Z/Y sobem ao editor. */
function travarDocumento(
  d: Document,
  onAtalho: React.RefObject<((acao: 'undo' | 'redo') => void) | undefined>,
  onNavegar?: React.RefObject<((etapa: CheckoutEtapa) => void) | undefined>
) {
  if (d.documentElement.hasAttribute('data-ck-bloqueado')) return;
  d.documentElement.setAttribute('data-ck-bloqueado', '1');
  // Captura: morre antes de qualquer handler (a fixture não tem script, mas
  // o link e o form nativos navegariam sozinhos).
  for (const tipo of ['click', 'auxclick', 'dblclick', 'submit', 'dragstart'])
    d.addEventListener(tipo, bloquear, true);
  if (onNavegar)
    d.addEventListener(
      'click',
      event => {
        const etapa = etapaDoClique(event.target);
        if (etapa) onNavegar.current?.(etapa);
      },
      true
    );
  d.addEventListener('keydown', event => {
    if (!(event.metaKey || event.ctrlKey)) return;
    const tecla = event.key.toLowerCase();
    if (tecla === 'z' || tecla === 'y') {
      event.preventDefault();
      onAtalho.current?.(tecla === 'y' || event.shiftKey ? 'redo' : 'undo');
    }
  });
}

/** O `<style id="ck-tokens">` de um documento da fixture (página ou cartão). */
function escreverTokens(d: Document, texto: string) {
  let el = d.getElementById('ck-tokens');
  if (!el) {
    el = d.createElement('style');
    el.id = 'ck-tokens';
    const baseLink = d.getElementById('ck-base');
    if (baseLink) baseLink.after(el);
    else d.head.appendChild(el);
  }
  el.textContent = texto;
  contar(d, 'data-ck-tokens');
}

const contar = (doc: Document, chave: string) => {
  const el = doc.documentElement;
  el.setAttribute(chave, String(Number(el.getAttribute(chave) ?? 0) + 1));
};

/** FNV-1a de 32 bits: a impressão do que o frame recebeu, em 8 hex. */
function impressao(texto: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}

/**
 * O checkout no canvas: uma fixture ESTÁTICA do DOM da VTEX
 * (public/gerador/checkout/Checkout01/<etapa>.<vp>.html) num <iframe>, com o
 * nosso CSS aplicado ao vivo. Irmão do PreviewFrame, e não uma rota Next: uma
 * rota hidrataria e injetaria CSS do app em volta de um DOM que não é nosso.
 *
 * É mesma origem, então o pai escreve direto no `contentDocument` — da página
 * e, no pagamento, também no do iframe do cartão (`card.html`), que carrega o
 * mesmo CSS:
 *
 *  - `<style id="ck-tokens">` com o `:root` do `emitTokens` do checkout-vtex
 *    vendorizado, a cada mudança de cor/fonte global ou de papel — o mesmo texto
 *    do slot `tokens` do arquivo composto (o funil prova os 0 px);
 *  - a base do modelo pelo `<link id="ck-base">` que a fixture já traz;
 *  - o header e o footer COMPOSTOS nos slots, recompostos a cada mudança:
 *    eles carregam os `--ck01-*` já resolvidos num bloco escopado (valem no
 *    Order Placed, onde o CSS não carrega), então sem recompor o header ficaria
 *    com a cor antiga; no footer, razão social, CNPJ e aviso legal viram texto
 *    de exemplo (`rodapeDeExemplo`, gate0 #26) — só aqui: o arquivo entregue
 *    sai com os placeholders, que o time preenche;
 *  - a fonte efetiva com os pesos 300–700, nos dois documentos;
 *  - a altura do iframe do cartão pela `scrollHeight` do documento dele (na loja
 *    quem manda a altura é o card-ui, por mensagem; aqui não há script);
 *  - cliques e submits bloqueados nos dois: nada ali navega nem envia.
 */
export default function CheckoutFrame({
  etapa,
  mobile,
  level2,
  level1,
  logo,
  logoPendente = false,
  caixa,
  onAtalho,
  onNavegar,
}: CheckoutFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [doc, setDoc] = useState<Document | null>(null);
  /** O documento do cartão; `undefined` = a etapa não tem cartão. */
  const [cartao, setCartao] = useState<Document | null | undefined>(undefined);
  const [base, setBase] = useState<BaseDoModelo | null>(null);
  const onAtalhoRef = useRef(onAtalho);
  onAtalhoRef.current = onAtalho;
  const onNavegarRef = useRef(onNavegar);
  onNavegarRef.current = onNavegar;

  const src = urlDaFixture(etapa, mobile);
  /*
   * O que foi PEDIDO ao frame (fixture + os dois níveis + logo) e, depois que os
   * efeitos o escreveram no documento, o que foi APLICADO — `data-pedido` e
   * `data-aplicado` no <iframe>. Iguais (com `data-pronto`) = o documento mostra
   * o estado de agora; quem mede o canvas (o funil) espera por isso em vez de
   * dormir um tempo que a máquina carregada não respeita.
   */
  const pedido = useMemo(
    () => impressao(JSON.stringify([src, level2, level1, logo])),
    [src, level2, level1, logo]
  );

  useEffect(() => {
    let vivo = true;
    carregarBase()
      .then(b => vivo && setBase(b))
      .catch(e => console.error('Base do checkout indisponível:', e));
    return () => {
      vivo = false;
    };
  }, []);

  const aoCarregar = useCallback(() => {
    const d = iframeRef.current?.contentDocument;
    // Sem o <link id="ck-base"> não é uma fixture (404, about:blank).
    if (!d || !d.getElementById('ck-base')) {
      setDoc(null);
      setCartao(undefined);
      return;
    }
    travarDocumento(d, onAtalhoRef, onNavegarRef);
    setDoc(d);

    const frameCartao = iframeDoCartao(d);
    if (!frameCartao) {
      setCartao(undefined);
      return;
    }
    const pronto = documentoDoCartao(frameCartao);
    if (pronto) {
      travarDocumento(pronto, onAtalhoRef, onNavegarRef);
      setCartao(pronto);
      return;
    }
    // O `load` do pai espera os subframes, então em geral o cartão já está
    // pronto aqui; se não, ele avisa quando ficar.
    setCartao(null);
    frameCartao.addEventListener(
      'load',
      () => {
        const c = documentoDoCartao(frameCartao);
        if (c) travarDocumento(c, onAtalhoRef, onNavegarRef);
        setCartao(c);
      },
      { once: true }
    );
  }, []);

  // Trocou de etapa ou de tamanho: é outro documento, até o `load` dele.
  useEffect(() => {
    setDoc(null);
    setCartao(undefined);
    // O iframe pode ter carregado antes de o React ligar o `onLoad` (HTML do
    // servidor no /p); aí o `load` já passou e só esta conferência o vê.
    const d = iframeRef.current?.contentDocument;
    if (d?.readyState === 'complete' && d.location.pathname === src)
      aoCarregar();
  }, [src, aoCarregar]);

  // O `:root` do checkout: nível 2 consumido + nível 1 + guardas + derivadas, em
  // hex. O mesmo texto na página e no cartão.
  useEffect(() => {
    if (!doc) return;
    let texto: string;
    try {
      texto = tokensDoCheckout(level2, level1);
    } catch (error) {
      // Fica o último `:root` bom: um valor recusado não apaga o preview.
      console.warn('Tokens do checkout recusados:', error);
      return;
    }
    escreverTokens(doc, texto);
    if (cartao) escreverTokens(cartao, texto);
  }, [doc, cartao, level2, level1]);

  // Header e footer compostos, com o logo. Sem logo, o de exemplo do Figma.
  useEffect(() => {
    if (!doc || !base) return;
    const compor = (logoDoHeader: string) =>
      comporCheckout(base, { level2, level1, logo: logoDoHeader || null });
    let composto;
    try {
      composto = compor(logo || base.logoExemplo);
      // Logo que o compose não embute (formato, tamanho: gate0 #17) sai no
      // arquivo com o placeholder {{LOGO_SRC}} e um aviso — não lança. No
      // preview, um <img src="{{LOGO_SRC}}"> seria uma imagem quebrada: mostra
      // o de exemplo, e o painel do checkout diz o porquê.
      if (logo && logoRecusado(composto.avisos))
        composto = compor(base.logoExemplo);
    } catch (error) {
      console.warn('Header do checkout não compôs:', error);
      return;
    }
    const h = preencherSlot(doc, 'header', composto.header);
    // gate0 #26: `{{CNPJ}}` cru no canvas parece defeito. O texto de exemplo
    // entra SÓ no preview; o compose do export continua com os placeholders.
    const f = preencherSlot(doc, 'footer', rodapeDeExemplo(composto.footer));
    if (h && f) contar(doc, 'data-ck-composto');
  }, [doc, base, level2, level1, logo]);

  // A fonte efetiva, com os pesos que o arquivo entregue importa.
  useEffect(() => {
    if (!doc) return;
    const familia = familiaDoCheckout(level2, level1);
    if (!familia) return;
    for (const d of cartao ? [doc, cartao] : [doc]) {
      loadGoogleFont(familia, d, PESOS_CHECKOUT);
      d.documentElement.setAttribute('data-ck-fonte', familia);
    }
  }, [doc, cartao, level2, level1]);

  // A altura do iframe do cartão acompanha o conteúdo dele (fonte, tokens,
  // largura): a `scrollHeight` do <body>, que cresce com o conteúdo e não com o
  // iframe — a do <html> nunca fica menor que a janela, então não encolheria.
  useEffect(() => {
    if (!doc || !cartao) return;
    const frame = iframeDoCartao(doc);
    const corpo = cartao.body;
    const janela = cartao.defaultView;
    if (!frame || !corpo || !janela) return;
    const medir = () => {
      const cs = janela.getComputedStyle(corpo);
      const altura = Math.ceil(
        corpo.scrollHeight +
          (parseFloat(cs.marginTop) || 0) +
          (parseFloat(cs.marginBottom) || 0)
      );
      if (altura > 0 && frame.style.height !== `${altura}px`) {
        frame.style.height = `${altura}px`;
        contar(doc, 'data-ck-cartao-altura');
      }
    };
    medir();
    const ro = new janela.ResizeObserver(medir);
    ro.observe(corpo);
    cartao.fonts?.ready.then(medir).catch(() => {});
    return () => ro.disconnect();
  }, [doc, cartao, level2, level1]);

  // Por último: os efeitos acima já rodaram com estes valores (o React roda os
  // efeitos de um componente na ordem em que são declarados).
  // Na troca de etapa ou tamanho, o render da troca ainda traz o documento
  // anterior (o `setDoc(null)` vem depois): ele não conta como aplicado.
  useEffect(() => {
    const frame = iframeRef.current;
    if (!frame) return;
    if (doc?.location?.pathname === src && base && cartao !== null)
      frame.dataset.aplicado = pedido;
    else delete frame.dataset.aplicado;
  }, [doc, src, base, cartao, pedido]);

  const vp = mobile ? 390 : 1280;
  const iframe = (
    <iframe
      ref={iframeRef}
      src={src}
      title="Pré-visualização do checkout"
      onLoad={aoCarregar}
      data-checkout-frame=""
      data-etapa={etapa}
      data-vp={vp}
      data-pronto={
        doc && base && cartao !== null && !logoPendente ? '1' : undefined
      }
      data-pedido={pedido}
      data-cartao={cartao ? '1' : undefined}
      className={
        caixa ? (mobile ? styles.mobile : styles.desktop) : styles.cheio
      }
      style={
        caixa
          ? {
              width: `${caixa.larguraLogica}px`,
              height: `${caixa.alturaLogica}px`,
              transform: `scale(${caixa.escala})`,
            }
          : undefined
      }
    />
  );

  if (!caixa) return iframe;

  return (
    <div className={styles.host}>
      {/* O mesmo par do PreviewFrame: `.stage` tem o tamanho VISUAL (o que o
          layout mede) e o iframe o LÓGICO (o que o checkout enxerga). */}
      <div
        className={styles.stage}
        style={{
          width: `${caixa.larguraVisual}px`,
          height: `${caixa.alturaVisual}px`,
        }}
      >
        {iframe}
      </div>
    </div>
  );
}
