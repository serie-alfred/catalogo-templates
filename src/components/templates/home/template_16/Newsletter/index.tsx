import React, { useState } from 'react'
import styles from './index.module.css'

/**
 * Espelha `organisms/Newsletter16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.newsletter16Box` (container das @container).
 */

// Conteúdo do mock.ts do starter.
// Mock de validação local — exibido quando o CMS não envia conteúdo (MOCK_ENABLED).
// Textos literais do desenho `Newsletter16`.
const newsletter16Mock: Newsletter16Props = {
  badge: '10% na\n1ª compra',
  title: 'Entre para o clubinho',
  text: 'Novidades, dicas de brincadeira e um cupom de boas-vindas no seu e-mail. Prometemos não lotar a caixa.',
  nameLabel: 'Nome',
  namePlaceholder: 'Seu nome',
  emailLabel: 'E-mail',
  emailPlaceholder: 'voce@email.com',
  buttonLabel: 'Quero entrar',
  successMessage: 'Oba! Você já faz parte do clubinho. O cupom chega no seu e-mail.',
  errorMessage: 'Não deu para cadastrar agora. Tente de novo em instantes.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/institucional/privacidade',
}


/**
 * Newsletter16 — newsletter da família 16 (Infantil; desenho `Newsletter16` /
 * `Newsletter16-mobile`). Faixa roxa entre duas ondas creme: à esquerda o selo amarelo redondo e
 * inclinado (texto do CMS, ex.: "10% na 1ª compra"), o título grande em Fredoka e o texto; à
 * direita Nome e E-mail em pílulas brancas com rótulo, o botão amarelo com a sombra chapada e a
 * política. Mobile: tudo numa coluna.
 *
 * Contrato §4: exatamente nome e e-mail → `subscribeNewsletter` (entidade NW); cupom só como
 * texto do CMS (o selo). Analytics: `generate_lead` só no sucesso real.
 */
export interface Newsletter16Props {
  /** Selo amarelo (ex.: "10% na\n1ª compra"; a quebra de linha vale). Vazio esconde. */
  badge?: string
  title?: string
  text?: string
  nameLabel?: string
  namePlaceholder?: string
  emailLabel?: string
  emailPlaceholder?: string
  buttonLabel?: string
  successMessage?: string
  errorMessage?: string
  /** Ex.: "Ao se cadastrar, você concorda com a". */
  privacyPrefix?: string
  privacyLabel?: string
  privacyUrl?: string
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

export default function Newsletter16() {
  const {
    badge,
    title,
    text,
    nameLabel,
    namePlaceholder,
    emailLabel,
    emailPlaceholder,
    buttonLabel,
    successMessage,
    errorMessage,
    privacyPrefix,
    privacyLabel,
    privacyUrl,
  } = newsletter16Mock

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [estado, setEstado] = useState<'idle' | 'ok' | 'erro'>('idle')

  function enviar(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !email.trim()) return
    setEnviando(true)
    // Catálogo: sem GraphQL nem analytics; o envio só mostra o retorno de sucesso.
    try {
      setEstado('ok')
      setNome('')
      setEmail('')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className={styles.newsletter16Box}>
    <section className={styles.newsletter16} aria-label={title || 'Newsletter'} data-role="nl-root">
      <link rel="stylesheet" href={FONTES} />
      {/* Ondas creme em cima e embaixo: ilustração da família 16 (hex fixo, desvio aprovado). */}
      <svg className={`${styles.wave} ${styles.dsk}`} aria-hidden="true" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0 0H1440V20C1320 40 1200 0 1080 20S840 40 720 20 480 0 360 20 120 40 0 20z" />
      </svg>
      <svg className={`${styles.wave} ${styles.mob}`} aria-hidden="true" viewBox="0 0 375 24" preserveAspectRatio="none">
        <path d="M0 0H375V12C328 24 281 0 234 12S141 24 94 12 47 0 0 12z" />
      </svg>
      <div className={styles.inner}>
        <div className={styles.head}>
          {badge && (
            <span className={styles.badge} data-role="nl-badge">
              {badge}
            </span>
          )}
          {title && (
            <h2 className={styles.title} data-role="nl-title">
              {title}
            </h2>
          )}
          {text && (
            <p className={styles.text} data-role="nl-text">
              {text}
            </p>
          )}
        </div>
        {estado === 'ok' ? (
          <div className={styles.form}>
            <p className={styles.feedback} role="status">
              {successMessage}
            </p>
          </div>
        ) : (
          <form className={styles.form} onSubmit={enviar} data-role="nl-form">
            <label className={styles.field}>
              {nameLabel || 'Nome'}
              <input
                className={styles.input}
                type="text"
                name="name"
                autoComplete="name"
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
                type="email"
                name="email"
                autoComplete="email"
                required
                placeholder={emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <button type="submit" className={styles.submit} disabled={enviando} data-role="nl-submit">
              {buttonLabel || 'Quero entrar'}
            </button>
            {(privacyPrefix || privacyLabel) && (
              <p className={styles.privacy}>
                {privacyPrefix}
                {privacyLabel && (
                  <>
                    {' '}
                    <a href={privacyUrl || '#'}>{privacyLabel}</a>.
                  </>
                )}
              </p>
            )}
            {estado === 'erro' && (
              <p className={styles.feedback} role="alert">
                {errorMessage}
              </p>
            )}
          </form>
        )}
      </div>
      <svg className={`${styles.wave} ${styles.dsk}`} aria-hidden="true" viewBox="0 0 1440 40" preserveAspectRatio="none">
        <path d="M0 20C120 0 240 40 360 20S600 0 720 20s240 20 360 0 240-20 360 0V40H0z" />
      </svg>
      <svg className={`${styles.wave} ${styles.mob}`} aria-hidden="true" viewBox="0 0 375 24" preserveAspectRatio="none">
        <path d="M0 12C47 0 94 24 141 12S234 0 281 12s47 12 94 0V24H0z" />
      </svg>
    </section>
    </div>
  )
}
