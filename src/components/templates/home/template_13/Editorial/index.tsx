import React from 'react';

import { FONTES_13 } from '@/components/templates/common/template_13/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial13` do faststore.starter (família 13, Noturno; desenho
 * `Editorial13` / `Editorial13-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá
 * (a 1ª matéria é o destaque; sem arte: valem os grafites de placeholder do CSS).
 *
 * Conteúdo: o MOCK abaixo por baixo do que o CS subir (`useConteudoDaSecao`, campos do
 * schema de lá).
 */
/** Uma matéria, como o schema a declara. */
interface Editorial13Story {
  eyebrow?: string;
  title?: string;
  linkLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

/** O conteúdo da seção: os campos do `section.schema` do Editorial13. */
interface Editorial13Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  stories: Editorial13Story[];
}

const MOCK: Editorial13Conteudo = {
  title: 'Cultura',
  viewAllLabel: 'Ver todas as matérias',
  viewAllUrl: '/s',
  stories: [
    {
      eyebrow: 'Bastidores',
      title: 'Por trás do Drop 07: do rascunho ao refletivo',
      linkLabel: 'Ler matéria',
      url: '/s',
      imageAlt: 'Por trás do Drop 07',
    },
    {
      eyebrow: 'Entrevista',
      title: '[Nome do artista] fala sobre a colab de inverno',
      url: '/s',
      imageAlt: '',
    },
    {
      eyebrow: 'Guia',
      title: 'Como escolher o tamanho certo do seu tênis',
      url: '/s',
      imageAlt: '',
    },
  ],
};

const Seta = () => (
  <svg
    className={styles.arrow}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

function Arte({
  s,
  className,
  w,
  h,
}: {
  s: Editorial13Story;
  className: string;
  w: number;
  h: number;
}) {
  return (
    <span className={className}>
      {(s.imageDesktop || s.imageMobile) && (
        <picture>
          {s.imageMobile && (
            <source media="(max-width: 960px)" srcSet={s.imageMobile} />
          )}
          <img
            src={s.imageDesktop || s.imageMobile}
            alt={s.imageAlt ?? ''}
            width={w}
            height={h}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
    </span>
  );
}

export default function Editorial13() {
  const { title, viewAllLabel, viewAllUrl, stories } = useConteudoDaSecao(MOCK);
  if (!stories.length) return null;
  const [destaque, ...demais] = stories;

  return (
    <div className={styles.editorial13Box}>
      <section
        className={styles.editorial13}
        aria-label={title || 'Editorial'}
        data-role="ed-root"
      >
        <link rel="stylesheet" href={FONTES_13} />
        <div className={styles.inner}>
          {(title || viewAllLabel) && (
            <div className={styles.head}>
              {title && (
                <h2 className={styles.title} data-role="ed-title">
                  {title}
                </h2>
              )}
              {viewAllLabel && (
                <a
                  className={styles.viewAll}
                  href={viewAllUrl || '#'}
                  data-role="ed-view-all"
                >
                  <span>{viewAllLabel}</span>
                </a>
              )}
            </div>
          )}
          <div className={styles.grid}>
            <a
              className={styles.feature}
              href={destaque.url || '#'}
              data-role="ed-feature"
            >
              <Arte
                s={destaque}
                className={styles.featureArt}
                w={1600}
                h={1080}
              />
              <span className={styles.featureCopy}>
                {destaque.eyebrow && (
                  <span className={styles.featureEyebrow}>
                    {destaque.eyebrow}
                  </span>
                )}
                {destaque.title && (
                  <span className={styles.featureTitle}>{destaque.title}</span>
                )}
                {destaque.linkLabel && (
                  <span className={styles.featureLink}>
                    {destaque.linkLabel}
                    <Seta />
                  </span>
                )}
              </span>
            </a>
            {demais.length > 0 && (
              <div className={styles.list}>
                {demais.map((s, i) => (
                  <a
                    key={i}
                    className={styles.story}
                    href={s.url || '#'}
                    data-role="ed-story"
                  >
                    <Arte s={s} className={styles.storyArt} w={600} h={340} />
                    <span className={styles.storyCopy}>
                      {s.eyebrow && (
                        <span className={styles.storyEyebrow}>{s.eyebrow}</span>
                      )}
                      {s.title && (
                        <span className={styles.storyTitle}>{s.title}</span>
                      )}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Editorial13.conteudoPadrao = MOCK;
