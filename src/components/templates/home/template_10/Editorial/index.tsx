import React from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `organisms/Editorial10` do faststore.starter (família 10, Varejo;
 * desenho `Editorial10`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá: três matérias sem arte (o starter só renderiza `<picture>` com URL; vale o
 * fundo da mídia).
 */

interface Post {
  tag: string;
  title: string;
  excerpt: string;
  readTime: string;
  linkLabel: string;
}

const TITLE = 'Guia de compras';
const TEXT = 'Dicas para escolher melhor antes de colocar no carrinho.';
const VIEW_ALL = 'Ver todos os guias';
const POSTS: Post[] = [
  {
    tag: 'Dicas',
    title: 'Como escolher a Smart TV ideal para a sua sala',
    excerpt:
      'Tamanho de tela, resolução e distância do sofá: o que considerar.',
    readTime: '5 min de leitura',
    linkLabel: 'Ler guia',
  },
  {
    tag: 'Guia',
    title: 'Air fryer: qual capacidade comprar para a sua família',
    excerpt: 'Litros, potência e recursos que fazem diferença no dia a dia.',
    readTime: '4 min de leitura',
    linkLabel: 'Ler guia',
  },
  {
    tag: 'Comparativo',
    title: 'Notebook para trabalho e estudo: o que olhar antes de comprar',
    excerpt: 'Processador, memória e armazenamento explicados sem complicação.',
    readTime: '6 min de leitura',
    linkLabel: 'Ler guia',
  },
];

export default function Editorial10() {
  return (
    <div className={styles.editorial10Box}>
      <section
        className={styles.editorial10}
        aria-label={TITLE}
        data-role="ed-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <div className={styles.heading}>
              <h2 className={styles.title} data-role="ed-title">
                {TITLE}
              </h2>
              <p className={styles.text} data-role="ed-text">
                {TEXT}
              </p>
            </div>
            <a className={styles.viewAll} href="#" data-role="ed-view-all">
              {VIEW_ALL}
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
          </div>
          <ul className={styles.list}>
            {POSTS.map(p => (
              <li key={p.title} className={styles.card} data-role="ed-item">
                <a
                  className={styles.media}
                  href="#"
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <div className={styles.body}>
                  <span className={styles.tag}>{p.tag}</span>
                  <a className={styles.postTitle} href="#">
                    {p.title}
                  </a>
                  <p className={styles.excerpt}>{p.excerpt}</p>
                  <div className={styles.foot}>
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
                    <a
                      className={styles.read}
                      href="#"
                      aria-label={`${p.linkLabel}: ${p.title}`}
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
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <a className={styles.viewAllMob} href="#">
            {VIEW_ALL}
          </a>
        </div>
      </section>
    </div>
  );
}
