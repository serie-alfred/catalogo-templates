'use client';

import React, { useEffect, useId, useRef, useState } from 'react';

import styles from './index.module.css';

/**
 * Espelha `organisms/CategorySeoFaq16` do faststore.starter (família 16, Infantil; desenho
 * `CategoryDescription16`): à esquerda o título em Fredoka, os parágrafos e "Ler mais"; à direita
 * "Perguntas frequentes" em cartões com acordeão (a 1ª aberta). Mesmo markup, classes e
 * `data-role`; o CSS é derivado do SCSS de lá.
 *
 * Lá o texto e as perguntas vêm dos banners do Intelligent Search (áreas "one" e "two"); aqui são
 * o exemplo do mock.ts de lá, já separados em título, blocos e pares pergunta/resposta.
 */
const FONTES =
  'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&display=swap';

const VISIVEIS_DESK = 2;
const VISIVEIS_MOB = 1;

const FAQ_TITLE = 'Perguntas frequentes';
const TITULO = 'Brinquedos que crescem junto com a criança';
const PARAGRAFOS = [
  'Da primeira pelúcia ao primeiro kit de montar, a seleção de brinquedos da [SUA MARCA] reúne opções para cada fase: estímulo sensorial para os bebês, faz de conta para os pequenos e desafios de lógica para quem já está na escola.',
  'Todos os brinquedos têm selo do Inmetro e indicação de faixa etária na página do produto. Use o filtro de idade para chegar mais rápido no presente certo.',
  'Na dúvida entre dois presentes, fale com o nosso atendimento: a gente ajuda a escolher pela idade e pelo jeito de brincar da criança.',
];
const PERGUNTAS = [
  {
    q: 'Como saber se o brinquedo é para a idade certa?',
    a: 'Cada produto mostra a faixa etária indicada pelo fabricante. Para menores de 3 anos, prefira peças grandes, sem partes pequenas que possam ser engolidas.',
  },
  {
    q: 'Os brinquedos têm certificação do Inmetro?',
    a: 'Sim. Todos os brinquedos vendidos aqui têm o selo do Inmetro, e o número do registro aparece na embalagem.',
  },
  { q: 'Posso trocar um presente?', a: 'Pode. A troca é gratuita em até 30 dias, com o produto na embalagem original e a nota fiscal.' },
  { q: 'As pilhas vêm junto?', a: 'Depende do brinquedo: a página do produto diz se as pilhas acompanham e qual modelo usar.' },
];

const Ico = ({ size, children }: { size: number; children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.8} strokeLinecap="round" aria-hidden="true">
    {children}
  </svg>
);

export default function CategoryDescription16() {
  const [aberto, setAberto] = useState(false);
  const [blocos, setBlocos] = useState(0);
  const [faqAberta, setFaqAberta] = useState<number | null>(0);
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const textoRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setBlocos(textoRef.current?.children.length ?? 0);
  }, []);

  const maisDesk = blocos > VISIVEIS_DESK;
  const maisMob = blocos > VISIVEIS_MOB;
  const moreCls = aberto ? '' : `${maisDesk ? '' : ` ${styles.moreNoDesk}`}${maisMob ? '' : ` ${styles.moreNoMob}`}`;

  return (
    <div className={styles.categorySeoFaq16Box}>
      <section className={styles.categorySeoFaq16} aria-label={TITULO} data-role="cd-root">
        <link rel="stylesheet" href={FONTES} />
        <div className={styles.box}>
          <div className={styles.about} data-role="cd-about">
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
              </button>
            )}
          </div>

          <div className={styles.faq} data-role="cd-faq">
            <h2 className={styles.faqTitle}>{FAQ_TITLE}</h2>
            {PERGUNTAS.map((p, i) => {
              const on = faqAberta === i;
              return (
                <div key={i} className={`${styles.faqItem}${on ? ` ${styles.faqOpen}` : ''}`} data-role="cd-faq-item">
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
      </section>
    </div>
  );
}
