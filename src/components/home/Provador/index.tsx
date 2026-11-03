'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  variaveisDoVisual,
  type TemplateDoProvador,
  type VisualDoTemplate,
} from '@/utils/provador';
import { rastrear } from '@/lib/tracking';

import styles from './index.module.css';

export type Provado = TemplateDoProvador & { visual: VisualDoTemplate };

type Estado = {
  /** Os templates com cara própria, na ordem do leque. */
  provaveis: Provado[];
  atual: Provado;
  indice: number;
  /** O visitante escolheu: a troca automática para. */
  escolhido: boolean;
  provar: (indice: number) => void;
  /** Troca automática, enquanto ninguém escolheu. */
  avancar: () => void;
};

const Contexto = createContext<Estado | null>(null);

/** O template provado agora, ou `null` fora da home (ex.: `/privacidade`). */
export function useProvador(): Estado | null {
  return useContext(Contexto);
}

/**
 * O provador da home: guarda qual template está provado e veste a página
 * inteira com ele — as variáveis `--p-*` (utils/provador.ts) vão no envelope,
 * então header, seções e rodapé mudam juntos sem passar o estado adiante.
 */
export default function Provador({
  provaveis,
  children,
}: {
  provaveis: Provado[];
  children: React.ReactNode;
}) {
  const [indice, setIndice] = useState(0);
  const [escolhido, setEscolhido] = useState(false);

  const provar = useCallback(
    (i: number) => {
      setIndice(i);
      setEscolhido(true);
      rastrear('trocar_template_hero', { template: provaveis[i]?.slug });
    },
    [provaveis]
  );
  const avancar = useCallback(
    () => setIndice(i => (i + 1) % provaveis.length),
    [provaveis.length]
  );

  const atual = provaveis[indice];
  const estado = useMemo(
    () => ({ provaveis, atual, indice, escolhido, provar, avancar }),
    [provaveis, atual, indice, escolhido, provar, avancar]
  );

  // O fundo da página vive no <body> também: o Lenis e o overscroll do
  // navegador mostram o body além do envelope.
  useEffect(() => {
    document.body.style.backgroundColor = atual.visual.fundo;
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [atual]);

  return (
    <Contexto.Provider value={estado}>
      <div
        className={styles.envelope}
        style={variaveisDoVisual(atual.visual) as React.CSSProperties}
        data-provado={atual.slug}
      >
        {children}
      </div>
    </Contexto.Provider>
  );
}
