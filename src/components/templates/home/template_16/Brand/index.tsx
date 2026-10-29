import React from 'react'
import styles from './index.module.css'

/**
 * Espelha `molecules/Brands16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.brands16Box` (container das @container).
 */

// Conteúdo do mock.ts do starter.
// Mock de validação local — exibido quando o CMS não envia conteúdo (MOCK_ENABLED).
// Textos literais do desenho `Brand16` (as marcas são placeholders "[Marca NN]" no desenho).
const brands16Mock: Brands16Props = {
  title: 'Marcas que a criançada ama',
  viewAllLabel: 'Ver todas as marcas',
  viewAllUrl: '/s',
  brands: ['01', '02', '03', '04', '05', '06'].map((n) => ({ name: `[Marca ${n}]`, url: '/s' })),
}


/**
 * Brands16 — marcas da família 16 (Infantil; desenho `Brand16` / `Brand16-mobile`). Título em
 * Fredoka e "Ver todas as marcas" sublinhado; as marcas em pílulas brancas com filete suave (o
 * nome em Fredoka ou o logo do CMS), seis por linha no desktop e duas no mobile. No hover a pílula
 * ganha o filete escuro e a sombra chapada (a "[Marca 03]" do desenho). Mobile: o "Ver todas" vira
 * botão em pílula no pé (o mesmo campo).
 *
 * Apresentacional — sem evento de analytics e sem valor de commerce.
 */
export interface Brands16Brand {
  name?: string
  url?: string
  /** Logo (opcional; sem logo vale o nome). */
  logo?: string
}

export interface Brands16Props {
  title?: string
  viewAllLabel?: string
  viewAllUrl?: string
  brands?: Brands16Brand[]
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

export default function Brand16() {
  const { title, viewAllLabel, viewAllUrl, brands = [] } = brands16Mock
  if (!brands.length) return null

  return (
    <div className={styles.brands16Box}>
    <section className={styles.brands16} aria-label={title || 'Marcas'} data-role="br-root">
      <link rel="stylesheet" href={FONTES} />
      <div className={styles.inner}>
        {(title || viewAllLabel) && (
          <div className={styles.head}>
            {title && (
              <h2 className={styles.title} data-role="br-title">
                {title}
              </h2>
            )}
            {viewAllLabel && (
              <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="br-view-all">
                {viewAllLabel}
              </a>
            )}
          </div>
        )}
        <ul className={styles.list}>
          {brands.map((b, i) => (
            <li key={i} data-role="br-item">
              <a className={styles.brand} href={b.url || '#'} aria-label={b.logo ? b.name : undefined}>
                {b.logo ? <img src={b.logo} alt="" height={48} loading="lazy" decoding="async" /> : b.name}
              </a>
            </li>
          ))}
        </ul>
        {viewAllLabel && (
          <a className={styles.viewAllMob} href={viewAllUrl || '#'} data-role="br-view-all-mob">
            {viewAllLabel}
          </a>
        )}
      </div>
    </section>
    </div>
  )
}
