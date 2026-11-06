import React from 'react'
import { FONTES_17 } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `organisms/Editorial17` do faststore.starter (família 17, Pet). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.editorial17Box` (container das @container).
 * Sem divergência deliberada: sem arte no mock, vale o tom neutro do CSS.
 */

export interface Editorial17Story {
  /** Categoria na cor de destaque (ex.: "Nutrição"). */
  eyebrow?: string
  title?: string
  /** Texto (só a matéria em destaque mostra). */
  text?: string
  /** Linha de apoio das demais (ex.: "4 min de leitura"). */
  meta?: string
  url?: string
  imageDesktop?: string
  imageMobile?: string
  imageAlt?: string
}

export interface Editorial17Props {
  /** Chamada com a patinha acima do título (ex.: "Guia do tutor"). */
  eyebrow?: string
  title?: string
  viewAllLabel?: string
  viewAllUrl?: string
  /** Link com a seta da matéria em destaque (ex.: "Ler a dica"). */
  readLabel?: string
  stories?: Editorial17Story[]
  /** Cartão de ajuda no pé da coluna (só desktop). Sem título, some. */
  helpTitle?: string
  helpText?: string
  helpLabel?: string
  helpUrl?: string
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Editorial17`).
const editorial17Mock: Editorial17Props = {
  eyebrow: 'Guia do tutor',
  title: 'Cuidar bem também se aprende',
  viewAllLabel: 'Ver todas as dicas',
  viewAllUrl: '/dicas',
  readLabel: 'Ler a dica',
  stories: [
    {
      eyebrow: 'Nutrição',
      title: 'Como trocar a ração do seu cão sem dor de barriga',
      text: 'O passo a passo de 7 dias para misturar a ração nova com a antiga e o que observar no caminho.',
      url: '/dicas/trocar-a-racao',
      imageAlt: 'Cão comendo ração',
    },
    { eyebrow: 'Gatos', title: 'Gato que bebe pouca água: 5 truques que funcionam', meta: '4 min de leitura', url: '/dicas/gato-agua' },
    { eyebrow: 'Filhotes', title: 'Primeiro passeio do filhote: o que levar na bolsa', meta: '3 min de leitura', url: '/dicas/primeiro-passeio' },
  ],
  helpTitle: 'Dúvida sobre o seu pet?',
  helpText: 'Nossa equipe das lojas responde pelo WhatsApp, de segunda a sábado.',
  helpLabel: 'Falar com a loja',
  helpUrl: '/atendimento',
}

const Seta = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
)

const Patinha = () => (
  <svg className={styles.paw} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
    <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
    <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
    <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
  </svg>
)

function Arte({ s, className, w, h }: { s: Editorial17Story; className: string; w: number; h: number }) {
  return (
    <span className={className} data-role="ed-image">
      {(s.imageDesktop || s.imageMobile) && (
        <picture>
          {s.imageMobile && <source media="(max-width: 960px)" srcSet={s.imageMobile} />}
          <img src={s.imageDesktop || s.imageMobile} alt={s.imageAlt ?? ''} width={w} height={h} loading="lazy" decoding="async" />
        </picture>
      )}
    </span>
  )
}

export default function Editorial17() {
  const { eyebrow, title, viewAllLabel, viewAllUrl, readLabel, stories = [], helpTitle, helpText, helpLabel, helpUrl } = editorial17Mock
  if (!stories.length) return null
  const [destaque, ...demais] = stories

  return (
    <div className={styles.editorial17Box}>
      <section className={styles.editorial17} aria-label={title || 'Editorial'} data-role="ed-root">
        <link rel="stylesheet" href={FONTES_17} />
        <div className={styles.inner}>
          {(eyebrow || title || viewAllLabel) && (
            <div className={styles.head}>
              {(eyebrow || title) && (
                <div className={styles.headCopy}>
                  {eyebrow && (
                    <span className={styles.eyebrow} data-role="ed-eyebrow">
                      <Patinha />
                      {eyebrow}
                    </span>
                  )}
                  {title && (
                    <h2 className={styles.title} data-role="ed-title">
                      {title}
                    </h2>
                  )}
                </div>
              )}
              {viewAllLabel && (
                <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="ed-view-all">
                  {viewAllLabel}
                  <Chevron />
                </a>
              )}
            </div>
          )}
          <div className={styles.grid}>
            <a className={styles.feature} href={destaque.url || '#'} data-role="ed-feature">
              <Arte s={destaque} className={styles.featureArt} w={1280} h={680} />
              <span className={styles.featureCopy}>
                {destaque.eyebrow && <span className={styles.tag}>{destaque.eyebrow}</span>}
                {destaque.title && <span className={styles.featureTitle}>{destaque.title}</span>}
                {destaque.text && <span className={styles.featureText}>{destaque.text}</span>}
                {readLabel && (
                  <span className={styles.read}>
                    {readLabel}
                    <Seta />
                  </span>
                )}
              </span>
            </a>
            {(demais.length > 0 || helpTitle) && (
              <div className={styles.side}>
                {demais.map((s, i) => (
                  <a key={i} className={styles.story} href={s.url || '#'} data-role="ed-story">
                    <Arte s={s} className={styles.thumb} w={300} h={300} />
                    <span className={styles.storyCopy}>
                      {s.eyebrow && <span className={styles.tag}>{s.eyebrow}</span>}
                      {s.title && <span className={styles.storyTitle}>{s.title}</span>}
                      {s.meta && <span className={styles.meta}>{s.meta}</span>}
                    </span>
                  </a>
                ))}
                {helpTitle && (
                  <a className={styles.help} href={helpUrl || '#'} data-role="ed-help">
                    <span className={styles.helpTitle}>{helpTitle}</span>
                    {helpText && <span className={styles.helpText}>{helpText}</span>}
                    {helpLabel && (
                      <span className={styles.helpLink}>
                        {helpLabel}
                        <Seta />
                      </span>
                    )}
                  </a>
                )}
              </div>
            )}
          </div>
          {viewAllLabel && (
            <a className={styles.viewAllMob} href={viewAllUrl || '#'} data-role="ed-view-all-mob">
              {viewAllLabel}
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
