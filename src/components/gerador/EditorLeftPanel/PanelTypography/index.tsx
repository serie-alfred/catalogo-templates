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
    fontTertiary,
    setFontTertiary,
  } = useLayout();

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
    {
      label: 'Defina a fonte terciária',
      cssVariable: 'font-tertiary',
      value: fontTertiary,
      onChange: setFontTertiary,
    },
  ];

  return (
    <div>
      {fields.map(field => (
        <section key={field.cssVariable} className={styles.block}>
          <FontSelector
            label={field.label}
            cssVariable={field.cssVariable}
            selectedFont={field.value}
            onFontChange={field.onChange}
          />
        </section>
      ))}
    </div>
  );
}
