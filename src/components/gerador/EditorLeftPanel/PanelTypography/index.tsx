'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import FontSelector from '../../FontSelector';

import styles from './index.module.css';

/**
 * Tipografia. Os três rótulos e as três variáveis são exatamente os que já
 * existiam na aba "Variáveis Globais" — o Figma usa as mesmas palavras.
 */
export default function PanelTypography() {
  const {
    fontPrimary,
    setFontPrimary,
    fontSecondary,
    setFontSecondary,
    fontItalic,
    setFontItalic,
    editorMode,
  } = useLayout();

  // Na LP os globais são os da loja (D8-04): o mesmo aviso das cores.
  const naLp = editorMode === 'lp';

  // A fonte terciária saiu do painel: nenhum componente a lê (o valor continua no
  // estado e no config, para temas salvos e o generator).
  const fields = [
    {
      label: 'Defina a fonte dos títulos',
      cssVariable: 'font-primary',
      value: fontPrimary,
      onChange: setFontPrimary,
    },
    {
      label: 'Defina a fonte do texto',
      cssVariable: 'font-secondary',
      value: fontSecondary,
      onChange: setFontSecondary,
    },
  ];

  return (
    <div>
      {naLp && (
        <p className={styles.lp} role="status" data-globais-lp="">
          Na LP, as cores e fontes globais são as da loja.
        </p>
      )}
      {fields.map(field => (
        <section key={field.cssVariable} className={styles.block}>
          <h3 className={styles.title}>{field.label}</h3>
          <FontSelector
            label={field.label}
            cssVariable={field.cssVariable}
            selectedFont={field.value}
            onFontChange={field.onChange}
            variant="block"
            disabled={naLp}
          />
        </section>
      ))}
      {/* O itálico do desenho (`--font-italic`): vale para todo destaque em
          itálico dos templates (títulos com <em>, frases), não para a fonte. */}
      <section className={styles.block} data-italico="">
        <h3 className={styles.title}>Itálico nos destaques</h3>
        <label className={styles.italico}>
          <input
            type="checkbox"
            checked={fontItalic !== 'normal'}
            disabled={naLp}
            onChange={e => setFontItalic(e.target.checked ? 'italic' : 'normal')}
          />
          <span>Usar itálico onde o template destaca palavras e títulos</span>
        </label>
        <p className={styles.dica}>
          Desligado, os destaques ficam na mesma fonte, sem itálico.
        </p>
      </section>
    </div>
  );
}
