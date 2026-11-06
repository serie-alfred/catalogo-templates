import React from 'react'
import { FONTES_17 } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `molecules/Categories17` do faststore.starter (família 17, Pet). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.categories17Box` (container das @container).
 * Sem divergência deliberada: sem foto no mock, vale o recorte neutro de cada posição.
 */

export interface Categories17Category {
  name?: string
  url?: string
  /** Foto (quadrada; vai no recorte orgânico). Sem foto, o recorte neutro do desenho. */
  image?: string
  imageAlt?: string
}

export interface Categories17Props {
  /** Chamada acima do título, com a patinha (ex.: "Para cada bicho, o que ele precisa"). */
  eyebrow?: string
  title?: string
  viewAllLabel?: string
  viewAllUrl?: string
  categories?: Categories17Category[]
}

// Conteúdo do mock.ts do starter (textos literais do desenho `Categories17`).
const categories17Mock: Categories17Props = {
  eyebrow: 'Para cada bicho, o que ele precisa',
  title: 'Compre por pet',
  viewAllLabel: 'Ver todas as categorias',
  viewAllUrl: '/s',
  categories: [
    { name: 'Cachorro', url: '/cachorro' },
    { name: 'Gato', url: '/gato' },
    { name: 'Pássaro', url: '/passaro' },
    { name: 'Peixe', url: '/peixe' },
    { name: 'Roedor', url: '/roedor' },
    { name: 'Réptil', url: '/reptil' },
  ],
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

const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export default function Categories17() {
  const { eyebrow, title, viewAllLabel, viewAllUrl, categories = [] } = categories17Mock
  if (!categories.length) return null

  return (
    <div className={styles.categories17Box}>
      <section className={styles.categories17} aria-label={title || 'Categorias'} data-role="ct-root">
        <link rel="stylesheet" href={FONTES_17} />
        <div className={styles.inner}>
          {(eyebrow || title || viewAllLabel) && (
            <div className={styles.head}>
              {(eyebrow || title) && (
                <div className={styles.headCopy}>
                  {eyebrow && (
                    <span className={styles.eyebrow} data-role="ct-eyebrow">
                      <Patinha />
                      {eyebrow}
                    </span>
                  )}
                  {title && (
                    <h2 className={styles.title} data-role="ct-title">
                      {title}
                    </h2>
                  )}
                </div>
              )}
              {viewAllLabel && (
                <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="ct-view-all">
                  {viewAllLabel}
                  <Chevron />
                </a>
              )}
            </div>
          )}
          <ul className={styles.list}>
            {categories.map((c, i) => (
              <li key={i} className={styles.item} data-role="ct-item">
                <a className={styles.link} href={c.url || '#'}>
                  <span className={styles.frame}>
                    <span className={styles.blob} data-role="ct-image">
                      {c.image && <img src={c.image} alt={c.imageAlt ?? ''} width={344} height={344} loading="lazy" decoding="async" />}
                    </span>
                  </span>
                  {c.name && <span className={styles.name}>{c.name}</span>}
                </a>
              </li>
            ))}
          </ul>
          {viewAllLabel && (
            <a className={styles.viewAllMob} href={viewAllUrl || '#'} data-role="ct-view-all-mob">
              {viewAllLabel}
            </a>
          )}
        </div>
      </section>
    </div>
  )
}
