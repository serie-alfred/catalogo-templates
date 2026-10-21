'use client';

import React, { useId, useState } from 'react';

import { FONTES_10 } from '@/components/templates/common/template_10/Spot';

import styles from './index.module.css';

/**
 * Espelha `molecules/ProductDescription10` do faststore.starter (família 10, Varejo;
 * desenho `ProductDescription10`): cartão com abas (Descrição · Especificações
 * técnicas · Garantia), "O que vem na caixa" e o quadro de aviso ao lado. Mesmo
 * markup, classes e `data-role`; o CSS é derivado do SCSS de lá. Conteúdo = o
 * `mock.ts` de lá (rótulos + produto de exemplo), já resolvido como o starter
 * resolve: a marca na 1ª linha da ficha e a especificação "O que vem na caixa" fora
 * dela, na caixa ao lado. Sai o `usePDP`; a aba inicial é a de especificações.
 */

type Tab = 'description' | 'specs' | 'extra';

const DESCRIPTION_HTML =
  '<p>Smartphone X5 com tela AMOLED de 6,7", processador octa-core e 8 GB de RAM. A bateria de 5.000 mAh segura o dia inteiro, e a câmera tripla de 50 MP registra bem até com pouca luz.</p>' +
  '<p>Conexão 5G, Wi-Fi, Bluetooth 5.3 e NFC para pagar por aproximação.</p>';

const SPECS: Array<{ name: string; value: string }> = [
  { name: 'Marca', value: '[Marca 01]' },
  { name: 'Modelo', value: 'X5' },
  { name: 'Tela', value: '6,7" AMOLED' },
  { name: 'Resolução', value: '2400 × 1080' },
  { name: 'Processador', value: 'Octa-core' },
  { name: 'Memória RAM', value: '8 GB' },
  { name: 'Armazenamento', value: '128 GB' },
  { name: 'Câmera traseira', value: '50 MP + 8 MP + 2 MP' },
  { name: 'Bateria', value: '5.000 mAh' },
  { name: 'Conectividade', value: '5G, Wi-Fi, Bluetooth 5.3, NFC' },
  { name: 'Dimensões', value: '16,4 × 7,6 × 0,8 cm' },
  { name: 'Peso', value: '190 g' },
];

const BOX_ITEMS = ['Smartphone X5', 'Cabo USB-C', 'Ferramenta para chip', 'Guia rápido'];

const MOCK = {
  extraTabText: '12 meses de garantia pelo fabricante, contados a partir da data da nota fiscal.',
  specsTitle: 'Ficha técnica',
  boxTitle: 'O que vem na caixa',
  infoTitle: 'Garantia',
  infoText: '12 meses pelo fabricante.',
};

const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'description', label: 'Descrição' },
  { id: 'specs', label: 'Especificações técnicas' },
  { id: 'extra', label: 'Garantia' },
];

export default function ProductDescription10() {
  const uid = useId();
  const [current, setCurrent] = useState<Tab>('specs');

  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const next = TABS[(i + (e.key === 'ArrowRight' ? 1 : TABS.length - 1)) % TABS.length];
    setCurrent(next.id);
    (e.currentTarget.ownerDocument ?? document).getElementById(`${uid}-tab-${next.id}`)?.focus();
  };

  return (
    <div className={styles.productDescription10Box}>
      <section className={styles.productDescription10} aria-label="Descrição" data-role="pd-root">
        <link rel="stylesheet" href={FONTES_10} />
        <div className={styles.inner}>
          <div className={styles.card}>
            <div className={styles.tabs} role="tablist" aria-label="Informações do produto" data-role="pd-tabs">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  id={`${uid}-tab-${t.id}`}
                  type="button"
                  role="tab"
                  className={`${styles.tab}${t.id === current ? ` ${styles.tabOn}` : ''}`}
                  aria-selected={t.id === current}
                  aria-controls={`${uid}-panel`}
                  tabIndex={t.id === current ? 0 : -1}
                  onClick={() => setCurrent(t.id)}
                  onKeyDown={e => onKey(e, i)}
                  data-role="pd-tab"
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className={styles.body}>
              <div
                id={`${uid}-panel`}
                className={styles.main}
                role="tabpanel"
                aria-labelledby={`${uid}-tab-${current}`}
                data-role="pd-panel"
              >
                {current === 'description' && (
                  <div className={styles.html} dangerouslySetInnerHTML={{ __html: DESCRIPTION_HTML }} />
                )}
                {current === 'specs' && (
                  <>
                    <h3 className={styles.panelTitle}>{MOCK.specsTitle}</h3>
                    <dl className={styles.specs} data-role="pd-specs">
                      {SPECS.map(s => (
                        <div key={s.name} className={styles.row}>
                          <dt>{s.name}</dt>
                          <dd>{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                )}
                {current === 'extra' && <p className={styles.extra}>{MOCK.extraTabText}</p>}
              </div>

              <aside className={styles.aside}>
                <div className={styles.box} data-role="pd-box">
                  <h3 className={styles.boxTitle}>{MOCK.boxTitle}</h3>
                  <ul className={styles.boxList}>
                    {BOX_ITEMS.map(item => (
                      <li key={item}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                          <path d="m5 12 5 5 9-10" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.info} data-role="pd-info">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M12 3 5 6v6c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <div className={styles.infoCopy}>
                    <strong className={styles.infoTitle}>{MOCK.infoTitle}</strong>
                    <span className={styles.infoText}>{MOCK.infoText}</span>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
