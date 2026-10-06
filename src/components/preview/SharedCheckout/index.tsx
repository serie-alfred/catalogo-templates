'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { PreviewSnapshot } from '@/lib/previewStore';
import CheckoutFrame from '@/components/gerador/CheckoutFrame';
import PreviewNav from '../PreviewNav';
import {
  reduzirLogo,
  variaveisGlobais,
  type CheckoutEtapa,
} from '@/utils/checkout';

import styles from './index.module.css';

/**
 * O checkout do snapshot, fora do editor: o MESMO CheckoutFrame do canvas,
 * dirigido pelos valores gravados — sem `useLayoutGenerator`, que hidrataria o
 * localStorage de quem abriu o link.
 *
 * O tamanho segue a janela: até 767px (o breakpoint do modelo) mostra a
 * fixture de 390, acima a de 1280.
 */
export default function SharedCheckout({
  snapshot,
  etapa,
  id,
}: {
  snapshot: PreviewSnapshot;
  etapa: CheckoutEtapa;
  id: string;
}) {
  const [mobile, setMobile] = useState<boolean | null>(null);
  // A redução é assíncrona: até voltar, o frame não se declara pronto.
  const [logo, setLogo] = useState({ de: '', valor: '' });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const atualizar = () => setMobile(mq.matches);
    atualizar();
    mq.addEventListener('change', atualizar);
    return () => mq.removeEventListener('change', atualizar);
  }, []);

  useEffect(() => {
    let vivo = true;
    reduzirLogo(snapshot.logo)
      .then(v => vivo && setLogo({ de: snapshot.logo, valor: v }))
      .catch(() => vivo && setLogo({ de: snapshot.logo, valor: '' }));
    return () => {
      vivo = false;
    };
  }, [snapshot.logo]);

  const level2 = useMemo(
    () => variaveisGlobais(snapshot.colors, snapshot.fonts),
    [snapshot.colors, snapshot.fonts]
  );
  const level1 = useMemo(
    () => snapshot.checkout?.variables ?? {},
    [snapshot.checkout]
  );

  return (
    <div className={styles.page}>
      {/* Só depois do mount: o tamanho depende da janela, e o iframe não pode
          nascer com a fixture errada e trocar logo em seguida. */}
      {mobile !== null && (
        <CheckoutFrame
          etapa={etapa}
          mobile={mobile}
          level2={level2}
          level1={level1}
          logo={logo.valor}
          logoPendente={logo.de !== snapshot.logo}
        />
      )}
      <PreviewNav id={id} activeSlug={`checkout/${etapa}`} temCheckout />
    </div>
  );
}
