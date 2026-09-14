'use client';

import React, { useEffect, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/PopupNews06` do faststore.starter — o pop-up de newsletter
 * da loja 06: imagem à esquerda, título com trecho destacado, formulário de
 * quatro campos e o rodapé legal.
 *
 * O que sai: a mutação de cadastro (o resolver que grava o lead), o `localStorage`
 * que lembra quem já fechou, o atraso de exibição e o tracking. Fica a máscara do
 * celular, a mensagem de sucesso e o fechar — é o que faz o preview responder.
 *
 * Continua DESKTOP-ONLY, como a origem (`min-width: 1025px`): abaixo disso ela
 * não renderiza nada, e o preview mobile fica vazio de propósito.
 *
 * A arte vinha do CDN de um cliente e virou `placehold.co` na mesma medida — o
 * catálogo é público.
 */
const CONTEUDO = {
  title: 'Assine a nossa newsletter e ganhe 10% off',
  highlight: '10% off',
  image: 'https://placehold.co/650x996/e9e4dc/8a8a8a?text=Banner',
  imageAlt: 'Banner Popup',
  finePrint:
    '*Ao clicar em se cadastrar você concorda com a Política de Privacidade da loja.\n*Desconto não acumulativo. Válido apenas na primeira compra.\n*Cupom será enviado para o e-mail cadastrado.',
  submitLabel: 'INSCREVA-SE',
  successMessage: 'Cadastro enviado com sucesso.',
};

const mascaraCelular = (cru: string): string => {
  const d = cru.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d && `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const CAMPOS = [
  { key: 'name', label: 'NOME:', type: 'text' },
  { key: 'email', label: 'EMAIL:', type: 'email' },
  { key: 'birth', label: 'DATA DE NASC:', type: 'date' },
  { key: 'phone', label: 'CELULAR:', type: 'tel', placeholder: '(  )', mask: mascaraCelular },
] as const;

const FORM_VAZIO = { name: '', email: '', birth: '', phone: '' };

/** Mesma régua da origem: só a partir de 1025px de janela. */
function useEhDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const aplicar = () => setDesktop(mq.matches);
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, []);
  return desktop;
}

export default function PopupNews() {
  const ehDesktop = useEhDesktop();
  const [aberto, setAberto] = useState(true);
  const [enviado, setEnviado] = useState(false);
  const [form, setForm] = useState<Record<string, string>>(FORM_VAZIO);

  /* no sucesso a mensagem substitui o formulário e, 2s depois, ele volta em branco */
  useEffect(() => {
    if (!enviado) return;
    const t = setTimeout(() => {
      setEnviado(false);
      setForm(FORM_VAZIO);
    }, 2000);
    return () => clearTimeout(t);
  }, [enviado]);

  if (!ehDesktop || !aberto) return null;

  const { title, highlight } = CONTEUDO;

  return (
    /* wrapper só do catálogo: carrega o container-type das @container */
    <div className={styles.popupWrap}>
      <div
        className={styles.overlay}
        role="presentation"
        data-role="popup-overlay"
        onClick={() => setAberto(false)}
      >
        <section
          className={styles.content}
          data-role="popup-content"
          role="dialog"
          aria-modal="true"
          aria-label={title}
          onClick={e => e.stopPropagation()}
        >
          <button
            className={styles.close}
            onClick={() => setAberto(false)}
            aria-label="Fechar"
            data-role="popup-close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <img
            className={styles.image}
            data-role="popup-image"
            src={CONTEUDO.image}
            alt={CONTEUDO.imageAlt}
            loading="lazy"
          />

          <div className={`${styles.panel}${enviado ? ` ${styles.panelSuccess}` : ''}`}>
            {!enviado && (
              <h2 className={styles.title} data-role="popup-title">
                {title.includes(highlight) ? (
                  <>
                    {title.split(highlight)[0]}
                    <span className={styles.highlight}>{highlight}</span>
                    {title.split(highlight)[1]}
                  </>
                ) : (
                  title
                )}
              </h2>
            )}

            {enviado ? (
              <p className={styles.success} role="status">{CONTEUDO.successMessage}</p>
            ) : (
              <form
                className={styles.form}
                data-role="popup-form"
                onSubmit={e => {
                  e.preventDefault();
                  setEnviado(true);
                }}
              >
                <div className={styles.fields}>
                  {CAMPOS.map(f => (
                    <div key={f.key} className={styles.field} data-role="popup-field">
                      <label className={styles.label} data-role="popup-label" htmlFor={`popupnews-${f.key}`}>
                        {f.label}
                      </label>
                      <input
                        id={`popupnews-${f.key}`}
                        className={styles.input}
                        data-role="popup-input"
                        type={f.type}
                        placeholder={'placeholder' in f ? f.placeholder : undefined}
                        required
                        value={form[f.key]}
                        onChange={e =>
                          setForm(prev => ({
                            ...prev,
                            [f.key]: 'mask' in f ? f.mask(e.target.value) : e.target.value,
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className={styles.submit} data-role="popup-submit">
                  {CONTEUDO.submitLabel}
                </button>
              </form>
            )}
          </div>

          {!enviado && (
            <p className={styles.finePrint} data-role="popup-fine">
              {CONTEUDO.finePrint.split('\n').map((linha, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {linha}
                </React.Fragment>
              ))}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
