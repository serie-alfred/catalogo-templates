'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useLayout } from '@/context/LayoutContext';
import { useCheckoutPreview } from '@/hooks/useCheckoutPreview';
import type { ComponentVariable } from '@/data/layoutData';
import {
  CHECKOUT_PROVISORIO,
  MODELO_CHECKOUT,
  PAPEIS_DO_PAINEL,
  PLACEHOLDERS_DO_RODAPE,
  carregarBase,
  comporCheckout,
  logoRecusado,
  valorDeFonte,
  type AvisoCheckout,
} from '@/utils/checkout';
import VariablesList, {
  parseFontFamily,
} from '../ComponentVariablesPanel/VariablesList';

import styles from '../ComponentVariablesPanel/index.module.css';
import local from './index.module.css';

/**
 * O painel direito no modo Checkout: os papéis do `checkout.json` (o nível 1),
 * com a MESMA lista de apresentação do painel de componentes.
 *
 * O estado herdado diz de onde vem AO VIVO: com uma cor global da loja mudando
 * no painel da esquerda, "Herdando de cor primária da marca (#…)" acompanha —
 * a mesma resolução (`resolveTokens` do checkout-vtex) que pinta o canvas. Se a
 * guarda de visibilidade (gate0 #14a/#16) devolveu o papel ao Figma, é isso
 * que ele diz.
 *
 * O aviso do logo sai do MESMO compose do export: o logo que ele não embute
 * (gate0 #17) vai para o arquivo como `{{LOGO_SRC}}`, e o canvas mostra o de
 * exemplo — o painel diz o porquê, em vez de o logo sumir em silêncio.
 *
 * E a nota do rodapé (gate0 #26): razão social, CNPJ e aviso legal aparecem no
 * canvas com texto de exemplo, mas o arquivo sai com os placeholders.
 */
export default function CheckoutVariablesPanel() {
  const {
    checkout,
    setCheckoutVariable,
    resetCheckoutVariables,
    logo,
    logoCheckout,
  } = useLayout();
  const { level2, level1, resolvidos } = useCheckoutPreview();
  const [avisoDoLogo, setAvisoDoLogo] = useState<AvisoCheckout | null>(null);

  useEffect(() => {
    if (!logoCheckout) {
      setAvisoDoLogo(null);
      return;
    }
    let vivo = true;
    carregarBase()
      .then(base => {
        if (!vivo) return;
        const { avisos } = comporCheckout(base, {
          level2,
          level1,
          logo: logoCheckout,
        });
        setAvisoDoLogo(
          logoRecusado(avisos) ??
            avisos.find(a => a.codigo === 'logo-pesado') ??
            null
        );
      })
      .catch(() => vivo && setAvisoDoLogo(null));
    return () => {
      vivo = false;
    };
  }, [logoCheckout, level2, level1]);

  const inheritsTextFor = useCallback(
    (v: ComponentVariable) => {
      const r = resolvidos.get(v.cssVar);
      if (!r) return undefined;
      const valor = v.type === 'font' ? parseFontFamily(r.valor) : r.valor;
      switch (r.fonte) {
        case 'nivel2':
          return `Herdando de ${v.inheritsLabel ?? 'variável global'} (${valor})`;
        case 'derivado':
          return `Herdando: ${v.inheritsLabel ?? 'calculado'} (${valor})`;
        case 'nivel3':
          return `Herdando do padrão do modelo (${valor})`;
        case 'guarda':
          return `Usando a cor do modelo (${valor}) porque a da loja (${r.herdado}) não aparece no fundo`;
        default:
          return undefined;
      }
    },
    [resolvidos]
  );

  const inheritedColorFor = useCallback(
    (v: ComponentVariable) => resolvidos.get(v.cssVar)?.valor ?? v.default,
    [resolvidos]
  );

  return (
    <div className={styles.panel} aria-label="Editar papéis do checkout">
      <p className={local.intro}>
        <strong>Checkout VTEX · {MODELO_CHECKOUT.id}</strong> — cor e fonte de
        cada papel. O que ficar sem valor herda as variáveis globais da loja ou
        o padrão do modelo.
        {!logo && (
          <> Sem logo na Identidade visual, o header mostra o de exemplo.</>
        )}
      </p>
      <p className={local.nota} data-checkout-placeholders="">
        Razão social, CNPJ e aviso legal do rodapé aparecem com texto de
        exemplo. No arquivo entregue, cada um sai como placeholder (
        {PLACEHOLDERS_DO_RODAPE.map((ph, i) => (
          <React.Fragment key={ph}>
            {i > 0 && ', '}
            <code>{ph}</code>
          </React.Fragment>
        ))}
        ), preenchido pelo time antes de subir.
      </p>
      {avisoDoLogo && (
        <p
          className={styles.aviso}
          role="status"
          data-checkout-aviso={avisoDoLogo.codigo}
        >
          {avisoDoLogo.codigo === 'logo-pesado' ? (
            <>
              O logo é pesado: ele vai inteiro no header e em toda página do
              checkout. Um arquivo menor carrega mais rápido.
            </>
          ) : (
            <>
              O logo da Identidade visual não cabe no header do checkout (
              {avisoDoLogo.codigo === 'logo-grande'
                ? 'passa de 100 KB'
                : 'não é imagem nem URL https'}
              ): o arquivo sai com <code>{'{{LOGO_SRC}}'}</code> para o time
              trocar, e a pré-visualização mostra o logo de exemplo.
            </>
          )}
        </p>
      )}
      {CHECKOUT_PROVISORIO && (
        <p className={styles.aviso} role="status">
          Pré-visualização <strong>provisória</strong>: DOM nativo da VTEX
          capturado antes do aval do CSS do modelo, então nem todo papel já tem
          regra que o pinte na tela.
        </p>
      )}

      <div className={styles.body}>
        <VariablesList
          variables={PAPEIS_DO_PAINEL}
          values={checkout.variables}
          onChange={setCheckoutVariable}
          fontValue={valorDeFonte}
          inheritsTextFor={inheritsTextFor}
          inheritedColorFor={inheritedColorFor}
        />
      </div>

      <footer className={styles.footer}>
        <button
          type="button"
          className={styles.resetButton}
          onClick={resetCheckoutVariables}
        >
          Restaurar padrão
        </button>
      </footer>
    </div>
  );
}
