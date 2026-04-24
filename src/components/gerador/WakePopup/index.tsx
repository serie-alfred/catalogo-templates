import React, { RefObject } from 'react';
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

export function WakePopup({
  onClose,
  wakeCustomValue,
  setWakeCustomValue,
  wakePopupRef,
  setShowWakePopup,
}: WakePopupProps) {  
  return (
    <div className={styles.overlay}>
      <div ref={wakePopupRef} className={`${styles.popup} wake-popup`}>
        <button
          className={`${styles.closeButton} icon`} 
          onClick={() => setShowWakePopup(false)}
        >
          {iconsGenerator.closeSide}
        </button>
        <h2>Atenção</h2>
        <p>
          Para construir o seu tema na plataforma <strong>Wake</strong> é
          necessário informar o token da sua loja.
        </p>

        <div className={styles.inputGroup}>
          <div className={styles.inputWrapper}>
            <input
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

        <button onClick={onClose}>Enviar</button>
      </div>
    </div>
  );
}
