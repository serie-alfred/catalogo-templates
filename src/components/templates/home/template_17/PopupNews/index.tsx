import React, { useState } from 'react'
import { FONTES_17 as FONTES } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `organisms/PopupNews17` do faststore.starter (família 17, Pet; desenho `PopupNews17` /
 * `PopupNews17-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`; o CSS é derivado do
 * SCSS de lá, com o @media (overlay fixo na tela, z 2500 — sem envelope de container). Desktop:
 * modal de 840 com raio 16, a arte à esquerda (sem arte: o recorte orgânico neutro) e, à direita,
 * o fechar redondo, a etiqueta tangerina com a patinha, o título em Bricolage, o texto, Nome e
 * E-mail em pílulas, "Quero meu cupom", a política e "Agora não". Mobile: folha presa ao pé da
 * tela, com a faixa da arte no topo.
 *
 * O que sai: a consulta de cadastro (GraphQL), o analytics, o atraso de abertura e o
 * localStorage que suprime o pop-up. No canvas ele já nasce ABERTO; o fechar só esconde (estado
 * local) e o envio mostra a mensagem de sucesso.
 */

interface PopupNews17Props {
  imageDesktop?: string
  imageMobile?: string
  imageAlt?: string
  /** Etiqueta tangerina com a patinha, acima do título. Vazio esconde. */
  eyebrow?: string
  title?: string
  text?: string
  nameLabel?: string
  namePlaceholder?: string
  emailLabel?: string
  emailPlaceholder?: string
  buttonLabel?: string
  successMessage?: string
  privacyPrefix?: string
  privacyLabel?: string
  privacyUrl?: string
  dismissLabel?: string
  delaySeconds?: number
  dismissDays?: number
}

// Conteúdo do mock.ts do starter (textos do desenho; sem arte: vale o recorte neutro).
const popupNews17Mock: PopupNews17Props = {
  eyebrow: 'Boas-vindas',
  title: '10% na primeira compra do seu pet',
  text: 'Cadastre-se e receba o cupom BEMVINDO10 no e-mail, junto com dicas de cuidado e as ofertas da semana.',
  nameLabel: 'Seu nome',
  namePlaceholder: 'Como podemos te chamar',
  emailLabel: 'Seu e-mail',
  emailPlaceholder: 'voce@email.com',
  buttonLabel: 'Quero meu cupom',
  successMessage: 'Prontinho! O cupom já está a caminho do seu e-mail.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/politica-de-privacidade',
  dismissLabel: 'Agora não',
  delaySeconds: 3,
  dismissDays: 7,
}


export default function PopupNews17() {
  const {
    imageDesktop,
    imageMobile,
    imageAlt,
    eyebrow,
    title,
    text,
    nameLabel,
    namePlaceholder,
    emailLabel,
    emailPlaceholder,
    buttonLabel,
    successMessage,
    privacyPrefix,
    privacyLabel,
    privacyUrl,
    dismissLabel,
  } = popupNews17Mock

  const [aberto, setAberto] = useState(true)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<'idle' | 'ok' | 'erro'>('idle')
  const motivo = ''
  const enviando = false
  const fechar = () => setAberto(false)

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !email.trim()) return
    setEstado('ok')
  }

  if (!aberto) return null

  return (
    <div className={styles.popupNews17} data-role="pn-root">
      <link rel="stylesheet" href={FONTES} />
      <div className={styles.overlay} onClick={fechar} aria-hidden="true" />
      <section tabIndex={-1} className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="pn17-titulo">
        <div className={styles.media} data-role="pn-image">
          {imageDesktop || imageMobile ? (
            <picture>
              {imageMobile && <source media="(max-width: 960px)" srcSet={imageMobile} />}
              <img src={imageDesktop || imageMobile} alt={imageAlt ?? ''} width={680} height={1040} />
            </picture>
          ) : (
            // Sem arte: o recorte orgânico neutro do desenho.
            <span className={styles.placeholder} aria-hidden="true" />
          )}
        </div>

        <button type="button" className={styles.close} onClick={fechar} aria-label="Fechar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>

        <div className={styles.side}>
          {eyebrow && (
            <span className={styles.eyebrow} data-role="pn-eyebrow">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
                <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
                <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
                <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
                <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
              </svg>
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 id="pn17-titulo" className={styles.title} data-role="pn-title">
              {title}
            </h2>
          )}
          {text && (
            <p className={styles.text} data-role="pn-text">
              {text}
            </p>
          )}

          <form className={styles.form} onSubmit={enviar}>
            {estado === 'ok' ? (
              <p className={styles.feedback} role="status">
                {successMessage}
              </p>
            ) : (
              <>
                <label className={styles.field}>
                  {nameLabel || 'Nome'}
                  <input
                    className={styles.input}
                    data-role="pn-input"
                    type="text"
                    name="name"
                    autoComplete="given-name"
                    required
                    placeholder={namePlaceholder}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </label>
                <label className={styles.field}>
                  {emailLabel || 'E-mail'}
                  <input
                    className={styles.input}
                    data-role="pn-input"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder={emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                {estado === 'erro' && (
                  <p className={styles.feedback} role="alert">
                    {motivo || 'Não foi possível concluir a inscrição. Tente novamente.'}
                  </p>
                )}
                <button type="submit" className={styles.submit} disabled={enviando} data-role="pn-button">
                  {buttonLabel}
                </button>
              </>
            )}

            {privacyLabel && (
              <p className={styles.privacy}>
                {privacyPrefix && `${privacyPrefix} `}
                <a href={privacyUrl || '#'}>{privacyLabel}</a>.
              </p>
            )}
            {dismissLabel && (
              <button type="button" className={styles.dismiss} onClick={fechar} data-role="pn-dismiss">
                {dismissLabel}
              </button>
            )}
          </form>
        </div>
      </section>
    </div>
  )
}
