import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories10` do faststore.starter (família 10, Varejo; desenho
 * `Categories10` / `Categories10-mobile`). Mesmo markup, mesmas classes, mesmos `data-role`
 * e as mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá,
 * sem arte (vale o fundo de placeholder do CSS).
 */
interface Categories10Item {
  name?: string;
  url?: string;
  image?: string;
  imageAlt?: string;
}

interface Categories10Props {
  title?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  categories?: Categories10Item[];
}

// Conteúdo do mock.ts do starter.
// Textos do desenho `Categories10` (8 departamentos) + 2 a mais, para o trilho rolar e as
// setas terem o estado do desenho (anterior parada, próxima ativa). Sem foto: o desenho
// também não tem (vale o placeholder).
const dep = (name: string, url: string) => ({ name, url, imageAlt: '' });

const MOCK: Categories10Props = {
  title: 'Departamentos',
  viewAllLabel: 'Ver todos',
  viewAllUrl: '/s',
  categories: [
    dep('Celulares', '/celulares'),
    dep('Informática', '/informatica'),
    dep('TV e Vídeo', '/tv-e-video'),
    dep('Eletrodomésticos', '/eletrodomesticos'),
    dep('Áudio', '/audio'),
    dep('Games', '/games'),
    dep('Casa e Cozinha', '/casa-e-cozinha'),
    dep('Esporte', '/esporte'),
    dep('Beleza', '/beleza'),
    dep('Brinquedos', '/brinquedos'),
  ],
};

const Chevron = ({ dir, size }: { dir: 'prev' | 'next'; size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={size > 18 ? 2 : 2.2}
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'm9 6 6 6-6 6' : 'm15 6-6 6 6 6'} />
  </svg>
);

export default function Categories10() {
  const { title, viewAllLabel, viewAllUrl, categories = [] } = MOCK;
  const railRef = useRef<HTMLUListElement>(null);
  const [inicio, setInicio] = useState(true);
  const [fim, setFim] = useState(true);

  const medir = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setInicio(el.scrollLeft <= 1);
    setFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, [medir, categories.length]);

  const passo = (dir: 1 | -1) => {
    const el = railRef.current;
    if (el)
      el.scrollBy({
        left: dir * el.clientWidth,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
          ? 'auto'
          : 'smooth',
      });
  };

  if (!categories.length) return null;

  return (
    <div className={styles.categories10Box}>
      <section
        className={styles.categories10}
        aria-label={title || 'Departamentos'}
        data-role="ct-root"
      >
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.head}>
            {title && (
              <h2 className={styles.title} data-role="ct-title">
                {title}
              </h2>
            )}
            <div className={styles.actions}>
              {viewAllLabel && (
                <a
                  className={styles.viewAll}
                  href={viewAllUrl || '#'}
                  data-role="ct-view-all"
                >
                  {viewAllLabel}
                  <Chevron dir="next" size={18} />
                </a>
              )}
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowPrev}`}
                onClick={() => passo(-1)}
                disabled={inicio}
                aria-label="Departamentos anteriores"
              >
                <Chevron dir="prev" size={20} />
              </button>
              <button
                type="button"
                className={`${styles.arrow} ${styles.arrowNext}`}
                onClick={() => passo(1)}
                disabled={fim}
                aria-label="Próximos departamentos"
              >
                <Chevron dir="next" size={20} />
              </button>
            </div>
          </div>
          <ul ref={railRef} className={styles.rail} onScroll={medir}>
            {categories.map((c, i) => (
              <li key={i} className={styles.item} data-role="ct-item">
                <a className={styles.card} href={c.url || '#'}>
                  <span className={styles.media}>
                    {c.image && (
                      <img
                        src={c.image}
                        alt={c.imageAlt || ''}
                        width={240}
                        height={240}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </span>
                  <span className={styles.name}>{c.name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
