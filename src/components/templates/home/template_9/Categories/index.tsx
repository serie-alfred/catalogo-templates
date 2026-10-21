import React, { useCallback, useEffect, useRef, useState } from 'react';

import { FONTES_09 } from '@/components/templates/common/template_9/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/Categories09` do faststore.starter (família 09, Editorial;
 * desenho `Categories09`). Mesmo markup, mesmas classes, mesmos `data-role` e as
 * mesmas vars de Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de
 * lá: cinco categorias sem foto (vale o fundo de placeholder da mídia).
 */

const CATEGORIAS = ['Vestidos', 'Camisas', 'Alfaiataria', 'Tricô', 'Acessórios'];

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
  }, [medir]);

  const passo = (dir: 1 | -1) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  return (
    <div className={styles.categories09Box}>
      <section className={styles.categories09} aria-label="Categorias" data-role="ct-root">
        <link rel="stylesheet" href={FONTES_09} />
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 className={styles.title} data-role="ct-title">
              Compre por <em>categoria</em>
            </h2>
            <div className={styles.actions}>
              <a className={styles.viewAll} href="#" data-role="ct-view-all">
                <span>Ver todas</span>
              </a>
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
            {CATEGORIAS.map(nome => (
              <li key={nome} className={styles.item} data-role="ct-item">
                <a className={styles.card} href="#">
                  <span className={styles.media} />
                  <span className={styles.label}>
                    <span className={styles.name}>{nome}</span>
                    <span className={styles.see}>Ver</span>
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
