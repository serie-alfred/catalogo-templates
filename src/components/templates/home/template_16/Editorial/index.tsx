import React from 'react'
import styles from './index.module.css'

/**
 * Espelha `organisms/Editorial16` do faststore.starter (família 16, Infantil). Mesmo markup, mesmas classes,
 * mesmos `data-role` e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo =
 * o mock.ts de lá. A seção fica dentro do envelope `.editorial16Box` (container das @container).
 */

// Conteúdo do mock.ts do starter.
// Mock de validação local — exibido quando o CMS não envia conteúdo (MOCK_ENABLED).
// Textos literais do desenho `Editorial16`. Sem arte: o desenho também não tem (valem os pastéis).
const editorial16Mock: Editorial16Props = {
  title: 'Diário dos pequenos',
  viewAllLabel: 'Ver todas as dicas',
  viewAllUrl: '/s',
  stories: [
    {
      eyebrow: 'Brincar e aprender',
      title: '10 brincadeiras para os dias de chuva, sem sair de casa',
      text: 'Cabana de lençol, caça ao tesouro e massinha caseira: ideias simples para a criançada gastar energia.',
      url: '/s',
      imageAlt: '10 brincadeiras para os dias de chuva',
    },
    {
      eyebrow: 'Guia de tamanhos',
      title: 'Como escolher o tamanho certo para quem cresce rápido',
      url: '/s',
      imageAlt: 'Guia de tamanhos',
    },
    {
      eyebrow: 'Leitura',
      title: 'Livros certos para cada idade, do berço à alfabetização',
      url: '/s',
      imageAlt: 'Livros para cada idade',
    },
  ],
}


/**
 * Editorial16 — dicas/editorial da família 16 (Infantil; desenho `Editorial16` /
 * `Editorial16-mobile`). Título em Fredoka e "Ver todas as dicas" sublinhado; a 1ª matéria é o
 * destaque (duas colunas: arte larga arredondada com filete, a pílula da chamada, o título e o
 * texto) e as demais empilham na 3ª coluna (arte, chamada e título). Mobile: o destaque em cima
 * (sem o texto), as demais em linha com a miniatura quadrada e um filete tracejado, e o "Ver
 * todas" vira botão em pílula no pé (o mesmo campo).
 *
 * Arte desktop e mobile em campos separados em todas as matérias (contrato §2).
 * Apresentacional — sem evento de analytics e sem valor de commerce.
 */
export interface Editorial16Story {
  /** Chamada em pílula (ex.: "Brincar e aprender"). */
  eyebrow?: string
  title?: string
  /** Texto de apoio (só o destaque mostra, e só no desktop). */
  text?: string
  url?: string
  imageDesktop?: string
  imageMobile?: string
  imageAlt?: string
}

export interface Editorial16Props {
  title?: string
  viewAllLabel?: string
  viewAllUrl?: string
  stories?: Editorial16Story[]
}

const FONTES = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap'

const Arte = ({ s, w, h }: { s: Editorial16Story; w: number; h: number }) =>
  s.imageDesktop || s.imageMobile ? (
    <picture>
      {s.imageMobile && <source media="(max-width: 960px)" srcSet={s.imageMobile} />}
      <img src={s.imageDesktop || s.imageMobile} alt={s.imageAlt ?? ''} width={w} height={h} loading="lazy" decoding="async" />
    </picture>
  ) : null

export default function Editorial16() {
  const { title, viewAllLabel, viewAllUrl, stories = [] } = editorial16Mock
  if (!stories.length) return null
  const [destaque, ...demais] = stories

  return (
    <div className={styles.editorial16Box}>
    <section className={styles.editorial16} aria-label={title || 'Editorial'} data-role="ed-root">
      <link rel="stylesheet" href={FONTES} />
      <div className={styles.inner}>
        {(title || viewAllLabel) && (
          <div className={styles.head}>
            {title && (
              <h2 className={styles.title} data-role="ed-title">
                {title}
              </h2>
            )}
            {viewAllLabel && (
              <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="ed-view-all">
                {viewAllLabel}
              </a>
            )}
          </div>
        )}
        <div className={styles.grid}>
          <a className={styles.featured} href={destaque.url || '#'} data-role="ed-featured">
            <span className={styles.featuredArt}>
              <Arte s={destaque} w={1600} h={680} />
            </span>
            {destaque.eyebrow && <span className={styles.chip}>{destaque.eyebrow}</span>}
            {destaque.title && <h3 className={styles.featuredTitle}>{destaque.title}</h3>}
            {destaque.text && <p className={styles.featuredText}>{destaque.text}</p>}
          </a>
          {demais.length > 0 && (
            <div className={styles.side}>
              {demais.map((s, i) => (
                <a key={i} className={styles.story} href={s.url || '#'} data-role="ed-story">
                  <span className={`${styles.storyArt} ${styles[`tom${i % 3}`]}`}>
                    <Arte s={s} w={600} h={336} />
                  </span>
                  <span className={styles.storyCopy}>
                    {s.eyebrow && <span className={styles.chipSmall}>{s.eyebrow}</span>}
                    {s.title && <h3 className={styles.storyTitle}>{s.title}</h3>}
                  </span>
                </a>
              ))}
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
