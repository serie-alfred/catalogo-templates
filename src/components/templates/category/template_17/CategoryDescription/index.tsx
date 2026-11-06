'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/CategorySeoFaq17` do faststore.starter (família 17, Pet; desenho
 * `CategoryDescription17`): à esquerda a chamada "Guia de compra" com a patinha, o título em
 * Bricolage, os parágrafos e "Ler mais"; à direita "Perguntas frequentes" num cartão claro com
 * acordeão (a 1ª aberta). Mesmo markup, classes e `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá o texto e as perguntas vêm dos banners do Intelligent Search (áreas "one" e "two"); aqui são
 * o exemplo do mock.ts de lá, já separados em título, blocos e pares pergunta/resposta (o `<h2>`
 * inicial vira o título, como o `separar` de lá faz).
 */
const FONTES =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap';

/** Blocos visíveis com o texto recolhido (desktop · mobile), como o desenho. */
const VISIVEIS_DESK = 2;
const VISIVEIS_MOB = 1;

const EYEBROW = 'Guia de compra';
const FAQ_TITLE = 'Perguntas frequentes';
const TITULO = 'Como escolher a ração certa para o seu pet';
const PARAGRAFOS = [
  'A ração ideal depende da espécie, da idade, do porte e do nível de atividade. Filhotes precisam de mais energia e cálcio; adultos castrados, de menos calorias; pets sênior, de proteína de fácil digestão e apoio às articulações.',
  'Use os filtros de categoria, marca, porte e preço para chegar mais rápido à opção certa e compare a tabela de níveis de garantia na página de cada produto.',
  'Na troca de ração, misture a nova à antiga aos poucos, ao longo de 7 dias, e mantenha água fresca sempre à disposição.',
];
const PERGUNTAS = [
  {
    q: 'Qual ração é ideal para o porte do meu cão?',
    a: 'Confira o peso adulto esperado: até 10 kg é porte pequeno, de 10 a 25 kg é médio e acima disso é grande. A embalagem traz a indicação de porte e a quantidade diária por peso.',
  },
  {
    q: 'Como fazer a troca de ração sem desconforto?',
    a: 'Faça a transição em 7 dias, aumentando a proporção da ração nova a cada dia, até substituir a antiga por completo.',
  },
  {
    q: 'Ração úmida substitui a seca?',
    a: 'Pode substituir, desde que seja completa e balanceada. Muitos tutores combinam as duas: a úmida ajuda na hidratação e a seca, na saúde dos dentes.',
  },
  {
    q: 'Quanto tempo dura um pacote de 15 kg?',
    a: 'Depende do peso do pet e da porção diária indicada na embalagem. Um cão de 20 kg, por exemplo, consome um pacote de 15 kg em cerca de 50 dias.',
  },
  {
    q: 'Posso retirar o pedido na loja no mesmo dia?',
    a: 'Sim, nas lojas com retirada disponível. Escolha a opção de retirada no carrinho e aguarde o aviso de pedido pronto.',
  },
];

const Ico = ({
  size,
  w = 2,
  children,
}: {
  size: number;
  w?: number;
  children: React.ReactNode;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

export default function CategoryDescription17() {
  const [aberto, setAberto] = useState(false);
  const [blocos, setBlocos] = useState(0);
  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  // Quantos blocos o texto tem: decide se o "Ler mais" aparece em cada tamanho.
  const textoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setBlocos(textoRef.current?.children.length ?? 0);
  }, []);

  const maisDesk = blocos > VISIVEIS_DESK;
  const maisMob = blocos > VISIVEIS_MOB;
  const moreCls = aberto
    ? ''
    : `${maisDesk ? '' : ` ${styles.moreNoDesk}`}${maisMob ? '' : ` ${styles.moreNoMob}`}`;

  return (
    <div className={styles.categorySeoFaq17Box}>
      <section
        className={styles.categorySeoFaq17}
        aria-label={TITULO}
        data-role="cd-root"
      >
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.box}>
          <div className={styles.about} data-role="cd-about">
            <span className={styles.eyebrow} data-role="cd-eyebrow">
              <Ico size={18} w={1.8}>
                <ellipse cx="5.5" cy="10" rx="2" ry="2.6" />
                <ellipse cx="9.5" cy="5.5" rx="2" ry="2.6" />
                <ellipse cx="14.5" cy="5.5" rx="2" ry="2.6" />
                <ellipse cx="18.5" cy="10" rx="2" ry="2.6" />
                <path d="M12 11.5c-3 0-6 3.6-6 6.2 0 1.9 1.6 2.8 3.2 2.3.9-.3 1.8-.6 2.8-.6s1.9.3 2.8.6c1.6.5 3.2-.4 3.2-2.3 0-2.6-3-6.2-6-6.2z" />
              </Ico>
              {EYEBROW}
            </span>
            <h2 className={styles.aboutTitle} data-role="cd-title">
              {TITULO}
            </h2>
            <div
              id={`${uid}-texto`}
              ref={textoRef}
              className={`${styles.text}${aberto ? '' : ` ${styles.textClamped}`}`}
              data-role="cd-text"
            >
              {PARAGRAFOS.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {(maisDesk || maisMob || aberto) && (
              <button
                type="button"
                className={`${styles.more}${moreCls}`}
                aria-expanded={aberto}
                aria-controls={`${uid}-texto`}
                onClick={() => setAberto(v => !v)}
                data-role="cd-more"
              >
                {aberto ? 'Ler menos' : 'Ler mais'}
                <Ico size={16}>
                  <path d={aberto ? 'm6 15 6-6 6 6' : 'm6 9 6 6 6-6'} />
                </Ico>
              </button>
            )}
          </div>

          <div className={styles.faq} data-role="cd-faq">
            <h2 className={styles.faqTitle}>{FAQ_TITLE}</h2>
            <div className={styles.faqList}>
              {PERGUNTAS.map((p, i) => {
                const on = faqAberta === i;
                return (
                  <div
                    key={i}
                    className={`${styles.faqItem}${on ? ` ${styles.faqOpen}` : ''}`}
                    data-role="cd-faq-item"
                  >
                    <h3 className={styles.faqHeading}>
                      <button
                        type="button"
                        id={`${uid}-q${i}`}
                        className={styles.question}
                        aria-expanded={on}
                        aria-controls={`${uid}-a${i}`}
                        onClick={() => setFaqAberta(on ? null : i)}
                        data-role="cd-question"
                      >
                        <span>{p.q}</span>
                        <span className={styles.sign} aria-hidden="true">
                          <Ico size={16}>
                            <path d={on ? 'M5 12h14' : 'M12 5v14M5 12h14'} />
                          </Ico>
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`${uid}-a${i}`}
                      role="region"
                      aria-labelledby={`${uid}-q${i}`}
                      className={styles.answer}
                      hidden={!on}
                      data-role="cd-answer"
                    >
                      <p>{p.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
