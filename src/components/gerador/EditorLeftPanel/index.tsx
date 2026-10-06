'use client';

import React from 'react';

import { useLayout } from '@/context/LayoutContext';
import PanelComponents from './PanelComponents';
import PanelTypography from './PanelTypography';
import PanelGlobalColors from './PanelGlobalColors';
import PanelBrandAssets from './PanelBrandAssets';
import PlatformSelect from '../PlatformSelect';

import styles from './index.module.css';

/** O que cada destino quer dizer para o checkout, que não tem seções. */
const DICA_DO_CHECKOUT: Record<string, string> = {
  componentes: '',
  variaveis:
    'No checkout, estas cores são o nível 2: todo papel sem valor próprio (painel da direita) herda daqui.',
  tipografia:
    'A fonte dos títulos vale no checkout enquanto o papel "Fonte" ficar sem valor. O checkout baixa os pesos 300 a 700.',
  identidade:
    'O logo vai no header do checkout, reduzido a até 280 × 64 px (SVG e URL https passam como estão).',
};

/**
 * Painel esquerdo. O que ele mostra é decidido pelo `railTarget`; ao contrário
 * da antiga dock, ele está SEMPRE aberto — não existe estado fechado.
 *
 * O cabeçalho é mais alto em "componentes" porque só ali ele carrega a linha de
 * plataforma, então a altura NÃO pode virar uma linha do grid do shell.
 */
export default function EditorLeftPanel({
  className,
  inert,
}: {
  className?: string;
  /** Recolhido: fica no DOM (para a transição ter o que animar) mas fora do
      alcance de Tab e dos leitores de tela. */
  inert?: boolean;
}) {
  const {
    railTarget,
    platform,
    showPlatformError,
    changePlatform,
    editorMode,
  } = useLayout();

  // No checkout não há "Componentes" (a estrutura é fixa): o rail o esconde, e
  // um `railTarget` que ainda aponte para lá cai em "Variáveis".
  const noCheckout = editorMode === 'checkout';
  const destino =
    noCheckout && railTarget === 'componentes' ? 'variaveis' : railTarget;
  const isComponentes = destino === 'componentes';

  return (
    <aside
      className={`${styles.panel} ${className ?? ''}`}
      aria-label="Painel de edição"
      inert={inert}
    >
      <header className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Editor de Temas</span>
          <span className={styles.version}>V1.2</span>
        </div>

        {/* No checkout não há "Componentes", onde o seletor mora: sem ele aqui
            o modo Checkout não teria como trocar de plataforma — e trocar SAI
            do modo (checkout é só VTEX, `modeForPlatform`). Aprovado no gate0
            #27 do checkout-vtex. */}
        {(isComponentes || noCheckout) && (
          <PlatformSelect
            value={platform}
            showError={showPlatformError}
            onChange={changePlatform}
          />
        )}
      </header>

      <div className={`${styles.body} ed-scroll`}>
        {noCheckout && (
          <p className={styles.checkoutHint} role="note">
            {DICA_DO_CHECKOUT[destino]}
          </p>
        )}

        {isComponentes && <PanelComponents />}

        {destino === 'variaveis' && <PanelGlobalColors />}

        {destino === 'tipografia' && <PanelTypography />}

        {destino === 'identidade' && <PanelBrandAssets />}
      </div>
    </aside>
  );
}
