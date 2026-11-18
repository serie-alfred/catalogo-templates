'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import ColorPicker from '../../ColorPicker';
import { razaoDeContraste } from '@/utils/themeStyle';

import styles from './index.module.css';

/**
 * Variáveis globais de cor.
 *
 * São nove das dez que vão no bloco `variables` do config.json, com os rótulos
 * que os `inheritsLabel` das variáveis por componente citam. A "cor secundária"
 * (`--text-secundary-color`) saiu do painel em 16/11/2026: só o contador do
 * minicart do Header03 a lia, e o campo parecia não fazer nada. O valor continua
 * no estado e no config.
 *
 * Três delas são derivadas por luminância do fundo correspondente (limiar YIQ
 * 128 — `contrastOn`, em `src/utils/themeStyle.ts`) e por isso entram
 * como somente-leitura: até aqui apareciam como campos editáveis cuja edição
 * era sobrescrita no toque seguinte em qualquer fundo de marca.
 */
export default function PanelGlobalColors() {
  const {
    colorPrimary,
    setColorPrimary,
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
    editorMode,
  } = useLayout();

  const noop = () => {};

  /* Na LP, os generators não mexem nos tokens globais da loja (decisão de
     18/11/2026, D8-04): a LP herda as cores e fontes da loja publicada. O
     campo trava em vez de sumir, para o lojista ver de onde vem a cor. O
     export continua levando o bloco `variables`, como antes. */
  const naLp = editorMode === 'lp';

  /* Os fundos neutros das seções são hex claros do desenho, sem token (D2-08):
     o texto corrido lê a cor base do texto por cima deles. Abaixo de 3:1
     contra o branco o texto some — o aviso não trava, só conta. */
  const textoSome = razaoDeContraste(colorPrimary, '#ffffff') < 3;

  const fields: {
    label: string;
    color: string;
    setColor: (value: string) => void;
    readOnly?: boolean;
    aviso?: string;
  }[] = [
    {
      label: 'Defina a cor base do texto',
      color: colorPrimary,
      setColor: setColorPrimary,
      aviso: textoSome
        ? 'Com essa cor, o texto some nos fundos claros das seções.'
        : undefined,
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
      {naLp && (
        <p className={styles.lp} role="status" data-globais-lp="">
          Na LP, as cores e fontes globais são as da loja.
        </p>
      )}
      {fields.map(field => (
        <section key={field.label} className={styles.block}>
          <h3 className={styles.title}>{field.label}</h3>
          <ColorPicker
            label={field.label}
            color={field.color}
            setColor={field.setColor}
            readOnly={field.readOnly || naLp}
            variant="block"
          />
          {field.readOnly && (
            <p className={styles.derived}>
              Calculada a partir do fundo correspondente, para garantir
              contraste.
            </p>
          )}
          {field.aviso && !naLp && (
            <p className={styles.aviso} role="status" data-contraste-aviso="">
              {field.aviso}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
