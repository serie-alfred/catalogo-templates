import React from 'react';

import styles from './index.module.css';
import { FONTES_14 } from '@/components/templates/common/template_14/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

/**
 * Espelha `organisms/Editorial14` do faststore.starter (família 14, Esportiva; desenho
 * `Editorial14`): fundo cinza-azulado, o título em Saira itálica e "Ver todos os guias"; o
 * guia de destaque com a arte 2:1, a placa marinho com o número, a chamada com o traço
 * vermelho, o título, o texto e o link; os demais empilhados ao lado com o número vermelho da
 * posição. Mesmo markup, classes e `data-role`; CSS derivado do SCSS.
 *
 * Conteúdo = o mock.ts de lá, sem arte (vale o placeholder por posição, como lá), por baixo do
 * que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 */
type Story = {
  eyebrow?: string;
  title?: string;
  text?: string;
  linkLabel?: string;
  plateTitle?: string;
  plateText?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
};

interface Editorial14Conteudo {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  /** A 1ª é o destaque. */
  stories: Story[];
}

const MOCK: Editorial14Conteudo = {
  title: 'Treine com a gente',
  viewAllLabel: 'Ver todos os guias',
  viewAllUrl: '/s',
  stories: [
  {
    eyebrow: 'Plano de treino',
    title: 'Do zero aos 10 km: o plano completo para iniciantes',
    text: 'Três treinos por semana, com progressão de volume, educativos de corrida e dicas de recuperação.',
    linkLabel: 'Ler o guia',
    plateTitle: '10 km',
    plateText: 'em 8 semanas',
    url: '/s',
    imageAlt: 'Corredora em treino de rua',
  },
  { eyebrow: 'Hidratação', title: 'Quanto beber antes, durante e depois do treino', url: '/s' },
  { eyebrow: 'Suplementos', title: 'Whey isolado ou concentrado: qual escolher', url: '/s' },
  ],
};

const Seta = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

const Arte = ({ s, w, h }: { s: Story; w: number; h: number }) =>
  s.imageDesktop || s.imageMobile ? (
    <picture className={styles.img}>
      {s.imageMobile && <source media="(max-width: 960px)" srcSet={s.imageMobile} />}
      <img src={s.imageDesktop || s.imageMobile} alt={s.imageAlt ?? ''} width={w} height={h} />
    </picture>
  ) : null;

const Chamada = ({ texto }: { texto?: string }) =>
  texto ? (
    <span className={styles.eyebrow}>
      <span className={styles.tick} aria-hidden="true" />
      {texto}
    </span>
  ) : null;

export default function Editorial14() {
  const { title, viewAllLabel, viewAllUrl, stories } = useConteudoDaSecao(MOCK);
  if (!stories.length) return null;
  const [destaque, ...demais] = stories;

  return (
    <div className={styles.editorial14Box}>
      <section className={styles.editorial14} aria-label={title || 'Editorial'} data-role="ed-root">
        <link rel="stylesheet" href={FONTES_14} />
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
                  <Seta className={styles.viewAllIcon} />
                </a>
              )}
            </div>
          )}
          <div className={styles.grid}>
            <a className={styles.featured} href={destaque.url || '#'} data-role="ed-featured">
              <span className={styles.featuredArt}>
                <Arte s={destaque} w={1600} h={800} />
                {(destaque.plateTitle || destaque.plateText) && (
                  <span className={styles.plate}>
                    {destaque.plateTitle}
                    {destaque.plateText && <span className={styles.plateText}>{destaque.plateText}</span>}
                  </span>
                )}
              </span>
              <Chamada texto={destaque.eyebrow} />
              {destaque.title && <span className={styles.featuredTitle}>{destaque.title}</span>}
              {destaque.text && <span className={styles.text}>{destaque.text}</span>}
              {destaque.linkLabel && (
                <span className={styles.link}>
                  {destaque.linkLabel}
                  <Seta className={styles.linkIcon} />
                </span>
              )}
            </a>
            {demais.length > 0 && (
            <ul className={styles.side}>
              {demais.map((s, i) => (
                <li key={i} className={styles.sideItem}>
                  <a className={styles.story} href={s.url || '#'} data-role="ed-story">
                    <span className={styles.storyArt}>
                      <Arte s={s} w={800} h={450} />
                      <span className={styles.num} aria-hidden="true">
                        {String(i + 2).padStart(2, '0')}
                      </span>
                    </span>
                    <span className={styles.storyBody}>
                      <Chamada texto={s.eyebrow} />
                      {s.title && <span className={styles.storyTitle}>{s.title}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Editorial14.conteudoPadrao = MOCK;
