/**
 * Confirmação do gerador, no lugar do `window.confirm`.
 *
 * A caixa nativa some sem aviso quando o navegador bloqueia diálogos da aba (o Chrome
 * oferece "Impedir que esta página crie caixas de diálogo" depois de alguns seguidos), e
 * aí `window.confirm` devolve `false` na hora: o clique em "Por template" virava um
 * "Cancelar" silencioso e o template não trocava. Esta confirmação é um modal da página
 * (o `ConfirmHost`, montado uma vez no /gerador), que o navegador não tem como bloquear.
 *
 * Em navegador automatizado (`navigator.webdriver`, o Playwright do funil) a pergunta
 * continua sendo a caixa nativa, com o mesmo texto: o funil responde pelo
 * `page.on('dialog')` e confere a mensagem. `window.__dialogosNativos = true` força o
 * mesmo caminho. Sem o host montado (outra página, teste), também cai na nativa.
 */
export interface PedidoDeConfirmacao {
  /** A pergunta, curta: "Aplicar o template 13 · Noturno?". */
  titulo: string;
  /** O que acontece se confirmar. */
  texto?: string;
  /** Lista (ex.: as seções que saem). */
  itens?: string[];
  /** Linha de rodapé: "Dá para desfazer com Voltar." / "Isto não tem volta." */
  nota?: string;
  /** Rótulo do botão de confirmar (o padrão é "Confirmar"). */
  ok?: string;
  /** Ação que não tem volta: o botão de confirmar fica vermelho. */
  perigo?: boolean;
}

type Host = (pedido: PedidoDeConfirmacao) => Promise<boolean>;

let host: Host | null = null;

/** O `ConfirmHost` se registra ao montar e sai ao desmontar. */
export function registrarHostDeConfirmacao(novo: Host | null): void {
  host = novo;
}

/** O texto da caixa nativa: pergunta, texto, itens e nota, separados por linha em branco. */
export function mensagemNativa(p: PedidoDeConfirmacao): string {
  return [
    p.titulo,
    p.texto,
    p.itens?.length ? p.itens.map(i => `• ${i}`).join('\n') : '',
    p.nota,
  ]
    .filter(Boolean)
    .join('\n\n');
}

function usarNativa(): boolean {
  if (typeof window === 'undefined') return true;
  const w = window as Window & { __dialogosNativos?: boolean };
  return !host || w.__dialogosNativos === true || navigator.webdriver === true;
}

/** Pergunta e resolve `true` só se a pessoa confirmar. */
export function confirmar(pedido: PedidoDeConfirmacao): Promise<boolean> {
  if (usarNativa()) {
    return Promise.resolve(
      typeof window !== 'undefined' && window.confirm(mensagemNativa(pedido))
    );
  }
  return host!(pedido);
}
