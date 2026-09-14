'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { CloseMd } from '@/assets/icons/editor';

import styles from './index.module.css';

export type ExportFeedback = 'sent' | 'failed';

/**
 * Confirmação do export.
 *
 * Existe porque fora do desenvolvimento o clique em "Enviar" não baixa arquivo
 * nenhum (ver configDelivery.ts): sem um retorno na tela, o usuário não tem
 * como distinguir "enviado" de "botão quebrado". Era um `window.alert`, que
 * além de feio não diz de onde vem — o diálogo do navegador é creditado ao
 * domínio, não ao produto.
 *
 * Portalizado para o <body>, como o SectionModal: o shell é `overflow: hidden`
 * e recortaria o diálogo. O `data-ed-portal` é obrigatório fora do
 * `.ed-shell` — é ele que leva a fonte Inter e o anel de foco (editor-tokens.css).
 */
export default function ExportFeedbackModal({
  status,
  onClose,
}: {
  status: ExportFeedback;
  onClose: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const okRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    okRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;

      // Armadilha de foco: sem ela o Tab sai do diálogo e passeia pelo editor
      // atrás do overlay. Mesma razão do SectionModal.
      const focusables = cardRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const sent = status === 'sent';

  return createPortal(
    <div className={styles.overlay} onMouseDown={onClose} data-ed-portal>
      <div
        ref={cardRef}
        className={styles.card}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="export-feedback-titulo"
        aria-describedby="export-feedback-texto"
        onMouseDown={event => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Fechar"
        >
          <CloseMd width={24} height={24} />
        </button>

        <span
          className={`${styles.badge} ${sent ? styles.badgeOk : styles.badgeErr}`}
          aria-hidden="true"
        >
          {sent ? <CheckIcon /> : <AlertIcon />}
        </span>

        <h2 id="export-feedback-titulo" className={styles.title}>
          {sent ? 'Configuração enviada' : 'Não foi possível enviar'}
        </h2>

        <p id="export-feedback-texto" className={styles.text}>
          {sent ? (
            <>
              O <code>config.json</code> do seu tema chegou à equipe de
              implantação por e-mail. Você pode continuar editando — cada envio
              manda a versão mais recente.
            </>
          ) : (
            <>
              O envio por e-mail falhou, então baixamos o{' '}
              <code>config.json</code> no seu computador para o trabalho não se
              perder. Encaminhe o arquivo para a equipe.
            </>
          )}
        </p>

        <button
          ref={okRef}
          type="button"
          className={styles.action}
          onClick={onClose}
        >
          Entendi
        </button>
      </div>
    </div>,
    document.body
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8v5m0 3.5v.01M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.4h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
