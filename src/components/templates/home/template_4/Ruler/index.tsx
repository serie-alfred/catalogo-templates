'use client';
import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do Ruler04. */
interface Ruler04Conteudo {
  seals: { image?: string; title?: string; link?: string }[];
}

const MOCK: Ruler04Conteudo = {
  seals: [
    { image: 'https://placehold.co/300x77', title: 'Título 1', link: '#' },
    { image: 'https://placehold.co/300x77', title: 'Título 2', link: '#' },
    { image: 'https://placehold.co/300x77', title: 'Título 3', link: '#' },
    { image: 'https://placehold.co/300x77', title: 'Título 4', link: '#' },
    { image: 'https://placehold.co/300x77', title: 'Título 5', link: '#' },
    { image: 'https://placehold.co/300x77', title: 'Título 6', link: '#' },
  ],
};

/** Largura de cada selo na réplica (a altura é sempre 50). */
const LARGURAS = [306, 306, 194, 196, 223, 215];

export default function RulerFooter() {
  const { seals } = useConteudoDaSecao(MOCK);
  const lista = seals.filter(s => s.image).slice(0, 6);
  if (!lista.length) return null;

  return (
    <section className={styles.rulerFooter} data-role="rl-root">
      <div className={`${styles.rulerContainer} component__container`}>
        {lista.map((s, i) => (
          <div key={i} className={styles.rulerContent} data-role="rl-item">
            <a href={s.link || '#'}>
              <img data-role="rl-image"
                alt={s.title ?? ''}
                decoding="async"
                src={s.image}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                height="50"
                width={LARGURAS[i]}
                loading={i > 2 ? 'lazy' : undefined}
              />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
RulerFooter.conteudoPadrao = MOCK;
