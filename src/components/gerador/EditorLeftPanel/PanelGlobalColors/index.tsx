'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import ColorPicker from '../../ColorPicker';

import styles from './index.module.css';

/**
 * Variáveis globais de cor.
 *
 * São as DEZ que já existiam, com os rótulos que já existiam — o Figma desenha
 * quatro campos, mas os dez valores são o que vai no bloco `variables` do
 * config.json e o que os `inheritsLabel` das variáveis por componente citam.
 *
 * Três delas são derivadas por luminância do fundo correspondente (limiar YIQ
 * 128, useLayoutGenerator: efeito de `getContrastColor`) e por isso entram
 * como somente-leitura: até aqui apareciam como campos editáveis cuja edição
 * era sobrescrita no toque seguinte em qualquer fundo de marca.
 */
export default function PanelGlobalColors() {
  const {
    colorPrimary,
    setColorPrimary,
    colorSecondary,
    setColorSecondary,
    colorTertiary,
    colorPrimaryBackground,
    setColorPrimaryBackground,
    colorSecondaryBackground,
    setColorSecondaryBackground,
    colorTertiaryBackground,
    setColorTertiaryBackground,
    colorPrimaryText,
    colorSecondaryText,
    colorFooter,
    setColorFooter,
    colorFooterText,
    setColorFooterText,
  } = useLayout();

  const noop = () => {};

  const fields = [
    {
      label: 'Defina a cor base do texto',
      color: colorPrimary,
      setColor: setColorPrimary,
    },
    {
      label: 'Defina a cor secundária',
      color: colorSecondary,
      setColor: setColorSecondary,
    },
    {
      label: 'Defina a cor primária da marca',
      color: colorPrimaryBackground,
      setColor: setColorPrimaryBackground,
    },
    {
      label: 'Defina a cor secundária da marca',
      color: colorSecondaryBackground,
      setColor: setColorSecondaryBackground,
    },
    {
      label: 'Defina a cor terciária da marca',
      color: colorTertiaryBackground,
      setColor: setColorTertiaryBackground,
    },
    {
      label: 'Defina a cor primária de contraste da marca',
      color: colorPrimaryText,
      setColor: noop,
      readOnly: true,
    },
    {
      label: 'Defina a cor secundária de contraste da marca',
      color: colorSecondaryText,
      setColor: noop,
      readOnly: true,
    },
    {
      label: 'Defina a cor terciária de contraste da marca',
      color: colorTertiary,
      setColor: noop,
      readOnly: true,
    },
    {
      label: 'Defina a cor do rodapé',
      color: colorFooter,
      setColor: setColorFooter,
    },
    {
      label: 'Defina a cor do texto do rodapé',
      color: colorFooterText,
      setColor: setColorFooterText,
    },
  ];

  return (
    <div>
      {fields.map(field => (
        <section key={field.label} className={styles.block}>
          <h3 className={styles.title}>{field.label}</h3>
          <ColorPicker
            label={field.label}
            color={field.color}
            setColor={field.setColor}
            readOnly={field.readOnly}
            variant="block"
          />
          {field.readOnly && (
            <p className={styles.derived}>
              Calculada a partir do fundo correspondente, para garantir
              contraste.
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
