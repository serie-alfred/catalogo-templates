import React from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial10` do faststore.starter (família 10, Varejo;
 * desenho `Editorial10`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá, por baixo do que o CS subir (`useConteudoDaSecao`): três matérias sem arte (o
 * starter só renderiza `<picture>` com URL; vale o fundo da mídia).
 */

interface Post {
  tag?: string;
  title?: string;
  excerpt?: string;
  readTime?: string;
  linkLabel?: string;
  url?: string;
  imageDesktop?: string;
  imageMobile?: string;
  imageAlt?: string;
}

/** O conteúdo da seção: os campos do `section.schema` do Editorial10. */
interface Editorial10Conteudo {
  title?: string;
  text?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  posts: Post[];
}

const MOCK: Editorial10Conteudo = {
  title: 'Guia de compras',
  text: 'Dicas para escolher melhor antes de colocar no carrinho.',
  viewAllLabel: 'Ver todos os guias',
  viewAllUrl: '/guias',
  posts: [
    {
      tag: 'Dicas',
      title: 'Como escolher a Smart TV ideal para a sua sala',
      excerpt:
        'Tamanho de tela, resolução e distância do sofá: o que considerar.',
      readTime: '5 min de leitura',
      linkLabel: 'Ler guia',
      url: '/guias/smart-tv',
    },
    {
      tag: 'Guia',
      title: 'Air fryer: qual capacidade comprar para a sua família',
      excerpt: 'Litros, potência e recursos que fazem diferença no dia a dia.',
      readTime: '4 min de leitura',
      linkLabel: 'Ler guia',
      url: '/guias/air-fryer',
    },
    {
      tag: 'Comparativo',
      title: 'Notebook para trabalho e estudo: o que olhar antes de comprar',
      excerpt:
        'Processador, memória e armazenamento explicados sem complicação.',
      readTime: '6 min de leitura',
      linkLabel: 'Ler guia',
      url: '/guias/notebook',
    },
  ],
};

export default function Editorial10() {
  const { title, text, viewAllLabel, viewAllUrl, posts } =
    useConteudoDaSecao(MOCK);
  if (!posts.length) return null;

  return (
    <div className={styles.editorial10Box}>
      <section
        className={styles.editorial10}
        aria-label={title || 'Guia de compras'}
        data-role="ed-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.heading}>
              {title && (
                <h2 className={styles.title} data-role="ed-title">
                  {title}
                </h2>
              )}
              {text && (
                <p className={styles.text} data-role="ed-text">
                  {text}
                </p>
              )}
            </div>
            {viewAllLabel && (
              <a
                className={styles.viewAll}
                href={viewAllUrl || '#'}
                data-role="ed-view-all"
              >
                {viewAllLabel}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  aria-hidden="true"
                >
                  <path d="m9 6 6 6-6 6" />
                </svg>
              </a>
            )}
          </div>
          <ul className={styles.list}>
            {posts.map((p, i) => (
              <li key={i} className={styles.card} data-role="ed-item">
                <a
                  className={styles.media}
                  href={p.url || '#'}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {(p.imageDesktop || p.imageMobile) && (
                    <picture>
                      {p.imageMobile && (
                        <source
                          media="(max-width: 960px)"
                          srcSet={p.imageMobile}
                        />
                      )}
                      <img
                        src={p.imageDesktop || p.imageMobile}
                        alt=""
                        width={400}
                        height={300}
                        loading="lazy"
                        decoding="async"
                      />
                    </picture>
                  )}
                </a>
                <div className={styles.body}>
                  {p.tag && <span className={styles.tag}>{p.tag}</span>}
                  {p.title && (
                    <a className={styles.postTitle} href={p.url || '#'}>
                      {p.title}
                    </a>
                  )}
                  {p.excerpt && <p className={styles.excerpt}>{p.excerpt}</p>}
                  {(p.readTime || p.linkLabel) && (
                    <div className={styles.foot}>
                      {p.readTime && (
                        <span className={styles.readTime}>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                          >
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 7v5l3 2" />
                          </svg>
                          {p.readTime}
                        </span>
                      )}
                      {p.linkLabel && (
                        <a
                          className={styles.read}
                          href={p.url || '#'}
                          aria-label={
                            p.title ? `${p.linkLabel}: ${p.title}` : undefined
                          }
                        >
                          {p.linkLabel}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            aria-hidden="true"
                          >
                            <path d="M5 12h14M13 6l6 6-6 6" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {viewAllLabel && (
            <a className={styles.viewAllMob} href={viewAllUrl || '#'}>
              {viewAllLabel}
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Editorial10.conteudoPadrao = MOCK;
