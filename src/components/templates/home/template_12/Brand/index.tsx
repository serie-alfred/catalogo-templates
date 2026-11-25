import React from 'react';

import { FONTES_12 } from '@/components/templates/common/template_12/Spot';
import { useConteudoDaSecao } from '@/hooks/useConteudoDaSecao';

import styles from './index.module.css';

/**
 * Espelha `molecules/Brands12` do faststore.starter (família 12, Suave; desenho `Brand12` /
 * `Brand12-mobile`). Mesmo markup, mesmas classes, mesmos `data-role` e as mesmas vars de
 * Nível 1; o CSS é derivado do SCSS de lá. Conteúdo = o mock.ts de lá (marcadores no lugar
 * dos nomes, sem logo: vale o nome, com a grafia pela posição).
 */
interface Brands12Brand {
  name?: string;
  url?: string;
  logo?: string;
}

interface Brand12Conteudo {
  title?: string;
  brands: Brands12Brand[];
}

const MOCK: Brand12Conteudo = {
  title: 'Marcas que amamos',
  brands: [
    { name: '[Marca 01]', url: '#' },
    { name: '[Marca 02]', url: '#' },
    { name: '[Marca 03]', url: '#' },
    { name: '[marca 04]', url: '#' },
    { name: '[MARCA 05]', url: '#' },
    { name: '[Marca 06]', url: '#' },
  ],
};

export default function Brand12() {
  const { title, brands } = useConteudoDaSecao(MOCK);
  if (!brands.length) return null;

  return (
    <div className={styles.brands12Box}>
      <section className={styles.brands12} aria-label={title || 'Marcas'} data-role="br-root">
        <link rel="stylesheet" href={FONTES_12} />
        <div className={styles.inner}>
          {title && (
            <h2 className={styles.title} data-role="br-title">
              {title}
            </h2>
          )}
          <ul className={styles.list}>
            {brands.map((b, i) => (
              <li key={i} className={styles.item} data-role="br-item">
                <a className={styles.pill} href={b.url || '#'}>
                  {b.logo ? (
                    <img className={styles.logo} src={b.logo} alt={b.name ?? ''} height={32} loading="lazy" decoding="async" />
                  ) : (
                    b.name
                  )}
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
Brand12.conteudoPadrao = MOCK;
