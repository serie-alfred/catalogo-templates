import React, { useState } from 'react'
import { FONTES_17 as FONTES } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `organisms/Newsletter17` do faststore.starter (família 17, Pet; desenho `Newsletter17` /
 * `Newsletter17-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá. A seção fica dentro do
 * envelope `.newsletter17Box` (container das @container).
 *
 * Faixa no primário: à esquerda o recorte orgânico tangerina com a patinha (a única do bloco), o
 * título em Bricolage e o texto; à direita Nome e E-mail em pílulas translúcidas com rótulo, o
 * botão tangerina e a política. Mobile: tudo numa coluna.
 *
 * O que sai: a consulta de cadastro (GraphQL) e o analytics. No catálogo o envio só mostra o
 * retorno de sucesso.
 */

interface Newsletter17Props {
  title?: string
  text?: string
  nameLabel?: string
  namePlaceholder?: string
  emailLabel?: string
  emailPlaceholder?: string
  buttonLabel?: string
  successMessage?: string
  errorMessage?: string
  privacyPrefix?: string
  privacyLabel?: string
  privacyUrl?: string
}

// Conteúdo do mock.ts do starter (textos do desenho).
const newsletter17Mock: Newsletter17Props = {
  title: 'Dicas e ofertas para o seu pet, toda semana',
  text: 'Cuidados por espécie, lembretes de vacina e as ofertas da semana no seu e-mail. Sem excesso de mensagens.',
  nameLabel: 'Seu nome',
  namePlaceholder: 'Como podemos te chamar',
  emailLabel: 'Seu e-mail',
  emailPlaceholder: 'voce@email.com',
  buttonLabel: 'Quero receber',
  successMessage: 'Pronto! As dicas da semana chegam no seu e-mail.',
  errorMessage: 'Não deu para cadastrar agora. Tente de novo em instantes.',
  privacyPrefix: 'Ao se cadastrar, você concorda com a',
  privacyLabel: 'Política de Privacidade',
  privacyUrl: '/institucional/privacidade',
}


const Patinha = () => (
  <svg className={styles.paw} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
    <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
    <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
  </svg>
)

export default function Newsletter17() {
  const {
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
  } = newsletter17Mock

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
    <div className={styles.newsletter17Box}>
      <section className={styles.newsletter17} aria-label={title || 'Newsletter'} data-role="nl-root">
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <span className={styles.badge} aria-hidden="true" data-role="nl-badge">
              <Patinha />
            </span>
            {(title || text) && (
              <div className={styles.headCopy}>
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
                {buttonLabel || 'Quero receber'}
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
      </section>
    </div>
  )
}
