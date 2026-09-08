'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Copy, Check, ExternalLink, Clock } from 'lucide-react';
import { EyeShow } from '@/assets/icons/editor';
import { useLayout } from '@/context/LayoutContext';
import styles from './index.module.css';

/**
 * "Pré-visualizar": grava o tema atual no servidor e devolve uma URL curta
 * (/p/{id}), exibida num modal com copiar e abrir.
 *
 * Vive no cabeçalho do painel direito. A gravação passa pela rede, então o
 * botão mostra que está ocupado — antes ele só ficava `disabled`, sem sinal
 * nenhum.
 */
export default function PreviewButton() {
  const { createPreview } = useLayout();
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setError(false);
    setLoading(true);
    try {
      const link = await createPreview();
      if (link) {
        setUrl(link);
      } else {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const closeModal = () => {
    setUrl(null);
    setError(false);
    setCopied(false);
  };

  return (
    <>
      <button
        className={styles.trigger}
        onClick={handleClick}
        type="button"
        disabled={loading}
      >
        <EyeShow width={24} height={24} />
        {loading ? 'Gerando…' : 'Pré-visualizar'}
      </button>

      {(url || error) &&
        createPortal(
          <div className={styles.overlay} onClick={closeModal}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button
              className={styles.close}
              onClick={closeModal}
              type="button"
              aria-label="Fechar"
            >
              <X size={18} />
            </button>

            {error ? (
              <>
                <h3 className={styles.title}>Não foi possível gerar o link</h3>
                <p className={styles.subtitle}>
                  Tente novamente em instantes.
                </p>
              </>
            ) : (
              <>
                <h3 className={styles.title}>Preview pronto! 🎉</h3>
                <p className={styles.subtitle}>
                  Compartilhe este link para navegar pelo tema como um site real.
                </p>

                <div className={styles.linkRow}>
                  <input
                    className={styles.linkInput}
                    type="text"
                    value={url ?? ''}
                    readOnly
                    onFocus={e => e.target.select()}
                  />
                  <button
                    className={styles.copyBtn}
                    onClick={handleCopy}
                    type="button"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copiado' : 'Copiar'}
                  </button>
                </div>

                <a
                  className={styles.openLink}
                  href={url ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink size={16} /> Abrir preview
                </a>

                <p className={styles.expiryNote}>
                  <Clock size={14} /> Este link expira em 3 dias.
                </p>
              </>
            )}
          </div>
          </div>,
          document.body
        )}
    </>
  );
}
