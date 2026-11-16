'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.css';
import {
  registrarHostDeConfirmacao,
  type PedidoDeConfirmacao,
} from './confirmar';

export { confirmar } from './confirmar';

interface Aberto {
  pedido: PedidoDeConfirmacao;
  responder: (sim: boolean) => void;
}

/**
 * O modal das confirmações do gerador (ver `confirmar.ts`). Montado uma vez na página
 * do /gerador. Esc, o "Cancelar" e o clique fora respondem não; o foco abre no botão de
 * confirmar, então Enter confirma, como na caixa nativa.
 */
export default function ConfirmHost() {
  const [aberto, setAberto] = useState<Aberto | null>(null);
  const atual = useRef<Aberto | null>(null);
  const okRef = useRef<HTMLButtonElement>(null);

  const responder = useCallback((sim: boolean) => {
    const a = atual.current;
    atual.current = null;
    setAberto(null);
    a?.responder(sim);
  }, []);

  useEffect(() => {
    registrarHostDeConfirmacao(
      pedido =>
        new Promise<boolean>(resolve => {
          // Uma pergunta por vez: a que estava aberta vira "não".
          atual.current?.responder(false);
          const novo = { pedido, responder: resolve };
          atual.current = novo;
          setAberto(novo);
        })
    );
    return () => {
      registrarHostDeConfirmacao(null);
      atual.current?.responder(false);
      atual.current = null;
    };
  }, []);

  useEffect(() => {
    if (!aberto) return;
    okRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        responder(false);
      }
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [aberto, responder]);

  if (!aberto) return null;
  const { pedido } = aberto;

  return (
    <div
      className={styles.overlay}
      onMouseDown={e => {
        if (e.target === e.currentTarget) responder(false);
      }}
      data-confirmar=""
    >
      <div
        className={styles.caixa}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmar-titulo"
        aria-describedby={pedido.texto ? 'confirmar-texto' : undefined}
      >
        <h2 id="confirmar-titulo" className={styles.titulo}>
          {pedido.titulo}
        </h2>
        {pedido.texto && (
          <p id="confirmar-texto" className={styles.texto}>
            {pedido.texto}
          </p>
        )}
        {pedido.itens && pedido.itens.length > 0 && (
          <ul className={styles.itens}>
            {pedido.itens.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {pedido.nota && <p className={styles.nota}>{pedido.nota}</p>}
        <div className={styles.acoes}>
          <button
            type="button"
            className={styles.cancelar}
            onClick={() => responder(false)}
            data-confirmar-cancelar=""
          >
            Cancelar
          </button>
          <button
            ref={okRef}
            type="button"
            className={`${styles.ok} ${pedido.perigo ? styles.perigo : ''}`}
            onClick={() => responder(true)}
            data-confirmar-ok=""
          >
            {pedido.ok ?? 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}
