import React, { useEffect, useRef } from 'react';
import styles from './index.module.css';
import { CircleQuestionMark } from 'lucide-react';
import { iconsGenerator } from '@/assets/icons/generator';

interface WakePopupProps {
  onClose: () => void;
  wakeCustomValue: string;
  setWakeCustomValue: (value: string) => void;
  setShowWakePopup: (value: boolean) => void;
  wakePopupRef: React.Ref<HTMLDivElement>;
}

/**
 * Pede o token da loja Wake ao trocar de plataforma.
 *
 * O botão dizia "Enviar" e só fechava o diálogo. Nada é enviado daqui — não
 * existe nenhuma chamada de rede envolvendo o token em lugar nenhum do
 * projeto. Ele é persistido no `onChange`, viaja no `config.json` e é usado
 * depois, pelo template-generator. Um rótulo que promete rede numa tela que
 * não tem rede é uma mentira que só é descoberta quando o tema não sobe.
 */
export function WakePopup({
  onClose,
  wakeCustomValue,
  setWakeCustomValue,
  wakePopupRef,
  setShowWakePopup,
}: WakePopupProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowWakePopup(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [setShowWakePopup]);

  const vazio = wakeCustomValue.trim() === '';

  return (
    <div className={styles.overlay}>
      <div
        ref={wakePopupRef}
        className={`${styles.popup} wake-popup`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="wake-popup-titulo"
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={() => setShowWakePopup(false)}
          aria-label="Fechar"
        >
          {iconsGenerator.closeSide}
        </button>
        <h2 id="wake-popup-titulo">Atenção</h2>
        <p>
          Para construir o seu tema na plataforma <strong>Wake</strong> é
          necessário informar o token da sua loja.
        </p>
        <p className={styles.nota}>
          O token fica salvo neste navegador e vai junto no{' '}
          <code>config.json</code> quando você baixar o tema. Nada é enviado
          para a sua loja a partir daqui.
        </p>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              id="wakeToken"
              type="text"
              value={wakeCustomValue}
              onChange={e => setWakeCustomValue(e.target.value)}
              placeholder="Digite seu token aqui"
              className={styles.input}
            />
            <a
              href="https://wakecommerce.readme.io/docs/autenticacao-e-criacao-do-token"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.helpIcon}
              title="Como obter o token"
            >
              <CircleQuestionMark />
            </a>
          </div>
        </div>

        {/* Avisa, não bloqueia: o popup abre sozinho na troca para Wake e o
            usuário pode legitimamente ainda não ter o token em mãos. */}
        {vazio && (
          <p className={styles.aviso} role="status">
            Sem o token o tema é gerado normalmente, mas a publicação na Wake
            vai precisar dele depois.
          </p>
        )}

        <button type="button" onClick={onClose}>
          Salvar e continuar
        </button>
      </div>
    </div>
  );
}
