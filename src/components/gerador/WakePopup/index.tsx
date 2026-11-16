import React, { useEffect, useRef } from 'react';
import styles from './index.module.css';
import { CircleQuestionMark } from 'lucide-react';
import { iconsGenerator } from '@/assets/icons/generator';
import { useLayout } from '@/context/LayoutContext';
import { rotuloDaPlataforma } from '@/types/platform';

interface WakePopupProps {
  /** 'exportar': o export está esperando; 'editar': aberto pela topbar. */
  modo: 'editar' | 'exportar';
  /** 'exportar' segue com o export; 'cancelar' (X, Esc, clique fora) o desiste. */
  onFechar: (r: 'exportar' | 'cancelar') => void;
  wakeCustomValue: string;
  setWakeCustomValue: (value: string) => void;
  wakePopupRef: React.Ref<HTMLDivElement>;
}

/**
 * Pede o token da loja Wake. Abre no "Enviar"/"Baixar" quando o token está
 * vazio, ou pelo botão "Token da loja" da topbar — não mais a cada troca de
 * plataforma: o token só serve ao config.json.
 *
 * O botão dizia "Enviar" e só fechava o diálogo. Nada é enviado daqui — não
 * existe nenhuma chamada de rede envolvendo o token em lugar nenhum do
 * projeto. Ele é persistido no `onChange`, viaja no `config.json` e é usado
 * depois, pelo template-generator. Um rótulo que promete rede numa tela que
 * não tem rede é uma mentira que só é descoberta quando o tema não sobe.
 */
export function WakePopup({
  modo,
  onFechar,
  wakeCustomValue,
  setWakeCustomValue,
  wakePopupRef,
}: WakePopupProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // O mesmo diálogo abre para a Wake e para a Wake 2.0: o nome tem de ser o escolhido.
  const { platform } = useLayout();

  useEffect(() => {
    inputRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar('cancelar');
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onFechar]);

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
          onClick={() => onFechar('cancelar')}
          aria-label="Fechar"
        >
          {iconsGenerator.closeSide}
        </button>
        <h2 id="wake-popup-titulo">Atenção</h2>
        <p>
          Para construir o seu tema na plataforma{' '}
          <strong>{rotuloDaPlataforma(platform ?? 'Wake 2.0')}</strong> é
          necessário informar o token da sua loja.
        </p>
        <p className={styles.nota}>
          Como gerar o token:{' '}
          <a
            href="https://wakecommerce.readme.io/docs/autenticacao-e-criacao-do-token"
            target="_blank"
            rel="noopener noreferrer"
          >
            tutorial da Wake
          </a>
          .
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

        {/* Avisa, não bloqueia: quem exporta pode ainda não ter o token em
            mãos, e o tema sai sem ele. */}
        {vazio && (
          <p className={styles.aviso} role="status">
            Sem o token o tema é gerado normalmente, mas os componentes globais
            (ajuda e pop-up de newsletter) não são cadastrados no painel da
            Wake.
          </p>
        )}

        {modo === 'exportar' ? (
          <div className={styles.acoes}>
            {/* O token já foi salvo no onChange: os dois seguem com o export,
                a diferença é só o que o rótulo promete. */}
            <button
              type="button"
              className={styles.secundario}
              onClick={() => onFechar('exportar')}
            >
              Exportar sem token
            </button>
            <button
              type="button"
              onClick={() => onFechar('exportar')}
              disabled={vazio}
            >
              Salvar e exportar
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => onFechar('cancelar')}>
            Salvar
          </button>
        )}
      </div>
    </div>
  );
}
