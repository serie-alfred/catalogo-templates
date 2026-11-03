'use client';

import React, { useEffect } from 'react';

import styles from './index.module.css';

const CHAVE = 'etemas-intro-vista';
const DURACAO_MS = 2700;

/**
 * Liga a intro ANTES da primeira pintura: roda no `<head>` do layout, sem
 * esperar o React. Só na home, só na primeira visita e nunca com movimento
 * reduzido; marca `<html data-intro="rodando">` (e já grava que foi vista,
 * para não repetir nem se a pessoa sair no meio), que é o que mostra a
 * camada e segura as animações de entrada do hero (Hero/index.module.css).
 * O próprio script encerra em 3,5 s se o React não chegar a encerrar antes.
 */
export const SCRIPT_DA_INTRO = `try{if(location.pathname==='/'&&!localStorage.getItem('${CHAVE}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!/[?&]tier=baixo/.test(location.search)){var r=document.documentElement;r.dataset.intro='rodando';localStorage.setItem('${CHAVE}','1');setTimeout(function(){if(r.dataset.intro==='rodando')r.dataset.intro='fim'},3500)}}catch(e){}`;

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

/**
 * A intro da primeira visita, ~2,7 s: o E da marca se monta com as seções de
 * uma loja, o módulo do banner troca de cor passando pelos templates, o nome
 * sobe e a camada sai de cena revelando a home. "Pular" e Esc encerram na hora.
 */
export default function Intro() {
  useEffect(() => {
    const raiz = document.documentElement;
    if (raiz.dataset.intro !== 'rodando') return;
    const encerrar = () => {
      if (raiz.dataset.intro === 'rodando') raiz.dataset.intro = 'fim';
    };
    const fim = setTimeout(encerrar, DURACAO_MS);
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && encerrar();
    window.addEventListener('keydown', aoTeclar);
    const pular = document.querySelector('[data-intro-pular]');
    pular?.addEventListener('click', encerrar);
    return () => {
      clearTimeout(fim);
      window.removeEventListener('keydown', aoTeclar);
      pular?.removeEventListener('click', encerrar);
    };
  }, []);

  return (
    <div className={styles.intro} data-intro-camada="">
      <div className={styles.palco} aria-hidden>
        <span className={styles.marca}>
          <span className={styles.espinha} />
          <span className={styles.secoes}>
            <span className={styles.header} />
            <span className={styles.banner}>
              <span
                className={styles.modulo}
                style={
                  {
                    '--c0': ACENTOS[0],
                    '--c1': ACENTOS[1],
                    '--c2': ACENTOS[2],
                    '--c3': ACENTOS[3],
                    '--c4': ACENTOS[4],
                    '--c5': ACENTOS[5],
                    '--c6': ACENTOS[6],
                    '--c7': ACENTOS[7],
                  } as React.CSSProperties
                }
              />
            </span>
            <span className={styles.vitrine}>
              <span />
              <span />
              <span />
            </span>
          </span>
        </span>
        <span className={styles.nome}>
          <span>e-temas</span>
        </span>
        <span className={styles.frase}>
          <span>Templates prontos para VTEX FastStore, Wake e Tray</span>
        </span>
      </div>
      <button type="button" className={styles.pular} data-intro-pular="">
        Pular
      </button>
    </div>
  );
}
