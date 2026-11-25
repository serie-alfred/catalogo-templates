'use client';
import React from 'react';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';
import styles from './index.module.css';

/** O conteúdo da seção: os campos do `section.schema` do Ruler05. */
interface Ruler05Conteudo {
  benefits: { title?: string; description?: string }[];
}

const MOCK: Ruler05Conteudo = {
  benefits: [
    { title: 'Frete Grátis', description: 'para compras acima de R$199' },
    { title: 'Até 10x sem juros', description: 'em todos os cartões' },
    { title: 'Primeira troca grátis', description: 'sem complicação' },
    { title: 'Suporte 24h', description: 'via WhatsApp' },
  ],
};

export default function Ruler() {
  const { benefits } = useConteudoDaSecao(MOCK);
  if (!benefits.length) return null;

  return (
    <section className={styles.homeRuler} data-role="rl-root">
      <div className={`${styles.rulerContainer} component__container`}>
        <div className={`${styles.swiper}`}>
          <div className={styles.swiper__wrapper}>
            {benefits.map((b, i) => (
              <div
                key={i}
                className={`${styles.swiper__slide} ${styles.rulerItem}`}
                data-role="rl-item"
              >
                <p data-role="rl-title">
                  {b.title}
                  {b.description && (
                    <>
                      <br />
                      <span data-role="rl-desc">{b.description}</span>
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* Botões de navegação */}

          <div className={styles.swiperButtonPrevRuler}></div>
          <div className={styles.swiperButtonNextRuler}></div>
        </div>
      </div>
    </section>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Ruler.conteudoPadrao = MOCK;
