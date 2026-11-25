import React from 'react'

import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao'

import styles from './index.module.css'

/**
 * Espelha `molecules/Categories16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá, por baixo do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 * A seção fica dentro do envelope `.categories16Box` (container das @container).
 */

/**
 * Categories16 — categorias da família 16 (Infantil; desenho `Categories16` /
 * `Categories16-mobile`). Título em Fredoka e "Ver todas as categorias" sublinhado na cor de
 * destaque; embaixo, as categorias em círculos com filete (a foto do CMS dentro; sem foto, o
 * pastel da posição) e o nome numa pílula branca. Mobile: grade de 3, o nome sem pílula e o
 * "Ver todas" vira botão em pílula no pé (o mesmo campo, em outro lugar).
 *
 * Apresentacional — sem evento de analytics e sem valor de commerce.
 */
interface Categories16Conteudo {
  title?: string
  viewAllLabel?: string
  viewAllUrl?: string
  categories: {
    name?: string
    url?: string
    /** Foto da categoria (quadrada, 344 × 344), recortada no círculo. */
    image?: string
    imageAlt?: string
  }[]
}

// Textos literais do desenho `Categories16`. Sem foto: o desenho também não tem (valem os pastéis).
const MOCK: Categories16Conteudo = {
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

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

export default function Categories16() {
  const { title, viewAllLabel, viewAllUrl, categories } = useConteudoDaSecao(MOCK)
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
                    {c.image && (
                      <img src={c.image} alt={c.imageAlt ?? ''} width={344} height={344} loading="lazy" decoding="async" />
                    )}
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

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Categories16.conteudoPadrao = MOCK;
