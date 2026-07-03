'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Eye, X, Copy, Check, ExternalLink } from 'lucide-react';
import { useLayout } from '@/context/LayoutContext';
import styles from './index.module.css';

/**
 * Botão "Preview" do sidebar: gera uma URL compartilhável do tema atual e a
 * exibe num modal com opção de copiar / abrir.
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
        title="Gerar preview compartilhável"
        className="icon"
        onClick={handleClick}
        type="button"
        disabled={loading}
      >
        <Eye size={20} color="#7A7A7A" />
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
              </>
            )}
          </div>
          </div>,
          document.body
        )}
    </>
  );
}
