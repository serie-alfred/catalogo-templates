import React from 'react'
import styles from './index.module.css'

/**
 * Espelha `molecules/Categories16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.categories16Box` (container das @container).
 */

// Conteúdo do mock.ts do starter.
// Mock de validação local — exibido quando o CMS não envia conteúdo (MOCK_ENABLED).
// Textos literais do desenho `Categories16`. Sem foto: o desenho também não tem (valem os pastéis).
const categories16Mock: Categories16Props = {
  title: 'Pra cada fase, uma alegria',
  viewAllLabel: 'Ver todas as categorias',
  viewAllUrl: '/s',
  categories: [
    { name: 'Brinquedos', url: '/s' },
    { name: 'Roupas', url: '/s' },
    { name: 'Bebê', url: '/s' },
    { name: 'Livros', url: '/s' },
    { name: 'Papelaria', url: '/s' },
    { name: 'Fantasias', url: '/s' },
  ],
}


/**
 * Categories16 — categorias da família 16 (Infantil; desenho `Categories16` /
 * `Categories16-mobile`). Título em Fredoka e "Ver todas as categorias" sublinhado na cor de
 * destaque; embaixo, as categorias em círculos com filete (a foto do CMS dentro; sem foto, o
 * pastel da posição) e o nome numa pílula branca. Mobile: grade de 3, o nome sem pílula e o
 * "Ver todas" vira botão em pílula no pé (o mesmo campo, em outro lugar).
 *
 * Apresentacional — sem evento de analytics e sem valor de commerce.
 */
export interface Categories16Category {
  name?: string
  url?: string
  /** Foto da categoria (quadrada, 344 × 344), recortada no círculo. */
  image?: string
  imageAlt?: string
}

export interface Categories16Props {
  title?: string
  viewAllLabel?: string
  viewAllUrl?: string
  categories?: Categories16Category[]
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

export default function Categories16() {
  const { title, viewAllLabel, viewAllUrl, categories = [] } = categories16Mock
  if (!categories.length) return null

  return (
    <div className={styles.categories16Box}>
    <section className={styles.categories16} aria-label={title || 'Categorias'} data-role="ct-root">
      <link rel="stylesheet" href={FONTES} />
      <div className={styles.inner}>
        {(title || viewAllLabel) && (
          <div className={styles.head}>
            {title && (
              <h2 className={styles.title} data-role="ct-title">
                {title}
              </h2>
            )}
            {viewAllLabel && (
              <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="ct-view-all">
                {viewAllLabel}
              </a>
            )}
          </div>
        )}
        <ul className={styles.list}>
          {categories.map((c, i) => (
            <li key={i} data-role="ct-item">
              <a className={styles.link} href={c.url || '#'}>
                <span className={`${styles.thumb} ${styles[`tom${i % 4}`]}`}>
                  {c.image && <img src={c.image} alt={c.imageAlt ?? ''} width={344} height={344} loading="lazy" decoding="async" />}
                </span>
                {c.name && <span className={styles.label}>{c.name}</span>}
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
