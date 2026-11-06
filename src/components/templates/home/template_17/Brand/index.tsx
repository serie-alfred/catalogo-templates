import React from 'react'
import { FONTES_17 as FONTES } from '@/components/templates/common/template_17/Spot'
import styles from './index.module.css'

/**
 * Espelha `molecules/Brands17` do faststore.starter (família 17, Pet; desenho `Brand17` /
 * `Brand17-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de Nível 1;
 * o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá. A seção fica dentro do envelope
 * `.brands17Box` (container das @container).
 *
 * Título em Bricolage e "Ver todas as marcas" com o chevron na cor de destaque; as marcas em
 * quadros do primário a 9% com raio 16 (sem logo no mock: vale o nome), seis por linha no
 * desktop e duas no mobile, onde o "Ver todas" desce para o pé.
 *
 * O que sai: o `withMock` (o conteúdo é o mock, inline).
 */

interface Brands17Brand {
  name?: string
  url?: string
  /** Logo (opcional; sem logo vale o nome). */
  logo?: string
}

interface Brands17Props {
  title?: string
  viewAllLabel?: string
  viewAllUrl?: string
  brands?: Brands17Brand[]
}

// Conteúdo do mock.ts do starter (nomes do desenho; sem logo: vale o nome).
const brands17Mock: Brands17Props = {
  title: 'Marcas que os pets amam',
  viewAllLabel: 'Ver todas as marcas',
  viewAllUrl: '/marcas',
  brands: [
    { name: 'Nobre Pet', url: '/nobre-pet' },
    { name: 'Felis', url: '/felis' },
    { name: 'Vitta Pet', url: '/vitta-pet' },
    { name: 'Casa do Bicho', url: '/casa-do-bicho' },
    { name: 'Aquaviva', url: '/aquaviva' },
    { name: 'Pena Leve', url: '/pena-leve' },
  ],
}


const Chevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export default function Brand17() {
  const { title, viewAllLabel, viewAllUrl, brands = [] } = brands17Mock
  if (!brands.length) return null

  const verTodas = (className: string, role: string) =>
    viewAllLabel && (
      <a className={className} href={viewAllUrl || '#'} data-role={role}>
        {viewAllLabel}
        <Chevron />
      </a>
    )

  return (
    <div className={styles.brands17Box}>
      <section className={styles.brands17} aria-label={title || 'Marcas'} data-role="br-root">
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.inner}>
          {(title || viewAllLabel) && (
            <div className={styles.head}>
              {title && (
                <h2 className={styles.title} data-role="br-title">
                  {title}
                </h2>
              )}
              {verTodas(styles.viewAll, 'br-view-all')}
            </div>
          )}
          <ul className={styles.list}>
            {brands.map((b, i) => (
              <li key={i} className={styles.item} data-role="br-item">
                <a className={styles.brand} href={b.url || '#'} aria-label={b.logo ? b.name : undefined}>
                  {b.logo ? <img src={b.logo} alt="" height={48} loading="lazy" decoding="async" /> : b.name}
                </a>
              </li>
            ))}
          </ul>
          {verTodas(styles.viewAllMob, 'br-view-all-mob')}
        </div>
      </section>
    </div>
  )
}
