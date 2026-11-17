'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useLayout } from '@/context/LayoutContext';

import styles from './index.module.css';

/** Os acentos dos templates, os mesmos da intro da home (home/Intro). */
const ACENTOS = [
  '#c9a961',
  '#ffc93c',
  '#ff2d4f',
  '#c8c6ff',
  '#f4dcd6',
  '#ff4f00',
  '#ffcf24',
  '#e9a27f',
];
const CORES = Object.fromEntries(
  ACENTOS.map((c, i) => [`--c${i}`, c])
) as React.CSSProperties;

/** O E precisa de ~0,9 s para se montar: abaixo disso a camada piscaria. */
const MINIMO_MS = 1100;
/** O tempo da saída (`sai` no CSS). */
const SAIDA_MS = 500;
/** Rede que nunca responde não prende o editor atrás da camada. */
const MAXIMO_MS = 15000;

/**
 * Liga a camada ANTES da primeira pintura quando a URL traz um tema salvo
 * (`?preview=<id>`, o "Editar" do /p): o editor leva alguns segundos para
 * hidratar e, nesse intervalo, mostrava o canvas vazio, como se o tema tivesse
 * sumido. Mesmo truque da intro da home (home/Intro): marca o `<html>` e o CSS
 * mostra a camada, que o React depois assume.
 */
export const SCRIPT_DO_CARREGANDO = `try{if(/[?&]preview=/.test(location.search))document.documentElement.dataset.carregandoTema=String(Date.now())}catch(e){}`;

/**
 * A intro da home (o E se montando com as seções de uma loja, o banner trocando
 * de cor pelos templates) enquanto o editor abre um conteúdo salvo: o "Editar"
 * de um preview (`?preview=<id>`) e o "Abrir" dos Temas salvos. Os dois buscam
 * no servidor e marcam `carregandoExterno`.
 *
 * Fica no ar pelo menos `MINIMO_MS`, para a montagem terminar, e sai subindo,
 * como a intro. Com movimento reduzido, só a marca parada e o texto.
 */
export default function CarregandoTema() {
  const { carregandoExterno } = useLayout();
  const [fase, setFase] = useState<'fora' | 'rodando' | 'saindo'>('fora');
  const inicio = useRef(0);

  // O script do <head> já ligou a camada: o React assume daqui.
  useEffect(() => {
    const raiz = document.documentElement;
    const desde = Number(raiz.dataset.carregandoTema);
    if (!desde) return;
    inicio.current = desde;
    setFase('rodando');
    delete raiz.dataset.carregandoTema;
  }, []);

  useEffect(() => {
    if (carregandoExterno) {
      if (fase === 'fora') inicio.current = Date.now();
      setFase('rodando');
      return;
    }
    if (fase !== 'rodando') return;
    // Ainda não começou a buscar: o `?preview=` sai da URL só no fim do fetch.
    const esperando = /[?&]preview=/.test(window.location.search);
    const resta = esperando
      ? MAXIMO_MS - (Date.now() - inicio.current)
      : Math.max(0, MINIMO_MS - (Date.now() - inicio.current));
    const t = setTimeout(() => setFase('saindo'), Math.max(0, resta));
    return () => clearTimeout(t);
  }, [carregandoExterno, fase]);

  // A saída tem efeito próprio: no mesmo efeito de cima, a troca para 'saindo'
  // limpava o timer que levaria a 'fora', e a camada ficava presa.
  useEffect(() => {
    if (fase !== 'saindo') return;
    const t = setTimeout(() => setFase('fora'), SAIDA_MS);
    return () => clearTimeout(t);
  }, [fase]);

  return (
    <div
      className={styles.camada}
      data-fase={fase}
      role="status"
      aria-live="polite"
    >
      <div className={styles.palco} aria-hidden>
        <span className={styles.marca}>
          <span className={styles.espinha} />
          <span className={styles.secoes}>
            <span className={styles.header} />
            <span className={styles.banner}>
              <span className={styles.modulo} style={CORES} />
            </span>
            <span className={styles.vitrine}>
              <span />
              <span />
              <span />
            </span>
          </span>
        </span>
      </div>
      <span className={styles.frase}>Abrindo o tema salvo…</span>
    </div>
  );
}
