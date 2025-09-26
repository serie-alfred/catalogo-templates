import React from 'react';
import styles from './index.module.css';
import { CircleQuestionMark } from 'lucide-react';

interface WakePopupProps {
  onClose: () => void;
  wakeCustomValue: string;
  setWakeCustomValue: (value: string) => void;
}

export function WakePopup({
  onClose,
  wakeCustomValue,
  setWakeCustomValue,
}: WakePopupProps) {
  return (
    <div className={styles.overlay}>
      <div className={`${styles.popup} wake-popup`}>
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
