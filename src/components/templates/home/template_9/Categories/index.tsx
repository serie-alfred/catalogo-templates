import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories09` do faststore.starter (família 09, Editorial;
 * desenho `Categories09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá (cinco categorias sem foto: vale o fundo de placeholder da mídia), por baixo
 * do que o CS subir (`useConteudoDaSecao`, campos do schema de lá).
 */

interface Categories09Conteudo {
  title?: string;
  titleEmphasis?: string;
  viewAllLabel?: string;
  viewAllUrl?: string;
  itemLinkLabel?: string;
  categories: { name?: string; url?: string; image?: string; imageAlt?: string }[];
}

const MOCK: Categories09Conteudo = {
  title: 'Compre por',
  titleEmphasis: 'categoria',
  viewAllLabel: 'Ver todas',
  viewAllUrl: '/s',
  itemLinkLabel: 'Ver',
  categories: [
    { name: 'Vestidos', url: '/vestidos' },
    { name: 'Camisas', url: '/camisas' },
    { name: 'Alfaiataria', url: '/alfaiataria' },
    { name: 'Tricô', url: '/trico' },
    { name: 'Acessórios', url: '/acessorios' },
  ],
};

const Seta = ({ dir }: { dir: 'prev' | 'next' }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    aria-hidden="true"
  >
    <path d={dir === 'next' ? 'M5 12h14M13 6l6 6-6 6' : 'M19 12H5M11 6l-6 6 6 6'} />
  </svg>
);

export default function Categories09() {
  const { title, titleEmphasis, viewAllLabel, viewAllUrl, itemLinkLabel, categories } =
    useConteudoDaSecao(MOCK);
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
    const win = railRef.current?.ownerDocument.defaultView ?? window;
    win.addEventListener('resize', medir);
    return () => win.removeEventListener('resize', medir);
  }, [medir, categories.length]);

  const passo = (dir: 1 | -1) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  if (!categories.length) return null;

  return (
    <div className={styles.categories09Box}>
      <section className={styles.categories09} aria-label="Categorias" data-role="ct-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <div className={styles.head}>
            {(title || titleEmphasis) && (
              <h2 className={styles.title} data-role="ct-title">
                {title} {titleEmphasis && <em>{titleEmphasis}</em>}
              </h2>
            )}
            <div className={styles.actions}>
              {viewAllLabel && (
                <a className={styles.viewAll} href={viewAllUrl || '#'} data-role="ct-view-all">
                  <span>{viewAllLabel}</span>
                </a>
              )}
              <button
                type="button"
                className={styles.arrow}
                onClick={() => passo(-1)}
                disabled={inicio}
                aria-label="Categorias anteriores"
              >
                <Seta dir="prev" />
              </button>
              <button
                type="button"
                className={styles.arrow}
                onClick={() => passo(1)}
                disabled={fim}
                aria-label="Próximas categorias"
              >
                <Seta dir="next" />
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
                        alt={c.imageAlt || c.name || ''}
                        width={240}
                        height={300}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                  </span>
                  <span className={styles.label}>
                    <span className={styles.name}>{c.name}</span>
                    {itemLinkLabel && <span className={styles.see}>{itemLinkLabel}</span>}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

/** O mock da seção, para o painel Conteúdo mostrar o valor de partida de cada campo. */
Categories09.conteudoPadrao = MOCK;
